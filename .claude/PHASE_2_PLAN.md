# Phase 2 Plan: School Exercises Indexing

**Status:** 🟡 PLANNED (Ready to start)  
**Target:** Index 48+ mathematics exercises with local context  
**Namespace:** `iluo_exercices`  
**Effort:** ~45 minutes  

---

## 📋 Overview

Phase 2 will index all school exercises from the mathematics curriculum, preserving their local context (which Sakata cheffery they reference) and difficulty level (1ère année through 6ème secondaire).

This enables searches like:
- "exercices mathématiques Lemvia" → returns math exercises in Lemvia
- "géométrie Mbamushie" → returns geometry exercises in Mbamushie
- "addition 1e annee" → returns 1st year addition problems

---

## 🎯 Goal

```
Current state:
  iluo_livres_academiques   1534 vectors  ✅
  iluo_livres_site            9 vectors  ✅
  iluo_exercices              0 vectors  ⏳ (this phase)

Target after Phase 2:
  iluo_exercices             48+ vectors ✅
```

---

## 📂 Source File

**Location:** `src/app/ecole/data/mathematics-curriculum.ts`

**Structure:**
```typescript
interface Exercise {
  id: string;                 // "exercice-001"
  level: string;              // "1e-annee", "2e-annee", ..., "6e-secondaire"
  problemStatement: string;   // The actual problem (150+ words)
  expectedAnswer: string;     // "15 pirogues"
  localContext: string;       // "Lemvia-Nord", "Mbamushie", "Nduele", etc.
  theoryLink?: string;        // "addition-simple", "geometry-triangles", etc.
}
```

**Example Article (to Index):**
```
Dans le village de Lemvia-Nord, les pêcheurs ont dénombré leurs pirogues 
de travail. Le chef a demandé que l'on les classe par taille. Les petites 
pirogues pour la pêche côtière sont au nombre de 8, les pirogues moyennes 
pour la rivière sont 5, et les grandes pirogues pour l'expédition du Congo 
sont 2. Combien de pirogues ont les pêcheurs de Lemvia-Nord en tout?

Answer: 15 pirogues
Level: 1e-annee
Context: Lemvia-Nord (fishing)
```

---

## 🔧 Implementation Steps

### Step 1: Create Exercise Parser
Create `TypeScriptExerciseParser` class in new script:

```python
# scripts/pinecone_index_exercises.py
class TypeScriptExerciseParser:
    def extract_exercises(self) -> List[Dict]:
        # Parse from src/app/ecole/data/mathematics-curriculum.ts
        # Return list of exercise objects
        pass
```

### Step 2: Implement Indexer
Similar to v2 article indexer:

```python
class PineconeExerciseIndexer:
    def __init__(self, api_key, dry_run=False):
        # Load model once
        self.model = SentenceTransformer(...)
        self.index = Pinecone(...)
    
    def index_exercise(self, exercise, namespace):
        # Validate: content > 50 words (exercises can be shorter)
        # Extract: id, level, localContext, topic
        # Embed problem statement
        # Upsert to iluo_exercices namespace
```

### Step 3: Build Metadata
Extract from each exercise:

```json
{
  "id": "1e-annee-exercice-001",
  "level": "1e-annee",
  "category": "mathematiques",
  "localContext": "Lemvia-Nord",
  "topic": "addition",
  "type": "exercise",
  "source": "kisakata-school",
  "indexed_at": "2026-04-11T...",
  "text": "problem statement (first 1000 chars)...",
  "expectedAnswer": "15 pirogues"
}
```

### Step 4: Validate & Test
- Dry-run to preview: `python scripts/pinecone_index_exercises.py --dry-run`
- Search test: `python scripts/pinecone_cli.py --namespace iluo_exercices search "Lemvia addition"`
- Verify: `python scripts/pinecone_cli.py stats`

---

## 📊 Expected Results

### Coverage by Level
| Level | Expected Count | Status |
|-------|---------------|--------|
| 1ère année | 4 | 🟡 |
| 2ème année | 4 | 🟡 |
| 3ème année | 4 | 🟡 |
| 4ème année | 4 | 🟡 |
| 5ème année | 4 | 🟡 |
| 6ème année | 4 | 🟡 |
| 1ère secondaire | 4 | 🟡 |
| 2ème secondaire | 4 | 🟡 |
| 3ème secondaire | 4 | 🟡 |
| 4ème secondaire | 4 | 🟡 |
| 5ème secondaire | 4 | 🟡 |
| 6ème secondaire | 4 | 🟡 |
| **TOTAL** | **48+** | 🟡 |

### Coverage by Territory
| Chefferie | Expected Exercises | Status |
|-----------|-------------------|--------|
| Lemvia-Nord | ~7 | 🟡 |
| Lemvia-Sud | ~7 | 🟡 |
| Mbamushie | ~7 | 🟡 |
| Mabie | ~7 | 🟡 |
| Nduele | ~7 | 🟡 |
| Batere | ~4 | 🟡 |
| Mbantin | ~4 | 🟡 |
| **TOTAL** | **43+** | 🟡 |

---

## 🔍 Sample Search Queries

After indexing, these searches should work:

```bash
# Search by location
python pinecone_cli.py --namespace iluo_exercices search "Lemvia exercices" --top_k 5
→ Returns all exercises in Lemvia (both Nord and Sud)

# Search by topic
python pinecone_cli.py --namespace iluo_exercices search "géométrie" --top_k 10
→ Returns geometry exercises

# Search by level + location
python pinecone_cli.py --namespace iluo_exercices search "1e annee addition Mbamushie" --top_k 3
→ Returns 1st year addition problems in Mbamushie

# Search by context
python pinecone_cli.py --namespace iluo_exercices search "pirogues pêche" --top_k 5
→ Returns fishing-related math problems

# Search by product
python pinecone_cli.py --namespace iluo_exercices search "récolte agriculture" --top_k 5
→ Returns agricultural math problems
```

---

## 📝 Validation Rules

**Exercise Content Requirements:**
- Minimum 50 words (problems can be shorter than articles)
- Must have clear problem statement
- Must have expected answer
- Must have localContext (cheffery reference)

**Metadata Requirements:**
- id: Must be unique
- level: Must be valid (1e-annee to 6e-secondaire, or similar)
- category: Always "mathematiques"
- topic: Should be specified (addition, geometry, etc.)

---

## ⚡ Quick Commands

```bash
# Preview what will be indexed
PINECONE_API_KEY="..." python scripts/pinecone_index_exercises.py --dry-run

# Actually index exercises
PINECONE_API_KEY="..." python scripts/pinecone_index_exercises.py

# Check progress
python scripts/pinecone_cli.py stats

# Search exercises
python scripts/pinecone_cli.py --namespace iluo_exercices search "Lemvia" --top_k 5

# List exercises in namespace
python scripts/pinecone_cli.py --namespace iluo_exercices list --limit 50
```

---

## 🔄 Hybrid Search After Phase 2

Once exercises are indexed, combined searches become possible:

```bash
# Find resources about "addition"
# First: Search educational articles
python scripts/pinecone_cli.py --namespace iluo_livres_site search "addition" --top_k 3

# Second: Search exercises
python scripts/pinecone_cli.py --namespace iluo_exercices search "addition" --top_k 5

# Combined: Theory + Practice
# (In future: API endpoint /api/search/semantic will do this automatically)
```

---

## 📦 Dependencies

All dependencies should already be installed from Phase 1:
- pinecone-client
- sentence-transformers
- Python 3.8+

No additional packages needed.

---

## ✅ Completion Checklist

When Phase 2 is complete:

- [ ] Exercise parser implemented and tested
- [ ] Exercise indexer created (using v2 optimization)
- [ ] All 48+ exercises indexed successfully
- [ ] Search tests pass (Lemvia, topic, level combinations)
- [ ] Metadata correctly stored
- [ ] Dry-run and actual run completed
- [ ] Statistics show iluo_exercices with 48+ vectors
- [ ] Documentation updated
- [ ] Phase 2 completion report created

---

## 🎯 Success Criteria

✅ Phase 2 is complete when:
1. `iluo_exercices` namespace has 48+ vectors
2. Search for "Lemvia" returns Lemvia exercises
3. Search for "1e annee addition" returns appropriate exercises
4. Zero errors during indexing
5. Documentation updated

---

## 📅 Timeline

- **Duration:** ~45 minutes
- **Model loading:** ~10s (only once)
- **Embedding 48 exercises:** ~30s (batch mode)
- **Upserting:** ~5s
- **Testing & verification:** ~5 min

**Total: Ready for Phase 2 implementation**

---

*Plan created: 2026-04-11*  
*Next: Phase 2 implementation*
