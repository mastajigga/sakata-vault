-- Migration langue_progress + RPC atomique — APPLIQUÉE le 2026-10-06 sur le projet Supabase `slbnjjgparojkvxbsdzn` (kisakata).
-- Vérifié en direct : table + 3 policies RLS actives, anon sans aucun droit, `save_langue_progress` accessible aux seuls `authenticated`, rejette les non-authentifiés (42501).
begin;

create table public.langue_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed_lessons text[] not null default '{}',
  current_niveau text not null default 'goutte-rosee',
  score bigint not null default 0 check (score >= 0),
  streak bigint not null default 0 check (streak >= 0),
  updated_at timestamptz not null default now()
);

alter table public.langue_progress enable row level security;
create policy langue_progress_select_own on public.langue_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy langue_progress_insert_own on public.langue_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy langue_progress_update_own on public.langue_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.langue_progress from anon, authenticated;
grant select, insert, update on public.langue_progress to authenticated;

create function public.save_langue_progress(
  p_completed_lesson text default null,
  p_current_niveau text default null,
  p_score_increment integer default 0,
  p_streak_update integer default null
) returns public.langue_progress
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_progress public.langue_progress;
  v_new_lesson boolean;
begin
  if v_user_id is null then
    raise exception 'Non authentifié' using errcode = '42501';
  end if;
  if p_score_increment is null or p_score_increment < 0 or p_score_increment > 100000
     or (p_streak_update is not null and p_streak_update not in (0, 1))
     or (p_completed_lesson is not null and btrim(p_completed_lesson) = '')
     or (p_current_niveau is not null and btrim(p_current_niveau) = '') then
    raise exception 'Progression invalide' using errcode = '22023';
  end if;

  -- Le conflit de PK sérialise aussi les premières sauvegardes simultanées.
  insert into public.langue_progress (user_id) values (v_user_id)
    on conflict (user_id) do nothing;
  select * into strict v_progress from public.langue_progress
    where user_id = v_user_id for update;

  v_new_lesson := p_completed_lesson is not null
    and not (p_completed_lesson = any(v_progress.completed_lessons));
  -- Rejouer une leçon après une réponse réseau perdue est sans effet.
  if p_completed_lesson is not null and not v_new_lesson then
    return v_progress;
  end if;

  update public.langue_progress set
    completed_lessons = case when v_new_lesson
      then array_append(v_progress.completed_lessons, p_completed_lesson)
      else v_progress.completed_lessons end,
    current_niveau = coalesce(p_current_niveau, v_progress.current_niveau),
    score = v_progress.score + p_score_increment + case when v_new_lesson then 10 else 0 end,
    streak = case p_streak_update when 1 then v_progress.streak + 1
      when 0 then 0 else v_progress.streak end,
    updated_at = now()
  where user_id = v_user_id returning * into v_progress;
  return v_progress;
end;
$$;

revoke all on function public.save_langue_progress(text, text, integer, integer) from public, anon;
grant execute on function public.save_langue_progress(text, text, integer, integer) to authenticated;

commit;
