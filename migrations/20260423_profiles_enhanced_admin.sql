-- Migration: Add Email and Metadata to Profiles
-- Date: 2026-04-23
-- Purpose: Support advanced admin dashboard and user identification

-- 1. Add email and metadata columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 2. Update trigger to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nickname, role, subscription_tier, contributor_status, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', ''),
    COALESCE(new.raw_user_meta_data->>'nickname', ''),
    'user',
    'free',
    'none',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Backfill existing emails (Requires superuser/service_role logic normally, but here we provide the command)
-- UPDATE public.profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id;
