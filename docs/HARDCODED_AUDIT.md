# Audit des valeurs codées en dur — Kisakata.com

**Date de l'audit :** 2026-04-14  
**Branche :** `feat/pinecone-semantic-search-save`  
**Périmètre :** Répertoire `src/` (composants, hooks, app routes, lib)

---

## 1. Couleurs codées en dur (hex vs CSS variables)

Les tokens de couleur du Design System V1 « Brume de la Rivière » sont définis en tant que variables CSS dans `src/app/globals.css`. Plusieurs fichiers contournent ces variables en utilisant des valeurs hexadécimales directes.

| Fichier | Valeur hex | Variable CSS équivalente | Sévérité |
|---|---|---|---|
| `src/app/error.tsx` | `#0A1F15`, `#B59551`, `#F2EEDD`, `#122A1E` | `--foret-nocturne`, `--or-ancestral`, `--ivoire-ancien` | **Haute** |
| `src/app/auth/page.tsx` | `#0A1F15` | `--foret-nocturne` | **Haute** |
| `src/app/savoir/[slug]/page.tsx` | `#0A1F15`, `#0D241A`, `#071610` | `--foret-nocturne`, `--eau-sombre` | **Haute** |
| `src/components/LanguageSwitcher.tsx` | `#0A1F15` | `--foret-nocturne` | Moyenne |
| `src/components/forum/MarkdownEditor.tsx` | `#0A1F15`, `#B59551`, `#F2EEDD`, `#122A1E` | `--foret-nocturne`, `--or-ancestral`, `--ivoire-ancien` | **Haute** |
| `src/components/CommunityCallout.tsx` | `#0A1F15` (inline gradients) | `--foret-nocturne` | Moyenne |
| `src/app/globals.css` | Définitions canoniques — **source de vérité**, ne pas modifier | — | Faible |

**Remarque :** `src/app/geographie/` utilise un objet `KISAKATA_COLORS` dédié pour les styles Mapbox — couvert par les tests unitaires dans `src/__tests__/geographie/mapStyles.test.ts`. Cette approche est intentionnelle et acceptable.

---

## 2. Textes UI non traduits

Le système de traduction `UI_TRANSLATIONS` (géré par `LanguageProvider`) n'est pas encore appliqué uniformément.

| Fichier | Textes détectés | Action recommandée |
|---|---|---|
| `src/components/chat/MessageBubble.tsx` | `"Image expirée"`, `"Appuyer pour révéler"`, `"Vue unique"`, `"Vue 2×"`, `"Contenu protégé"` | Ajouter clés i18n `chat.image.*` |
| `src/components/chat/ChatInput.tsx` | `"Mode envoi :"`, `"Normal"`, `"Vue 1×"`, `"Vue 2×"`, `"Durée de vie"`, `"Permanent (conserver)"`, `"Éphémère · N heures"`, `"Écrire un message..."`, `"Enregistrement..."`, `"Envoyer"` | Ajouter clés i18n `chat.input.*` |
| `src/components/Navbar.tsx` | Fallbacks `"Mon Profil"`, `"Déconnexion"` dans le menu mobile | Utiliser uniquement `t("nav.profile")` et `t("nav.logout")` |
| `src/app/error.tsx` | `"Une perturbation est survenue"`, `"Retourner à l'accueil"`, `"Réessayer"` | Ajouter clés i18n `errors.*` |
| `src/app/profil/page.tsx` | Multiples labels de formulaire et messages de succès | Ajouter clés i18n `profil.*` |
| `src/components/LoadingProvider.tsx` | Message console `"Safety timeout reached"` | Acceptable (dev-only) |

---

## 3. URLs et chemins en dur (vidéos, images, routes)

### Routes de navigation

Avant ce refactoring, les routes étaient dispersées en littéraux de chaîne. Elles sont maintenant centralisées dans `src/lib/constants/routes.ts`.

**Fichiers restants à migrer vers `ROUTES` :**

| Fichier | Chemin en dur | Constante disponible |
|---|---|---|
| `src/app/savoir/[slug]/page.tsx` | `"/savoir"`, `"/auth"` | `ROUTES.SAVOIR`, `ROUTES.AUTH` |
| `src/app/profil/page.tsx` | `"/profil"`, `"/auth"` | `ROUTES.PROFIL`, `ROUTES.AUTH` |
| `src/app/forum/*/page.tsx` | `"/forum"` | `ROUTES.FORUM` |
| `src/app/admin/*/page.tsx` | `"/admin"` | `ROUTES.ADMIN` |
| `window.location.href = "/"` dans `AuthProvider.tsx` | `"/"` | `ROUTES.HOME` |

### URLs de médias

| Fichier | Valeur | Remarque |
|---|---|---|
| `src/app/ecole/page.tsx` | URL Cloudflare R2 de la vidéo de fond | Externaliser dans `.env.local` comme `NEXT_PUBLIC_ECOLE_VIDEO_URL` |
| `src/app/savoir/[slug]/page.tsx` | URL Cloudflare R2 de la vidéo de fond | Idem |
| `src/components/CommunityCallout.tsx` | URL Cloudflare R2 vidéo | Idem |
| Composants géographie | URLs tuiles MapTiler/Mapbox | Externaliser en `NEXT_PUBLIC_MAP_*` |

---

## 4. Nombres magiques (timeouts, durées, dimensions)

Après refactoring, les valeurs suivantes sont désormais centralisées dans `src/lib/constants/timings.ts`.

### Migré

| Constante | Valeur | Ancien emplacement |
|---|---|---|
| `TIMINGS.LOADING_MIN_DISPLAY` | `600 ms` | `LoadingProvider.tsx` |
| `TIMINGS.LOADING_SAFETY_TIMEOUT` | `4000 ms` | `LoadingProvider.tsx` (×2) |
| `TIMINGS.TYPING_STOP_DELAY` | `3000 ms` | `ChatInput.tsx` |
| `TIMINGS.ANALYTICS_DEBOUNCE` | `1500 ms` | `AnalyticsProvider.tsx` |
| `TIMINGS.ANALYTICS_DEDUP_WINDOW` | `10 000 ms` | `AnalyticsProvider.tsx` |
| `TIMINGS.CAPTURE_ALERT_DURATION` | `2000 ms` | `MessageBubble.tsx` (×2) |
| `TIMINGS.VIEW_ONCE_COUNTDOWN` | `5 s` | `MessageBubble.tsx` |
| `TIMINGS.VIEW_TWICE_COUNTDOWN` | `10 s` | `MessageBubble.tsx` |

### Restant à migrer

| Fichier | Valeur | Contexte |
|---|---|---|
| `src/app/profil/page.tsx` | `3000 ms` (×3) | `setTimeout(() => setSuccess(false), 3000)` → utiliser `TIMINGS.NOTIFICATION_DISPLAY` |
| `src/lib/translate.ts` | `800 ms` | Délai artificiel de simulation de traduction |
| `src/components/chat/NewChatModal.tsx` | `setTimeout` sans durée explicite | Vérifier et nommer |
| `src/app/savoir/[slug]/page.tsx` | `100 ms` | Délai de tracking lecture |
| `src/app/geographie/components/CinematicFlythrough.tsx` | Multiples délais `t1`, `t2`, `t3` | Nommer selon leur rôle métier |
| `src/app/forum/thread/[thread_slug]/ThreadRepliesClient.tsx` | `setTimeout` | À examiner |

**Dimensions :**

| Fichier | Valeur | Contexte |
|---|---|---|
| `src/components/Navbar.tsx` | `window.scrollY > 80` | Seuil de scroll déclenchant le style compact |
| `src/components/chat/ChatInput.tsx` | `window.innerWidth < 768` | Détection mobile dans AnalyticsProvider |
| `src/components/chat/AudioPlayer` | `min-w-[220px]`, `max-w-xs` | Dimensions du lecteur audio |

---

## 5. Noms de tables Supabase

Après refactoring, les tables critiques du module chat sont centralisées dans `src/lib/constants/db.ts`.

### Migré

| Constante | Table | Fichiers mis à jour |
|---|---|---|
| `DB_TABLES.CHAT_MESSAGES` | `"chat_messages"` | `useMessages.ts` |
| `DB_TABLES.PROFILES` | `"profiles"` | `useMessages.ts` |
| `DB_TABLES.CHAT_PARTICIPANTS` | `"chat_participants"` | `useConversations.ts` |
| `DB_BUCKETS.CHAT_ATTACHMENTS` | `"chat_attachments"` | `useMessages.ts` |

### Restant à migrer (22 fichiers)

Les fichiers suivants contiennent encore des noms de tables en littéraux :

| Fichier | Tables référencées |
|---|---|
| `src/components/AuthProvider.tsx` | `"profiles"` |
| `src/app/admin/page.tsx` | `"profiles"`, `"site_analytics"` |
| `src/app/api/track/route.ts` | `"site_analytics"` |
| `src/app/membres/page.tsx` | `"profiles"` |
| `src/app/membre/[username]/page.tsx` | `"profiles"`, `"profile_gallery"` |
| `src/app/profil/page.tsx` | `"profiles"`, `"profile_gallery"` |
| `src/components/chat/ChatWindow.tsx` | `"chat_conversations"`, `"chat_participants"` |
| `src/components/chat/NewChatModal.tsx` | `"profiles"` |
| `src/components/LikeButton.tsx` | `"article_likes"` |
| `src/app/savoir/page.tsx` | `"articles"` |
| `src/app/savoir/[slug]/page.tsx` | `"articles"`, `"article_likes"` |
| `src/app/forum/page.tsx` | `"forum_categories"` |
| `src/app/forum/[category_slug]/page.tsx` | `"forum_categories"`, `"forum_threads"` |
| `src/app/forum/[category_slug]/new/NewThreadClient.tsx` | `"forum_threads"`, `"forum_posts"` |
| `src/app/forum/thread/[thread_slug]/page.tsx` | `"forum_threads"`, `"forum_posts"`, `"profiles"` |
| `src/app/forum/thread/[thread_slug]/ThreadRepliesClient.tsx` | `"forum_posts"`, `"profiles"` |
| `src/app/admin/users/page.tsx` | `"profiles"` |
| `src/app/admin/content/page.tsx` | `"articles"` |
| `src/app/admin/content/[slug]/page.tsx` | `"articles"` |
| `src/hooks/chat/useTyping.ts` | `"chat_participants"` |

---

## 6. Logique métier (rôles, abonnements, durées éphémères)

Après refactoring, les constantes métier sont centralisées dans `src/lib/constants/business.ts`.

### Migré

| Constante | Valeur | Ancien emplacement |
|---|---|---|
| `SUBSCRIPTION_TIERS.FREE` | `"free"` | `AuthProvider.tsx` |
| `IMAGE_VIEW_MODES.*` | `"normal"`, `"once"`, `"twice"` | `ChatInput.tsx` |
| `EXPIRY_DURATIONS.*` | `"never"`, `"24h"`, `"48h"`, `"7_days"`, `"30_days"` | `ChatInput.tsx` |
| `APP_VERSION` | `"2.1.0"` | `AuthProvider.tsx` |

### Restant à migrer

| Fichier | Valeur | Action |
|---|---|---|
| `src/components/AuthProvider.tsx` | `export type UserRole = "admin" \| "manager" \| ...` | Importer `UserRole` depuis `business.ts` (doublon avec `USER_ROLES`) |
| `src/app/admin/page.tsx` | Checks `role === "admin"`, `tier === "premium"` | Utiliser `USER_ROLES.ADMIN`, `SUBSCRIPTION_TIERS.PREMIUM` |
| `src/app/savoir/[slug]/page.tsx` | `tier === "premium"` (paywall) | Utiliser `SUBSCRIPTION_TIERS.PREMIUM` |
| `src/components/chat/ChatInput.tsx` | Prop type `"24h" \| "48h"` sur `temporaryDuration` | Dériver du type `ExpiryDuration` |
| `src/hooks/chat/useMessages.ts` | `expires_in: expiresIn \|\| "never"` | Utiliser `EXPIRY_DURATIONS.NEVER` |

### Type `UserRole` dupliqué

`AuthProvider.tsx` exporte encore son propre type `UserRole` local (`"admin" | "manager" | ...`). Ce type duplique `USER_ROLES` dans `business.ts`. La résolution idéale est d'importer `UserRole` depuis `business.ts` et de supprimer la déclaration locale.

---

## 7. Clés localStorage / sessionStorage

Après refactoring, les clés sont centralisées dans `src/lib/constants/storage.ts`.

### Migré

| Constante | Clé | Fichier mis à jour |
|---|---|---|
| `STORAGE_KEYS.APP_VERSION` | `"sakata-app-version"` | `AuthProvider.tsx` |
| `STORAGE_KEYS.LANG` | `"sakata-lang"` | `LanguageProvider.tsx` |
| `SESSION_KEYS.SESSION_ID` | `"sakata_session_id"` | `AnalyticsProvider.tsx` |
| `msgViewedKey(id)` (fonction exportée) | `` `msg-viewed-${id}` `` | `MessageBubble.tsx` |

### Restant à migrer

| Fichier | Clé | Constante disponible |
|---|---|---|
| `src/components/WelcomeModal.tsx` | `"sakata_welcome_seen_v2"` | `STORAGE_KEYS.WELCOME_SEEN` |

**Note :** La logique d'invalidation dans `AuthProvider.tsx` utilise encore le préfixe `"sakata-"` comme chaîne littérale pour le scan de `localStorage`. Il serait plus robuste d'en faire une constante `STORAGE_KEYS.PREFIX = "sakata-"`.

---

## 8. Config et versions

| Fichier | Valeur | Statut |
|---|---|---|
| `src/lib/constants/business.ts` | `APP_VERSION = "2.1.0"` | Centralisé — source de vérité |
| `src/lib/constants/business.ts` | `PINECONE_DEFAULT_INDEX = "sakata-mathematics"` | Centralisé |
| `package.json` | `"version": "..."` | À synchroniser manuellement avec `APP_VERSION` |
| `next.config.ts` | Configuration Next.js | Pas de valeurs codées problématiques détectées |
| `src/app/api/track/route.ts` | Headers `X-Forwarded-For`, `CF-Connecting-IP` | Acceptable (conventions Netlify/Cloudflare) |

**Variables d'environnement Supabase :**  
`NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont correctement externalisées via `.env.local`. La `SERVICE_ROLE_KEY` est réservée aux routes serveur (`src/lib/supabase/admin.ts`). Aucune clé en dur détectée dans le code source.

---

## 9. Table de priorités de correction

| Priorité | Catégorie | Action | Effort estimé |
|---|---|---|---|
| P0 — Critique | Couleurs hex dans composants publics (`error.tsx`, `MarkdownEditor.tsx`) | Remplacer par variables CSS `var(--foret-nocturne)` etc. | XS (< 1h) |
| P0 — Critique | Type `UserRole` dupliqué dans `AuthProvider.tsx` | Importer depuis `business.ts`, supprimer la déclaration locale | XS (15 min) |
| P1 — Haute | Noms de tables dans les 22 fichiers restants | Importer `DB_TABLES` depuis `constants/db.ts` | S (2–4h) |
| P1 — Haute | `STORAGE_KEYS.WELCOME_SEEN` non utilisé dans `WelcomeModal.tsx` | Import + remplacement | XS (15 min) |
| P1 — Haute | `SUBSCRIPTION_TIERS` / `USER_ROLES` non utilisés dans pages admin et paywall | Import + remplacement | S (1–2h) |
| P2 — Moyenne | Routes hardcodées dans les pages app (`/savoir`, `/auth`, etc.) | Importer `ROUTES` | S (2h) |
| P2 — Moyenne | `setTimeout(3000)` dans `profil/page.tsx` (×3) | Remplacer par `TIMINGS.NOTIFICATION_DISPLAY` | XS (15 min) |
| P2 — Moyenne | Délais dans `CinematicFlythrough.tsx`, `translate.ts` | Nommer et externaliser | S (1h) |
| P3 — Faible | URLs vidéos Cloudflare R2 en dur | Externaliser dans `NEXT_PUBLIC_*` env vars | M (1h + infra) |
| P3 — Faible | Textes UI non traduits dans les composants chat | Ajouter clés `chat.*` dans `translations.ts` | M (3–5h) |
| P3 — Faible | Constante préfixe `"sakata-"` pour le scan localStorage | Ajouter `STORAGE_KEYS.PREFIX` | XS (10 min) |
| P4 — Backlog | Synchronisation `package.json` version ↔ `APP_VERSION` | Script de release CI | M (setup CI) |

---

*Ce document a été généré lors du refactoring de centralisation des constantes (branche `feat/pinecone-semantic-search-save`). Les fichiers créés ou modifiés lors de ce refactoring sont : `src/lib/constants/routes.ts`, `src/lib/constants/db.ts`, `src/lib/constants/storage.ts`, `src/lib/constants/timings.ts`, `src/lib/constants/business.ts`, `src/lib/constants/index.ts`, et les mises à jour des 9 fichiers consommateurs listés dans la tâche.*
