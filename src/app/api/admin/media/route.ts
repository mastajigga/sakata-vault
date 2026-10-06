import { getCurrentAuthUser } from "@/lib/api/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import { adminMediaDeleteSchema } from "@/lib/schemas/validation";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const BUCKET = "library";

async function authGuard() {
  const { user, supabase } = await getCurrentAuthUser({ withClient: true });
  if (!user) {
    return { authorized: false, user: null };
  }

  // Les colonnes privées de profiles ne sont plus lisibles avec le JWT utilisateur.
  const { data: profile, error: profileError } = await supabase
    .rpc("get_my_profile")
    .maybeSingle<{ role: string | null; contributor_status: string | null }>();

  if (profileError) {
    console.error("Profile lookup failed:", profileError);
    return { authorized: false, user };
  }

  const isAdmin = profile?.role === "admin" || profile?.role === "manager";
  return { authorized: isAdmin, user };
}

export async function GET() {
  try {
    const { authorized } = await authGuard();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: files, error } = await supabaseAdmin.storage.from(BUCKET).list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) throw error;

    // Generate public URLs for each file
    const filesWithUrls = files.map((file) => {
      const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(file.name);
      return {
        ...file,
        url: publicUrl,
      };
    });

    return NextResponse.json(filesWithUrls);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { authorized } = await authGuard();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    return NextResponse.json({ message: "File uploaded successfully", path: data.path });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { authorized } = await authGuard();
    if (!authorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");

    let validatedFileName: string;
    try {
      const parsed = adminMediaDeleteSchema.parse({ fileName });
      validatedFileName = parsed.fileName;
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

    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([validatedFileName]);

    if (error) throw error;

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
