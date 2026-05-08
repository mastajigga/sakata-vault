import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/api/auth-helpers";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/moderation/users?filter=banned|deleted|search&q=...
 */
export async function GET(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const url = new URL(req.url);
  const filter = url.searchParams.get("filter") || "banned";
  const q = url.searchParams.get("q") || "";

  let query = supabaseAdmin
    .from("profiles")
    .select("id, username, nickname, avatar_url, role, banned_until, ban_reason, banned_by, deleted_at, deletion_reason, permanent_delete_at, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter === "banned") {
    query = query.gt("banned_until", new Date().toISOString());
  } else if (filter === "deleted") {
    query = query.not("deleted_at", "is", null);
  } else if (filter === "search" && q) {
    const escaped = q.replace(/[%_\\]/g, (c) => `\\${c}`);
    query = query.or(`username.ilike.%${escaped}%,nickname.ilike.%${escaped}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[mod users GET]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ users: data || [] });
}
