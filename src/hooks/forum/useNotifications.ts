"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export interface ForumNotification {
  id: string;
  recipient_id: string;
  actor_id: string | null;
  thread_id: string | null;
  post_id: string | null;
  type: "reply" | "mention" | "thread_reply";
  read_at: string | null;
  created_at: string;
  // Joined
  actor?: {
    username: string;
    nickname: string | null;
    avatar_url: string | null;
  };
  thread?: {
    title: string;
    slug: string;
    category_id: string;
  };
  post?: {
    content: string;
  };
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<ForumNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  const fetchAll = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("forum_notifications")
        .select(
          `
          *,
          actor:profiles!actor_id (username, nickname, avatar_url),
          thread:forum_threads!thread_id (title, slug, category_id),
          post:forum_posts!post_id (content)
        `
        )
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("[useNotifications] fetch error", error);
        return;
      }

      const list = (data || []) as ForumNotification[];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.read_at).length);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const channel = supabase
      .channel(`notifications_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "forum_notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          if (!isMounted) return;
          fetchAll();
        }
      )
      .subscribe((status: string, err?: unknown) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.error("[useNotifications] subscribe error", err || status);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchAll]);

  const markRead = useCallback(
    async (id: string) => {
      // Optimistic
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      const { error } = await supabase
        .from("forum_notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);

      if (error) console.error("[useNotifications] markRead", error);
    },
    []
  );

  const markAllRead = useCallback(async () => {
    if (!user?.id) return;
    const now = new Date().toISOString();
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? now })));
    setUnreadCount(0);
    const { error } = await supabase
      .from("forum_notifications")
      .update({ read_at: now })
      .eq("recipient_id", user.id)
      .is("read_at", null);
    if (error) console.error("[useNotifications] markAllRead", error);
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refresh: fetchAll,
  };
}
