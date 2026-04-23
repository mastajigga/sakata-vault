import { MetadataRoute } from "next";
import { supabasePublic } from "@/lib/supabase/admin";
import { DB_TABLES } from "@/lib/constants/db";

const BASE_URL = "https://sakata-basakata.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  { url: `${BASE_URL}/savoir`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/forum`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/membres`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
  { url: `${BASE_URL}/geographie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/ecole`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/help/philosophy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  { url: `${BASE_URL}/help/stack`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/help/guidelines`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/help/gdpr`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch published articles
  const { data: articles } = await supabasePublic
    .from(DB_TABLES.ARTICLES)
    .select("slug, updated_at, created_at")
    .order("created_at", { ascending: false });

  const articleRoutes: MetadataRoute.Sitemap = (articles || []).map((article) => ({
    url: `${BASE_URL}/savoir/${article.slug}`,
    lastModified: new Date(article.updated_at || article.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Fetch public forum threads
  const { data: threads } = await supabasePublic
    .from(DB_TABLES.FORUM_THREADS)
    .select("slug, updated_at, created_at")
    .eq("is_locked", false)
    .order("created_at", { ascending: false })
    .limit(200);

  const threadRoutes: MetadataRoute.Sitemap = (threads || []).map((thread) => ({
    url: `${BASE_URL}/forum/thread/${thread.slug}`,
    lastModified: new Date(thread.updated_at || thread.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...STATIC_ROUTES, ...articleRoutes, ...threadRoutes];
}
