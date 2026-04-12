#!/usr/bin/env node
/**
 * Export articles from src/data/articles.ts as JSON
 * Usage: node scripts/export-articles-json.js > articles-data.json
 *
 * This script extracts article data for use by Pinecone indexing scripts
 */

// Since we can't directly import TypeScript, we'll read and parse the file manually
const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const articlesPath = path.join(__dirname, '../src/data/articles.ts');
const tsContent = fs.readFileSync(articlesPath, 'utf-8');

// Extract the ARTICLES array from the TypeScript file
// This is a simple regex-based parser for the articles structure
function extractArticlesFromTS(content) {
  const articles = [];

  // Find each article object in the array
  // We'll use a simpler approach: read the file and extract article data

  // For now, return a message indicating that a proper parser is needed
  // In production, you would use a proper TypeScript parser or have the build output JSON

  console.error('⚠️  Note: This script requires proper TypeScript parsing.');
  console.error('Recommended approach: Export from TypeScript build instead.');

  return articles;
}

// For this implementation, we'll use a workaround:
// Create a minimal Node.js script that imports and exports the articles

// Alternative: Create articles.json manually in the scripts directory
// Or use tsx/ts-node to load the TypeScript directly

try {
  // Try to use tsx if available
  const { execSync } = require('child_process');

  const command = `npx tsx --eval "
    import { ARTICLES } from './src/data/articles.js';
    console.log(JSON.stringify(ARTICLES, null, 2));
  "`;

  const output = execSync(command, { cwd: process.cwd(), encoding: 'utf-8' });
  console.log(output);
} catch (error) {
  // Fallback: Output instructions
  console.error('Error: Could not load articles');
  console.error('Please ensure the project is built or use: npm run pinecone:index-articles');
  process.exit(1);
}
