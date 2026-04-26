import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DB_TABLES } from '@/lib/constants/db';
import { articlesSearchSchema } from '@/lib/schemas/validation';
import { z } from 'zod';

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

  // Validate query parameters with Zod
  let validatedParams;
  try {
    validatedParams = articlesSearchSchema.parse({ q: rawQ, lang: rawLang });
  } catch (validationError) {
    if (validationError instanceof z.ZodError) {
      const flattened = validationError.flatten();
      return NextResponse.json(
        { error: "Validation failed", fieldErrors: flattened.fieldErrors },
        { status: 400 }
      );
    }
    throw validationError;
  }

  const q = escapeLike(validatedParams.q || '');
  const lang: AllowedLang = validatedParams.lang as AllowedLang;

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], query: rawQ, source: 'empty' });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // ── Pinecone (sémantique) ─────────────────────────────────────────────────
  // Pour activer : configurer PINECONE_API_KEY + PINECONE_ENVIRONMENT + PINECONE_INDEX_NAME
  // et seeder l'index avec les embeddings des articles.
  // Le client est disponible dans src/lib/pinecone/client.ts.
  if (process.env.PINECONE_API_KEY) {
    // TODO: générer l'embedding de `rawQ` via OpenAI/Voyage puis interroger Pinecone
    // const embedding = await generateEmbedding(rawQ);
    // const results = await pineconeClient.query({ vector: embedding, topK: 10, includeMetadata: true });
    // return NextResponse.json({ results: results.matches.map(m => m.metadata), source: 'pinecone', ... });
  }

  // ── Fallback Supabase enrichi ─────────────────────────────────────────────
  // Recherche sur : titre, résumé, catégorie, et slug (mots-clés dans l'URL)
  // Priorité : titre exact > résumé > catégorie
  const [titleSummaryResult, categoryResult] = await Promise.all([
    // 1. Titre + résumé dans la langue demandée et en français
    supabase
      .from(DB_TABLES.ARTICLES)
      .select('id, slug, title, summary, category, image, subscription_required')
      .or(
        `title->>${lang}.ilike.%${q}%,` +
        `summary->>${lang}.ilike.%${q}%,` +
        `title->>fr.ilike.%${q}%,` +
        `summary->>fr.ilike.%${q}%`
      )
      .eq('status', 'published')
      .limit(8),

    // 2. Catégorie (recherche complémentaire pour les termes courts)
    supabase
      .from(DB_TABLES.ARTICLES)
      .select('id, slug, title, summary, category, image, subscription_required')
      .ilike('category', `%${q}%`)
      .eq('status', 'published')
      .limit(4),
  ]);

  if (titleSummaryResult.error) {
    return NextResponse.json({ error: titleSummaryResult.error.message }, { status: 500 });
  }

  // Fusionner et dédupliquer par id — les résultats titre/résumé en premier
  const seen = new Set<string>();
  const merged: any[] = [];

  for (const row of [...(titleSummaryResult.data || []), ...(categoryResult.data || [])]) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      merged.push(row);
    }
  }

  return NextResponse.json({
    results: merged.slice(0, 10),
    query: rawQ,
    source: 'supabase-enhanced',
    total: merged.length,
  });
}
