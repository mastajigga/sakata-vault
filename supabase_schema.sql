-- Kisakata.com Database Schema

-- 1. Profiles (Social Layer)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  location text, -- 'Diaspora' or 'Mai-Ndombe'
  constraint username_length check (char_length(username) >= 3)
);

-- 2. Articles (Knowledge Layer)
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique not null,
  content text,
  summary text,
  category text check (category in ('langue', 'culture', 'spiritualite', 'histoire')),
  author_id uuid references profiles(id),
  featured_image text,
  audio_url text,
  video_url text,
  forum_thread_id uuid -- defined later by trigger or manual link
);

-- 3. Forum Threads
create table if not exists forum_threads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  created_by uuid references profiles(id),
  article_id uuid references articles(id) on delete set null
);

-- 4. Forum Posts
create table if not exists forum_posts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  thread_id uuid references forum_threads(id) on delete cascade,
  author_id uuid references profiles(id),
  content text not null,
  media_url text -- for sharing photos/videos in forum
);

-- Enable RLS
alter table profiles enable row level security;
alter table articles enable row level security;
alter table forum_threads enable row level security;
alter table forum_posts enable row level security;

-- Simple Policies (Expand later)
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

create policy "Articles are viewable by everyone." on articles for select using (true);

create policy "Threads are viewable by everyone." on forum_threads for select using (true);
create policy "Authenticated users can create threads." on forum_threads for insert with check (auth.role() = 'authenticated');

create policy "Posts are viewable by everyone." on forum_posts for select using (true);
create policy "Authenticated users can post." on forum_posts for insert with check (auth.role() = 'authenticated');

-- Trigger : Auto-create forum thread for new articles
CREATE OR REPLACE FUNCTION public.handle_new_article_thread() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.forum_threads (id, title, slug, created_by, article_id, category_id, is_pinned, is_locked)
    VALUES (gen_random_uuid(), 'Discussion : ' || (NEW.title->>'fr'), NEW.slug, NEW.author_id, NEW.id, (SELECT id FROM public.forum_categories WHERE slug = 'culture-savoir' LIMIT 1), false, false);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_article_created ON public.articles;
CREATE TRIGGER on_article_created AFTER INSERT ON public.articles FOR EACH ROW EXECUTE PROCEDURE public.handle_new_article_thread();
