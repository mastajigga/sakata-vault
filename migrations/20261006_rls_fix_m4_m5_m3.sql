-- 2026-10-06 — Lot 2 : M4 (brouillons privés) + M5 (1..5) + M3 (triggers forum).
-- Prérequis : lot 1 (20261006_rls_fix_c2_m1_m2.sql) déjà appliqué (helper public.has_role).
-- Rollback : migrations/20261006_rls_fix_m4_m5_m3_rollback.sql
begin;

-- ===== M4 : les brouillons ne sont plus lisibles par le public =====
drop policy if exists "Articles are viewable by everyone" on public.articles;
create policy "Articles are viewable by everyone" on public.articles for select to public
  using (status = 'published' or public.has_role(array['admin','manager','contributor']));

-- ===== M5-3 : un contributor ne gère plus TOUS les articles =====
-- NB : une policy FOR ALL accorde AUSSI le SELECT -> la clause « orphelin » doit
-- exiger un rôle éditorial, sinon anon lit tous les brouillons (erreur corrigée).
drop policy if exists "Contributors can manage articles" on public.articles;
create policy "Contributors can manage articles" on public.articles for all to public
  using ((author_id = auth.uid())
         or ((author_id is null) and public.has_role(array['admin','manager','contributor']))
         or public.has_role(array['admin','manager']))
  with check ((author_id = auth.uid())
         or ((author_id is null) and public.has_role(array['admin','manager','contributor']))
         or public.has_role(array['admin','manager']));

-- ===== M5-4 : pas de candidature déjà « approved » =====
drop policy if exists "Users can insert own requests" on public.contribution_requests;
create policy "Users can insert own requests" on public.contribution_requests for insert to public
  with check (auth.uid() = user_id and status = 'pending');

-- ===== M5-1 : FAUX POSITIF — staff_badge est une colonne GENERATED (CASE sur role) :
-- elle n'est pas écrivable, donc rien à protéger. (Aucune affectation dans le trigger.)

-- ===== M5-2 : le bénéficiaire d'une offre ne peut plus en changer les termes =====
create or replace function public.protect_subscription_grant_fields()
returns trigger language plpgsql security definer set search_path = '' as $function$
declare v_jwt_role text;
begin
  begin v_jwt_role := (current_setting('request.jwt.claims', true))::jsonb ->> 'role';
  exception when others then v_jwt_role := null; end;
  if auth.uid() is null or v_jwt_role = 'service_role' then return new; end if;
  if exists (select 1 from public.profiles p where p.id = (select auth.uid())
             and p.role::text = any(array['admin','manager','temp_admin'])) then return new; end if;
  new.user_id := old.user_id;  new.granted_by := old.granted_by;  new.tier := old.tier;
  new.expires_at := old.expires_at;  new.revoked_at := old.revoked_at;
  new.revoked_by := old.revoked_by;  new.reason := old.reason;  new.created_at := old.created_at;
  return new;
end $function$;
drop trigger if exists subscription_grants_protect on public.subscription_grants;
create trigger subscription_grants_protect before update on public.subscription_grants
  for each row execute function public.protect_subscription_grant_fields();

-- ===== M5-5 : la cible d'un avertissement ne peut que le marquer lu =====
create or replace function public.protect_moderation_warning_fields()
returns trigger language plpgsql security definer set search_path = '' as $function$
declare v_jwt_role text;
begin
  begin v_jwt_role := (current_setting('request.jwt.claims', true))::jsonb ->> 'role';
  exception when others then v_jwt_role := null; end;
  if auth.uid() is null or v_jwt_role = 'service_role' then return new; end if;
  if exists (select 1 from public.profiles p where p.id = (select auth.uid())
             and p.role::text = any(array['admin','manager','moderator','temp_admin'])) then return new; end if;
  new.user_id := old.user_id;  new.moderator_id := old.moderator_id;  new.message := old.message;
  new.related_post_id := old.related_post_id;  new.created_at := old.created_at;
  return new;   -- read_at reste modifiable par le destinataire
end $function$;
drop trigger if exists moderation_warnings_protect on public.moderation_warnings;
create trigger moderation_warnings_protect before update on public.moderation_warnings
  for each row execute function public.protect_moderation_warning_fields();

-- ===== M3 : les triggers forum redeviennent fonctionnels =====
create or replace function public.fn_handle_post_insert()
returns trigger language plpgsql security definer set search_path = '' as $function$
DECLARE parent_author_id UUID; parent_thread_id UUID; parent_depth INT; computed_depth INT;
BEGIN
  IF NEW.parent_post_id IS NOT NULL THEN
    SELECT author_id, thread_id, depth INTO parent_author_id, parent_thread_id, parent_depth
      FROM public.forum_posts WHERE id = NEW.parent_post_id;
    computed_depth := LEAST(parent_depth + 1, 3);
    IF NEW.depth IS DISTINCT FROM computed_depth THEN
      UPDATE public.forum_posts SET depth = computed_depth WHERE id = NEW.id;
    END IF;
    UPDATE public.forum_posts SET reply_count = reply_count + 1 WHERE id = NEW.parent_post_id;
    IF parent_author_id IS NOT NULL AND parent_author_id != NEW.author_id THEN
      INSERT INTO public.forum_notifications (recipient_id, actor_id, thread_id, post_id, type)
      VALUES (parent_author_id, NEW.author_id, parent_thread_id, NEW.id, 'reply');
    END IF;
  END IF;
  RETURN NEW;
END $function$;

create or replace function public.fn_recalc_post_votes()
returns trigger language plpgsql security definer set search_path = '' as $function$
DECLARE target_id UUID;
BEGIN
  target_id := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE public.forum_posts SET
    like_count = (SELECT COUNT(*) FROM public.forum_post_votes WHERE post_id = target_id AND vote = 1),
    dislike_count = (SELECT COUNT(*) FROM public.forum_post_votes WHERE post_id = target_id AND vote = -1)
  WHERE id = target_id;
  RETURN COALESCE(NEW, OLD);
END $function$;

commit;
