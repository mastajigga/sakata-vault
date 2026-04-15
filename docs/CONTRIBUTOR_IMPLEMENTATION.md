# Implémentation - Espace Contributeur (2026-04-15)

## 🎯 Objectif global

Créer un **espace contributeur intégré** qui :
1. Facilite la découverte et l'accès à l'éditeur d'articles pour les contributeurs approuvés
2. Centralise la gestion des demandes de contribution (admin/manager)
3. Optimise le SEO du parcours contributeur avec contenu structuré et guide
4. Améliore la transparence avec un dashboard et des statistiques

---

## 📋 Architecture

### Routes à ajouter

```typescript
// src/lib/constants/routes.ts
export const ROUTES = {
  // Existantes
  HOME: "/",
  SAVOIR: "/savoir",
  ECOLE: "/ecole",
  GEOGRAPHIE: "/geographie",
  FORUM: "/forum",
  MEMBRES: "/membres",
  CHAT: "/chat",
  PREMIUM: "/premium",
  PROFIL: "/profil",
  AUTH: "/auth",
  ADMIN: "/admin",
  
  // NOUVELLES — Espace contributeur
  CONTRIBUTEUR: "/contributeur",           // Dashboard contributeur
  CONTRIBUTEUR_GUIDE: "/contributeur/guide", // Guide + FAQ (SEO)
  ARTICLE_NEW: "/admin/article/new",       // Éditeur (exposé pour contributeurs)
  CONTRIBUTION_REQUESTS: "/admin/contribution-requests", // Admin: gestion demandes
};
```

### Hiérarchie des pages

```
/contributeur
├── Dashboard principal
│   ├── Statut contributeur (pending/approved/rejected)
│   ├── Boutons d'action (Écrire article / Demander accès)
│   ├── Articles rédigés + statistiques
│   └── Lien vers guide
│
└── /guide (SEO optimisée)
    ├── Pourquoi contribuer ?
    ├── Guide étape par étape
    ├── FAQ contributeur (schéma JSON-LD)
    └── Critères d'approbation
```

---

## 🛠️ Composants à créer

### 1. **ContributorDropdown** (Navbar)
- **Chemin**: `src/components/navbar/ContributorDropdown.tsx`
- **Props**: `role`, `isApproved`, `articleCount`
- **Rendu conditionnel**:
  - `role === "user"` → bouton "Devenir contributeur" → modal demande
  - `role === "contributor"` (approved) → dropdown "Espace contributeur"
    - Lien "Écrire un article" → `/admin/article/new`
    - Lien "Mon tableau de bord" → `/contributeur`
  - `role === "admin" || "manager"` → dropdown "Contributions"
    - Lien "Demandes de contribution" → `/admin/contribution-requests`
    - Lien "Contributeurs" → `/admin/users` (filtré contributors)

### 2. **Page `/contributeur`** (Dashboard)
- **Chemin**: `src/app/contributeur/page.tsx`
- **Composants internes**:
  - `ContributorStatus` : badge + message (pending/approved/rejected/none)
  - `ContributorStats` : cartes (articles rédigés, vues totales, dernière contribution)
  - `DraftArticles` : liste articles en brouillon (si approuvé)
  - `PublishedArticles` : liste articles publiés
  - `CTA` : bouton "Écrire un article" ou "Devenir contributeur"

- **Données affichées**:
  ```
  Si role === "user":
    - "Vous n'êtes pas contributeur"
    - Bouton "Demander accès" (ouvre modal)
  
  Si contributor_status === "pending":
    - Badge "En attente d'approbation"
    - Message: "Votre demande est en cours d'examen..."
  
  Si contributor_status === "approved":
    - Badge "Contributeur approuvé"
    - Bouton "Écrire un article" → /admin/article/new
    - Statistiques (articles rédigés, vues)
    - Liste des articles en brouillon + publiés
  
  Si contributor_status === "rejected":
    - Badge "Demande rejetée"
    - Message + raison (si présente)
    - Bouton "Repostuler"
  ```

### 3. **Page `/contributeur/guide`** (SEO)
- **Chemin**: `src/app/contributeur/guide/page.tsx`
- **Contenu structuré**:
  - H1: "Guide Contributeur — Partagez la Sagesse Sakata"
  - H2 sections:
    1. Pourquoi contribuer ?
    2. Comment devenir contributeur ?
    3. Types de contributions acceptées
    4. Critères de qualité
    5. Processus de review
    6. Droits d'auteur & attribution
  
- **FAQ (schéma JSON-LD)**: Questions PAA
  - "Quels sujets puis-je couvrir ?"
  - "Combien de temps dure l'approbation ?"
  - "Puis-je éditer mon article après publication ?"
  - "Comment sont rémunérés les contributeurs ?"

- **SEO**:
  ```
  Meta title: "Guide Contributeur — Kisakata.com"
  Meta description: "Devenez contributeur à Kisakata. Guide complet, critères d'approbation et processus de publication."
  Breadcrumbs: Accueil > Contributeur > Guide
  ```

### 4. **ContributorBadge** (Composant réutilisable)
- **Chemin**: `src/components/badges/ContributorBadge.tsx`
- **Props**: `status` ("pending" | "approved" | "rejected" | "none")
- **Rendu**:
  ```
  approved  → 🟢 "Contributeur approuvé"    (vert)
  pending   → 🟡 "En attente d'approbation" (orange)
  rejected  → 🔴 "Demande rejetée"          (rouge)
  none      → ⚪ "Non contributeur"         (gris)
  ```
- **Utilisé dans**: Profil utilisateur, navbar, dashboard

### 5. **Statistiques Contributeur** (AuthProvider)
- **Ajouter au contexte Auth**:
  ```typescript
  contributorStats: {
    articleCount: number;
    publishedCount: number;
    draftCount: number;
    totalViews: number;
    lastContributionDate: string | null;
  }
  ```
- **Fetcher depuis**: table `articles` (WHERE author_id = user.id)

---

## 📝 Modifications à appliquer

### 1. Routes (`src/lib/constants/routes.ts`)
✅ Ajouter les 4 nouvelles routes

### 2. Navbar (`src/components/Navbar.tsx`)
- Importer `ContributorDropdown`
- Remplacer le lien "Premium" par un dropdown intelligent:
  ```tsx
  {role && ["admin", "manager", "contributor"].includes(role) && (
    <ContributorDropdown role={role} isApproved={contributorStatus === "approved"} />
  )}
  ```

### 3. AuthProvider (`src/components/AuthProvider.tsx`)
- Ajouter `contributorStats` au contexte
- Fetcher les stats dans `fetchProfile()`:
  ```typescript
  const stats = await supabase
    .from("articles")
    .select("id, status")
    .eq("author_id", userId);
  
  setContributorStats({
    articleCount: stats.data?.length || 0,
    publishedCount: stats.data?.filter(a => a.status === "published").length || 0,
    draftCount: stats.data?.filter(a => a.status === "draft").length || 0,
    totalViews: 0, // TODO: implementer quand analytics article sera prêt
    lastContributionDate: null,
  });
  ```

### 4. Profil utilisateur (`src/app/profil/page.tsx`)
- Afficher `ContributorBadge` à côté du statut de contribution
- Ajouter lien "Voir mon espace contributeur" si approuvé

### 5. Éditeur d'articles (`src/app/admin/article/new/page.tsx`)
- ✅ Ajouter: Liste des brouillons de l'utilisateur
- ✅ Ajouter: Statistiques (articles publiés, vues)
- ✅ Modifier: Afficher le statut de l'article (draft/published/review)
- ✅ Bouton "Retour à mon tableau de bord"

---

## 📊 Données requises

### Table `articles` — Colonnes existantes
```sql
id, title, content, author_id, status, requires_premium, 
created_at, updated_at, published_at, ...
```

### Table `contribution_requests` — Existante
```sql
id, user_id, request_type, status, rejection_reason, 
created_at, reviewed_at, reviewed_by, ...
```

### Profile table — Colonnes existantes
```sql
id, username, role, subscription_tier, contributor_status, ...
```

**Note**: Pas de migration SQL nécessaire — toutes les tables existent.

---

## 🔍 SEO Strategy

### Pages optimisées
1. **`/contributeur`** (dynamic, user-specific)
   - Meta noindex si non-authentifié
   - Contenu personnalisé par statut

2. **`/contributeur/guide`** (static, SEO priority)
   - Indexée, sitemap, canonical
   - Schéma JSON-LD (FAQPage + BreadcrumbList)
   - Contenu riche (1500+ mots)
   - CTA optimisée vers `/contributeur`

### Breadcrumbs (tous les contributeurs voir)
```
Accueil > Contributeur > [Guide | Dashboard]
```

### Conversion funnel
```
Visiteur anonyme
  ↓ Lire guide (/contributeur/guide)
  ↓ Cliquer "Devenir contributeur"
  ↓ Modal / Profil contributeur_status = pending
  ↓ Admin approuve
  ↓ Lien "Écrire article" visible → /admin/article/new
  ↓ Article publié → /savoir/[slug]
```

---

## ✅ Checklist d'implémentation

- [ ] Routes ajoutées
- [ ] NavbarContributorDropdown créé
- [ ] Page `/contributeur` créée (dashboard)
- [ ] Page `/contributeur/guide` créée (SEO)
- [ ] ContributorBadge créé
- [ ] AuthProvider — contributorStats ajoutées
- [ ] Navbar modifiée avec dropdown
- [ ] Profil utilisateur — badge ajouté
- [ ] Éditeur d'articles modifié (brouillons, stats)
- [ ] Build local — npm run build ✅
- [ ] Tests visuels (Navbar dropdown, pages, badges)
- [ ] Commit et push sur main
- [ ] Netlify deploy validé

---

## 📈 Metrics de succès

1. ✅ Contributeurs approuvés trouvent rapidement le lien "Écrire article"
2. ✅ Nouvel utilisateur voit le guide et comprend le processus
3. ✅ Admin voit les demandes depuis le menu
4. ✅ Pages `/contributeur` et `/contributeur/guide` indexées et rankées
5. ✅ Augmentation des demandes de contribution (via SEO + UX)
6. ✅ Temps réduit pour activer un contributeur (meilleure UX)

---

**Début**: 2026-04-15 | **Version**: 1.0 | **Status**: En cours
