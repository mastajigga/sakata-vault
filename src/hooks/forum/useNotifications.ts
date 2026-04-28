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
  const fetchAllRef = useRef<() => Promise<void>>(async () => {});

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

  // Keep latest fetchAll in a ref so the realtime callback sees fresh closure
  // without forcing the realtime effect to re-run.
  useEffect(() => {
    fetchAllRef.current = fetchAll;
  }, [fetchAll]);

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Realtime — depends ONLY on user.id (not fetchAll) to avoid re-subscribing
  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const channelName = `notifications_${user.id}`;

    // Defensive cleanup: if a channel with this name already exists in the
    // Supabase singleton (HMR, Strict Mode double-mount, route change),
    // remove it before creating a fresh one. Without this, attempting to
    // call .on() on the already-subscribed channel throws:
    //   "cannot add postgres_changes callbacks after subscribe()"
    try {
      const existing = supabase
        .getChannels()
        .find((c: { topic: string }) => c.topic === `realtime:${channelName}`);
      if (existing) {
        supabase.removeChannel(existing);
      }
    } catch (e) {
      // getChannels can throw on stale references — ignore
    }

    const channel = supabase
      .channel(channelName)
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
          fetchAllRef.current();
        }
      )
      .subscribe((status: string, err?: unknown) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.error("[useNotifications] subscribe error", err || status);
        }
      });

    return () => {
      isMounted = false;
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // ignore
      }
    };
  }, [user?.id]);

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
