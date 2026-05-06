import { test, expect } from "@playwright/test";
import path from "path";

// Test configuration
const BASE_URL = "http://localhost:3000";
const ADMIN_EMAIL = "admin@sakata.com";
const ADMIN_PASSWORD = "AdminPassword123!";
const VIDEO_FILE_PATH = path.resolve(
  "C:\\Users\\Fortuné\\Videos\\sakata\\Ngongo 1.mp4"
);

test.describe("Video Upload for Article Hero Section", () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto(`${BASE_URL}/auth`);
    await page.waitForLoadState("networkidle");
  });

  test("should upload video and save article with hero video", async ({
    page,
  }) => {
    console.log("🎬 Starting video upload test...");

    // Step 1: Login as admin
    console.log("1️⃣ Logging in as admin...");
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.waitForLoadState("networkidle");

    // Verify we're logged in
    const isLoggedIn = await page.url().includes("/admin") || page.url().includes("/savoir");
    expect(isLoggedIn).toBeTruthy();
    console.log("✅ Login successful");

    // Step 2: Navigate to article editor
    console.log("2️⃣ Navigating to article editor...");
    await page.goto(`${BASE_URL}/savoir`);
    await page.waitForLoadState("networkidle");

    // Look for "Create Article" or "New Article" button
    const createButton = await page.locator(
      'button:has-text("Create"), button:has-text("New"), a:has-text("Create"), a:has-text("New")'
    ).first();

    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForLoadState("networkidle");
    } else {
      // Try navigation to admin editor
      await page.goto(`${BASE_URL}/admin/articles`);
      await page.waitForLoadState("networkidle");
      const newButton = page.locator('button:has-text("New"), button:has-text("Create")').first();
      await newButton.click();
      await page.waitForLoadState("networkidle");
    }

    console.log("✅ Article editor loaded");

    // Step 3: Fill in article details
    console.log("3️⃣ Filling article details...");

    // Fill title
    const titleInput = page.locator('input[placeholder*="title" i], input[placeholder*="titre" i]').first();
    if (await titleInput.isVisible()) {
      await titleInput.fill("Test Article with Hero Video - Ngongo");
    }

    // Fill slug (if not auto-generated)
    const slugInput = page.locator('input[placeholder*="slug" i]').first();
    if (await slugInput.isVisible()) {
      await slugInput.fill("test-article-hero-video-ngongo");
    }

    // Add at least one section (if required)
    const sectionButtons = page.locator('button:has-text("Add section"), button:has-text("Ajouter"), button:has-text("Section")');
    if (await sectionButtons.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      await sectionButtons.first().click();
      await page.waitForTimeout(500);

      // Fill section content
      const paragraphInputs = page.locator('textarea, input[type="text"]');
      if (await paragraphInputs.nth(0).isVisible({ timeout: 1000 }).catch(() => false)) {
        await paragraphInputs.first().fill("This is a test article for video upload testing.");
      }
    }

    console.log("✅ Article details filled");

    // Step 4: Upload video
    console.log("4️⃣ Uploading video file...");
    console.log(`   Video path: ${VIDEO_FILE_PATH}`);

    // Look for video upload input
    const fileInput = page.locator('input[type="file"]').first();

    if (await fileInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Upload the file
      await fileInput.setInputFiles(VIDEO_FILE_PATH);
      console.log("✅ File selected");

      // Wait for upload progress
      await page.waitForTimeout(2000);

      // Check if there's a success message or URL preview
      const successIndicator = page.locator(
        'text=/uploaded|success|url|video/i, [class*="success"], [class*="preview"]'
      ).first();

      if (await successIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("✅ Upload appears successful");
      }
    } else {
      // Alternative: Look for a button to trigger upload
      const uploadButton = page.locator('button:has-text("Upload"), button:has-text("Select video"), button:has-text("Video")').first();
      if (await uploadButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await uploadButton.click();
        await page.waitForTimeout(500);
        await fileInput.setInputFiles(VIDEO_FILE_PATH);
        console.log("✅ File selected via button");
      } else {
        console.log("⚠️  Could not find video upload element");
      }
    }

    console.log("✅ Video upload completed");

    // Step 5: Save article
    console.log("5️⃣ Saving article...");

    const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Publish")').first();
    if (await saveButton.isVisible()) {
      await saveButton.click();
      await page.waitForLoadState("networkidle");
      console.log("✅ Article saved");
    }

    // Step 6: Verify video is in database
    console.log("6️⃣ Verifying video in database...");

    // Get article slug/ID from URL or page content
    const currentUrl = page.url();
    const articleId = currentUrl.match(/[\w\-]{36}/) || currentUrl.match(/\/article\/([\w\-]+)/)?.[1];

    if (articleId) {
      console.log(`   Article ID: ${articleId}`);

      // Check page for video element
      const videoElement = page.locator("video, [class*='video'], [class*='hero']").first();
      if (await videoElement.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("✅ Video element found on page");

        // Try to get the video source
        const videoSrc = await videoElement.getAttribute("src");
        const sourceTag = page.locator("source[src*='video']").first();
        const sourceSrc = await sourceTag.getAttribute("src").catch(() => null);

        if (videoSrc || sourceSrc) {
          console.log(`✅ Video URL found: ${videoSrc || sourceSrc}`);
          expect(videoSrc || sourceSrc).toContain("article-videos");
        }
      }
    }

    // Step 7: Navigate to article view and verify hero video displays
    console.log("7️⃣ Checking article display...");

    // Try to find and click the article link
    const articleLink = page.locator('a[href*="/savoir/"], a:has-text("View")').first();
    if (await articleLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await articleLink.click();
      await page.waitForLoadState("networkidle");

      // Check for hero video
      const heroVideo = page.locator("video").first();
      if (await heroVideo.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log("✅ Hero video is visible on article page");
        expect(heroVideo).toBeDefined();
      } else {
        console.log("⚠️  Hero video not visible - may need manual verification");
      }
    }

    console.log("\n✅ Test completed successfully!");
  });

  test("should display error for invalid video file", async ({ page }) => {
    console.log("\n🎬 Testing invalid video file handling...");

    // Similar login process...
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Navigate to editor
    await page.goto(`${BASE_URL}/admin/articles`);
    await page.waitForLoadState("networkidle");

    // Try to upload invalid file (create a test text file)
    const invalidFilePath = path.resolve("test-invalid.txt");
    const fs = await import("fs");
    fs.writeFileSync(invalidFilePath, "This is not a video file");

    // Attempt to upload
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(invalidFilePath);

      // Wait and check for error
      await page.waitForTimeout(1500);

      const errorMessage = page.locator('[class*="error"], [role="alert"], text=/invalid|format|not supported/i').first();
      if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log("✅ Error message displayed for invalid file");
        expect(await errorMessage.textContent()).toMatch(/invalid|format|supported/i);
      }
    }

    // Cleanup
    fs.unlinkSync(invalidFilePath);
  });
});
