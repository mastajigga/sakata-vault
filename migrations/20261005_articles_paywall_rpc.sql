-- =============================================================================
-- Sakata — Correctif paywall des articles
-- Date : 2026-10-05
-- À appliquer MANUELLEMENT (SQL Editor Supabase, projet slbnjjgparojkvxbsdzn).
-- Idempotent : peut être rejoué sans effet de bord.
--
-- Problème : la policy "Anyone can view published articles" (USING status='published')
-- n'a aucune restriction de colonne → la clé anon lit `content` en entier, y compris
-- pour les articles poétiques/philosophiques. La troncature n'était faite qu'à l'écran.
--
-- Correctif :
--   1. RPC public.get_article(p_slug, p_lang) SECURITY DEFINER qui renvoie l'article
--      avec `content` tronqué côté serveur si l'appelant n'a pas le droit.
--   2. RPC public.get_article_full(p_slug, p_id) pour l'édition (staff + auteur).
--   3. REVOKE SELECT (content) pour anon/authenticated (les autres colonnes restent
--      lisibles, RLS inchangée).
--
-- Règles d'accès reproduites à l'identique de src/app/savoir/[slug]/ArticleClient.tsx
-- (lignes 156-177) :
--   article_type := article_type, sinon (is_premium ? 'poetic' : 'summary')
--   premium      := article_type IN ('poetic','philosophical')
--   staff        := profiles.role IN ('admin','manager','contributor','moderator','temp_admin')
--   abonné       := profiles.subscription_tier IN ('premium','elite')
--   accès        := NOT premium OR staff OR abonné
--   troncature   : texte > 500 caractères → 500 premiers + '...'
--                  tableau de blocs > 3   → 3 premiers blocs
-- La troncature est appliquée à CHAQUE langue de `content` ({fr: ..., en: ...}).
-- Les contenus « structurés » stockés en chaîne JSON ('[{...}]') sont décodés puis
-- tronqués à 3 blocs (le client les rend comme des blocs).
--
-- Les colonnes de `articles` sont lues via to_jsonb(row) : aucune dépendance au
-- schéma exact (article_type / is_premium peuvent manquer sans casser la fonction).
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 0. Helper : droit de lire le contenu premium (même règle que le client)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.can_read_premium_articles(p_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT p_uid IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = p_uid
      AND (
        p.role IN ('admin', 'manager', 'contributor', 'moderator', 'temp_admin')
        OR p.subscription_tier IN ('premium', 'elite')
      )
  );
$$;

REVOKE ALL ON FUNCTION public.can_read_premium_articles(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_read_premium_articles(uuid) TO service_role;

-- -----------------------------------------------------------------------------
-- 1. Helper : troncature d'une valeur de contenu (une langue)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.truncate_article_content_value(p_value jsonb)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public, pg_temp
AS $$
DECLARE
  v_text   text;
  v_parsed jsonb;
BEGIN
  IF p_value IS NULL THEN
    RETURN NULL;
  END IF;

  IF jsonb_typeof(p_value) = 'array' THEN
    IF jsonb_array_length(p_value) > 3 THEN
      RETURN (SELECT jsonb_agg(e ORDER BY i)
              FROM jsonb_array_elements(p_value) WITH ORDINALITY AS t(e, i)
              WHERE i <= 3);
    END IF;
    RETURN p_value;
  END IF;

  IF jsonb_typeof(p_value) = 'string' THEN
    v_text := p_value #>> '{}';

    -- Contenu structuré sérialisé en chaîne ("[...]") → décoder et couper à 3 blocs
    IF left(ltrim(v_text), 1) = '[' THEN
      BEGIN
        v_parsed := v_text::jsonb;
      EXCEPTION WHEN others THEN
        v_parsed := NULL;
      END;
      IF v_parsed IS NOT NULL AND jsonb_typeof(v_parsed) = 'array' THEN
        RETURN public.truncate_article_content_value(v_parsed);
      END IF;
    END IF;

    IF char_length(v_text) > 500 THEN
      RETURN to_jsonb(left(v_text, 500) || '...');
    END IF;
    RETURN p_value;
  END IF;

  -- Objet / autre type inattendu : on ne divulgue rien
  RETURN NULL;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. RPC publique : get_article(p_slug, p_lang)
--    - Uniquement les articles publiés (comme la policy publique) — sauf auteur/staff
--      qui peuvent prévisualiser leurs brouillons (comme les policies existantes).
--    - p_lang NULL → toutes les langues ; sinon seulement p_lang + 'fr' (fallback client).
--    - Renvoie jsonb : toutes les colonnes publiques + content (éventuellement tronqué)
--      + has_access (bool) + content_truncated (bool).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_article(p_slug text, p_lang text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid        uuid := auth.uid();
  v_row        jsonb;
  v_type       text;
  v_premium    boolean;
  v_is_staff   boolean := false;
  v_is_author  boolean;
  v_access     boolean;
  v_content    jsonb;
  v_out        jsonb := '{}'::jsonb;
  v_key        text;
  v_val        jsonb;
BEGIN
  IF p_slug IS NULL OR length(p_slug) = 0 OR length(p_slug) > 300 THEN
    RETURN NULL;
  END IF;

  SELECT to_jsonb(a.*) INTO v_row
  FROM public.articles a
  WHERE a.slug = p_slug
  LIMIT 1;

  IF v_row IS NULL THEN
    RETURN NULL;
  END IF;

  -- Articles supprimés (soft delete) : invisibles
  IF v_row ? 'deleted_at' AND v_row->>'deleted_at' IS NOT NULL THEN
    RETURN NULL;
  END IF;

  IF v_uid IS NOT NULL THEN
    SELECT p.role IN ('admin', 'manager', 'contributor', 'moderator', 'temp_admin')
      INTO v_is_staff
    FROM public.profiles p
    WHERE p.id = v_uid;
    v_is_staff := coalesce(v_is_staff, false);
  END IF;
  v_is_author := v_uid IS NOT NULL AND (v_row->>'author_id') = v_uid::text;

  -- Visibilité de la ligne : publié, ou brouillon visible par son auteur / le staff
  IF coalesce(v_row->>'status', '') <> 'published' AND NOT (v_is_author OR v_is_staff) THEN
    RETURN NULL;
  END IF;

  -- Règle d'accès (identique à ArticleClient.tsx)
  v_type := coalesce(
    nullif(v_row->>'article_type', ''),
    CASE WHEN coalesce((v_row->>'is_premium')::boolean, false) THEN 'poetic' ELSE 'summary' END
  );
  v_premium := v_type IN ('poetic', 'philosophical');
  v_access  := NOT v_premium
               OR v_is_author
               OR public.can_read_premium_articles(v_uid);

  -- Filtrage par langue (p_lang + fallback 'fr')
  v_content := v_row->'content';
  IF v_content IS NOT NULL AND jsonb_typeof(v_content) = 'object' THEN
    FOR v_key, v_val IN SELECT key, value FROM jsonb_each(v_content) LOOP
      IF p_lang IS NULL OR v_key = p_lang OR v_key = 'fr' THEN
        v_out := v_out || jsonb_build_object(
          v_key,
          CASE WHEN v_access THEN v_val ELSE public.truncate_article_content_value(v_val) END
        );
      END IF;
    END LOOP;
    v_content := v_out;
  ELSIF v_content IS NOT NULL AND NOT v_access THEN
    v_content := public.truncate_article_content_value(v_content);
  END IF;

  RETURN (v_row - 'content' - 'auto_approved_users' - 'rejection_reason')
         || jsonb_build_object(
              'content', v_content,
              'article_type', v_type,
              'has_access', v_access,
              'content_truncated', NOT v_access
            );
END;
$$;

REVOKE ALL ON FUNCTION public.get_article(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_article(text, text) TO anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 3. RPC d'édition : get_article_full(p_slug, p_id)
--    Ligne complète (content inclus) réservée au staff éditorial et à l'auteur.
--    Remplace les select("*") de l'admin (/admin/content, /admin/content/[slug],
--    /admin/article/[id]/review) qui ne peuvent plus lire `content` directement.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_article_full(p_slug text DEFAULT NULL, p_id uuid DEFAULT NULL)
RETURNS SETOF public.articles
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_uid      uuid := auth.uid();
  v_is_staff boolean := false;
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  SELECT p.role IN ('admin', 'manager', 'contributor', 'moderator', 'temp_admin')
    INTO v_is_staff
  FROM public.profiles p
  WHERE p.id = v_uid;

  RETURN QUERY
  SELECT a.*
  FROM public.articles a
  WHERE (p_slug IS NULL OR a.slug = p_slug)
    AND (p_id IS NULL OR a.id = p_id)
    AND (coalesce(v_is_staff, false) OR a.author_id = v_uid)
  ORDER BY a.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_article_full(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_article_full(text, uuid) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 4. Privilèges de colonne : plus de SELECT (content) pour anon / authenticated
--    Un GRANT SELECT au niveau table l'emporterait sur un REVOKE de colonne :
--    on retire donc le SELECT table puis on ré-accorde colonne par colonne
--    (liste calculée dynamiquement = toutes les colonnes sauf `content`).
--    INSERT / UPDATE / DELETE ne sont pas touchés (RLS inchangée).
--    service_role conserve tous les droits.
-- -----------------------------------------------------------------------------
REVOKE SELECT ON public.articles FROM anon, authenticated;

DO $$
DECLARE
  v_cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position)
    INTO v_cols
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'articles'
    AND column_name <> 'content';

  EXECUTE format('GRANT SELECT (%s) ON public.articles TO anon, authenticated', v_cols);
END;
$$;

GRANT SELECT ON public.articles TO service_role;

COMMIT;

-- Vérifications après application (à lancer à la main) :
--   SELECT grantee, column_name FROM information_schema.column_privileges
--    WHERE table_name = 'articles' AND privilege_type = 'SELECT'
--      AND grantee IN ('anon','authenticated') AND column_name = 'content';   -- → 0 ligne
--   SET ROLE anon; SELECT content FROM public.articles LIMIT 1;              -- → permission denied
--   RESET ROLE;
--   SELECT public.get_article('<slug-poetique>', NULL);                       -- → content tronqué
--
-- ⚠️ Toute nouvelle colonne ajoutée à `articles` après ce script ne sera PAS lisible
--    par anon/authenticated tant qu'on ne relance pas le bloc DO ci-dessus
--    (ou un GRANT SELECT (nouvelle_colonne) explicite).

-- =============================================================================
-- RETOUR ARRIÈRE (rollback) — à exécuter seulement pour annuler ce correctif.
-- ⚠️ Rouvre la fuite du contenu premium ; déployer d'abord une version du front
--    qui ne dépend plus de get_article / get_article_full, ou les garder en place.
-- -----------------------------------------------------------------------------
-- BEGIN;
--   GRANT SELECT ON public.articles TO anon, authenticated;
--   DROP FUNCTION IF EXISTS public.get_article(text, text);
--   DROP FUNCTION IF EXISTS public.get_article_full(text, uuid);
--   DROP FUNCTION IF EXISTS public.truncate_article_content_value(jsonb);
--   DROP FUNCTION IF EXISTS public.can_read_premium_articles(uuid);
-- COMMIT;
-- =============================================================================
