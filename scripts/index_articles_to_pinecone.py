"""
Index all Sakata articles (BOOK level, content.fr) into Pinecone namespace `iluo_livres_site`.

Parses src/data/articles.ts (TypeScript), extracts each article's French content,
chunks into ~500-word segments with 50-word overlap, and upserts into Pinecone.

Usage:
    python3 scripts/index_articles_to_pinecone.py          # Index all articles
    python3 scripts/index_articles_to_pinecone.py --dry-run  # Preview without indexing
    python3 scripts/index_articles_to_pinecone.py --delete   # Clear namespace first
"""

import sys
import os
import io
import json
import re
import argparse
import time

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)

from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# ── Config ────────────────────────────────────────────────────────────────
API_KEY = os.getenv('PINECONE_API_KEY')
INDEX_NAME = "sakata"
NAMESPACE = "iluo_livres_site"
MODEL_NAME = "intfloat/multilingual-e5-base"
CHUNK_SIZE_WORDS = 500
OVERLAP_WORDS = 50

pc = Pinecone(api_key=API_KEY)
index = pc.Index(INDEX_NAME)

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE_WORDS, overlap: int = OVERLAP_WORDS) -> list[str]:
    """Split text into overlapping word chunks."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        chunk = ' '.join(words[start:start + chunk_size])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def parse_articles_ts(filepath: str) -> list[dict]:
    """Parse articles from src/data/articles.ts using regex."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract the ARTICLES array: everything between "export const ARTICLES: ArticleData[] = [" and the closing "]"
    # Use a simpler approach: find all article blocks by looking for slug and content patterns
    articles = []

    # Find all slug fields
    slug_pattern = re.finditer(r"slug:\s*\"([^\"]+)\"", content)
    slugs = [m.group(1) for m in slug_pattern]

    # Extract content blocks - they are template literals using backticks
    # Each article has: slug, title (multilingual), category, summary (multilingual), content (multilingual)
    # The content.fr is inside a template literal

    # Strategy: split by "slug:" to get article blocks
    blocks = re.split(r"\n\s*\{\s*\n\s*slug:", content)
    # First block is imports/comments, skip it

    for i, block in enumerate(blocks[1:], 0):
        # Reconstruct the slug
        slug_match = re.match(r'\s*"([^"]+)"', block)
        if not slug_match:
            continue
        slug = slug_match.group(1)

        # Extract title.fr
        title_match = re.search(r'title:\s*\{[^}]*fr:\s*"([^"]+)"', block, re.DOTALL)
        title_fr = title_match.group(1) if title_match else slug

        # Extract category
        cat_match = re.search(r'category:\s*"([^"]+)"', block)
        category = cat_match.group(1) if cat_match else "unknown"

        # Extract content.fr - the big template literal after "content: { fr: `"
        # Match content block
        content_match = re.search(r'content:\s*\{[^}]*fr:\s*`([^`]*(?:`[^`]*`[^`]*)*)`', block, re.DOTALL)
        if not content_match:
            # Try different pattern for multiline
            # Find the content section
            content_section = re.search(r'content:\s*\{(.*?)\n\s{4}\}', block, re.DOTALL)
            if content_section:
                fr_match = re.search(r'fr:\s*`((?:(?!`\s*;).)*)`', content_section.group(1), re.DOTALL)
                if fr_match:
                    content_fr = fr_match.group(1)
                else:
                    print(f"  ⚠️  No French content found for {slug}, skipping")
                    continue
            else:
                print(f"  ⚠️  No content block found for {slug}, skipping")
                continue
        else:
            content_fr = content_match.group(1)

        # Clean up the content
        content_fr = content_fr.strip()
        if len(content_fr) < 50:
            print(f"  ⚠️  Content too short for {slug} ({len(content_fr)} chars), skipping")
            continue

        articles.append({
            'slug': slug,
            'title_fr': title_fr,
            'category': category,
            'content_fr': content_fr,
            'word_count': len(content_fr.split())
        })

    return articles

def main():
    parser = argparse.ArgumentParser(description="Index Sakata articles into Pinecone")
    parser.add_argument('--dry-run', action='store_true', help='Preview without indexing')
    parser.add_argument('--delete', action='store_true', help='Delete all vectors in namespace first')
    parser.add_argument('--slug', type=str, help='Index a single article by slug')
    args = parser.parse_args()

    articles_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'data', 'articles.ts')

    print(f"📖 Parsing {articles_file}...")
    articles = parse_articles_ts(articles_file)
    print(f"📊 Found {len(articles)} articles with French content\n")

    if args.slug:
        articles = [a for a in articles if a['slug'] == args.slug]
        if not articles:
            print(f"❌ Article '{args.slug}' not found")
            sys.exit(1)

    if args.delete:
        print(f"🗑️  Deleting all vectors in namespace '{NAMESPACE}'...")
        index.delete(delete_all=True, namespace=NAMESPACE)
        print("   Done.\n")

    if args.dry_run:
        print("🔍 DRY RUN — no vectors will be indexed\n")
        for art in articles:
            chunks = chunk_text(art['content_fr'])
            print(f"   {art['slug']} — {art['word_count']} mots → {len(chunks)} chunks")
            print(f"      Title: {art['title_fr'][:80]}...")
            print(f"      Category: {art['category']}")
            print()
        print(f"Total: {sum(len(chunk_text(a['content_fr'])) for a in articles)} chunks across {len(articles)} articles")
        return

    # Load embedding model
    print("🧠 Loading embedding model (multilingual-e5-base)...")
    model = SentenceTransformer(MODEL_NAME)
    print("   Model loaded.\n")

    total_chunks = 0
    for art in articles:
        chunks = chunk_text(art['content_fr'])
        print(f"📝 {art['slug']} — {art['word_count']} mots → {len(chunks)} chunks")

        vectors = []
        for i, chunk in enumerate(chunks):
            vector_id = f"{art['slug']}__c{i}"
            embedding = model.encode(f"passage: {chunk}").tolist()
            vectors.append({
                'id': vector_id,
                'values': embedding,
                'metadata': {
                    'slug': art['slug'],
                    'title': art['title_fr'],
                    'category': art['category'],
                    'chunk_index': i,
                    'total_chunks': len(chunks),
                    'text': chunk[:1000],  # First 1000 chars for retrieval display
                    'word_count': len(chunk.split()),
                    'source': 'iluo_livres_site',
                }
            })

        # Upsert in batches of 100
        for batch_start in range(0, len(vectors), 100):
            batch = vectors[batch_start:batch_start + 100]
            index.upsert(vectors=batch, namespace=NAMESPACE)
            time.sleep(0.2)  # Rate limiting

        total_chunks += len(vectors)
        print(f"   ✅ {len(vectors)} chunks indexed")

    print(f"\n🎉 Done! {total_chunks} chunks across {len(articles)} articles indexed in '{NAMESPACE}'")

    # Show new stats
    stats = index.describe_index_stats()
    ns_count = stats.namespaces.get(NAMESPACE)
    if ns_count:
        print(f"📊 Namespace '{NAMESPACE}' now has {ns_count.vector_count} vectors")

if __name__ == '__main__':
    main()
