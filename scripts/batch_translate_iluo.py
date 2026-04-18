import os
import json
import sys
import time
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local')
load_dotenv(env_path, override=True)

# Supabase setup
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

# Add project root to sys.path for lib imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from lib.llm_providers import LLMProviderFactory

ARTICLE_IDS = [
    "4eb5c192-bca8-47dd-a9d0-1b5630df7535", # Epic Long
    "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e", # System Long
    "a9407ed5-9a07-40fa-8acf-9c9657f2ab24", # Epic Short
    "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"  # System Short
]

LANGUAGES = {
    "en": "English",
    "lin": "Lingala",
    "skt": "Kisakata",
    "swa": "Swahili",
    "tsh": "Tshiluba"
}

def translate_chunk(text, target_lang):
    prompt = (
        f"This is a REAL cultural preservation project for the Sakata Digital Hub (Kisakata.com). "
        f"Use a wise, poetic, and spiritual 'Sage-Basakata' voice for African languages, and a professional yet soulfull academic voice for English.\n\n"
        f"TASK: Translate the following French text into {target_lang}.\n\n"
        "STRICT RULES:\n"
        "1. OUTPUT ONLY THE TRANSLATED TEXT. NO PREAMBLE. NO COMMENTS.\n"
        "2. PRESERVE THESE SAKATA TERMS: Iluo, Moluo, Nkumambè, Lukoshi, Mambela, Jó, Nzaw, Basakata, Lukenie, Mai-Ndombe, Moluo Nkfie, avinga nkfie, Baju, nshâ, matè, Nkwaa, Nga, Kabangila, Mbili, Ala Bare, Bosie, Moju, Nkfie, Mvugu, Metugu, Bwanga.\n"
        "3. Maintain formatting (headers, bullet points)."
    )
    
    try:
        llm = LLMProviderFactory.create("gpt")
        return llm.synthesize(prompt, text).strip()
    except Exception as e:
        print(f"Error translating to {target_lang}: {e}")
        return None

def process_article(article_id):
    print(f"\n--- Processing Article: {article_id} ---")
    res = supabase.table("articles").select("*").eq("id", article_id).single().execute()
    article = res.data
    if not article:
        print("Article not found.")
        return

    content_fr = article['content'].get('fr', '')
    if not content_fr:
        print("No French content found.")
        return

    # Split into sections by headers
    sections = []
    current_section = []
    for line in content_fr.split('\n'):
        if line.startswith('## '):
            if current_section:
                sections.append('\n'.join(current_section))
            current_section = [line]
        else:
            current_section.append(line)
    if current_section:
        sections.append('\n'.join(current_section))

    updated_content = article['content']
    
    for lang_code, lang_name in LANGUAGES.items():
        if lang_code in updated_content and len(updated_content[lang_code]) > 100:
            # Skip if already translated (only for short ones maybe? No, let's refresh all to be safe for this epic)
            pass

        print(f"Translating to {lang_name}...")
        translated_sections = []
        for sect in sections:
            trans = translate_chunk(sect, lang_name)
            if trans:
                translated_sections.append(trans)
            else:
                translated_sections.append(sect) # Fallback
            time.sleep(0.5)
        
        updated_content[lang_code] = '\n\n'.join(translated_sections)
        # Immediate sync for this language
        supabase.table("articles").update({"content": updated_content}).eq("id", article_id).execute()
        print(f"Saved {lang_name} for article {article_id}")

def main():
    for aid in ARTICLE_IDS:
        process_article(aid)

if __name__ == "__main__":
    main()
