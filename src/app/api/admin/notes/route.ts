import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
});

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

    const { data: notes, error } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false })
    );

    if (error) {
      console.error("[Admin Notes] Fetch failed:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération des notes." },
        { status: 500 }
      );
    }

    return NextResponse.json(notes);
  } catch (err: any) {
    console.error("[Admin Notes] Request failed:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
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
    const { title, content } = noteSchema.parse(body);

    const { data: note, error } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .insert([{ user_id: user.id, title, content }])
        .select()
        .single()
    );

    if (error || !note) {
      console.error("[Admin Notes] Insert failed:", error);
      return NextResponse.json(
        { error: "Erreur lors de la création de la note." },
        { status: 500 }
      );
    }

    return NextResponse.json(note, { status: 201 });
  } catch (err: any) {
    console.error("[Admin Notes] Request failed:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée.", details: err.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
