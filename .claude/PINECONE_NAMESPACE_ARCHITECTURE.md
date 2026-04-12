# Pinecone Namespace Architecture

**Vue d'ensemble complète de la structure de connaissance indexée dans Pinecone**

---

## 🏗️ Structure Globale

```
PINECONE INDEX: "sakata" (768-dimensional embeddings)
├── iluo_livres_academiques (1534 vectors)  ✅ EXISTING
├── iluo_livres_site        (0 vectors)    🟡 TO INDEX
├── iluo_exercices          (0 vectors)    🟡 TO INDEX
└── iluo_chefferies         (0 vectors)    ⚠️  NOT CREATED YET
```

---

## 1️⃣ `iluo_livres_academiques` — Academic Knowledge

### 📚 Contenu
**Source** : Fichiers PDF dans `.../articles` folder

| Livre | Auteur | Année | Taille | Focus |
|-------|--------|-------|--------|-------|
| Religion et magie chez les Basakata | Van Everbroeck | 1952 | 47 MB | Iluo, spiritualité, initiation |
| The Sakata Society in the Congo | Vanzila Munsi | 2016 | 1.9 MB | Histoire, anthropologie, société |
| Phonologie de la langue Sakata | — | — | 46 MB | Linguistique, prononciation |
| L'evangelisation du Mai-Ndombe | Bekina, Jacques | 2009 | — | Histoire coloniale, religion |
| + 12 autres documents | — | — | — | Programmes, recherches, sources |

### 📊 Statistiques
```
Total vectors: 1534
Chunks per document: ~50-100
Dimension: 768 (intfloat/multilingual-e5-base)
Language: Mixed (Dutch, English, French)
Status: ✅ INDEXED AND SEARCHABLE
```

### 🔍 Exemples de Recherche
```bash
# Très pertinent (0.82-0.86 scores)
python pinecone_cli.py search "Iluo double spirituel"
→ Van Everbroeck p26: "iluo (moluo, ndoki in lingala)"

python pinecone_cli.py search "épopée Grassfields Kongo"
→ Vanzila Munsi p52: "migration from Grassfields via Ubangi"

python pinecone_cli.py search "Mbamushie chefferie territoire"
→ Vanzila Munsi p8: "settlement in present-day Lemvia-Sud"
```

### 💾 Métadonnées Typiques
```json
{
  "source": "The Sakata Society in the Congo - Roger Vanzila Munsi.pdf",
  "page": 44,
  "chunk_index": 0,
  "directory": "The Sakata Society in the Congo - Roger Vanzila Munsi",
  "text": "[contenu du chunk]"
}
```

---

## 2️⃣ `iluo_livres_site` — Kisakata Website Content

### 📝 Contenu
**Source** : `src/data/articles.ts` (12 articles, 9 indexed)

| Article | Category | Words | Status |
|---------|----------|-------|--------|
| L'épopée du peuple Sakata | histoire | 807 | ✅ INDEXED |
| Iluo : Le Regard du Pouvoir | spiritualite | 280 | ✅ INDEXED |
| Le Rite Ngongo | culture | 866 | ✅ INDEXED |
| Lukeni lua Nimi | histoire | 952 | ✅ INDEXED |
| Les origines Bantou | histoire | 899 | ✅ INDEXED |
| Le Royaume du Congo | histoire | 736 | ✅ INDEXED |
| Le corps, l'esprit et le souffle | culture | 327 | ✅ INDEXED |
| L'énergie vitale (Moyo) | culture | 237 | ✅ INDEXED |
| Culture Générale Mboka | culture | 157 | ✅ INDEXED |
| [3 articles < 100 words] | [mixed] | 25-72 | 🟡 SKIPPED (too short) |

### 🎯 Objectif
Indexer **uniquement le contenu profond** (`.content` field) pour la recherche sémantique.

### 📊 Structure d'un Article
```typescript
{
  slug: "iluo-regard-du-pouvoir",
  title: { fr: "Iluo : Le Regard du Pouvoir" },
  category: "spiritualite",
  
  summary: { fr: "L'Iluo n'est pas..." },  // ❌ NE PAS INDEXER
  
  content: { fr: "C'est le temps des enseignements secrets..." }  // ✅ INDEXER CECI
}
```

### 💾 Métadonnées Créées
```json
{
  "slug": "iluo-regard-du-pouvoir",
  "title_fr": "Iluo : Le Regard du Pouvoir",
  "category": "spiritualite",
  "type": "book",
  "language": "fr",
  "wordCount": 2547,
  "charCount": 15230,
  "excerpt": "C'est le temps des enseignements secrets...",
  "source": "kisakata-site",
  "indexed_at": "2026-04-11T14:30:00Z"
}
```

### 🔍 Exemples de Recherche (Attendus)
```bash
python pinecone_cli.py search "Iluo" --namespace iluo_livres_site --top_k 3
→ Score 0.89 : iluo-regard-du-pouvoir (site content, complete book)
→ Much more detailed than academic PDF (more poetic, narrative)

python pinecone_cli.py search "épopée Sakata" --namespace iluo_livres_site
→ Score 0.88 : epopee-peuple-sakata (3500 word narrative)
→ With Grassfields, Kongo, Mai-Ndombe context

python pinecone_cli.py search "Nzela chemin de vie"
→ Score 0.85 : nzela-le-chemin-de-vie (2500 word article)
```

### ⚙️ Indexation
```bash
# Utiliser le script d'indexation
python scripts/pinecone_index_articles.py

# Ou manuellement
python pinecone_cli.py store "site-iluo-regard-du-pouvoir" \
  "C'est le temps des enseignements secrets..." \
  --namespace iluo_livres_site \
  --meta title="Iluo : Le Regard du Pouvoir" category=spiritualite wordCount=2547
```

---

## 3️⃣ `iluo_exercices` — School Exercises

### 📝 Contenu
**Source** : `src/app/ecole/data/mathematics-curriculum.ts`

| Year | Exercises | Local Context | Status |
|------|-----------|----------------|--------|
| 1ère année (Primary) | 4 | Lemvia-Nord | 🟡 To Index |
| 2ème année | 4 | Mbamushie | 🟡 To Index |
| [continues...] | | | |
| 6ème secondaire | 4 | Various | 🟡 To Index |
| **TOTAL** | **48+** | **7 chiefdoms** | |

### 📊 Structure d'un Exercice
```typescript
{
  id: "exercice-001",
  level: "1e-annee",
  problemStatement: "Dans le village de Lemvia-Nord, les pêcheurs ont...",
  expectedAnswer: "15 pirogues",
  localContext: "Lemvia-Nord",
  theoryLink: "addition-simple"
}
```

### 💾 Métadonnées Créées
```json
{
  "id": "1e-annee-exercice-001",
  "level": "1e-annee",
  "category": "mathematiques",
  "localContext": "Lemvia-Nord",
  "topic": "addition",
  "type": "exercise",
  "source": "kisakata-school",
  "indexed_at": "2026-04-11T14:30:00Z"
}
```

### 🔍 Exemples de Recherche (Attendus)
```bash
python pinecone_cli.py search "exercices mathématiques Lemvia" \
  --namespace iluo_exercices --top_k 5
→ Retourne 5 exercices situés à Lemvia-Nord

python pinecone_cli.py search "pirogues compter" \
  --namespace iluo_exercices
→ Exercices de comptage avec contexte "pirogues"

python pinecone_cli.py search "récolte chefferie" \
  --namespace iluo_exercices
→ Exercices localisés dans les chefferies agricoles
```

### ⚙️ Indexation
```bash
# Script à créer
python scripts/pinecone_index_exercises.py

# Ou manuellement
python pinecone_cli.py store "1e-annee-exercice-001" \
  "Dans le village de Lemvia-Nord, les pêcheurs ont 12 pirogues..." \
  --namespace iluo_exercices \
  --meta level=1e-annee localContext=Lemvia-Nord topic=addition
```

---

## 4️⃣ `iluo_chefferies` — Territory Descriptions

### 📍 Contenu à Créer
**7 chefferies du territoire Sakata**

| Chefferie | Population | Rivers | Products | Status |
|-----------|-----------|--------|----------|--------|
| Mabie | — | Lukenie, Kasai | Fishing, farming | ⚠️ To Create |
| Mbamushie | — | Mfimi | Agriculture | ⚠️ To Create |
| Mbantin | — | Various | Mixed | ⚠️ To Create |
| Lemvia-Nord | — | Lukenie | Fishing | ⚠️ To Create |
| Batere | — | — | Pottery | ⚠️ To Create |
| Lemvia-Sud | — | Lukenie | Fishing, farming | ⚠️ To Create |
| Nduele | — | — | Textiles | ⚠️ To Create |

### 📊 Structure Proposée
```typescript
{
  slug: "chefferie-lemvia-nord",
  name: "Lemvia-Nord",
  skt_name: "Lemvia-Nord",
  
  // Métadonnées géographiques
  territory_km2: 2500,
  population: 45000,
  rivers: ["Lukenie", "Mfimi"],
  
  // Métadonnées culturelles
  chief_name: "[À rechercher]",
  chief_title: "Mfumu",
  primary_language: "kisakata",
  
  // Données économiques
  products: ["fishing", "agriculture", "pottery"],
  main_activity: "fishing",
  
  // Contenu détaillé
  summary: { fr: "Lemvia-Nord est réputée pour..." },
  content: { fr: "Lemvia-Nord, le 'lieu des sages'... [2000+ mots]" }
}
```

### 💾 Métadonnées Créées
```json
{
  "slug": "chefferie-lemvia-nord",
  "name": "Lemvia-Nord",
  "territory_km2": 2500,
  "population": 45000,
  "rivers": ["Lukenie", "Mfimi"],
  "type": "chiefdom",
  "source": "kisakata-geography",
  "indexed_at": "2026-04-11T14:30:00Z"
}
```

### 🔍 Exemples de Recherche (Futurs)
```bash
python pinecone_cli.py search "Lemvia-Nord pêche" \
  --namespace iluo_chefferies
→ Score 0.88 : Description complète de Lemvia-Nord

python pinecone_cli.py search "Mbamushie agriculture" \
  --namespace iluo_chefferies
→ Informations géographiques et culturelles

python pinecone_cli.py search "chiefdom Mai-Ndombe" \
  --namespace iluo_chefferies --top_k 7
→ Les 7 chefferies et leurs caractéristiques
```

---

## 🔀 Hybrid Search Strategy

### Quand Chercher Où ?

```
Requête utilisateur            → Namespaces à chercher
─────────────────────────────────────────────────────
"Iluo spirituel"             → livres_academiques + livres_site
                                (academic depth + site narrative)

"Exercice mathématiques"     → exercices
                                (direct exercise match)

"Lemvia chefferie"           → chefferies + exercices
                                (geography + local context)

"Épopée Sakata"              → livres_site + livres_academiques
                                (site priority, then academic context)
```

### Multi-Namespace Search Pattern

```bash
# Recherche dans les livres (académique + site)
python pinecone_cli.py search "Iluo" --top_k 3 --namespace iluo_livres_academiques
python pinecone_cli.py search "Iluo" --top_k 3 --namespace iluo_livres_site

# Combiner les résultats (score élevé prioritaire)
# Afficher académique + site narrative
```

---

## 📊 Current Statistics

```
Index: sakata
Dimension: 768 (intfloat/multilingual-e5-base)
Model: sentence-transformers/intfloat-multilingual-e5-base

Namespace Status:
─────────────────────────────────────────
iluo_livres_academiques     1534 vectors    ✅ ACTIVE
iluo_livres_site               9 vectors    ✅ ACTIVE (Phase 1 Complete!)
iluo_exercices                 0 vectors    🟡 PENDING (Phase 2)
iluo_chefferies                0 vectors    ⚠️  NOT CREATED (Phase 3)

TOTAL: 1543 vectors (9 new site articles indexed)
```

---

## 🚀 Implementation Roadmap

### Phase 1 : Site Articles ✅ COMPLETE
```bash
✅ COMPLETED: python scripts/pinecone_index_articles_v2.py
   └─ Indexed 9 articles from src/data/articles.ts
   └─ Namespace: iluo_livres_site
   └─ Result: 9 vectors added
   └─ 3 articles skipped (< 100 words minimum)
   └─ Search tested: "Iluo double spirituel" returns iluo-regard-du-pouvoir (0.8316 score)
```

### Phase 2 : School Exercises (Next)
```bash
🟡 Create: python scripts/pinecone_index_exercises.py
   └─ Indexes 48+ exercises from curriculum
   └─ Namespace: iluo_exercices
   └─ Expected: 48 vectors added
```

### Phase 3 : Territory Descriptions (After)
```bash
⚠️ Create: Chefferie content (7 articles × 2000 words)
   └─ Add to: src/data/chefferies.ts (new file)
   └─ Index into: iluo_chefferies
   └─ Expected: 7 vectors added
```

### Phase 4 : Integration (Final)
```bash
📊 Create: API endpoint /api/search/semantic
   └─ Multi-namespace search
   └─ Rank and merge results
   └─ Return with context

🎨 Create: Search UI component
   └─ /savoir search bar
   └─ /ecole exercise finder
   └─ /geographie territory explorer
```

---

## 🔧 Quick Commands

```bash
# See current state
python pinecone_cli.py stats

# Index site articles
python scripts/pinecone_index_articles.py

# Search test
python pinecone_cli.py search "Iluo" --top_k 5

# List by namespace
python pinecone_cli.py list --namespace iluo_livres_site --limit 20

# Dry run (preview)
python scripts/pinecone_index_articles.py --dry-run
```

---

## 📚 Documentation Files

- **ARTICLE_vs_BOOK.md** — Distinction explanation with examples
- **PINECONE_INTEGRATION_GUIDE.md** — TypeScript/Node.js integration
- **EXAMPLES_ARTICLE_vs_BOOK.md** — Real examples from Kisakata
- **PINECONE_MEMORY_SKILL.md** — CLI skill for Claude Code
- **This file** — Namespace architecture & roadmap

---

*Architecture designed : 2026-04-11*
*Status : In implementation*
*Next : Phase 1 (Site articles indexing)*
