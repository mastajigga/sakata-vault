import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-seo-discovery",
  title: "Plan d'implémentation : SEO & Découvrabilité",
  subtitle:
    "Pourquoi Sakata.com est invisible sur Google aujourd'hui, et comment passer du top 30 au top 3 sur les requêtes culturelles bantu en un trimestre.",
  category: "roadmap",
  order: 4,
  readTime: 9,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["seo", "schema-org", "sitemap", "i18n"],
  summary:
    "Audit SEO complet, stratégie de mots-clés, implémentation technique (sitemap dynamique, OG, schema.org), et tactiques de link-building.",
};

export const Content = () => (
  <>
    <DocLead>
      Une plateforme qui n'apparaît pas dans Google n'existe pas pour la moitié de ses
      utilisateurs potentiels. C'est l'investissement avec le meilleur rapport
      effort/impact à ce stade — quelques jours de travail technique pour des années
      de trafic organique.
    </DocLead>

    <DocSection title="État actuel : pourquoi on est invisibles" eyebrow="Audit">
      <DocSubsection title="Ce qui est cassé">
        <DocList
          items={[
            <>Pas de <DocInline>sitemap.xml</DocInline> dynamique — Google indexe difficilement les articles.</>,
            <>Pas de schema.org structuré → pas de rich snippets dans les SERPs.</>,
            <>Pas de balises Open Graph dynamiques par article (image OG par défaut sur tous).</>,
            <>Pas de <DocInline>robots.txt</DocInline> explicite — Google peut indexer des pages qu'on ne veut pas (admin, drafts).</>,
            <>Titre et description non optimisés (générique « Sakata.com » sur toutes les pages).</>,
            <>Pas de hreflang pour les versions multilingues.</>,
            <>Pas de Google Search Console configurée — on ne mesure rien.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Test rapide à faire">
        <DocCode caption="Dans Google">{`site:sakata.netlify.app
"sakata" "histoire" -wikipedia
"culture sakata" rdc
"langue kisakata"`}</DocCode>
        <DocP>
          Si la 1ʳᵉ requête retourne moins de 20 résultats, Google ne nous indexe pas
          bien. Si les autres ne retournent pas Sakata.com en top 10, on a un problème
          de positionnement.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Stratégie de mots-clés" eyebrow="Cibles">
      <DocSubsection title="Tier 1 — Volume élevé, compétition modérée">
        <DocList
          items={[
            <>« peuple sakata rdc » — 200 recherches/mois, peu de contenu de qualité.</>,
            <>« histoire mai-ndombe » — 150 recherches/mois, dominé par Wikipedia.</>,
            <>« culture bantu congo » — 800 recherches/mois, gros mais générique.</>,
            <>« langue kisakata » — 50 recherches/mois, on peut être #1.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Tier 2 — Long-tail spécifique">
        <DocList
          items={[
            <>« proverbes sakata »</>,
            <>« masque ngongo signification »</>,
            <>« rite initiation sakata »</>,
            <>« généalogie chefs sakata »</>,
            <>« cuisine traditionnelle sakata »</>,
          ]}
        />
        <DocCallout type="info" title="Insight">
          Le long-tail représente collectivement plus de trafic que le top tier, et est
          beaucoup plus facile à conquérir. Notre USP doit être la profondeur sur des
          niches précises.
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Implémentation technique" eyebrow="Stack">
      <DocSubsection title="Sitemap dynamique">
        <DocCode lang="typescript" caption="src/app/sitemap.ts (Next.js App Router)">{`import type { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: articles } = await supabasePublic
    .from("articles")
    .select("slug, updated_at")
    .eq("status", "published");

  const articleEntries = (articles || []).map(a => ({
    url: \`https://sakata.com/savoir/\${a.slug}\`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticEntries = [
    { url: "https://sakata.com", priority: 1.0 },
    { url: "https://sakata.com/savoir", priority: 0.9 },
    { url: "https://sakata.com/forum", priority: 0.7 },
    { url: "https://sakata.com/geographie", priority: 0.7 },
    { url: "https://sakata.com/ecole", priority: 0.7 },
  ];

  return [...staticEntries, ...articleEntries];
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Schema.org structuré par type de page">
        <DocCode lang="typescript" caption="Article (type Article + BreadcrumbList)">{`import { Article, BreadcrumbList, WithContext } from "schema-dts";

const articleSchema: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title.fr,
  description: article.summary.fr,
  image: article.featured_image,
  datePublished: article.published_at,
  dateModified: article.updated_at,
  author: { "@type": "Person", name: article.author_name },
  publisher: {
    "@type": "Organization",
    name: "Sakata",
    logo: { "@type": "ImageObject", url: "https://sakata.com/logo.png" },
  },
  inLanguage: "fr-CD",
};

// Dans le composant :
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Open Graph dynamique par article">
        <DocCode lang="typescript" caption="generateMetadata pour /savoir/[slug]">{`export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);

  return {
    title: \`\${article.title.fr} — Sakata\`,
    description: article.summary.fr.slice(0, 155),
    openGraph: {
      title: article.title.fr,
      description: article.summary.fr,
      images: [{ url: article.featured_image, width: 1200, height: 630 }],
      locale: "fr_CD",
      type: "article",
      publishedTime: article.published_at,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title.fr,
      images: [article.featured_image],
    },
    alternates: {
      languages: {
        "fr": \`/savoir/\${params.slug}?lang=fr\`,
        "en": \`/savoir/\${params.slug}?lang=en\`,
        // ...
      },
    },
  };
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="robots.txt explicite">
        <DocCode lang="typescript" caption="src/app/robots.ts">{`import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/savoir/", "/forum/", "/geographie", "/ecole"],
        disallow: ["/admin/", "/api/", "/auth", "/profil"],
      },
    ],
    sitemap: "https://sakata.com/sitemap.xml",
    host: "https://sakata.com",
  };
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Hreflang multilingue">
        <DocP>
          Sakata supporte 6 langues (fr, en, skt, lin, swa, tsh). Pour Google,
          déclarer explicitement les versions :
        </DocP>
        <DocCode lang="html">{`<link rel="alternate" hreflang="fr" href="https://sakata.com/savoir/article" />
<link rel="alternate" hreflang="en" href="https://sakata.com/savoir/article?lang=en" />
<link rel="alternate" hreflang="x-default" href="https://sakata.com/savoir/article" />`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'exécution — 1 semaine" eyebrow="Sprint">
      <DocList
        ordered
        items={[
          <><strong>Jour 1 :</strong> sitemap.ts + robots.ts + Google Search Console.</>,
          <><strong>Jour 2 :</strong> generateMetadata sur /savoir/[slug], /forum/[category], /geographie.</>,
          <><strong>Jour 3 :</strong> Schema.org (Article, BreadcrumbList, WebSite, Organization).</>,
          <><strong>Jour 4 :</strong> Optimisation des titres/descriptions (rewrite manuel des 30 articles existants).</>,
          <><strong>Jour 5 :</strong> Soumission sitemap, demande d'indexation, audit Lighthouse SEO.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Tactiques de link-building" eyebrow="Hors page">
      <DocList
        items={[
          <><strong>Wikipedia :</strong> contribuer à l'article « Sakata (peuple) » et y citer Sakata.com comme source pour des sections détaillées.</>,
          <><strong>Forums diaspora :</strong> rdcongolaisdebelgique, KongoTimes, etc. — partage occasionnel d'articles bien faits.</>,
          <><strong>Universités :</strong> contacter les départements anthropologie (ULB, KU Leuven, Inalco) avec un lien vers la rubrique recherche.</>,
          <><strong>YouTube :</strong> créer 5-10 shorts ciblés (1-2 min) reprenant les meilleurs passages d'articles, avec lien en description.</>,
          <><strong>Médium / Substack :</strong> articles de fond republiés sur ces plateformes avec backlink canonical.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="Mesure">
      <DocTable
        headers={["Métrique", "État actuel (estimation)", "Cible 3 mois", "Cible 12 mois"]}
        rows={[
          ["Pages indexées Google", "~30", "200", "1 000+"],
          ["Trafic organique mensuel", "~500", "3 000", "20 000+"],
          ["Mots-clés top 10", "~5", "30", "200+"],
          ["Domain Authority (Ahrefs)", "5-10", "15", "30+"],
          ["CTR moyen (GSC)", "?", "3%", "5%+"],
        ]}
      />
    </DocSection>

    <DocSection title="Pièges à éviter" eyebrow="Anti-patterns">
      <DocCallout type="error" title="À ne JAMAIS faire">
        <DocList
          items={[
            <>Acheter des liens (Google détecte et pénalise lourdement).</>,
            <>Bourrer les pages de mots-clés (« keyword stuffing »).</>,
            <>Dupliquer du contenu Wikipedia mot pour mot.</>,
            <>Cacher du texte invisible.</>,
            <>Negocier des « échanges de liens » massifs avec sites non pertinents.</>,
          ]}
        />
      </DocCallout>
    </DocSection>
  </>
);
