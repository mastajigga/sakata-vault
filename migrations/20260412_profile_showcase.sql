-- Migration: Profile Showcase (Vitrine)
-- Adds fields for a Happn-style community showcase.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS cover_photo_url text,
ADD COLUMN IF NOT EXISTS short_bio text;

-- Add comment explaining usage
COMMENT ON COLUMN public.profiles.cover_photo_url IS 'High resolution vertical photo for Happn-style public showcase';
COMMENT ON COLUMN public.profiles.short_bio IS 'A short proverb or introduction to display on the showcase card';
