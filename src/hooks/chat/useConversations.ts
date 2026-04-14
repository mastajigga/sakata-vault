"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ConversationItem } from "@/components/chat/ChatSidebar";

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

        const { data: participations, error } = await supabase
          .from("chat_participants")
          .select(`
            conversation_id,
            user_id,
            last_read_at,
            chat_conversations (
              id, type, name, created_at
            ),
            profiles:user_id ( nickname, username )
          `);

        if (cancelled) return;

        if (error) {
          console.error("Error fetching conversations:", error);
          return;
        }

        if (participations) {
          const grouped = participations.reduce((acc: any, p: any) => {
            const convId = p.conversation_id;
            if (!acc[convId]) {
              acc[convId] = {
                id: p.chat_conversations?.id,
                type: p.chat_conversations?.type,
                name: p.chat_conversations?.name,
                created_at: p.chat_conversations?.created_at,
                participants: [],
              };
            }
            acc[convId].participants.push({
              user_id: p.user_id,
              name: p.profiles?.nickname || p.profiles?.username || "Inconnu",
            });
            return acc;
          }, {});

          const mapped: ConversationItem[] = Object.values(grouped).map((conv: any) => {
            let displayName = conv.name;
            if (conv.type === "direct") {
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

          mapped.sort(
            (a, b) =>
              new Date(b.lastMessageAt || 0).getTime() -
              new Date(a.lastMessageAt || 0).getTime()
          );

          if (!cancelled) setConversations(mapped);
        }
      } catch (err) {
        console.error("useConversations exception:", err);
      } finally {
        isFetchingRef.current = false;
        if (!cancelled) setLoading(false);
      }
    }

    // Initial load — show spinner
    fetchConversations(true);

    // Subscription-triggered refresh — silent (no spinner)
    const channel = supabase
      .channel("conversations_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_participants" },
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
