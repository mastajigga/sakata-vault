import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireModerator } from "@/lib/api/auth-helpers";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { data: reports, error } = await supabaseAdmin
      .from('forum_reports')
      .select(`
        *,
        post:forum_posts(content, author_id, profiles:author_id(username, nickname)),
        reporter:profiles!reporter_id(username, nickname)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
       // If table doesn't exist, return empty array to avoid crash
       if (error.code === '42P01') return NextResponse.json([]);
       throw error;
    }

    return NextResponse.json(reports);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/** Marks a report as resolved; throws if the write fails or matches no row. */
async function resolveReport(reportId: string) {
  const { data, error } = await supabaseAdmin
    .from('forum_reports')
    .update({ status: 'resolved' })
    .eq('id', reportId)
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Signalement introuvable");
}

export async function POST(req: Request) {
  const auth = await requireModerator();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { action, reportId, postId, userId, reason } = await req.json();

    if (action === 'dismiss') {
       const { data, error } = await supabaseAdmin
         .from('forum_reports')
         .update({ status: 'dismissed' })
         .eq('id', reportId)
         .select('id');
       if (error) throw error;
       if (!data || data.length === 0) {
         return NextResponse.json({ error: "Signalement introuvable" }, { status: 404 });
       }
    } else if (action === 'delete') {
       // Delete the post
       const { data: deleted, error: postError } = await supabaseAdmin
         .from('forum_posts')
         .delete()
         .eq('id', postId)
         .select('id');
       if (postError) throw postError;
       if (!deleted || deleted.length === 0) {
         return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
       }

       // Mark report as resolved
       if (reportId) await resolveReport(reportId);
    } else if (action === 'block') {
       // Block user by updating metadata or using a 'blocked' status if it exists
       // For now, we'll use metadata to flag them
       const { data: profile, error: profileError } = await supabaseAdmin
         .from('profiles')
         .select('metadata')
         .eq('id', userId)
         .maybeSingle();
       if (profileError) throw profileError;
       if (!profile) {
         return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
       }

       const metadata = { ...(profile.metadata || {}), blocked: true, block_reason: reason };

       const { data: blocked, error: blockError } = await supabaseAdmin
         .from('profiles')
         .update({ metadata })
         .eq('id', userId)
         .select('id');

       if (blockError) throw blockError;
       if (!blocked || blocked.length === 0) {
         return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
       }

       // Also delete all their recent posts?
       // For now, just mark the report
       if (reportId) await resolveReport(reportId);
    } else {
       return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    }

    return NextResponse.json({ message: "Action executed successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
