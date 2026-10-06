# RAPPORT — Audit RLS table par table — Sakata (`slbnjjgparojkvxbsdzn`)

- **Date** : 2026-10-06
- **Méthode** : lecture seule exclusivement. Le schéma a été lu via `sql.py` (catalogue `pg_class`, `pg_policies`, `pg_proc`, `information_schema`, `has_*_privilege`). Les sondes live ont été faites via `probe.py` (clé **anon**, GET PostgREST). Pour tester le rôle `authenticated`, j'ai simulé une session dans `sql.py` avec `set_config('role','authenticated', true)` et `set_config('request.jwt.claims', …, true)`. Ces réglages ne valent que pour la transaction implicite de la requête, et seules des requêtes `SELECT` ont été exécutées.
- **Aucune écriture, aucun DDL, aucune modification du dépôt.** Les fonctions qui modifient des données (`purge_expired_deleted_users`, `flush_temp_admins`, `increment_article_reads`, `cleanup_expired_messages`) n'ont **pas** été appelées.
- Les commandes et leurs sorties brutes sont dans `sondes.txt`. Les sorties qui touchent des données personnelles ont été obtenues par **filtre d'existence** (`col=not.is.null&select=username`), donc sans afficher la valeur.

---

## 0. Synthèse chiffrée

| Indicateur | Valeur |
|---|---|
| Tables `public` | **31** |
| Tables avec RLS **désactivée** | **0** (requête `relrowsecurity = false` → résultat vide) |
| Tables avec `FORCE ROW LEVEL SECURITY` | 0 (sans impact : seul `postgres`/`service_role` possèdent les tables, et ces rôles ont de toute façon `BYPASSRLS`) |
| Policies au total | 100 |
| Vues | 2 (`active_subscription_grants`, `daily_analytics`), sans `security_invoker`, mais SELECT révoqué et vues **non modifiables** (`pg_relation_is_updatable = 0`) |
| Fuites confirmées par sonde anon | **2** (RPC `get_profiles_debug_v1` ; métadonnées des brouillons `articles`) |
| Régression bloquante confirmée | **1** (policies qui lisent `profiles.role` → `42501` pour tous les rôles clients, admin compris) |

---

## 1. TOP RISQUES

### 🔴 CRITIQUE

#### C1 — `get_profiles_debug_v1()` : dump complet de `profiles` pour `anon` (FUITE confirmée)
- Il s'agit d'une fonction `SECURITY DEFINER`, **sans `search_path`**, qui renvoie `SETOF profiles`, avec `EXECUTE` accordé à `anon` et `authenticated`. Son corps est `SELECT * FROM profiles LIMIT p_limit`.
- Elle **contourne entièrement** la révocation des colonnes de `profiles` faite le 2026-10-06. Toutes les colonnes sont exposées : `role`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_*`, `first_name`, `last_name`, `birth_date`, `address`, `gender`, `ban_reason`, `banned_until`, `temp_admin_*`, `deletion_reason`…
- **Preuve** (clé anon) :
  - `rpc/get_profiles_debug_v1?p_limit=50&select=username,role,subscription_tier` → `200`, **9 profils sur 9** avec leur rôle (admin, contributor, temp_admin…).
  - `…&stripe_customer_id=not.is.null` → `200 [{"username":"Fondateur"}]` : l'ID client Stripe est lisible.
  - `…&birth_date=not.is.null` → 2 utilisateurs ; `…&last_name=not.is.null` → 9 utilisateurs : les noms civils et les dates de naissance sont lisibles.
- À la vue du nom (« debug »), c'est un reste de développement.

#### C2 — Régression : toutes les policies qui sous-interrogent `profiles` (hors `id`) échouent en `42501`, **admin compris** (module cassé)
- **Cause** : depuis le commit `6457eb2`, `anon` et `authenticated` n'ont plus le `SELECT` que sur 11 colonnes publiques de `profiles`. Le résultat de `has_column_privilege('authenticated','public.profiles','role','SELECT')` vaut `false`. Or une sous-requête dans une policy s'exécute **avec les droits de l'appelant**. Toute policy de la forme `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = …)` lève donc `permission denied for table profiles`.
- **Preuves** :
  - En **anon** : `contribution_requests`, `moderation_logs`, `moderation_warnings`, `site_analytics`, `subscription_grants` → `401 {"code":"42501","message":"permission denied for table profiles"}`.
  - En **authenticated** (simulation avec le `sub` du compte *Fondateur*, `role=admin`) : `SELECT count(*)` sur les mêmes tables **et** sur `moderation_reports` → `ERROR 42501 permission denied for table profiles`. Les tables qui passent par des fonctions `SECURITY DEFINER` (`temp_admin_grants` → `count 2`) ou dont la policy commence par `USING (true)` (`articles` → `count 21`) fonctionnent.
  - L'expression des policies d'écriture a été évaluée telle quelle en authenticated :
    - `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')` → 42501 ;
    - `(SELECT stripe_customer_id FROM profiles WHERE id = auth.uid())` → 42501.
- **Opérations cassées** pour les clients web et mobile (clé anon + JWT) :

| Table | Opérations en erreur 42501 |
|---|---|
| `contribution_requests` | SELECT (même « ses propres demandes »), UPDATE (admin) |
| `moderation_logs` | SELECT, INSERT (`admin/users/page.tsx` insère côté client) |
| `moderation_warnings` | SELECT et UPDATE : **`ModerationGate` n'affiche plus les rappels à l'ordre** |
| `moderation_reports` | SELECT et UPDATE (admin/manager). L'INSERT d'un signalement fonctionne. |
| `subscription_grants` | SELECT et UPDATE : **`SubscriptionGrantGate` n'affiche plus les offres** |
| `site_analytics` | SELECT (tableaux de bord `admin/page.tsx` et `contributeur/page.tsx`) |
| `profiles` | **UPDATE pour tout le monde**. Les deux policies UPDATE lisent `profiles.role` ou `stripe_*`, ce qui casse l'édition de son propre profil (`profil/page.tsx`, ex. `update({avatar_url:null})`). |
| `articles` | INSERT, UPDATE et DELETE via la policy « Contributors can manage articles » |
| `forum_categories` | toute écriture (admin/manager) |
| `forum_posts` | DELETE (y compris la suppression de son propre post, car la policy combine `auth.uid() = author_id OR EXISTS(profiles…)`) |
| `forum_threads` | UPDATE (y compris par l'auteur, même raison) |

- **Nuance** : les routes API qui utilisent `supabaseAdmin` (service_role, `BYPASSRLS`) ne sont pas touchées. Le classement en « critique » tient à la disponibilité (modération, profil, abonnements offerts), pas à une fuite. **Cette régression masque aussi plusieurs trous latents (voir M5)**, qui se rouvriront dès qu'elle sera corrigée.

### 🟠 MAJEUR

#### M1 — `forum_posts` / `forum_threads` : usurpation d'auteur à l'INSERT (TROU)
- `forum_posts` « Authenticated users can create posts » : `WITH CHECK (auth.uid() IS NOT NULL)`, **sans** `author_id = auth.uid()`.
- `forum_threads` « Authenticated users can create threads » : `WITH CHECK (auth.uid() IS NOT NULL)`, **sans** `created_by = auth.uid()`.
- **Conséquences** :
  - n'importe quel membre connecté peut publier **au nom d'un autre** (`author_id` ou `created_by` arbitraire, par exemple l'admin) ;
  - il peut créer un fil déjà `is_pinned=true`, avec un `views_count` arbitraire ;
  - il peut insérer un post avec des `like_count`, `reply_count` ou `depth` arbitraires, ou dans un fil `is_locked` (aucun contrôle).
- **Preuve** : `pg_policies` (section 2). L'INSERT est actif : aucune référence à `profiles` dans la policy, donc la régression C2 ne le masque pas. Les grants `authenticated: I` sont présents sur les deux tables. La sonde en écriture n'a pas été faite (lecture seule).

#### M2 — `community_pins` : n'importe quel connecté modifie n'importe quel pin (TROU)
- Policy UPDATE `community_pins_update` : `USING (auth.uid() IS NOT NULL)`, sans `WITH CHECK`, donc le `USING` est réutilisé comme contrôle.
- Tout utilisateur authentifié peut réécrire le titre, la description, les médias ou `user_id` de **tous** les pins, et se donner `is_verified = true`. L'INSERT accepte aussi `is_verified = true` et un `user_name` arbitraire.
- La table est vide aujourd'hui (`count = 0`). Le risque est actif dès le premier pin.

#### M3 — Triggers en `SECURITY INVOKER` sous RLS : réponses impossibles et compteurs faux (TROU produit)
- **`fn_handle_post_insert`** (trigger `AFTER INSERT` sur `forum_posts`, **non** `SECURITY DEFINER`) fait `INSERT INTO forum_notifications` quand on répond au post d'**un autre** auteur. Or `forum_notifications` n'a **aucune policy INSERT**, ce qui produit une erreur RLS et **l'INSERT du post est annulé**.
  - **Indice concordant** : `replies_to_other_author = 0` et `notif_reply = 0` dans les données. Aucune réponse à un autre membre n'existe en base.
  - La même fonction fait `UPDATE forum_posts SET reply_count…` sur le post parent d'un autre auteur. La policy UPDATE `auth.uid() = author_id` filtre cette ligne, donc la mise à jour touche 0 ligne, en silence.
- **`fn_recalc_post_votes`** (`SECURITY INVOKER`) met à jour `forum_posts.like_count` et `dislike_count` du post voté. Si le votant n'est pas l'auteur, l'UPDATE est filtré et touche 0 ligne, en silence.
  - **Preuve** : le post `65feefca…` a `dislike_count = 0` alors qu'il a `real_dislikes = 1`, voté par un non-auteur (`voter_is_author: [false]`). Le post `76ce269f…`, voté par son auteur, est cohérent.

#### M4 — `articles` : les brouillons sont visibles par `anon` (FUITE de métadonnées)
- La policy SELECT « Articles are viewable by everyone » vaut `USING (true)` et ne filtre pas sur `status`.
- **Preuve** : `articles?select=slug,status,…&status=neq.published` → **13 brouillons sur 13** listés. `…&status=eq.draft&select=slug,title,summary` → titre et résumé du brouillon renvoyés.
- `content` reste protégé (42501), mais le titre, le résumé, la catégorie, `featured_image`, `hero_video_url`, `rejection_reason` et `auto_approved_users` des articles non publiés sont publics. `get_article` les masque, mais la lecture directe de la table, non.

#### M5 — Trous **latents**, masqués par C2, qui se rouvriront dès la correction
1. **`profiles.staff_badge`** : `authenticated` a l'UPDATE sur cette colonne, et elle n'est **pas** remise à `OLD` par `protect_profile_privileged_fields()`. Un membre peut donc s'afficher le badge public `admin` (valeur déjà utilisée : `staff_badges = admin,NULL`).
2. **`subscription_grants`** : la policy UPDATE `user_id = auth.uid() OR staff` est sans `WITH CHECK` et sans restriction de colonnes. Le bénéficiaire peut modifier `tier`, `expires_at`, `revoked_at` et `granted_by` de sa propre offre. Les routes Stripe (`webhook`, `verify-session`) lisent ces offres pour décider du niveau d'abonnement.
3. **`articles` « Contributors can manage articles »** (`ALL`, sans `WITH CHECK`) : un `contributor` peut modifier ou supprimer **tous** les articles, y compris ceux de l'admin, publier directement (`status='published'`) sans relecture, et réattribuer `author_id`.
4. **`contribution_requests` INSERT** : seul `user_id` est contrôlé. On peut créer une demande déjà `status='approved'` avec un `reviewed_by` arbitraire. L'INSERT est actif dès maintenant ; seule la lecture est cassée.
5. **`moderation_warnings` UPDATE (soi-même)** : sans restriction de colonnes, le membre averti peut réécrire `message`, `moderator_id` et `related_post_id` de son avertissement, pas seulement `read_at`.

### 🟡 MINEUR

- **m1 — Fonctions de maintenance appelables par `anon`** (`SECURITY DEFINER`) :
  - `purge_expired_deleted_users()` supprime dans `auth.users`. Aujourd'hui 0 éligible ; la fonction ne supprime que les comptes déjà expirés.
  - `flush_temp_admins()` et `cleanup_expired_messages()`.
  - `increment_article_reads(uuid|text)` : gonflement de `reads_count` sans limite.
  - Ces fonctions n'ont **pas** été appelées (elles écrivent). La preuve vient de `has_function_privilege('anon', …) = true`.
- **m2 — Oracles de rôle et d'appartenance pour `anon`** : `is_real_admin`, `is_admin_effectively`, `is_admin_or_manager`, `can_modify_profile`, `can_read_premium_articles`, `is_chat_participant` et `is_chat_admin` prennent un UUID arbitraire.
  - Preuve : `rpc/is_real_admin?p_user_id=8a51…` → `200 true` ; `rpc/can_read_premium_articles?p_uid=7dd8…` → `200 true`.
  - Les `id` de `profiles` étant publics, un visiteur peut énumérer qui est admin, staff ou premium, et tester l'appartenance à une conversation dont il connaît l'UUID.
- **m3 — 14 fonctions `SECURITY DEFINER` sans `SET search_path`** : `capture_ip_address`, `cleanup_expired_messages`, `get_profiles_debug_v1`, `handle_article_forum_sync`, `handle_article_like_count`, `handle_new_article_thread`, `handle_new_user`, `increment_article_reads` ×2, `is_chat_admin`, `is_chat_participant`, `purge_expired_deleted_users`, `trigger_cleanup`, `update_last_read_at`. Le risque est faible en pratique : `anon` et `authenticated` n'ont pas `CREATE` sur `public` ni sur `extensions`, et PostgREST ne permet pas de changer `search_path`. C'est une question d'hygiène.
- **m4 — `site_analytics` INSERT ouvert** : la policy « Enable insert for everyone » est `WITH CHECK (true)` et s'applique en OU avec la policy plus stricte, ce qui annule celle-ci. `anon` peut insérer des visites avec un `user_id` arbitraire (attribution à autrui) et un `metadata` jsonb libre. `tr_capture_ip` prend le 1er élément de `x-forwarded-for`, qui peut être falsifié par le client.
- **m5 — `temp_admin` expiré toujours actif** : 1 profil a encore `role='temp_admin'` alors que `temp_admin_expires_at` est dépassé, donc `flush_temp_admins` n'est pas planifié. `get_article`, `get_article_full`, `can_read_premium_articles` et les policies `moderation_*` testent `role = 'temp_admin'` **sans** vérifier l'expiration. Ce profil garde l'accès premium, les brouillons, et la lecture et l'écriture de la modération dès que C2 sera corrigé.
- **m6 — Identités exposées** :
  - `forum_reactions` et `article_likes` : SELECT public avec `user_id`. Preuve : la sonde `forum_reactions` renvoie `user_id` en anon.
  - `forum_post_votes` : SELECT `true` pour `authenticated`, donc qui a voté contre qui est visible.
- **m7 — `chat_reactions` INSERT** : seul `auth.uid() = user_id` est vérifié, pas l'appartenance à la conversation du message. On peut réagir à l'aveugle à un message dont on connaît l'UUID.
- **m8 — `moderation_logs` INSERT** : un modérateur peut forger `moderator_id`, c'est-à-dire attribuer une action à un collègue.
- **m9 — Hygiène** :
  - policies dupliquées : `profile_gallery` (11 pour 5 règles), `push_subscriptions` ×2, `site_analytics` SELECT ×2, `profiles` SELECT ×2 ;
  - policies « service_role » inutiles, puisque `service_role` a `BYPASSRLS` ;
  - `articles` a **3 triggers AFTER INSERT** qui créent un fil forum (`on_article_created` et `on_article_created_thread` appellent la même fonction, plus `on_article_created_sync_forum`).

---

## 2. Bloc par table

Légende des grants : `S/I/U/D` = SELECT/INSERT/UPDATE/DELETE au niveau table ; `(col)` = grant au niveau colonne seulement. « Sans policy » signifie que le grant existe mais qu'aucune policy ne couvre l'opération : un UPDATE ou DELETE renvoie **0 ligne sans erreur**, un INSERT renvoie une erreur RLS.

| # | Table | RLS | Policies | Grants anon / auth | Verdict | Preuve |
|---|---|---|---|---|---|---|
| 1 | `admin_note_folders` | on | 1 (ALL `auth.uid()=user_id`) | SIUD / SIUD | **OK** | anon → `[]`, `count=2` (la RLS filtre) |
| 2 | `admin_notes` | on | 4 (propriétaire) | SIUD / SIUD | **OK** (tout membre peut créer des notes, sans impact) | anon → `[]`, `count=6` |
| 3 | `article_likes` | **on** | 3 (SELECT public, INSERT et DELETE soi) | SIUD / SIUD | **OK** (m6). UPDATE sans policy. UNIQUE `(article_id,user_id)`. | `relrowsecurity=true` ; anon → `[]`, `count=0` (table vide) |
| 4 | `articles` | on | 2 (SELECT `true`, ALL contributeurs) | IUD + S(col sans `content`) / idem | **FUITE** (M4) + **À REVOIR** (M5-3) + écritures cassées (C2) | brouillons visibles ; `select=content` → 42501 ; `get_article` premium → `has_access:false, content_truncated:true` |
| 5 | `chat_conversations` | on | 2 (SELECT créateur ou participant, INSERT authentifié) | SIUD / SIUD | **OK**. UPDATE et DELETE **sans policy** (renommer ou supprimer un groupe échoue en silence). | anon → `[]`, `count=5` |
| 6 | `chat_messages` | on | 3 (SELECT et INSERT participant, UPDATE expéditeur) | S I D(col) / S I D + U(6 col) | **OK**. DELETE **sans policy** (la suppression passe par UPDATE `deleted_*`). `conversation_id` et `sender_id` non modifiables. | anon → `[]`, `count=45` |
| 7 | `chat_participants` | on | 4 (dont **UPDATE `self can update last_read_at`**) | S I(col) / S I + U(`last_read_at` seul) | **OK** | anon → `[]`, `count=9` ; colonne UPDATE = `last_read_at` |
| 8 | `chat_reactions` | on | 3 | SIUD / SIUD | **OK** (m7). UPDATE sans policy. | anon → `[]`, `count=3` |
| 9 | `chat_subscriptions` | on | 2 (SELECT propre, ALL service_role) | SIUD / SIUD | **OK** (écriture réservée au serveur) | anon → `[]`, `count=0` (vide ; la policy exige `auth.uid()`) |
| 10 | `community_pins` | on | 4 | SIUD / SIUD | **TROU** (M2) | `pg_policies` UPDATE `auth.uid() IS NOT NULL` ; `count=0` |
| 11 | `contribution_requests` | on | 5 | SIUD / SIUD | **VERROUILLÉ** (C2) + **À REVOIR** (M5-4 ; manager et moderator absents des policies) | anon → 42501 `permission denied for table profiles` ; auth/admin → 42501 |
| 12 | `ecole_scores` | on | 3 (propriétaire) | SIUD / SIUD | **OK**. DELETE sans policy. | anon → `[]`, `count=1` |
| 13 | `ecole_semantic_cache` | on | 2 (SELECT public, ALL service) | SIUD / SIUD | **OK** (contenu pédagogique, `query` NULL) | anon → 3 lignes (voulu) |
| 14 | `family_tree` | on | 4 (propriétaire) | SIUD / SIUD | **OK** | anon → `[]`, `count=10` |
| 15 | `forum_categories` | on | 2 | SIUD / SIUD | **OK** en lecture ; écritures admin cassées (C2) | anon → visible (voulu) |
| 16 | `forum_notifications` | on | 2 (SELECT et UPDATE destinataire) | SIUD / SIUD | **TROU produit** (M3) : pas d'INSERT policy alors qu'un trigger INVOKER y insère | anon → `[]`, `count=2` |
| 17 | `forum_post_votes` | on | 4 (`TO authenticated`) | SIUD / SIUD | **OK** (m6) ; trigger de recalcul silencieux (M3) | anon → `[]`, `count=2` ; incohérence `dislike_count` prouvée |
| 18 | `forum_posts` | on | 4 | SIUD / SIUD | **TROU** (M1) + DELETE cassé (C2) | `pg_policies` INSERT `auth.uid() IS NOT NULL` ; anon → visible (voulu) |
| 19 | `forum_reactions` | on | 3 | SIUD / SIUD | **OK** (m6). UPDATE sans policy. | anon → réaction avec `user_id` |
| 20 | `forum_threads` | on | 3 | SIUD / SIUD | **TROU** (M1) + UPDATE cassé (C2) + DELETE sans policy | anon : fils masqués ou supprimés → `[]` (aucun en base) |
| 21 | `langue_progress` | on | 3 (`TO authenticated`, propriétaire) | — / SIU | **OK** | anon → 42501 `permission denied for table langue_progress` |
| 22 | `moderation_logs` | on | 2 (staff) | SIUD / SIUD | **VERROUILLÉ** (C2), m8. UPDATE et DELETE sans policy (journal immuable : bien). | anon et auth → 42501 |
| 23 | `moderation_reports` | on | 3 (`TO authenticated`) | SIUD / SIUD | **VERROUILLÉ** (C2) pour admin et manager ; `moderator` et `temp_admin` absents de la lecture | anon → `[]`, `count=4` (aucune policy anon) ; auth → 42501 |
| 24 | `moderation_warnings` | on | 3 | SIUD / SIUD | **VERROUILLÉ** (C2) + latent M5-5 | anon et auth → 42501 |
| 25 | `profile_gallery` | on | 11 (doublons) | SIUD / SIUD | **OK** (m9) | anon → éléments `public` seulement ; `count non-public = 0` |
| 26 | `profiles` | on | 4 (SELECT `true` ×2, UPDATE soi, UPDATE admin) | S(11 col publiques) / S(11 col) + U(toutes col) | **OK** en REST ; **FUITE** via RPC (C1) ; UPDATE **cassé** (C2) ; latent `staff_badge` (M5-1) | `select=role|stripe_customer_id|ban_reason|birth_date|*` → 42501 ; trigger `protect_profile_privileged_fields` actif |
| 27 | `push_subscriptions` | on | 2 (doublon ALL) | SIUD / SIUD | **OK** (le USING sert de CHECK) | anon → `[]`, `count=0` |
| 28 | `site_analytics` | on | 4 | SIUD / SIUD | **À REVOIR** (m4) + lecture admin **cassée** (C2). UPDATE et DELETE sans policy. | anon → 42501 |
| 29 | `subscription_grants` | on | 3 | SIUD / SIUD | **VERROUILLÉ** (C2) + latent M5-2. DELETE sans policy. | anon et auth → 42501 |
| 30 | `subscription_sessions` | on | 2 (SELECT propre, ALL service) | SIUD / SIUD | **OK** | anon → `[]`, `count=1` |
| 31 | `temp_admin_grants` | on | 3 (`TO authenticated`, fonctions SD) | SIUD / SIUD | **OK** | anon → `[]`, `count=2` ; auth/admin → `count=2` |

### Vues
| Vue | `security_invoker` | SELECT anon/auth | Modifiable | Verdict | Preuve |
|---|---|---|---|---|---|
| `active_subscription_grants` | absent | révoqué (IUD encore accordés) | **non** (`DISTINCT ON`) | **OK** (les grants IUD restants sont inopérants) | anon → `401 permission denied for view` |
| `daily_analytics` | absent | révoqué (IUD encore accordés) | **non** (`GROUP BY`) | **OK** | anon → `401 permission denied for view` |

### Grants sans policy correspondante (piège « 0 ligne, pas d'erreur »)
Résultat de la requête croisée « grants × `pg_policies` », auquel s'ajoutent les tables dont la seule policy d'écriture est réservée à `service_role` :
- **UPDATE silencieux** : `chat_conversations`, `chat_reactions`, `forum_reactions`, `article_likes` (auth), `moderation_logs`, `site_analytics`, ainsi que `chat_subscriptions`, `subscription_sessions`, `ecole_semantic_cache` (policies service_role seulement).
- **DELETE silencieux** : `chat_conversations`, `chat_messages`, `ecole_scores`, `forum_threads`, `moderation_logs`, `moderation_warnings`, `site_analytics`, `subscription_grants`, `temp_admin_grants`, `contribution_requests`, `chat_subscriptions`, `subscription_sessions`, `ecole_semantic_cache`.
- **INSERT en erreur** : `forum_notifications` (cause de M3).

---

## 3. FAUX POSITIFS ÉCARTÉS

| Soupçon | Vérification | Conclusion |
|---|---|---|
| « `article_likes` a la RLS désactivée » | `relrowsecurity = true`, 3 policies, contrainte `UNIQUE(article_id,user_id)` | **Faux** : RLS active. Le seul point notable est le SELECT public de `user_id` (m6). |
| « `chat_participants` n'a pas de policy UPDATE (marquage lu) » | la policy `self can update last_read_at` existe (`user_id = auth.uid()` en USING et en CHECK) ; grant UPDATE limité à la colonne `last_read_at` | **Faux** : couvert, et impossible de changer de conversation ou de rôle |
| « `get_user_conversations_v4` = IDOR » | le corps utilise `v_uid := auth.uid()` et **ignore** `p_user_id` ; sonde anon avec l'UUID de l'admin → `200 []` | **Corrigé** |
| « Les vues sans `security_invoker` contournent la RLS » | SELECT révoqué (sondes 401) ; `pg_relation_is_updatable = 0`, donc les grants IUD restants sont inopérants | **Neutralisé** |
| Colonnes sensibles de `profiles` via REST | `select=role`, `stripe_customer_id`, `ban_reason`, `birth_date…`, `*` → tous en 42501 | **OK** en REST (fuite uniquement via C1) |
| `articles.content` en lecture directe | `select=content` → 42501 ; `get_article` sur un article `philosophical` en anon → `has_access:false`, `content_truncated:true` | **OK** : paywall serveur effectif |
| `get_article_full` pour anon | renvoie `[]` (retour immédiat si `auth.uid()` est NULL) | **OK** |
| Policies UPDATE sans `WITH CHECK` (`ecole_scores`, `forum_posts`, `profile_gallery`, `push_subscriptions`…) | PostgreSQL réutilise le `USING` comme `WITH CHECK` quand ce dernier est absent | **Pas de transfert de propriété possible** (hors cas M2, où le USING lui-même est trop large) |
| `chat_messages` : changer `conversation_id` ou `sender_id` par UPDATE | grant UPDATE limité à `content, deleted_*, edited_*` | **OK** |
| Escalade `profiles.role` par l'utilisateur lui-même | trigger `protect_profile_privileged_fields` (SD, `search_path=''`) remet `role`, `ban_*`, `stripe_*`, `subscription_*`, `temp_admin_*`, `deleted_*` à `OLD` pour tout non-admin | **OK** (sauf `staff_badge`, M5-1) |
| Injection de `search_path` dans les fonctions SD | `anon` et `authenticated` n'ont `CREATE` ni sur `public` ni sur `extensions` | **Risque théorique** (m3) |
| Tableaux vides en anon | nombre réel de lignes vérifié : `chat_messages` 45, `chat_participants` 9, `family_tree` 10, `admin_notes` 6, `moderation_reports` 4, `temp_admin_grants` 2… | `[]` = **la RLS filtre**, pas une table vide. Tables réellement vides : `article_likes`, `chat_subscriptions`, `community_pins`, `contribution_requests`, `langue_progress`, `push_subscriptions`. Pour celles-ci, le verdict repose sur l'expression de la policy. |
| `profile_gallery` (éléments privés ou de groupe) | 0 élément non public en base ; les policies limitent aux propriétaires ou aux participants | **OK** |
| `ecole_semantic_cache` lisible publiquement | contenu pédagogique, colonne `query` NULL | **Voulu** |

---

## 4. Hors périmètre / limites
- **Écritures non sondées** (contrainte lecture seule) : M1, M2, M5 et m4 sont prouvés par l'expression des policies et les grants, **pas** par une écriture réelle.
- C2, côté écriture, est prouvé en évaluant l'expression exacte des policies en `authenticated` (42501), pas par un UPDATE réel.
- Les 12 policies de `storage.objects` n'ont **pas** été auditées (hors schéma `public`).
- Realtime : non audité. `postgres_changes` applique la RLS de SELECT, donc C2 coupe aussi le temps réel des tables concernées.

## 5. Pistes de correction (indicatives, rien n'a été appliqué)
1. **C1** : `DROP FUNCTION public.get_profiles_debug_v1(integer)`, ou au minimum `REVOKE EXECUTE … FROM anon, authenticated, public`.
2. **C2** : remplacer dans toutes les policies les sous-requêtes `SELECT … FROM profiles WHERE … role …` par les helpers `SECURITY DEFINER` existants (`is_real_admin`, `is_admin_or_manager`, `is_admin_effectively`), ou par un helper `has_staff_role(text[])`. Sur `profiles` UPDATE, déplacer les contrôles Stripe et abonnement dans le trigger, qui les couvre déjà, et supprimer les sous-requêtes du `WITH CHECK`. **Corriger M5 dans la même migration.**
3. **M1** : `WITH CHECK (author_id = auth.uid())` et `(created_by = auth.uid())`. Bloquer `is_pinned`, `is_locked`, `*_count` et `deleted_*` côté client par grants de colonnes ou trigger. Vérifier `NOT is_locked`.
4. **M2** : `USING / WITH CHECK (auth.uid() = user_id)` sur UPDATE ; `is_verified` réservé au staff.
5. **M3** : passer `fn_handle_post_insert` et `fn_recalc_post_votes` en `SECURITY DEFINER SET search_path = ''`.
6. **M4** : SELECT `articles` limité à `status = 'published' OR author_id = auth.uid() OR staff`.
7. **m1/m2** : `REVOKE EXECUTE … FROM anon` sur les fonctions de maintenance et les oracles ; planifier `flush_temp_admins` (pg_cron) ; vérifier l'expiration partout où `temp_admin` est testé.
