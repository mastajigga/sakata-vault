-- Migration: Enhanced Chat Conversations RPC
-- Description: Provides a high-performance one-shot fetch for user conversations with unread counts and last message info.

CREATE OR REPLACE FUNCTION public.get_user_conversations_v4(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    type TEXT,
    name TEXT,
    last_message TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE,
    unread_count BIGINT,
    participants JSONB
) AS $$
BEGIN
    RETURN QUERY
    WITH user_conversations AS (
        -- Get all conversations the user is a participant in
        SELECT 
            cp.conversation_id,
            cp.last_read_at
        FROM public.chat_participants cp
        WHERE cp.user_id = p_user_id
    ),
    conversation_details AS (
        -- Get conversation basics
        SELECT 
            c.id,
            c.type,
            c.name,
            c.created_at
        FROM public.chat_conversations c
        JOIN user_conversations uc ON c.id = uc.conversation_id
    ),
    last_messages AS (
        -- Get the most recent message for each conversation
        -- Use DISTINCT ON to efficiently get the latest per group
        SELECT DISTINCT ON (m.conversation_id)
            m.conversation_id,
            m.content,
            m.created_at
        FROM public.chat_messages m
        JOIN user_conversations uc ON m.conversation_id = uc.conversation_id
        WHERE m.is_deleted = false
        ORDER BY m.conversation_id, m.created_at DESC
    ),
    unread_counts AS (
        -- Count messages created after the user's last_read_at
        SELECT 
            m.conversation_id,
            COUNT(*) as count
        FROM public.chat_messages m
        JOIN user_conversations uc ON m.conversation_id = uc.conversation_id
        WHERE m.created_at > uc.last_read_at
          AND m.sender_id != p_user_id
          AND m.is_deleted = false
        GROUP BY m.conversation_id
    ),
    all_participants AS (
        -- Get all participants for each of these conversations
        SELECT 
            cp.conversation_id,
            jsonb_agg(
                jsonb_build_object(
                    'user_id', cp.user_id,
                    'nickname', pr.nickname,
                    'username', pr.username,
                    'avatar_url', pr.avatar_url
                )
            ) as participants_list
        FROM public.chat_participants cp
        JOIN user_conversations uc ON cp.conversation_id = uc.conversation_id
        JOIN public.profiles pr ON cp.user_id = pr.id
        GROUP BY cp.conversation_id
    )
    SELECT 
        cd.id,
        cd.type,
        cd.name,
        COALESCE(lm.content, 'Pas encore de message') as last_message,
        COALESCE(lm.created_at, cd.created_at) as last_message_at,
        COALESCE(unr.count, 0) as unread_count,
        ap.participants_list as participants
    FROM conversation_details cd
    LEFT JOIN last_messages lm ON cd.id = lm.conversation_id
    LEFT JOIN unread_counts unr ON cd.id = unr.conversation_id
    LEFT JOIN all_participants ap ON cd.id = ap.conversation_id
    ORDER BY last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
