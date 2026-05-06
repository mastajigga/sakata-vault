import { supabasePublic } from "@/lib/supabase/admin";
import { DB_TABLES } from "@/lib/constants/db";
import { ARTICLES } from "@/data/articles";
import { ArticleData } from "@/types/i18n";

const BASE_URL = "https://sakata.com";

interface ArticleRow {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  category: string;
  featured_image?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

async function getArticle(slug: string): Promise<ArticleRow | null> {
  try {
    const { data } = await supabasePublic
      .from(DB_TABLES.ARTICLES)
      .select("slug, title, summary, category, featured_image, image, created_at, updated_at")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) return data as ArticleRow;
  } catch {
    // Fallback to static
  }

  const staticArticle = ARTICLES.find((a) => a.slug === slug) as ArticleData | undefined;
  if (staticArticle) {
    return {
      slug: staticArticle.slug,
      title: staticArticle.title as unknown as Record<string, string>,
      summary: staticArticle.summary as unknown as Record<string, string>,
      category: staticArticle.category,
      featured_image: staticArticle.featured_image,
      image: staticArticle.image,
      created_at: staticArticle.created_at,
      updated_at: undefined,
    };
  }

  return null;
}

function getBestString(obj: Record<string, string> | null | undefined, fallback: string): string {
  if (!obj) return fallback;
  return obj.fr || obj.en || Object.values(obj)[0] || fallback;
}

export default async function ArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  const articleTitle = getBestString(article?.title, "Article");
  const articleSummary = getBestString(article?.summary, "Découvrez cet article de savoir ancestral.");
  const articleImage = article?.featured_image || article?.image || "/og-image.png";
  const imageUrl = articleImage.startsWith("http") ? articleImage : `${BASE_URL}${articleImage}`;
  const datePublished = article?.created_at || new Date().toISOString();
  const dateModified = article?.updated_at || article?.created_at || datePublished;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleTitle,
    description: articleSummary,
    image: imageUrl,
    author: {
      "@type": "Organization",
      name: "Sakata.com",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Sakata",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icons/icon-512.png`,
      },
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/savoir/${slug}`,
    },
    inLanguage: "fr",
    ...(article?.category
      ? { articleSection: article.category }
      : {}),
  };

  return (
    <>
      {/* Schema.org Article JSON-LD — server-rendered for crawlers */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
