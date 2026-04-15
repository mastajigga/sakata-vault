# Plan de Correctifs : Système Article + Abonnement Stripe

## 1. Problème 1 : Demandes de Contribution Désynchronisées

### Contexte
- Deux points d'entrée pour devenir "Documentaliste Culturel" :
  1. Hero page (`savoir/[slug]`) — bouton "Devenir Documentaliste Culturel"
  2. Profil utilisateur (`/profil`) — section "Devenir Documentaliste Culturel"
- Aucune page d'administration pour gérer ces demandes
- Aucune table `contribution_requests` ou similaire

### Solution
1. Créer table `contribution_requests` (Supabase) :
   - `id` (uuid, primary key)
   - `user_id` (uuid, FK→auth.users)
   - `request_type` ('article_writer' | 'contributor')
   - `status` ('pending' | 'approved' | 'rejected')
   - `created_at` (timestamp)
   - `reviewed_at` (timestamp, nullable)
   - `reviewed_by` (uuid, FK→auth.users, nullable)
   - `notes` (text, nullable)

2. Créer RLS policies :
   - Users can INSERT own requests
   - Admins can SELECT/UPDATE all requests
   - Users can SELECT own requests

3. Créer endpoint POST `/api/contribution-request` :
   - Récupère `user_id`, `request_type`, `message`
   - Insère dans `contribution_requests`
   - Retourne `{ success: true, message: "Demande envoyée" }`

4. Unifier les deux boutons :
   - Supprimer les formulaires sur `savoir/[slug]` et `/profil`
   - Utiliser un modal partagé : `ContributionRequestModal.tsx`
   - Modal lance POST `/api/contribution-request`

5. Créer page admin `/admin/contribution-requests` :
   - Liste des demandes avec filtres (status, type, date)
   - Card pour chaque demande : prévisualisation utilisateur + boutons Approuver/Rejeter
   - Champ notes pour justification

---

## 2. Problème 2 : Éditeur d'Article Manquant

### Contexte
- Aucune page pour créer/éditer un article
- Articles gérés uniquement via la console Supabase

### Solution
Créer `/admin/article/new` et `/admin/article/[id]/edit` :

#### Structure de l'article (table `articles`) :
- `id` (uuid, primary key)
- `title` (varchar, main article title)
- `slug` (varchar, unique)
- `author_id` (uuid, FK→profiles)
- `content` (jsonb) — structure :
  ```json
  {
    "sections": [
      {
        "id": "uuid",
        "type": "paragraph",
        "heading": "Titre optionnel du paragraphe",
        "text": "Contenu du paragraphe",
        "images": [
          {
            "id": "uuid",
            "url": "bucket/path",
            "caption": "Légende"
          }
        ]
      }
    ],
    "sources": [
      {
        "id": "uuid",
        "title": "Titre de la source",
        "url": "https://example.com",
        "author": "Auteur",
        "date": "2024-01-15"
      }
    ]
  }
  ```
- `featured_image_url` (varchar, nullable)
- `status` ('draft' | 'submitted_for_review' | 'published' | 'rejected')
- `requires_premium` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `published_at` (timestamp, nullable)
- `auto_approved_users` (uuid[], list of user IDs with auto-approval)

#### Page `/admin/article/new` :
1. **Section titre** :
   - Input : "Titre de l'article"
   - Input : "Slug" (auto-généré mais éditable)

2. **Éditeur de contenu** (Markdown ou rich text) :
   - Bouton "+ Ajouter paragraphe"
   - Pour chaque section :
     - Input optionnel : "Titre du paragraphe"
     - Textarea : "Contenu du paragraphe"
     - Bouton "+ Ajouter image"
     - Upload image → stock dans Supabase Storage
     - Input : "Légende de l'image"
     - Bouton "Supprimer cette section"

3. **Gestionnaire de sources** :
   - Tableau : titre, URL, auteur, date
   - Bouton "+ Ajouter source"
   - Modal pour ajouter/éditer source
   - Bouton "Supprimer" par source

4. **Configurateur premium** :
   - Toggle : "Cet article est réservé aux abonnés Premium"

5. **Actions** :
   - Bouton "Enregistrer en brouillon" → `status: 'draft'`
   - Bouton "Soumettre pour validation" → `status: 'submitted_for_review'` + notification admin

#### Page `/admin/article/[id]/edit` :
- Même interface que `/new`
- Pré-remplissage depuis la DB
- Historique des versions (bonus : git-like changelog)

---

## 3. Problème 3 : Page de Prévisualisation + Validation Admin

### Contexte
- Admin doit valider les articles avant publication
- Pas de preview avant publication

### Solution
Créer `/admin/article/[id]/review` :

1. **Aperçu de l'article** :
   - Rendu exact du `savoir/[slug]` (composant partagé)
   - Affichage des sections, images, sources

2. **Panel latéral** :
   - Infos : auteur, date création, statut actuel
   - Boutons d'action :
     - **Approuver** → `status: 'published'`, `published_at: now()`
     - **Rejeter** → `status: 'rejected'`
     - **Demander modifications** → modal avec message
   - Champ notes (privées)

3. **Auto-approval pour contributeurs de confiance** :
   - Checkbox : "Approuver automatiquement les futurs articles de [auteur]"
   - Ajoute `user_id` au champ `auto_approved_users` de la table `articles`
   - Hook : avant d'insérer un article, si `author_id` ∈ `auto_approved_users`, set `status: 'published'` automatiquement

---

## 4. Problème 4 : Stripe Subscription Dupliquer (Double Achat)

### Contexte
- Utilisateur complète le checkout Stripe
- Paiement réussi → redirect vers site
- Rien n'empêche de refaire le checkout → double charge

### Solution

#### 4.1 Créer table `subscription_sessions` :
- `id` (uuid, primary key)
- `user_id` (uuid, FK→auth.users)
- `stripe_session_id` (varchar, unique)
- `stripe_subscription_id` (varchar, nullable)
- `status` ('pending' | 'active' | 'failed')
- `created_at` (timestamp)
- `completed_at` (timestamp, nullable)
- `amount` (integer, cents)
- `currency` (varchar, default 'EUR')

#### 4.2 Modifier la logique de checkout :
1. **À la création du lien de paiement** :
   - Créer une entrée `subscription_sessions` avec `status: 'pending'`
   - Stocker `stripe_session_id` en local (`sessionStorage`)

2. **Au webhook Stripe `checkout.session.completed`** :
   - Récupérer `session.customer_email`
   - Trouver user correspondant
   - Créer `chat_subscription` :
     - `user_id`
     - `stripe_customer_id` (depuis Stripe)
     - `stripe_subscription_id`
     - `tier` = 'premium'
     - `status` = 'active'
     - `current_period_start` = maintenant
     - `current_period_end` = maintenant + 1 mois
   - Mettre à jour `subscription_sessions.status: 'active'`
   - Mettre à jour user role → 'premium' dans `profiles`

3. **Guard au bouton "Passer à Premium"** :
   - Avant de lancer le checkout, vérifier :
     - SELECT * FROM `chat_subscription` WHERE user_id = $1 AND status = 'active'
     - Si existe → afficher "Vous êtes déjà Premium"
     - Sinon → lancer checkout

4. **Guard au succès du checkout** :
   - Page `/premium/success?session_id=...`
   - Vérifier que `subscription_sessions.status = 'active'` pour ce `session_id`
   - Si oui → afficher "Bienvenue Premium ✅"
   - Si non → afficher "Erreur, veuillez contacter support"

#### 4.3 Créer table `chat_subscription` :
- `id` (uuid, primary key)
- `user_id` (uuid, FK→auth.users, unique)
- `stripe_customer_id` (varchar)
- `stripe_subscription_id` (varchar, nullable)
- `tier` ('free' | 'premium')
- `status` ('active' | 'cancelled' | 'past_due')
- `current_period_start` (timestamp)
- `current_period_end` (timestamp)
- `cancel_at_period_end` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### 4.4 Webhooks à gérer :
- `checkout.session.completed` → créer subscription
- `customer.subscription.updated` → mettre à jour `current_period_end`
- `customer.subscription.deleted` → set `status: 'cancelled'`

---

## 5. Fichiers à Créer/Modifier

### Nouvelles tables (Supabase migrations)
```
migrations/
  20260415_contribution_requests.sql
  20260415_articles_table.sql
  20260415_subscription_sessions.sql
  20260415_chat_subscription.sql
```

### Nouveaux composants/pages
```
src/
  app/
    admin/
      article/
        new/page.tsx              ← Éditeur article
        [id]/
          edit/page.tsx           ← Éditeur article (edit)
          review/page.tsx         ← Review + Validation
      contribution-requests/
        page.tsx                  ← Gestion demandes
  components/
    ContributionRequestModal.tsx  ← Modal partagé
    ArticleEditor.tsx             ← Éditeur réutilisable
    ArticlePreview.tsx            ← Preview rendu
  hooks/
    useArticleEditor.ts           ← Logique édition article
    useContributionRequests.ts    ← Logique demandes
```

### APIs à créer
```
src/app/api/
  contribution-request/
    route.ts                      ← POST nouveau demande
  article/
    route.ts                      ← GET/POST/PATCH articles
    [id]/route.ts                 ← GET/PATCH article spécifique
    [id]/publish/route.ts         ← POST publier
  stripe/
    webhook/route.ts              ← Webhook Stripe (modifier existant)
    session/route.ts              ← GET status session (nouveau)
```

### Modifications existantes
```
src/
  components/
    Navbar.tsx                    ← Ajouter lien /admin/contribution-requests
    profil/ProfileHub.tsx         ← Remplacer par ContributionRequestModal
  app/
    savoir/[slug]/page.tsx        ← Remplacer par ContributionRequestModal
  lib/
    supabase/admin.ts             ← RLS policies helpers
```

---

## 6. Ordre d'Implémentation

### Phase 1 : Contribution Requests (Jour 1)
- [ ] Créer migration `contribution_requests`
- [ ] Créer `ContributionRequestModal.tsx`
- [ ] Créer endpoint POST `/api/contribution-request`
- [ ] Créer page `/admin/contribution-requests`
- [ ] Modifier `savoir/[slug]` et `/profil` pour utiliser modal

### Phase 2 : Article Editor (Jour 2-3)
- [ ] Créer migration `articles`
- [ ] Créer `ArticleEditor.tsx` component
- [ ] Créer pages `/admin/article/new` et `/admin/article/[id]/edit`
- [ ] Créer endpoint `/api/article`
- [ ] Tester upload images

### Phase 3 : Article Review (Jour 3)
- [ ] Créer `ArticlePreview.tsx` component
- [ ] Créer page `/admin/article/[id]/review`
- [ ] Implémenter logique auto-approval
- [ ] Tests complets de workflow

### Phase 4 : Stripe Double-Achat (Jour 4)
- [ ] Créer migrations `subscription_sessions` + `chat_subscription`
- [ ] Modifier webhook Stripe
- [ ] Ajouter guards checkout + success
- [ ] Tests complets du flow abonnement

### Phase 5 : Testing + Deploy (Jour 4)
- [ ] Tests build (TypeScript)
- [ ] Tests manuels complets
- [ ] Commit + Push + PR

---

## 7. Estimations

| Phase | Durée | Criticité |
|-------|-------|-----------|
| Contribution Requests | 2h | 🟠 Moyen |
| Article Editor | 3h | 🔴 Haut |
| Article Review | 1.5h | 🟠 Moyen |
| Stripe Fix | 2h | 🔴 Haut |
| Testing + Deploy | 1.5h | 🔴 Critique |
| **TOTAL** | **~10h** | |

---

## 8. Checklist de Validation

- [ ] Contribute modal unifié + demandes synchro
- [ ] Admin voit toutes demandes + peut approuver/rejeter
- [ ] Éditeur article complet (titre, paragraphes, images, sources)
- [ ] Admin peut preview + publier / rejeter
- [ ] Auto-approval pour contributeurs de confiance
- [ ] User ne peut pas double-acheter (guard checkout)
- [ ] Webhook Stripe crée subscription correctement
- [ ] Page success affiche état correct
- [ ] Build TypeScript 0 erreur
- [ ] Tests manuels passent
- [ ] Commit + Push + PR fusionnée
