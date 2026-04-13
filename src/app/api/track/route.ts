import { NextResponse } from 'next/server';
import { supabasePublic } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Extract IP and Geography headers using Netlify & Vercel edge/geo headers
    // Using x-nf-client-connection-ip for precise proxy tracking on Netlify
    const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    // Try Netlify header first, then Vercel, else Unknown
    const country = req.headers.get('x-country') || req.headers.get('x-vercel-ip-country') || 'Unknown';
    
    // Insert into Supabase 
    await supabasePublic.from('site_analytics').insert({
      path: body.path,
      user_id: body.user_id,
      language: body.language,
      session_id: body.session_id,
      referrer: body.referrer,
      user_agent: body.user_agent,
      ip_address: ip,
      metadata: {
        ...body.metadata,
        country: country
      }
    });

    // Native tracking for articles reads
    if (body.path.startsWith("/savoir/") && body.path !== "/savoir") {
      const slug = body.path.replace("/savoir/", "");
      if (slug) {
        await supabasePublic.rpc("increment_article_reads", {
          article_slug: slug,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Server Tracking Error:", err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
