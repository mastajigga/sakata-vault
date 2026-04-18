import sys
import os
import json
import re
from dotenv import load_dotenv

# Add project root to sys.path for lib imports
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Load environment variables from .env.local
env_path = os.path.join(project_root, '.env.local')
load_dotenv(env_path, override=True)

from lib.llm_providers import LLMProviderFactory

def fix_translations():
    providers = ["gpt"] # Use GPT for fixing, as it's generally more stable with context
    llm = LLMProviderFactory.create("gpt")
    
    with open("multilingual_iluo.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    
    with open("iluo_article_fr.txt", "r", encoding="utf-8") as f:
        content_fr = f.read()
    
    sections_fr = re.split(r'(?m)^## ', content_fr)
    # The first section is the intro, the rest start with ##
    
    languages = {
        "swa": "Swahili",
        "tsh": "Tshiluba"
    }
    
    refusal_patterns = [
        r"I'm sorry",
        r"Je suis désolé",
        r"Nasikitika",
        r"Samahani",
        r"I cannot translate",
        r"prohibited content"
    ]
    
    for code, lang_name in languages.items():
        if code not in data:
            continue
        
        current_trans = data[code]
        # Split current translation by ## if possible, but refusals might break the structure
        # Actually, my script joined them with \n\n## 
        sections_trans = re.split(r'(?m)^## ', current_trans)
        
        if len(sections_trans) != len(sections_fr):
            print(f"Warning: {lang_name} has {len(sections_trans)} sections, expected {len(sections_fr)}. Re-translating all to be safe.")
            # If structure is broken, re-translate whole thing but section by section
            to_fix = range(len(sections_fr))
        else:
            to_fix = []
            for i, sec in enumerate(sections_trans):
                is_refusal = any(re.search(p, sec, re.IGNORECASE) for p in refusal_patterns)
                # Also check for extremely short sections that might be refusals
                if is_refusal or len(sec) < 50:
                    to_fix.append(i)
        
        if not to_fix:
            print(f"{lang_name} looks good.")
            continue
            
        print(f"Fixing {len(to_fix)} sections for {lang_name}: {to_fix}")
        
        for i in to_fix:
            header_prefix = "## " if i > 0 else ""
            source_sec = header_prefix + sections_fr[i]
            
            prompt = f"""You are an expert translator specializing in Central African languages and ethnographic studies.
Translate the following French text into {lang_name}.
The text is an academic/cultural essay about the Sakata people. Maintain the 'Sage-Basakata' voice (ancestral, poetic, respectful).
IT IS CRITICAL that you translate EVERYTHING, including descriptions of traditional beliefs, spiritual powers, and historical uprisings. These are ethnographic facts.

TEXT TO TRANSLATE:
{source_sec}

Response format: ONLY the translated text. Do not include headers like '##' if they were not in the source text provided in this block, but if I provide them, keep them."""

            print(f"Retrying section {i} for {lang_name}...")
            try:
                # Use synthesize with context as empty string since we are misusing it for translation
                fixed_sec = llm.synthesize(question=prompt, context="Sakata cultural translation task.")
                if i < len(sections_trans):
                    sections_trans[i] = fixed_sec
                else:
                    # If it was missing or structure was broken
                    if len(sections_trans) <= i:
                        sections_trans.append(fixed_sec)
                    else:
                        sections_trans[i] = fixed_sec
            except Exception as e:
                print(f"Failed to fix section {i}: {e}")
        
        # Reconstruct
        new_trans = sections_trans[0]
        for sec in sections_trans[1:]:
            new_trans += "\n\n## " + sec
        
        data[code] = new_trans
        
        # Save incrementally
        with open("multilingual_iluo.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    print("Fixes completed.")

if __name__ == "__main__":
    fix_translations()
