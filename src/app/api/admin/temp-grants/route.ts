import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { TEMP_ADMIN_DURATION_HOURS, canModerate } from "@/lib/constants/business";

const grantSchema = z.object({
  recipient_id: z.string().uuid(),
  reason: z.string().max(500).optional().nullable(),
});

/**
 * Rôle titulaire de l'appelant (pas le rôle effectif : un temp_admin reste temp_admin).
 * Renvoie une réponse d'erreur si le profil ne peut pas être lu.
 */
async function getActorProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_expires_at, temp_admin_original_role")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[temp-grants] actor profile", error);
    return { response: NextResponse.json({ error: "Erreur DB" }, { status: 500 }) };
  }
  return { profile: data };
}

/**
 * GET /api/admin/temp-grants
 * Liste des grants (actifs + historique).
 * Visible par : modérateurs/admins (tout) et le récipiendaire (les siens uniquement).
 * Le client utilise la clé de service (RLS contournée) : le filtrage est fait ici.
 */
export async function GET() {
  const user = await getCurrentAuthUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const actor = await getActorProfile(user.id);
  if (actor.response) return actor.response;
  const seesAll = !!actor.profile && canModerate(actor.profile);

  let query = supabaseAdmin
    .from("temp_admin_grants")
    .select(
      `
      *,
      recipient:profiles!recipient_id (id, username, nickname, avatar_url, role),
      granter:profiles!granted_by (id, username, nickname, avatar_url),
      revoker:profiles!revoked_by (id, username, nickname, avatar_url)
    `
    )
    .order("granted_at", { ascending: false })
    .limit(50);
  if (!seesAll) query = query.eq("recipient_id", user.id);

  const { data, error } = await query;
  if (error) {
    console.error("[temp-grants GET]", error);
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }
  return NextResponse.json({ grants: data || [] });
}

/**
 * POST /api/admin/temp-grants
 * Body: { recipient_id, reason? }
 * Seul un VRAI admin peut accorder.
 */
export async function POST(req: Request) {
  const user = await getCurrentAuthUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Vérifier que l'actor est un VRAI admin (pas temp_admin)
  const actor = await getActorProfile(user.id);
  if (actor.response) return actor.response;
  const actorProfile = actor.profile;

  if (!actorProfile || actorProfile.role !== "admin") {
    return NextResponse.json(
      { error: "Seul un administrateur titulaire peut accorder ce rôle" },
      { status: 403 }
    );
  }

  let body;
  try {
    body = grantSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  if (body.recipient_id === user.id) {
    return NextResponse.json(
      { error: "Vous ne pouvez pas vous accorder ce rôle vous-même" },
      { status: 400 }
    );
  }

  // Récupérer le profil cible
  const { data: target, error: targetErr } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_expires_at")
    .eq("id", body.recipient_id)
    .maybeSingle();

  if (targetErr) {
    console.error("[temp-grants POST] target", targetErr);
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }
  if (!target) {
    return NextResponse.json({ error: "User cible introuvable" }, { status: 404 });
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { error: "L'utilisateur est déjà admin titulaire" },
      { status: 400 }
    );
  }

  // Si déjà temp_admin actif, on révoque le grant courant avant d'en ouvrir un nouveau
  if (
    target.role === "temp_admin" &&
    target.temp_admin_expires_at &&
    new Date(target.temp_admin_expires_at) > new Date()
  ) {
    const { error: revokeErr } = await supabaseAdmin
      .from("temp_admin_grants")
      .update({ revoked_at: new Date().toISOString(), revoked_by: user.id })
      .eq("recipient_id", target.id)
      .is("revoked_at", null);
    if (revokeErr) {
      console.error("[temp-grants POST] revoke previous grant", revokeErr);
      return NextResponse.json({ error: "Erreur révocation du grant courant" }, { status: 500 });
    }
  }

  // L'original_role à stocker (le rôle actuel SI ce n'est pas temp_admin, sinon
  // on garde celui qu'on avait sauvegardé)
  let originalRole: string;
  if (target.role === "temp_admin") {
    const { data: lastGrant, error: lastGrantErr } = await supabaseAdmin
      .from("temp_admin_grants")
      .select("original_role")
      .eq("recipient_id", target.id)
      .order("granted_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lastGrantErr) {
      console.error("[temp-grants POST] last grant", lastGrantErr);
      return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
    }
    originalRole = lastGrant?.original_role || "user";
  } else {
    originalRole = target.role;
  }

  const expiresAt = new Date(
    Date.now() + TEMP_ADMIN_DURATION_HOURS * 60 * 60 * 1000
  ).toISOString();

  // 1) Insert audit row
  const { data: grant, error: grantErr } = await supabaseAdmin
    .from("temp_admin_grants")
    .insert({
      recipient_id: target.id,
      granted_by: user.id,
      expires_at: expiresAt,
      reason: body.reason ?? null,
      original_role: originalRole,
    })
    .select()
    .single();

  if (grantErr) {
    console.error("[temp-grants POST] grant insert", grantErr);
    return NextResponse.json({ error: "Erreur création grant" }, { status: 500 });
  }

  // 2) Patch profile
  const { error: profErr } = await supabaseAdmin
    .from("profiles")
    .update({
      role: "temp_admin",
      temp_admin_expires_at: expiresAt,
      temp_admin_granted_by: user.id,
      temp_admin_original_role: originalRole,
    })
    .eq("id", target.id);

  if (profErr) {
    console.error("[temp-grants POST] profile update", profErr);
    // Ne pas laisser une ligne d'audit pour un grant qui n'a jamais pris effet
    const { error: cleanupErr } = await supabaseAdmin
      .from("temp_admin_grants")
      .delete()
      .eq("id", grant.id);
    if (cleanupErr) console.error("[temp-grants POST] grant cleanup", cleanupErr);
    return NextResponse.json({ error: "Erreur update profil" }, { status: 500 });
  }

  // 3) Notify the recipient (non bloquant : le grant est effectif)
  const { error: notifErr } = await supabaseAdmin.from("forum_notifications").insert({
    recipient_id: target.id,
    actor_id: user.id,
    type: "temp_admin_granted",
    metadata: {
      expires_at: expiresAt,
      original_role: originalRole,
      reason: body.reason ?? null,
    },
  });
  if (notifErr) console.error("[temp-grants POST] notification", notifErr);

  return NextResponse.json({ ok: true, grant, notified: !notifErr });
}

/**
 * DELETE /api/admin/temp-grants
 * Body: { recipient_id }
 * Révoque le grant actif d'un user (seul un VRAI admin peut le faire).
 */
export async function DELETE(req: Request) {
  const user = await getCurrentAuthUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const actorRes = await getActorProfile(user.id);
  if (actorRes.response) return actorRes.response;
  const actor = actorRes.profile;

  if (!actor || actor.role !== "admin") {
    return NextResponse.json({ error: "Réservé aux admins titulaires" }, { status: 403 });
  }

  let body;
  try {
    body = z.object({ recipient_id: z.string().uuid() }).parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  // Récupérer le grant actif et l'original_role
  const { data: target, error: targetErr } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_original_role")
    .eq("id", body.recipient_id)
    .maybeSingle();

  if (targetErr) {
    console.error("[temp-grants DELETE] target", targetErr);
    return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
  }

  if (!target || target.role !== "temp_admin") {
    return NextResponse.json(
      { error: "Cet utilisateur n'est pas administrateur temporaire" },
      { status: 400 }
    );
  }

  const originalRole = target.temp_admin_original_role || "user";

  // Marquer le grant comme revoked
  const { error: revokeErr } = await supabaseAdmin
    .from("temp_admin_grants")
    .update({ revoked_at: new Date().toISOString(), revoked_by: user.id })
    .eq("recipient_id", target.id)
    .is("revoked_at", null);
  if (revokeErr) {
    console.error("[temp-grants DELETE] grant revoke", revokeErr);
    return NextResponse.json({ error: "Erreur révocation" }, { status: 500 });
  }

  // Restaurer le rôle initial
  const { error: profErr } = await supabaseAdmin
    .from("profiles")
    .update({
      role: originalRole,
      temp_admin_expires_at: null,
      temp_admin_granted_by: null,
      temp_admin_original_role: null,
    })
    .eq("id", target.id);

  if (profErr) {
    console.error("[temp-grants DELETE]", profErr);
    return NextResponse.json({ error: "Erreur révocation" }, { status: 500 });
  }

  // Notify the recipient of revocation (non bloquant : la révocation est effective)
  const { error: notifErr } = await supabaseAdmin.from("forum_notifications").insert({
    recipient_id: target.id,
    actor_id: user.id,
    type: "temp_admin_revoked",
    metadata: { restored_role: originalRole },
  });
  if (notifErr) console.error("[temp-grants DELETE] notification", notifErr);

  return NextResponse.json({ ok: true, notified: !notifErr });
}
