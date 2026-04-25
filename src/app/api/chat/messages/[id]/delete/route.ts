import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { z } from "zod";

const deleteMessageSchema = z.object({
  mode: z.enum(["self", "all"]),
});

const DELETE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

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

    // Validate JWT
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton invalide." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { mode } = deleteMessageSchema.parse(body);

    // Fetch the message
    const { data: message, error: fetchError } = await withRetry(async () =>
      supabasePublic
        .from(DB_TABLES.CHAT_MESSAGES)
        .select("*")
        .eq("id", params.id)
        .single()
    );

    if (fetchError || !message) {
      return NextResponse.json(
        { error: "Message non trouvé." },
        { status: 404 }
      );
    }

    // Verify sender is the one deleting
    if ((message as any).sender_id !== user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez supprimer que vos propres messages." },
        { status: 403 }
      );
    }

    // Check if message is within 2-minute delete window
    const messageCreatedTime = new Date((message as any).created_at).getTime();
    const now = new Date().getTime();
    const timeSinceCreation = now - messageCreatedTime;

    if (timeSinceCreation > DELETE_WINDOW_MS) {
      return NextResponse.json(
        { error: "Le message ne peut plus être supprimé (limite de 2 minutes dépassée)." },
        { status: 400 }
      );
    }

    // Update the message based on deletion mode
    const updateData = mode === "all"
      ? {
          deleted_at: new Date().toISOString(),
          deleted_for_all: true,
          deleted_by_user_id: user.id,
          content: "[Message supprimé]",
        }
      : {
          deleted_at: new Date().toISOString(),
          deleted_for_all: false,
          deleted_by_user_id: user.id,
        };

    const { data: deletedMessage, error: updateError } = await withRetry(async () =>
      supabasePublic
        .from(DB_TABLES.CHAT_MESSAGES)
        .update(updateData)
        .eq("id", params.id)
        .select()
        .single()
    );

    if (updateError || !deletedMessage) {
      console.error("[Chat Delete] Update failed:", {
        error: updateError?.message,
        messageId: params.id,
        userId: user.id,
        mode,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Erreur lors de la suppression du message." },
        { status: 500 }
      );
    }

    return NextResponse.json(deletedMessage, { status: 200 });
  } catch (err: any) {
    console.error("[Chat Delete] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée.", details: (err as any).errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression du message." },
      { status: 500 }
    );
  }
}
