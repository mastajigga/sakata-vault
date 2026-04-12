# Pinecone Memory System Skill

**Un système mémoire vectoriel pour Kisakata — Recherche sémantique, indexation, gestion des namespaces.**

---

## 🎯 Objectif

Permettre à Claude Code de :
- **Chercher** des concepts profonds dans la base vectorielle Pinecone
- **Stocker** de nouveaux vecteurs (articles, exercices, chefferies)
- **Indexer** automatiquement tous les contenus du site
- **Gérer** les namespaces et métadonnées
- **Monitorer** la santé du système

---

## 🚀 Installation

### 1. Vérifier les dépendances
```bash
npm install @pinecone-database/pinecone sentence-transformers
```

### 2. Variables d'environnement
```bash
# .env.local
PINECONE_API_KEY=pcsk_7Y6nQP_98RdPcDMvzHsLxSYMnDpiDvvgYyRjVxmfNYPztjM45ujRx9ZFA23KYp8rtgLPUC
PINECONE_INDEX=sakata
PINECONE_NAMESPACES=iluo_livres,iluo_exercices,iluo_chefferies
```

### 3. Rendre le script exécutable
```bash
chmod +x scripts/pinecone-memory.ts
```

---

## 📖 Guide d'Utilisation

### Utilisation via npm scripts

```bash
# Voir la liste complète des commandes
npm run pinecone

# Chercher un concept
npm run pinecone:search "double spirituel Sakata"

# Afficher les statistiques
npm run pinecone:stats

# Indexer tous les articles
npm run pinecone:index-articles

# Indexer tous les exercices
npm run pinecone:index-exercises

# Lister les vecteurs
npm run pinecone:list
```

### Utilisation directe

```bash
# Chercher
npx ts-node scripts/pinecone-memory.ts search "épopée Sakata" --top_k 5

# Mémoriser
npx ts-node scripts/pinecone-memory.ts remember "article-001" "Texte complet..." --namespace iluo_livres

# Récupérer
npx ts-node scripts/pinecone-memory.ts fetch "article-001"

# Supprimer
npx ts-node scripts/pinecone-memory.ts delete "article-001" --confirm

# Lister
npx ts-node scripts/pinecone-memory.ts list --namespace iluo_livres --limit 50

# Statistiques
npx ts-node scripts/pinecone-memory.ts stats

# Indexer articles
npx ts-node scripts/pinecone-memory.ts index-articles --force

# Indexer exercices
npx ts-node scripts/pinecone-memory.ts index-exercises

# Vider un namespace
npx ts-node scripts/pinecone-memory.ts clear-namespace iluo_livres --confirm
```

---

## 🔧 Architectures des Namespaces

### `iluo_livres` (Livres - Articles Complets)
```
Contenu: .content field (2000+ mots)
Catégories: spiritualite, histoire, culture, langue
Cas d'usage: Recherche sémantique profonde
Exemple: "double spirituel Sakata" → retourne 2500 mots complets
```

### `iluo_exercices` (Exercices - Contextes Locaux)
```
Contenu: Énoncés et contextes d'exercices mathématiques
Métadonnées: level (1e-annee...6e-secondaire), localContext (chefferies)
Cas d'usage: Recherche d'exercices par concept ou localité
Exemple: "exercices Lemvia" → retourne exercices situés à Lemvia
```

### `iluo_chefferies` (À Créer - Descriptions Territoires)
```
Contenu: Descriptions détaillées des 7 chefferies
Métadonnées: name, population, rivers, products, chief
Cas d'usage: Recherche géographique et culturelle
Exemple: "Mbamushie" → retourne infos complètes sur la chefferie
```

---

## 💾 Workflow d'Indexation

### Étape 1 : Indexer les Articles

```bash
npm run pinecone:index-articles
```

**Traitement :**
- Lit tous les articles depuis `src/data/articles.ts`
- Indexe UNIQUEMENT le `.content` (pas le `.summary`)
- Crée des vecteurs 768-dimensions
- Ajoute métadonnées : title, category, wordCount, slug

**Résultat :**
```
✓ epopee-peuple-sakata (3500 words)
✓ iluo-regard-du-pouvoir (2547 words)
✓ ... [12 articles total]
✅ Indexed 12 articles
```

### Étape 2 : Indexer les Exercices

```bash
npm run pinecone:index-exercises
```

**Traitement :**
- Lit tous les exercices depuis `src/app/ecole/data/mathematics-curriculum.ts`
- Indexe : énoncé + contexte local + localité
- Ajoute métadonnées : level, category, localContext

**Résultat :**
```
✓ 1e-annee-exercice-001 (pirogue Lemvia)
✓ 2e-annee-exercice-005 (récolte Mbamushie)
✓ ... [48+ exercices total]
✅ Indexed 48+ exercises
```

---

## 🔍 Cas d'Usage : Recherche

### Requête 1 : Concept Spirituel
```bash
npm run pinecone:search "Iluo double spirituel"

# Résultat :
# Score 0.891: iluo-regard-du-pouvoir
#   → 2500 mots complets sur Iluo, initiation, pouvoir
```

### Requête 2 : Épopée Historique
```bash
npm run pinecone:search "épopée Grassfields Kongo"

# Résultat :
# Score 0.876: epopee-peuple-sakata
#   → 3500 mots sur la grande traversée, Ubangi, Mai-Ndombe
```

### Requête 3 : Exercices Localisés
```bash
npm run pinecone:search "exercices mathématiques Lemvia" --namespace iluo_exercices

# Résultat :
# Score 0.823: 1e-annee-exercice-012
#   → "Compter les pirogues de Lemvia-Nord"
```

---

## 📊 Monitoring

### Vérifier l'État Complet
```bash
npm run pinecone:stats

# Résultat :
# Index: sakata
# Total vectors: 67
# Dimension: 768
# 
# Namespaces:
#   iluo_livres: 12 vectors (articles)
#   iluo_exercices: 48 vectors (exercices)
#   iluo_chefferies: 7 vectors (chefferies - TBD)
```

### Lister par Namespace
```bash
npm run pinecone:list --namespace iluo_livres --limit 20

# Résultat :
# ID                           | Title
# ────────────────────────────────────────────────────
# epopee-peuple-sakata         | L'épopée du peuple Sakata
# iluo-regard-du-pouvoir       | Iluo : Le Regard du Pouvoir
# ... [20 entrées]
```

---

## 🧪 Workflow de Développement

### Scénario 1 : Tester la Recherche
```bash
# 1. Indexer tout
npm run pinecone:index-articles
npm run pinecone:index-exercises

# 2. Vérifier stats
npm run pinecone:stats

# 3. Tester quelques requêtes
npm run pinecone:search "Iluo"
npm run pinecone:search "Lemvia exercices" --namespace iluo_exercices

# 4. Explorer le contenu
npm run pinecone:list --namespace iluo_livres
```

### Scénario 2 : Ajouter un Nouvel Article
```bash
# 1. Ajouter à src/data/articles.ts
# (crée article avec .summary + .content)

# 2. Indexer la nouvelle entrée
npx ts-node scripts/pinecone-memory.ts remember "nouvel-article-001" \
  "Contenu complet du nouvel article..." \
  --namespace iluo_livres \
  --meta title="Titre" category="spiritualite"

# 3. Vérifier
npm run pinecone:list --namespace iluo_livres | grep nouvel-article-001
npm run pinecone:search "concept du nouvel article"
```

### Scénario 3 : Nettoyer et Réindexer
```bash
# 1. Vider complètement un namespace
npx ts-node scripts/pinecone-memory.ts clear-namespace iluo_livres --confirm

# 2. Réindexer à partir de zéro
npm run pinecone:index-articles --force

# 3. Vérifier l'intégrité
npm run pinecone:stats
```

---

## ⚙️ Options Avancées

### Métadonnées Personnalisées
```bash
npx ts-node scripts/pinecone-memory.ts remember "article-001" "Texte..." \
  --namespace iluo_livres \
  --meta \
    title="Mon Article" \
    category="spiritualite" \
    author="Kisakata" \
    language="fr" \
    wordCount=2500
```

### Filtrer par Préfixe
```bash
# Lister uniquement les articles (préfixe iluo-)
npm run pinecone:list --prefix "iluo-" --namespace iluo_livres

# Lister uniquement les exercices 1ère année
npm run pinecone:list --prefix "1e-annee-" --namespace iluo_exercices
```

### Batch Operations
```bash
# Récupérer plusieurs vecteurs
npx ts-node scripts/pinecone-memory.ts fetch \
  "article-001" "article-002" "article-003" \
  --namespace iluo_livres

# Supprimer plusieurs vecteurs (nécessite --confirm)
npx ts-node scripts/pinecone-memory.ts delete \
  "old-001" "old-002" "old-003" \
  --namespace iluo_livres \
  --confirm
```

---

## 📝 Exemples Complets

### Indexation Complète du Projet
```bash
#!/bin/bash
# scripts/pinecone-init.sh

echo "🔮 Initializing Pinecone for Kisakata"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check stats
echo "1️⃣  Current state:"
npm run pinecone:stats

# 2. Clear existing (optional)
# npm run pinecone -- clear-namespace iluo_livres --confirm
# npm run pinecone -- clear-namespace iluo_exercices --confirm

# 3. Index everything
echo "2️⃣  Indexing articles..."
npm run pinecone:index-articles

echo "3️⃣  Indexing exercises..."
npm run pinecone:index-exercises

# 4. Verify
echo "4️⃣  Verifying..."
npm run pinecone:stats

echo "✅ Pinecone initialized and ready!"
```

### Recherche Interactive
```bash
#!/bin/bash
# scripts/pinecone-search.sh

if [ -z "$1" ]; then
  echo "Usage: ./scripts/pinecone-search.sh 'your query'"
  exit 1
fi

echo "🔍 Searching for: '$1'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Search in all namespaces
echo "📚 In LIVRES:"
npm run pinecone:search "$1" --namespace iluo_livres --top_k 3

echo ""
echo "✏️  In EXERCICES:"
npm run pinecone:search "$1" --namespace iluo_exercices --top_k 3
```

---

## 🐛 Troubleshooting

| Problème | Solution |
|----------|----------|
| `PINECONE_API_KEY not found` | Ajouter à `.env.local` |
| `Namespace not found` | Utiliser : iluo_livres, iluo_exercices, iluo_chefferies |
| `Vector not found` | Vérifier ID exact avec `pinecone:list` |
| `Deletion failed` | Ajouter `--confirm` flag |
| `Index too large` | Utiliser `--limit` avec `list` |

---

## 📚 Documentation

- **Full Skill Doc** : `.claude/skills/pinecone-memory.md`
- **Article vs Book** : `.claude/ARTICLE_vs_BOOK.md`
- **Integration Guide** : `.claude/PINECONE_INTEGRATION_GUIDE.md`
- **Examples** : `.claude/EXAMPLES_ARTICLE_vs_BOOK.md`

---

## 🎓 Prochaines Étapes

1. ✅ **Indexer les articles** → `npm run pinecone:index-articles`
2. ✅ **Indexer les exercices** → `npm run pinecone:index-exercises`
3. 🔄 **Créer iluo_chefferies** → Ajouter descriptions des 7 chefferies
4. 🔄 **Intégrer dans /savoir** → Component de recherche sémantique
5. 🔄 **Intégrer dans /ecole** → Exercices suggérés par requête
6. 🔄 **Analytics** → Suivre les requêtes populaires

---

*Skill créée : 2026-04-11*
*Pour : Kisakata Memory System*
*Prête pour production*
