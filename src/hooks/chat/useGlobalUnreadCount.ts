"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";

export function useGlobalUnreadCount() {
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchTotalUnread() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) return;

      // Call RPC to get stats
      const { data, error } = await supabase.rpc('get_user_conversations_v4', {
        p_user_id: userId
      });

      if (cancelled) return;

      if (!error && data) {
        const total = data.reduce((sum: number, conv: any) => sum + Number(conv.unread_count), 0);
        setTotalUnread(total);
      }
    }

    fetchTotalUnread();

    // Subscribe to messages to update badge
    const channel = supabase
      .channel("global_unread")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.CHAT_MESSAGES },
        () => { fetchTotalUnread(); }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: DB_TABLES.CHAT_PARTICIPANTS },
        () => { fetchTotalUnread(); }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return totalUnread;
}
