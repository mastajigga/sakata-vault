import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/api/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "pending";

  const { data, error } = await supabaseAdmin
    .from("moderation_reports")
    .select(`
      *,
      reporter:profiles!reporter_id (id, username, nickname, avatar_url),
      post:forum_posts!target_post_id (id, content, author_id, thread_id, created_at, deleted_at,
        author:profiles!author_id (id, username, nickname, avatar_url, banned_until))
    `)
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[reports GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reports: data || [] });
}
