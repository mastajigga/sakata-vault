import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { TEMP_ADMIN_DURATION_HOURS } from "@/lib/constants/business";

const grantSchema = z.object({
  recipient_id: z.string().uuid(),
  reason: z.string().max(500).optional().nullable(),
});

async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * GET /api/admin/temp-grants
 * Liste des grants (actifs + historique).
 * Visible par : admins (tout) et le récipiendaire (les siens) — RLS le gère.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Use admin client because we want to JOIN profiles, RLS still filters via policy
  const { data, error } = await supabaseAdmin
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
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Vérifier que l'actor est un VRAI admin (pas temp_admin)
  const { data: actorProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

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
    .single();

  if (targetErr || !target) {
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
    await supabaseAdmin
      .from("temp_admin_grants")
      .update({ revoked_at: new Date().toISOString(), revoked_by: user.id })
      .eq("recipient_id", target.id)
      .is("revoked_at", null);
  }

  // L'original_role à stocker (le rôle actuel SI ce n'est pas temp_admin, sinon
  // on garde celui qu'on avait sauvegardé)
  let originalRole: string;
  if (target.role === "temp_admin") {
    const { data: lastGrant } = await supabaseAdmin
      .from("temp_admin_grants")
      .select("original_role")
      .eq("recipient_id", target.id)
      .order("granted_at", { ascending: false })
      .limit(1)
      .single();
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
    return NextResponse.json({ error: "Erreur update profil" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, grant });
}

/**
 * DELETE /api/admin/temp-grants
 * Body: { recipient_id }
 * Révoque le grant actif d'un user (seul un VRAI admin peut le faire).
 */
export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: actor } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

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
  const { data: target } = await supabaseAdmin
    .from("profiles")
    .select("id, role, temp_admin_original_role")
    .eq("id", body.recipient_id)
    .single();

  if (!target || target.role !== "temp_admin") {
    return NextResponse.json(
      { error: "Cet utilisateur n'est pas administrateur temporaire" },
      { status: 400 }
    );
  }

  const originalRole = target.temp_admin_original_role || "user";

  // Marquer le grant comme revoked
  await supabaseAdmin
    .from("temp_admin_grants")
    .update({ revoked_at: new Date().toISOString(), revoked_by: user.id })
    .eq("recipient_id", target.id)
    .is("revoked_at", null);

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

  return NextResponse.json({ ok: true });
}
