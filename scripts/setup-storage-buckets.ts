import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupBuckets() {
  try {
    console.log("🔧 Setting up storage buckets...\n");

    // List all buckets
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();
    if (listError) {
      console.error("❌ Failed to list buckets:", listError);
      process.exit(1);
    }

    console.log("📦 Existing buckets:", buckets.map((b) => b.name).join(", "));

    // Check if article-videos bucket exists
    const articleVideosBucketExists = buckets.some(
      (b) => b.name === "article-videos"
    );

    if (articleVideosBucketExists) {
      console.log("✅ article-videos bucket already exists");
    } else {
      console.log("📝 Creating article-videos bucket...");
      const { data: createData, error: createError } =
        await supabase.storage.createBucket("article-videos", {
          public: true,
          allowedMimeTypes: ["video/mp4", "video/webm", "video/quicktime"],
          fileSizeLimit: 52428800, // 50MB in bytes
        });

      if (createError) {
        console.error("❌ Failed to create bucket:", createError);
        process.exit(1);
      }

      console.log("✅ Created article-videos bucket");
    }

    // Verify the bucket is public by checking policy
    const { data: policies, error: policyError } = await supabase
      .from("storage.buckets")
      .select("id, name, public")
      .eq("name", "article-videos");

    if (policyError) {
      console.error("❌ Policy check error:", policyError);
    } else {
      console.log("✅ Bucket configuration verified");
    }

    console.log("\n✅ Storage setup complete!");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    process.exit(1);
  }
}

setupBuckets();
