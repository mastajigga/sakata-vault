import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('c:/Users/Fortuné/Projects/Sakata/.env.local')

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(url, key)

ARTICLE_ID = "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e"

with open('c:/Users/Fortuné/Projects/Sakata/iluo_article_fr.txt', 'r', encoding='utf-8') as f:
    content_fr = f.read()

res = supabase.table("articles").update({"content": {"fr": content_fr}}).eq("id", ARTICLE_ID).execute()

print("System (Anthropological) article updated successfully.")
print(res)
