"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConversationItem } from "@/components/chat/ChatSidebar";
import { DB_TABLES } from "@/lib/constants/db";

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Track whether we're already fetching to prevent concurrent calls
  const isFetchingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    // showLoading=true only on initial mount; subscription-triggered refreshes
    // run silently so the UI never flickers back to a loading state.
    async function fetchConversations(showLoading = false) {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (showLoading) setLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          if (!cancelled) setLoading(false);
          return;
        }

        // Appel de la nouvelle fonction RPC pour obtenir les stats de conversation
        const { data: convData, error } = await supabase.rpc('get_user_conversations_v4', {
          p_user_id: userId
        });

        if (cancelled) return;

        if (error) {
          console.error("Error fetching conversations via RPC:", error);
          return;
        }

        if (convData) {
          const mapped: ConversationItem[] = convData.map((conv: any) => {
            let displayName = conv.name;
            if (conv.type === "direct") {
              const other = conv.participants?.find((p: any) => p.user_id !== userId);
              displayName = other ? (other.nickname || other.username) : "Moi-même";
            }
            return {
              id: conv.id,
              type: conv.type,
              name: displayName || "Conversation",
              unreadCount: Number(conv.unread_count),
              lastMessage: conv.last_message,
              lastMessageAt: conv.last_message_at,
            };
          });

          if (!cancelled) setConversations(mapped);
        }
      } catch (err) {
        console.error("useConversations exception:", err);
      } finally {
        isFetchingRef.current = false;
        if (!cancelled) setLoading(false);
      }
    }

    // Initial load
    fetchConversations(true);

    // Subscription to REFRESH on ANY relevant change
    const channel = supabase
      .channel("chat_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: DB_TABLES.CHAT_PARTICIPANTS },
        () => { fetchConversations(false); }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.CHAT_MESSAGES },
        () => { fetchConversations(false); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { conversations, loading };
}
