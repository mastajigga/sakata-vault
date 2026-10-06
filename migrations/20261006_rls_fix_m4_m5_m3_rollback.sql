-- ROLLBACK lot M4/M5/M3 (2026-10-06)
begin;
drop trigger if exists subscription_grants_protect on public.subscription_grants;
drop trigger if exists moderation_warnings_protect on public.moderation_warnings;
drop function if exists public.protect_subscription_grant_fields();
drop function if exists public.protect_moderation_warning_fields();
drop policy if exists "Articles are viewable by everyone" on public."articles";
create policy "Articles are viewable by everyone" on public."articles" for select to public using (true);
drop policy if exists "Contributors can manage articles" on public."articles";
create policy "Contributors can manage articles" on public."articles" for all to public using (has_role(ARRAY['admin'::text, 'manager'::text, 'contributor'::text]));
drop policy if exists "Users can insert own requests" on public."contribution_requests";
create policy "Users can insert own requests" on public."contribution_requests" for insert to public with check ((auth.uid() = user_id));
CREATE OR REPLACE FUNCTION public.fn_handle_post_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  parent_author_id UUID;
  parent_thread_id UUID;
  parent_depth INT;
  computed_depth INT;
BEGIN
  IF NEW.parent_post_id IS NOT NULL THEN
    -- Récupérer info parent
    SELECT author_id, thread_id, depth
    INTO parent_author_id, parent_thread_id, parent_depth
    FROM forum_posts WHERE id = NEW.parent_post_id;

    -- Calculer depth (max 3)
    computed_depth := LEAST(parent_depth + 1, 3);

    -- Update depth si différent
    IF NEW.depth != computed_depth THEN
      UPDATE forum_posts SET depth = computed_depth WHERE id = NEW.id;
    END IF;

    -- Incrémenter reply_count parent
    UPDATE forum_posts
    SET reply_count = reply_count + 1
    WHERE id = NEW.parent_post_id;

    -- Notification si auteur différent
    IF parent_author_id IS NOT NULL AND parent_author_id != NEW.author_id THEN
      INSERT INTO forum_notifications (recipient_id, actor_id, thread_id, post_id, type)
      VALUES (parent_author_id, NEW.author_id, parent_thread_id, NEW.id, 'reply');
    END IF;
  END IF;

  RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.fn_recalc_post_votes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.post_id, OLD.post_id);

  UPDATE forum_posts
  SET
    like_count = (
      SELECT COUNT(*) FROM forum_post_votes
      WHERE post_id = target_id AND vote = 1
    ),
    dislike_count = (
      SELECT COUNT(*) FROM forum_post_votes
      WHERE post_id = target_id AND vote = -1
    )
  WHERE id = target_id;

  RETURN COALESCE(NEW, OLD);
END;
$function$

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_jwt_role text;
begin
  begin
    v_jwt_role := (current_setting('request.jwt.claims', true))::jsonb ->> 'role';
  exception when others then
    v_jwt_role := null;
  end;

  -- Contexte serveur (service_role), migration ou SQL direct : laisser passer.
  if auth.uid() is null or v_jwt_role = 'service_role' then
    return new;
  end if;

  -- Vrai administrateur : laisser passer (gère aussi les autres utilisateurs).
  if exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ) then
    return new;
  end if;

  -- Sinon : l'utilisateur ne peut PAS modifier ses champs privilégiés.
  new.role                       := old.role;
  new.contributor_status         := old.contributor_status;
  new.temp_admin_expires_at      := old.temp_admin_expires_at;
  new.temp_admin_original_role   := old.temp_admin_original_role;
  new.temp_admin_granted_by      := old.temp_admin_granted_by;
  new.banned_until               := old.banned_until;
  new.ban_reason                 := old.ban_reason;
  new.banned_by                  := old.banned_by;
  new.deleted_at                 := old.deleted_at;
  new.deleted_by                 := old.deleted_by;
  new.permanent_delete_at        := old.permanent_delete_at;
  new.deletion_reason            := old.deletion_reason;
  new.stripe_customer_id         := old.stripe_customer_id;
  new.stripe_subscription_id     := old.stripe_subscription_id;
  new.subscription_tier          := old.subscription_tier;
  new.subscription_status        := old.subscription_status;
  new.subscription_end_date      := old.subscription_end_date;
  return new;
end;
$function$

commit;
