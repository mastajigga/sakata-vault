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
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        setLoading(false);
        return;
      }

      // Fetch all participations in user's conversations
      const { data: participations, error } = await supabase
        .from('chat_participants')
        .select(`
          conversation_id,
          user_id,
          last_read_at,
          chat_conversations (
            id, type, name, created_at
          ),
          profiles:user_id ( nickname, username )
        `);

      if (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
        return;
      }

      if (participations) {
        // Group by conversation
        const grouped = participations.reduce((acc: any, p: any) => {
          const convId = p.conversation_id;
          if (!acc[convId]) {
            acc[convId] = {
              id: p.chat_conversations?.id,
              type: p.chat_conversations?.type,
              name: p.chat_conversations?.name,
              created_at: p.chat_conversations?.created_at,
              participants: []
            };
          }
          acc[convId].participants.push({
            user_id: p.user_id,
            name: p.profiles?.nickname || p.profiles?.username || "Inconnu"
          });
          return acc;
        }, {});

        const mapped: ConversationItem[] = Object.values(grouped).map((conv: any) => {
          let displayName = conv.name;
          
          if (conv.type === 'direct') {
            const other = conv.participants.find((cp: any) => cp.user_id !== userId);
            displayName = other ? other.name : "Moi-même";
          }

          return {
            id: conv.id,
            type: conv.type,
            name: displayName || "Conversation",
            unreadCount: 0,
            lastMessage: "...",
            lastMessageAt: conv.created_at,
          };
        });

        mapped.sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());
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
