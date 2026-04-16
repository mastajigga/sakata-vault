import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  const lang = (req.nextUrl.searchParams.get('lang') || 'fr') as string;

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: q, source: 'empty' });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Pinecone disponible? (sera activé quand PINECONE_API_KEY est fournie)
  if (process.env.PINECONE_API_KEY) {
    // TODO: Implémentation Pinecone — retourner les articles sémantiquement proches
    // Pour l'instant, fallback sur Supabase
  }

  // Fallback: fulltext search dans Supabase
  // On cherche dans title (jsonb) et summary (jsonb) selon la langue
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, summary, category, image, subscription_required')
    .or(
      `title->>${lang}.ilike.%${q}%,summary->>${lang}.ilike.%${q}%,title->>fr.ilike.%${q}%,summary->>fr.ilike.%${q}%`
    )
    .eq('status', 'published')
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    results: data || [],
    query: q,
    source: process.env.PINECONE_API_KEY ? 'pinecone' : 'supabase-fallback',
    total: data?.length || 0,
  });
}
