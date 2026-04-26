import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton manquant." },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton invalide." },
        { status: 401 }
      );
    }

    const { data: notes, error: notesError } = await withRetry(async () =>
      supabaseAdmin
        .from(DB_TABLES.ADMIN_NOTES)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    );

    if (notesError) {
      console.error("[Admin Notes GET] Fetch failed:", {
        error: notesError.message,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors du chargement des notes." },
        { status: 500 }
      );
    }

    return NextResponse.json(notes || []);
  } catch (err: any) {
    console.error("[Admin Notes GET] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors du chargement des notes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton manquant." },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton invalide." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titre et contenu sont requis." },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return NextResponse.json(
        { error: "Le titre ne peut pas dépasser 255 caractères." },
        { status: 400 }
      );
    }

    const { data: note, error: insertError } = await withRetry(async () =>
      supabaseAdmin
        .from(DB_TABLES.ADMIN_NOTES)
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
        })
        .select()
        .single()
    );

    if (insertError || !note) {
      console.error("[Admin Notes POST] Insert failed:", {
        error: insertError?.message,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors de la création de la note." },
        { status: 500 }
      );
    }

    return NextResponse.json(note, { status: 201 });
  } catch (err: any) {
    console.error("[Admin Notes POST] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors de la création de la note." },
      { status: 500 }
    );
  }
}
