# 🛣️ Roadmap d'Audit & Fixes - Sakata.com

**Date:** 2026-04-10
**Status:** 🟠 IN PROGRESS
**Total Issues:** 23 (8 CRITIQUE, 5 CRITIQUE hydration, 5 HAUTE, 5 MOYENNE)

---

## 📋 Index Rapide

- [Phase 1: Sécurité (URGENT)](#phase-1-sécurité-urgent---1h)
- [Phase 2: Hydratation (CRITIQUE)](#phase-2-hydratation-critique---2h)
- [Phase 3: API Routes & Async (HAUTE)](#phase-3-api-routes--async-haute---3h)
- [Phase 4: Migrations Supabase (HAUTE)](#phase-4-migrations-supabase-haute---2h)
- [Phase 5: Tests & Déploiement](#phase-5-tests--déploiement)

---

## Phase 1: Sécurité (URGENT) — ~1h

### Issue #1: Cache Profil Partagé Entre Utilisateurs ⚠️ CRITIQUE
**Fichier:** `src/components/AuthProvider.tsx:23-25, 35-56`
**Sévérité:** CRITIQUE (escalade de privilèges)

**Problème:**
```typescript
let cachedProfile: { role: string; subscription_tier: string } | null = null;
let profileCacheTime = 0;
```
Variables au scope du module = partagées entre TOUS les utilisateurs simultanés.

**Solution:**
- [ ] Supprimer le cache de variable globale
- [ ] Utiliser `sessionStorage` isolé par utilisateur OU
- [ ] Utiliser `useCallback` avec état local

---

### Issue #2: Admin RLS Key Exposée Côté Client ⚠️ CRITIQUE
**Fichier:** `src/app/forum/thread/[thread_slug]/page.tsx`
**Sévérité:** CRITIQUE (accès DB complet sans restrictions)

**Problème:** `supabaseAdmin` (Service Role Key) importé côté client.

**Solution:**
- [ ] Retirer `import { supabaseAdmin }` du client
- [ ] Créer API route: `src/app/api/forum/threads/[id]/views/route.ts`
- [ ] Exécuter admin operations côté serveur uniquement
- [ ] Vérifier que TOUS les imports de `supabaseAdmin` sont serveur-side

---

### Issue #3: Données Utilisateur en LocalStorage ⚠️ CRITIQUE
**Fichier:** `src/app/ecole/hooks/useEcoleProgress.ts:25-31`
**Sévérité:** CRITIQUE (XSS vulnérable)

**Problème:**
```typescript
const rawValue = window.localStorage.getItem(STORAGE_KEY);
return { ...initialState, ...(JSON.parse(rawValue) as ProgressMap) };
```
Données lisibles et modifiables par JavaScript/XSS sans chiffrement.

**Solution:**
- [ ] Remplacer `localStorage` → `sessionStorage` (volatile)
- [ ] Ajouter try/catch autour de `JSON.parse()`
- [ ] Considérer: stocker sur Supabase avec authentification au lieu

---

### Issue #4: Utilisateurs Peuvent Modifier Leur Rôle ⚠️ CRITIQUE
**Fichier:** Migrations Supabase (RLS policy sur `profiles`)
**Sévérité:** CRITIQUE (escalade admin)

**Problème:**
```sql
CREATE POLICY "Users can update own profile"
  USING (auth.uid() = id);
-- Pas de restriction sur les colonnes UPDATE!
```

**Solution:**
- [ ] Créer migration: Ajouter `WITH CHECK` sur UPDATE
- [ ] Ou: Rendre `role` et `subscription_tier` immutables
- [ ] Ou: Créer trigger qui empêche l'UPDATE si la colonne est `role` ou `subscription_tier`

---

### Issue #5: JSON.parse() Sans Try/Catch ⚠️ HAUTE
**Fichier:** `src/app/ecole/hooks/useEcoleProgress.ts:31`
**Sévérité:** HAUTE (crash si localStorage corrompu)

**Solution:**
- [ ] Ajouter try/catch autour de `JSON.parse()`
- [ ] Fallback à `initialState` si erreur

---

### Issue #6: AbortSignal Inutile ⚠️ MOYENNE
**Fichier:** `src/components/AuthProvider.tsx:61-68`
**Sévérité:** MOYENNE (code mort)

**Problème:** Supabase SSR ne supporte pas `abortSignal`.

**Solution:**
- [ ] Supprimer les lignes avec `abortSignal`
- [ ] Supprimer `AbortController` si pas utilisé ailleurs

---

## Phase 2: Hydratation (CRITIQUE) — ~2h

### Issue #7: LoadingProvider Timeout 5s > 4s ⚠️ CRITIQUE
**Fichier:** `src/components/LoadingProvider.tsx:41, 70`
**Violation:** CLAUDE.md ligne 37 ("timeout de sécurité est de 4s")

**Solution:**
- [ ] Changer `5000` → `4000` (lignes 41 et 70)
- [ ] Tester que le loading disparaît en < 4s

---

### Issue #8: Pattern SPA au Lieu SSG (savoir/page.tsx) ⚠️ CRITIQUE
**Fichier:** `src/app/savoir/page.tsx`
**Sévérité:** CRITIQUE (SEO mauvaise, hydration mismatch)

**Problème:** Page client-side fetch au lieu de SSG. Articles invisibles aux crawlers.

**Solution:**
- [ ] Convertir en server component (retirer `"use client"`)
- [ ] Utiliser `const revalidate = 60` pour ISR
- [ ] Utiliser `supabasePublic` pour fetcher côté serveur
- [ ] Garder fallback `ARTICLES` constant

---

### Issue #9: Paywall Logic Côté Client ⚠️ CRITIQUE
**Fichier:** `src/app/savoir/[slug]/page.tsx:121-131`
**Sévérité:** CRITIQUE (contenu premium visible aux crawlers)

**Problème:** Logique paywall exécutée après hydratation basée sur `useAuth()`.

**Solution:**
- [ ] Créer server component parent qui fetche l'article + vérifie RLS
- [ ] Créer client component enfant pour le paywall interactif
- [ ] Ajouter RLS policy: `CREATE POLICY "Premium articles require subscription"`

---

### Issue #10: Index Comme Clé dans .map() ⚠️ MOYENNE
**Fichier:** `src/app/savoir/[slug]/page.tsx:210`
**Sévérité:** MOYENNE (hydration mismatch potentiel)

**Solution:**
- [ ] Remplacer `key={i}` → `key={char}-${i}` ou `key={`${char}-${i}`}`

---

### Issue #11: Parsing JSON Côté Client ⚠️ MOYENNE
**Fichier:** `src/app/forum/page.tsx:60-61`
**Sévérité:** MOYENNE (hydration mismatch)

**Solution:**
- [ ] Parser `cat.name` et `cat.description` côté serveur
- [ ] Envoyer objets pré-parsés au client

---

## Phase 3: API Routes & Async (HAUTE) — ~3h

### Issue #12: fetchProfile() Sans Await ⚠️ HAUTE
**Fichier:** `src/components/AuthProvider.tsx:91`
**Sévérité:** HAUTE (state `role: null` indéfini)

**Solution:**
- [ ] Ajouter `await` devant `fetchProfile()`
- [ ] Ou: utiliser `.then()` avec `setRole()`

---

### Issue #13: Race Conditions Async ⚠️ HAUTE
**Fichier:** `src/components/AuthProvider.tsx:83-103`
**Sévérité:** HAUTE (incohérence d'état)

**Solution:**
- [ ] Ajouter flag `isMounted` pour éviter les setState après unmount
- [ ] Utiliser `AbortController` si possible

---

### Issue #14: Session Middleware Bloquant ⚠️ MOYENNE
**Fichier:** `src/proxy.ts` (si existe)
**Sévérité:** MOYENNE (latence +100ms par requête)

**Solution:**
- [ ] Optimiser ou supprimer l'appel `getUser()` systématique
- [ ] Utiliser refresh token pattern

---

### Issue #15: Délais Artificiels ⚠️ MOYENNE
**Fichier:** `src/app/geographie/hooks/useCommunityPins.ts:76`
**Violation:** CLAUDE.md ("Ne pas introduire de délais artificiels")

**Solution:**
- [ ] Supprimer `await new Promise((resolve) => setTimeout(resolve, 500))`

---

### Issue #16: Pas de Try/Catch sur Promises ⚠️ MOYENNE
**Fichier:** `src/app/forum/thread/[thread_slug]/page.tsx`
**Sévérité:** MOYENNE (erreurs silencieuses)

**Solution:**
- [ ] Ajouter gestion d'erreur sur tous les `.then()` sans `.catch()`

---

## Phase 4: Migrations Supabase (HAUTE) — ~2h

### Issue #17: Colonnes `role` et `contributor_status` Manquantes ⚠️ HAUTE
**Fichier:** Migrations Supabase
**Sévérité:** HAUTE (authentification non fonctionnelle)

**Solution:**
- [ ] Créer migration Supabase:
```sql
ALTER TABLE profiles
ADD COLUMN role VARCHAR(50) DEFAULT 'user',
ADD COLUMN contributor_status VARCHAR(50) DEFAULT 'none';
```

---

### Issue #18: Pas de Trigger pour Créer les Profils ⚠️ HAUTE
**Fichier:** Migrations Supabase
**Sévérité:** HAUTE (utilisateurs orphelins)

**Solution:**
- [ ] Créer trigger:
```sql
CREATE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nickname, role, subscription_tier)
  VALUES (new.id, '', '', 'user', 'free');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### Issue #19: Pas de RLS pour Articles Premium ⚠️ HAUTE
**Fichier:** Migrations Supabase
**Sévérité:** HAUTE (articles premium lisibles par free users)

**Solution:**
- [ ] Créer migration:
```sql
CREATE POLICY "Premium articles require subscription" ON articles
  FOR SELECT USING (
    NOT is_premium OR
    auth.uid() IN (SELECT id FROM profiles WHERE subscription_tier IN ('premium', 'elite'))
  );
```

---

### Issue #20: RLS Policy Trop Permissive sur UPDATE ⚠️ HAUTE
**Fichier:** Migrations Supabase
**Sévérité:** HAUTE (utilisateurs peuvent s'élever admin)

**Solution:**
- [ ] Créer migration pour restreindre UPDATE sur `role` et `subscription_tier`

---

### Issue #21: Absence de DELETE Policies ⚠️ MOYENNE
**Fichier:** Migrations Supabase
**Sévérité:** MOYENNE (soft-delete manquant)

**Solution:**
- [ ] Ajouter colonne `deleted_at` aux tables
- [ ] Créer soft-delete policies

---

## Phase 5: Architecture (RECOMMANDÉ) — ~4h

### Issue #22: Pas d'API Routes ⚠️ MOYENNE
**Fichier:** `src/app/api/`
**Sévérité:** MOYENNE (sécurité faible)

**Solution:**
- [ ] Créer `src/app/api/forum/threads/route.ts`
- [ ] Créer `src/app/api/articles/route.ts`
- [ ] Migrer les mutations côté client → API routes

---

### Issue #23: Cache Global Non Isolé ⚠️ MOYENNE
**Fichier:** `src/components/AuthProvider.tsx:23-25`
**Sévérité:** MOYENNE (testabilité mauvaise)

**Solution:**
- [ ] Utiliser React Query/SWR au lieu de variables globales
- [ ] Ou: sessionStorage par utilisateur

---

## ✅ Phase 5: Tests & Déploiement

### Tests à Effectuer:
- [ ] Build: `npm run build` (vérifier hydration warnings)
- [ ] Multi-user test: Deux sessions simultanées, vérifier cache ne s'interfère pas
- [ ] Paywall test: Free user ne peut pas accéder aux articles premium
- [ ] localStorage test: JSON corrompu n'écrase pas l'app
- [ ] SEO test: Articles visibles dans page source (pas de client-side fetch)
- [ ] RLS test: Requêtes sans auth échouent
- [ ] Sign-up test: Profil créé automatiquement après signup
- [ ] Loading test: LoadingScreen disparaît < 4s

### Commit & Push:
- [ ] `git add .` (ajouter tous les fichiers modifiés)
- [ ] `git commit -m "fix: address 23 critical security and hydration issues"`
- [ ] `git push origin claude/stoic-shockley`

---

## 📊 Progression

| Phase | Status | Issues | ETA |
|-------|--------|--------|-----|
| ✅ Phase 1: Sécurité | 🔴 TODO | 6 | ~1h |
| ✅ Phase 2: Hydratation | 🔴 TODO | 5 | ~2h |
| ✅ Phase 3: API Routes | 🔴 TODO | 5 | ~3h |
| ✅ Phase 4: Supabase | 🔴 TODO | 5 | ~2h |
| ✅ Phase 5: Architecture | 🔴 TODO | 2 | ~4h |
| 🧪 Tests & Deploy | 🔴 TODO | - | ~1h |
| **TOTAL** | **🔴 0%** | **23** | **~13h** |

---

## 🔗 Fichiers Modifiés (à jour)

```
src/
├── components/
│   ├── AuthProvider.tsx          [Issue #1, #12-13]
│   └── LoadingProvider.tsx        [Issue #7]
├── lib/
│   ├── supabase.ts
│   └── supabase/
│       └── admin.ts              [Issue #2]
├── app/
│   ├── savoir/
│   │   ├── page.tsx              [Issue #8]
│   │   └── [slug]/page.tsx        [Issue #9-10]
│   ├── forum/
│   │   ├── page.tsx              [Issue #11]
│   │   └── thread/[thread_slug]/page.tsx [Issue #2]
│   ├── ecole/
│   │   └── hooks/
│   │       └── useEcoleProgress.ts [Issue #3, #5]
│   ├── geographie/
│   │   └── hooks/
│   │       └── useCommunityPins.ts [Issue #15]
│   ├── auth/
│   │   └── page.tsx              [Issue #7 validation]
│   └── api/                      [Issue #22 - À CRÉER]
│
└── migrations/ (Supabase)         [Issue #17-21]
```

---

## 🎯 Notes d'Implémentation

1. **Dépendances:** Aucune nouvelle dépendance requise (utiliser code existant)
2. **Breaking Changes:** Aucun (toutes les fixes sont backwards-compatible)
3. **Testing:** Exécuter après chaque phase
4. **Ordre:** Respecter l'ordre (sécurité → hydratation → async → DB)

---

**Dernière mise à jour:** 2026-04-10
**Audit par:** Claude Code Audit Agent
**Prochaines étapes:** Démarrer Phase 1
