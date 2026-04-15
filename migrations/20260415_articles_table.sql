-- Migration: Articles Table
-- Date: 2026-04-15
-- Purpose: Full article management with rich content, images, and sources

CREATE TABLE IF NOT EXISTS public.articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title varchar NOT NULL,
  slug varchar UNIQUE NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  featured_image_url varchar,
  content jsonb NOT NULL DEFAULT '{"sections": [], "sources": []}',
  status varchar NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted_for_review', 'published', 'rejected')),
  requires_premium boolean DEFAULT false,
  auto_approved_users uuid[] DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  published_at timestamp,
  rejection_reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC) WHERE status = 'published';

-- RLS
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view own articles"
  ON public.articles FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Admins can view all articles"
  ON public.articles FOR SELECT
  USING ((SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Authors can insert own articles"
  ON public.articles FOR INSERT
  WITH CHECK (auth.uid() = author_id AND (status = 'draft' OR status = 'submitted_for_review'));

CREATE POLICY "Authors can update own articles"
  ON public.articles FOR UPDATE
  USING (auth.uid() = author_id AND status != 'published')
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can update all articles"
  ON public.articles FOR UPDATE
  USING ((SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Service role all access"
  ON public.articles FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Content structure validation function
CREATE OR REPLACE FUNCTION public.validate_article_content(content jsonb)
RETURNS boolean AS $$
BEGIN
  -- Ensure content has required structure
  IF NOT (content ? 'sections' AND content ? 'sources') THEN
    RETURN false;
  END IF;

  -- Validate sections is an array
  IF jsonb_typeof(content->'sections') != 'array' THEN
    RETURN false;
  END IF;

  -- Validate sources is an array
  IF jsonb_typeof(content->'sources') != 'array' THEN
    RETURN false;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-approve articles if author is in auto_approved_users
CREATE OR REPLACE FUNCTION public.fn_auto_approve_article()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if author is in any article's auto_approved_users list
  IF NEW.status = 'submitted_for_review' AND NEW.author_id = ANY(
    SELECT DISTINCT UNNEST(auto_approved_users) FROM articles
  ) THEN
    NEW.status = 'published';
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_article_auto_approve
BEFORE INSERT ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.fn_auto_approve_article();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.fn_update_article_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_article_update_timestamp
BEFORE UPDATE ON public.articles
FOR EACH ROW
EXECUTE FUNCTION public.fn_update_article_timestamp();
