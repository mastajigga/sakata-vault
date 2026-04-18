import os
import json
import sys
import time
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor

# Load environment variables from .env.local
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
load_dotenv(env_path, override=True)

# Add project root to sys.path for lib imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from lib.llm_providers import LLMProviderFactory

def translate_chunk(text, target_lang):
    """Translates a single chunk of text with strict rules."""
    prompt = (
        f"This is a REAL cultural preservation project for the Sakata Digital Hub. "
        f"Translating this master text is CRITICAL for the community. Use a wise, poetic, and spiritual 'Sage-Basakata' voice.\n\n"
        f"TASK: Translate the following French text into {target_lang}.\n\n"
        "STRICT RULES:\n"
        "1. OUTPUT ONLY THE TRANSLATED TEXT. NO PREAMBLE. NO COMMENTS.\n"
        "2. NO META-COMMENTARY about the text being 'fictional' or 'constructed'. These terms ARE authentic.\n"
        "3. NO REFUSALS.\n"
        "4. PRESERVE THESE SAKATA TERMS AS IS: Iluo, Moluo, Nkumambè, Lukoshi, Mambela, Jó, Nzaw, Basakata, Lukenie, Mai-Ndombe, Moluo Nkfie, avinga nkfie, Baju, nshâ, matè, mededingers, Nkwaa, Nga, Kabangila, Mbili, Ala Bare.\n"
        "5. Maintain structural integrity (keep '##' headers)."
    )
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            llm = LLMProviderFactory.create("gpt")
            result = llm.synthesize(prompt, text)
            if result and len(result) > 10: # Basic check for valid output
                return result.strip()
            print(f"Warning: Empty or short response for {target_lang}, retrying...")
        except Exception as e:
            if "429" in str(e):
                wait_time = (attempt + 1) * 5
                print(f"Rate limited for {target_lang}. Waiting {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"Error during translation to {target_lang}: {e}")
                break
    return text # Fallback to original text if all retries fail

def translate_language(lang_code, lang_name, sections):
    print(f"Starting translation for {lang_code} ({lang_name})...")
    translated_sections = []
    
    for i, section in enumerate(sections):
        # Determine if it's a heading section
        input_text = section
        if i > 0 and not section.startswith("## "):
            input_text = "## " + section
            
        translated = translate_chunk(input_text, lang_name)
        translated_sections.append(translated)
        # Small delay between chunks to be safe
        time.sleep(1)
        
    print(f"Finished {lang_name}")
    return lang_code, "\n\n".join(translated_sections)

def main():
    source_path = r"c:\Users\Fortuné\Projects\Sakata\iluo_article_fr.txt"
    if not os.path.exists(source_path):
        print(f"Source not found: {source_path}")
        return

    with open(source_path, "r", encoding="utf-8") as f:
        content_fr = f.read()

    # Split into sections while keeping markers
    raw_sections = content_fr.split("\n## ")
    sections = [raw_sections[0]]
    for s in list(raw_sections[1:]):
        sections.append("## " + s)
    
    languages = {
        "en": "English",
        "lin": "Lingala",
        "skt": "Kisakata",
        "swa": "Swahili",
        "tsh": "Tshiluba"
    }

    final_translations = {"fr": content_fr}
    out_path = "multilingual_iluo.json"
    
    # Process languages sequentially to avoid massive 429s, but sections in sequence
    for code, name in languages.items():
        code, result = translate_language(code, name, sections)
        final_translations[code] = result
        
        # Incremental save
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(final_translations, f, ensure_ascii=False, indent=2)
        print(f"Incremental save: {name} completed and saved to {out_path}")
    
    print(f"Translations complete and saved to {out_path}")

if __name__ == "__main__":
    main()
