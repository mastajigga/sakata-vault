"""
Index Facebook scraped posts into Pinecone.

Reads:    data/scraped_fb_data.json
Writes:   namespace `iluo_forums` of index `sakata`

Idempotent: each post id is hashed from content; existing ids are skipped
unless --force.

Usage:
    python scripts/index_facebook_to_pinecone.py
    python scripts/index_facebook_to_pinecone.py --dry-run
    python scripts/index_facebook_to_pinecone.py --force
"""

import os
import sys
import io
import json
import hashlib
import argparse
from pathlib import Path

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from dotenv import load_dotenv
import torch
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Load .env.local
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env.local")

# Config (matches existing index)
INDEX_NAME = "sakata"
NAMESPACE = "forums"
EMBEDDING_MODEL = "intfloat/multilingual-e5-base"
DATA_FILE = ROOT / "data" / "scraped_fb_data.json"

CHUNK_SIZE = 400  # words — FB posts are usually short, smaller chunks
CHUNK_OVERLAP = 30


def hash_id(content: str, source: str) -> str:
    """Stable id from content + source."""
    h = hashlib.sha1((source + "::" + content).encode("utf-8")).hexdigest()[:16]
    return f"fb__{h}"


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP):
    """Word-based chunking. FB posts rarely exceed 1 chunk but long ones happen."""
    words = text.split()
    if len(words) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunks.append(" ".join(words[start:end]))
        if end >= len(words):
            break
        start = end - overlap
    return chunks


def get_existing_ids(index, namespace, candidate_ids):
    """Fetch by id to detect already-indexed posts."""
    if not candidate_ids:
        return set()

    existing = set()
    BATCH = 100
    for i in range(0, len(candidate_ids), BATCH):
        batch = candidate_ids[i : i + BATCH]
        try:
            result = index.fetch(ids=batch, namespace=namespace)
            # Pinecone v6+ returns object with .vectors dict
            vectors = (
                result.vectors
                if hasattr(result, "vectors")
                else result.get("vectors", {})
            )
            existing.update(vectors.keys())
        except Exception as e:
            print(f"  ⚠️  fetch batch {i}: {e}")
    return existing


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Preview without upsert")
    parser.add_argument("--force", action="store_true", help="Re-index even existing")
    parser.add_argument(
        "--input",
        default=str(DATA_FILE),
        help="Path to scraped JSON (default: data/scraped_fb_data.json)",
    )
    args = parser.parse_args()

    # Load data
    input_path = Path(args.input)
    if not input_path.exists():
        print(f"❌ Fichier introuvable : {input_path}")
        print("   Lance d'abord : node scripts/scrape-facebook.mjs")
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        posts = json.load(f)

    if not isinstance(posts, list):
        print(f"❌ Le fichier doit contenir une liste, trouvé : {type(posts)}")
        sys.exit(1)

    print(f"📚 {len(posts)} posts à traiter depuis {input_path.name}")

    # Filter empty / duplicate
    valid_posts = []
    seen_hashes = set()
    for p in posts:
        content = (p.get("content") or "").strip()
        if len(content) < 50:
            continue
        h = hashlib.sha1(content.encode("utf-8")).hexdigest()[:16]
        if h in seen_hashes:
            continue
        seen_hashes.add(h)
        valid_posts.append(p)

    print(f"   {len(valid_posts)} posts valides (>= 50 chars, dédupliqués)")

    if not valid_posts:
        print("✅ Rien à indexer.")
        return

    # Connect Pinecone
    pc_key = os.getenv("PINECONE_API_KEY")
    if not pc_key:
        print("❌ PINECONE_API_KEY manquant dans .env.local")
        sys.exit(1)

    pc = Pinecone(api_key=pc_key)
    index = pc.Index(INDEX_NAME)
    print(f"🔌 Connecté à index `{INDEX_NAME}` namespace `{NAMESPACE}`")

    # Compute candidate ids and check for existence
    candidate_ids = [hash_id(p["content"], p.get("source", "")) for p in valid_posts]

    if args.force:
        existing_ids = set()
    else:
        print("🔍 Vérification des posts déjà indexés...")
        existing_ids = get_existing_ids(index, NAMESPACE, candidate_ids)
        print(f"   {len(existing_ids)} déjà présents")

    # Filter to only new posts
    to_process = [
        (cid, p)
        for cid, p in zip(candidate_ids, valid_posts)
        if args.force or cid not in existing_ids
    ]

    if not to_process:
        print("✅ Tous les posts sont déjà indexés.")
        return

    print(f"➡️  {len(to_process)} nouveaux posts à indexer")

    if args.dry_run:
        print("\n🌬  Dry run — aperçu :")
        for cid, p in to_process[:5]:
            preview = p["content"][:120].replace("\n", " ")
            print(f"  {cid}  | {p['metadata'].get('author', '?')[:25]:25}  | {preview}...")
        if len(to_process) > 5:
            print(f"  ... et {len(to_process) - 5} autres")
        return

    # Load model
    print(f"\n📊 Chargement modèle : {EMBEDDING_MODEL}")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"   device : {device}")
    model = SentenceTransformer(EMBEDDING_MODEL, device=device)

    # Build vectors
    vectors = []
    for idx, (post_id, post) in enumerate(to_process):
        content = post["content"]
        chunks = chunk_text(content)
        meta_base = post.get("metadata", {}) or {}

        for ci, chunk in enumerate(chunks):
            chunk_id = post_id if len(chunks) == 1 else f"{post_id}__c{ci}"
            passage = f"passage: {chunk}"
            embedding = model.encode(passage, show_progress_bar=False).tolist()

            metadata = {
                "source": post.get("source", ""),
                "title": post.get("title", "")[:200],
                "author": meta_base.get("author", "Anonyme"),
                "type": "facebook_post",
                "container_type": meta_base.get("container_type", "unknown"),
                "source_label": post.get("source_label", ""),
                "source_container": post.get("source_container", ""),
                "time_text": meta_base.get("time_text") or "",
                "tags": meta_base.get("tags", []),
                "text": chunk[:1000],
                "chunk_index": ci,
                "total_chunks": len(chunks),
            }

            # Pinecone metadata cannot have None values
            metadata = {k: v for k, v in metadata.items() if v is not None}

            vectors.append(
                {"id": chunk_id, "values": embedding, "metadata": metadata}
            )

        if (idx + 1) % 10 == 0 or idx + 1 == len(to_process):
            print(f"   embedded {idx + 1}/{len(to_process)} posts → {len(vectors)} vecteurs")

    # Upsert in batches
    print(f"\n📤 Upsert {len(vectors)} vecteurs dans `{NAMESPACE}`...")
    BATCH = 100
    for i in range(0, len(vectors), BATCH):
        batch = vectors[i : i + BATCH]
        index.upsert(vectors=batch, namespace=NAMESPACE)
        print(f"   batch {i // BATCH + 1}/{(len(vectors) + BATCH - 1) // BATCH} → {len(batch)} vecteurs")

    print("\n✅ Terminé !")
    print(f"   {len(to_process)} posts indexés, {len(vectors)} chunks total")
    print(f"   namespace `{NAMESPACE}`")


if __name__ == "__main__":
    main()
