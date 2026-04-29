import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const indexes = await pc.listIndexes();
console.log("\n=== INDEXES ===");
console.log(JSON.stringify(indexes, null, 2));

for (const idx of indexes.indexes || []) {
  console.log(`\n=== STATS for "${idx.name}" ===`);
  const index = pc.Index(idx.name);
  const stats = await index.describeIndexStats();
  console.log(JSON.stringify(stats, null, 2));
}
