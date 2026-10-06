import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DB_TABLES } from "@/lib/constants/db";

export const dynamic = "force-dynamic";

async function authGuard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { authorized: false, user: null, supabase: null };
  }
  return { authorized: true, user, supabase };
}

/** GET — récupérer la progression langue de l'utilisateur */
export async function GET() {
  try {
    const { authorized, user, supabase } = await authGuard();
    if (!authorized || !user || !supabase) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from(DB_TABLES.LANGUE_PROGRESS)
      .select("*")
      .eq("user_id", user.id)
      .single();

    // Si pas de ligne, retourner une progression vide
    if (error && error.code !== "PGRST116") {
      console.error("[langue/progress] GET error:", error);
      return NextResponse.json({ error: "Erreur DB" }, { status: 500 });
    }

    return NextResponse.json({
      progress: data || {
        user_id: user.id,
        completed_lessons: [],
        current_niveau: "goutte-rosee",
        score: 0,
        streak: 0,
      },
    });
  } catch (err) {
    console.error("[langue/progress] GET exception:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** POST — sauvegarder/mettre à jour la progression */
export async function POST(req: Request) {
  try {
    const { authorized, user, supabase } = await authGuard();
    if (!authorized || !user || !supabase) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await req.json();
    const {
      completed_lesson,   // slug de la leçon à marquer comme complétée
      current_niveau,      // slug du niveau actuel
      score_increment,     // points à ajouter au score
      streak_update,       // 1 pour incrémenter, 0 pour reset
    } = body;

    if (
      (completed_lesson !== undefined && (typeof completed_lesson !== "string" || !completed_lesson.trim())) ||
      (current_niveau !== undefined && (typeof current_niveau !== "string" || !current_niveau.trim())) ||
      (score_increment !== undefined && (!Number.isSafeInteger(score_increment) || score_increment < 0 || score_increment > 100000)) ||
      (streak_update !== undefined && streak_update !== 0 && streak_update !== 1)
    ) {
      return NextResponse.json({ error: "Progression invalide" }, { status: 400 });
    }

    // La RPC fusionne sous verrou et ne récompense une leçon qu'une seule fois.
    const { data: progress, error } = await supabase.rpc("save_langue_progress", {
      p_completed_lesson: completed_lesson ?? null,
      p_current_niveau: current_niveau ?? null,
      p_score_increment: score_increment ?? 0,
      p_streak_update: streak_update ?? null,
    });

    if (error) {
      console.error("[langue/progress] POST error:", error);
      if (error.code === "PGRST202" || (error.code === "42883" && error.message.includes("save_langue_progress"))) {
        return NextResponse.json({
          code: "LANGUE_PROGRESS_UNAVAILABLE",
          error: "La sauvegarde de progression est temporairement indisponible : la fonction save_langue_progress doit être installée sur le serveur. Votre progression existante reste consultable.",
        }, { status: 503 });
      }
      return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ success: true, progress });
  } catch (err) {
    console.error("[langue/progress] POST exception:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
