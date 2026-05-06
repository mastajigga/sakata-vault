import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const BUCKET = "library";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const ALLOWED_DOC_TYPES = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

async function authGuard() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user || authError) {
    return { authorized: false, user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, contributor_status")
    .eq("id", user.id)
    .single();

  const isContributor =
    profile?.role === "contributor" ||
    profile?.contributor_status === "approved" ||
    profile?.role === "admin" ||
    profile?.role === "manager";

  return { authorized: isContributor, user };
}

export async function POST(req: Request) {
  try {
    const { authorized, user } = await authGuard();
    if (!authorized) {
      return NextResponse.json(
        { error: "Réservé aux contributeurs approuvés." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "document";
    const title = (formData.get("title") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10MB)." },
        { status: 400 }
      );
    }

    // Validate file type based on category
    const allowedTypes =
      category === "photo"
        ? ALLOWED_IMAGE_TYPES
        : category === "video"
        ? ALLOWED_VIDEO_TYPES
        : [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES, ...ALLOWED_DOC_TYPES];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Type de fichier non autorisé pour la catégorie "${category}".` },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop();
    const safeName = title
      ? title.replace(/[^a-zA-Z0-9\-_]/g, "_").substring(0, 50)
      : file.name.replace(/\.[^.]+$/, "").substring(0, 50);
    const fileName = `contributions/${category}/${user!.id}/${safeName}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      message: "Fichier uploadé avec succès.",
      path: data.path,
      url: publicUrl,
      fileName,
    });
  } catch (err: any) {
    console.error("POST /api/contributor/upload:", err);
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
