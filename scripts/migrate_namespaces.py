"""Migrate Pinecone namespaces — remove "iluo_" prefix."""
import os, sys, io, time
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env.local'), override=True)

from pinecone import Pinecone

pc = Pinecone(api_key=os.environ['PINECONE_API_KEY'])
index = pc.Index("sakata")

MIGRATIONS = [
    ("iluo_livres_site", "livres_site"),
    ("iluo_forums", "forums"),
]

for old_ns, new_ns in MIGRATIONS:
    print(f"\n{'='*60}")
    print(f"Migration: {old_ns} → {new_ns}")
    
    # 1. Lister tous les IDs
    ids = []
    pagination_token = None
    while True:
        kwargs = {"namespace": old_ns, "limit": 100}
        if pagination_token:
            kwargs["pagination_token"] = pagination_token
        result = index.list_paginated(**kwargs)
        if result.vectors:
            ids.extend([v.id for v in result.vectors])
        pagination_token = result.pagination.next if result.pagination and result.pagination.next else None
        if not pagination_token:
            break
    
    print(f"  Vecteurs trouvés: {len(ids)}")
    if not ids:
        print(f"  ⚠️  Namespace vide, skip")
        continue
    
    # 2. Fetch + upsert dans le nouveau namespace
    batch_size = 100
    total = 0
    for i in range(0, len(ids), batch_size):
        batch_ids = ids[i:i+batch_size]
        result = index.fetch(ids=batch_ids, namespace=old_ns)
        
        vectors = []
        for vid, vec in result.vectors.items():
            vectors.append({
                "id": vid,
                "values": vec.values,
                "metadata": vec.metadata,
            })
        
        if vectors:
            index.upsert(vectors=vectors, namespace=new_ns)
            total += len(vectors)
            print(f"  batch {i//batch_size + 1}: {len(vectors)} vecteurs")
        time.sleep(0.5)
    
    print(f"  ✅ {total} vecteurs migrés vers {new_ns}")
    
    # 3. Supprimer l'ancien namespace
    print(f"  🗑️  Suppression de {old_ns}...")
    index.delete(delete_all=True, namespace=old_ns)
    print(f"  ✅ {old_ns} supprimé")

print(f"\n{'='*60}")
print("Vérification...")
stats = index.describe_index_stats()
for ns, info in (stats.namespaces or {}).items():
    print(f"  {ns}: {info.vector_count} vecteurs")
print("\n✅ Migration terminée !")
