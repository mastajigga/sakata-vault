-- Migration: Forum Categories, Schema Updates & RLS Policies

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  description JSONB,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  "order" INT DEFAULT 0
);

-- 2. Update Threads Table
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES forum_categories(id);
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;
ALTER TABLE forum_threads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Update Posts Table
ALTER TABLE forum_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Enable RLS and define Policies

-- Categories: Read for all, Write for Admins/Managers
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON forum_categories;
CREATE POLICY "Categories are viewable by everyone" ON forum_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categories manageable by admins" ON forum_categories;
CREATE POLICY "Categories manageable by admins" ON forum_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Threads: Read for all, Insert for Auth, Update for Owner or Admins
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Threads are viewable by everyone" ON forum_threads;
CREATE POLICY "Threads are viewable by everyone" ON forum_threads FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create threads" ON forum_threads;
CREATE POLICY "Authenticated users can create threads" ON forum_threads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own threads or admins can" ON forum_threads;
CREATE POLICY "Users can update own threads or admins can" ON forum_threads FOR UPDATE USING (
  auth.uid() = created_by OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Posts: Read for all, Insert for Auth, Update for Owner, Delete for Owner/Admins
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON forum_posts;
CREATE POLICY "Posts are viewable by everyone" ON forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON forum_posts;
CREATE POLICY "Authenticated users can create posts" ON forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can update own posts" ON forum_posts;
CREATE POLICY "Users can update own posts" ON forum_posts FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own posts or admins can" ON forum_posts;
CREATE POLICY "Users can delete own posts or admins can" ON forum_posts FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Note: In a real system, you'd insert default categories here if empty.
INSERT INTO forum_categories (name, slug, icon, description, "order")
VALUES 
  ('{"fr": "Culture & Savoir", "en": "Culture & Knowledge"}', 'culture-savoir', 'book', '{"fr": "Discussions sur l''héritage Sakata", "en": "Discussions about Sakata heritage"}', 1),
  ('{"fr": "Initiations", "en": "Initiations"}', 'initiations', 'flame', '{"fr": "Concepts et mystères desrites initiatiques", "en": "Concepts and mysteries of initiatory rites"}', 2),
  ('{"fr": "Mboka (Le Village)", "en": "Mboka (The Village)"}', 'mboka', 'users', '{"fr": "Discussions générales de la communauté", "en": "General community discussions"}', 3)
ON CONFLICT (slug) DO NOTHING;
