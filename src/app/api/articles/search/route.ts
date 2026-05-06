import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DB_TABLES } from '@/lib/constants/db';
import { articlesSearchSchema } from '@/lib/schemas/validation';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

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
  // Recherche vectorielle hybride : Pinecone + Supabase
  let pineconeResults: { id: string; slug: string; title: string; score: number }[] = [];
  
  if (process.env.PINECONE_API_KEY && process.env.GEMINI_API_KEY && rawQ.length >= 3) {
    try {
      // Import dynamique pour éviter l'instanciation au build (règle Netlify)
      const { Pinecone } = await import("@pinecone-database/pinecone");
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      
      const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const index = pc.Index(process.env.PINECONE_INDEX_NAME || "sakata");
      
      // Générer l'embedding de la requête
      const embedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const embedResult = await embedModel.embedContent(`query: ${rawQ}`);
      const embedding = embedResult.embedding.values;
      
      // Interroger le namespace iluo_livres_site (articles du site)
      const queryResponse = await index.namespace("iluo_livres_site").query({
        vector: embedding,
        topK: 8,
        includeMetadata: true,
      });
      
      pineconeResults = (queryResponse.matches || [])
        .filter((m: any) => m.score && m.score > 0.5)
        .map((m: any) => ({
          id: m.id,
          slug: m.metadata?.slug || "",
          title: m.metadata?.title || "Article Sakata",
          score: Math.round(m.score * 100) / 100,
        }));
      
      console.debug(`[search] Pinecone returned ${pineconeResults.length} results for "${rawQ}"`);
    } catch (err) {
      console.warn("[search] Pinecone query failed, falling back to Supabase:", err);
      // Fallback silencieux → Supabase uniquement
    }
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
    source: pineconeResults.length > 0 ? 'hybrid' : 'supabase-enhanced',
    total: merged.length,
    pinecone: pineconeResults.length > 0 ? {
      count: pineconeResults.length,
      topMatches: pineconeResults.slice(0, 5).map(m => ({
        slug: m.slug,
        title: m.title,
        score: m.score,
      })),
    } : undefined,
  });
}
