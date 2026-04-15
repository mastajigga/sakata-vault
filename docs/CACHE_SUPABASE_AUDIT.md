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
**Statut:** 🔄 À CORRIGER (Phase 2)

**Cause:** `sessionStorage` est per-tab. Deux onglets = deux sessions analytics distinctes
pour le même utilisateur. Métriques d'engagement artificiellement doublées.

**Fix prévu:** Basculer vers `localStorage` avec le préfixe `sakata-session-id`.

---

### P2-B · Token rotation sans retry — messages peuvent être perdus
**Fichier:** `src/components/AuthProvider.tsx`
**Statut:** 🔄 À CORRIGER (Phase 2)

**Cause:** Quand le JWT expire, Supabase émet `TOKEN_REFRESHED` après 30-60s. Entre
l'expiration et l'émission, tous les appels `.insert()` reçoivent un 401 silencieux.
Un message envoyé dans cette fenêtre est perdu sans notification.

**Fix prévu:**
- Intercepteur global qui re-essaie automatiquement les 401 après `TOKEN_REFRESHED`
- Toast d'avertissement si retry échoue après 3 tentatives

---

### P2-C · Progression école en `sessionStorage` → perte au fermeture
**Fichier:** `src/app/ecole/hooks/useEcoleProgress.ts`
**Statut:** 🔄 À CORRIGER (Phase 2)

**Cause:** La progression locale des exercices est en `sessionStorage`. Fermeture d'onglet
avant sync Supabase = progression perdue définitivement.

**Fix prévu:** Basculer vers `localStorage` avec versioning APP_VERSION.

---

### P2-D · `useEffect` dans `useMessages.ts` — deps manquantes
**Fichier:** `src/hooks/chat/useMessages.ts`
**Statut:** 🔄 À CORRIGER (Phase 2)

**Cause:** Si `userId` change (logout/login) dans la même page, le closure de l'effet
garde le vieux `userId` en mémoire. `isMe` calculé incorrectement pendant quelques ms.

**Fix prévu:** Inclure `userId` dans les dépendances du `useEffect` + re-subscribe.

---

## PROBLÈMES P3-P4 — MINEURS

### P3-A · Analytics cross-device non-unifiées
**Fichier:** `src/components/AnalyticsProvider.tsx`
**Statut:** 📋 Backlog

**Cause:** Pas de lien entre `SESSION_ID` localStorage et l'`user.id` Supabase pour
les utilisateurs connectés. Analytics fragmentées par device.

---

### P4-A · `WelcomeModal` — hydration mismatch potentiel
**Fichier:** `src/components/WelcomeModal.tsx`
**Statut:** 📋 Backlog

**Cause:** `localStorage.getItem()` dans `useEffect` avant que `mounted=true` est stable.
Rare en pratique (uniquement sur navigateurs lents avec hydration SSR retardée).

---

### P4-B · `QuotaExceededError` — monitoring absent
**Fichier:** `src/components/AuthProvider.tsx`
**Statut:** 📋 Backlog

**Cause:** Pas d'alerte si localStorage approche du quota (5-10 MB selon navigateur).
Corrigé partiellement par P1-A (purge correcte des clés msg-viewed).

---

## CHANGELOG DES FIXES APPLIQUÉS

| Date | Fix | Fichiers touchés |
|------|-----|-----------------|
| 2026-04-15 | P1-A : Correction préfixe msgViewedKey | `storage.ts`, `AuthProvider.tsx` |
| 2026-04-15 | P1-B : Correction WELCOME_SEEN underscore | `storage.ts` |
| 2026-04-15 | P1-C : Suppression listener storage fragile | `AuthProvider.tsx` |
| 2026-04-15 | P1-D : Retry logic Supabase (3 tentatives) | `supabase-retry.ts`, `useMessages.ts`, `AuthProvider.tsx` |

---

## RÈGLES À RESPECTER (éviter les régressions)

1. **Toute nouvelle clé localStorage DOIT commencer par `"sakata-"` (tiret, pas underscore)**
2. **Toute nouvelle clé doit être déclarée dans `src/lib/constants/storage.ts`**
3. **Ne jamais stocker une progression non-sync en `sessionStorage`**
4. **Toute mutation Supabase critique DOIT utiliser `withRetry()`**
5. **Ne jamais hardcoder des préfixes de clés Supabase internes (`"sb-"`, etc.)**
6. **Bumper `APP_VERSION` dans `business.ts` à chaque déploiement majeur**
