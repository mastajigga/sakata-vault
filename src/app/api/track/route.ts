import { NextResponse } from 'next/server';
import { z } from 'zod';
import { supabasePublic } from '@/lib/supabase/admin';
import { DB_TABLES } from '@/lib/constants/db';
import { trackingSchema } from '@/lib/schemas/validation';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validated = trackingSchema.parse(body);

    // Extract IP and Geography headers using Netlify & Vercel edge/geo headers
    // Using x-nf-client-connection-ip for precise proxy tracking on Netlify
    const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';

    // Try Netlify header first, then Vercel, else Unknown
    const country = req.headers.get('x-country') || req.headers.get('x-vercel-ip-country') || 'Unknown';

    // Insert into Supabase
    await supabasePublic.from(DB_TABLES.SITE_ANALYTICS).insert({
      path: validated.path,
      user_id: validated.user_id,
      language: validated.language,
      session_id: validated.session_id,
      referrer: validated.referrer,
      user_agent: validated.user_agent,
      ip_address: ip,
      metadata: {
        ...validated.metadata,
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

    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }
    console.error("Server Tracking Error:", err);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500, headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  }
}
