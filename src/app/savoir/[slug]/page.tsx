import type { Metadata } from "next";
import { supabasePublic } from "@/lib/supabase/admin";
import { ARTICLES } from "@/data/articles";
import { ArticleData } from "@/types/i18n";
import { DB_TABLES } from "@/lib/constants/db";
import ArticleClient from "./ArticleClient";

// ── Shared helpers ──
const BASE_URL = "https://sakata.com";

function getBestString(obj: Record<string, string> | null | undefined, fallback: string): string {
  if (!obj) return fallback;
  return obj.fr || obj.en || Object.values(obj)[0] || fallback;
}

type ArticleRow = Record<string, unknown> & {
  slug: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  category: string;
  featured_image?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
};

async function fetchArticle(slug: string): Promise<ArticleRow | null> {
  try {
    const { data } = await supabasePublic
      .from(DB_TABLES.ARTICLES)
      .select("slug, title, summary, content, category, featured_image, image, created_at, updated_at, status")
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
      status: "published",
    };
  }

  return null;
}

// ── generateMetadata (server-only) ──
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;

  let title = "Article | Sakata";
  let description = "Découvrez cet article de savoir ancestral sur Sakata.";
  let ogImage = "/og-image.png";
  let publishedTime: string | undefined;
  let modifiedTime: string | undefined;
  let category: string | undefined;

  const article = await fetchArticle(slug);

  if (article) {
    title = getBestString(article.title, title);
    description = getBestString(article.summary, description);
    category = article.category;
    ogImage = article.featured_image || article.image || ogImage;
    publishedTime = article.created_at || undefined;
    modifiedTime = article.updated_at || article.created_at || undefined;
  }

  // Ensure ogImage is absolute
  const imageUrl = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${BASE_URL}/savoir/${slug}`,
      siteName: "Sakata",
      locale: "fr_FR",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(category ? { section: category } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${BASE_URL}/savoir/${slug}`,
      languages: {
        fr: `${BASE_URL}/savoir/${slug}`,
        en: `${BASE_URL}/savoir/${slug}?lang=en`,
        ...({
          lin: `${BASE_URL}/savoir/${slug}?lang=lin`,
          swa: `${BASE_URL}/savoir/${slug}?lang=swa`,
          tsh: `${BASE_URL}/savoir/${slug}?lang=tsh`,
        } as Record<string, string>),
      },
    },
    other: {
      "article:published_time": publishedTime || "",
      "article:modified_time": modifiedTime || "",
      "article:section": category || "",
    },
  };
}

// ── Schema.org Article JSON-LD ──
function ArticleSchema({
  title, description, image, publishedTime, modifiedTime, slug, category,
}: {
  title: string; description: string; image: string; publishedTime?: string;
  modifiedTime?: string; slug: string; category?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: { "@type": "Organization", name: "Sakata" },
    publisher: {
      "@type": "Organization",
      name: "Sakata",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icons/icon-512.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/savoir/${slug}` },
    ...(category ? { articleSection: category } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── BreadcrumbList Schema ──
function BreadcrumbSchema({ title, slug }: { title: string; slug: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Savoir", item: `${BASE_URL}/savoir` },
      { "@type": "ListItem", position: 3, name: title, item: `${BASE_URL}/savoir/${slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Page (server component) ──
export default async function ArticlePage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const slug = params.slug;
  const article = await fetchArticle(slug);

  const title = article ? getBestString(article.title, "Article") : "Article";
  const description = article ? getBestString(article.summary, "") : "";
  const image = article?.featured_image || article?.image || "/og-image.png";

  return (
    <>
      <ArticleSchema
        title={title}
        description={description}
        image={image.startsWith("http") ? image : `${BASE_URL}${image}`}
        publishedTime={article?.created_at}
        modifiedTime={article?.updated_at}
        slug={slug}
        category={article?.category}
      />
      <BreadcrumbSchema title={title} slug={slug} />
      <ArticleClient initialArticle={article as ArticleData | null} />
    </>
  );
}
