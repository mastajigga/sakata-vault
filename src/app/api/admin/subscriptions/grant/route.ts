import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/api/auth-helpers";
import { canManageContent } from "@/lib/constants/business";

export const dynamic = "force-dynamic";

const grantSchema = z.object({
  userId: z.string().uuid(),
  tier: z.enum(["premium", "elite"]).default("premium"),
  /** number of days, or null for unlimited */
  durationDays: z.union([z.number().int().positive().max(3650), z.null()]),
  reason: z.string().min(1).max(500).optional(),
});

const revokeSchema = z.object({
  grantId: z.string().uuid().optional(),
  userId: z.string().uuid(),
});

/**
 * POST /api/admin/subscriptions/grant
 * Body: { userId, tier?, durationDays, reason? }
 * Restricted to admin / manager / temp_admin (canManageContent).
 */
export async function POST(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!canManageContent(auth.profile)) {
    return NextResponse.json({ error: "Réservé aux admins/managers" }, { status: 403 });
  }

  let body: z.infer<typeof grantSchema>;
  try { body = grantSchema.parse(await req.json()); }
  catch (e: any) { return NextResponse.json({ error: e.issues?.[0]?.message || "Paramètres invalides" }, { status: 400 }); }

  const { userId, tier, durationDays, reason } = body;

  // Verify target exists and isn't banned/deleted
  const { data: target, error: targetErr } = await supabaseAdmin
    .from("profiles")
    .select("id, nickname, username, deleted_at")
    .eq("id", userId)
    .single();
  if (targetErr || !target) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (target.deleted_at) return NextResponse.json({ error: "Compte supprimé" }, { status: 400 });

  const expires_at = durationDays === null
    ? null
    : new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  // 1. Insert grant
  const { data: grant, error: grantErr } = await supabaseAdmin
    .from("subscription_grants")
    .insert({
      user_id: userId,
      granted_by: auth.user.id,
      tier,
      expires_at,
      reason: reason ?? null,
    })
    .select()
    .single();
  if (grantErr) {
    console.error("[subscriptions/grant]", grantErr);
    return NextResponse.json({ error: grantErr.message }, { status: 500 });
  }

  // 2. Update profile.subscription_tier so all existing paywall checks see it immediately
  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: tier,
      subscription_status: "manual_grant",
      subscription_end_date: expires_at,
    })
    .eq("id", userId);

  // 3. Create in-app notification
  await supabaseAdmin.from("forum_notifications").insert({
    recipient_id: userId,
    actor_id: auth.user.id,
    type: "subscription_granted",
    metadata: {
      tier,
      expires_at,
      duration_days: durationDays,
      reason: reason ?? null,
      grant_id: grant.id,
    },
  });

  return NextResponse.json({ ok: true, grant });
}

/**
 * DELETE /api/admin/subscriptions/grant
 * Body: { userId, grantId? }
 * Revokes the active grant for a user.
 */
export async function DELETE(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (!canManageContent(auth.profile)) {
    return NextResponse.json({ error: "Réservé aux admins/managers" }, { status: 403 });
  }

  let body: z.infer<typeof revokeSchema>;
  try { body = revokeSchema.parse(await req.json()); }
  catch { return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 }); }

  // Mark all active grants as revoked
  const { error } = await supabaseAdmin
    .from("subscription_grants")
    .update({ revoked_at: new Date().toISOString(), revoked_by: auth.user.id })
    .eq("user_id", body.userId)
    .is("revoked_at", null);
  if (error) {
    console.error("[subscriptions/revoke]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Reset profile to free
  await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: "free",
      subscription_status: "revoked",
      subscription_end_date: null,
    })
    .eq("id", body.userId);

  // Notify user
  await supabaseAdmin.from("forum_notifications").insert({
    recipient_id: body.userId,
    actor_id: auth.user.id,
    type: "subscription_revoked",
    metadata: { revoked_at: new Date().toISOString() },
  });

  return NextResponse.json({ ok: true });
}
