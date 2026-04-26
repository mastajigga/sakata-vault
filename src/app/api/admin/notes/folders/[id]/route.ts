import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { adminNoteFoldersSchema } from "@/lib/schemas/validation";
import { z } from "zod";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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

    let validatedData;
    try {
      validatedData = adminNoteFoldersSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const flattened = validationError.flatten();
        return NextResponse.json(
          { error: "Validation failed", fieldErrors: flattened.fieldErrors },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const { name } = validatedData;

    // Verify folder belongs to user
    const { data: folder, error: fetchError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .select("user_id")
        .eq("id", params.id)
        .single()
    );

    if (fetchError || !folder || (folder as any).user_id !== user.id) {
      return NextResponse.json(
        { error: "Dossier non trouvé." },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .update({
          name: name.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", params.id)
        .select()
        .single()
    );

    if (updateError || !updated) {
      console.error("[Admin Note Folders PATCH] Update failed:", {
        error: updateError?.message,
        userId: user.id,
        folderId: params.id,
      });
      return NextResponse.json(
        { error: "Erreur lors de la modification du dossier." },
        { status: 500 }
      );
    }

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[Admin Note Folders PATCH] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors de la modification du dossier." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
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

    // Verify folder belongs to user
    const { data: folder, error: fetchError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .select("user_id")
        .eq("id", params.id)
        .single()
    );

    if (fetchError || !folder || (folder as any).user_id !== user.id) {
      return NextResponse.json(
        { error: "Dossier non trouvé." },
        { status: 404 }
      );
    }

    // Move notes to null folder instead of deleting them
    const { error: moveError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_notes")
        .update({ folder_id: null })
        .eq("folder_id", params.id)
    );

    if (moveError) {
      console.error("[Admin Note Folders DELETE] Move notes failed:", {
        error: moveError.message,
        userId: user.id,
        folderId: params.id,
      });
      return NextResponse.json(
        { error: "Erreur lors du déplacement des notes." },
        { status: 500 }
      );
    }

    // Delete the folder
    const { error: deleteError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .delete()
        .eq("id", params.id)
    );

    if (deleteError) {
      console.error("[Admin Note Folders DELETE] Delete failed:", {
        error: deleteError.message,
        userId: user.id,
        folderId: params.id,
      });
      return NextResponse.json(
        { error: "Erreur lors de la suppression du dossier." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[Admin Note Folders DELETE] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression du dossier." },
      { status: 500 }
    );
  }
}
