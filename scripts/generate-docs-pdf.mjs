#!/usr/bin/env node
/**
 * Pre-generate PDF files for every admin documentation entry.
 *
 * Usage:
 *   1. Make sure the dev server is running on http://localhost:3000
 *   2. Run: node scripts/generate-docs-pdf.mjs
 *
 * Output:
 *   public/docs/<slug>.pdf
 *
 * The script reads the doc registry, navigates to /docs/<slug> (public mirror),
 * waits for full render, and uses Playwright's native page.pdf() with print
 * media emulation to produce a true vector PDF.
 */

import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─────────────────────────────────────────────
// 1. Load the doc registry (TS) by parsing it shallowly
//    We could compile via tsx, but reading slugs from filenames is simpler
// ─────────────────────────────────────────────
async function getDocSlugs() {
  const contentDir = path.join(ROOT, "src", "lib", "admin-docs", "content");
  const files = await fs.readdir(contentDir);
  return files
    .filter((f) => f.endsWith(".tsx"))
    .map((f) => f.replace(/\.tsx$/, ""))
    .map((basename) => {
      // The slug in DocMeta is the same as filename basename
      return basename;
    });
}

const BASE_URL = process.env.DOC_BASE_URL || "http://localhost:3000";
const OUT_DIR = path.join(ROOT, "public", "docs");

async function main() {
  const allSlugs = await getDocSlugs();

  // Allow filtering: node generate-docs-pdf.mjs --only=feature-video-upload
  const onlyArg = process.argv.find((a) => a.startsWith("--only="));
  const onlySlug = onlyArg ? onlyArg.split("=")[1] : null;
  const slugs = onlySlug ? allSlugs.filter((s) => s === onlySlug) : allSlugs;

  if (slugs.length === 0) {
    console.error(`❌ No matching slug for "${onlySlug}"`);
    process.exit(1);
  }
  console.log(`📚 Generating ${slugs.length}/${allSlugs.length} document(s).\n`);

  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1024 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Force print-media CSS (matches what browser does for print preview)
  await page.emulateMedia({ media: "print" });

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const slug of slugs) {
    const url = `${BASE_URL}/docs/${slug}`;
    const out = path.join(OUT_DIR, `${slug}.pdf`);
    process.stdout.write(`📄 ${slug.padEnd(45, " ")} `);

    try {
      const response = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      if (!response || response.status() >= 400) {
        throw new Error(`HTTP ${response?.status() ?? "no response"}`);
      }

      // Wait for fonts
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);

      await page.pdf({
        path: out,
        format: "A4",
        margin: {
          top: "18mm",
          right: "16mm",
          bottom: "22mm",
          left: "16mm",
        },
        printBackground: false,
        preferCSSPageSize: false,
        displayHeaderFooter: true,
        footerTemplate: `<div style="font-size:9px;color:#888;width:100%;text-align:center;padding:0 16mm;">
          Sakata.com — Documentation interne · ${slug} ·
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`,
        headerTemplate: `<div style="font-size:9px;color:#aaa;width:100%;text-align:right;padding:0 16mm;">
          Confidentiel
        </div>`,
      });

      const stat = await fs.stat(out);
      const sizeKb = (stat.size / 1024).toFixed(0);
      console.log(`✅ ${sizeKb} KB`);
      success++;
    } catch (err) {
      console.log(`❌ ${err.message}`);
      failed++;
      failures.push({ slug, error: err.message });
    }
  }

  await browser.close();

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ ${success} PDFs générés`);
  if (failed > 0) {
    console.log(`❌ ${failed} échecs :`);
    failures.forEach((f) => console.log(`   - ${f.slug}: ${f.error}`));
  }
  console.log(`📂 Sortie : ${OUT_DIR}`);

  // Génération d'un manifest pour le DocLayout
  const manifest = {
    generated_at: new Date().toISOString(),
    base_url: BASE_URL,
    documents: slugs.map((slug) => ({
      slug,
      pdf_path: `/docs/${slug}.pdf`,
    })),
  };
  await fs.writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`📋 Manifest : ${path.join(OUT_DIR, "manifest.json")}`);

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("❌ Erreur fatale :", err);
  process.exit(1);
});
