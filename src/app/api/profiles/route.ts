import { supabasePublic } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/profiles
 * Returns profiles list with ISR caching
 * Cache: 10 minutes (ISR: 120 seconds)
 */
export async function GET() {
  try {
    const { data: profiles, error } = await supabasePublic
      .from(DB_TABLES.PROFILES)
      .select("id, username, nickname, avatar_url, short_bio, location, contributor_status, updated_at")
      .not("username", "is", null)
      .order("updated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profiles, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=120",
        "CDN-Cache-Control": "max-age=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
