# Forum Mboka 2.0 — Document de Préparation

> **Statut :** ✅ Décisions verrouillées · prêt à exécuter
> **Date :** 2026-04-27
> **Auteur :** Direction Sakata
> **Document compagnon :** [`forum-mboka-2.0-tasks.md`](./forum-mboka-2.0-tasks.md)

---

## 🎯 Vision

Transformer Mboka, le forum de Sakata.com, en un lieu où :

- **Les conversations vivent** — réponses imbriquées au lieu d'un mur plat.
- **Le ton se mesure** — likes/dislikes signalent l'accord communautaire sans alimenter le pilonnage.
- **L'expression est riche** — emoji, GIFs sécurisés via Tenor, réactions micro.
- **L'attention se gagne** — notifications quand quelqu'un répond ou mentionne.
- **Le design honore la Brume** — pas un Reddit fade, mais un village numérique soigné.

---

## 📐 Schéma de données

### Modifications de `forum_posts`

```sql
ALTER TABLE forum_posts
  ADD COLUMN parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  ADD COLUMN reply_count INT NOT NULL DEFAULT 0,
  ADD COLUMN like_count INT NOT NULL DEFAULT 0,
  ADD COLUMN dislike_count INT NOT NULL DEFAULT 0,
  ADD COLUMN depth INT NOT NULL DEFAULT 0,
  ADD COLUMN deleted_at TIMESTAMPTZ,
  ADD COLUMN deleted_by UUID REFERENCES profiles(id),
  ADD COLUMN edited_at TIMESTAMPTZ;

CREATE INDEX idx_forum_posts_parent ON forum_posts(parent_post_id);
CREATE INDEX idx_forum_posts_thread_depth ON forum_posts(thread_id, depth, created_at);
CREATE INDEX idx_forum_posts_score ON forum_posts(thread_id, (like_count - dislike_count) DESC);
```

### Nouvelle table `forum_post_votes`

```sql
CREATE TABLE forum_post_votes (
  post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE INDEX idx_forum_votes_user ON forum_post_votes(user_id, created_at DESC);
```

### Nouvelle table `forum_notifications`

```sql
CREATE TABLE forum_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('reply', 'mention', 'thread_reply')),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_forum_notif_recipient_unread
  ON forum_notifications(recipient_id, created_at DESC)
  WHERE read_at IS NULL;
```

### Triggers Postgres

- `trg_forum_post_vote_insert` / `trg_forum_post_vote_delete` → recalcule `like_count` et `dislike_count` du post concerné.
- `trg_forum_post_reply_insert` → incrémente `reply_count` du parent + crée notification `reply` au parent.author si différent.
- `trg_forum_post_soft_delete` → décrémente reply_count parent.

---

## 🎨 Décisions verrouillées

### Q1 — Profondeur des réponses : **(b) 3 niveaux visibles**

- `depth=0` : message top-level
- `depth=1` : réponse directe
- `depth=2` : sous-réponse
- `depth=3+` : remplacés par bouton « Voir N réponses » expandable

Au-delà du dernier niveau visible, on affiche les réponses au même niveau que parent (collapse intelligent).

### Q2 — GIFs : **Tenor API**

- Endpoint utilisé : `https://tenor.googleapis.com/v2/search`
- Variable env : `TENOR_API_KEY` (à créer dans Google Cloud Console)
- Format stocké : URL de l'asset MP4 ou GIF (pas le fichier lui-même)
- Tag content rating : `medium` (pas de NSFW)

### Q3 — Notifications : **(b) In-app + email digest quotidien**

- **In-app v1 immédiat :** bell icon dans Navbar, badge avec compteur unread.
- **Email digest :** cron quotidien à 8h Kinshasa (envoyé via Resend, infra existante).
- Push PWA : reporté à l'arrivée de la roadmap PWA.

### Q4 — Visibilité des votes : **(a) Compteurs uniquement**

- Affichage : `12 ❤  ·  3 👎`
- Pas de liste « qui a voté » (préserve la culture du respect, anti-pression sociale).

### Q5 — Édition/suppression : **règles recommandées**

- **Auteur :** 5 min édition, 10 min suppression.
- **Admin/manager :** édition et suppression toujours possibles, audit-loggées.
- **Suppression = soft delete** :
  - Si supprimé par l'auteur → « [Message supprimé par l'auteur] »
  - Si supprimé par un modérateur → « [Message supprimé par un modérateur] »
- Le contenu original reste en DB (champ `content` conservé), mais l'UI ne le rend plus.

### Q6 — Dislike privé : **(c) compteur dislike privé à l'auteur + bouton Signaler**

- Le compteur **like** est public.
- Le compteur **dislike** est visible uniquement par l'auteur du post (et les modérateurs).
- Bouton « Signaler » distinct du dislike, ouvre une modale avec catégories :
  - Hors-sujet
  - Insulte / haine
  - Spam
  - Désinformation
  - Autre (texte libre)
- Crée une entrée dans `moderation_reports`.

### Q7 — Mentions @username : **(a) lien + notification**

- Détection regex `@([a-zA-Z0-9_]+)` lors du POST/UPDATE.
- Si le username matche un user existant : crée notification `mention` + remplace par `<a href="/profil/{id}">@username</a>`.
- Insensible à la casse pour le matching.
- Auto-complétion dans le composer (futur, post-v1).

### Q8 — Migration : **(a) tous les messages existants restent depth=0**

- `parent_post_id = NULL`
- `depth = 0`
- Aucune perte, aucune action manuelle.

---

## 🎨 Design system Mboka 2.0

### Carte message

```css
rounded-2xl
bg-white/[0.03]
border border-white/10
hover:border-or-ancestral/40
backdrop-blur-md
transition-all duration-300
```

### Indentation des replies

- Indent visuel `pl-12` à chaque niveau (24px × 2 sur mobile, 48px × 1 sur desktop).
- Ligne verticale `border-l-2 border-or-ancestral/15` à gauche de la zone indentée pour signaler la chaîne.
- Avatar plus petit aux niveaux profonds : `w-10 h-10 → w-8 h-8 → w-7 h-7`.

### Boutons de vote

- **Like** : icône `Heart` lucide-react, fill au clic, animation Framer Motion (scale 1 → 1.4 → 1).
- **Dislike** : icône `ThumbsDown` lucide-react.
- Couleurs :
  - Inactif : `text-ivoire-ancien/40`
  - Liké : `text-red-400 fill-red-400/30`
  - Disliké : `text-amber-500 fill-amber-500/20`
- Tooltip au survol avec le compteur (et nom des likers pour les modérateurs).

### Composer reply inline

- Slide-in vertical sous le post parent au clic « Répondre ».
- Markdown editor compact (3 lignes par défaut, expandable).
- Boutons inline : 😀 (emoji), 🎬 (GIF), Aa (formatage).
- Bouton « Annuler » + « Publier » à droite.

### GIF picker

- Modale glassmorphism centrée.
- Champ recherche en haut, suggestions tendances en dessous.
- Grille masonry 3 colonnes desktop, 2 mobile.
- Hover preview, click pour insérer.

### Emoji picker

- Lib `emoji-mart` thémée Brume (fond `eau-sombre`, accent `or-ancestral`).
- Categories visibles, recherche, tonalités de peau.

### Notification bell

- Icône `Bell` dans la Navbar (entre le sélecteur langue et l'avatar profil).
- Badge rouge avec compteur si unread > 0.
- Pulse subtile avec Framer Motion quand nouveau (1× au reçu).
- Click ouvre dropdown : 10 dernières, click sur une notification → mark read + navigate.

---

## ⚡ Stratégie Realtime

| Événement | Canal | Stratégie |
|---|---|---|
| Nouveau post (top-level ou reply) | `postgres_changes` filtré par `thread_id` | Insert dans le bon parent localement |
| Vote modifié | `postgres_changes` sur `forum_post_votes` | Refresh compteurs locaux du post concerné |
| Soft delete d'un post | `postgres_changes` UPDATE | Re-render comme « supprimé » |
| Notification reçue | `postgres_changes` filtré par `recipient_id` | Toast + badge bell |

Tous les canaux respectent les patterns du document `architecture-realtime-strategy` :
- `isMounted` guard avant subscribe
- handler d'erreur sur `.subscribe()`
- refs synchronisées pour les valeurs volatiles
- pas de `setLoading(true)` dans les callbacks

---

## 📅 Sprints proposés (5 semaines, 1 dev)

| Sprint | Durée | Livrable |
|---|---|---|
| **1** | 1 sem | Migration DB + triggers + RLS + tests |
| **2** | 1 sem | Composants UI threading + ReplyComposer |
| **3** | 1 sem | Votes (like/dislike) + signalement |
| **4** | 1 sem | Notifications (table + bell + dropdown) + email digest |
| **5** | 1 sem | GIF picker (Tenor) + emoji picker + polish design |

---

## ⚠️ Risques anticipés

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Triggers Postgres mal écrits → counters désynchronisés | Moyenne | Haut | Tests scriptés + cron de réconciliation hebdomadaire |
| Performance avec 1000+ replies dans un thread | Faible | Moyen | Pagination + virtualisation au-delà de 100 messages |
| Tenor quota dépassé | Faible | Faible | Cache des recherches récentes côté client (24h TTL) |
| Notification bombing (spam) | Moyenne | Moyen | Coalesce (« 3 personnes ont répondu ») + cooldown 1min entre notifs même actor→recipient |
| Vote brigading | Faible | Moyen | Détection patterns + validation manuelle au-delà de seuils |
| Mentions sur username phonétiques (kisakata) | Élevée | Faible | Whitelist [a-zA-Z0-9_] (slug, pas display name) |

---

## 🔐 Sécurité & RLS

### `forum_posts` (modifié)

Les RLS existantes restent. On ajoute :

```sql
-- Édition par auteur dans les 5 minutes
CREATE POLICY "forum_posts_self_edit_5min"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (
    author_id = auth.uid()
    AND created_at > NOW() - INTERVAL '5 minutes'
    AND deleted_at IS NULL
  );

-- Édition admin/manager toujours
CREATE POLICY "forum_posts_admin_edit"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (is_admin_or_manager());
```

### `forum_post_votes`

```sql
ALTER TABLE forum_post_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes_read_aggregate"
  ON forum_post_votes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "votes_insert_self"
  ON forum_post_votes FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "votes_update_self"
  ON forum_post_votes FOR UPDATE
  TO authenticated USING (user_id = auth.uid());

CREATE POLICY "votes_delete_self"
  ON forum_post_votes FOR DELETE
  TO authenticated USING (user_id = auth.uid());
```

### `forum_notifications`

```sql
ALTER TABLE forum_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notif_read_self"
  ON forum_notifications FOR SELECT
  TO authenticated USING (recipient_id = auth.uid());

CREATE POLICY "notif_update_self"
  ON forum_notifications FOR UPDATE
  TO authenticated USING (recipient_id = auth.uid());

-- INSERT uniquement par triggers (service_role)
```

---

## 🎯 Métriques de succès

| KPI | Avant | Cible 30j post-launch |
|---|---|---|
| Posts par thread (moyenne) | 3 | 10 |
| % threads avec ≥ 1 reply imbriquée | 0% | 40% |
| Temps moyen passé sur Mboka | 2 min | 6 min |
| Taux de retour 7j | 15% | 35% |
| Notifications cliquées / reçues | — | > 50% |
| Engagement par utilisateur (likes + posts) | — | 5/semaine |

---

## 🚀 Prochaines étapes immédiates

1. ✅ Décisions verrouillées (ce document).
2. ✅ Tasks détaillées dans [`forum-mboka-2.0-tasks.md`](./forum-mboka-2.0-tasks.md).
3. 🔄 Exécution sprints 1-2 immédiat (foundation).
4. 🔄 Test local + déploiement.

---

*« Mboka boko bayebi nzela ya bankoko. » — Le village est ceux qui connaissent le chemin des aïeux.*
