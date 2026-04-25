-- Migration: Article Hero Video
-- Date: 2026-04-26
-- Description: Add support for video uploads in article hero section
--   - Add hero_video_url column to articles table
--   - Add index for performance

-- ===========================
-- 1. ADD VIDEO URL COLUMN
-- ===========================
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS hero_video_url TEXT NULL;

-- ===========================
-- 2. CREATE INDEX
-- ===========================
CREATE INDEX IF NOT EXISTS idx_articles_hero_video_url ON public.articles(hero_video_url);
