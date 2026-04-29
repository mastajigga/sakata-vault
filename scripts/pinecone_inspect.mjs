import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const idx = pc.Index("sakata");

const namespaces = ["__default__", "sakata", "iluo_livres_site", "iluo_forums"];

for (const ns of namespaces) {
  console.log(`\n${"=".repeat(70)}`);
  console.log(`NAMESPACE: ${ns}`);
  console.log("=".repeat(70));

  // Sample query with random vector to see metadata structure
  const dummy = Array(768).fill(0).map(() => Math.random() - 0.5);
  const namespaced = ns === "__default__" ? idx : idx.namespace(ns);

  try {
    const res = await namespaced.query({
      vector: dummy,
      topK: 10,
      includeMetadata: true,
    });

    if (!res.matches || res.matches.length === 0) {
      console.log("  (empty)");
      continue;
    }

    // Group by source/type
    const types = {};
    for (const m of res.matches) {
      const meta = m.metadata || {};
      const t = meta.type || meta.source_type || meta.source || "unknown";
      types[t] = (types[t] || 0) + 1;
    }
    console.log("Types observed in sample of 10:", types);

    console.log("\nFirst 3 records (id + metadata keys):");
    res.matches.slice(0, 3).forEach((m, i) => {
      console.log(`\n  ${i + 1}. id: ${m.id}`);
      console.log("     score:", m.score?.toFixed(3));
      const meta = m.metadata || {};
      console.log("     metadata keys:", Object.keys(meta).join(", "));
      // Show snippet of text/content if present
      const textKey = ["text", "content", "body", "excerpt"].find((k) => meta[k]);
      if (textKey) {
        const snippet = String(meta[textKey]).slice(0, 150);
        console.log(`     ${textKey}: "${snippet}..."`);
      }
      // Show key fields
      ["title", "type", "source", "language", "url", "category"].forEach((k) => {
        if (meta[k] !== undefined) console.log(`     ${k}: ${meta[k]}`);
      });
    });
  } catch (e) {
    console.log("  ERROR:", e.message);
  }
}
