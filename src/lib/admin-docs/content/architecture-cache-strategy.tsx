import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-cache-strategy",
  title: "Stratégie de Cache — Trois Couches",
  subtitle:
    "Cache hybride localStorage + ISR (Cache-Control) + SWR (useCachedFetch) avec versioning APP_VERSION pour purger les obsolètes.",
  category: "architecture",
  order: 4,
  readTime: 6,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["cache", "performance", "swr", "localstorage"],
  summary:
    "Trois couches de cache combinées intelligemment, avec règles strictes d'invalidation et anti-patterns à connaître.",
};

export const Content = () => (
  <>
    <DocLead>
      Le cache est l'arme la plus efficace contre la latence — et la source la plus
      sournoise de bugs. Sakata utilise trois couches complémentaires, chacune avec
      ses règles d'invalidation et son TTL.
    </DocLead>

    <DocSection title="Les trois couches" eyebrow="Vue d'ensemble">
      <DocTable
        headers={["Couche", "Lieu", "TTL typique", "Cas d'usage"]}
        rows={[
          ["1. localStorage", "Navigateur", "24h", "Articles vus, profils consultés, paramètres user"],
          ["2. ISR (Cache-Control)", "Edge Netlify + CDN", "5 min + SWR 60s", "API routes /api/articles, /api/profiles"],
          ["3. SWR (useCachedFetch)", "Mémoire React", "Session", "Composants qui re-fetchent au focus"],
        ]}
      />
      <DocCallout type="info" title="Combinées">
        Une page typique utilise les trois : SWR en mémoire pour la vivacité, ISR
        pour soulager Supabase, localStorage comme filet offline et persistance entre
        sessions.
      </DocCallout>
    </DocSection>

    <DocSection title="Couche 1 — localStorage" eyebrow="Persistance navigateur">
      <DocSubsection title="Règles absolues">
        <DocList
          items={[
            <>Toute clé DOIT commencer par <DocInline>sakata-</DocInline>.</>,
            <>Toute clé DOIT être déclarée dans <DocInline>storage.ts</DocInline>.</>,
            <>Toute clé DOIT être ajoutée à <DocInline>SAKATA_KEY_WHITELIST</DocInline>.</>,
            <>Pas de hardcoding — toujours via constante ou helper.</>,
            <>Stocker un <DocInline>timestamp</DocInline> avec la valeur pour TTL.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Format standard">
        <DocCode lang="typescript">{`type CachedEntry<T> = {
  data: T;
  cachedAt: number;
  version: string;  // APP_VERSION
};

function setCache<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify({
    data,
    cachedAt: Date.now(),
    version: APP_VERSION,
  }));
}

function getCache<T>(key: string, maxAgeMs: number): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  const entry: CachedEntry<T> = JSON.parse(raw);
  if (entry.version !== APP_VERSION) return null;
  if (Date.now() - entry.cachedAt > maxAgeMs) return null;
  return entry.data;
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Versioning APP_VERSION">
        <DocP>
          Quand on bumpe <DocInline>APP_VERSION</DocInline> dans{" "}
          <DocInline>business.ts</DocInline>, l'AuthProvider parcourt toutes les clés{" "}
          <DocInline>sakata-*</DocInline> et purge celles qui n'ont pas la nouvelle
          version. Évite les incompatibilités après refonte de schéma.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Couche 2 — ISR (Cache-Control headers)" eyebrow="Edge cache">
      <DocSubsection title="Pattern API route">
        <DocCode lang="typescript" caption="src/app/api/articles/route.ts">{`export async function GET() {
  const articles = await fetchArticles();

  return NextResponse.json(articles, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      // s-maxage = 5 min CDN cache
      // stale-while-revalidate = sert l'ancien pendant 60s pendant qu'on regenere
    },
  });
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Routes avec cache ISR">
        <DocList
          items={[
            <><DocInline>/api/articles</DocInline> — liste d'articles (5 min)</>,
            <><DocInline>/api/profiles</DocInline> — annuaire membres (10 min)</>,
            <><DocInline>/api/courses</DocInline> — contenu école (1h)</>,
            <><DocInline>/api/translations</DocInline> — chaînes i18n (1h)</>,
          ]}
        />
        <DocCallout type="warning" title="Ne JAMAIS cacher">
          <DocList
            items={[
              <>Routes user-spécifiques (<DocInline>/api/me</DocInline>, profil perso).</>,
              <>Routes admin (<DocInline>/api/admin/*</DocInline>).</>,
              <>Routes de mutation (POST, PATCH, DELETE).</>,
              <>Routes de webhook (Stripe).</>,
            ]}
          />
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Couche 3 — SWR via useCachedFetch" eyebrow="Mémoire composant">
      <DocSubsection title="Le hook">
        <DocCode lang="typescript">{`const { data, error, isLoading, mutate } = useCachedFetch<Article[]>({
  key: "articles-list",
  fetcher: () => supabase.from("articles").select(),
  ttlMs: 5 * 60 * 1000,         // 5 min
  revalidateOnFocus: true,        // Refetch au retour onglet
  revalidateOnReconnect: true,    // Refetch après coupure réseau
});`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Stratégie stale-while-revalidate">
        <DocList
          ordered
          items={[
            <>Vérifier le localStorage → si valide (TTL OK), retourner immédiatement.</>,
            <>Lancer un fetch en arrière-plan (silencieux).</>,
            <>Si la nouvelle data diffère, mettre à jour state + localStorage.</>,
            <>L'utilisateur voit le contenu instantanément, et la fraîcheur arrive en quelques ms.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Patterns d'invalidation" eyebrow="Maintenance">
      <DocSubsection title="Invalider après mutation">
        <DocCode lang="typescript">{`async function publishArticle(id: string) {
  await supabase.from("articles").update({ status: "published" }).eq("id", id);

  // 1. Invalider le cache local
  mutate(undefined, { revalidate: true });

  // 2. Invalider le cache CDN (Next.js revalidatePath)
  await fetch("/api/revalidate?path=/savoir", { method: "POST" });

  // 3. Le cache localStorage des autres clients sera périmé naturellement (TTL)
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Invalidation cross-tab">
        <DocP>
          Pour propager une invalidation entre onglets (ex: user déconnecté dans un
          onglet, doit l'être partout), utiliser <DocInline>BroadcastChannel</DocInline>.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Anti-patterns" eyebrow="Erreurs courantes">
      <DocCallout type="error" title="❌ À proscrire">
        <DocList
          items={[
            <>Stocker des objets gigantesques en localStorage (limite 5-10 MB selon nav).</>,
            <>Cache sans TTL (« cache d'éternité » = bombe à retardement).</>,
            <>Mettre des PII (email, token) dans des caches non sécurisés.</>,
            <>Cache sur mutations (« optimisation prématurée » qui crée des incohérences).</>,
            <>Oublier l'invalidation après changement de schéma → bumper APP_VERSION.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Mesure & monitoring" eyebrow="Observabilité">
      <DocList
        items={[
          <>Logger <DocInline>cache_hit_rate</DocInline> et <DocInline>cache_miss_count</DocInline> via PostHog.</>,
          <>Lighthouse Performance pour mesurer LCP avec/sans cache.</>,
          <>Network tab Chrome : voir « (from disk cache) » sur les bonnes ressources.</>,
        ]}
      />
    </DocSection>
  </>
);
