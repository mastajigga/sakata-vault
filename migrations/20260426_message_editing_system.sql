-- Migration: Message Editing System
-- Date: 2026-04-26
-- Description: Add support for message editing with 5-minute window
--   - Add edited_at and edited_by_user_id columns to chat_messages
--   - Add index for performance
--   - Update RLS policies to allow message editing

-- ===========================
-- 1. ADD EDITING COLUMNS
-- ===========================
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS edited_by_user_id UUID NULL;

-- ===========================
-- 2. CREATE INDEXES
-- ===========================
CREATE INDEX IF NOT EXISTS idx_chat_messages_edited_at ON public.chat_messages(edited_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_edited_by_user_id ON public.chat_messages(edited_by_user_id);

-- ===========================
-- 3. ADD FOREIGN KEY
-- ===========================
ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_edited_by_user_id
  FOREIGN KEY (edited_by_user_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;
