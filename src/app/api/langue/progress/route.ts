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

    // Récupérer la progression existante
    const { data: existing } = await supabase
      .from(DB_TABLES.LANGUE_PROGRESS)
      .select("*")
      .eq("user_id", user.id)
      .single();

    let completed_lessons = existing?.completed_lessons || [];
    let score = existing?.score || 0;
    let streak = existing?.streak || 0;

    // Ajouter la leçon si non déjà complétée
    if (completed_lesson && !completed_lessons.includes(completed_lesson)) {
      completed_lessons = [...completed_lessons, completed_lesson];
      score += 10; // points de base pour leçon complétée
    }

    // Mettre à jour le niveau
    if (current_niveau) {
      // validé par l'appelant
    }

    // Score
    if (typeof score_increment === "number") {
      score += score_increment;
    }

    // Streak
    if (streak_update === 1) {
      streak += 1;
    } else if (streak_update === 0) {
      streak = 0;
    }

    const payload = {
      user_id: user.id,
      completed_lessons,
      current_niveau: current_niveau || existing?.current_niveau || "goutte-rosee",
      score,
      streak,
      updated_at: new Date().toISOString(),
    };

    const { error } = existing
      ? await supabase
          .from(DB_TABLES.LANGUE_PROGRESS)
          .update(payload)
          .eq("user_id", user.id)
      : await supabase
          .from(DB_TABLES.LANGUE_PROGRESS)
          .insert(payload);

    if (error) {
      console.error("[langue/progress] POST error:", error);
      return NextResponse.json({ error: "Erreur sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ success: true, progress: payload });
  } catch (err) {
    console.error("[langue/progress] POST exception:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
