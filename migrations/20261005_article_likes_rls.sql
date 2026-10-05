-- =============================================================================
-- Sakata — Sécurisation de la table article_likes (RLS)
-- Date : 2026-10-05
-- À APPLIQUER MANUELLEMENT (SQL Editor Supabase, projet slbnjjgparojkvxbsdzn).
-- Idempotent : peut être rejoué sans effet de bord.
--
-- PROBLÈME
-- `public.article_likes` a la RLS DÉSACTIVÉE et aucune politique. La clé anon
-- (embarquée dans le site ET dans l'APK, donc publique) peut lire, INSÉRER et
-- SUPPRIMER n'importe quelle ligne. Un visiteur non connecté pourrait donc
-- effacer les « j'aime » de tout le monde, ou en insérer au nom d'autrui.
-- La table est vide aujourd'hui (0 ligne) : le risque est nul pour l'instant,
-- mais il devient réel dès que la fonctionnalité est utilisée.
--
-- CORRECTIF
-- Activer la RLS et poser les politiques minimales reproduisant l'usage réel,
-- vérifié dans le code :
--   * src/components/LikeButton.tsx
--       - lit SON propre like       : SELECT où user_id = auth.uid()
--       - insère SON like           : INSERT (article_id, user_id)
--       - supprime SON like         : DELETE où user_id = auth.uid()
--   * src/app/contributeur/page.tsx
--       - un contributeur COMPTE les likes reçus sur SES articles ; ces lignes
--         ont été écrites par D'AUTRES utilisateurs. Une lecture restreinte à
--         ses propres lignes fausserait donc ce compteur.
--
-- DÉCISION
-- Lecture PUBLIQUE (l'information « combien de j'aime » est publique et doit
-- rester comptable, y compris sur les articles d'autrui), écriture strictement
-- limitée à ses propres lignes.
--
-- RAPPEL : le rôle `service_role` contourne la RLS — les routes serveur et les
-- crons ne sont pas affectés.
-- =============================================================================

alter table public.article_likes enable row level security;

-- ---------------------------------------------------------------------------
-- Lecture : publique (comptage des likes, y compris sur les articles d'autrui)
-- ---------------------------------------------------------------------------
drop policy if exists "article_likes_select_public" on public.article_likes;
create policy "article_likes_select_public"
  on public.article_likes
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Insertion : uniquement pour soi-même, et seulement sur un article identifié
-- ---------------------------------------------------------------------------
drop policy if exists "article_likes_insert_self" on public.article_likes;
create policy "article_likes_insert_self"
  on public.article_likes
  for insert
  to authenticated
  with check (auth.uid() = user_id and article_id is not null);

-- ---------------------------------------------------------------------------
-- Suppression : uniquement ses propres likes
-- ---------------------------------------------------------------------------
drop policy if exists "article_likes_delete_self" on public.article_likes;
create policy "article_likes_delete_self"
  on public.article_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Aucune politique UPDATE : la table n'est jamais mise à jour (le code ne fait
-- qu'insérer et supprimer). Sans politique, l'UPDATE est refusé à tout le monde.
-- ---------------------------------------------------------------------------

-- =============================================================================
-- VÉRIFICATION APRÈS APPLICATION (à exécuter, doit renvoyer 0 ligne) :
--
--   select * from public.article_likes;           -- doit être illisible en anon
--                                                -- si vide, tester l'insertion
--
-- Contrôle de non-régression à faire depuis un compte connecté :
--   1. Poser un « j'aime » → doit réussir.
--   2. Le retirer → doit réussir.
--   3. Depuis un AUTRE compte, tenter de supprimer le like du premier → doit
--      être refusé (0 ligne touchée, pas d'erreur visible côté client).
-- =============================================================================
