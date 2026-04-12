---
description: How to use the Pinecone infinite memory CLI to search, store, fetch, and delete vectors in the 'sakata' index.
---

# Pinecone Infinite Memory System

The CLI tool is located at `scripts/pinecone_cli.py`. It provides read/write access to the Pinecone **sakata** index using **multilingual-e5-base** embeddings. All output is JSON.

## Commands

### Search (semantic)
```powershell
// turbo
python scripts/pinecone_cli.py search "votre requête en langage naturel" --top_k 5
```

### Check index stats
```powershell
// turbo
python scripts/pinecone_cli.py stats
```

### Store a new memory
```powershell
python scripts/pinecone_cli.py store "memory-id" "texte à stocker" --meta type=note source=conversation
```

### Fetch by ID
```powershell
// turbo
python scripts/pinecone_cli.py fetch "vector-id-1" "vector-id-2"
```

### List vector IDs
```powershell
// turbo
python scripts/pinecone_cli.py list --prefix "MPIA" --limit 10
```

### Delete vectors
```powershell
python scripts/pinecone_cli.py delete "vector-id-1" "vector-id-2"
```

## Namespaces
Add `--namespace "ns_name"` or `-ns "ns_name"` to any command to work within a namespace.

## Notes
- Search queries are automatically prefixed with `query: ` (E5 convention)
- Stored text is automatically prefixed with `passage: ` for embedding
- Metadata always includes `text` (first 1000 chars) for retrieval
- The model loads on first use (~5s cold start, then fast)
