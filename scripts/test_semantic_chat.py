#!/usr/bin/env python3
"""
CLI Test for /api/chat/semantic endpoint

This script tests the semantic chat API that:
1. Searches Pinecone for relevant passages
2. Uses Claude to generate intelligent responses
3. Returns sourced answers

Usage:
    python scripts/test_semantic_chat.py "Your question here"
    python scripts/test_semantic_chat.py "Explique-moi l'Iluo"
    python scripts/test_semantic_chat.py "Raconte-moi sur les chefferies"
"""

import json
import sys
import io
import requests
from typing import Optional
import argparse
from datetime import datetime

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# API Configuration
DEFAULT_BASE_URL = "http://localhost:3000"
DEFAULT_ENDPOINT = "/api/chat/semantic"


class SemanticChatTester:
    """Test client for semantic chat API"""

    def __init__(self, base_url: str = DEFAULT_BASE_URL):
        self.base_url = base_url
        self.endpoint = f"{base_url}{DEFAULT_ENDPOINT}"

    def check_health(self) -> bool:
        """Check if API is running"""
        try:
            response = requests.get(self.endpoint, timeout=5)
            return response.status_code == 200
        except Exception as e:
            print(f"❌ API not accessible: {e}")
            return False

    def ask_question(self, question: str, top_k: int = 10) -> Optional[dict]:
        """Ask a question to the semantic chat API"""

        if not question or not isinstance(question, str):
            print("❌ Invalid question")
            return None

        print(f"\n🔍 Question: {question}")
        print(f"🔗 Endpoint: {self.endpoint}")
        print(f"⏳ Searching Pinecone and generating response...\n")

        try:
            response = requests.post(
                self.endpoint,
                json={"question": question, "topK": top_k},
                timeout=60,  # Claude can take a while
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ API Error ({response.status_code}): {response.text}")
                return None

        except requests.exceptions.ConnectionError:
            print(f"❌ Cannot connect to {self.endpoint}")
            print(f"   Make sure Next.js dev server is running: npm run dev")
            return None
        except requests.exceptions.Timeout:
            print("❌ Request timed out")
            return None
        except Exception as e:
            print(f"❌ Error: {e}")
            return None

    def format_result(self, result: dict) -> str:
        """Format API response for display"""

        output = []

        # Header
        output.append("─" * 80)
        output.append("📚 SEMANTIC CHAT RESPONSE")
        output.append("─" * 80)

        # Question
        output.append(f"\n❓ QUESTION:\n{result.get('question', 'N/A')}")

        # Answer
        output.append(f"\n✨ ANSWER:\n{result.get('answer', 'No answer')}")

        # Sources
        sources = result.get("sources", [])
        if sources:
            output.append(f"\n📖 SOURCES ({len(sources)} results):")
            for i, source in enumerate(sources, 1):
                score = int((source.get("score", 0) * 100))
                output.append(
                    f"   {i}. {source.get('title')} ({source.get('type')}) [Relevance: {score}%]"
                )

        # Metadata
        output.append(f"\n⏱️  Metadata:")
        output.append(f"   Results searched: {result.get('searchResultCount', 'N/A')}")
        output.append(f"   Timestamp: {datetime.now().isoformat()}")

        output.append("\n" + "─" * 80)

        return "\n".join(output)


def main():
    parser = argparse.ArgumentParser(
        description="Test the semantic chat API endpoint"
    )

    parser.add_argument(
        "question",
        nargs="?",
        help='Question to ask (e.g., "Explique-moi l\'Iluo")',
    )

    parser.add_argument(
        "--url",
        default=DEFAULT_BASE_URL,
        help=f"API base URL (default: {DEFAULT_BASE_URL})",
    )

    parser.add_argument(
        "--top-k",
        type=int,
        default=10,
        help="Number of sources to search (default: 10)",
    )

    parser.add_argument(
        "--check",
        action="store_true",
        help="Only check if API is running",
    )

    args = parser.parse_args()

    tester = SemanticChatTester(base_url=args.url)

    # Check health
    print(f"🔗 Checking API health: {args.url}{DEFAULT_ENDPOINT}")
    if not tester.check_health():
        print("\n💡 To start the dev server, run:")
        print("   npm run dev")
        sys.exit(1)

    print("✅ API is running\n")

    if args.check:
        print("Health check passed!")
        sys.exit(0)

    # If no question provided, show examples
    if not args.question:
        print("📝 Example questions:")
        print("   python scripts/test_semantic_chat.py \"Explique-moi l'Iluo\"")
        print(
            "   python scripts/test_semantic_chat.py \"Raconte-moi sur les chefferies\""
        )
        print(
            "   python scripts/test_semantic_chat.py \"Qu'est-ce que la spiritualité Sakata\""
        )
        print("")
        print("Usage: python scripts/test_semantic_chat.py \"Your question\"")
        sys.exit(0)

    # Ask question
    result = tester.ask_question(args.question, top_k=args.top_k)

    if result:
        if result.get("success"):
            print(tester.format_result(result))
        else:
            error = result.get("error", "Unknown error")
            print(f"❌ Error: {error}")
            print(f"   Details: {result.get('details', 'N/A')}")
            sys.exit(1)
    else:
        sys.exit(1)


if __name__ == "__main__":
    main()
