# Plan d'action — Modération Forum, Logs, Migration Langue Kisakata, Cohérence Brume

> Document préparé avant exécution. Ce plan couvre 4 chantiers indépendants mais déployés ensemble.

---

## Chantier A — Retirer "Langue Kisakata" du menu Savoir et l'intégrer à la page École

### Contexte actuel
- Lien dans `src/components/navbar/SavoirMenu.tsx:39-44` (icône `Languages`, route `ROUTES.LANGUE = "/langue"`).
- Lien aussi dans le menu mobile `src/components/Navbar.tsx:386` (section Savoir).
- Page existante : `src/app/langue/page.tsx` + leçons `src/app/langue/lecon/`.
- Page école : `src/app/ecole/page.tsx` propose Primaire / Secondaire (mathématiques uniquement).

### Actions
1. **Supprimer** l'item "Langue Kisakata" de `SavoirMenu.tsx` (et entrée mobile dans `Navbar.tsx`).
2. **NE PAS supprimer** la route `/langue` ni les leçons : on conserve l'app, on change juste l'entrée d'accès.
3. **Ajouter une troisième "discipline"** sur la page école (`src/app/ecole/page.tsx`), aux côtés de Primaire / Secondaire :
   - Carte **"Langue Kisakata"** avec icône `Languages`, palette brume (or ancestral / forêt nocturne), CTA → `/langue`.
   - Description : "Cours interactifs pour apprendre la langue ancestrale".
4. **Conserver** `ROUTES.LANGUE` dans `src/lib/constants/routes.ts` (utilisée par l'app langue elle-même).
5. Vérifier qu'il n'y a pas d'autres références "Langue Kisakata" dans les menus (UserMenu, footer éventuel).

### Critère de réussite
- Plus aucune entrée "Langue" dans le menu Savoir (desktop + mobile).
- La page `/ecole` propose 3 cartes : Primaire, Secondaire, Langue Kisakata, toutes en cohérence brume.
- `/langue` reste fonctionnelle.

---

## Chantier B — Cohérence design brume sur la page École

### Contexte actuel — couleurs hors charte détectées
- `src/app/ecole/page.tsx` : `bg-[#0a0f16]`, `selection:bg-blue-500/30`, `bg-blue-500/10`, `border-blue-500/20`, `text-blue-400`, `from-blue-400 to-teal-400`, `from-blue-600/20 to-teal-600/20`, `bg-purple-600/20`, `text-purple-400`.
- `src/app/ecole/components/CourseRiver.tsx` : `from-blue-950/40 via-[#0a0f16] to-purple-950/30`, `border-teal-500/20`, `bg-teal-500/10`, `text-teal-400`, `from-teal-400 to-blue-400`, `border-blue-500/30`, `bg-blue-500/10`, `text-blue-400`, `border-purple-500/30`, `bg-purple-500/10`, `text-purple-400`.
- `src/app/ecole/components/EcoleHero.tsx` : suspect (à vérifier).

### Tokens canoniques à utiliser
- `--foret-nocturne` (fond, ~`#0B1714`)
- `--or-ancestral` (accents, ~`#B59551`)
- `--ivoire-ancien` (texte, ~`#F2EEDD`)

### Mapping des couleurs (substitution)
| Avant | Après |
|---|---|
| `bg-[#0a0f16]` | `bg-foret-nocturne` |
| `selection:bg-blue-500/30` | `selection:bg-or-ancestral/30` |
| `selection:text-blue-200` | `selection:text-ivoire-ancien` |
| `bg-blue-500/10`, `bg-teal-500/10` | `bg-or-ancestral/10` |
| `border-blue-500/20`, `border-teal-500/20` | `border-or-ancestral/20` |
| `text-blue-400`, `text-teal-400` | `text-or-ancestral` |
| `text-purple-400` | `text-ivoire-ancien/70` |
| `bg-purple-600/20` | `bg-ivoire-ancien/5` |
| `from-blue-400 to-teal-400` | `from-or-ancestral to-ivoire-ancien` |
| `from-blue-950/40 ... to-purple-950/30` | `from-foret-nocturne via-foret-nocturne to-or-ancestral/10` |

### Actions
1. Lecture + édition `src/app/ecole/page.tsx`, `EcoleHero.tsx`, `CourseRiver.tsx` (et tout fichier `src/app/ecole/components/*` ou sous-pages contenant les couleurs hors charte).
2. Conserver les **distinctions sémantiques** (Primaire vs Secondaire) en variant l'opacité de `or-ancestral` plutôt que la teinte (ex. Primaire = `or-ancestral/40`, Secondaire = `or-ancestral`, Langue = `or-ancestral/70`).
3. Appliquer le skill `frontend-design` pour garder une hiérarchie typographique cohérente (Outfit pour H1, Geist Mono pour eyebrows).
4. Pas de refonte structurelle : seulement substitution de couleurs + animation/transition légère (Framer Motion stagger sur les 3 cartes).

### Critère de réussite
- Aucune occurrence de `bg-blue-`, `text-blue-`, `bg-teal-`, `border-teal-`, `text-purple-`, `bg-purple-`, `from-blue-`, `to-teal-`, `from-teal-`, `to-purple-` dans `src/app/ecole/`.
- Aucun hex hardcodé (`#0a0f16`, etc.).
- Visuellement cohérent avec `/savoir`, `/forum`, `/membres`.

---

## Chantier C — Modération Forum réelle (Command Center)

### Contexte actuel
- `src/app/admin/forum/page.tsx` : 2 signalements **hardcodés** (`KongoLover42`, `Anonyme`), aucun lien base.
- Table `moderation_reports` existe déjà : `(id, reporter_id, target_post_id, category, description, status, reviewed_by, reviewed_at, created_at)`.
- Tables forum : `forum_threads`, `forum_posts`, `forum_categories`, `forum_reactions`.
- **Aucune** colonne ban sur `profiles`. **Aucune** table de logs. Enum `user_role` actuel : `{admin, manager, contributor, user, temp_admin}` — pas de `moderator`.

### C.1 — Migration base de données

**Migration `add_moderation_system`** :

1. **Enum** : ajouter `moderator` à `user_role`.
   ```sql
   ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'moderator';
   ```

2. **Colonnes ban sur `profiles`** :
   ```sql
   ALTER TABLE profiles
     ADD COLUMN IF NOT EXISTS banned_until timestamptz,
     ADD COLUMN IF NOT EXISTS ban_reason text,
     ADD COLUMN IF NOT EXISTS banned_by uuid REFERENCES profiles(id);
   ```

3. **Table `moderation_logs`** :
   ```sql
   CREATE TABLE moderation_logs (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     moderator_id uuid REFERENCES profiles(id) NOT NULL,
     action_type text NOT NULL CHECK (action_type IN
       ('delete_post','delete_thread','warn_user','ban_user','unban_user','delete_user','resolve_report','dismiss_report')),
     target_user_id uuid REFERENCES profiles(id),
     target_post_id uuid,
     target_thread_id uuid,
     target_report_id uuid REFERENCES moderation_reports(id),
     reason text,
     duration_hours int,
     expires_at timestamptz,
     metadata jsonb,
     created_at timestamptz DEFAULT now()
   );
   CREATE INDEX ON moderation_logs (created_at DESC);
   CREATE INDEX ON moderation_logs (moderator_id);
   CREATE INDEX ON moderation_logs (target_user_id);
   ```

4. **Table `moderation_warnings`** (rappels à l'ordre lus à la connexion) :
   ```sql
   CREATE TABLE moderation_warnings (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id uuid REFERENCES profiles(id) NOT NULL,
     moderator_id uuid REFERENCES profiles(id) NOT NULL,
     message text NOT NULL,
     read_at timestamptz,
     created_at timestamptz DEFAULT now()
   );
   CREATE INDEX ON moderation_warnings (user_id) WHERE read_at IS NULL;
   ```

5. **Soft delete des forum_posts** : ajouter colonnes pour conserver l'historique en marquant l'action modérateur.
   ```sql
   ALTER TABLE forum_posts
     ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
     ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES profiles(id),
     ADD COLUMN IF NOT EXISTS deletion_reason text;
   ```
   Idem pour `forum_threads`.

6. **RLS** :
   - `moderation_logs`, `moderation_warnings` : SELECT/INSERT réservé à `admin|manager|moderator`. L'utilisateur peut SELECT ses propres `moderation_warnings`.
   - Mise à jour des policies forum existantes pour bloquer les inserts si `banned_until > now()`.

### C.2 — Constantes et helpers

- Ajouter dans `src/lib/constants/business.ts` :
  - `USER_ROLES.MODERATOR = "moderator"`.
  - Hiérarchie : `moderator: 40` (entre `manager: 50` et `contributor: 30`).
  - Helper `canModerate(role)` → `admin | manager | moderator`.
- Ajouter dans `src/lib/constants/db.ts` :
  - `MODERATION_LOGS = "moderation_logs"`, `MODERATION_WARNINGS = "moderation_warnings"`.
- Routes : ajouter `ROUTES.ADMIN_LOGS = "/admin/logs"`.

### C.3 — Page modération `/admin/forum` (refonte)

Remplacer la page actuelle par une vraie page connectée aux données.

**Onglets** :
1. **Signalements ouverts** — `moderation_reports.status = 'pending'` joint à `forum_posts` + `profiles` (auteur + reporter). Actions : Voir le post, Supprimer le post (avec raison), Avertir l'auteur, Bannir l'auteur, Rejeter le signalement.
2. **Posts récents** — derniers `forum_posts` non supprimés, scan rapide pour modération proactive.
3. **Utilisateurs actifs / bannis** — liste des profils avec `banned_until > now()` + recherche utilisateur. Actions : Bannir, Débannir, Avertir, Supprimer.

**Modale d'action** (composant `ModerationActionModal`) :
- Champ `Raison` (obligatoire, stockée dans `reason`).
- Pour ban : sélecteur de durée 24h / 48h / 72h (radio buttons).
- Pour avertissement : champ `Message à l'utilisateur`.
- Bouton "Confirmer" → INSERT `moderation_logs` + UPDATE/DELETE cible + (warn) INSERT `moderation_warnings`.

**API routes** (server actions ou `/api/admin/moderation/*`) :
- `POST /api/admin/moderation/delete-post` : `{ postId, reason }` → soft delete + log + (option) warning à l'auteur.
- `POST /api/admin/moderation/warn` : `{ userId, message }` → INSERT `moderation_warnings` + log.
- `POST /api/admin/moderation/ban` : `{ userId, durationHours, reason }` → UPDATE `profiles.banned_until` + log.
- `POST /api/admin/moderation/unban` : `{ userId, reason }` → UPDATE `profiles.banned_until = null` + log.
- `POST /api/admin/moderation/delete-user` : `{ userId, reason }` → **soft delete** (mise en corbeille 6 mois) + log. Double confirmation (taper le username).
- `POST /api/admin/moderation/restore-user` : `{ userId }` → restaurer un compte de la corbeille (admin only) + log.
- Job/cron `purge_deleted_users()` : suppression définitive auth + cascade des comptes dont `permanent_delete_at < now()`. Exécuté à la lecture admin OU via cron quotidien (Supabase pg_cron).

**Corbeille — règles d'affichage** :
- Profile avec `deleted_at IS NOT NULL` → masqué dans annuaire / membres / search.
- Posts/messages/threads de l'auteur → l'auteur affiché en "Utilisateur supprimé", lien désactivé, avatar par défaut anonyme.
- AuthProvider : si `profile.deleted_at IS NOT NULL` → force logout + message "Compte suspendu".
- Onglet "Corbeille" dans `/admin/forum` (admin only) listant les soft-deleted avec date de purge automatique + bouton restaurer.
- `POST /api/admin/moderation/resolve-report` : `{ reportId, resolution }` → UPDATE status + log.

Toutes les routes :
- Auth check via service-role client + vérification `effectiveRole ∈ {admin, manager, moderator}`.
- `withRetry()` sur tous les appels critiques.
- Validation Zod sur le body.

### C.4 — Modale de bannissement côté utilisateur

**Composant** `BannedUserModal` monté globalement (dans `AuthProvider` ou `RootLayout`).

- `AuthProvider` charge `banned_until`, `ban_reason` dans le profile.
- Si `banned_until > now()` : afficher une modale **bloquante full-screen** style brume :
  - Titre : "Votre accès est temporairement suspendu".
  - Raison du bannissement.
  - Décompte live (heures, minutes, secondes) jusqu'à `banned_until`.
  - Bouton "Se déconnecter" uniquement.
- Décompte côté client via `setInterval(1s)` ; au passage à 0 → reload (le profil est rafraîchi, modale disparaît).
- Realtime Supabase subscription sur `profiles.banned_until` du user courant pour fermeture immédiate si débanni manuellement.

### C.5 — Modale de rappel à l'ordre

**Composant** `WarningModal` également global :
- Au login, fetch `moderation_warnings` non lus pour `user_id = current_user`.
- Affichage en cascade modale (une après l'autre) avec :
  - Message du modérateur.
  - Bouton "J'ai compris" → UPDATE `read_at = now()`.

### C.6 — Page Logs `/admin/logs`

Nouvelle route `src/app/admin/logs/page.tsx` :
- Tableau des `moderation_logs` (50 dernières, pagination infinie).
- Colonnes : Date/heure, Modérateur (nickname + rôle), Action, Cible (user/post/thread), Raison, Durée (si ban).
- Filtres : type d'action, modérateur, plage de dates, utilisateur cible.
- Export CSV (bouton).
- Lecture : `admin | manager | moderator`.

### C.7 — Navigation et accès

1. **Sidebar admin** (`src/app/admin/layout.tsx`) :
   - Ajouter `Modération` (lien `/admin/forum`) — déjà présent, vérifier `roles: ['admin','manager','moderator']`.
   - Ajouter **`Journaux`** (`/admin/logs`) — `roles: ['admin','manager','moderator']`, icône `ScrollText`.
2. **Navbar Communauté** (`src/components/navbar/CommunityMenu.tsx`) :
   - Pour `role === 'moderator'` : afficher un item "Modération" → `/admin/forum`.
   - Idem dans menu mobile (`src/components/Navbar.tsx`).
3. **UserMenu** (`src/components/navbar/UserMenu.tsx`) :
   - Étendre le check Admin Center à `moderator`.
4. **Middleware/garde** sur `/admin/*` : autoriser `moderator` aux routes `/admin/forum` et `/admin/logs` uniquement (pas aux autres pages admin sensibles).

### Critère de réussite — Chantier C
- Les 2 entrées factices ont disparu ; les vrais signalements s'affichent.
- Un admin peut supprimer un post, avertir un user, bannir 24/48/72h, débannir, supprimer un user.
- L'utilisateur banni voit la modale avec décompte ; débannissement immédiat propagé via realtime.
- L'utilisateur averti voit la modale au login et peut acquitter.
- Toutes ces actions apparaissent dans `/admin/logs`.
- Le rôle `moderator` voit "Modération" dans Communauté + accède à `/admin/forum` et `/admin/logs` uniquement.

---

## Chantier D — Cohérence design (skills à invoquer)

Pendant le chantier B + écran modale ban/warning + page logs : appliquer les guidelines `frontend-design` et `sage-basakata` (voix narrative pour textes utilisateur — ex. "Le sanctuaire vous est temporairement fermé").

---

## Ordre d'exécution

1. **Migration BDD** (Chantier C.1) — pas de retour arrière facile, donc en premier, validée immédiatement.
2. **Constantes / helpers / routes** (C.2) — base pour tout le reste.
3. **API routes modération** (C.3 — backend).
4. **Page `/admin/forum`** refondue (C.3 — frontend).
5. **Page `/admin/logs`** (C.6).
6. **Modales globales `BannedUserModal` + `WarningModal`** (C.4, C.5) + intégration AuthProvider.
7. **Navigation** (C.7) — Sidebar admin + Navbar Communauté + UserMenu.
8. **Chantier A** — retrait Langue du Savoir + intégration École.
9. **Chantier B** — substitution couleurs école.
10. **Bump APP_VERSION** (`business.ts`) → `2.8.0`.
11. **Mise à jour CLAUDE.md** : section modération + changelog.

---

## Risques et points d'attention

- **Rôle `moderator` sur enum** : `ALTER TYPE ADD VALUE` est non-transactionnel sur certaines versions PG. Migration séparée si besoin.
- **RLS forum** : le check `banned_until > now()` doit être ajouté aux policies INSERT existantes — risque de bloquer aussi les modérateurs si mal écrit. Whitelister via rôle.
- **Suppression utilisateur** : passe par `auth.admin.deleteUser()` (service role) — uniquement côté serveur, jamais exposé au client.
- **`temp_admin`** : doit hériter des permissions admin sur les routes modération.
- **Realtime ban** : éviter de spammer la modale ; un seul channel par user.
- **Migration `forum_posts.deleted_at`** : adapter les requêtes existantes pour filtrer `deleted_at IS NULL` côté lecture.

---

Plan validé → exécution dans l'ordre ci-dessus.
