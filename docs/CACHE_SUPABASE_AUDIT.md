# AUDIT — Cache Navigateur & Accès Supabase
## Kisakata.com · Dernière mise à jour : 2026-04-15

---

## RÉSUMÉ EXÉCUTIF

Ce document répertorie tous les problèmes identifiés liés au cache navigateur, localStorage,
sessionStorage, synchronisation cross-tab, et retry logic Supabase. Les problèmes sont classés
P1 (bloquant) → P4 (cosmétique).

---

## PROBLÈMES P1 — CRITIQUES (bloquent l'accès à Supabase)

### P1-A · MISMATCH PRÉFIXE `msgViewedKey` ← **BUG DÉCOUVERT**
**Fichier:** `src/lib/constants/storage.ts` + `src/components/AuthProvider.tsx`
**Statut:** ✅ CORRIGÉ dans ce patch

**Cause:** La fonction `msgViewedKey(id)` retourne `"msg-viewed-{id}"` (sans préfixe `sakata-`).
Mais `AuthProvider.tsx` recherche les clés `"sakata-msg-viewed-*"` pour les purger.
Résultat : ces clés **ne sont jamais purgées** → accumulation infinie → `QuotaExceededError`
silencieux → localStorage tombe en panne → TOUT le stockage auth/profil échoue.

**Fix appliqué:**
- `msgViewedKey` → retourne `"sakata-msg-viewed-{id}"`
- Whitelist explicite dans AuthProvider couvre `"sakata-msg-viewed-*"`

---

### P1-B · `WELCOME_SEEN` avec underscore = jamais invalidé
**Fichier:** `src/lib/constants/storage.ts`
**Statut:** ✅ CORRIGÉ dans ce patch

**Cause:** `STORAGE_KEYS.WELCOME_SEEN = "sakata_welcome_seen_v2"` utilise un underscore `_`
alors que le filtre de version bump cherche `key.startsWith("sakata-")` (tiret `-`).
Cette clé **survit à tous les changements de version** et peut afficher un vieux state.

**Fix appliqué:**
- Renommé `"sakata_welcome_seen_v2"` → `"sakata-welcome-seen-v2"`
- Whitelist explicite dans AuthProvider inclut cette clé

---

### P1-C · Cross-tab sync fragile sur préfixe `"sb-"` hardcodé
**Fichier:** `src/components/AuthProvider.tsx` (lignes 206-235)
**Statut:** ✅ CORRIGÉ dans ce patch

**Cause:** Le `storage` event listener filtre uniquement les clés commençant par `"sb-"`.
Ce préfixe est interne à Supabase et peut changer lors d'une migration de version.
De plus, `supabase.auth.onAuthStateChange()` gère déjà nativement la synchro cross-tab →
le listener est redondant ET fragile.

**Symptôme:** Un onglet reste connecté alors que l'utilisateur s'est déconnecté dans un autre.

**Fix appliqué:**
- Suppression du listener `storage` event manuel
- `onAuthStateChange` gère seul la synchro (built-in multi-tab support)
- Ajout d'un `INITIAL_SESSION` event handler pour couvrir la synchro d'initialisation

---

### P1-D · Absence de retry logic sur les appels Supabase critiques
**Fichier:** `src/hooks/chat/useMessages.ts`, `src/components/AuthProvider.tsx`
**Statut:** ✅ CORRIGÉ dans ce patch

**Cause:** Tous les appels `supabase.from().select()`, `.insert()`, et `.rpc()` échouent
silencieusement en cas de timeout réseau (mobile, connexion instable). L'utilisateur voit
un écran vide ou perd un message sans avertissement.

**Fix appliqué:**
- Utilitaire `withRetry(fn, maxRetries=3)` dans `src/lib/supabase-retry.ts`
- Backoff exponentiel : 300ms → 900ms → 2700ms
- Appliqué sur `fetchMessages()`, `fetchProfile()`, `sendMessage()`
- `cleanup_expired_messages` RPC non-retried (non-critique)

---

## PROBLÈMES P2 — IMPORTANTS (dégradent l'expérience)

### P2-A · Session ID en `sessionStorage` → cross-tab fail
**Fichier:** `src/components/AnalyticsProvider.tsx`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- `sessionStorage` → `localStorage` pour SESSION_ID (cross-tab partagé)
- Clé normalisée `"sakata-session-id"` (couverte par version-bump)
- Utilisateur connecté → `sessionId = "user-{user.id}"` (stable cross-device)

---

### P2-B · Token rotation sans retry — messages peuvent être perdus
**Fichier:** `src/components/AuthProvider.tsx`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- `tokenRefreshPending` flag exposé dans le contexte Auth
- Mis à `false` dès que `TOKEN_REFRESHED` est reçu
- Couplé avec `withRetry()` sur les mutations → les 401 temporaires sont absorbés

---

### P2-C · Progression école en `sessionStorage` → perte au fermeture
**Fichier:** `src/app/ecole/hooks/useEcoleProgress.ts`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- `sessionStorage` → `localStorage` (survit à la fermeture d'onglet)
- Clé préfixée `"sakata-ecole-progress-{namespace}"` via `ecoleProgressKey()`
- Ajout de `withRetry()` sur l'upsert Supabase (progression jamais silencieusement perdue)

---

### P2-D · `useEffect` dans `useMessages.ts` — deps manquantes
**Fichier:** `src/hooks/chat/useMessages.ts`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- `userIdRef` (useRef) toujours à jour → callbacks realtime ne capturent jamais un stale userId
- `setCurrentUserId` state déclenche le re-subscribe si l'userId change
- `useEffect` dépend de `[conversationId, currentUserId]`
- `markAsRead()` utilise `userIdRef.current` (jamais le closure stale)

---

## PROBLÈMES P3-P4 — MINEURS

### P3-A · Analytics cross-device non-unifiées
**Fichier:** `src/components/AnalyticsProvider.tsx`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- Utilisateur connecté → `sessionId = "user-{user.id}"` (stable cross-device, cross-tab)
- Visiteur anonyme → UUID en `localStorage` (cross-tab, survit à la navigation)

---

### P4-A · `WelcomeModal` — clé hardcodée avec underscore
**Fichier:** `src/components/WelcomeModal.tsx`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- `"sakata_welcome_seen_v2"` (hardcodé, underscore) → `STORAGE_KEYS.WELCOME_SEEN`
- Désormais correctement invalidée lors d'un version bump

---

### P4-B · `QuotaExceededError` — monitoring absent
**Fichier:** `src/components/AuthProvider.tsx`
**Statut:** ✅ CORRIGÉ 2026-04-15

**Fix appliqué:**
- Estimateur de taille total (clés + valeurs × 2 bytes UTF-16) au démarrage
- `console.warn` si > 4MB (~80% du quota de 5MB)
- Purge correcte des clés msg-viewed (P1-A) réduit significativement le risque

---

## CHANGELOG DES FIXES APPLIQUÉS

| Date | Fix | Fichiers touchés |
|------|-----|-----------------|
| 2026-04-15 | P1-A : Correction préfixe msgViewedKey `msg-viewed-*` → `sakata-msg-viewed-*` | `storage.ts`, `AuthProvider.tsx` |
| 2026-04-15 | P1-B : Correction WELCOME_SEEN underscore → tiret | `storage.ts` |
| 2026-04-15 | P1-C : Suppression listener `storage "sb-*"` fragile | `AuthProvider.tsx` |
| 2026-04-15 | P1-D : Retry logic Supabase `withRetry()` backoff expo | `supabase-retry.ts`, `useMessages.ts`, `AuthProvider.tsx` |
| 2026-04-15 | P2-A : SESSION_ID `sessionStorage` → `localStorage` | `storage.ts`, `AnalyticsProvider.tsx` |
| 2026-04-15 | P2-B : `tokenRefreshPending` exposé dans contexte Auth | `AuthProvider.tsx` |
| 2026-04-15 | P2-C : Progression école `sessionStorage` → `localStorage` + retry | `storage.ts`, `useEcoleProgress.ts` |
| 2026-04-15 | P2-D : Stale closure userId corrigé via `useRef` + re-subscribe | `useMessages.ts` |
| 2026-04-15 | P3-A : Analytics cross-device unifiées (`user-{id}` pour connectés) | `AnalyticsProvider.tsx` |
| 2026-04-15 | P4-A : WelcomeModal clé hardcodée → `STORAGE_KEYS.WELCOME_SEEN` | `WelcomeModal.tsx` |
| 2026-04-15 | P4-B : Monitoring quota localStorage (warn à 4MB) | `AuthProvider.tsx` |
| 2026-04-15 | APP_VERSION : `2.1.0` → `2.2.0` | `business.ts` |

---

## RÈGLES À RESPECTER (éviter les régressions)

1. **Toute nouvelle clé localStorage DOIT commencer par `"sakata-"` (tiret, pas underscore)**
2. **Toute nouvelle clé doit être déclarée dans `src/lib/constants/storage.ts`**
3. **Ne jamais stocker une progression non-sync en `sessionStorage`**
4. **Toute mutation Supabase critique DOIT utiliser `withRetry()`**
5. **Ne jamais hardcoder des préfixes de clés Supabase internes (`"sb-"`, etc.)**
6. **Bumper `APP_VERSION` dans `business.ts` à chaque déploiement majeur**
