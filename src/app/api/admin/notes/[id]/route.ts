import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { z } from "zod";

const noteUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000).optional(),
  archived: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
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

    // Verify ownership
    const { data: note } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .select("user_id")
        .eq("id", params.id)
        .single()
    );

    if (!note || (note as any).user_id !== user.id) {
      return NextResponse.json(
        { error: "Note non trouvée." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updates = noteUpdateSchema.parse(body);

    const { data: updated, error } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", params.id)
        .select()
        .single()
    );

    if (error || !updated) {
      console.error("[Admin Notes] Update failed:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de la note." },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[Admin Notes] Request failed:", err);

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée.", details: err.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
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

    // Verify ownership
    const { data: note } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .select("user_id")
        .eq("id", params.id)
        .single()
    );

    if (!note || (note as any).user_id !== user.id) {
      return NextResponse.json(
        { error: "Note non trouvée." },
        { status: 404 }
      );
    }

    // Soft delete (archive)
    const { error } = await withRetry(async () =>
      supabasePublic
        .from("admin_notes")
        .update({ archived: true })
        .eq("id", params.id)
    );

    if (error) {
      console.error("[Admin Notes] Delete failed:", error);
      return NextResponse.json(
        { error: "Erreur lors de la suppression de la note." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Admin Notes] Request failed:", err);
    return NextResponse.json(
      { error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
