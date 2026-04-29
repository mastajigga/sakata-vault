"""
Smart ingestion pipeline for the Sakata bibliography.

- Scans the local Livre/ directory for all PDFs
- Queries Pinecone to detect which sources are already indexed
- Only ingests new sources (skips deja-vus)
- Uses the same chunking and embedding pattern as vectorize_sakata.py
- Indexes into namespace `__default__` for ethnographic/academic books
- Indexes the Sociétés Secrètes OCR file (text instead of PDF)

Usage:
    python scripts/ingest_books_smart.py [--dry-run] [--force]
    --dry-run : only show what would be indexed, no actual upsert
    --force   : re-index even sources already in Pinecone
"""

import os
import sys
import io
import re
import argparse
import fitz  # pymupdf
import torch
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# --- Configuration ---
INDEX_NAME = "sakata"
EMBEDDING_MODEL = "intfloat/multilingual-e5-base"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
BATCH_SIZE_EMBED = 32
BATCH_SIZE_UPSERT = 100
LIVRE_DIR = r"C:\Users\Fortuné\OneDrive\Documents\Livre"

# --- Helpers ---
def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    words = text.split()
    if len(words) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap
    return chunks


def safe_id(s):
    return s.encode("ascii", errors="replace").decode("ascii")


def find_all_pdfs(base_dir):
    """Yield (filename, full_path, directory_name) for every PDF in subdirs."""
    out = []
    for dir_name in sorted(os.listdir(base_dir)):
        dir_path = os.path.join(base_dir, dir_name)
        if not os.path.isdir(dir_path):
            continue
        for fname in sorted(os.listdir(dir_path)):
            if fname.lower().endswith(".pdf"):
                out.append({
                    "path": os.path.join(dir_path, fname),
                    "filename": fname,
                    "directory": dir_name,
                    "kind": "pdf",
                })
    # Special case: OCR text file for Sociétés Secrètes
    ocr_path = os.path.join(base_dir, "Sociétés secètes au Congo Belge", "OCR_Societes_Secretes.txt")
    if os.path.isfile(ocr_path):
        out.append({
            "path": ocr_path,
            "filename": "OCR_Societes_Secretes.txt",
            "directory": "Sociétés secètes au Congo Belge",
            "kind": "ocr_txt",
        })
    return out


def get_indexed_sources(index):
    """
    Sample the index to detect which `source` filenames are already there.
    Pinecone has no "list distinct metadata values" API, so we sample with
    a few random queries. This is approximate but works since 1500+ chunks
    already give very high coverage when sampling top_k=1000 several times.
    """
    print("[INFO] Detecting already-indexed sources via sampling...")
    seen = set()
    # Use 3 different random query vectors to maximize coverage
    for i in range(3):
        dummy = [0.001 * ((j * 7 + i * 13) % 100 - 50) for j in range(768)]
        res = index.query(vector=dummy, top_k=1000, include_metadata=True)
        for m in res.matches or []:
            src = (m.metadata or {}).get("source")
            if src:
                seen.add(src)
    print(f"  -> {len(seen)} unique sources detected in __default__:")
    for s in sorted(seen):
        print(f"     • {s}")
    return seen


def extract_pages_from_pdf(pdf_path):
    pages = []
    try:
        doc = fitz.open(pdf_path)
        for i in range(len(doc)):
            txt = doc[i].get_text("text").strip()
            if txt:
                pages.append({"page": i + 1, "text": txt})
        doc.close()
    except Exception as e:
        print(f"  [ERROR] Reading {pdf_path}: {e}")
    return pages


def extract_pages_from_ocr(txt_path):
    """Parse the OCR_Societes_Secretes.txt with `--- PAGE N ---` markers."""
    with open(txt_path, "r", encoding="utf-8") as f:
        content = f.read()
    parts = re.split(r"--- PAGE (\d+) ---", content)
    pages = []
    for i in range(1, len(parts), 2):
        try:
            page_num = int(parts[i])
        except ValueError:
            continue
        text = parts[i + 1].strip() if i + 1 < len(parts) else ""
        if text:
            pages.append({"page": page_num, "text": text})
    return pages


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Don't actually upsert")
    parser.add_argument("--force", action="store_true", help="Re-index everything")
    args = parser.parse_args()

    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        print("[ERROR] PINECONE_API_KEY env var not set")
        sys.exit(1)

    print("=" * 70)
    print("  SAKATA BIBLIOTHÈQUE — SMART INGESTION")
    print("=" * 70)

    # 1. Connect to Pinecone
    pc = Pinecone(api_key=api_key)
    index = pc.Index(INDEX_NAME)

    # 2. Find all PDFs locally
    print(f"\n[STEP 1] Scanning {LIVRE_DIR}...")
    all_files = find_all_pdfs(LIVRE_DIR)
    print(f"  -> Found {len(all_files)} files (PDFs + OCR txt):")
    for f in all_files:
        print(f"     • [{f['kind']}] {f['directory']} / {f['filename']}")

    # 3. Detect already-indexed
    print()
    indexed_sources = set() if args.force else get_indexed_sources(index)

    # 4. Filter what to ingest
    to_ingest = []
    skipped = []
    for f in all_files:
        if f["filename"] in indexed_sources and not args.force:
            skipped.append(f)
        else:
            to_ingest.append(f)

    print(f"\n[STEP 2] Plan:")
    print(f"  -> Skipped (already indexed): {len(skipped)}")
    for f in skipped:
        print(f"     ✓ {f['filename']}")
    print(f"  -> To ingest: {len(to_ingest)}")
    for f in to_ingest:
        print(f"     ⊕ {f['filename']}")

    if not to_ingest:
        print("\n[DONE] Nothing to ingest. Use --force to re-index.")
        return

    if args.dry_run:
        print("\n[DRY-RUN] Stopping here.")
        return

    # 5. Load embedding model
    print(f"\n[STEP 3] Loading embedding model: {EMBEDDING_MODEL}")
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"  -> device: {device}")
    model = SentenceTransformer(EMBEDDING_MODEL, device=device)

    # 6. For each file: extract → chunk → embed → upsert
    grand_total = 0
    for f in to_ingest:
        print(f"\n[FILE] {f['filename']}")
        if f["kind"] == "pdf":
            pages = extract_pages_from_pdf(f["path"])
        else:
            pages = extract_pages_from_ocr(f["path"])

        print(f"  -> {len(pages)} pages extracted")
        if not pages:
            print(f"  [WARN] No pages extracted, skipping")
            continue

        chunks = []
        for p in pages:
            for ci, ch in enumerate(chunk_text(p["text"])):
                chunks.append({
                    "id": safe_id(f"{f['filename']}__p{p['page']}__c{ci}"),
                    "text": ch,
                    "metadata": {
                        "source": f["filename"],
                        "directory": f["directory"],
                        "page": p["page"],
                        "chunk_index": ci,
                    },
                })
        print(f"  -> {len(chunks)} chunks created")

        # Embed in batches
        texts = [f"passage: {c['text']}" for c in chunks]
        embeddings = []
        for i in range(0, len(texts), BATCH_SIZE_EMBED):
            batch = texts[i:i + BATCH_SIZE_EMBED]
            embs = model.encode(batch, show_progress_bar=False, convert_to_numpy=True)
            embeddings.extend(embs)
            done = min(i + BATCH_SIZE_EMBED, len(texts))
            print(f"  -> embedded {done}/{len(texts)}", end="\r")
        print()

        # Upsert in batches
        vectors = []
        for c, e in zip(chunks, embeddings):
            vectors.append({
                "id": c["id"],
                "values": e.tolist(),
                "metadata": {**c["metadata"], "text": c["text"][:1000]},
            })

        for i in range(0, len(vectors), BATCH_SIZE_UPSERT):
            batch = vectors[i:i + BATCH_SIZE_UPSERT]
            index.upsert(vectors=batch)
        print(f"  -> upserted {len(vectors)} vectors ✓")

        grand_total += len(vectors)

    # 7. Final stats
    print(f"\n[STEP 4] Final verification...")
    stats = index.describe_index_stats()
    print(f"  -> Total vectors in index: {stats.total_vector_count}")
    for ns_name, ns_data in (stats.namespaces or {}).items():
        print(f"     • {ns_name}: {ns_data.record_count} vectors")

    print("\n" + "=" * 70)
    print(f"  [DONE] {grand_total} new vectors added.")
    print("=" * 70)


if __name__ == "__main__":
    main()
