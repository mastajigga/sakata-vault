# Guide d'Intégration Pinecone

## Vue d'ensemble

Pinecone est utilisé pour **la recherche sémantique profonde** du savoir Sakata.

**Principe fondamental :**
```
Utilisateur → Requête → Recherche sémantique → LIVRE complet retourné
                                   ↓
                          (pas le résumé, pas l'article)
                          (le contenu riche et contextualisé)
```

---

## Architecture des Namespaces

### 1. `iluo_livres` ← PRINCIPAL
**Contenu :** Articles complets et profonds
```typescript
{
  id: "epopee-peuple-sakata",
  values: [embedding vector de 768 dims],
  metadata: {
    title: "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe",
    category: "histoire",
    language: "fr",
    wordCount: 3500,
    bookOnly: true
  },
  namespace: "iluo_livres"
}
```

**Requêtes compatibles :**
- "Explique-moi l'épopée Sakata"
- "Qu'est-ce que le Kongo dans la tradition Sakata ?"
- "Raconte l'histoire du Mai-Ndombe"

### 2. `iluo_exercices`
**Contenu :** Exercices mathématiques avec contextes Sakata
```typescript
{
  id: "mathematiques-1e-annee-ex-01",
  values: [embedding vector],
  metadata: {
    title: "Exercice : Compter les pirogues de Lemvia",
    category: "mathematiques",
    level: "1e-annee",
    localContext: "Lemvia-Nord"
  },
  namespace: "iluo_exercices"
}
```

**Requêtes compatibles :**
- "Exercices sur la Lukenie"
- "Mathématiques des chefferies"

### 3. `iluo_chefferies` ← À CRÉER
**Contenu :** Descriptions détaillées de chaque chefferie (À venir)
```typescript
// Structure proposée
{
  id: "chefferie-lemvia-nord",
  values: [embedding vector],
  metadata: {
    name: "Lemvia-Nord",
    population: 45000,
    chief: "[Nom du chef]",
    territory_km2: 2500,
    rivers: ["Lukenie", "Mfimi"],
    products: ["fishing", "agriculture", "pottery"]
  },
  namespace: "iluo_chefferies"
}
```

---

## Implémentation : Indexation

### Étape 1 : Extraire le contenu du livre

```typescript
// src/lib/pinecone/indexing.ts

import { ArticleData } from "@/types/i18n";
import { Pinecone } from "@pinecone-database/pinecone";
import { SentenceTransformer } from "sentence_transformers"; // Python/Node wrapper

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const model = new SentenceTransformer("intfloat/multilingual-e5-base");

/**
 * Indexer un article complet (niveau LIVRE)
 * ❌ NE PAS indexer le .summary
 * ✅ INDEXER UNIQUEMENT le .content
 */
async function indexArticleAsBook(article: ArticleData): Promise<void> {
  const index = pc.Index("sakata");
  
  // ✅ Bonne approche : indexer le LIVRE complet
  const bookContent = article.content.fr;  // 2000+ mots
  const embedding = await model.encode(`passage: ${bookContent}`);
  
  // ❌ NEVER faire ceci :
  // const summary = article.summary.fr;  // ← Trop court, superficiel
  // const embedding = await model.encode(summary);
  
  await index.upsert(
    vectors: [{
      id: article.slug,
      values: embedding,
      metadata: {
        title: article.title.fr,
        category: article.category,
        language: "fr",
        type: "book",  // ← Marqueur pour distinguer article/livre
        wordCount: bookContent.split(" ").length,
      }
    }],
    namespace: "iluo_livres"  // ← Namespace pour livres uniquement
  );
  
  console.log(`✅ Indexé : ${article.slug} (${bookContent.length} chars)`);
}
```

### Étape 2 : Batch indexer tous les articles

```typescript
// src/scripts/pinecone-index-books.ts

import { ARTICLES } from "@/data/articles";
import { indexArticleAsBook } from "@/lib/pinecone/indexing";

async function indexAllBooks(): Promise<void> {
  console.log(`📚 Indexation de ${ARTICLES.length} livres...`);
  
  for (const article of ARTICLES) {
    try {
      await indexArticleAsBook(article);
    } catch (error) {
      console.error(`❌ Erreur indexation ${article.slug}:`, error);
    }
  }
  
  console.log("✅ Indexation complète");
}

// Exécution
// npm run pinecone:index-books
```

---

## Implémentation : Recherche

### Étape 1 : Requête utilisateur → Embedding

```typescript
// src/lib/pinecone/search.ts

import { Pinecone } from "@pinecone-database/pinecone";
import { SentenceTransformer } from "sentence_transformers";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const model = new SentenceTransformer("intfloat/multilingual-e5-base");

interface SearchResult {
  slug: string;
  title: string;
  excerpt: string;  // Première 500 chars du livre
  score: number;
}

/**
 * Recherche sémantique dans les livres Sakata
 */
async function searchBooks(query: string, topK: number = 5): Promise<SearchResult[]> {
  // 1. Convertir la requête en embedding
  const queryEmbedding = await model.encode(`query: ${query}`);
  
  // 2. Chercher dans Pinecone (namespace livres uniquement)
  const index = pc.Index("sakata");
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
    namespace: "iluo_livres"  // ← Recherche UNIQUEMENT dans les livres
  });
  
  // 3. Formater les résultats
  return results.matches.map(match => ({
    slug: match.id,
    title: match.metadata.title,
    excerpt: "...",  // À récupérer depuis articles.ts
    score: match.score
  }));
}
```

### Étape 2 : Component React

```typescript
// src/app/savoir/components/SemanticSearch.tsx

"use client";

import { useState } from "react";
import { searchBooks } from "@/lib/pinecone/search";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hits = await searchBooks(query);
      setResults(hits);
    } catch (error) {
      console.error("Erreur recherche:", error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cherche un concept spirituel, historique..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>
      
      {loading && <p>Recherche en cours...</p>}
      
      {results.map(result => (
        <article key={result.slug}>
          <a href={`/savoir/${result.slug}`}>
            <h3>{result.title}</h3>
          </a>
          <p>{result.excerpt}</p>
          <small>Score: {result.score.toFixed(3)}</small>
        </article>
      ))}
    </div>
  );
}
```

---

## Cas d'Usage : Recherche Iluo

### Requête utilisateur
```
"Je cherche à comprendre ce qu'est le double spirituel dans la culture Sakata"
```

### Processus
```
1. Embedding de la requête
   └─ Vector de 768 dimensions

2. Recherche Pinecone (namespace: iluo_livres)
   └─ Matching sémantique

3. Résultats retournés
   ├─ article.slug: "iluo-regard-du-pouvoir"
   ├─ score: 0.891 (très pertinent)
   └─ article.content.fr: [2500 mots complets sur Iluo]

4. Affichage utilisateur
   └─ Page /savoir/iluo-regard-du-pouvoir
      avec contenu COMPLET (livre)
      ← Pas juste le résumé d'article
```

---

## Checklist d'Intégration

- [ ] **Environment Variables**
  ```bash
  PINECONE_API_KEY=pcsk_...
  PINECONE_INDEX=sakata
  ```

- [ ] **Namespaces créés**
  - [ ] `iluo_livres` (articles complets)
  - [ ] `iluo_exercices` (exercices)
  - [ ] `iluo_chefferies` (À faire)

- [ ] **Indexation**
  - [ ] Script de batch indexing complet
  - [ ] Vérification : `pinecone_cli.py stats`
  - [ ] Vérification : 42+ vecteurs dans `iluo_livres`

- [ ] **Recherche**
  - [ ] Endpoint API: `POST /api/search/books`
  - [ ] Component React: `SemanticSearch`
  - [ ] Page intégrée dans `/savoir`

- [ ] **Tests**
  - [ ] Requête test : "Iluo"
  - [ ] Requête test : "épopée Sakata"
  - [ ] Requête test : "Lemvia chefferie"
  - [ ] Vérifier : résultats retournent LIVRES, pas articles

---

## Ressources

- **Pinecone Docs** : https://docs.pinecone.io/
- **SentenceTransformers** : https://www.sbert.net/
- **Local Script** : `scripts/pinecone_cli.py`
- **Types** : `src/types/i18n.ts` + `ArticleData` vs `BookContent`

---

*Documentation créée : 2026-04-11*
*Prêt pour implémentation*
