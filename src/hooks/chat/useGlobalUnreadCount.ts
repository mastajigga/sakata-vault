"use client";

import { useChatUnread } from "@/contexts/ChatUnreadContext";

/**
 * Wrapper léger — délègue entièrement au ChatUnreadContext.
 * Navbar.tsx utilise ce hook ; son type de retour est inchangé.
 */
export function useGlobalUnreadCount(): number {
  return useChatUnread().totalUnread;
}
