-- Migration: Sakata Chat Ephemeral Views
-- Description: Adds the `max_views` column and updates `expires_in` constraints to support 24h/48h ephemeral messages.

-- 1. Add max_views column for view-once / view-twice features
ALTER TABLE public.chat_messages 
ADD COLUMN IF NOT EXISTS max_views SMALLINT CHECK (max_views IN (1, 2));

-- 2. Update the expires_in check constraint
-- We need to drop the old constraint first
ALTER TABLE public.chat_messages DROP CONSTRAINT IF EXISTS chat_messages_expires_in_check;

-- Add the new constraint with 24h and 48h
ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_expires_in_check 
CHECK (expires_in IN ('24h', '48h', '7_days', '30_days', 'never'));
