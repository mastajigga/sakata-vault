import { supabasePublic, supabaseAdmin } from "@/lib/supabase/admin";
import { DB_TABLES } from "@/lib/constants/db";
import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { NextRequest, NextResponse } from "next/server";

/** Délai de rétractation avant purge définitive du compte. */
const DELETION_GRACE_DAYS = 30;

/**
 * GET /api/profiles
 * Returns profiles list with ISR caching
 * Cache: 10 minutes (ISR: 120 seconds)
 */
export async function GET() {
  try {
    const { data: profiles, error } = await supabasePublic
      .from(DB_TABLES.PROFILES)
      .select("id, username, nickname, avatar_url, short_bio, location, created_at")
      .not("username", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profiles, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
        "CDN-Cache-Control": "max-age=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/profiles
 * Supprime le compte de l'appelant (suppression DOUCE, réversible 30 jours).
 * Exigé par Google Play et l'App Store pour toute app qui crée des comptes.
 *
 * Authentification : Authorization: Bearer <jwt> (app mobile) puis cookie (web),
 * via getCurrentAuthUser().
 *
 * Corps (JSON) : { "confirm": true, "reason"?: string }
 *   `confirm` est un garde-fou pour éviter une suppression par appel accidentel.
 *
 * Effet : renseigne deleted_at / deleted_by / deletion_reason / permanent_delete_at
 * sur SA propre ligne uniquement. Aucune donnée n'est détruite immédiatement ;
 * la purge définitive est un travail séparé (cron).
 *
 * Ne supprime jamais le compte d'un autre : la mise à jour est filtrée sur id = user.id.
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé. Jeton manquant." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || body.confirm !== true) {
      return NextResponse.json(
        { error: 'Confirmation requise : envoyez { "confirm": true }.' },
        { status: 400 }
      );
    }

    const reason = typeof body.reason === "string" ? body.reason.slice(0, 500) : null;

    const now = new Date();
    const purgeAt = new Date(now.getTime() + DELETION_GRACE_DAYS * 24 * 60 * 60 * 1000);

    const { data, error } = await supabaseAdmin
      .from(DB_TABLES.PROFILES)
      .update({
        deleted_at: now.toISOString(),
        deleted_by: user.id,
        deletion_reason: reason,
        permanent_delete_at: purgeAt.toISOString(),
      })
      .eq("id", user.id)
      .select("id, deleted_at, permanent_delete_at");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Une policy RLS qui refuse une écriture ne lève pas d'erreur : elle renvoie
    // simplement 0 ligne. On ne doit donc jamais annoncer un succès sur un vide.
    // (Ici le client est service_role et contourne la RLS, mais on garde la garde.)
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Suppression refusée : aucune ligne modifiée (compte introuvable)." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedAt: data[0].deleted_at,
      permanentDeleteAt: data[0].permanent_delete_at,
      graceDays: DELETION_GRACE_DAYS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
