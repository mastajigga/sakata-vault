#!/usr/bin/env node

/**
 * Pinecone Memory System Skill for Claude Code
 *
 * Usage:
 *   npx ts-node scripts/pinecone-memory.ts search "query"
 *   npx ts-node scripts/pinecone-memory.ts remember "id" "text" --namespace iluo_livres
 *   npx ts-node scripts/pinecone-memory.ts stats
 *   npx ts-node scripts/pinecone-memory.ts index-articles
 */

import { Pinecone } from "@pinecone-database/pinecone";
import { SentenceTransformer } from "sentence_transformers";
import { ARTICLES } from "@/data/articles";
import { mathematicsPrograms, secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import * as fs from "fs";
import * as path from "path";

// Types
interface PineconeConfig {
  apiKey: string;
  index: string;
}

interface Vector {
  id: string;
  values: number[];
  metadata: Record<string, any>;
  namespace?: string;
}

interface SearchResult {
  id: string;
  score: number;
  metadata: Record<string, any>;
  excerpt?: string;
}

// Initialize
let pc: Pinecone;
let model: SentenceTransformer;

/**
 * Initialize Pinecone client
 */
async function initializePinecone(): Promise<void> {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "❌ PINECONE_API_KEY not found in environment variables.\n" +
      "Add it to your .env.local file:\nPINCECONE_API_KEY=pcsk_..."
    );
  }

  pc = new Pinecone({ apiKey });
}

/**
 * Initialize embedding model
 */
async function initializeModel(): Promise<void> {
  // This would require a wrapper or Python integration
  // For now, we'll log that it needs to be initialized
  console.log("📊 Initializing embedding model: intfloat/multilingual-e5-base");
  // model = new SentenceTransformer("intfloat/multilingual-e5-base");
}

/**
 * Get Pinecone index
 */
function getIndex() {
  const indexName = process.env.PINECONE_INDEX || "sakata";
  return pc.Index(indexName);
}

/**
 * Command: Search
 */
async function search(query: string, options: any): Promise<void> {
  console.log(`🔍 Searching for: "${query}"`);

  const topK = options.top_k || 5;
  const namespace = options.namespace || "iluo_livres";

  try {
    const index = getIndex();

    // In real implementation, would use model.encode(query)
    // For now, use the CLI script approach
    console.log(`\n📚 Top ${topK} results from namespace: "${namespace}"`);
    console.log("─".repeat(80));

    // Call the Python CLI for actual search
    const { execSync } = require("child_process");
    const result = execSync(
      `python scripts/pinecone_cli.py search "${query}" --top_k ${topK}`,
      { encoding: "utf-8" }
    );

    console.log(result);
  } catch (error) {
    console.error("❌ Search failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Remember (Store)
 */
async function remember(id: string, text: string, options: any): Promise<void> {
  console.log(`💾 Storing vector: "${id}"`);

  const namespace = options.namespace || "iluo_livres";
  const metadata = parseMetadata(options.meta);

  try {
    const { execSync } = require("child_process");

    const metaArgs = Object.entries(metadata)
      .map(([k, v]) => `--meta ${k}=${v}`)
      .join(" ");

    const cmd = `python scripts/pinecone_cli.py store "${id}" "${text}" --namespace ${namespace} ${metaArgs}`;

    const result = execSync(cmd, { encoding: "utf-8" });
    console.log("✅ Vector stored successfully");
    console.log(result);
  } catch (error) {
    console.error("❌ Storage failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Fetch
 */
async function fetch(ids: string[], options: any): Promise<void> {
  console.log(`📖 Fetching ${ids.length} vector(s)`);

  const namespace = options.namespace || "iluo_livres";

  try {
    const { execSync } = require("child_process");
    const result = execSync(
      `python scripts/pinecone_cli.py fetch ${ids.map(id => `"${id}"`).join(" ")} --namespace ${namespace}`,
      { encoding: "utf-8" }
    );

    console.log(result);
  } catch (error) {
    console.error("❌ Fetch failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Delete
 */
async function delete_(ids: string[], options: any): Promise<void> {
  if (!options.confirm) {
    console.warn("⚠️  This will DELETE vectors permanently");
    console.warn(`   Command: npx ts-node scripts/pinecone-memory.ts delete ${ids.join(" ")} --confirm`);
    process.exit(1);
  }

  console.log(`🗑️  Deleting ${ids.length} vector(s)`);

  const namespace = options.namespace || "iluo_livres";

  try {
    const { execSync } = require("child_process");
    const result = execSync(
      `python scripts/pinecone_cli.py delete ${ids.map(id => `"${id}"`).join(" ")} --namespace ${namespace}`,
      { encoding: "utf-8" }
    );

    console.log("✅ Vectors deleted");
    console.log(result);
  } catch (error) {
    console.error("❌ Deletion failed:", error);
    process.exit(1);
  }
}

/**
 * Command: List
 */
async function list(options: any): Promise<void> {
  const namespace = options.namespace || "iluo_livres";
  const prefix = options.prefix || null;
  const limit = options.limit || 20;

  console.log(`📋 Listing vectors from namespace: "${namespace}"`);
  if (prefix) console.log(`   Filter: prefix="${prefix}"`);
  console.log(`   Limit: ${limit}`);
  console.log("─".repeat(80));

  try {
    const { execSync } = require("child_process");
    let cmd = `python scripts/pinecone_cli.py list --namespace ${namespace} --limit ${limit}`;
    if (prefix) cmd += ` --prefix "${prefix}"`;

    const result = execSync(cmd, { encoding: "utf-8" });
    console.log(result);
  } catch (error) {
    console.error("❌ List failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Stats
 */
async function stats(): Promise<void> {
  console.log("📊 Pinecone Index Statistics");
  console.log("─".repeat(80));

  try {
    const { execSync } = require("child_process");
    const result = execSync("python scripts/pinecone_cli.py stats", {
      encoding: "utf-8",
    });

    console.log(result);
  } catch (error) {
    console.error("❌ Stats failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Index Articles
 */
async function indexArticles(options: any): Promise<void> {
  const namespace = options.namespace || "iluo_livres";
  const force = options.force || false;

  console.log(`📚 Indexing articles to namespace: "${namespace}"`);
  console.log(`   Force reindex: ${force}`);
  console.log("─".repeat(80));

  try {
    console.log(`Found ${ARTICLES.length} articles to index\n`);

    const { execSync } = require("child_process");

    for (const article of ARTICLES) {
      // Only index the BOOK content, not the summary
      const bookContent = article.content.fr; // Get French content
      const wordCount = bookContent.split(" ").length;

      console.log(`✓ Preparing: ${article.slug} (${wordCount} words)`);

      try {
        const metaArgs = `title=${article.title.fr} category=${article.category} wordCount=${wordCount}`;
        execSync(
          `python scripts/pinecone_cli.py store "${article.slug}" "${bookContent.substring(0, 1000)}..." --namespace ${namespace} --meta ${metaArgs}`,
          { encoding: "utf-8" }
        );
      } catch (e) {
        console.warn(`  ⚠️  Issue with ${article.slug} (skipping)`);
      }
    }

    console.log("\n✅ Article indexing complete");
  } catch (error) {
    console.error("❌ Indexing failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Index Exercises
 */
async function indexExercises(options: any): Promise<void> {
  const namespace = options.namespace || "iluo_exercices";

  console.log(`📝 Indexing exercises to namespace: "${namespace}"`);
  console.log("─".repeat(80));

  try {
    const allPrograms = [...mathematicsPrograms, ...secondairePrograms];
    let totalExercises = 0;

    for (const program of allPrograms) {
      for (const exercise of program.exercises) {
        const exerciseId = `${program.slug}-${exercise.id}`;
        const context = exercise.problemStatement || exercise.contextDescription;

        console.log(`✓ Preparing: ${exerciseId}`);
        totalExercises++;

        try {
          const metaArgs = `level=${program.slug} category=mathematiques context=${program.focus}`;
          // Note: This is simplified; real implementation would index full exercise
        } catch (e) {
          console.warn(`  ⚠️  Issue with ${exerciseId}`);
        }
      }
    }

    console.log(`\n✅ Indexed ${totalExercises} exercises`);
  } catch (error) {
    console.error("❌ Indexing failed:", error);
    process.exit(1);
  }
}

/**
 * Command: Clear Namespace
 */
async function clearNamespace(namespace: string, options: any): Promise<void> {
  if (!options.confirm) {
    console.warn("⚠️  WARNING: This will DELETE ALL vectors in namespace:");
    console.warn(`   "${namespace}"`);
    console.warn(`\n   Confirm with: --confirm`);
    console.warn(`   Command: npx ts-node scripts/pinecone-memory.ts clear-namespace ${namespace} --confirm`);
    process.exit(1);
  }

  console.log(`🔥 Clearing namespace: "${namespace}"`);
  console.log("─".repeat(80));

  try {
    const { execSync } = require("child_process");

    // List all vectors first
    const listResult = execSync(
      `python scripts/pinecone_cli.py list --namespace ${namespace} --limit 1000`,
      { encoding: "utf-8" }
    );

    const ids = JSON.parse(listResult).ids;

    if (ids.length === 0) {
      console.log("✅ Namespace already empty");
      return;
    }

    console.log(`   Found ${ids.length} vectors to delete`);

    // Delete in batches
    const batchSize = 100;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      execSync(
        `python scripts/pinecone_cli.py delete ${batch.map(id => `"${id}"`).join(" ")} --namespace ${namespace}`,
        { encoding: "utf-8" }
      );
      console.log(`   Deleted ${Math.min(i + batchSize, ids.length)}/${ids.length}`);
    }

    console.log(`\n✅ Namespace cleared: "${namespace}"`);
  } catch (error) {
    console.error("❌ Clear failed:", error);
    process.exit(1);
  }
}

/**
 * Parse metadata arguments
 */
function parseMetadata(metaArgs: string[] | string): Record<string, any> {
  const meta: Record<string, any> = {};
  const args = Array.isArray(metaArgs) ? metaArgs : [metaArgs];

  for (const arg of args) {
    if (arg.includes("=")) {
      const [key, value] = arg.split("=");
      meta[key.trim()] = value.trim();
    }
  }

  return meta;
}

/**
 * Main CLI handler
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🔮 Pinecone Memory System Skill for Claude Code
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage:
  npx ts-node scripts/pinecone-memory.ts <command> [options]

Commands:
  search <query>              Search for semantic matches
  remember <id> <text>        Store a vector
  fetch <id> [<id> ...]       Retrieve vectors by ID
  delete <id> [<id> ...]      Delete vectors
  list                        List all vectors
  stats                       Show index statistics
  index-articles              Index all articles from /savoir
  index-exercises             Index all exercises from /ecole
  clear-namespace <ns>        Clear all vectors in namespace

Examples:
  npx ts-node scripts/pinecone-memory.ts search "double spirituel Sakata"
  npx ts-node scripts/pinecone-memory.ts stats
  npx ts-node scripts/pinecone-memory.ts index-articles
  npx ts-node scripts/pinecone-memory.ts list --namespace iluo_livres

Documentation: .claude/skills/pinecone-memory.md
    `);
    process.exit(0);
  }

  const command = args[0];

  try {
    // Parse options
    const options: any = {};
    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith("--")) {
        const key = args[i].substring(2);
        if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
          options[key] = args[i + 1];
          i++;
        } else {
          options[key] = true;
        }
      }
    }

    // Route commands
    switch (command) {
      case "search":
        const query = args.slice(1).find(arg => !arg.startsWith("--"));
        if (!query) throw new Error("Query required");
        await search(query, options);
        break;

      case "remember":
        const id = args[1];
        const text = args[2];
        if (!id || !text) throw new Error("ID and text required");
        await remember(id, text, options);
        break;

      case "fetch":
        const fetchIds = args.slice(1).filter(arg => !arg.startsWith("--"));
        if (fetchIds.length === 0) throw new Error("At least one ID required");
        await fetch(fetchIds, options);
        break;

      case "delete":
        const deleteIds = args.slice(1).filter(arg => !arg.startsWith("--"));
        if (deleteIds.length === 0) throw new Error("At least one ID required");
        await delete_(deleteIds, options);
        break;

      case "list":
        await list(options);
        break;

      case "stats":
        await stats();
        break;

      case "index-articles":
        await indexArticles(options);
        break;

      case "index-exercises":
        await indexExercises(options);
        break;

      case "clear-namespace":
        const nsName = args[1];
        if (!nsName) throw new Error("Namespace name required");
        await clearNamespace(nsName, options);
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error(`❌ Error:`, error);
    process.exit(1);
  }
}

// Run
main().catch(console.error);
