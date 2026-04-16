import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Langues autorisées — whitelist stricte pour éviter l'injection dans le filtre .or()
const ALLOWED_LANGS = ['fr', 'en', 'ln', 'sw', 'ts'] as const;
type AllowedLang = (typeof ALLOWED_LANGS)[number];

/** Échappe les caractères spéciaux LIKE pour éviter les injections dans ilike */
function escapeLike(value: string): string {
  return value.replace(/[%_\\]/g, '\\$&');
}

export async function GET(req: NextRequest) {
  const rawQ = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const rawLang = req.nextUrl.searchParams.get('lang') ?? 'fr';

  // Validation lang contre whitelist
  const lang: AllowedLang = (ALLOWED_LANGS as readonly string[]).includes(rawLang)
    ? (rawLang as AllowedLang)
    : 'fr';

  // Sanitize q : longueur max 100, échappement LIKE
  const q = escapeLike(rawQ.slice(0, 100));

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: rawQ, source: 'empty' });
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
  // On cherche dans title (jsonb) et summary (jsonb) selon la langue validée
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
    query: rawQ,
    source: process.env.PINECONE_API_KEY ? 'pinecone' : 'supabase-fallback',
    total: data?.length || 0,
  });
}
