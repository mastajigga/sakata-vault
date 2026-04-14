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
import { DB_TABLES } from "@/lib/constants/db";
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

  useEffect(() => {
    let cancelled = false;

    // showLoading=true uniquement au montage initial.
    // Les callbacks realtime appellent toujours fetchConversations(false)
    // pour ne jamais déclencher setLoading(true) → évite la boucle infinie.
    async function fetchConversations(showLoading = false) {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      if (showLoading) setLoading(true);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const userId = session?.user?.id;

        if (!userId) {
          if (!cancelled) setLoading(false);
          return;
        }

        const { data: convData, error } = await supabase.rpc(
          "get_user_conversations_v4",
          { p_user_id: userId }
        );

        if (cancelled) return;

        if (error) {
          console.error("ChatUnreadContext: RPC error", error);
          return;
        }

        if (convData) {
          const mapped: ConversationItem[] = convData.map((conv: any) => {
            let displayName = conv.name;
            if (conv.type === "direct") {
              const other = conv.participants?.find(
                (p: any) => p.user_id !== userId
              );
              displayName = other
                ? other.nickname || other.username
                : "Moi-même";
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
        console.error("ChatUnreadContext:", err);
      } finally {
        isFetchingRef.current = false;
        if (!cancelled) setLoading(false);
      }
    }

    fetchConversations(true); // montage initial → spinner visible

    const channel = supabase
      .channel("chat_unread_context")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.CHAT_MESSAGES },
        () => {
          fetchConversations(false); // silent — jamais setLoading(true) ici
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: DB_TABLES.CHAT_PARTICIPANTS },
        () => {
          fetchConversations(false);
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

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
