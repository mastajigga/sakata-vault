import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('c:/Users/Fortuné/Projects/Sakata/.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(url, key)

ARTICLE_IDS = [
    "4eb5c192-bca8-47dd-a9d0-1b5630df7535",
    "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
    "a9407ed5-9a07-40fa-8acf-9c9657f2ab24",
    "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d"
]

def clean_content():
    for aid in ARTICLE_IDS:
        print(f"Cleaning Article {aid}...")
        res = supabase.table("articles").select("content").eq("id", aid).single().execute()
        if not res.data:
            continue
            
        content = res.data['content']
        cleaned_content = {}
        
        for lang, text in content.items():
            if isinstance(text, str):
                # Remove all '#' characters
                cleaned_text = text.replace("#", "")
                cleaned_content[lang] = cleaned_text
            else:
                cleaned_content[lang] = text
                
        supabase.table("articles").update({"content": cleaned_content}).eq("id", aid).execute()
        print(f"Article {aid} cleaned.")

if __name__ == "__main__":
    clean_content()
