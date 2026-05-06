"""
OCR pipeline using Gemini Vision for scan-only PDFs.

Renders each PDF page to a PNG image, asks Gemini 1.5 Pro to transcribe it
faithfully, and saves a .ocr.txt file with `--- PAGE N ---` markers
(same format as scripts/ingest_books_smart.py expects).

Usage:
    python scripts/ocr_pdf_gemini.py <input.pdf> [--start 1] [--end -1] [--out output.txt]

Cost estimate (Gemini 1.5 Flash):
    ~$0.0001 per page → 200 pages ≈ $0.02
    (Gemini 2.5 Flash chosen for cost/quality balance on OCR)
"""

import os
import sys
import io
import time
import argparse
import base64
import fitz  # pymupdf
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)
from google import genai
from google.genai import types

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Use Gemini 2.5 Pro for OCR — better on dense old documents, less rate-limited
# Override via --model arg if needed
MODEL = "gemini-2.5-pro"

# Relax safety filters — old ethnographic texts mention rituals, fetishes, etc.
# that should not be considered "harmful content" for transcription purposes.
SAFETY_OFF = [
    types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="BLOCK_NONE"),
    types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="BLOCK_NONE"),
    types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="BLOCK_NONE"),
    types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="BLOCK_NONE"),
]

OCR_PROMPT = """Transcris fidèlement le texte de cette page de document.
Règles strictes :
1. Conserve la mise en forme : paragraphes, listes, titres, notes de bas de page.
2. Garde tous les mots tels quels, y compris les termes en kisakata, lingala,
   flamand, latin, ou toute langue locale. Ne traduis PAS.
3. Pour les schémas, tableaux, figures : décris brièvement entre crochets
   [Tableau: ...] ou [Figure: ...].
4. Si une partie est illisible, écris [illisible].
5. N'ajoute AUCUN commentaire, AUCUNE introduction, AUCUNE conclusion.
   Juste le texte transcrit, brut.
"""


def render_page_png(doc, page_num, dpi=200):
    """Render page to PNG bytes."""
    page = doc[page_num]
    mat = fitz.Matrix(dpi / 72, dpi / 72)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    return pix.tobytes("png")


def extract_text_from_response(response):
    """
    Extract concatenated text from a Gemini response.
    response.text returns None when the response contains non-text parts
    (thinking, function calls, etc.) — we walk parts manually.
    """
    if not response or not response.candidates:
        return ""
    parts = []
    for cand in response.candidates:
        if not cand.content or not cand.content.parts:
            continue
        for part in cand.content.parts:
            text = getattr(part, "text", None)
            if text:
                parts.append(text)
    return "".join(parts).strip()


def ocr_page(client, png_bytes, page_num, model_name=MODEL, max_retries=4):
    """OCR a single page via Gemini Vision."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    OCR_PROMPT,
                    types.Part.from_bytes(data=png_bytes, mime_type="image/png"),
                ],
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    max_output_tokens=16384,
                    safety_settings=SAFETY_OFF,
                ),
            )
            text = extract_text_from_response(response)
            if text:
                return text

            # Empty response — diagnose
            finish = "unknown"
            if response.candidates:
                fr = getattr(response.candidates[0], "finish_reason", None)
                finish = str(fr) if fr else "no_finish_reason"
            if attempt < max_retries - 1:
                wait = 2 + attempt * 3
                print(f"  [WARN] page {page_num} empty (finish={finish}), retry in {wait}s")
                time.sleep(wait)
                continue
            print(f"  [ERROR] page {page_num} stays empty after {max_retries} retries (finish={finish})")
            return f"[OCR empty: finish={finish}]"
        except Exception as e:
            err = str(e)[:100]
            if attempt < max_retries - 1:
                wait = (2 ** attempt) + 1
                print(f"  [WARN] page {page_num} attempt {attempt + 1} failed: {err}; retrying in {wait}s")
                time.sleep(wait)
            else:
                print(f"  [ERROR] page {page_num} failed after {max_retries} attempts: {err}")
                return f"[ERROR: OCR failed - {err}]"
    return ""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", help="Path to PDF file")
    parser.add_argument("--start", type=int, default=1, help="First page (1-indexed)")
    parser.add_argument("--end", type=int, default=-1, help="Last page, -1 = all")
    parser.add_argument("--out", default=None, help="Output .txt path")
    parser.add_argument("--dpi", type=int, default=200, help="Render DPI")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[ERROR] GEMINI_API_KEY env var required")
        sys.exit(1)

    if not os.path.isfile(args.pdf):
        print(f"[ERROR] File not found: {args.pdf}")
        sys.exit(1)

    out_path = args.out or args.pdf.replace(".pdf", ".ocr.txt")

    print("=" * 70)
    print(f"  GEMINI OCR — {os.path.basename(args.pdf)}")
    print("=" * 70)

    doc = fitz.open(args.pdf)
    total_pages = doc.page_count
    start = max(1, args.start)
    end = total_pages if args.end == -1 else min(total_pages, args.end)
    pages_to_ocr = end - start + 1

    print(f"\nTotal pages: {total_pages}")
    print(f"Will OCR pages {start} to {end} ({pages_to_ocr} pages)")
    print(f"Output: {out_path}")
    print(f"Model: {MODEL}, DPI: {args.dpi}")
    print()

    client = genai.Client(api_key=api_key)

    # Resume support: append mode if file exists, but check what's already done
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
        print(f"[INFO] Found {len(existing_pages)} pages already OCR'd, resuming")

    mode = "a" if existing_pages else "w"
    with open(out_path, mode, encoding="utf-8") as out_f:
        if not existing_pages:
            out_f.write(f"# OCR via {MODEL}\n# Source: {os.path.basename(args.pdf)}\n\n")

        for page_num in range(start, end + 1):
            if page_num in existing_pages:
                continue

            t0 = time.time()
            png = render_page_png(doc, page_num - 1, dpi=args.dpi)
            text = ocr_page(client, png, page_num)
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
