# Pinecone Memory System Skill

**Slash Command:** `/pinecone`

**Description:** Gère la base vectorielle Pinecone pour Kisakata — indexation, recherche sémantique, et gestion des namespaces.

---

## Commandes Disponibles

### 1. Search - Recherche Sémantique
```bash
/pinecone search "votre requête" [--top_k 5] [--namespace iluo_livres]
```

**Exemples :**
```
/pinecone search "double spirituel Sakata"
/pinecone search "épopée Kongo" --top_k 3 --namespace iluo_livres
/pinecone search "exercices Lemvia" --namespace iluo_exercices
```

**Retourne :**
- Top-k résultats les plus pertinents
- Score de similarité (0-1)
- Métadonnées (title, category, etc.)
- Extrait du contenu

---

### 1.5 Semantic-Search - Recherche Sémantique Intelligente

**🆕 NEW COMMAND** - Synthèse intelligente par Claude

```bash
/pinecone semantic-search "votre requête" [--top_k 10] [--namespace iluo_livres]
```

**Exemples :**
```
/pinecone semantic-search "Explique-moi l'Iluo et son rôle spirituel"
/pinecone semantic-search "Raconte-moi l'épopée du peuple Sakata" --top_k 15
/pinecone semantic-search "Qu'est-ce que le Moyo" --namespace iluo_livres_site
```

**Différence avec `search` :**
- ✅ `search` = retourne liste brute de 5 documents
- ✅ `semantic-search` = synthèse intelligente intégrant tous les documents

**Retourne :**
```json
{
  "answer": "L'Iluo est la capacité de voir au-delà du visible, une force spirituelle invisible qui accompagne les chefs et les initiés...",
  "sources": [
    {
      "id": "site-iluo-regard-du-pouvoir",
      "title": "Iluo : Le Regard du Pouvoir",
      "type": "article",
      "score": 0.83
    },
    ...
  ],
  "searchResultCount": 10
}
```

**Configuration :**
- Default LLM: Claude (Anthropic)
- Peut utiliser: Gemini, GPT-4o, Qwen, Grok
- Configuration: Voir variable d'env `LLM_PROVIDER` dans `.env.local`

**Performance :**
- Embedding + Search: ~300ms
- Claude synthesis: 2-5 secondes
- Total: 2.5-5.5 secondes

**Cas d'usage :**
```
# Pour une compréhension complète d'un concept
/pinecone semantic-search "Explique-moi la différence entre Iluo, Moyo et Mfundu"

# Pour l'histoire
/pinecone semantic-search "Raconte-moi comment s'est construit le Royaume du Congo"

# Pour l'éducation
/pinecone semantic-search "Comment enseigne-t-on le Moyo aux enfants" --namespace iluo_exercices
```

---

### 2. Remember - Ajouter/Mettre à jour un Vecteur
```bash
/pinecone remember "id" "texte à mémoriser" --namespace iluo_livres [--meta key=value ...]
```

**Exemples :**
```
/pinecone remember "iluo-article-001" "C'est le temps des enseignements secrets. On parle de l'Iluo..." --namespace iluo_livres
/pinecone remember "exercice-math-001" "Compter les pirogues de Lemvia" --namespace iluo_exercices --meta level=1ere category=mathematiques
```

**Options :**
- `--namespace` : iluo_livres, iluo_exercices, iluo_chefferies (défaut: iluo_livres)
- `--meta` : Paires clé=valeur pour métadonnées

---

### 3. Fetch - Récupérer un Vecteur par ID
```bash
/pinecone fetch "id1" "id2" ... [--namespace iluo_livres]
```

**Exemples :**
```
/pinecone fetch "iluo-article-001"
/pinecone fetch "exercice-001" "exercice-002" --namespace iluo_exercices
```

---

### 4. Delete - Supprimer des Vecteurs
```bash
/pinecone delete "id1" "id2" ... [--namespace iluo_livres]
```

**Exemples :**
```
/pinecone delete "old-exercise-001"
/pinecone delete "duplicate-article-001" --namespace iluo_livres
```

---

### 5. List - Lister les Vecteurs
```bash
/pinecone list [--namespace iluo_livres] [--prefix "iluo-"] [--limit 20]
```

**Exemples :**
```
/pinecone list
/pinecone list --namespace iluo_livres --limit 50
/pinecone list --prefix "iluo-" --namespace iluo_livres
```

---

### 6. Stats - Afficher les Statistiques
```bash
/pinecone stats
```

**Retourne :**
- Total de vecteurs par namespace
- Dimension des embeddings (768)
- Métadonnées du projet

---

### 7. Index-Articles - Indexer Tous les Articles
```bash
/pinecone index-articles [--namespace iluo_livres] [--force]
```

**Exemples :**
```
/pinecone index-articles
/pinecone index-articles --namespace iluo_livres --force
```

**Comportement :**
- Lit les articles depuis `src/data/articles.ts`
- Indexe UNIQUEMENT le champ `.content` (pas `.summary`)
- Crée des métadonnées (title, category, slug)
- `--force` : réindexe même si déjà présent

---

### 8. Index-Exercises - Indexer Tous les Exercices
```bash
/pinecone index-exercises [--namespace iluo_exercices] [--force]
```

**Exemples :**
```
/pinecone index-exercises
/pinecone index-exercises --force
```

---

### 9. Index-Books - Indexer Sélectivement par Catégorie
```bash
/pinecone index-books [--category spiritualite] [--namespace iluo_livres]
```

**Exemples :**
```
/pinecone index-books
/pinecone index-books --category spiritualite
/pinecone index-books --category histoire --namespace iluo_livres
```

---

### 10. Clear-Namespace - Vider un Namespace
```bash
/pinecone clear-namespace iluo_livres [--confirm]
```

⚠️ **Destructive operation** - Requiert `--confirm`

---

## Cas d'Utilisation

### 📚 Indexer les Articles du Site
```bash
/pinecone index-articles
# → 12 articles indexés dans iluo_livres
# → Chacun représenté par le contenu complet (2000+ mots)
```

### 🔍 Chercher un Concept Spirituel
```bash
/pinecone search "Iluo double spirituel"
# → Score 0.89 : iluo-regard-du-pouvoir
# → Retourne les 2500 mots complets du livre
```

### ✏️ Ajouter un Nouvel Article
```bash
/pinecone remember "nouvel-article-001" "Contenu complet du nouvel article..." --namespace iluo_livres --meta title="Nouveau Concept" category="spiritualite"
```

### 📊 Vérifier l'État
```bash
/pinecone stats
# iluo_livres: 12 vecteurs
# iluo_exercices: 48 vecteurs
# iluo_chefferies: 7 vecteurs
```

### 🧹 Nettoyer les Vieux Vecteurs
```bash
/pinecone list --prefix "old-" --limit 100
/pinecone delete "old-001" "old-002" "old-003"
```

---

## Configuration

**Prérequis :**
- Variable d'env : `PINECONE_API_KEY`
- Modèle d'embedding : `intfloat/multilingual-e5-base`
- Index Pinecone : `sakata`

**Fichier `.env.local` :**
```bash
# Pinecone Configuration
PINECONE_API_KEY=pcsk_7Y6nQP_98RdPcDMvzHsLxSYMnDpiDvvgYyRjVxmfNYPztjM45ujRx9ZFA23KYp8rtgLPUC
PINECONE_INDEX=sakata
PINECONE_NAMESPACES=iluo_livres,iluo_exercices,iluo_chefferies

# LLM Provider Configuration (for semantic-search)
LLM_PROVIDER=claude

# API Keys for different LLM providers
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIzaSy...
OPENAI_API_KEY=sk-...
```

---

## Output Format

### Search Results
```json
[
  {
    "id": "iluo-regard-du-pouvoir",
    "score": 0.8912,
    "metadata": {
      "title": "Iluo : Le Regard du Pouvoir",
      "category": "spiritualite",
      "wordCount": 2547
    },
    "excerpt": "C'est le temps des enseignements secrets..."
  }
]
```

### Index Operation
```json
{
  "status": "success",
  "indexed": 12,
  "namespace": "iluo_livres",
  "details": [
    { "id": "epopee-peuple-sakata", "wordCount": 3500 },
    { "id": "iluo-regard-du-pouvoir", "wordCount": 2547 }
  ]
}
```

### Stats
```json
{
  "index": "sakata",
  "total_vectors": 67,
  "dimension": 768,
  "namespaces": {
    "iluo_livres": { "vector_count": 12 },
    "iluo_exercices": { "vector_count": 48 },
    "iluo_chefferies": { "vector_count": 7 }
  }
}
```

---

## Tips & Best Practices

✅ **À faire :**
- Utiliser `index-articles` pour indexer le savoir complet
- Chercher avec des phrases naturelles longues
- Ajouter des métadonnées pertinentes avec `--meta`
- Utiliser les namespaces pour organiser
- ⭐ Utiliser `semantic-search` pour une compréhension complète (synthèse intelligente)

❌ **À éviter :**
- Indexer les `.summary` (articles courts)
- Chercher avec des mots-clés trop courts
- Mélanger les domaines dans un même namespace
- Supprimer sans `--confirm`

---

## Troubleshooting

**"ENOENT: no such file or directory, open 'PINECONE_API_KEY'"**
→ Vérifier la variable d'env `PINECONE_API_KEY` dans `.env.local`

**"Namespace not found: iluo_custom"**
→ Utiliser les namespaces prédéfinis : iluo_livres, iluo_exercices, iluo_chefferies

**"Vector not found"**
→ Vérifier l'ID exact avec `/pinecone list --prefix "iluo-"`

---

*Skill créée pour Kisakata Memory System - 2026-04-11*
