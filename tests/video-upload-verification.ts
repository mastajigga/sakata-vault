/**
 * Video Upload Feature - Complete Verification Test
 * Tests all components of the hero video upload feature
 * Date: 2026-04-26
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import * as path from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const VIDEO_FILE = "C:\\Users\\Fortuné\\Videos\\sakata\\Ngongo 1.mp4";

interface TestResult {
  name: string;
  status: "✅" | "❌";
  message: string;
}

const results: TestResult[] = [];

async function runTests() {
  console.log("\n" + "=".repeat(70));
  console.log("🎬 VIDEO UPLOAD FEATURE - VERIFICATION TEST SUITE");
  console.log("=".repeat(70) + "\n");

  // Initialize Supabase Admin Client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Test 1: Check if storage bucket exists
  console.log("Test 1: Checking Storage Bucket...");
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === "article-videos");

    if (bucketExists) {
      results.push({
        name: "Storage Bucket (article-videos)",
        status: "✅",
        message: "Bucket exists in Supabase Storage",
      });
      console.log("✅ Bucket 'article-videos' exists\n");
    } else {
      results.push({
        name: "Storage Bucket (article-videos)",
        status: "❌",
        message: `Bucket not found. Available: ${buckets?.map((b) => b.name).join(", ")}`,
      });
      console.log("❌ Bucket 'article-videos' not found\n");
    }
  } catch (error) {
    results.push({
      name: "Storage Bucket",
      status: "❌",
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
    console.log("❌ Error checking bucket\n");
  }

  // Test 2: Check if hero_video_url column exists
  console.log("Test 2: Checking Database Schema...");
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("hero_video_url")
      .limit(1);

    if (!error) {
      results.push({
        name: "Database Column (hero_video_url)",
        status: "✅",
        message: "Column exists in articles table",
      });
      console.log("✅ Column 'hero_video_url' exists in articles table\n");
    } else {
      results.push({
        name: "Database Column (hero_video_url)",
        status: "❌",
        message: `Column not found: ${error.message}`,
      });
      console.log("❌ Column 'hero_video_url' not found\n");
    }
  } catch (error) {
    results.push({
      name: "Database Column",
      status: "❌",
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
    console.log("❌ Error checking column\n");
  }

  // Test 3: Check video file exists
  console.log("Test 3: Checking Video File...");
  try {
    const fileExists = readFileSync(VIDEO_FILE);
    const sizeInMB = fileExists.length / 1024 / 1024;

    if (sizeInMB < 50) {
      results.push({
        name: "Video File (Ngongo 1.mp4)",
        status: "✅",
        message: `File exists (${sizeInMB.toFixed(2)}MB, under 50MB limit)`,
      });
      console.log(`✅ Video file exists (${sizeInMB.toFixed(2)}MB)\n`);
    } else {
      results.push({
        name: "Video File",
        status: "❌",
        message: `File too large: ${sizeInMB.toFixed(2)}MB (max 50MB)`,
      });
      console.log(`❌ File too large: ${sizeInMB.toFixed(2)}MB\n`);
    }
  } catch (error) {
    results.push({
      name: "Video File",
      status: "❌",
      message: `File not found: ${VIDEO_FILE}`,
    });
    console.log(`❌ Video file not found at ${VIDEO_FILE}\n`);
  }

  // Test 4: Check API route file exists and has correct imports
  console.log("Test 4: Checking API Route Configuration...");
  try {
    const routePath = path.resolve(
      "src/app/api/admin/articles/upload-hero-video/route.ts"
    );
    const routeContent = readFileSync(routePath, "utf-8");

    const checks = {
      hasJwtImport: routeContent.includes('from "jose"'),
      hasJwtVerify: routeContent.includes("jwtVerify"),
      hasDBBucketsImport: routeContent.includes("DB_BUCKETS"),
      hasArticleVideosBucket: routeContent.includes(
        "DB_BUCKETS.ARTICLE_VIDEOS"
      ),
      hasAuthCheck: routeContent.includes("Authorization"),
      hasRoleCheck:
        routeContent.includes('"admin"') || routeContent.includes('"manager"'),
      hasVideoValidation: routeContent.includes("ALLOWED_FORMATS"),
    };

    const allPassed = Object.values(checks).every((v) => v);

    results.push({
      name: "API Route Configuration",
      status: allPassed ? "✅" : "❌",
      message: `Imports: ${checks.hasJwtImport ? "✅" : "❌"} | JWT: ${
        checks.hasJwtVerify ? "✅" : "❌"
      } | Bucket: ${checks.hasArticleVideosBucket ? "✅" : "❌"} | Auth: ${
        checks.hasAuthCheck ? "✅" : "❌"
      } | Role: ${checks.hasRoleCheck ? "✅" : "❌"} | Validation: ${
        checks.hasVideoValidation ? "✅" : "❌"
      }`,
    });

    console.log(
      allPassed ? "✅ API route properly configured\n" : "❌ API route issues found\n"
    );
  } catch (error) {
    results.push({
      name: "API Route",
      status: "❌",
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
    console.log("❌ Error checking API route\n");
  }

  // Test 5: Check React hook
  console.log("Test 5: Checking useArticleEditor Hook...");
  try {
    const hookPath = path.resolve("src/hooks/useArticleEditor.ts");
    const hookContent = readFileSync(hookPath, "utf-8");

    const checks = {
      hasUploadVideo: hookContent.includes("uploadVideo"),
      hasHeroVideoUrl: hookContent.includes("heroVideoUrl"),
      hasBearerToken: hookContent.includes("Bearer"),
      hasSaveArticle: hookContent.includes("saveArticle"),
      savesVideoUrl: hookContent.includes("hero_video_url"),
    };

    const allPassed = Object.values(checks).every((v) => v);

    results.push({
      name: "useArticleEditor Hook",
      status: allPassed ? "✅" : "❌",
      message: `Upload: ${checks.hasUploadVideo ? "✅" : "❌"} | State: ${
        checks.hasHeroVideoUrl ? "✅" : "❌"
      } | Auth: ${checks.hasBearerToken ? "✅" : "❌"} | Save: ${
        checks.hasSaveArticle ? "✅" : "❌"
      } | DB Save: ${checks.savesVideoUrl ? "✅" : "❌"}`,
    });

    console.log(
      allPassed ? "✅ Hook properly configured\n" : "❌ Hook issues found\n"
    );
  } catch (error) {
    results.push({
      name: "useArticleEditor Hook",
      status: "❌",
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
    console.log("❌ Error checking hook\n");
  }

  // Print Summary Report
  console.log("=".repeat(70));
  console.log("📋 TEST RESULTS SUMMARY");
  console.log("=".repeat(70) + "\n");

  results.forEach((result) => {
    console.log(`${result.status} ${result.name}`);
    console.log(`   └─ ${result.message}\n`);
  });

  const passed = results.filter((r) => r.status === "✅").length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log("=".repeat(70));
  console.log(
    `Result: ${passed}/${total} tests passed (${percentage}%)`
  );

  if (percentage === 100) {
    console.log("🎉 ALL SYSTEMS GO! Video upload infrastructure is ready.");
    console.log("\n📝 Next Steps:");
    console.log("1. Start dev server: npm run dev");
    console.log("2. Log in as admin at /auth");
    console.log("3. Navigate to article editor");
    console.log("4. Upload video and save article");
    console.log("5. Verify hero video displays on article page");
  } else {
    console.log("⚠️  Some issues detected. Check details above.");
  }

  console.log("=".repeat(70) + "\n");
}

runTests().catch(console.error);
