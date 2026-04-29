"""
OCR pipeline using Claude (Anthropic Vision) for scan-only PDFs.

Why Claude over Gemini for this task:
- No FinishReason.RECITATION blocking on long academic excerpts
- Better at preserving exact formatting in transcription
- Multilingual (handles French, Flemish, kisakata, etc.)

Renders each PDF page to a PNG, asks Claude to transcribe faithfully,
saves a .ocr.txt file with `--- PAGE N ---` markers.

Usage:
    python scripts/ocr_pdf_claude.py <input.pdf> [--start 1] [--end -1] [--out output.txt]

Prompt caching is leveraged via the system prompt to keep cost low.

Cost estimate (claude-haiku-4-5):
    ~$0.0015 per page → 200 pages ≈ $0.30
"""

import os
import sys
import io
import time
import argparse
import base64
import fitz  # pymupdf
from anthropic import Anthropic

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Claude Haiku 4.5 — best price/perf for vision OCR
DEFAULT_MODEL = "claude-haiku-4-5"

OCR_SYSTEM = """Tu es un transcripteur de précision pour des documents
ethnographiques anciens (1900-1990) en français, flamand, latin, et langues
bantu (kisakata, lingala, swahili). Ton seul job : transcrire le texte de
l'image fournie, mot pour mot, en préservant la mise en forme.

RÈGLES :
1. Conserve paragraphes, listes, titres, notes de bas de page tels quels.
2. Garde tous les mots originaux, y compris termes vernaculaires.
3. Pour figures/schémas : décris brièvement entre crochets [Figure: ...].
4. Si illisible : [illisible].
5. Tu ne fais AUCUN commentaire, AUCUNE introduction, AUCUNE conclusion.
   Juste le texte transcrit, brut. Pas de markdown ```.
"""


def render_page_png(doc, page_num, dpi=200):
    page = doc[page_num]
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return pix.tobytes("png")


def ocr_page_claude(client, png_bytes, page_num, model_name, max_retries=4):
    image_b64 = base64.standard_b64encode(png_bytes).decode("utf-8")

    for attempt in range(max_retries):
        try:
            message = client.messages.create(
                model=model_name,
                max_tokens=8192,
                system=[
                    {
                        "type": "text",
                        "text": OCR_SYSTEM,
                        "cache_control": {"type": "ephemeral"},
                    }
                ],
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/png",
                                    "data": image_b64,
                                },
                            },
                            {
                                "type": "text",
                                "text": "Transcris cette page.",
                            },
                        ],
                    }
                ],
            )
            text_parts = []
            for block in message.content:
                if hasattr(block, "text") and block.text:
                    text_parts.append(block.text)
            text = "".join(text_parts).strip()

            # Strip surrounding markdown fence if Claude added one despite instructions
            if text.startswith("```") and text.endswith("```"):
                lines = text.split("\n")
                text = "\n".join(lines[1:-1]).strip()

            if text:
                return text

            if attempt < max_retries - 1:
                wait = 2 + attempt * 2
                print(f"  [WARN] page {page_num} empty, retry in {wait}s")
                time.sleep(wait)
                continue
            return f"[OCR empty after {max_retries} retries]"

        except Exception as e:
            err = str(e)[:120]
            if attempt < max_retries - 1:
                wait = (2 ** attempt) + 1
                print(f"  [WARN] page {page_num} attempt {attempt + 1} failed: {err}; retry in {wait}s")
                time.sleep(wait)
            else:
                print(f"  [ERROR] page {page_num} failed: {err}")
                return f"[ERROR: OCR failed - {err}]"
    return ""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", help="Path to PDF file")
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=-1)
    parser.add_argument("--out", default=None)
    parser.add_argument("--dpi", type=int, default=200)
    parser.add_argument("--model", default=DEFAULT_MODEL)
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("[ERROR] ANTHROPIC_API_KEY env var required")
        sys.exit(1)

    if not os.path.isfile(args.pdf):
        print(f"[ERROR] File not found: {args.pdf}")
        sys.exit(1)

    out_path = args.out or args.pdf.replace(".pdf", ".ocr.txt")

    print("=" * 70)
    print(f"  CLAUDE OCR — {os.path.basename(args.pdf)}")
    print(f"  Model: {args.model}")
    print("=" * 70)

    doc = fitz.open(args.pdf)
    total_pages = doc.page_count
    start = max(1, args.start)
    end = total_pages if args.end == -1 else min(total_pages, args.end)
    pages_to_ocr = end - start + 1

    print(f"\nTotal pages: {total_pages}")
    print(f"Will OCR pages {start} to {end} ({pages_to_ocr} pages)")
    print(f"Output: {out_path}\n")

    client = Anthropic(api_key=api_key)

    # Resume support
    existing_pages = set()
    if os.path.exists(out_path):
        with open(out_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.startswith("--- PAGE "):
                    try:
                        n = int(line.replace("--- PAGE ", "").replace(" ---", "").strip())
                        existing_pages.add(n)
                    except ValueError:
                        pass
        if existing_pages:
            print(f"[INFO] {len(existing_pages)} pages already done, resuming")

    mode = "a" if existing_pages else "w"
    with open(out_path, mode, encoding="utf-8") as out_f:
        if not existing_pages:
            out_f.write(f"# OCR via {args.model}\n# Source: {os.path.basename(args.pdf)}\n\n")

        for page_num in range(start, end + 1):
            if page_num in existing_pages:
                continue

            t0 = time.time()
            png = render_page_png(doc, page_num - 1, dpi=args.dpi)
            text = ocr_page_claude(client, png, page_num, args.model)
            dt = time.time() - t0

            out_f.write(f"\n--- PAGE {page_num} ---\n\n")
            out_f.write(text)
            out_f.write("\n")
            out_f.flush()

            preview = text[:80].replace("\n", " ") if text else "(empty)"
            print(f"  [PAGE {page_num}/{end}] {dt:.1f}s · {len(text)} chars · {preview}...")

    doc.close()
    print(f"\n[DONE] OCR saved to: {out_path}")


if __name__ == "__main__":
    main()
