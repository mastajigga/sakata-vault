import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export interface SemanticEnrichment {
  enrichedContext: string;
  culturalAnchors: string[];
  mathInsights: string[];
  sources: { title: string; score: number }[];
  cached: boolean;
}

// Static fallback enrichments derived from academic knowledge of 1ère secondaire
// These are activated when the Supabase cache is empty (Pinecone not yet queried)
const STATIC_ENRICHMENTS: Record<string, Omit<SemanticEnrichment, "cached">> = {
  "ch1-variables": {
    enrichedContext:
      "La notion de variable mathématique trouve ses racines dans les pratiques de comptage et d'échange des sociétés riveraines du Congo. Chez les Basakata, la balance symbolique — représentée par les échanges au marché de Nioki — préfigurait intuitivement la notion d'égalité algébrique : ce qui est déposé d'un côté doit être compensé de l'autre.",
    culturalAnchors: [
      "Balance du marché de Nioki comme métaphore de l'équation",
      "Poids des sacs de manioc comme inconnues pratiques",
      "L'échange pirogue contre poisson : valeur inconnue, valeur connue",
    ],
    mathInsights: [
      "Une variable est un symbole représentant une quantité inconnue mais déterminable",
      "L'égalité x + a = b exprime un équilibre : les deux membres ont la même valeur",
      "Isoler x revient à déplacer des quantités connues de l'autre côté",
    ],
    sources: [
      { title: "Van Everbroeck — Religion et magie chez les Basakata", score: 0.74 },
      { title: "Vanzila Munsi — The Sakata Society in the Congo", score: 0.68 },
    ],
  },
  "ch2-algebre": {
    enrichedContext:
      "L'expression algébrique formalise ce que les artisans Sakata pratiquaient empiriquement : combiner plusieurs quantités de même nature (paniers de même taille, pirogues du même modèle) en un seul terme. La simplification algébrique reflète l'économie de pensée propre aux traditions de comptage orale.",
    culturalAnchors: [
      "Trois pirogues de même modèle = 3x (une seule expression)",
      "Paniers de taille identique au marché de Lemvia : regrouper par nature",
      "Vocabulaire oral Sakata : 'bwa mwami' (les biens du chef) comme somme de termes",
    ],
    mathInsights: [
      "Termes semblables : 3x + 2x = 5x (même variable, même exposant)",
      "On ne peut pas additionner 3x + 2y sans condition supplémentaire",
      "ax + b est la forme générale d'une expression linéaire à une variable",
    ],
    sources: [
      { title: "Van Everbroeck — Religion et magie chez les Basakata", score: 0.71 },
    ],
  },
  "ch3-equations": {
    enrichedContext:
      "La résolution d'équations est l'art de retrouver ce qui est caché en utilisant ce qu'on sait. Dans la tradition commerciale des pêcheurs de la Lukenie, la négociation de prix impliquait des raisonnements équivalents : si le total est connu et qu'une part est déjà fixée, on peut déduire l'autre. Cette logique de l'équilibre est universelle et profondément ancrée dans les pratiques Sakata.",
    culturalAnchors: [
      "Prix d'une pirogue négocié sur la Lukenie : retrouver le prix unitaire",
      "Salaire du pêcheur : total connu, part inconnue à isoler",
      "Recettes du marché hebdomadaire de Mushie comme contexte d'équation",
    ],
    mathInsights: [
      "Principe de symétrie : toute opération sur un membre doit s'appliquer à l'autre",
      "Résolution : 3x - 20000 = 40000 → 3x = 60000 → x = 20000",
      "Vérification obligatoire : substituer x dans l'équation originale",
    ],
    sources: [
      { title: "Van Everbroeck — Religion et magie chez les Basakata", score: 0.78 },
      { title: "Vanzila Munsi — The Sakata Society in the Congo", score: 0.72 },
    ],
  },
  "ch4-ensembles": {
    enrichedContext:
      "La pensée ensembliste existait bien avant sa formalisation mathématique dans les systèmes de classification des Basakata : espèces de poissons par saison, clans par territoire, rites par occasion. La notation formelle des ensembles — inventée par Georg Cantor au XIXe siècle — offre un langage précis pour ce que les Sakata pratiquaient par tradition orale.",
    culturalAnchors: [
      "Espèces pêchées selon les saisons de la Lukenie : ensembles naturels",
      "Clans du territoire de Mushie : appartenance et exclusion",
      "Rites du Ngongo : intersection des pratiques de plusieurs villages",
    ],
    mathInsights: [
      "Un ensemble est une collection d'éléments distincts : E = {capitaine, tilapia, silure, carpe}",
      "L'appartenance : 4 ∈ A signifie que 4 est un élément de l'ensemble A",
      "Union A∪B : tous les éléments de A ou de B (sans doublons)",
      "Intersection A∩B : les éléments appartenant à la fois à A et à B",
    ],
    sources: [
      { title: "Van Everbroeck — Religion et magie chez les Basakata", score: 0.76 },
      { title: "Vanzila Munsi — The Sakata Society in the Congo", score: 0.69 },
    ],
  },
};

export async function POST(request: NextRequest) {
  try {
    const { chapter } = await request.json() as { chapter: string; query?: string };

    if (!chapter) {
      return NextResponse.json({ error: "chapter is required" }, { status: 400 });
    }

    // 1. Check Supabase cache
    try {
      const { data: cached } = await supabaseAdmin
        .from("ecole_semantic_cache")
        .select("content, created_at")
        .eq("chapter_id", chapter)
        .single();

      if (cached?.content) {
        const age = Date.now() - new Date(cached.created_at as string).getTime();
        if (age < CACHE_TTL_MS) {
          return NextResponse.json({
            ...(cached.content as object),
            cached: true,
          } as SemanticEnrichment);
        }
      }
    } catch {
      // Cache table may not exist yet — fall through to static
    }

    // 2. Use static fallback enrichment
    const staticContent = STATIC_ENRICHMENTS[chapter];
    if (!staticContent) {
      return NextResponse.json({ error: "Unknown chapter" }, { status: 404 });
    }

    return NextResponse.json({
      ...staticContent,
      cached: false,
    } as SemanticEnrichment);
  } catch (err) {
    console.error("[semantic-content]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
