-- Migration: Admin Notes System
-- Date: 2026-04-26
-- Description: Add support for admin notes (personal note-taking app)
--   - Create admin_notes table with user_id, title, content, created_at, updated_at, archived
--   - Add indexes for performance
--   - Add RLS policies for user isolation

-- ===========================
-- 1. CREATE ADMIN_NOTES TABLE
-- ===========================
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================
-- 2. CREATE INDEXES
-- ===========================
CREATE INDEX IF NOT EXISTS idx_admin_notes_user_id ON public.admin_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_created_at ON public.admin_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notes_archived ON public.admin_notes(archived);

-- ===========================
-- 3. ENABLE RLS
-- ===========================
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- ===========================
-- 4. CREATE RLS POLICIES
-- ===========================
-- Users can see their own notes
CREATE POLICY "Users can view their own notes" ON public.admin_notes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own notes
CREATE POLICY "Users can create their own notes" ON public.admin_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes
CREATE POLICY "Users can update their own notes" ON public.admin_notes
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own notes
CREATE POLICY "Users can delete their own notes" ON public.admin_notes
  FOR DELETE USING (auth.uid() = user_id);
