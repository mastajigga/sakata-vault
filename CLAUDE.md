# Sakata.com — Project Intelligence & Guidelines

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
    geographie/     # Ultra-Premium Mapbox GL JS v3 (3D Globe, Terrain, Atmosphere).
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
    supabase/admin.ts    # Client de contournement RLS (Service Key). Utiliser avec parcimonie.
    supabase-retry.ts    # withRetry() / withRetryRaw() — retry backoff exponentiel pour tous les appels Supabase critiques.
    supabase.ts          # Singleton createBrowserClient — TOUJOURS importer ce fichier, jamais instancier createBrowserClient dans un composant.
    constants/
      routes.ts     # ROUTES — toutes les URLs de l'application.
      db.ts         # DB_TABLES, DB_BUCKETS — noms des tables/buckets Supabase (inclut CHAT_REACTIONS, PUSH_SUBSCRIPTIONS, ECOLE_SCORES).
      storage.ts    # STORAGE_KEYS, SESSION_KEYS, msgViewedKey(id), ecoleProgressKey(ns).
      timings.ts    # TIMINGS — délais et durées centralisés.
      business.ts   # USER_ROLES, SUBSCRIPTION_TIERS, EXPIRY_DURATIONS, IMAGE_VIEW_MODES, APP_VERSION, ROLE_HIERARCHY, canManageContent(), canCreateArticles(), hasMinRole().
      index.ts      # Barrel re-export de toutes les constantes.
  components/
    ecole/
      GameMode.tsx  # Mode exercice gamifié avec score, indices et sauvegarde Supabase.
  hooks/
    usePushNotifications.ts  # Subscribe/unsubscribe aux notifications Web Push.
  app/
    api/
      push/subscribe/route.ts    # POST — upsert abonnement push en base.
      push/unsubscribe/route.ts  # POST — suppression abonnement push (erreur DB propagée).
      articles/search/route.ts   # GET — recherche articles ilike avec whitelist lang + échappement LIKE.
docs/
  HARDCODED_AUDIT.md            # Audit complet des valeurs codées en dur (P0→P4).
  BUGS_AND_TODOS.md             # Bugs connus et tâches restantes.
  ACCESSIBILITY_AUDIT.md
  ROADMAP.md                    # Feuille de route curriculum mathématiques.
  VISUALIZATION_ROADMAP.md
  CACHE_SUPABASE_AUDIT.md       # Audit cache navigateur & accès Supabase v2.2.0 — 15 problèmes (tous corrigés).
  REALTIME_CACHE_AUDIT_V2.md    # Audit Realtime & Cache v2.3.0 — 15 nouvelles corrections (BUG-01 à BUG-15).
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
import { STORAGE_KEYS, SESSION_KEYS, msgViewedKey, ecoleProgressKey } from "@/lib/constants/storage";
// Timings
import { TIMINGS } from "@/lib/constants/timings";
// Métier
import { USER_ROLES, SUBSCRIPTION_TIERS, EXPIRY_DURATIONS, IMAGE_VIEW_MODES, APP_VERSION } from "@/lib/constants/business";
// Retry Supabase (OBLIGATOIRE pour toute mutation critique)
import { withRetry, withRetryRaw } from "@/lib/supabase-retry";
```

**APP_VERSION** : Bumper à chaque déploiement majeur dans `business.ts` pour invalider automatiquement les entrées localStorage périmées (`sakata-*`). Version actuelle : `2.3.0`.

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
- **withRetry() OBLIGATOIRE** : Tout appel Supabase critique (`.insert()`, `.upsert()`, `.update()`, `.select()` sur données utilisateur) **DOIT** utiliser `withRetry()` de `@/lib/supabase-retry`. Les appels fire-and-forget (analytics, cleanup) sont exemptés.
- **Set<string\> explicite** : Quand un `Set` est initialisé depuis des constantes `as const`, typer explicitement `new Set<string>(...)` pour éviter l'erreur TypeScript sur `.has(key: string)`.
- **Singleton Supabase client** : NE JAMAIS appeler `createBrowserClient(...)` dans le corps d'un composant (recréé à chaque render → leak WebSocket). Toujours importer le singleton `import { supabase } from "@/lib/supabase"`. Si un `useMemo` est nécessaire (cas rare), le documenter.
- **Subscribe handler d'erreur OBLIGATOIRE** : Toute `.subscribe()` Supabase **DOIT** inclure `(status, err) => { if (status === 'CHANNEL_ERROR' || err) { console.error(...); /* fallback */ } }`. Sans cela, une déconnexion WebSocket est invisible.
- **Dep array subscription** : Les tableaux d'objets passés en props ne doivent **JAMAIS** figurer dans le dep array d'un `useEffect` de subscription. Utiliser un `ref` synchronisé par un effet séparé pour les données dérivées.
- **Guard isMounted avant channel async** : Dans toute fonction `async` qui crée un channel Supabase, ajouter `if (!isMounted) return` avant `supabase.channel(...)` pour éviter les refs stales après démontage.
- **Interpolation dans .or() / .filter()** : Les paramètres URL interpolés dans les filtres Supabase **DOIVENT** être validés contre une whitelist ET échappés via `escapeLike()` pour les valeurs `ilike`. Voir `src/app/api/articles/search/route.ts` comme référence.
- **URL.createObjectURL** : Toujours révoquer avec `setTimeout(() => URL.revokeObjectURL(url), 100)` après usage pour éviter les leaks mémoire.
- **Subscription filtrée** : Toujours vérifier dans le callback realtime que `payload.new.{key}` appartient aux données pertinentes avant de re-fetcher. Éviter les re-fetches pour des changements d'autres utilisateurs/conversations.

---

## 7. AuthProvider — Session Management

- **`sessionExpired`** : Flag qui détecte une déconnexion forcée (rotation de token multi-appareils). Affiche un banner dans la Navbar.
- **`tokenRefreshPending`** : Flag exposé dans le contexte Auth — `true` pendant la fenêtre de ~30-60s de rotation JWT. Les composants critiques peuvent l'utiliser pour afficher un indicateur de chargement.
- **Cross-tab sync** : Géré nativement par `supabase.auth.onAuthStateChange()`. **NE PAS** ajouter de `window.addEventListener("storage", ...)` sur les clés `"sb-*"` — c'est redondant et fragile.
- **Versioning localStorage** : `APP_VERSION` dans `business.ts` — à bumper pour invalider les clés `sakata-*` stales. La purge couvre toute clé `sakata-*` non whitelistée + les vieilles clés `sakata_*` (underscore) et `msg-viewed-*` (sans préfixe) créées par d'anciens bugs.
- **`TOKEN_REFRESHED`** : Toujours géré dans `onAuthStateChange` pour rafraîchir le Router Cache Next.js.
- **Whitelist localStorage** : La constante `SAKATA_KEY_WHITELIST` dans `AuthProvider.tsx` doit être mise à jour à chaque ajout d'une nouvelle clé `sakata-*`.

### Règles absolues localStorage (⚠️ NE JAMAIS VIOLER)
1. **Toute clé DOIT commencer par `"sakata-"` (tiret, jamais underscore).**
2. **Toute nouvelle clé DOIT être déclarée dans `src/lib/constants/storage.ts`.**
3. **Toute nouvelle clé DOIT être ajoutée à `SAKATA_KEY_WHITELIST` dans `AuthProvider.tsx`.**
4. **Ne jamais utiliser `sessionStorage` pour des données critiques** (progression, session ID) — utiliser `localStorage`.
5. **Ne jamais hardcoder une valeur de clé localStorage** — toujours utiliser la constante de `storage.ts`.

---

## 8. Skills et Outils Actifs
- `sage-basakata` — Maintenir la voix narrative ancestrale dans la formulation.
- `design-taste-frontend` / `stitch-design-taste` — Strict respect de l'esthétique premium (espacements, motion-design, bordures 1px).
- `documentaliste-culturel` — Rigueur lors du remplissage sémantique des bases de données.

---

## 9. Phase 2 — Optimisations & Nouveaux Patterns (v2.4.0)

### Caching Hybride Implanté
- **`useCachedFetch` Hook** (`src/hooks/useCachedFetch.ts`) — Pattern unifié :
  1. Vérifier localStorage avec TTL → retourner si valide
  2. Lancer fetch en background (AbortController)
  3. Réévaluer sur focus/visibility
  4. Retour : `{ data, error, isLoading, mutate }`
- **API Routes ISR** : Tous les endpoints lisent avec `Cache-Control: public, s-maxage=300, stale-while-revalidate=60`
  - `/api/articles` → articles list
  - `/api/profiles` → community members
  - `/api/courses` → school content
- **localStorage Rules** : Clés préfixées `sakata-*`, whitelist dans `AuthProvider`, TTL en base de `const`

### Validation Formulaires (React Hook Form + Zod)
- **Schemas centralisés** : `src/lib/schemas/validation.ts`
  ```typescript
  export const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  ```
- **Composants intégrés** :
  - `src/app/auth/page.tsx` — authSchema + real-time errors
  - `src/app/profil/page.tsx` — profileSchema + nickname watch
  - `src/components/chat/ChatInput.tsx` — chatInputSchema (optionnel, fallback manuel)
  - Article editor — articleSchema (sections JSON + images)
- **UX** : Erreurs rouges en temps réel, messages explicites, pas de submission si invalide

### Image Optimization (Next.js Image)
- **Migration complète** : 40+ balises `<img>` → `<Image>`
- **Patterns** :
  - `fill` + `sizes` pour conteneurs responsifs
  - `width/height` pour images fixes
  - `priority` pour LCP candidates (hero, above-fold)
  - `alt` texte obligatoire (SEO + a11y)
- **Impact** : Lighthouse LCP -30%, lazy load automatique, AVIF/WebP

### Pagination Messages (Infinie)
- **Pattern** : Load last 50 on mount, scroll-up triggers fetch older
- **Files** :
  - `src/hooks/chat/useMessages.ts` → handle pagination
  - `src/components/chat/ChatWindow.tsx` → detect scroll-top + trigger load
- **Supabase** : `.range(from, to).order("created_at", { ascending: false })`

### Lazy Loading (Géographie & Heavy Components)
- **Dynamic Import** :
  ```typescript
  const GeographieClient = dynamic(() => import("./GeographieClient"), {
    ssr: false,
    loading: () => <LoadingScreen />,
  });
  ```
- **Impact** : Mapbox JS chargé uniquement quand page ouverte

### Système d'Erreurs Unifié
- **`src/lib/errors.ts`** — Central error codes + user messages
- **Pattern** : `catch (err) { const msg = getErrorMessage(err); toast.error(msg); }`
- **Remplacement** : Tous les "An error occurred" → messages spécifiques

### Email Notifications
- **Template** (`src/lib/email/templates.ts`) — HTML stylisé avec couleurs du site (#C16B34)
- **Route API** (`src/app/api/email/notify-updates/route.ts`) — POST avec updateType
- **Usage** : POST /api/email/notify-updates avec `{ updateType: "phase2" }` → emails à tous les users

### Rebranding Sakata
- **Titre site** : Kisakata.com → **Sakata.com**
- **Logo** : "KISAKATA" → **"SAKATA"** (Navbar.tsx line 124)
- **Métadonnées** : layout.tsx + OG image (si applicable)
- **Design** : Consistance "Brume de la Rivière — Patrimoine Sakata"

---

## 10. Dernières Mises à Jour (Changelog)

| Date | Modification |
|------|-------------|
| 2026-04-16 | **ULTRA-PREMIUM MAPBOX V3** — Migration de MapLibre vers Mapbox GL JS v3. Globe 3D, terrain, atmosphère dynamique. Correction de l'erreur "Style is not done loading" via synchronisation `onLoad`. |
| 2026-04-16 | **GEOGRAPHIE 3D V2** — Refonte totale "Command Center" : layout dashboard, cinématique Flythrough, optimisation Promise.all |
| 2026-04-16 | **AUDIT REALTIME V2** — 15 nouvelles corrections P1→P3. Voir `docs/REALTIME_CACHE_AUDIT_V2.md` |
| 2026-04-16 | Injection LIKE neutralisée — whitelist lang + `escapeLike()` dans `api/articles/search/route.ts` |
| 2026-04-16 | GameMode — singleton Supabase au lieu de `createBrowserClient` dans le composant (leak WebSocket) |
| 2026-04-16 | useEcoleProgress — CHANNEL_ERROR handler + dep array sans `programs` + withRetry sur recordAttempt |
| 2026-04-16 | ChatWindow — channel réactions découplé des messages + filtre payload + revokeObjectURL export |
| 2026-04-16 | useTyping — subscribe handler d'erreur + guard isMounted avant channel async |
| 2026-04-16 | contributeur/page — stale closure user.id corrigée + withRetry sur tous les fetches |
| 2026-04-16 | membres/page — withRetry + gestion erreur + setLoading dans finally |
| 2026-04-16 | CoursePage — boucle enrichments eliminée via fetchingRef (Set<string>) |
| 2026-04-16 | api/push/unsubscribe — erreur DB silencieuse propagée (status 500) |
| 2026-04-16 | École — sidebar corrigée (primaire/secondaire séparés), liens exercices ajoutés, 4e→6e secondaire |
| 2026-04-17 | **PHASE 2 COMPLÈTE** — Optimisations performance, caching hybride, validation formulaires. Voir `docs/PHASE_2_*.md` |
| 2026-04-17 | Rebranding **Kisakata → Sakata** — titre site, logo, métadonnées OG actualisés |
| 2026-04-17 | Système email — templates HTML stylisés + route `/api/email/notify-updates` pour newsletters |
| 2026-04-17 | Hook `useCachedFetch` — caching hybride localStorage + ISR + SWR avec TTL + focus revalidation |
| 2026-04-17 | `src/lib/schemas/validation.ts` — Zod schemas centralisés (auth, profile, chat, article) |
| 2026-04-17 | Next.js Image optimization — migration 40+ balises `<img>` vers `<Image>` (membres, savoir, école, géographie) |
| 2026-04-17 | Message pagination — chargement incrémental 50 messages, scroll-up pour charger plus ancien |
| 2026-04-17 | Géographie lazy load — dynamic import avec `ssr: false` pour globe 3D + tuiles Mapbox |
| 2026-04-17 | Formulaires validation — React Hook Form + Zod sur authentification, profil, chat, articles |
| 2026-04-17 | API caching headers — articles, profils, cours avec Cache-Control ISR + SWR |
| 2026-04-17 | Changelog v2.4.0 — Phase 2 features documentées (performance, caching, validation, rebranding) |
| 2026-04-16 | APP_VERSION bumpé `2.2.0` → `2.3.0` |
| 2026-04-15 | **FIX CACHE P1→P4** — Audit complet localStorage/Supabase. 15 problèmes corrigés. Voir `docs/CACHE_SUPABASE_AUDIT.md` |
| 2026-04-15 | `withRetry()` — utilitaire centralisé retry + backoff expo. (`src/lib/supabase-retry.ts`) |
| 2026-04-15 | `msgViewedKey()` corrigé → `"sakata-msg-viewed-{id}"` (préfixe manquant causait accumulation infinie) |
| 2026-04-15 | `WELCOME_SEEN` corrigé → `"sakata-welcome-seen-v2"` (underscore → tiret) |
| 2026-04-15 | AuthProvider — listener `storage "sb-*"` supprimé (redondant), `onAuthStateChange` seul |
| 2026-04-15 | AuthProvider — whitelist localStorage exhaustive + purge des vieilles clés sans préfixe |
| 2026-04-15 | AuthProvider — `tokenRefreshPending` flag exposé dans le contexte |
| 2026-04-15 | AnalyticsProvider — `sessionStorage` → `localStorage` pour SESSION_ID; user connecté = session stable `user-{id}` |
| 2026-04-15 | useEcoleProgress — `sessionStorage` → `localStorage` + withRetry sur upsert |
| 2026-04-15 | useMessages — stale closure userId corrigé via `useRef` + re-subscribe si userId change |
| 2026-04-15 | WelcomeModal — clé hardcodée `"sakata_welcome_seen_v2"` → `STORAGE_KEYS.WELCOME_SEEN` |
| 2026-04-15 | APP_VERSION bumpé `2.1.0` → `2.2.0` pour purger toutes les clés stale chez les visiteurs |
| 2026-04-15 | Stripe double-buy prevention — `subscription_sessions` + `chat_subscriptions` tables |
| 2026-04-15 | Système unifié de demandes de contribution (`contribution_requests` table + admin page) |
| 2026-04-15 | Éditeur d'articles riche (JSON sections + images + sources) + page review admin |
| 2026-04 | Système de constantes centralisées (`src/lib/constants/`) — routes, db, storage, timings, business |
| 2026-04 | Messagerie privée : enregistrement audio avec aperçu pre-envoi (style WhatsApp) |
| 2026-04 | Images éphémères : vue unique/double, countdown, détection de capture d'écran |
| 2026-04 | Mode conversation temporaire : 24h/48h avec expiration automatique |
| 2026-04 | Fix infinite loading — `useConversations` subscription ne relance plus le spinner |
| 2026-04 | Fix nom de conversation hardcodé ("Conversation"/"C" → nom dynamique du partenaire) |
| 2026-04 | Fix vidéos Hero — apparition fluide via `onCanPlay` + fade-in opacity |
| 2026-04 | Fix envoyeur image éphémère — l'envoyeur voit toujours sa propre image |
| 2026-04 | Audit HARDCODED_AUDIT.md — liste des valeurs codées en dur restantes (P0→P4) |
