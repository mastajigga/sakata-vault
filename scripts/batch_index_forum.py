import subprocess
import json

def index_passage(id, passage, metadata):
    namespace = "sakata"
    cmd = [
        "python", "scripts/pinecone_cli.py",
        "--namespace", namespace,
        "store", id, passage,
        "--meta", json.dumps(metadata)
    ]
    print(f"Indexing {id}...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error indexing {id}: {result.stderr}")
    else:
        print(f"Index successful for {id}")

# Load the data from the previously viewed output (I'll extract it manually here)
forum_data = [
    {"thread_id":"de835034-1cf9-4f6b-85e0-02b10eb98f68","thread_title":"Discussion : Lukeni lua Nimi : L'ombre du fondateur","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"8d86745f-0f2c-40dc-8ae0-e6d21ef9b958","thread_title":"Discussion : Le Rite Ngongo : Le passage vers la sagesse","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"803c4296-5cd0-4a5a-a202-7aa4e9bbc9ed","thread_title":"Discussion : Les origines Bantou des Basakata","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"baefe71e-003f-4684-8a59-b41ad1f336f6","thread_title":"Discussion : L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"4121c495-6caa-4137-adf3-9a3228e37f6b","thread_title":"Discussion : L'énergie vitale (Moyo)","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"d7004785-8ec9-4104-b74b-fc3b2a92a284","thread_title":"Discussion : Introduction à la langue Kisakata","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"8c50454c-548f-40fc-9317-befff1b092fc","thread_title":"Discussion : Proverbes Nkundi et sagesse","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"abcf6006-6e30-4df5-9195-270510d1fedf","thread_title":"Discussion : Iluo : Les doubles","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"9572ad56-6bed-4209-b3e4-49c44c1432cb","thread_title":"Discussion : Le corps, l'esprit et le souffle","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"a10e7f1a-e8e4-493b-b720-12e169774f41","thread_title":"Discussion : Culture Générale Mboka","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"18f50396-a600-4115-acb6-5bc2c4a4185e","thread_title":"Discussion : Artisanat : Masques et Sculptures","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"f1025e35-bfa4-4b96-9f99-95b6b6dbd5c5","thread_title":"Discussion : Le Royaume du Congo : Nos racines","category":"Culture & Savoir","post_content":"Partagez vos impressions et vos savoirs sur cet article avec la communauté.","post_date":"2026-04-05 22:40:36.25713+00","author":None},
    {"thread_id":"baefe71e-003f-4684-8a59-b41ad1f336f6-post1","thread_title":"Discussion : L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe","category":"Culture & Savoir","post_content":"Test","post_date":"2026-04-06 21:58:30.733361+00","author":"membre_7dd8fb16"},
    {"thread_id":"baefe71e-003f-4684-8a59-b41ad1f336f6-post2","thread_title":"Discussion : L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe","category":"Culture & Savoir","post_content":"interessant l'article","post_date":"2026-04-14 18:58:55.820846+00","author":"Fondateur"}
]

for i, post in enumerate(forum_data):
    passage = f"passage: Forum {post['category']} - {post['thread_title']}: {post['post_content']}"
    id = f"forum_post_{i}"
    metadata = {
        "source": "forum",
        "category": post['category'],
        "thread": post['thread_title'],
        "author": post['author'] if post['author'] else "Anonyme",
        "date": post['post_date']
    }
    index_passage(id, passage, metadata)
