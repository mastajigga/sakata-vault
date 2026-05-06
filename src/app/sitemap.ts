import type { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabase/admin";
import { DB_TABLES } from "@/lib/constants/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sakata.com";

  // --- Static pages (always included) ---
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/savoir`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/langue`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/ecole`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/geographie`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/forum`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${baseUrl}/membres`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${baseUrl}/premium`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/contributeur`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/help/philosophy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/help/stack`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/help/changelog`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/help/guidelines`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${baseUrl}/help/gdpr`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  // --- Dynamic: Published articles ---
  let articlePages: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabasePublic
      .from(DB_TABLES.ARTICLES)
      .select("slug, updated_at, status")
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (articles) {
      articlePages = articles.map((a: { slug: string; updated_at: string | null }) => ({
        url: `${baseUrl}/savoir/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn("[sitemap] Failed to fetch articles:", err);
  }

  // --- Dynamic: Forum categories ---
  let categoryPages: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await supabasePublic
      .from(DB_TABLES.FORUM_CATEGORIES)
      .select("slug, updated_at")
      .order("updated_at", { ascending: false });

    if (categories) {
      categoryPages = categories.map((c: { slug: string; updated_at: string | null }) => ({
        url: `${baseUrl}/forum/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.warn("[sitemap] Failed to fetch forum categories:", err);
  }

  // --- Dynamic: Forum threads ---
  let threadPages: MetadataRoute.Sitemap = [];
  try {
    const { data: threads } = await supabasePublic
      .from(DB_TABLES.FORUM_THREADS)
      .select("slug, updated_at")
      .order("updated_at", { ascending: false })
      .limit(200); // Limit to avoid massive sitemaps

    if (threads) {
      threadPages = threads.map((t: { slug: string; updated_at: string | null }) => ({
        url: `${baseUrl}/forum/thread/${t.slug}`,
        lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      }));
    }
  } catch (err) {
    console.warn("[sitemap] Failed to fetch forum threads:", err);
  }

  return [...staticPages, ...articlePages, ...categoryPages, ...threadPages];
}
