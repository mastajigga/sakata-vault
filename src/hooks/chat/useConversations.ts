"use client";

import { useChatUnread } from "@/contexts/ChatUnreadContext";

/**
 * Wrapper léger — délègue entièrement au ChatUnreadContext.
 * ChatSidebar.tsx utilise ce hook ; son API est inchangée.
 */
export function useConversations() {
  const { conversations, loading, markConversationRead } = useChatUnread();
  return { conversations, loading, markConversationRead };
}
