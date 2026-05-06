import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verify() {
  try {
    // Check if hero_video_url column exists
    const { data, error } = await supabase
      .from("articles")
      .select("hero_video_url")
      .limit(0);

    if (error) {
      console.error("❌ Column check failed:", error.message);
      console.log("\n📋 Column does NOT exist. Creating...");
      
      // Try to create the column using a query that won't fail if it exists
      const { error: createError } = await supabase.rpc("sql_exec", {
        query: `
          ALTER TABLE public.articles
          ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;
          
          COMMENT ON COLUMN public.articles.hero_video_url IS 'URL of the hero video for the article (stored in article-videos bucket)';
          
          CREATE INDEX IF NOT EXISTS idx_articles_hero_video_url 
          ON public.articles(hero_video_url) 
          WHERE hero_video_url IS NOT NULL;
        `,
      } as any);

      if (createError) {
        console.log("⚠️  RPC not available, but column check indicates it doesn't exist.");
      } else {
        console.log("✅ Column created/verified!");
      }
    } else {
      console.log("✅ Column hero_video_url EXISTS in articles table");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

verify();
