-- 2026-10-06 — Correctif RLS Sakata : régression C2 (lecture profiles par les policies)
--   + M1 (usurpation d'auteur à l'insert forum) + M2 (community_pins update).
-- Rollback : migrations/20261006_rls_fix_c2_m1_m2_rollback.sql
-- Correctif C2 (régression 6457eb2) + M1 + M2 — généré le 2026-10-06
begin;

-- Helper SD : rôle de l'appelant. AUCUN paramètre -> pas d'oracle d'énumération.
create or replace function public.has_role(p_roles text[])
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role::text = any(p_roles));
$$;
revoke all on function public.has_role(text[]) from public;
grant execute on function public.has_role(text[]) to anon, authenticated;

-- ===== C2 : réécriture des policies qui lisaient profiles (régression 42501) =====
drop policy if exists "Contributors can manage articles" on public."articles";
create policy "Contributors can manage articles" on public.articles for all to public
  using (public.has_role(array['admin','manager','contributor']));
drop policy if exists "Admins can view all requests" on public."contribution_requests";
create policy "Admins can view all requests" on public.contribution_requests for select to public
  using (public.has_role(array['admin']));
drop policy if exists "Admins can update all requests" on public."contribution_requests";
create policy "Admins can update all requests" on public.contribution_requests for update to public
  using (public.has_role(array['admin']));
drop policy if exists "Categories manageable by admins" on public."forum_categories";
create policy "Categories manageable by admins" on public.forum_categories for all to public
  using (public.has_role(array['admin','manager']));
drop policy if exists "Users can delete own posts or admins can" on public."forum_posts";
create policy "Users can delete own posts or admins can" on public.forum_posts for delete to public
  using ((auth.uid() = author_id) or public.has_role(array['admin','manager']));
drop policy if exists "Users can update own threads or admins can" on public."forum_threads";
create policy "Users can update own threads or admins can" on public.forum_threads for update to public
  using ((auth.uid() = created_by) or public.has_role(array['admin','manager']));
drop policy if exists "moderation_logs_insert_staff" on public."moderation_logs";
create policy "moderation_logs_insert_staff" on public.moderation_logs for insert to public
  with check (public.has_role(array['admin','manager','moderator','temp_admin']));
drop policy if exists "moderation_logs_select_staff" on public."moderation_logs";
create policy "moderation_logs_select_staff" on public.moderation_logs for select to public
  using (public.has_role(array['admin','manager','moderator','temp_admin']));
drop policy if exists "reports_read_admin" on public."moderation_reports";
create policy "reports_read_admin" on public.moderation_reports for select to authenticated
  using (public.has_role(array['admin','manager']));
drop policy if exists "reports_update_admin" on public."moderation_reports";
create policy "reports_update_admin" on public.moderation_reports for update to authenticated
  using (public.has_role(array['admin','manager']));
drop policy if exists "moderation_warnings_insert_staff" on public."moderation_warnings";
create policy "moderation_warnings_insert_staff" on public.moderation_warnings for insert to public
  with check (public.has_role(array['admin','manager','moderator','temp_admin']));
drop policy if exists "moderation_warnings_select_self_or_staff" on public."moderation_warnings";
create policy "moderation_warnings_select_self_or_staff" on public.moderation_warnings for select to public
  using ((user_id = auth.uid()) or public.has_role(array['admin','manager','moderator','temp_admin']));
drop policy if exists "Users can update own profile" on public."profiles";
create policy "Users can update own profile" on public.profiles for update to public
  using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "Admins can update all profiles" on public."profiles";
create policy "Admins can update all profiles" on public.profiles for update to public
  using (public.has_role(array['admin'])) with check (public.has_role(array['admin']));
drop policy if exists "Only admins can view analytics" on public."site_analytics";
create policy "Only admins can view analytics" on public.site_analytics for select to public
  using (public.has_role(array['admin']));
drop policy if exists "Enable read for admins only" on public."site_analytics";
create policy "Enable read for admins only" on public.site_analytics for select to public
  using (public.has_role(array['admin']));
drop policy if exists "subscription_grants_insert_staff" on public."subscription_grants";
create policy "subscription_grants_insert_staff" on public.subscription_grants for insert to public
  with check (public.has_role(array['admin','manager','temp_admin']));
drop policy if exists "subscription_grants_select_own_or_staff" on public."subscription_grants";
create policy "subscription_grants_select_own_or_staff" on public.subscription_grants for select to public
  using ((user_id = auth.uid()) or public.has_role(array['admin','manager','temp_admin']));
drop policy if exists "subscription_grants_update_self_ack_or_staff" on public."subscription_grants";
create policy "subscription_grants_update_self_ack_or_staff" on public.subscription_grants for update to public
  using ((user_id = auth.uid()) or public.has_role(array['admin','manager','temp_admin']));

-- ===== M1 : usurpation d'auteur à l'INSERT forum =====
drop policy if exists "Authenticated users can create posts" on public."forum_posts";
create policy "Authenticated users can create posts" on public.forum_posts for insert to public
  with check (auth.uid() is not null and author_id = auth.uid());
drop policy if exists "Authenticated users can create threads" on public."forum_threads";
create policy "Authenticated users can create threads" on public.forum_threads for insert to public
  with check (auth.uid() is not null and created_by = auth.uid());

-- ===== M2 : n'importe quel connecté modifiait n'importe quel pin =====
drop policy if exists "community_pins_update" on public."community_pins";
create policy "community_pins_update" on public.community_pins for update to public
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

commit;
