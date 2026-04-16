"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export function useTyping(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!conversationId) return;
    
    // We prefix the channel with 'typing:' to separate it from postgres_changes
    const channelName = `typing:${conversationId}`;
    let isMounted = true;

    async function initPresence() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      let currentUsername = "Anonyme";
      if (currentUserId) {
        const { data } = await supabase.from('profiles').select('username, nickname').eq('id', currentUserId).single();
        currentUsername = data?.nickname || data?.username || "Anonyme";
      }

      const room = supabase.channel(channelName, {
        config: {
          presence: {
            key: currentUserId || 'anonymous',
          },
        },
      });
      // Store room immediately to ensure cleanup can find it even if still subscribing
      channelRef.current = { room, username: currentUsername };

      room.on('presence', { event: 'sync' }, () => {
        if (!isMounted) return;
        const state = room.presenceState();
        const typers: string[] = [];
        for (const [key, presences] of Object.entries(state)) {
          if (key === currentUserId) continue;
          for (const p of presences as any[]) {
            if (p.typing && p.name && !typers.includes(p.name)) {
              typers.push(p.name);
            }
          }
        }
        setTypingUsers(typers);
      });

      room.subscribe();
    }

    initPresence();

    return () => {
      isMounted = false;
      if (channelRef.current?.room) {
        channelRef.current.room.untrack(); // BUG-003: untrack before removeChannel
        supabase.removeChannel(channelRef.current.room);
      }
      channelRef.current = null;
    };
  }, [conversationId]);

  const updateTyping = async (isTyping: boolean) => {
    if (channelRef.current?.room) {
      await channelRef.current.room.track({ 
        typing: isTyping, 
        name: channelRef.current.username,
        updatedAt: new Date().toISOString()
      });
    }
  };

  return { typingUsers, updateTyping };
}
