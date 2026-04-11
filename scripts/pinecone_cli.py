"""
Pinecone CLI — Sakata Infinite Memory System

NAMESPACE ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════════

Pinecone stores knowledge in 4 organized namespaces:

1. iluo_livres_academiques
   └─ Academic PDFs (Van Everbroeck 1952, Vanzila Munsi 2016, etc.)
   └─ Status: ✅ Already indexed (1500+ chunks)
   └─ Purpose: Deep historical & anthropological research
   └─ Search for: "Iluo spirituel", "épopée Sakata", "chefferies"

2. iluo_livres_site ← NEW
   └─ Articles from /savoir (src/data/articles.ts)
   └─ Content: .content field ONLY (2000+ word books)
   └─ Status: 🟡 To be indexed
   └─ Purpose: Site's own knowledge base
   └─ Search for: Same topics but prioritize site content

3. iluo_exercices ← NEW
   └─ Mathematics exercises from /ecole
   └─ Content: Problem statements + local contexts
   └─ Status: 🟡 To be indexed
   └─ Purpose: Find exercises by concept or locality
   └─ Search for: "Lemvia exercice", "mathématiques chefferie"

4. iluo_chefferies ← NEW
   └─ Territory descriptions (7 chiefdoms)
   └─ Content: Full descriptions, geography, culture
   └─ Status: ⚠️  Not yet created
   └─ Purpose: Geographic & cultural queries
   └─ Search for: "Mbamushie", "Lemvia-Nord", "territory"

USAGE
═══════════════════════════════════════════════════════════════════════════════

    # Afficher les stats par namespace
    python pinecone_cli.py stats

    # Chercher dans TOUS les namespaces
    python pinecone_cli.py search "double spirituel Sakata" --top_k 5

    # Chercher dans un namespace spécifique
    python pinecone_cli.py search "Iluo" --namespace iluo_livres_site --top_k 3
    python pinecone_cli.py search "exercice Lemvia" --namespace iluo_exercices

    # Stocker un nouveau vecteur
    python pinecone_cli.py store "article-001" "Texte complet..." --namespace iluo_livres_site --meta title="Mon Article" category=spiritualite

    # Récupérer un vecteur
    python pinecone_cli.py fetch "site-iluo-regard-du-pouvoir" --namespace iluo_livres_site

    # Supprimer un vecteur
    python pinecone_cli.py delete "old-vector-001" --namespace iluo_livres_site

    # Lister les vecteurs
    python pinecone_cli.py list --namespace iluo_livres_site --limit 50

KEY DISTINCTION: ARTICLE vs BOOK
═══════════════════════════════════════════════════════════════════════════════

❌ ARTICLE LEVEL (NOT INDEXED)
    Content: article.summary (100-200 mots)
    Purpose: Listing, navigation, metadata
    Used in: /savoir listing page
    Example: "L'Iluo n'est pas un simple double..."

✅ BOOK LEVEL (INDEXED IN PINECONE)
    Content: article.content (2000+ mots)
    Purpose: Deep reading, semantic search
    Used in: /savoir/[slug] full page + Pinecone
    Example: "C'est le temps des enseignements secrets.
             On parle de l'Iluo... [2500+ mots complets]"

ALWAYS index the BOOK level, never the ARTICLE level.
"""

import sys
import os
import io
import json
import argparse
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'))

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from pinecone import Pinecone
from sentence_transformers import SentenceTransformer

# Import LLM providers for semantic synthesis
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib.llm_providers import LLMProviderFactory

# --- Configuration ---
API_KEY = os.getenv('PINECONE_API_KEY', 'pcsk_7Y6nQP_98RdPcDMvzHsLxSYMnDpiDvvgYyRjVxmfNYPztjM45ujRx9ZFA23KYp8rtgLPUC')
INDEX_NAME = "sakata"
MODEL_NAME = "intfloat/multilingual-e5-base"

# Lazy-loaded globals
_pc = None
_index = None
_model = None


def get_pinecone():
    global _pc, _index
    if _pc is None:
        _pc = Pinecone(api_key=API_KEY)
        _index = _pc.Index(INDEX_NAME)
    return _index


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def cmd_stats(args):
    """Show index statistics."""
    index = get_pinecone()
    stats = index.describe_index_stats()
    result = {
        "index": INDEX_NAME,
        "total_vectors": stats.total_vector_count,
        "dimension": stats.dimension,
        "namespaces": {ns: {"vector_count": info.vector_count} for ns, info in stats.namespaces.items()} if stats.namespaces else {},
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


def synthesize_with_llm(question: str, search_results: list) -> dict:
    """
    Synthesize an intelligent response from Pinecone search results using LLM.

    Args:
        question: User's question
        search_results: List of search matches from Pinecone

    Returns:
        Dict with 'answer', 'sources', and 'searchResultCount'
    """
    try:
        # Initialize LLM provider (reads LLM_PROVIDER env var, defaults to claude)
        llm = LLMProviderFactory.create()
    except ValueError as e:
        print(json.dumps({
            "error": str(e),
            "hint": "Check .env.local for LLM_PROVIDER and corresponding API keys"
        }, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    # Build context from search results
    context_parts = []
    for result in search_results:
        metadata = dict(result.metadata) if result.metadata else {}
        title = metadata.get("title", "Unknown")
        text = metadata.get("text", "")

        if text:
            context_parts.append(f"[{title}]\n{text}")

    if not context_parts:
        print(json.dumps({
            "error": "No relevant sources found for synthesis",
            "question": question
        }, indent=2, ensure_ascii=False))
        sys.exit(1)

    context = "\n\n---\n\n".join(context_parts)

    # Call LLM for synthesis
    try:
        answer = llm.synthesize(question, context)
    except Exception as e:
        print(json.dumps({
            "error": f"LLM synthesis failed: {str(e)}",
            "question": question
        }, indent=2, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)

    # Format response with sources
    return {
        "answer": answer,
        "sources": [
            {
                "id": match.id,
                "title": dict(match.metadata).get("title", "Unknown") if match.metadata else "Unknown",
                "type": dict(match.metadata).get("type", "document") if match.metadata else "document",
                "score": round(match.score, 4)
            }
            for match in search_results
        ],
        "searchResultCount": len(search_results)
    }


def cmd_search(args):
    """Search the index with a natural language query."""
    index = get_pinecone()
    model = get_model()

    query_text = f"query: {args.query}"
    embedding = model.encode(query_text).tolist()

    results = index.query(
        vector=embedding,
        top_k=args.top_k,
        include_metadata=True,
        namespace=args.namespace or "",
    )

    # If semantic synthesis requested, use LLM
    if args.semantic:
        result = synthesize_with_llm(args.query, results.matches)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        # Otherwise return raw results
        output = []
        for match in results.matches:
            output.append({
                "id": match.id,
                "score": round(match.score, 4),
                "metadata": dict(match.metadata) if match.metadata else {},
            })

        print(json.dumps(output, indent=2, ensure_ascii=False))


def cmd_store(args):
    """Store a new vector with text and metadata."""
    index = get_pinecone()
    model = get_model()

    text = args.text
    embedding = model.encode(f"passage: {text}").tolist()

    metadata = {"text": text[:1000]}
    if args.meta:
        for kv in args.meta:
            if "=" in kv:
                k, v = kv.split("=", 1)
                metadata[k] = v

    index.upsert(
        vectors=[{"id": args.id, "values": embedding, "metadata": metadata}],
        namespace=args.namespace or "",
    )
    print(json.dumps({"status": "ok", "id": args.id, "metadata": metadata}, indent=2, ensure_ascii=False))


def cmd_fetch(args):
    """Fetch vectors by their IDs."""
    index = get_pinecone()
    result = index.fetch(ids=args.ids, namespace=args.namespace or "")

    output = {}
    for vid, vec in result.vectors.items():
        output[vid] = {
            "metadata": dict(vec.metadata) if vec.metadata else {},
        }

    print(json.dumps(output, indent=2, ensure_ascii=False))


def cmd_delete(args):
    """Delete vectors by their IDs."""
    index = get_pinecone()
    index.delete(ids=args.ids, namespace=args.namespace or "")
    print(json.dumps({"status": "deleted", "ids": args.ids}, indent=2, ensure_ascii=False))


def cmd_list(args):
    """List vector IDs in the index."""
    index = get_pinecone()
    kwargs = {"namespace": args.namespace or "", "limit": args.limit}
    if args.prefix:
        kwargs["prefix"] = args.prefix

    results = index.list_paginated(**kwargs)
    ids = [v.id for v in results.vectors] if results.vectors else []
    print(json.dumps({"ids": ids, "count": len(ids)}, indent=2, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description="Pinecone CLI — Sakata Infinite Memory")
    parser.add_argument("--namespace", "-ns", default="", help="Pinecone namespace")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # stats
    subparsers.add_parser("stats", help="Show index statistics")

    # search
    p_search = subparsers.add_parser("search", help="Semantic search")
    p_search.add_argument("query", help="Natural language query")
    p_search.add_argument("--top_k", type=int, default=5, help="Number of results (default: 5)")
    p_search.add_argument("--semantic", action="store_true", help="Use LLM synthesis for intelligent response")

    # store
    p_store = subparsers.add_parser("store", help="Store a new vector")
    p_store.add_argument("id", help="Unique vector ID")
    p_store.add_argument("text", help="Text content to embed and store")
    p_store.add_argument("--meta", nargs="*", help="Metadata as key=value pairs")

    # fetch
    p_fetch = subparsers.add_parser("fetch", help="Fetch vectors by ID")
    p_fetch.add_argument("ids", nargs="+", help="Vector IDs to fetch")

    # delete
    p_delete = subparsers.add_parser("delete", help="Delete vectors by ID")
    p_delete.add_argument("ids", nargs="+", help="Vector IDs to delete")

    # list
    p_list = subparsers.add_parser("list", help="List vector IDs")
    p_list.add_argument("--prefix", default=None, help="Filter by ID prefix")
    p_list.add_argument("--limit", type=int, default=20, help="Max results")

    args = parser.parse_args()

    commands = {
        "stats": cmd_stats,
        "search": cmd_search,
        "store": cmd_store,
        "fetch": cmd_fetch,
        "delete": cmd_delete,
        "list": cmd_list,
    }
    commands[args.command](args)


if __name__ == "__main__":
    main()
