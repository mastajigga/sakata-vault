import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { TIMINGS } from "@/lib/constants/timings";
import { z } from "zod";

const editMessageSchema = z.object({
  content: z.string().min(1).max(5000),
});

const EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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
    const { content } = editMessageSchema.parse(body);

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

    // Verify sender is the one editing
    if ((message as any).sender_id !== user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez modifier que vos propres messages." },
        { status: 403 }
      );
    }

    // Check if message is within 5-minute edit window
    const messageCreatedTime = new Date((message as any).created_at).getTime();
    const now = new Date().getTime();
    const timeSinceCreation = now - messageCreatedTime;

    if (timeSinceCreation > EDIT_WINDOW_MS) {
      return NextResponse.json(
        { error: "Le message ne peut plus être modifié (limite de 5 minutes dépassée)." },
        { status: 400 }
      );
    }

    // Update the message
    const { data: updatedMessage, error: updateError } = await withRetry(async () =>
      supabasePublic
        .from(DB_TABLES.CHAT_MESSAGES)
        .update({
          content,
          edited_at: new Date().toISOString(),
          edited_by_user_id: user.id,
        })
        .eq("id", params.id)
        .select()
        .single()
    );

    if (updateError || !updatedMessage) {
      console.error("[Chat Edit] Update failed:", {
        error: updateError?.message,
        messageId: params.id,
        userId: user.id,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        { error: "Erreur lors de la modification du message." },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedMessage, { status: 200 });
  } catch (err: any) {
    console.error("[Chat Edit] Request failed:", {
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
      { error: "Erreur serveur lors de la modification du message." },
      { status: 500 }
    );
  }
}
