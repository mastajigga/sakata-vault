# DISTINCTION ARTICLE vs LIVRE (BOOK)

## Vue d'ensemble

Dans Kisakata, chaque contenu de savoir fonctionne à deux niveaux :

### 1. ARTICLE (Métadonnées + Résumé)
**Qu'est-ce que c'est ?**
- La couche "découverte" et "navigation"
- Contient : `slug`, `title`, `category`, `summary`, `image`, `videoBackground`
- Résumé court : 100-200 mots par langue
- Structure légère, optimisée pour les listes

**Où est-ce utilisé ?**
```
/savoir                    → Listing de tous les articles
/savoir/[slug]             → Preview avant de lire
Recherche rapide           → Métadonnées pour filtres
SEO / Métadonnées          → Open Graph, preview
```

**Exemple : Iluo (Niveau Article)**
```
Titre : "Iluo : Le Regard du Pouvoir"
Résumé : "L'Iluo n'est pas un simple double, c'est l'essence du pouvoir 
          et de la vision sacrée qui guide le peuple Sakata."
```

---

### 2. LIVRE / BOOK (Contenu Profond)
**Qu'est-ce que c'est ?**
- La couche "immersion" et "compréhension profonde"
- C'est le champ `.content` du `ArticleData`
- Contenu complet : 2000-4000 mots par langue
- Style : poétique, narratif, richement contextualisé
- **SEUL CE CHAMP EST INDEXÉ DANS PINECONE**

**Où est-ce utilisé ?**
```
/savoir/[slug]             → Texte complet de la page
Pinecone (iluo_livres)     → Recherche sémantique profonde
Apprentissage détaillé     → Réponses enrichies
```

**Exemple : Iluo (Niveau Livre)**
```
"C'est le temps des enseignements secrets. On parle de l'Iluo 
(le double spirituel), de cette part de nous-même qui nous protège 
mais qui exige une droiture absolue.

On apprend que chaque parole est un acte, et que chaque acte 
laisse une trace indélébile sur notre Nzela (le chemin de vie). 
Les anciens racontent les exploits de Lukeni lua Nimi, nous 
rappelant que notre sang est noble et que notre responsabilité 
est grande.

[... 2500+ mots de cosmologie, rituels, initiation, poésie ...]"
```

---

## Distinction Visuelle

| Aspect | ARTICLE | LIVRE |
|--------|---------|-------|
| **Longueur** | 100-200 mots | 2000-4000 mots |
| **Champ** | `.summary` | `.content` |
| **Style** | Résumé factuel | Poétique, narratif |
| **Contexte** | Minimal | Riche, culturel |
| **Usage** | Navigation, listing | Lecture profonde |
| **Pinecone** | ❌ Ne pas indexer | ✅ INDEXER UNIQUEMENT |

---

## Règles de Pinecone

### ✅ À INDEXER
```typescript
// Indexer UNIQUEMENT le contenu complet (livre)
const bookContent = article.content.fr;  // ← C'est ça qu'on indexe
const bookLanguage = "fr";
const vector = embedding(bookContent);
pinecone.upsert({
  id: article.slug,
  values: vector,
  metadata: {
    title: article.title.fr,
    category: article.category,
    bookOnly: true  // ← Marqueur pour éviter confusion
  },
  namespace: "iluo_livres"
});
```

### ❌ À NE PAS INDEXER
```typescript
// Ne pas indexer le résumé court
const articleSummary = article.summary.fr;  // ← IGNORER
// Résumé = trop court, superficiel, pas assez contextualisé
```

---

## Cas d'Usage : Recherche Sémantique

**Requête utilisateur :** *"Explique-moi le concept d'Iluo"*

### ❌ Mauvaise approche (indexation du résumé)
```
Résultat retourné :
"L'Iluo n'est pas un simple double, c'est l'essence du pouvoir..."
→ Réponse superficielle, frustrant pour l'utilisateur
```

### ✅ Bonne approche (indexation du livre)
```
Résultat retourné :
"C'est le temps des enseignements secrets. On parle de l'Iluo 
(le double spirituel), de cette part de nous-même qui nous protège 
mais qui exige une droiture absolue.

On apprend que chaque parole est un acte, et que chaque acte 
laisse une trace indélébile sur notre Nzela..."

[Réponse riche, transformatrice, culturellement ancrée]
→ L'utilisateur obtient vraiment la profondeur du concept
```

---

## Structure TypeScript

```typescript
// ✅ Utilisation correcte
import { ArticleData, ArticleMetadata, BookContent } from "@/types/i18n";

// Pour un listing (articles)
function renderArticleCard(article: ArticleMetadata) {
  return <h3>{article.title.fr}</h3>
         <p>{article.summary.fr}</p>;  // ← Résumé court
}

// Pour une page complète (livre)
function renderBookPage(article: ArticleData) {
  const bookContent: BookContent = article.content;  // ← Contenu complet
  return <article>{bookContent.fr}</article>;
}

// Pour Pinecone (livre uniquement)
async function indexToVectorDB(article: ArticleData) {
  const bookToIndex: BookContent = article.content;  // ← CECI uniquement
  const embedding = await embedModel.embed(bookToIndex.fr);
  await pinecone.upsert({
    id: article.slug,
    values: embedding,
    namespace: "iluo_livres"
  });
}
```

---

## Checklist pour Nouveau Contenu

- [ ] **Summary (Article)** : 100-200 mots, résumé factuel
- [ ] **Content (Livre)** : 2000-4000 mots, poétique et contextualisé
- [ ] **Catégorie** : langue / culture / spiritualité / histoire
- [ ] **Langues** : Minimum français (fr), idéalement +3 langues
- [ ] **Image** : Présent pour affichage sur cards
- [ ] **VideoBackground** : Optionnel, pour hero section

---

## Prochaines Étapes : Pinecone Integration

```bash
# Namespace Pinecone recommandé
iluo_livres    → Articles complets indexés (2000+ mots)
iluo_exercices → Exercices avec contextes Sakata
iluo_chefferies → (À créer) Descriptions de chefferies
```

**NE PAS créer :** `iluo_articles` (résumés courts)

---

*Dernière mise à jour : 2026-04-11*
*Auteur : Documentation Kisakata*
