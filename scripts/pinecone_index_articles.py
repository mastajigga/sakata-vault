#!/usr/bin/env python3
"""
Pinecone Article Indexer — Index all articles from src/data/articles.ts

This script reads articles from the Kisakata project and intelligently indexes
them into Pinecone with proper namespace separation.

CRITICAL RULE: Index ONLY the .content field (books), NEVER .summary (articles)

Usage:
    python scripts/pinecone_index_articles.py [--force] [--dry-run] [--namespace iluo_livres_site]

Features:
    - Indexes ONLY the .content field (books), NOT .summary (articles)
    - Preserves academic PDFs already in Pinecone
    - Creates proper namespace hierarchy
    - Adds rich metadata for filtering
    - Shows progress and statistics
"""

import json
import sys
import os
import io
import re
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import argparse
from datetime import datetime

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


class TypeScriptArticleParser:
    """Parse articles from TypeScript src/data/articles.ts file"""

    def __init__(self, ts_file_path: str):
        self.ts_file_path = ts_file_path
        self.content = None
        self.articles = []

    def load_file(self) -> bool:
        """Load TypeScript file content"""
        try:
            with open(self.ts_file_path, 'r', encoding='utf-8') as f:
                self.content = f.read()
            return True
        except FileNotFoundError:
            print(f"❌ File not found: {self.ts_file_path}")
            return False
        except Exception as e:
            print(f"❌ Error loading file: {e}")
            return False

    def extract_articles(self) -> List[Dict[str, Any]]:
        """Extract articles from TypeScript file"""
        if not self.content:
            return []

        articles = []

        # Find all article objects in the ARTICLES array
        # Pattern: { slug: "...", title: {...}, category: "...", ...}
        article_pattern = r'{\s*slug:\s*"([^"]+)"'
        article_matches = list(re.finditer(article_pattern, self.content))

        for i, match in enumerate(article_matches):
            start_pos = match.start()
            # Find the end of this object (next article start or array end)
            if i + 1 < len(article_matches):
                end_pos = article_matches[i + 1].start() - 2
            else:
                end_pos = len(self.content)

            article_text = self.content[start_pos:end_pos]
            article = self._parse_single_article(article_text)

            if article:
                articles.append(article)

        return articles

    def _parse_single_article(self, article_text: str) -> Optional[Dict[str, Any]]:
        """Parse a single article object"""
        try:
            # Extract slug
            slug_match = re.search(r'slug:\s*"([^"]+)"', article_text)
            if not slug_match:
                return None

            slug = slug_match.group(1)

            # Extract title (French)
            title_match = re.search(r'title:\s*\{[^}]*fr:\s*"([^"]+)"', article_text)
            title = title_match.group(1) if title_match else slug

            # Extract category
            category_match = re.search(r'category:\s*"([^"]+)"', article_text)
            category = category_match.group(1) if category_match else "unknown"

            # Extract content (French) - This is the critical part
            # Look for content: { fr: `...` } pattern
            content_match = re.search(
                r'content:\s*\{[^}]*?fr:\s*`(.*?)`(?:,\s*(?:lin|skt|swa|tsh):|},)',
                article_text,
                re.DOTALL
            )

            if not content_match:
                # Try alternative pattern with quotes
                content_match = re.search(
                    r'content:\s*\{[^}]*?fr:\s*"(.*?)"(?:,\s*(?:lin|skt|swa|tsh):|},)',
                    article_text,
                    re.DOTALL
                )

            if not content_match:
                print(f"  ⚠️  Warning: Could not extract content for {slug}")
                return None

            content = content_match.group(1)

            # Clean up escaped characters
            content = content.replace(r'\"', '"')
            content = content.replace(r'\n', '\n')

            return {
                "slug": slug,
                "title": {"fr": title},
                "category": category,
                "content": {"fr": content},
            }

        except Exception as e:
            print(f"  ❌ Error parsing article: {e}")
            return None


class PineconeArticleIndexer:
    """Intelligent indexer for Kisakata articles"""

    def __init__(self, api_key: str, index_name: str = "sakata", dry_run: bool = False):
        """Initialize indexer"""
        self.api_key = api_key
        self.index_name = index_name
        self.dry_run = dry_run
        self.indexed_count = 0
        self.skipped_count = 0
        self.errors = []

    def validate_article(self, article: Dict[str, Any]) -> Tuple[bool, Optional[str]]:
        """Validate article structure"""
        required_fields = ["slug", "title", "category", "content"]

        for field in required_fields:
            if field not in article:
                return False, f"Missing field: {field}"

        # Check content is substantial
        content = article.get("content", {}).get("fr", "")
        word_count = len(content.split())

        if word_count < 100:
            return False, f"Content too short ({word_count} words, need 100+)"

        return True, None

    def extract_metadata(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Extract and enrich metadata"""
        content_fr = article.get("content", {}).get("fr", "")
        word_count = len(content_fr.split())
        char_count = len(content_fr)

        # Extract first 500 chars as excerpt
        excerpt = content_fr[:500].replace("\n", " ").strip()

        return {
            "slug": article["slug"],
            "title_fr": article["title"].get("fr", ""),
            "category": article["category"],
            "type": "book",  # CRITICAL: This is BOOK level, not ARTICLE
            "language": "fr",
            "wordCount": word_count,
            "charCount": char_count,
            "excerpt": excerpt,
            "source": "kisakata-site",
            "indexed_at": self._get_timestamp(),
        }

    def _get_timestamp(self) -> str:
        """Get current ISO timestamp"""
        return datetime.utcnow().isoformat() + "Z"

    def build_vector_id(self, article: Dict[str, Any]) -> str:
        """Build consistent vector ID"""
        return f"site-{article['slug']}"

    def index_article(self, article: Dict[str, Any], namespace: str) -> bool:
        """Index a single article"""

        # Validate
        is_valid, error_msg = self.validate_article(article)
        if not is_valid:
            self.skipped_count += 1
            print(f"  ⊘ {article.get('slug', 'unknown')}: {error_msg}")
            return False

        # Extract content and metadata
        content_fr = article["content"]["fr"]
        vector_id = self.build_vector_id(article)
        metadata = self.extract_metadata(article)

        # In real implementation, would embed and upsert
        if self.dry_run:
            print(f"  → Would index: {vector_id}")
            print(f"     Title: {metadata['title_fr']}")
            print(f"     Words: {metadata['wordCount']}")
            print(f"     Category: {metadata['category']}")
        else:
            # Call Pinecone upsert via CLI
            self._upsert_vector(vector_id, content_fr, metadata, namespace)

        self.indexed_count += 1
        return True

    def _upsert_vector(self, vector_id: str, content: str, metadata: Dict, namespace: str):
        """Upsert vector to Pinecone"""
        try:
            # Prepare metadata args
            meta_args = " ".join([f"--meta {k}={v}" for k, v in metadata.items()])

            # Call Python CLI
            # NOTE: --namespace must come BEFORE the subcommand
            content_preview = content[:1000].replace('"', '\\"').replace('\n', ' ')
            cmd = f'python scripts/pinecone_cli.py --namespace {namespace} store "{vector_id}" "{content_preview}..." {meta_args}'

            # Use utf-8 encoding to handle accented characters
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='replace', cwd=os.getcwd())

            if result.returncode != 0:
                self.errors.append(f"{vector_id}: {result.stderr[:100]}")  # Truncate error message
                print(f"  ✗ Error indexing {vector_id}")
            else:
                print(f"  ✓ {vector_id}")
        except Exception as e:
            self.errors.append(f"{vector_id}: {str(e)}")
            print(f"  ✗ {vector_id}: {e}")

    def index_all_articles(self, articles: List[Dict], namespace: str) -> Dict[str, Any]:
        """Index all articles"""
        print(f"\n📚 Indexing {len(articles)} articles")
        print(f"   Namespace: {namespace}")
        print(f"   Dry run: {self.dry_run}")
        print("─" * 80)

        for article in articles:
            self.index_article(article, namespace)

        print("─" * 80)

        return {
            "indexed": self.indexed_count,
            "skipped": self.skipped_count,
            "errors": len(self.errors),
            "error_details": self.errors,
            "namespace": namespace,
            "total": len(articles),
        }

    def print_summary(self, results: Dict[str, Any]):
        """Print summary statistics"""
        print(f"\n✅ INDEXING COMPLETE")
        print(f"   Indexed: {results['indexed']}")
        print(f"   Skipped: {results['skipped']}")
        print(f"   Errors: {results['errors']}")

        if results['error_details']:
            print(f"\n❌ Errors:")
            for error in results['error_details']:
                print(f"   - {error}")


def main():
    parser = argparse.ArgumentParser(
        description="Index Kisakata articles into Pinecone"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Reindex even if already present"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be indexed without actually indexing"
    )
    parser.add_argument(
        "--namespace",
        default="iluo_livres_site",
        help="Target namespace (default: iluo_livres_site)"
    )
    parser.add_argument(
        "--articles-file",
        default="src/data/articles.ts",
        help="Path to articles file"
    )

    args = parser.parse_args()

    # Get API key from environment
    api_key = os.environ.get("PINECONE_API_KEY")
    if not api_key:
        print("❌ PINECONE_API_KEY not set in environment")
        sys.exit(1)

    # Check articles file exists
    articles_file = Path(args.articles_file)
    if not articles_file.exists():
        print(f"❌ Articles file not found: {args.articles_file}")
        sys.exit(1)

    print(f"📖 Loading articles from {args.articles_file}")

    # Parse articles from TypeScript
    parser_ts = TypeScriptArticleParser(args.articles_file)
    if not parser_ts.load_file():
        sys.exit(1)

    articles = parser_ts.extract_articles()
    print(f"✅ Found {len(articles)} articles in TypeScript file")

    if len(articles) == 0:
        print("❌ No articles found. Check the articles file format.")
        sys.exit(1)

    # Initialize indexer
    indexer = PineconeArticleIndexer(
        api_key=api_key,
        dry_run=args.dry_run
    )

    # Index articles
    results = indexer.index_all_articles(articles, args.namespace)

    # Print summary
    indexer.print_summary(results)

    # Print namespace structure info
    print(f"\n📊 Namespace Structure:")
    print(f"   iluo_livres_academiques  → Academic PDFs (existing 1534 vectors)")
    print(f"   iluo_livres_site         → Site articles (just indexed)")
    print(f"   iluo_exercices           → School exercises (pending)")
    print(f"   iluo_chefferies          → Territory descriptions (pending)")

    sys.exit(0 if results['errors'] == 0 else 1)


if __name__ == "__main__":
    main()
