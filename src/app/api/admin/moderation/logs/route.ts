import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/api/auth-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "50", 10), 200);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const action = url.searchParams.get("action");
  const moderatorId = url.searchParams.get("moderator");
  const targetUserId = url.searchParams.get("user");

  let query = supabaseAdmin
    .from("moderation_logs")
    .select(`
      *,
      moderator:profiles!moderator_id (id, username, nickname, avatar_url, role),
      target_user:profiles!target_user_id (id, username, nickname, avatar_url)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.eq("action_type", action);
  if (moderatorId) query = query.eq("moderator_id", moderatorId);
  if (targetUserId) query = query.eq("target_user_id", targetUserId);

  const { data, error, count } = await query;
  if (error) {
    console.error("[logs GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ logs: data || [], total: count || 0 });
}
