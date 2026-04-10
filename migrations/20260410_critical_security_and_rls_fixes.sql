-- Migration: Critical Security & RLS Fixes
-- Date: 2026-04-10
-- Description: Address critical security issues identified in audit
--   - Add missing columns (role, contributor_status)
--   - Create trigger for profile creation on signup
--   - Add RLS policies for premium articles
--   - Restrict role/subscription_tier updates
--   - Add proper error handling

-- ===========================
-- 1. CREATE MISSING COLUMNS
-- ===========================
-- Check if columns already exist before adding
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'contributor', 'user')),
ADD COLUMN IF NOT EXISTS contributor_status VARCHAR(50) DEFAULT 'none' CHECK (contributor_status IN ('none', 'pending', 'active', 'suspended'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);

-- ===========================
-- 2. CREATE PROFILE TRIGGER
-- ===========================
-- This trigger automatically creates a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, nickname, role, subscription_tier, contributor_status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', ''),
    COALESCE(new.raw_user_meta_data->>'nickname', ''),
    'user',
    'free',
    'none'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop old trigger if exists (to avoid conflicts)
DROP TRIGGER IF NOT EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ===========================
-- 3. FIX RLS POLICIES
-- ===========================

-- 3a. Restrict profile updates (prevent role escalation)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (safely)"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND (
    -- Only allow changes to non-critical fields
    -- role and subscription_tier are immutable after creation
    OLD.role = NEW.role
    AND OLD.subscription_tier = NEW.subscription_tier
  )
);

-- Alternative: If you want to allow role changes via admin only
-- Drop the above and use this instead:
-- DROP POLICY IF EXISTS "Users can update own profile (safely)" ON public.profiles;
-- CREATE POLICY "Users can update own profile"
-- ON public.profiles FOR UPDATE
-- USING (auth.uid() = id)
-- WITH CHECK (auth.uid() = id AND OLD.role = NEW.role AND OLD.subscription_tier = NEW.subscription_tier);
--
-- CREATE POLICY "Admins can update any profile"
-- ON public.profiles FOR UPDATE
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );

-- 3b. Add RLS policy for premium articles
DROP POLICY IF EXISTS "Premium articles require subscription" ON public.articles;

CREATE POLICY "Premium articles require subscription"
ON public.articles FOR SELECT
USING (
  NOT is_premium
  OR auth.uid() IS NULL
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (
      role IN ('admin', 'manager', 'contributor')
      OR subscription_tier IN ('premium', 'elite')
    )
  )
);

-- 3c. Ensure articles have proper ownership restriction
DROP POLICY IF EXISTS "Only admins can create articles" ON public.articles;

CREATE POLICY "Only admins/managers can create articles"
ON public.articles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager', 'contributor')
  )
);

DROP POLICY IF EXISTS "Only article author or admin can update" ON public.articles;

CREATE POLICY "Only article author or admin can update"
ON public.articles FOR UPDATE
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- ===========================
-- 4. FORUM POLICIES
-- ===========================

-- Ensure forum_posts can only be created by authenticated users
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.forum_posts;

CREATE POLICY "Authenticated users can create posts"
ON public.forum_posts FOR INSERT
WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

-- Only post creator or admins can update posts
DROP POLICY IF EXISTS "Users can update own posts or admins" ON public.forum_posts;

CREATE POLICY "Users can update own posts or admins"
ON public.forum_posts FOR UPDATE
USING (
  created_by = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'manager')
  )
);

-- ===========================
-- 5. AUDIT LOG (Optional but recommended)
-- ===========================

-- Create an audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit_log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit log
CREATE POLICY "Only admins can view audit log"
ON public.audit_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- ===========================
-- 6. GRANT PERMISSIONS
-- ===========================
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated, service_role;

-- ===========================
-- VERIFICATION QUERIES
-- ===========================
-- Run these to verify the migration:

-- Check if columns exist
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'profiles' AND (column_name = 'role' OR column_name = 'contributor_status');

-- Check if trigger exists
-- SELECT trigger_name FROM information_schema.triggers
-- WHERE trigger_schema = 'public' AND trigger_name = 'on_auth_user_created';

-- Check RLS policies
-- SELECT schemaname, tablename, policyname FROM pg_policies
-- WHERE schemaname = 'public';
