# EXEMPLES CONCRETS : Article vs Livre

## Exemple 1 : ÉPOPÉE SAKATA

### 📄 NIVEAU ARTICLE (Summary)
```json
{
  "slug": "epopee-peuple-sakata",
  "title": {
    "fr": "L'épopée du peuple Sakata : Du Kongo au Mai-Ndombe"
  },
  "category": "histoire",
  "summary": {
    "fr": "Découvrez le voyage ancestral de nos pères, depuis les rives sacrées du Royaume du Kongo jusqu'aux forêts denses du Mai-Ndombe."
  },
  "image": "...",
  "videoBackground": "..."
}
```

**Affichage :**
- Listing `/savoir` → Carte avec titre + résumé court
- Métadonnées → SEO, Open Graph
- Navigation → Aide utilisateur à trouver le contenu

**Longueur :** 1 phrase courte (15 mots)

---

### 📖 NIVEAU LIVRE (Content)
```markdown
*"L'eau de la rivière peut changer de lit, mais elle n'oublie jamais 
la source dont elle est issue."*
— Proverbe de nos pères.

Assieds-toi, mon enfant. Regarde les brumes qui dansent sur la Lukenie 
au lever du jour. Elles nous racontent une histoire que le temps n'a pas 
pu effacer, une marche de géants commencée bien avant que les premières 
pirogues ne fendent nos eaux. Ce que nous appelons aujourd'hui l'Épopée 
Sakata est le souffle de milliers de lunes, le pas lourd de nos ancêtres 
qui ont traversé des forêts impénétrables pour nous offrir cette terre 
de paix.

## Le Berceau des Grassfields : Là où tout a commencé

Il y a plus de mille ans, nos ancêtres ne connaissaient pas encore le 
nom de "Sakata". Ils vivaient loin d'ici, dans les hauts plateaux 
verdoyants des Grassfields, à la frontière de ce que les hommes 
appellent aujourd'hui le Cameroun et le Nigeria...

[... 3500+ mots continuant la narrative ...]
```

**Affichage :**
- Page complète `/savoir/epopee-peuple-sakata` → Texte immersif
- Pinecone `iluo_livres` → Recherche sémantique
- Apprentissage → Compréhension profonde

**Longueur :** 3500+ mots

---

## Exemple 2 : ILUO (Double Spirituel)

### 📄 NIVEAU ARTICLE (Summary)
```
"L'Iluo n'est pas un simple double, c'est l'essence du pouvoir et de 
la vision sacrée qui guide le peuple Sakata."

[Longueur : ~20 mots]
```

**Quand utilisé ?**
```
GET /api/articles          → Liste 10 articles avec summaries
Card component             → Affiche title + summary
/savoir (listing)          → "Découvrez : Iluo : Le Regard du Pouvoir"
```

---

### 📖 NIVEAU LIVRE (Content)
```markdown
C'est le temps des enseignements secrets. On parle de l' *Iluo* 
(le double spirituel), de cette part de nous-même qui nous protège 
mais qui exige une droiture absolue. On apprend que chaque parole 
est un acte, et que chaque acte laisse une trace indélébile sur 
notre *Nzela* (le chemin de vie). 

Les anciens racontent les exploits de Lukeni lua Nimi, nous rappelant 
que notre sang est noble et que notre responsabilité est grande.

### Le voyage des trois lunes

La formation de l'Iluo commence lors de l'initiation de l'enfant, 
généralement entre 12 et 15 ans. Pendant trois lunes consécutives, 
l'enfant est isolé de la communauté pour apprendre le secret de son 
double spirituel.

Première lune : L'enfant apprend à se voir à travers les yeux de 
son Iluo. C'est une période d'auto-réflexion intense où il doit 
affronter ses peurs...

[... 2500+ mots de poésie, cosmologie, rituels ...]

### Intégration dans la vie adulte

Quand l'enfant émerge de la forêt après les trois lunes, il est 
transformé. Il porte désormais le poids et la grandeur de connaître 
son Iluo. Les anciens disent que c'est à partir de ce moment que 
la vraie vie commence...
```

**Quand utilisé ?**
```
GET /savoir/iluo-regard-du-pouvoir    → Page complète avec contenu
Pinecone (iluo_livres namespace)     → Recherche : "Iluo"
Recherche sémantique                 → Retourne le LIVRE complet
```

---

## Exemple 3 : CHEFFERIES

### 📄 NIVEAU ARTICLE (Si créé)
```
Title: "Lemvia-Nord : Terre des Sages"
Summary: "Lemvia-Nord est l'une des sept chefferies du peuple Sakata, 
         réputée pour sa sagesse politique et son riche patrimoine agricole."
```

### 📖 NIVEAU LIVRE (À créer)
```markdown
# Lemvia-Nord : La Chefferie de la Sagesse Ancienne

## Géographie et Territoire

Lemvia-Nord s'étend sur environ 2500 km² le long de la rivière Lukenie, 
dans la région nord du territoire Sakata. Son nom signifie "là où les 
eaux deviennent sages" en kisakata...

## Histoire des Chefs

La lignée des chefs de Lemvia-Nord remonte à plus de six siècles. 
Le fondateur, Nkambi Lukeni, était réputé pour sa capacité à résoudre 
les conflits entre clans...

## Économie et Ressources

Les habitants de Lemvia-Nord sont réputés pour :
- La pêche traditionnelle (80% de l'économie)
- L'agriculture (manioc, bananes plantains)
- L'artisanat de poterie et tissage

## Relations Interchefferies

Lemvia-Nord maintient des relations diplomatiques fortes avec 
Mbamushie et Batere, formant ainsi le "Triumvirat du Nord"...

[... Contenu détaillé ...]
```

---

## Cas d'Utilisation : Recherche

### Requête 1 : Listing (Article level)
```
GET /api/articles?category=spiritualite
→ Retourne : [
    { slug: "iluo-...", title: "Iluo : Le Regard du Pouvoir", summary: "L'Iluo..." },
    { slug: "nzela-...", title: "Nzela : Le Chemin de Vie", summary: "Nzela..." }
  ]
  
Affichage : Cartes avec résumés courts
```

### Requête 2 : Page Complète (Book level)
```
GET /savoir/iluo-regard-du-pouvoir
→ Retourne : {
    slug: "iluo-...",
    title: "Iluo : Le Regard du Pouvoir",
    summary: "L'Iluo n'est pas...",
    content: "C'est le temps des enseignements secrets. On parle de l'Iluo..."
  }

Affichage : Page immersive avec 2500+ mots
```

### Requête 3 : Recherche Sémantique (Book level)
```
POST /api/search/books
Body: { query: "Comprendre le double spirituel Sakata" }

→ Pinecone query dans namespace "iluo_livres"
→ Retourne : [
    {
      id: "iluo-regard-du-pouvoir",
      score: 0.891,
      metadata: { title: "Iluo : Le Regard du Pouvoir", ... }
    }
  ]

Affichage : Résultats avec lien vers page complète
           + Contexte/extrait du livre
```

---

## Anti-Patterns à Éviter ❌

### ❌ MAUVAIS : Indexer le résumé dans Pinecone
```typescript
// NE PAS FAIRE CECI
const summary = article.summary.fr;  // ← Trop court
const embedding = model.encode(summary);
pinecone.upsert({
  id: article.slug,
  values: embedding,
  namespace: "iluo_articles"  // ← Mauvais namespace
});
// Résultat : Recherches superficielles, réponses incomplètes
```

### ❌ MAUVAIS : Afficher le contenu complet sur listing
```typescript
// NE PAS FAIRE CECI
articles.map(article => (
  <article>
    <h3>{article.title.fr}</h3>
    <p>{article.content.fr}</p>  // ← 2500 mots sur une carte !
  </article>
));
// Résultat : Page surchargée, lente, mauvaise UX
```

### ❌ MAUVAIS : Mélanger article et livre
```typescript
// NE PAS FAIRE CECI
interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string;
  // ... sans distinction claire
}
```

---

## Bonnes Pratiques ✅

### ✅ BON : Utiliser les types corrects
```typescript
// src/types/i18n.ts
export interface ArticleData {
  slug: string;
  title: TranslatedText;
  category: string;
  summary: TranslatedText;    // ← Article (court)
  content: TranslatedText;    // ← Livre (long)
}

export type ArticleMetadata = Omit<ArticleData, 'content'>;
export type BookContent = ArticleData['content'];
```

### ✅ BON : Listing utilise ArticleMetadata
```typescript
function ArticleCard({ article }: { article: ArticleMetadata }) {
  return (
    <div>
      <h3>{article.title.fr}</h3>
      <p>{article.summary.fr}</p>  // ← Résumé court seulement
    </div>
  );
}
```

### ✅ BON : Page complète utilise ArticleData
```typescript
function BookPage({ article }: { article: ArticleData }) {
  const bookContent: BookContent = article.content;  // ← Contenu complet
  return <div className="prose">{bookContent.fr}</div>;
}
```

### ✅ BON : Pinecone indexe uniquement le livre
```typescript
async function indexBook(article: ArticleData) {
  const bookToIndex = article.content.fr;  // ← CECI uniquement
  const embedding = await model.encode(bookToIndex);
  await pinecone.upsert({
    id: article.slug,
    values: embedding,
    namespace: "iluo_livres"  // ← Bon namespace
  });
}
```

---

## Résumé Visuel

```
                    ARTICLE DATA
                  (Même structure)
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
    ARTICLE        BOOK/LIVRE      METADATA
   (.summary)       (.content)      (slug, category)
   
    100 mots       2000+ mots        metadata
   
    ├─ Listing     ├─ Page /savoir  ├─ Filtres
    ├─ Cards       ├─ Recherche     ├─ Navigation
    ├─ Preview     │  Pinecone      └─ SEO
    └─ SEO         └─ Apprentissage
```

---

*Tous les exemples utilisent des données réelles du projet Kisakata.*
*Mise à jour : 2026-04-11*
