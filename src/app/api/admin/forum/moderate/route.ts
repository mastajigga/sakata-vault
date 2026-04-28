import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
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

export async function POST(req: Request) {
  try {
    const { action, reportId, postId, userId, reason } = await req.json();

    if (action === 'dismiss') {
       const { error } = await supabaseAdmin
         .from('forum_reports')
         .update({ status: 'dismissed' })
         .eq('id', reportId);
       if (error) throw error;
    }

    if (action === 'delete') {
       // Delete the post
       const { error: postError } = await supabaseAdmin
         .from('forum_posts')
         .delete()
         .eq('id', postId);
       if (postError) throw postError;

       // Mark report as resolved
       if (reportId) {
          await supabaseAdmin
            .from('forum_reports')
            .update({ status: 'resolved' })
            .eq('id', reportId);
       }
    }

    if (action === 'block') {
       // Block user by updating metadata or using a 'blocked' status if it exists
       // For now, we'll use metadata to flag them
       const { data: profile } = await supabaseAdmin
         .from('profiles')
         .select('metadata')
         .eq('id', userId)
         .single();
       
       const metadata = { ...(profile?.metadata || {}), blocked: true, block_reason: reason };
       
       const { error: blockError } = await supabaseAdmin
         .from('profiles')
         .update({ metadata })
         .eq('id', userId);
       
       if (blockError) throw blockError;

       // Also delete all their recent posts? 
       // For now, just mark the report
       if (reportId) {
          await supabaseAdmin
            .from('forum_reports')
            .update({ status: 'resolved' })
            .eq('id', reportId);
       }
    }

    return NextResponse.json({ message: "Action executed successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
