# Forum Mboka 2.0 — Tâches Détaillées

> **Document compagnon :** [`forum-mboka-2.0-preparation.md`](./forum-mboka-2.0-preparation.md)
> **Statut global :** 🔄 En cours
> **Date démarrage :** 2026-04-27

---

## 📋 Vue d'ensemble — 5 sprints

| Sprint | Statut | Durée estimée |
|---|---|---|
| **Sprint 1** : DB + RLS + Triggers | 🔄 En cours | 1 semaine |
| **Sprint 2** : UI Threading | ⏳ Pending | 1 semaine |
| **Sprint 3** : Votes + Signalement | ⏳ Pending | 1 semaine |
| **Sprint 4** : Notifications | ⏳ Pending | 1 semaine |
| **Sprint 5** : GIF + Emoji + Polish | ⏳ Pending | 1 semaine |

---

## 🗄️ Sprint 1 — DB Foundation

### S1.1 — Modifier la table `forum_posts`

```sql
ALTER TABLE forum_posts
  ADD COLUMN IF NOT EXISTS parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS reply_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS like_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS dislike_count INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS depth INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;
```

### S1.2 — Index de performance

```sql
CREATE INDEX IF NOT EXISTS idx_forum_posts_parent
  ON forum_posts(parent_post_id) WHERE parent_post_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_forum_posts_thread_depth
  ON forum_posts(thread_id, depth, created_at);

CREATE INDEX IF NOT EXISTS idx_forum_posts_score
  ON forum_posts(thread_id, ((like_count - dislike_count)) DESC, created_at);
```

### S1.3 — Créer `forum_post_votes`

```sql
CREATE TABLE IF NOT EXISTS forum_post_votes (
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_forum_votes_user
  ON forum_post_votes(user_id, created_at DESC);
```

### S1.4 — Créer `forum_notifications`

```sql
CREATE TABLE IF NOT EXISTS forum_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reply', 'mention', 'thread_reply')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forum_notif_recipient_unread
  ON forum_notifications(recipient_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_forum_notif_recipient_all
  ON forum_notifications(recipient_id, created_at DESC);
```

### S1.5 — Créer `moderation_reports`

```sql
CREATE TABLE IF NOT EXISTS moderation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN (
    'off_topic', 'insult_hate', 'spam', 'misinformation', 'other'
  )),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'reviewed', 'actioned', 'dismissed'
  )),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_reports_pending
  ON moderation_reports(status, created_at DESC) WHERE status = 'pending';
```

### S1.6 — Triggers pour les compteurs

```sql
-- Maintenance des compteurs like/dislike
CREATE OR REPLACE FUNCTION fn_recalc_post_votes()
RETURNS TRIGGER AS $$
DECLARE
  target_post_id UUID;
BEGIN
  target_post_id := COALESCE(NEW.post_id, OLD.post_id);

  UPDATE forum_posts
  SET
    like_count = (
      SELECT COUNT(*) FROM forum_post_votes
      WHERE post_id = target_post_id AND vote = 1
    ),
    dislike_count = (
      SELECT COUNT(*) FROM forum_post_votes
      WHERE post_id = target_post_id AND vote = -1
    )
  WHERE id = target_post_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forum_post_votes
AFTER INSERT OR UPDATE OR DELETE ON forum_post_votes
FOR EACH ROW EXECUTE FUNCTION fn_recalc_post_votes();

-- Maintenance reply_count + notification de réponse
CREATE OR REPLACE FUNCTION fn_handle_post_insert()
RETURNS TRIGGER AS $$
DECLARE
  parent_author_id UUID;
  parent_thread_id UUID;
BEGIN
  IF NEW.parent_post_id IS NOT NULL THEN
    -- Incrémenter reply_count parent
    UPDATE forum_posts
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_post_id;

    -- Récupérer auteur du parent + thread
    SELECT author_id, thread_id INTO parent_author_id, parent_thread_id
    FROM forum_posts WHERE id = NEW.parent_post_id;

    -- Créer notification (si auteur différent et auteur parent existe)
    IF parent_author_id IS NOT NULL AND parent_author_id != NEW.author_id THEN
      INSERT INTO forum_notifications (recipient_id, actor_id, thread_id, post_id, type)
      VALUES (parent_author_id, NEW.author_id, parent_thread_id, NEW.id, 'reply');
    END IF;

    -- Calculer depth automatiquement (parent.depth + 1, capped à 3)
    UPDATE forum_posts
    SET depth = LEAST(
      (SELECT depth FROM forum_posts WHERE id = NEW.parent_post_id) + 1,
      3
    )
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_forum_post_insert
AFTER INSERT ON forum_posts
FOR EACH ROW EXECUTE FUNCTION fn_handle_post_insert();
```

### S1.7 — RLS policies

```sql
-- forum_post_votes
ALTER TABLE forum_post_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes_read_aggregate"
  ON forum_post_votes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "votes_insert_self"
  ON forum_post_votes FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "votes_update_self"
  ON forum_post_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "votes_delete_self"
  ON forum_post_votes FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- forum_notifications
ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notif_read_self"
  ON forum_notifications FOR SELECT
  TO authenticated USING (recipient_id = auth.uid());

CREATE POLICY "notif_update_self"
  ON forum_notifications FOR UPDATE
  TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- INSERT uniquement par triggers (service_role bypasse RLS)

-- moderation_reports
ALTER TABLE moderation_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_insert_self"
  ON moderation_reports FOR INSERT
  TO authenticated WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "reports_read_admin"
  ON moderation_reports FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "reports_update_admin"
  ON moderation_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
```

### S1.8 — Activer Realtime

```sql
ALTER PUBLICATION supabase_realtime
  ADD TABLE forum_post_votes, forum_notifications;
-- forum_posts est probablement déjà inclus
```

---

## 🎨 Sprint 2 — UI Threading

### S2.1 — Composant `PostNode.tsx` (NEW)

**Path :** `src/components/forum/PostNode.tsx`

Affiche un post avec récursion sur ses replies (jusqu'à depth 2).

**Props :**
- `post: PostWithReplies`
- `depth: number` (0-2)
- `onReply: (parentId: string) => void`
- `currentUserId?: string`

**Comportement :**
- Avatar + nickname + role badge
- Contenu Markdown rendu
- Actions : Like, Dislike, Reply, Report, Edit (si owner ≤ 5min), Delete (si owner ≤ 10min)
- Indentation visuelle selon depth
- Si depth ≥ 3 et a des replies : remplacer par "Voir N réponses"

### S2.2 — Composant `ReplyComposer.tsx` (NEW)

**Path :** `src/components/forum/ReplyComposer.tsx`

**Props :**
- `threadId: string`
- `parentPostId?: string` (null = top-level)
- `onSubmit: () => void`
- `onCancel: () => void`

**Features :**
- MarkdownEditor compact (3 lignes default)
- Boutons inline : 😀 Emoji, 🎬 GIF
- Mention auto-détection (regex `@\w+`)
- Bouton Annuler + Publier

### S2.3 — Composant `VoteButton.tsx` (NEW)

**Path :** `src/components/forum/VoteButton.tsx`

**Props :**
- `postId: string`
- `currentVote: 1 | -1 | null`
- `count: number`
- `type: "like" | "dislike"`
- `private?: boolean` (pour dislike de l'auteur uniquement)

**Animation :** Scale 1 → 1.4 → 1 au clic, fill animation.

### S2.4 — Composant `ReportModal.tsx` (NEW)

**Path :** `src/components/forum/ReportModal.tsx`

Modal avec :
- 5 catégories (radio buttons)
- Champ description optionnel
- Bouton "Signaler"

### S2.5 — Refactor `ThreadRepliesClient.tsx`

- Charger récursivement la structure d'arbre.
- Trier `ORDER BY (like_count - dislike_count) DESC, created_at ASC`.
- Construire un dictionnaire `parent_id → posts[]`.
- Rendre récursivement avec `PostNode`.
- Subscriptions multiples : posts + votes + notifications.

---

## ⚖️ Sprint 3 — Votes + Signalement

### S3.1 — API Route POST `/api/forum/vote`

```typescript
// POST { postId, vote: 1 | -1 | 0 }
// 0 = remove vote
```

Logique :
- Auth requise.
- Si vote = 0 : DELETE.
- Sinon : UPSERT `forum_post_votes`.
- Triggers Postgres recalculent les compteurs.

### S3.2 — API Route POST `/api/forum/report`

```typescript
// POST { postId, category, description? }
```

Insert dans `moderation_reports`.

### S3.3 — Hook `useForumVotes.ts`

Retourne pour chaque post : `{ myVote, likeCount, dislikeCount, vote, unvote }`.

### S3.4 — Page admin de modération

`src/app/admin/forum-reports/page.tsx` — liste des signalements pending, action (approve/dismiss).

---

## 🔔 Sprint 4 — Notifications

### S4.1 — API Routes

- `GET /api/forum/notifications?limit=20` — liste paginée.
- `PATCH /api/forum/notifications/[id]` — mark as read.
- `PATCH /api/forum/notifications/read-all` — mark all read.

### S4.2 — Composant `NotificationBell.tsx` (NEW)

**Path :** `src/components/NotificationBell.tsx`

- Icône `Bell` lucide.
- Badge rouge si `unread > 0`.
- Dropdown au clic avec 10 dernières.
- Pulse animation au reçu d'une nouvelle notif.

### S4.3 — Hook `useNotifications.ts`

- Fetch initial + Realtime sur `forum_notifications` filtré par recipient.
- Expose `{ notifications, unreadCount, markRead, markAllRead }`.

### S4.4 — Intégration Navbar

Ajouter `<NotificationBell />` entre sélecteur langue et avatar profil.

### S4.5 — Page `/notifications`

Liste complète avec filtres (unread, all, par type).

### S4.6 — Email digest quotidien

- Cron Netlify scheduled function (8h Kinshasa = 7h UTC).
- Pour chaque user avec ≥ 1 notif unread des 24h : envoyer email récap via Resend.
- Template HTML aux couleurs Brume.

---

## 🎬 Sprint 5 — GIF + Emoji + Polish

### S5.1 — API Tenor

- Variable env `TENOR_API_KEY` à créer dans Google Cloud Console.
- Route `/api/tenor/search?q=...` qui proxy l'API (pour cacher la clé).
- Cache Cache-Control 1h.

### S5.2 — Composant `GifPicker.tsx` (NEW)

- Modale glassmorphism.
- Champ recherche débouncé 300ms.
- Trending par défaut.
- Grille masonry 3 col desktop, 2 mobile.
- Click → insère URL dans le composer.

### S5.3 — Composant `EmojiPicker.tsx` (NEW)

- Lib `@emoji-mart/react` + `@emoji-mart/data`.
- Thème custom Brume.
- Catégories visibles, recherche, tonalités.

### S5.4 — Polish design

- Animations Framer Motion sur entrées/sorties posts.
- Skeleton screens pendant chargement.
- Empty state illustré : "Mboka attend votre voix".
- Hover effects raffinés.
- Sound design discret (optionnel, paramètre user) : tic au like, ping notification.

### S5.5 — Mise à jour documentation

Mettre à jour `feature-forum-mboka.tsx` (admin docs) avec la nouvelle architecture.

---

## ✅ Définition de "Done"

Pour chaque sprint :

- [ ] Code review interne (relecture critique).
- [ ] Tests manuels (au moins 5 cas d'usage).
- [ ] Pas d'erreurs TypeScript.
- [ ] Pas de warnings ESLint.
- [ ] Build production passe.
- [ ] Documentation mise à jour.
- [ ] Commit + push avec message descriptif.

---

## 📊 Suivi de progression

Voir le commit log Git pour l'avancement réel. Chaque sprint = 1 commit majeur minimum.

---

*Dernière mise à jour : 2026-04-27 par exécution automatique du plan v1.*
