import { supabasePublic } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/articles
 * Returns cached articles list with ISR revalidation
 * Cache: 5 minutes (ISR: 60 seconds)
 */
export async function GET() {
  try {
    const { data: articles, error } = await supabasePublic
      .from(DB_TABLES.ARTICLES)
      .select("id, slug, title, summary, category, featured_image, created_at, likes_count, reads_count, is_premium")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        "CDN-Cache-Control": "max-age=300",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
