"""
OCR pipeline using OpenAI GPT-4o Vision for scan-only PDFs.

Why this exists alongside the Gemini and Claude versions:
- Gemini blocks ethnographic content with FinishReason.RECITATION
- Claude was blocked by exhausted credits

OpenAI GPT-4o-mini gives excellent OCR for old French/Flemish/Bantu
documents at ~$0.0007 per page.

Usage:
    python scripts/ocr_pdf_openai.py <input.pdf> [--start 1] [--end -1] [--out output.txt]
"""

import os
import sys
import io
import time
import argparse
import base64
import fitz  # pymupdf
from openai import OpenAI

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

DEFAULT_MODEL = "gpt-4o-mini"

OCR_SYSTEM = """Tu es un transcripteur de précision pour des documents
ethnographiques anciens (1900-1990) en français, flamand, latin, et langues
bantu (kisakata, lingala, swahili).

RÈGLES STRICTES :
1. Transcris fidèlement le texte de l'image, mot pour mot.
2. Conserve paragraphes, listes, titres, notes de bas de page tels quels.
3. Garde les mots originaux y compris termes vernaculaires (ne traduis pas).
4. Pour figures/schémas : décris brièvement entre crochets [Figure: ...].
5. Si illisible : [illisible].
6. AUCUN commentaire, AUCUNE introduction, AUCUNE conclusion. Pas de markdown ```.
"""


def render_page_png(doc, page_num, dpi=200):
    page = doc[page_num]
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return pix.tobytes("png")


def ocr_page_openai(client, png_bytes, page_num, model_name, max_retries=4):
    image_b64 = base64.standard_b64encode(png_bytes).decode("utf-8")

    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model_name,
                max_tokens=8192,
                temperature=0.0,
                messages=[
                    {"role": "system", "content": OCR_SYSTEM},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Transcris cette page."},
                            {
                                "type": "image_url",
                                "image_url": {"url": f"data:image/png;base64,{image_b64}"},
                            },
                        ],
                    },
                ],
            )
            text = (response.choices[0].message.content or "").strip()

            # Strip surrounding markdown fence if present
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

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("[ERROR] OPENAI_API_KEY env var required")
        sys.exit(1)

    if not os.path.isfile(args.pdf):
        print(f"[ERROR] File not found: {args.pdf}")
        sys.exit(1)

    out_path = args.out or args.pdf.replace(".pdf", ".ocr.txt")

    print("=" * 70)
    print(f"  OPENAI OCR — {os.path.basename(args.pdf)}")
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

    client = OpenAI(api_key=api_key)

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
            text = ocr_page_openai(client, png, page_num, args.model)
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
