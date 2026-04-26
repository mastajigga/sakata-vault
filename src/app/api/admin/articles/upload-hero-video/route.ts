import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabasePublic } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { z } from "zod";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FORMATS = ["video/mp4", "video/webm", "video/quicktime"];

const uploadSchema = z.object({
  articleId: z.string().uuid(),
  filename: z.string().min(1).max(255),
});

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

    // Validate JWT
    const { data: { user }, error: authError } = await supabasePublic.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non autorisé. Jeton invalide." },
        { status: 401 }
      );
    }

    // Check if user is admin or manager
    const { data: profile, error: profileError } = await withRetry(async () =>
      supabaseAdmin
        .from(DB_TABLES.PROFILES)
        .select("role")
        .eq("id", user.id)
        .single()
    );

    if (profileError || !profile || !["admin", "manager"].includes((profile as any).role)) {
      return NextResponse.json(
        { error: "Accès refusé. Droits insuffisants." },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const articleId = formData.get("articleId") as string;

    if (!file || !articleId) {
      return NextResponse.json(
        { error: "Fichier ou ID article manquant." },
        { status: 400 }
      );
    }

    // Validate file
    if (!ALLOWED_FORMATS.includes(file.type)) {
      return NextResponse.json(
        { error: "Format de vidéo non supporté. Utilisez MP4, WebM ou MOV." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Vidéo trop volumineuse. Maximum 50MB." },
        { status: 400 }
      );
    }

    // Verify article exists and belongs to user
    const { data: article, error: articleError } = await withRetry(async () =>
      supabaseAdmin
        .from(DB_TABLES.ARTICLES)
        .select("id, created_by")
        .eq("id", articleId)
        .single()
    );

    if (articleError || !article) {
      return NextResponse.json(
        { error: "Article non trouvé." },
        { status: 404 }
      );
    }

    // Only allow creator or admin to upload video
    if ((article as any).created_by !== user.id && (profile as any).role !== "admin") {
      return NextResponse.json(
        { error: "Vous ne pouvez modifier que vos propres articles." },
        { status: 403 }
      );
    }

    // Upload video to Supabase Storage
    const timestamp = Date.now();
    const filename = `articles/${articleId}/${timestamp}-${file.name}`;

    const { data: uploadData, error: uploadError } = await withRetry(async () =>
      supabaseAdmin.storage
        .from("article-videos")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: false,
        })
    );

    if (uploadError || !uploadData) {
      console.error("[Upload Hero Video] Storage upload failed:", {
        error: uploadError?.message,
        articleId,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors du téléchargement de la vidéo." },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("article-videos")
      .getPublicUrl(filename);

    const videoUrl = publicUrlData?.publicUrl;

    if (!videoUrl) {
      return NextResponse.json(
        { error: "Impossible de générer l'URL de la vidéo." },
        { status: 500 }
      );
    }

    // Update article with video URL
    const { error: updateError } = await withRetry(async () =>
      supabaseAdmin
        .from(DB_TABLES.ARTICLES)
        .update({
          hero_video_url: videoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", articleId)
    );

    if (updateError) {
      console.error("[Upload Hero Video] Update failed:", {
        error: updateError.message,
        articleId,
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de l'article." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { videoUrl, filename },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Upload Hero Video] Request failed:", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Erreur serveur lors du téléchargement." },
      { status: 500 }
    );
  }
}
