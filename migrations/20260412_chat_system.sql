-- Migration: Sakata Chat System
-- Description: Adds tables and RLS policies for direct and group real-time chats.

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('direct', 'group')),
    name TEXT, -- only for group chats
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- 2. Participants Table
CREATE TABLE IF NOT EXISTS public.chat_participants (
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'mbey')),
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (conversation_id, user_id)
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    file_type TEXT CHECK (file_type IN ('audio', 'image', 'pdf')),
    expires_in TEXT DEFAULT 'never' CHECK (expires_in IN ('7_days', '30_days', 'never')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Ensure either text content or a file is provided
    CONSTRAINT content_or_file CHECK (content IS NOT NULL OR file_url IS NOT NULL)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for chat_conversations

DROP POLICY IF EXISTS "Users can view their conversations" ON public.chat_conversations;
CREATE POLICY "Users can view their conversations" ON public.chat_conversations
FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_conversations.id AND cp.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.chat_conversations;
CREATE POLICY "Authenticated users can create conversations" ON public.chat_conversations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. RLS Policies for chat_participants

DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.chat_participants;
CREATE POLICY "Users can view participants of their conversations" ON public.chat_participants
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants AS cp
        WHERE cp.conversation_id = chat_participants.conversation_id AND cp.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users and admins can add participants" ON public.chat_participants;
CREATE POLICY "Users and admins can add participants" ON public.chat_participants
FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_participants.conversation_id AND cp.user_id = auth.uid() AND cp.role IN ('admin', 'mbey')
    ) OR
    EXISTS (
        SELECT 1 FROM public.chat_conversations cc
        WHERE cc.id = chat_participants.conversation_id AND cc.created_by = auth.uid()
    )
);

DROP POLICY IF EXISTS "Admins or self can remove participants" ON public.chat_participants;
CREATE POLICY "Admins or self can remove participants" ON public.chat_participants
FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_participants.conversation_id AND cp.user_id = auth.uid() AND cp.role IN ('admin', 'mbey')
    )
);

-- 7. RLS Policies for chat_messages

DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_messages.conversation_id AND cp.user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can insert messages to their conversations" ON public.chat_messages;
CREATE POLICY "Users can insert messages to their conversations" ON public.chat_messages
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_messages.conversation_id AND cp.user_id = auth.uid()
    )
    AND auth.uid() = sender_id
);

DROP POLICY IF EXISTS "Senders and admins can update messages" ON public.chat_messages;
CREATE POLICY "Senders and admins can update messages" ON public.chat_messages
FOR UPDATE USING (
    auth.uid() = sender_id OR 
    EXISTS (
        SELECT 1 FROM public.chat_participants cp
        WHERE cp.conversation_id = chat_messages.conversation_id AND cp.user_id = auth.uid() AND cp.role IN ('admin', 'mbey')
    )
);

-- 8. Functions & Triggers for auto-updating timestamps

CREATE OR REPLACE FUNCTION public.update_last_read_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_participants
    SET last_read_at = timezone('utc'::text, now())
    WHERE conversation_id = NEW.conversation_id AND user_id = NEW.sender_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatically update sender's last_read_at when they send a message
DROP TRIGGER IF EXISTS on_message_sent ON public.chat_messages;
CREATE TRIGGER on_message_sent 
AFTER INSERT ON public.chat_messages 
FOR EACH ROW EXECUTE PROCEDURE public.update_last_read_at();

-- 9. Realtime Setup
-- Add tables to the realtime publication
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_messages'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_conversations'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'chat_participants'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_participants;
    END IF;
END $$;
