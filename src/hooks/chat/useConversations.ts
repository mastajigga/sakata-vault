"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConversationItem } from "@/components/chat/ChatSidebar"; // Using the exported type

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      // Fetch user's active conversations via chat_participants
      const { data: participations, error } = await supabase
        .from('chat_participants')
        .select(`
          conversation_id,
          last_read_at,
          role,
          chat_conversations (
            id, type, name, created_at
          )
        `);

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      if (participations) {
        const mapped = participations.map((p: any) => ({
          id: p.chat_conversations.id,
          type: p.chat_conversations.type,
          name: p.chat_conversations.name || "Conversation", // for direct, we'd fetch the other user's name
          unreadCount: 0, // calculate based on last_read_at vs last message
          lastMessage: "...", // ideally fetch last message
          lastMessageAt: p.chat_conversations.created_at,
        }));
        setConversations(mapped);
      }
      setLoading(false);
    }

    fetchConversations();

    // Subscribe to new conversations or participants changes
    const channel = supabase.channel('conversations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_participants' }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, loading };
}
