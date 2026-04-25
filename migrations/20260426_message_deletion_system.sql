-- Migration: Message Deletion System
-- Date: 2026-04-26
-- Description: Add support for message deletion with 2-minute window and two modes
--   - Add deleted_at, deleted_for_all, deleted_by_user_id columns to chat_messages
--   - Add index for performance
--   - Support two deletion modes: delete-for-self (hidden locally) vs delete-for-all (shows placeholder)

-- ===========================
-- 1. ADD DELETION COLUMNS
-- ===========================
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS deleted_for_all BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_by_user_id UUID NULL;

-- ===========================
-- 2. CREATE INDEXES
-- ===========================
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_at ON public.chat_messages(deleted_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_for_all ON public.chat_messages(deleted_for_all);
CREATE INDEX IF NOT EXISTS idx_chat_messages_deleted_by_user_id ON public.chat_messages(deleted_by_user_id);

-- ===========================
-- 3. ADD FOREIGN KEY
-- ===========================
ALTER TABLE public.chat_messages
ADD CONSTRAINT fk_chat_messages_deleted_by_user_id
  FOREIGN KEY (deleted_by_user_id)
  REFERENCES auth.users(id)
  ON DELETE SET NULL;
