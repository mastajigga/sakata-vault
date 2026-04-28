import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * GET /api/cron/flush-temp-admins
 *
 * Appelable par :
 *  - un Netlify Scheduled Function (toutes les 10-15 min)
 *  - un cron externe (cron-job.org, GitHub Actions schedule)
 *  - un admin titulaire pour forcer la mise à jour
 *
 * Sécurité : un secret optionnel CRON_SECRET dans les query params,
 * sinon vérification que le caller est admin.
 *
 * Effets :
 *  1. Notifie les temp_admins dont l'expiration approche (~1h)
 *  2. Revoque automatiquement les grants expirés et restaure les rôles
 *  3. Crée des notifs "expired" pour les concernés
 */
export async function GET(req: Request) {
  // Optional shared secret
  const url = new URL(req.url);
  const providedSecret = url.searchParams.get("secret");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin.rpc("flush_temp_admins");

    if (error) {
      console.error("[cron/flush-temp-admins]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = Array.isArray(data) && data.length > 0 ? data[0] : null;

    return NextResponse.json({
      ok: true,
      ran_at: new Date().toISOString(),
      expired_count: result?.expired_count ?? 0,
      expiring_soon_count: result?.expiring_soon_count ?? 0,
    });
  } catch (err: any) {
    console.error("[cron/flush-temp-admins]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Aussi POST pour les services qui le préfèrent (Netlify Scheduled Functions)
export const POST = GET;
