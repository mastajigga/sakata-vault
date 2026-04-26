-- Add hero_video_url column to articles table if it doesn't exist
ALTER TABLE public.articles
ADD COLUMN IF NOT EXISTS hero_video_url TEXT DEFAULT NULL;

-- Add comment to the column
COMMENT ON COLUMN public.articles.hero_video_url IS 'URL of the hero video for the article (stored in article-videos bucket)';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_hero_video_url ON public.articles(hero_video_url) WHERE hero_video_url IS NOT NULL;

-- Verify the column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'articles'
  AND column_name = 'hero_video_url';
