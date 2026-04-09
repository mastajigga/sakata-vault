create table if not exists public.ecole_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  year_slug text not null,
  completed_exercises text[] not null default '{}',
  mastery_score integer not null default 0,
  last_activity_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, year_slug)
);

create table if not exists public.ecole_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  year_slug text not null,
  exercise_id text not null,
  submitted_answer text,
  is_correct boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at_ecole_progress()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at_ecole_progress on public.ecole_progress;
create trigger trg_set_updated_at_ecole_progress
before update on public.ecole_progress
for each row
execute function public.set_updated_at_ecole_progress();

alter table public.ecole_progress enable row level security;
alter table public.ecole_attempts enable row level security;

drop policy if exists "Users can read their school progress" on public.ecole_progress;
create policy "Users can read their school progress"
on public.ecole_progress
for select
using (auth.uid() = user_id);

drop policy if exists "Users can write their school progress" on public.ecole_progress;
create policy "Users can write their school progress"
on public.ecole_progress
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read their school attempts" on public.ecole_attempts;
create policy "Users can read their school attempts"
on public.ecole_attempts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their school attempts" on public.ecole_attempts;
create policy "Users can create their school attempts"
on public.ecole_attempts
for insert
with check (auth.uid() = user_id);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.ecole_progress;
    exception
      when duplicate_object then null;
    end;
  end if;
end $$;
