# Kisakata.com — Project Intelligence & Guidelines

## 1. Stack & Architecture
- **Framework:** Next.js 16.2.2 (App Router, Turbopack)
- **Authentification & DB:** Supabase (project ID: `slbnjjgparojkvxbsdzn`) — **IMPORTANT:** Toujours utiliser `@supabase/ssr` (`createBrowserClient` / `createServerClient`) au lieu de `@supabase/supabase-js` en direct pour éviter la désynchronisation des sessions entre LocalStorage et Cookies.
- **Design:** Tailwind CSS v3 + CSS Variables personnalisées (Design System V1 "Brume de la Rivière").
- **Animations:** GSAP (ScrollTrigger via `useGSAP`) + Framer Motion.
- **Polices:** Outfit (H1/Titres) + Geist Mono (Interface/Détails).
- **Analytics:** Command Center V2 inclut désormais la capture d'IP (via trigger Postgres `tr_capture_ip`) et l'analyse géographique.
- **Déploiement:** Netlify (branche `main`). Build: `next build`. Node >= 18.

---

## 2. Rôles et Monétisation (Paywall)
- **Roles utilisateurs:** `admin`, `manager`, `contributor`, `user`.
- **Niveaux d'abonnement (Paywall):** `free`, `premium`.
- **Gating de contenu:** La route `savoir/[slug]` utilise un composant "Paywall" avec un rendu "glassmorphism" qui bloque la lecture des articles nécessitant le niveau `premium`. Tous les statuts d'abonnement sont synchronisés via `AuthProvider`.

---

## 3. Structure du Projet (App Router)
```text
src/
  app/
    admin/          # Espace sécurisé (Command Center) pour gestion membres & contenus.
    auth/           # Tunnel d'authentification immersif (Supabase).
    savoir/         # Encyclopédie dynamique (Textes/Images intégrés). Articles premium inclus.
    forum/          # "Mboka" (Le Village) : Forum en temps réel avec catégories et RLS.
      [category_slug]/new   # Éditeur de sujets enrichis (Markdown personnalisé).
      thread/[thread_slug]  # Chat temps réel pour discussions communautaires.
    chat/           # Messagerie privée temps réel (WebSocket Supabase).
    ecole/          # Espace scolaire (mathématiques, curriculum 3 années secondaires).
    geographie/     # Carte interactive 3D.
    membres/        # Annuaire des membres de la communauté.
    profil/         # Hub personnel pour gérer son statut (Premium/Classic) et ses détails.
  components/
    Navbar.tsx      # Navigation intelligente avec gestion conditionnelle (Profil vs Admin).
    AuthProvider.tsx # Fournisseur global des informations Supabase (Client-side, SSR sync).
    chat/
      ChatWindow.tsx    # Fenêtre de conversation (messages + header dynamique).
      ChatInput.tsx     # Zone de saisie : texte, audio, image, mode éphémère.
      MessageBubble.tsx # Rendu de message : texte, audio, image protégée/normale.
      ChatSidebar.tsx   # Liste des conversations avec statut non-lus.
  hooks/
    chat/
      useConversations.ts  # Charge la liste des conversations (fix infinite loading).
      useMessages.ts       # Charge les messages d'une conversation + realtime.
      useTyping.ts         # Indicateur de frappe en temps réel.
  lib/
    supabase/admin.ts  # Client de contournement RLS (Service Key). Utiliser avec parcimonie.
    constants/
      routes.ts     # ROUTES — toutes les URLs de l'application.
      db.ts         # DB_TABLES, DB_BUCKETS — noms des tables/buckets Supabase.
      storage.ts    # STORAGE_KEYS, SESSION_KEYS, msgViewedKey(id).
      timings.ts    # TIMINGS — délais et durées centralisés.
      business.ts   # USER_ROLES, SUBSCRIPTION_TIERS, EXPIRY_DURATIONS, IMAGE_VIEW_MODES, APP_VERSION.
      index.ts      # Barrel re-export de toutes les constantes.
docs/
  HARDCODED_AUDIT.md     # Audit complet des valeurs codées en dur (P0→P4).
  BUGS_AND_TODOS.md      # Bugs connus et tâches restantes.
  ACCESSIBILITY_AUDIT.md
  ROADMAP.md             # Feuille de route curriculum mathématiques (écoles primaires).
  VISUALIZATION_ROADMAP.md
```

---

## 4. Système de Messagerie (Chat)

### Architecture
- **`ChatWindow.tsx`** : Conteneur principal. Gère le nom dynamique de la conversation (fetchée depuis `chat_participants` + `profiles`), le mode éphémère, le banner ambré, et les messages.
- **`ChatInput.tsx`** : Zone de saisie enrichie.
  - Enregistrement audio avec aperçu pre-envoi (style WhatsApp).
  - Sélecteur d'image éphémère (`EphemeralImagePicker`) : Normal / Vue 1× / Vue 2×.
  - `onSend(content, attachment?, expiresIn?, maxViews?)`.
- **`MessageBubble.tsx`** : Rendu adaptatif.
  - `AudioPlayer` : Lecteur HTML5 avec barre de progression scrubable. Pas de download en mode temporaire.
  - `ProtectedImage` : Gestion des états `locked → revealed → expired`, countdown, détection de capture d'écran.

### Règles Éphémères (IMPORTANT)
- **L'envoyeur voit toujours sa propre image** — vérifier `isMe` avant d'appliquer `viewState = "locked"`.
- **localStorage** : Clé `msgViewedKey(id)` = `"sakata-msg-viewed-{id}"` — persiste l'état "vu" entre sessions.
- **maxViews: 1** → countdown `VIEW_ONCE_COUNTDOWN` (5s). **maxViews: 2** → `VIEW_TWICE_COUNTDOWN` (10s).
- **Détection capture d'écran** : `visibilitychange` + `window.blur` → overlay flou. Skippé pour `isMe`.

### Pattern Anti-Boucle Subscription (CRITIQUE)
```typescript
// ✅ CORRECT — useConversations.ts
async function fetchConversations(showLoading = false) {
  if (isFetchingRef.current) return;   // garde concurrence
  isFetchingRef.current = true;
  if (showLoading) setLoading(true);   // spinner seulement au montage initial
  // ...
}
fetchConversations(true);  // montage initial → spinner visible
channel.on("postgres_changes", ..., () => fetchConversations(false)); // silent
```
**NE JAMAIS** appeler `setLoading(true)` dans un callback de subscription Supabase — cela crée une boucle infinie visible par l'utilisateur.

---

## 5. Constantes Centralisées (`src/lib/constants/`)

Toujours importer depuis les fichiers de constantes, jamais coder en dur :

```typescript
// Routes
import { ROUTES } from "@/lib/constants/routes";
// Tables Supabase
import { DB_TABLES, DB_BUCKETS } from "@/lib/constants/db";
// localStorage keys
import { STORAGE_KEYS, msgViewedKey } from "@/lib/constants/storage";
// Timings
import { TIMINGS } from "@/lib/constants/timings";
// Métier
import { USER_ROLES, SUBSCRIPTION_TIERS, EXPIRY_DURATIONS, IMAGE_VIEW_MODES, APP_VERSION } from "@/lib/constants/business";
```

**APP_VERSION** : Bumper à chaque déploiement majeur dans `business.ts` pour invalider automatiquement les entrées localStorage périmées (`sakata-*`).

---

## 6. Règles Critiques (Next.js & Infrastructure)

- **Supabase Joins:** La table `profiles` ne contient PAS de colonne `display_name`. Utiliser uniquement `username` et `nickname`.
- **Rendu Forum:** Toujours vérifier que les jointures sur `profiles` utilisent la syntaxe standard Supabase pour éviter les erreurs de mapping sur Netlify.
- **Hydratation & Loading:** `LoadingProvider` gère les transitions de page. Ne pas introduire de délais artificiels (le timeout de sécurité est de 4s).
- **Hydratation:** La structure HTML doit toujours être stricte. Ne pas insérer de valeurs aléatoires (ex: `Date.now()`) lors du rendu serveur sans protection `useEffect`.
- **Composants Client vs Serveur:** `use client` est nécessaire au sommet des fichiers qui intègrent de l'interactivité (GSAP, Etat local, Formulaires).
- **Styles:** Ne jamais surcharger les polices globales avec des utilitaires Tailwind sans raison. Garder les variables `--foret-nocturne`, `--or-ancestral`, et `--ivoire-ancien` comme base canonique.
- **TypeScript `as const` + `useState`:** Quand une constante `as const` a un type littéral (ex: `5`), utiliser `useState<number>(val)` explicitement pour éviter l'erreur `Type 'number' is not assignable to type '5 | 10'`.
- **Vidéos dans les Hero :** Toujours utiliser `preload="auto"` + `onCanPlay={() => setVideoReady(true)}` + transition `opacity 0.8s` pour éviter le flash de vidéo après chargement de page.
- **Nom de conversation:** Toujours fetcher dynamiquement depuis `chat_participants` + `profiles` — ne jamais hardcoder "Conversation" ou "C".

---

## 7. AuthProvider — Session Management

- **`sessionExpired`** : Flag qui détecte une déconnexion forcée (rotation de token multi-appareils). Affiche un banner dans la Navbar.
- **Cross-tab sync** : `storage` event listener sur les clés `sb-*` pour synchroniser la session entre onglets.
- **Versioning localStorage** : `APP_VERSION` dans `business.ts` — à bumper pour invalider les clés `sakata-*` stales.
- **`TOKEN_REFRESHED`** : Toujours géré dans `onAuthStateChange` pour rafraîchir le Router Cache Next.js.

---

## 8. Skills et Outils Actifs
- `sage-basakata` — Maintenir la voix narrative ancestrale dans la formulation.
- `design-taste-frontend` / `stitch-design-taste` — Strict respect de l'esthétique premium (espacements, motion-design, bordures 1px).
- `documentaliste-culturel` — Rigueur lors du remplissage sémantique des bases de données.

---

## 9. Dernières Mises à Jour (Changelog)

| Date | Modification |
|------|-------------|
| 2026-04 | Système de constantes centralisées (`src/lib/constants/`) — routes, db, storage, timings, business |
| 2026-04 | Messagerie privée : enregistrement audio avec aperçu pre-envoi (style WhatsApp) |
| 2026-04 | Images éphémères : vue unique/double, countdown, détection de capture d'écran |
| 2026-04 | Mode conversation temporaire : 24h/48h avec expiration automatique |
| 2026-04 | Fix infinite loading — `useConversations` subscription ne relance plus le spinner |
| 2026-04 | Fix nom de conversation hardcodé ("Conversation"/"C" → nom dynamique du partenaire) |
| 2026-04 | Fix vidéos Hero — apparition fluide via `onCanPlay` + fade-in opacity |
| 2026-04 | Fix envoyeur image éphémère — l'envoyeur voit toujours sa propre image |
| 2026-04 | Audit HARDCODED_AUDIT.md — liste des valeurs codées en dur restantes (P0→P4) |
