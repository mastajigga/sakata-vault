import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
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

async function updateEntitlements(userId: string) {
  const { data: grants, error: grantsError } = await supabaseAdmin.from("subscription_grants")
    .select("tier, expires_at").eq("user_id", userId).is("revoked_at", null);
  if (grantsError) throw grantsError;
  const { data: profile, error: profileError } = await supabaseAdmin.from("profiles")
    .select("stripe_subscription_id").eq("id", userId).single();
  if (profileError) throw profileError;
  const { data: paid, error: paidError } = await supabaseAdmin.from("chat_subscriptions")
    .select("stripe_subscription_id").eq("user_id", userId);
  if (paidError) throw paidError;
  const entitlements = (grants ?? []).filter(g => !g.expires_at || Date.parse(g.expires_at) > Date.now())
    .map(g => ({ tier: g.tier as string, end: g.expires_at as string | null, status: "manual_grant" }));
  const subscriptionIds = new Set<string>([profile.stripe_subscription_id, ...(paid ?? []).map(s => s.stripe_subscription_id)].filter(Boolean));
  for (const id of subscriptionIds) {
    const subscription = await stripe.subscriptions.retrieve(id);
    const legacy = subscription as Stripe.Subscription & { current_period_start?: number; current_period_end?: number };
    const start = legacy.current_period_start ?? subscription.items.data[0]?.current_period_start;
    const end = legacy.current_period_end ?? subscription.items.data[0]?.current_period_end;
    if (subscription.status === "active" || subscription.status === "past_due") {
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error("Période Stripe invalide");
      // Stripe controls the grace period: past_due remains entitled even after period end.
      if (subscription.status === "past_due" || end * 1000 > Date.now()) {
        entitlements.push({ tier: "premium", end: new Date(end * 1000).toISOString(), status: "active" });
      }
    }
  }
  entitlements.sort((a, b) => (Number(b.tier === "elite") - Number(a.tier === "elite")) ||
    ((b.end ? Date.parse(b.end) : Infinity) - (a.end ? Date.parse(a.end) : Infinity)));
  const entitlement = entitlements[0];
  const { error } = await supabaseAdmin.from("profiles").update({
    subscription_tier: entitlement?.tier ?? "free",
    subscription_status: entitlement?.status ?? "revoked",
    subscription_end_date: entitlement?.end ?? null,
  }).eq("id", userId).select("id").single();
  if (error) throw error;
}

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

  try {
    await updateEntitlements(userId);
  } catch (error) {
    console.error("[subscriptions/grant/profile]", error);
    return NextResponse.json({ error: "Cadeau enregistré, mais synchronisation du profil échouée.", stage: "profile", grant }, { status: 500 });
  }

  // 3. Create in-app notification
  const { error: notificationError } = await supabaseAdmin.from("forum_notifications").insert({
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

  if (notificationError) {
    console.error("[subscriptions/grant/notification]", notificationError);
    return NextResponse.json({ error: "Cadeau accordé, mais notification échouée.", stage: "notification", grant }, { status: 500 });
  }
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

  // A supplied grantId revokes only that gift, never the user's other gifts.
  let query = supabaseAdmin.from("subscription_grants")
    .select("id, revoked_at").eq("user_id", body.userId);
  if (body.grantId) query = query.eq("id", body.grantId);
  const { data: grants, error: readError } = await query;
  if (readError) {
    console.error("[subscriptions/revoke/read]", readError);
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }
  if (!grants?.length) return NextResponse.json({ error: "Aucun cadeau correspondant." }, { status: 404 });

  const revokedAt = new Date().toISOString();
  const { data: revoked, error } = await supabaseAdmin.from("subscription_grants")
    .update({ revoked_at: revokedAt, revoked_by: auth.user.id })
    .eq("user_id", body.userId).in("id", grants.map(g => g.id)).is("revoked_at", null).select("id");
  if (error) {
    console.error("[subscriptions/revoke]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Recalculate also on a retry after a successful revocation and a failed profile write.
  try {
    await updateEntitlements(body.userId);
  } catch (error) {
    console.error("[subscriptions/revoke/profile]", error);
    return NextResponse.json({ error: "Révocation enregistrée, mais synchronisation du profil échouée.", stage: "profile" }, { status: 500 });
  }

  // A stable notification ID makes retries safe. Without a grantId, only gifts
  // revoked by this request are notified, never the user's past revocations.
  const revokedIds = revoked?.length ? revoked.map(g => g.id)
    : body.grantId ? grants.filter(g => g.revoked_at).map(g => g.id) : [];
  for (const grantId of revokedIds) {
    const { error: notificationError } = await supabaseAdmin.from("forum_notifications").upsert({
      id: grantId,
      recipient_id: body.userId,
      actor_id: auth.user.id,
      type: "subscription_revoked",
      metadata: { grant_id: grantId },
    }, { onConflict: "id", ignoreDuplicates: true });
    if (notificationError) {
      console.error("[subscriptions/revoke/notification]", notificationError);
      return NextResponse.json({ error: "Révocation effectuée, mais notification échouée.", stage: "notification" }, { status: 500 });
    }
  }
  return NextResponse.json({ ok: true, revoked: revoked?.length ?? 0 });
}
