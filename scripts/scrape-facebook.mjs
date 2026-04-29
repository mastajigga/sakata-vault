#!/usr/bin/env node
/**
 * Facebook scraper for the Sakata corpus
 *
 * Scrapes posts from Facebook groups/pages/profiles using a persistent
 * Playwright session (you log in once, session is reused).
 *
 * USAGE:
 *
 *   # First time : open visible browser, log in manually, then ENTER:
 *   node scripts/scrape-facebook.mjs --setup
 *
 *   # Then scrape all configured targets:
 *   node scripts/scrape-facebook.mjs
 *
 *   # Or a single URL:
 *   node scripts/scrape-facebook.mjs --url https://www.facebook.com/groups/...
 *
 *   # Adjust scroll depth (default 30 = ~30-90 posts per page):
 *   node scripts/scrape-facebook.mjs --scrolls 50
 *
 * OUTPUT:
 *   data/scraped_fb_<timestamp>.json   — appendable to existing dataset
 *   data/scraped_fb_data.json          — merged + deduplicated cumulative
 *
 * SECURITY:
 *   The session is stored in ~/.sakata-fb-scraper/ (your local machine only).
 *   Never commit this directory.
 */

import { chromium } from "playwright";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";

// ─────────────────────────────────────────────
// Configuration — Sakata FB targets
// ─────────────────────────────────────────────
const TARGETS = [
  {
    url: "https://www.facebook.com/groups/508413489258998/",
    label: "Groupe Basakata 508413",
    type: "group",
  },
  {
    url: "https://www.facebook.com/groups/2623391397880027/",
    label: "Groupe Basakata 2623391",
    type: "group",
  },
  {
    url: "https://www.facebook.com/groups/258101250381809/",
    label: "Groupe Basakata 258101",
    type: "group",
  },
  {
    url: "https://www.facebook.com/groups/1444575149127305/",
    label: "Groupe Basakata 1444575",
    type: "group",
  },
  {
    url: "https://www.facebook.com/p/LES-Basakata-Questionsreponses-100067644754615/",
    label: "Page LES Basakata Questions/Réponses",
    type: "page",
  },
  {
    url: "https://www.facebook.com/people/BANA-Basakata-South-Africa/100071159959368/",
    label: "Profil BANA Basakata South Africa",
    type: "profile",
  },
];

// ─────────────────────────────────────────────
// Args parsing (zero-dep)
// ─────────────────────────────────────────────
const args = process.argv.slice(2);
const FLAGS = {
  setup: args.includes("--setup"),
  scrolls: parseInt(
    (args.find((a) => a.startsWith("--scrolls="))?.split("=")[1] ||
      args[args.indexOf("--scrolls") + 1]) ?? "30",
    10
  ),
  url: args.find((a) => a.startsWith("--url="))?.split("=")[1] ||
    (args.includes("--url") ? args[args.indexOf("--url") + 1] : null),
  headed: args.includes("--headed") || args.includes("--setup"),
};

// ─────────────────────────────────────────────
// Paths
// ─────────────────────────────────────────────
const SESSION_DIR = join(homedir(), ".sakata-fb-scraper");
const PROJECT_ROOT = process.cwd();
const DATA_DIR = join(PROJECT_ROOT, "data");
mkdirSync(SESSION_DIR, { recursive: true });
mkdirSync(DATA_DIR, { recursive: true });

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const randSleep = (min, max) => sleep(min + Math.random() * (max - min));
const hashContent = (s) =>
  createHash("sha1").update(s).digest("hex").slice(0, 16);

function log(...a) {
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}]`, ...a);
}

// ─────────────────────────────────────────────
// Setup mode : log user in and save session
// ─────────────────────────────────────────────
async function runSetup() {
  log("🔐 Setup mode — opening browser for manual Facebook login");
  log(`Session will persist in: ${SESSION_DIR}`);

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    locale: "fr-FR",
  });

  const page = await ctx.newPage();
  await page.goto("https://www.facebook.com/", { waitUntil: "domcontentloaded" });

  log("");
  log("👉 Connecte-toi à Facebook dans la fenêtre qui vient de s'ouvrir.");
  log("👉 Une fois connecté, reviens ici et appuie sur ENTRÉE.");
  log("");

  // Wait for ENTER on stdin
  await new Promise((resolve) => {
    process.stdin.resume();
    process.stdin.once("data", () => resolve());
  });

  log("✅ Session captée — fermeture du navigateur.");
  await ctx.close();
  log("✅ Tu peux maintenant lancer : node scripts/scrape-facebook.mjs");
  process.exit(0);
}

// ─────────────────────────────────────────────
// Post extraction helpers (Facebook DOM)
// ─────────────────────────────────────────────
/**
 * Extracts visible posts from a feed page.
 * Facebook DOM uses obfuscated class names that change frequently;
 * we rely on stable role-based selectors and aria-labels.
 */
async function extractVisiblePosts(page, sourceUrl, sourceLabel, sourceType) {
  return await page.evaluate(
    ({ sourceUrl, sourceLabel, sourceType }) => {
      const posts = [];

      // Strategy 1 : article elements (groups + pages, post-2023 layout)
      const articles = Array.from(document.querySelectorAll('div[role="article"]'));

      for (const art of articles) {
        try {
          // Extract author
          const authorEl =
            art.querySelector('h2 strong span, h3 strong span, h2 a strong, h3 a strong') ||
            art.querySelector('a[role="link"][aria-label]');
          const author = authorEl?.textContent?.trim() || "Anonyme";

          // Extract content : seek the largest text-bearing div
          const textCandidates = Array.from(
            art.querySelectorAll('div[dir="auto"][style*="text-align"], div[data-ad-comet-preview="message"], div[data-ad-preview="message"]')
          )
            .map((el) => el.innerText?.trim())
            .filter((t) => t && t.length > 30);

          // Fallback : pick the longest dir=auto block in the article
          if (textCandidates.length === 0) {
            const fallback = Array.from(art.querySelectorAll('div[dir="auto"]'))
              .map((el) => el.innerText?.trim() || "")
              .filter((t) => t.length > 80);
            if (fallback.length > 0) {
              fallback.sort((a, b) => b.length - a.length);
              textCandidates.push(fallback[0]);
            }
          }

          const content = textCandidates.join("\n\n").trim();
          if (!content || content.length < 50) continue;

          // Extract permalink (best effort)
          let permalink = null;
          const linkEls = art.querySelectorAll('a[role="link"][href*="/posts/"], a[role="link"][href*="/permalink/"], a[href*="/groups/"][href*="/posts/"]');
          for (const a of linkEls) {
            const href = a.getAttribute("href");
            if (href && (href.includes("/posts/") || href.includes("/permalink/"))) {
              permalink = href.startsWith("http")
                ? href
                : `https://www.facebook.com${href}`;
              break;
            }
          }

          // Extract timestamp text (e.g. "il y a 3h", "26 avril")
          let timeText = null;
          const timeEl = art.querySelector('a[role="link"][aria-label*="20"], a[role="link"][aria-label*="il y a"], a[role="link"][aria-label*="hier"]');
          if (timeEl) timeText = timeEl.getAttribute("aria-label");

          // Title : first line of content, capped
          const firstLine = content.split("\n")[0].trim();
          const title = firstLine.length > 80
            ? firstLine.slice(0, 80) + "..."
            : firstLine;

          posts.push({
            source: permalink || sourceUrl,
            source_container: sourceUrl,
            source_label: sourceLabel,
            title,
            content,
            metadata: {
              author,
              type: "facebook_post",
              container_type: sourceType,
              time_text: timeText,
              tags: [],
            },
          });
        } catch (e) {
          // skip malformed article
        }
      }

      return posts;
    },
    { sourceUrl, sourceLabel, sourceType }
  );
}

// ─────────────────────────────────────────────
// Scrape one target
// ─────────────────────────────────────────────
async function scrapeTarget(ctx, target) {
  const page = await ctx.newPage();
  log(`\n📄 ${target.label}`);
  log(`   ${target.url}`);

  try {
    await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await randSleep(2500, 5000);

    // Dismiss potential cookie banners
    try {
      await page
        .getByRole("button", { name: /accept|allow|j'accepte|autoriser/i })
        .first()
        .click({ timeout: 3000 });
    } catch {}

    // Detect if we hit login wall
    if (page.url().includes("/login") || page.url().includes("/checkpoint")) {
      log("   ⚠️  Login required. Run with --setup first.");
      await page.close();
      return [];
    }

    // Detect closed group / requires-membership
    const accessDenied = await page
      .locator("text=/Vous devez être membre|You must join this group|This group requires/i")
      .count();
    if (accessDenied > 0) {
      log("   ⚠️  Closed group — you need to be a member.");
      await page.close();
      return [];
    }

    // Wait for first feed article to appear
    try {
      await page.waitForSelector('div[role="article"]', { timeout: 15000 });
    } catch {
      log("   ⚠️  No articles found (page may use a different layout).");
    }

    // Scroll to load more posts. We collect after each scroll batch
    // and dedupe in-memory to avoid recounting visible-but-already-seen posts.
    const collected = new Map();
    for (let i = 0; i < FLAGS.scrolls; i++) {
      const visible = await extractVisiblePosts(
        page,
        target.url,
        target.label,
        target.type
      );

      let newCount = 0;
      for (const p of visible) {
        const h = hashContent(p.content);
        if (!collected.has(h)) {
          collected.set(h, p);
          newCount++;
        }
      }

      if (i % 5 === 0 || newCount > 0) {
        log(`   scroll ${i + 1}/${FLAGS.scrolls} → +${newCount} (total ${collected.size})`);
      }

      // Scroll near bottom + small jitter
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.85));
      await randSleep(900, 1800);

      // Periodic deeper jump to trigger lazy load
      if (i > 0 && i % 8 === 0) {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
        await randSleep(1500, 2500);
      }
    }

    log(`   ✅ ${collected.size} posts collectés`);
    await page.close();
    return Array.from(collected.values());
  } catch (e) {
    log(`   ❌ Erreur : ${e.message}`);
    try {
      await page.close();
    } catch {}
    return [];
  }
}

// ─────────────────────────────────────────────
// Merge & dedupe with existing dataset
// ─────────────────────────────────────────────
function mergeWithExisting(newPosts, existingPath) {
  let existing = [];
  if (existsSync(existingPath)) {
    try {
      existing = JSON.parse(readFileSync(existingPath, "utf-8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }

  const seen = new Map();
  for (const p of existing) {
    const h = hashContent(p.content || "");
    if (h) seen.set(h, p);
  }

  let added = 0;
  for (const p of newPosts) {
    const h = hashContent(p.content);
    if (!seen.has(h)) {
      seen.set(h, p);
      added++;
    }
  }

  const merged = Array.from(seen.values());
  return { merged, added, total: merged.length };
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  if (FLAGS.setup) {
    return runSetup();
  }

  // Verify session exists
  if (!existsSync(join(SESSION_DIR, "Default")) && !existsSync(join(SESSION_DIR, "Cookies"))) {
    log("❌ No session found. Run with --setup first :");
    log("   node scripts/scrape-facebook.mjs --setup");
    process.exit(1);
  }

  const targets = FLAGS.url
    ? [{ url: FLAGS.url, label: FLAGS.url, type: "custom" }]
    : TARGETS;

  log(`🎯 ${targets.length} target(s) · ${FLAGS.scrolls} scrolls each · headed=${FLAGS.headed}`);

  const ctx = await chromium.launchPersistentContext(SESSION_DIR, {
    headless: !FLAGS.headed,
    viewport: { width: 1280, height: 900 },
    locale: "fr-FR",
  });

  const allPosts = [];
  for (const target of targets) {
    const posts = await scrapeTarget(ctx, target);
    allPosts.push(...posts);
  }

  await ctx.close();

  // Save batch
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const batchPath = join(DATA_DIR, `scraped_fb_${stamp}.json`);
  writeFileSync(batchPath, JSON.stringify(allPosts, null, 2));
  log(`\n💾 Batch sauvegardé : ${batchPath} (${allPosts.length} posts)`);

  // Merge into cumulative file
  const cumulativePath = join(DATA_DIR, "scraped_fb_data.json");
  const { merged, added, total } = mergeWithExisting(allPosts, cumulativePath);
  writeFileSync(cumulativePath, JSON.stringify(merged, null, 2));
  log(`📚 Cumulatif : ${cumulativePath}`);
  log(`   +${added} nouveaux · ${total} total`);

  log("\n✅ Terminé. Pour indexer dans Pinecone :");
  log("   python scripts/index_facebook_to_pinecone.py");
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
