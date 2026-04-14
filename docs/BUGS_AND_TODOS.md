# Kisakata.com — Bugs Connus & Tâches Restantes

> Mis à jour : 2026-04-14  
> Voir aussi : `docs/HARDCODED_AUDIT.md` pour la liste complète des valeurs codées en dur.

---

## 🔴 P0 — Critiques (à corriger dès que possible)

### BUG-001 : Couleurs codées en dur — 50+ fichiers
**Fichiers concernés :** Hero.tsx, SectionCard.tsx, Mission.tsx, EcoleHero.tsx, etc.
**Problème :** Les hex `#0A1F15`, `#B59551`, `#F2EEDD`, `#1A3C2B` apparaissent encore directement dans le JSX au lieu des variables CSS.
**Impact :** Thème sombre/clair impossible, incohérence visuelle si le design system évolue.
**Solution :** Remplacer par `var(--foret-nocturne)`, `var(--or-ancestral)`, `var(--ivoire-ancien)`, etc.
**Priorité :** P0 — bloque tout refactoring de thème.

### BUG-002 : Signed URLs manquantes pour images éphémères
**Fichiers concernés :** `useMessages.ts`, Supabase Storage bucket `chat-attachments`
**Problème :** Les images éphémères sont stockées avec une URL publique permanente. N'importe qui avec l'URL peut contourner le mécanisme de vue unique.
**Solution :** Utiliser `supabase.storage.from('chat-attachments').createSignedUrl(path, 60)` au moment du fetch, TTL de 60 secondes. L'URL expirée empêche le rechargement après le countdown.
**Impact :** Sécurité de la fonctionnalité vue unique/double.

---

## 🟠 P1 — Importants (prochaine itération)

### BUG-003 : `untrack()` manquant avant `removeChannel()` dans useTyping
**Fichier :** `src/hooks/chat/useTyping.ts`
**Problème :** Le cleanup `supabase.removeChannel(channel)` sans `channel.untrack()` préalable peut laisser des presence records fantômes côté serveur.
**Solution :**
```typescript
return () => {
  channel.untrack().then(() => supabase.removeChannel(channel));
};
```

### BUG-004 : WelcomeModal utilise une clé localStorage hardcodée
**Fichier :** Composant `WelcomeModal` (ou équivalent)
**Problème :** La clé `"sakata_welcome_seen_v2"` n'est pas dans `STORAGE_KEYS`.
**Solution :** Ajouter `WELCOME_MODAL: "sakata-welcome-seen-v2"` dans `src/lib/constants/storage.ts` et l'importer.

### BUG-005 : Fetch profiles en N+1 dans useMessages
**Fichier :** `src/hooks/chat/useMessages.ts`
**Problème :** Chaque message déclenche potentiellement un fetch individuel du profil de l'envoyeur.
**Solution :** Grouper les `user_id` uniques et faire un seul `.in('id', userIds)` pour récupérer tous les profils d'un coup.

### BUG-006 : Erreur silencieuse sur `.subscribe()` sans handler d'erreur
**Fichiers :** `useMessages.ts`, `useConversations.ts`, `useTyping.ts`
**Problème :** Les appels `.subscribe()` n'ont pas de callback d'erreur — les déconnexions WebSocket passent inaperçues.
**Solution :**
```typescript
.subscribe((status, err) => {
  if (err) console.error("Realtime subscription error:", err);
});
```

### TODO-001 : Watermarking dynamique des images éphémères
**Contexte :** La détection de capture d'écran (blur/visibilitychange) est contournable.
**Solution envisagée :** Ajouter dynamiquement un watermark semi-transparent avec le nom/ID du destinataire via Canvas API avant d'afficher l'image.
**Complexité :** Moyenne — nécessite un `<canvas>` overlay généré côté client.

---

## 🟡 P2 — Améliorations (planifiées)

### TODO-002 : Tables Supabase non encore migrées vers DB_TABLES
**Problème :** Certains fichiers utilisent encore des strings littéraux pour les noms de tables.
**Fichiers à auditer :** `src/app/admin/`, `src/app/profil/`, `src/app/savoir/`, `src/app/forum/`
**Solution :** Remplacer tous les `.from("table_name")` par `.from(DB_TABLES.TABLE_NAME)`.

### TODO-003 : Pagination dans la liste de messages
**Fichier :** `src/hooks/chat/useMessages.ts`
**Problème :** Tous les messages d'une conversation sont chargés d'un coup — pas scalable.
**Solution :** Ajouter `.range(0, 49)` et un bouton "Charger plus" (infinite scroll vers le haut).

### TODO-004 : Indicateur "Message lu" (double tick)
**Contexte :** Actuellement les messages n'ont pas d'accusé de lecture visible.
**Solution :** Utiliser le champ `last_read_at` dans `chat_participants` et afficher un double tick sur les messages plus anciens que ce timestamp.

### TODO-005 : Notifications push (hors onglet)
**Contexte :** L'utilisateur ne reçoit pas de notification quand il est sur une autre page.
**Solution envisagée :** Service Worker + Web Push API ou Supabase Edge Function avec FCM.

### TODO-006 : Réactions aux messages (emoji)
**Contexte :** Feature demandée implicitement (enrichissement UX messagerie).
**Solution :** Table `chat_reactions(message_id, user_id, emoji)` + hover overlay sur `MessageBubble`.

---

## 🟢 P3 — Nice to have

### TODO-007 : Suppression de message (pour l'envoyeur)
**Règle de sécurité :** Jamais de suppression permanente automatique — toujours une action utilisateur explicite.
**Solution :** Soft delete : `deleted_at` timestamp + rendu "Message supprimé" dans `MessageBubble`.

### TODO-008 : Recherche dans les conversations
**Contexte :** Pas de moyen de retrouver un message ancien.
**Solution :** Full-text search Postgres sur `chat_messages.content` avec `to_tsvector`.

### TODO-009 : Mode groupe (conversations à 3+)
**Contexte :** Actuellement seules les conversations directes (2 personnes) sont bien supportées.
**Solution :** Utiliser `type = "group"` dans `chat_conversations` + affichage du nom du groupe.

### TODO-010 : Curriculum primaire (Phases 3-5 du ROADMAP.md)
**Contexte :** Le plan `docs/ROADMAP.md` prévoit 30 chapitres pour les primaires 1-6.
**Statut :** Phase 1 (données secondaires multi-viz) est planifiée mais non exécutée.

---

## 🔵 Infrastructure & DevOps

### TODO-011 : Variables d'environnement manquantes pour Pinecone
**Fichier :** `.env.local`
**Variables à ajouter :**
```
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX_NAME=sakata-mathematics
```
**Contexte :** Nécessaire pour Phase 4 du plan mathématiques (enrichissement sémantique).

### TODO-012 : Audit RLS (Row Level Security) sur les tables chat
**Contexte :** Les politiques RLS sur `chat_messages`, `chat_participants`, `chat_conversations` doivent être vérifiées pour s'assurer qu'un utilisateur ne peut lire que ses propres conversations.

### TODO-013 : Tests E2E sur les flux d'authentification
**Contexte :** Les flux `SIGNED_IN` / `SIGNED_OUT` / `TOKEN_REFRESHED` ne sont pas couverts par des tests automatisés.
**Solution :** Playwright avec des mocks Supabase.

---

## ✅ Récemment Résolus (pour mémoire)

| Fix | Date | Fichier |
|-----|------|---------|
| Infinite loading après navigation (useConversations subscription) | 2026-04 | `useConversations.ts` |
| Nom de conversation hardcodé ("Conversation"/"C") | 2026-04 | `ChatWindow.tsx` |
| Envoyeur bloqué sur sa propre image éphémère | 2026-04 | `MessageBubble.tsx` |
| Vidéos Hero apparaissant après chargement de page | 2026-04 | `Hero.tsx`, `EcoleHero.tsx`, etc. |
| Erreur TypeScript `as const` + `useState` sur TIMINGS | 2026-04 | `MessageBubble.tsx` |
| Session expirée silencieuse (multi-appareils) | 2026-04 | `AuthProvider.tsx` |
| Clés localStorage périmées entre déploiements | 2026-04 | `AuthProvider.tsx` + `business.ts` |
