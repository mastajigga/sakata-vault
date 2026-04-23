"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { DB_TABLES } from "@/lib/constants/db";
import { useAuth } from "@/components/AuthProvider";
import type { ConversationItem } from "@/components/chat/ChatSidebar";

interface ChatUnreadContextType {
  conversations: ConversationItem[];
  loading: boolean;
  totalUnread: number;
  markConversationRead: (conversationId: string) => void;
}

const ChatUnreadContext = createContext<ChatUnreadContextType | undefined>(
  undefined
);

export function ChatUnreadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  // Concurrency guard — prevents overlapping RPC calls (anti-loop pattern from CLAUDE.md §4)
  const isFetchingRef = useRef(false);
  const { user, isLoading: authLoading } = useAuth();
  
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const userId = user?.id;

    // Reset concurrency guard at the start of each effect instance.
    // The old effect's fetch may still be in the proxy queue when the effect
    // re-runs (e.g., authLoading changed). Without this reset the new
    // fetchConversations call would see isFetchingRef=true and bail out —
    // leaving loading=true forever.
    isFetchingRef.current = false;

    async function fetchConversations(showLoading = false) {
      if (isFetchingRef.current || authLoading) return;
      
      // Petit délai pour laisser passer les premières requêtes prioritaires
      await new Promise(resolve => setTimeout(resolve, 100));
      if (cancelled || authLoading) return;

      isFetchingRef.current = true;
      if (showLoading) setLoading(true);

      try {
        console.log("[ChatUnread] Fetching for user:", userId);
        if (!userId) {
          if (!cancelled) {
            setConversations([]);
            setLoading(false);
          }
          return;
        }

        const { data: convData, error } = await withRetry(() => 
          supabase.rpc(
            "get_user_conversations_v4",
            { p_user_id: userId }
          ).abortSignal(controller.signal)
        );

        if (cancelled) return;

        if (error) {
          if (error.message?.includes("AbortError") || error.message?.includes("abort")) {
            console.log("[ChatUnread] RPC annulé.");
          } else {
            console.error("[ChatUnread] RPC error (after retries):", error);
          }
          return;
        }

        if (convData && Array.isArray(convData)) {
          console.log("[ChatUnread] Conversations récupérées:", convData.length);
          const mapped: ConversationItem[] = convData.map((conv: any) => {
            let displayName = conv.name;
            let avatarUrl = conv.avatar_url;
            if (conv.type === "direct") {
              const other = conv.participants?.find(
                (p: any) => p.user_id !== userId
              );
              displayName = other
                ? other.nickname || other.username
                : "Moi-même";
              avatarUrl = other?.avatar_url;
            }
            return {
              id: conv.id,
              type: conv.type,
              name: displayName || "Conversation",
              avatar_url: avatarUrl,
              unreadCount: Number(conv.unread_count),
              lastMessage: conv.last_message,
              lastMessageAt: conv.last_message_at,
            };
          });

          if (!cancelled) setConversations(mapped);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("[ChatUnread] FetchConversations interrompu.");
        } else {
          console.error("ChatUnreadContext:", err);
        }
      } finally {
        isFetchingRef.current = false;
        // Always reset loading — if cancelled, the new effect instance will
        // immediately call setLoading(true) again via showLoading=true.
        // Leaving loading=true on cancel creates a permanent "Chargement..." state.
        setLoading(false);
      }
    }

    fetchConversations(true); 

    const channel = supabase
      .channel(`chat_unread_${userId || 'guest'}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.CHAT_MESSAGES },
        () => {
          fetchConversations(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: DB_TABLES.CHAT_PARTICIPANTS },
        () => {
          fetchConversations(false);
        }
      )
      .subscribe((status: any, err: any) => {
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('[ChatUnread] WebSocket error:', err || status);
        }
      });

    return () => {
      cancelled = true;
      controller.abort();
      supabase.removeChannel(channel);
    };
  }, [user?.id, authLoading]);

  // Mise à jour optimiste — efface immédiatement le badge d'une conversation.
  // Comme totalUnread est dérivé de conversations[], il se recalcule dans le
  // même render : le point Navbar disparaît au même instant que le badge sidebar.
  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
  }, []);

  // Dérivé — jamais stocké dans un useState séparé
  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  return (
    <ChatUnreadContext.Provider
      value={{ conversations, loading, totalUnread, markConversationRead }}
    >
      {children}
    </ChatUnreadContext.Provider>
  );
}

export function useChatUnread(): ChatUnreadContextType {
  const ctx = useContext(ChatUnreadContext);
  if (ctx === undefined) {
    throw new Error("useChatUnread must be used within a ChatUnreadProvider");
  }
  return ctx;
}
