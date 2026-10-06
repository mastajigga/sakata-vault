import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { adminNoteFoldersSchema } from "@/lib/schemas/validation";
import { z } from "zod";

export async function GET(request: Request) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Session absente ou invalide." },
        { status: 401 }
      );
    }

    const { data: folders, error: foldersError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
    );

    if (foldersError) {
      console.error("[Admin Note Folders GET] Fetch failed:", {
        error: foldersError.message,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors du chargement des dossiers." },
        { status: 500 }
      );
    }

    return NextResponse.json(folders || []);
  } catch (err: any) {
    console.error("[Admin Note Folders GET] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors du chargement des dossiers." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentAuthUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Session absente ou invalide." },
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

    const { data: folder, error: insertError } = await withRetry(async () =>
      supabaseAdmin
        .from("admin_note_folders")
        .insert({
          user_id: user.id,
          name: name.trim(),
        })
        .select()
        .single()
    );

    if (insertError || !folder) {
      console.error("[Admin Note Folders POST] Insert failed:", {
        error: insertError?.message,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors de la création du dossier." },
        { status: 500 }
      );
    }

    return NextResponse.json(folder, { status: 201 });
  } catch (err: any) {
    console.error("[Admin Note Folders POST] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du dossier." },
      { status: 500 }
    );
  }
}
