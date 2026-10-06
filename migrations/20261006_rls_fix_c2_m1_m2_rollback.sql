-- ROLLBACK audit RLS (état AVANT correctif C2/M1/M2)
begin;
drop policy if exists "Only admins can view analytics" on public."site_analytics";
create policy "Only admins can view analytics" on public."site_analytics" for select to public using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))));

drop policy if exists "Admins can update all profiles" on public."profiles";
create policy "Admins can update all profiles" on public."profiles" for update to public using ((EXISTS ( SELECT 1
   FROM profiles profiles_1
  WHERE ((profiles_1.id = auth.uid()) AND (profiles_1.role = 'admin'::user_role)))));

drop policy if exists "Contributors can manage articles" on public."articles";
create policy "Contributors can manage articles" on public."articles" for all to public using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'contributor'::user_role]))))));

drop policy if exists "Categories manageable by admins" on public."forum_categories";
create policy "Categories manageable by admins" on public."forum_categories" for all to public using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role]))))));

drop policy if exists "Authenticated users can create threads" on public."forum_threads";
create policy "Authenticated users can create threads" on public."forum_threads" for insert to public with check ((auth.uid() IS NOT NULL));

drop policy if exists "Users can update own threads or admins can" on public."forum_threads";
create policy "Users can update own threads or admins can" on public."forum_threads" for update to public using (((auth.uid() = created_by) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role])))))));

drop policy if exists "Authenticated users can create posts" on public."forum_posts";
create policy "Authenticated users can create posts" on public."forum_posts" for insert to public with check ((auth.uid() IS NOT NULL));

drop policy if exists "Users can delete own posts or admins can" on public."forum_posts";
create policy "Users can delete own posts or admins can" on public."forum_posts" for delete to public using (((auth.uid() = author_id) OR (EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role])))))));

drop policy if exists "Enable read for admins only" on public."site_analytics";
create policy "Enable read for admins only" on public."site_analytics" for select to public using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = 'admin'::user_role)))));

drop policy if exists "Users can update own profile" on public."profiles";
create policy "Users can update own profile" on public."profiles" for update to public using ((auth.uid() = id)) with check (((auth.uid() = id) AND (NOT (stripe_customer_id IS DISTINCT FROM ( SELECT profiles_1.stripe_customer_id
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (NOT (stripe_subscription_id IS DISTINCT FROM ( SELECT profiles_1.stripe_subscription_id
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (NOT (subscription_tier IS DISTINCT FROM ( SELECT profiles_1.subscription_tier
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (NOT (subscription_status IS DISTINCT FROM ( SELECT profiles_1.subscription_status
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid())))) AND (NOT (subscription_end_date IS DISTINCT FROM ( SELECT profiles_1.subscription_end_date
   FROM profiles profiles_1
  WHERE (profiles_1.id = auth.uid()))))));

drop policy if exists "Admins can view all requests" on public."contribution_requests";
create policy "Admins can view all requests" on public."contribution_requests" for select to public using ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role));

drop policy if exists "Admins can update all requests" on public."contribution_requests";
create policy "Admins can update all requests" on public."contribution_requests" for update to public using ((( SELECT profiles.role
   FROM profiles
  WHERE (profiles.id = auth.uid())) = 'admin'::user_role));

drop policy if exists "community_pins_update" on public."community_pins";
create policy "community_pins_update" on public."community_pins" for update to public using ((auth.uid() IS NOT NULL));

drop policy if exists "reports_read_admin" on public."moderation_reports";
create policy "reports_read_admin" on public."moderation_reports" for select to authenticated using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role]))))));

drop policy if exists "reports_update_admin" on public."moderation_reports";
create policy "reports_update_admin" on public."moderation_reports" for update to authenticated using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role]))))));

drop policy if exists "moderation_logs_select_staff" on public."moderation_logs";
create policy "moderation_logs_select_staff" on public."moderation_logs" for select to public using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'moderator'::user_role, 'temp_admin'::user_role]))))));

drop policy if exists "moderation_logs_insert_staff" on public."moderation_logs";
create policy "moderation_logs_insert_staff" on public."moderation_logs" for insert to public with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'moderator'::user_role, 'temp_admin'::user_role]))))));

drop policy if exists "moderation_warnings_select_self_or_staff" on public."moderation_warnings";
create policy "moderation_warnings_select_self_or_staff" on public."moderation_warnings" for select to public using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'moderator'::user_role, 'temp_admin'::user_role])))))));

drop policy if exists "moderation_warnings_insert_staff" on public."moderation_warnings";
create policy "moderation_warnings_insert_staff" on public."moderation_warnings" for insert to public with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'moderator'::user_role, 'temp_admin'::user_role]))))));

drop policy if exists "subscription_grants_select_own_or_staff" on public."subscription_grants";
create policy "subscription_grants_select_own_or_staff" on public."subscription_grants" for select to public using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'temp_admin'::user_role])))))));

drop policy if exists "subscription_grants_insert_staff" on public."subscription_grants";
create policy "subscription_grants_insert_staff" on public."subscription_grants" for insert to public with check ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'temp_admin'::user_role]))))));

drop policy if exists "subscription_grants_update_self_ack_or_staff" on public."subscription_grants";
create policy "subscription_grants_update_self_ack_or_staff" on public."subscription_grants" for update to public using (((user_id = auth.uid()) OR (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role = ANY (ARRAY['admin'::user_role, 'manager'::user_role, 'temp_admin'::user_role])))))));

commit;
