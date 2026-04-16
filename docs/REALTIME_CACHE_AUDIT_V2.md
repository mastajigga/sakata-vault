# Audit Realtime & Cache — V2 (2026-04-16)

Cet audit couvre tous les hooks, composants et routes API ajoutés ou modifiés
lors du cycle de développement v2.3.0. Il complète `CACHE_SUPABASE_AUDIT.md`
(v2.2.0) qui traitait les 15 problèmes du cycle précédent.

---

## Légende

| Symbole | Signification |
|---------|---------------|
| 🔴 P1 | Sécurité / crash visible |
| 🟠 P2 | Déconnexion silencieuse / boucle infinie |
| 🟡 P3 | Dégradation silencieuse / fuite mémoire |
| ✅ | Corrigé dans ce cycle |

---

## Bugs identifiés et corrigés

### 🔴 BUG-14 — Injection LIKE via paramètre `lang` non validé
**Fichier :** `src/app/api/articles/search/route.ts`  
**Sévérité :** P1 — Sécurité  
**Statut :** ✅ Corrigé

`lang` et `q` étaient interpolés directement dans la chaîne `.or()` de Supabase
sans validation ni échappement. Un attaquant pouvait injecter `lang=fr.ilike.x%,title->>fr.ilike.%`
pour extraire des données non prévues.

**Correction :**
- Whitelist stricte `ALLOWED_LANGS = ['fr', 'en', 'ln', 'sw', 'ts']`
- Fonction `escapeLike()` qui neutralise `%`, `_`, `\` dans `q`
- Longueur max 100 caractères sur `q`
- Le paramètre retourné dans la réponse JSON est `rawQ` (original), pas la version échappée

---

### 🟠 BUG-01 — Client Supabase recréé à chaque render dans `GameMode`
**Fichier :** `src/components/ecole/GameMode.tsx`  
**Sévérité :** P2 — Memory leak WebSocket  
**Statut :** ✅ Corrigé

`createBrowserClient(...)` était appelé dans le corps du composant (hors hook).
Chaque changement de `score` ou `questionState` créait un nouveau client et une
nouvelle connexion WebSocket sans jamais fermer l'ancienne.

**Correction :** Import du singleton `supabase` depuis `@/lib/supabase`.

---

### 🟠 BUG-02 — `useEcoleProgress` : `.subscribe()` sans handler `CHANNEL_ERROR`
**Fichier :** `src/app/ecole/hooks/useEcoleProgress.ts`  
**Sévérité :** P2 — Déconnexion silencieuse  
**Statut :** ✅ Corrigé

La subscription Realtime ne gérait pas les erreurs WebSocket. En cas de coupure
réseau, `syncStatus` restait sur `"cloud"` alors que le channel était mort.

**Correction :** Handler `(status, err) => { if (CHANNEL_ERROR || err) setSyncStatus("local") }`

---

### 🟠 BUG-03 — `useEcoleProgress` : `programs` dans dep array → re-subscribe loop
**Fichier :** `src/app/ecole/hooks/useEcoleProgress.ts`  
**Sévérité :** P2 — Re-subscribe loop  
**Statut :** ✅ Corrigé

`programs` (tableau d'objets passé en prop) était dans le dep array du `useEffect`
de subscription. `MathCurriculumStudio` ne mémoïsait pas ce tableau, donc chaque
render du parent créait une nouvelle référence → disconnect + re-subscribe + flash
`"syncing"` à chaque interaction.

**Correction :** `programsRef` mis à jour via un effet séparé; la subscription
lit `programsRef.current` et ne dépend que de `[namespace, user]`.

---

### 🟠 BUG-04 — `useEcoleProgress` : `recordAttempt` sans `withRetry`
**Fichier :** `src/app/ecole/hooks/useEcoleProgress.ts`  
**Sévérité :** P2 — Données perdues silencieusement  
**Statut :** ✅ Corrigé

Le `.insert()` sur `ecole_attempts` n'utilisait pas `withRetry`. Un timeout réseau
faisait silencieusement disparaître la tentative de l'historique pédagogique.

**Correction :** `withRetry(async () => await supabase.from('ecole_attempts').insert(...))`

---

### 🟠 BUG-05 — `ChatWindow` : channel réactions recréé à chaque message reçu
**Fichier :** `src/components/chat/ChatWindow.tsx`  
**Sévérité :** P2 — Channel leak / flash reconnexion  
**Statut :** ✅ Corrigé

Le `useEffect` de subscription réactions avait `messages` dans ses deps. À chaque
nouveau message entrant, l'ancien channel était détruit et un nouveau créé —
disconnect/reconnect WebSocket inutile sur chaque message.

**Correction :** Deux `useEffect` séparés :
- Fetch initial des réactions : dépend de `[conversationId, user, messages]`
- Subscription realtime : dépend uniquement de `[conversationId, user]`

---

### 🟠 BUG-07 — `useTyping` : `room.subscribe()` sans handler d'erreur
**Fichier :** `src/hooks/chat/useTyping.ts`  
**Sévérité :** P2 — Déconnexion silencieuse  
**Statut :** ✅ Corrigé

La subscription Presence `room.subscribe()` n'avait pas de handler. En cas d'erreur
WebSocket, l'indicateur de frappe cessait de fonctionner sans aucun log.

**Correction :** `room.subscribe((status, err) => { if (CHANNEL_ERROR || err) console.error(...) })`

---

### 🟠 BUG-08 — `useTyping` : race condition unmount dans `initPresence`
**Fichier :** `src/hooks/chat/useTyping.ts`  
**Sévérité :** P2 — Ref stale après démontage  
**Statut :** ✅ Corrigé

Si le composant était démonté pendant le `await supabase.from('profiles')...` de
`initPresence`, la création du channel Supabase se poursuivait malgré tout et
pouvait écrire dans `channelRef.current` après que le cleanup avait rendu ce ref
obsolète.

**Correction :** Guard `if (!isMounted) return` ajouté avant `supabase.channel(...)`.

---

### 🟠 BUG-09 — `contributeur/page.tsx` : stale closure sur `user.id`
**Fichier :** `src/app/contributeur/page.tsx`  
**Sévérité :** P2 — Stale closure  
**Statut :** ✅ Corrigé

`fetchContributorData` capturait `user` via fermeture. En cas de refresh de session
JWT pendant le fetch, la requête Supabase utilisait l'ancien `user.id`.

**Correction :** `fetchContributorData(userId: string)` reçoit maintenant l'ID
explicitement; dep array du `useEffect` = `[user?.id, isLoading]`.

---

### 🟠 BUG-12 — `CoursePage` : `fetchEnrichment` → boucle dep sur `enrichments`
**Fichier :** `src/app/ecole/secondaire/1ere-secondaire/cours/CoursePage.tsx`  
**Sévérité :** P2 — Boucle de re-render / double fetch  
**Statut :** ✅ Corrigé

`useCallback(fetchEnrichment, [enrichments])` + `useEffect([fetchEnrichment])`
formait une boucle : chaque `setEnrichments()` invalidait `fetchEnrichment`,
qui re-déclenchait l'`useEffect`, qui re-appelait `fetchEnrichment`.

**Correction :** `fetchingRef = useRef<Set<string>>(new Set())` comme guard
in-flight; `fetchEnrichment` a maintenant un dep array vide `[]`.

---

### 🟡 BUG-06 — `ChatWindow` : subscription réactions sans filtre de conversation
**Fichier :** `src/components/chat/ChatWindow.tsx`  
**Sévérité :** P3 — Fetch inutile sur réactions d'autres conversations  
**Statut :** ✅ Corrigé

La subscription Realtime `chat_reactions` n'avait pas de filtre et réagissait à
**toutes** les réactions de tous les utilisateurs, déclenchant un `fetchReactions()`
inutile pour chaque réaction d'une autre conversation.

**Correction :** Guard dans le handler :
```ts
(payload) => {
  const msgId = payload.new?.message_id || payload.old?.message_id;
  if (msgId && messageIds.includes(msgId)) fetchReactions();
}
```

---

### 🟡 BUG-10 — `contributeur/page.tsx` : fetches sans `withRetry`
**Fichier :** `src/app/contributeur/page.tsx`  
**Sévérité :** P3 — Stats à zéro silencieusement après timeout  
**Statut :** ✅ Corrigé

Les quatre requêtes Supabase (profil, articles, analytics, likes) n'utilisaient
pas `withRetry`. Un timeout transitoire laissait la page avec des stats vides.

**Correction :** Tous les fetches wrappés avec `withRetry(async () => ...)`.

---

### 🟡 BUG-11 — `membres/page.tsx` : fetch sans `withRetry` ni gestion d'erreur
**Fichier :** `src/app/membres/page.tsx`  
**Sévérité :** P3 — Page vide silencieuse  
**Statut :** ✅ Corrigé

`setLoading(false)` était appelé même en cas d'erreur Supabase, et l'erreur était
ignorée — page vide sans indication à l'utilisateur.

**Correction :** `withRetry` + `const { data, error }` + log erreur + `finally { setLoading(false) }`.

---

### 🟡 BUG-13 — `api/push/unsubscribe` : erreur DB ignorée → success fantôme
**Fichier :** `src/app/api/push/unsubscribe/route.ts`  
**Sévérité :** P3 — Désabonnement échoué invisible côté client  
**Statut :** ✅ Corrigé

La route répondait toujours `{ success: true }` même si le `DELETE` Supabase
échouait (RLS, réseau). L'entrée persistait en base et l'utilisateur continuait
à recevoir des notifications indésirées.

**Correction :** `const { error } = await supabase.from(...).delete()...` + retour 500 si erreur.

---

### 🟡 BUG-15 — `ChatWindow` : `URL.createObjectURL` non révoquée
**Fichier :** `src/components/chat/ChatWindow.tsx`  
**Sévérité :** P3 — Memory leak lors des exports de conversation  
**Statut :** ✅ Corrigé

L'URL d'objet créée pour l'export .txt n'était jamais révoquée, allouant de la
mémoire indéfiniment si l'utilisateur exportait souvent.

**Correction :** `setTimeout(() => URL.revokeObjectURL(url), 100)` après le click.

---

## Patterns corrects à conserver (référence)

Les éléments suivants **ne doivent pas être modifiés** — ils constituent la
référence d'implémentation correcte pour le projet :

| Pattern | Fichier | Description |
|---------|---------|-------------|
| Anti-boucle subscription | `useConversations.ts` | `isFetchingRef` + `fetchConversations(false)` dans callbacks realtime |
| Stale closure userId | `useMessages.ts` | `userIdRef.current` mis à jour via `onAuthStateChange` |
| Handler erreur WebSocket | `useMessages.ts` | `.subscribe((status, err) => { if (CHANNEL_ERROR) ... })` |
| Cleanup `removeChannel` | `useMessages.ts` | `return () => supabase.removeChannel(channel)` dans useEffect |
| Whitelist localStorage | `AuthProvider.tsx` | `SAKATA_KEY_WHITELIST` + purge cyclique `sakata-msg-viewed-*` > 100 |
| Singleton client | `GameMode.tsx` | `import { supabase } from "@/lib/supabase"` (après correction) |
| Cleanup export download | `ChatInput.tsx` | `clearInterval` + `URL.revokeObjectURL` + `pause()` au unmount |
| Guard envoyeur image | `MessageBubble.tsx` | `isMe` vérifié avant `viewState = "locked"` |

---

## Règles émergentes pour le futur

À chaque nouveau hook ou composant utilisant Supabase Realtime, vérifier :

```
□ .subscribe((status, err) => { if (CHANNEL_ERROR || err) ... }) ?
□ removeChannel dans le cleanup du useEffect ?
□ Objets/tableaux passés en prop absents du dep array de subscription ?
□ Guard isMounted avant création du channel (si async) ?
□ withRetry() sur tous les .insert() / .upsert() / .update() ?
□ Pas de createBrowserClient() dans le corps d'un composant (utiliser singleton) ?
□ Subscription filtrée pour ne réagir qu'aux données pertinentes ?
□ URL.createObjectURL révoquée après usage ?
```

Pour les routes API :
```
□ Paramètres URL validés contre une whitelist avant interpolation ?
□ Valeurs injectées dans .or() / .filter() échappées ?
□ Erreurs Supabase propagées (status 500) au lieu d'être silencieuses ?
```

---

*Généré le 2026-04-16 — Version 2.3.0*
