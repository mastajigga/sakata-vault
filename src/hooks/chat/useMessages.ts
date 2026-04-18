"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { Message } from "@/components/chat/ChatWindow";
import { DB_TABLES, DB_BUCKETS } from "@/lib/constants/db";

const PAGE_SIZE = 50;

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [readTimestamps, setReadTimestamps] = useState<Record<string, string>>({});
  // Reactions state
  const [allReactions, setAllReactions] = useState<Record<string, Record<string, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<string, Set<string>>>({});

  // P2-D fix: userIdRef évite les stale closures dans les callbacks realtime.
  const userIdRef = useRef<string>("");

  // Résoudre l'userId une seule fois au montage, puis le mettre à jour si la session change
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id || "";
      userIdRef.current = uid;
      setCurrentUserId(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id || "";
      userIdRef.current = uid;
      setCurrentUserId(uid);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Résoudre une signed URL depuis un chemin storage:
  const resolveFileUrl = useCallback(async (
    fileUrl: string | undefined,
    fileType: string | undefined,
    maxViews: number | undefined
  ): Promise<string | undefined> => {
    if (!fileUrl) return fileUrl;
    if (fileType === 'image' && maxViews && fileUrl.startsWith('storage:')) {
      const path = fileUrl.replace('storage:chat-attachments/', '');
      const { data } = await supabase.storage
        .from(DB_BUCKETS.CHAT_ATTACHMENTS)
        .createSignedUrl(path, 3600);
      return data?.signedUrl || fileUrl;
    }
    return fileUrl;
  }, []);

  const formatMessage = useCallback((msg: any, uid: string): Message => ({
    id: msg.id,
    senderId: msg.sender_id,
    senderName: msg.profiles?.nickname || msg.profiles?.username || "Inconnu",
    content: msg.content || "",
    fileUrl: msg.file_url,
    fileType: msg.file_type,
    createdAt: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAtRaw: msg.created_at,
    isMe: msg.sender_id === uid,
    expiresIn: msg.expires_in,
    maxViews: msg.max_views,
  }), []);

  const resolveSignedUrls = useCallback(async (msgs: Message[]): Promise<Message[]> => {
    return Promise.all(msgs.map(async (msg) => {
      if (msg.fileType === 'image' && msg.maxViews && msg.fileUrl?.startsWith('storage:')) {
        const resolved = await resolveFileUrl(msg.fileUrl, msg.fileType, msg.maxViews);
        return { ...msg, fileUrl: resolved };
      }
      return msg;
    }));
  }, [resolveFileUrl]);

  useEffect(() => {
    if (!conversationId) return;

    async function markAsRead() {
      const uid = userIdRef.current;
      if (!uid || !conversationId) return;
      await supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', uid);
    }

    async function fetchReadTimestamps() {
      const { data: participants } = await supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .select('user_id, last_read_at')
        .eq('conversation_id', conversationId);

      if (participants) {
        const ts: Record<string, string> = {};
        for (const p of participants) {
          if (p.user_id && p.last_read_at) {
            ts[p.user_id] = p.last_read_at;
          }
        }
        setReadTimestamps(ts);
      }
    }

    async function fetchReactions(msgIds: string[]) {
      if (msgIds.length === 0) return;
      const uid = userIdRef.current;
      const { data } = await supabase
        .from(DB_TABLES.CHAT_REACTIONS)
        .select("message_id, user_id, emoji")
        .in("message_id", msgIds);

      if (!data) return;

      const newAll: Record<string, Record<string, number>> = {};
      const newMy: Record<string, Set<string>> = {};

      for (const row of data) {
        if (!newAll[row.message_id]) newAll[row.message_id] = {};
        newAll[row.message_id][row.emoji] = (newAll[row.message_id][row.emoji] || 0) + 1;
        if (row.user_id === uid) {
          if (!newMy[row.message_id]) newMy[row.message_id] = new Set();
          newMy[row.message_id].add(row.emoji);
        }
      }
      setAllReactions(newAll);
      setMyReactions(newMy);
    }

    async function fetchMessages() {
      try {
        setLoading(true);
        // Cleanup non-critique — fire and forget
        Promise.resolve(supabase.rpc('cleanup_expired_messages')).catch(() => {});

        const uid = userIdRef.current;

        const { data, error } = await withRetry(async () =>
          supabase
            .from(DB_TABLES.CHAT_MESSAGES)
            .select(`
              id, content, file_url, file_type, created_at, expires_in,
              sender_id, max_views,
              profiles:sender_id ( nickname, username )
            `)
            .eq('conversation_id', conversationId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(PAGE_SIZE)
        );

        if (error) {
          console.error("Error fetching messages (after retries):", error);
        } else if (data) {
          const reversed = [...data].reverse();
          const formatted = reversed.map((msg: any) => formatMessage(msg, uid));
          const resolved = await resolveSignedUrls(formatted);
          setMessages(resolved);
          setHasMore(data.length === PAGE_SIZE);

          markAsRead();
          fetchReadTimestamps();
          fetchReactions(data.map(m => m.id));
        }
      } catch (err) {
        console.error("JS Exception fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Consolidated channel: messages + reactions + participants
    const channel = supabase.channel(`chat-robust:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: DB_TABLES.CHAT_MESSAGES,
        filter: `conversation_id=eq.${conversationId}`
      }, async (payload) => {
        const newMsg = payload.new;
        const { data: profileData } = await supabase
          .from(DB_TABLES.PROFILES)
          .select('nickname, username')
          .eq('id', newMsg.sender_id)
          .single();

        const uid = userIdRef.current;
        let formatted = formatMessage({ ...newMsg, profiles: profileData }, uid);

        if (formatted.fileType === 'image' && formatted.maxViews && formatted.fileUrl?.startsWith('storage:')) {
          const resolved = await resolveFileUrl(formatted.fileUrl, formatted.fileType, formatted.maxViews);
          formatted = { ...formatted, fileUrl: resolved };
        }

        setMessages(prev => [...prev, formatted]);
        if (newMsg.sender_id !== uid) markAsRead();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: DB_TABLES.CHAT_PARTICIPANTS,
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        const updated = payload.new;
        if (updated.user_id && updated.last_read_at) {
          setReadTimestamps(prev => ({ ...prev, [updated.user_id]: updated.last_read_at }));
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: DB_TABLES.CHAT_REACTIONS
        // Note: Filter is not possible on CHAT_REACTIONS if it doesn't have conversation_id
        // We filter results in the callback instead
      }, async (payload) => {
        // Since we can't filter by conversation_id on reaction table easily without a join
        // We just re-fetch reactions if the message belongs to our current messages
        const msgId = (payload.new as any)?.message_id || (payload.old as any)?.message_id;
        if (msgId) {
          // Optimization: could check if msgId in messages, but messages is in stale closure here
          // Re-fetch reactions for current messages
          fetchReactions(messages.map(m => m.id)); 
        }
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('[Chat] WebSocket error:', err || status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, formatMessage, resolveSignedUrls, resolveFileUrl, messages.length]); // Re-sub on length change to update reaction listener closure if needed


  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || messages.length === 0) return;

    const oldestMessage = messages[0];
    if (!oldestMessage?.createdAtRaw) return;

    setLoadingMore(true);
    const uid = userIdRef.current;

    try {
      const { data, error } = await withRetry(async () =>
        supabase
          .from(DB_TABLES.CHAT_MESSAGES)
          .select(`
            id, content, file_url, file_type, created_at, expires_in,
            sender_id, max_views,
            profiles:sender_id ( nickname, username )
          `)
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .lt('created_at', oldestMessage.createdAtRaw!)
          .order('created_at', { ascending: false })
          .limit(PAGE_SIZE)
      );

      if (error) {
        console.error("Error loading more messages:", error);
      } else if (data) {
        const reversed = [...data].reverse();
        const formatted = reversed.map((msg: any) => formatMessage(msg, uid));
        const resolved = await resolveSignedUrls(formatted);
        setMessages(prev => [...resolved, ...prev]);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("JS Exception loading more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [conversationId, hasMore, loadingMore, messages, formatMessage, resolveSignedUrls]);


  const sendMessage = async (content: string, attachment?: File | null, expiresIn?: string, maxViews?: 1 | 2) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fileUrl: string | null = null;
    let fileType: string | null = null;

    if (attachment) {
      if (attachment.type.startsWith('audio/')) fileType = 'audio';
      else if (attachment.type.startsWith('image/')) fileType = 'image';
      else if (attachment.type === 'application/pdf') fileType = 'pdf';
      else fileType = 'pdf';

      const fileExt = attachment.name.split('.').pop() || 'tmp';
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await withRetry(async () =>
        supabase.storage.from(DB_BUCKETS.CHAT_ATTACHMENTS).upload(fileName, attachment, {
          cacheControl: '3600',
          upsert: false
        })
      );

      if (error) {
        console.error("Erreur lors de l'upload de la pièce jointe (après retries):", error);
      } else if (data) {
        // BUG-002: Pour les images éphémères, stocker le PATH (storage:...) au lieu de l'URL publique
        if (fileType === 'image' && maxViews) {
          fileUrl = `storage:${DB_BUCKETS.CHAT_ATTACHMENTS}/${data.path}`;
        } else {
          const { data: publicData } = supabase.storage.from(DB_BUCKETS.CHAT_ATTACHMENTS).getPublicUrl(data.path);
          fileUrl = publicData.publicUrl;
        }
      }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname, username")
      .eq("id", user.id)
      .single();

    const senderName = profile?.nickname || profile?.username || "Utilisateur";
    const messagePreview = content.substring(0, 50) + (content.length > 50 ? "..." : "");

    await withRetry(async () => supabase.from(DB_TABLES.CHAT_MESSAGES).insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      file_url: fileUrl,
      file_type: fileType,
      expires_in: expiresIn || "never",
      max_views: maxViews
    }));

    // Send push notifications to other participants
    await fetch("/api/push/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        senderName,
        messagePreview,
        senderId: user.id,
      }),
    }).catch(err => console.error("Failed to send push notifications:", err));
  };

  const toggleReaction = useCallback(async (messageId: string, emoji: string) => {
    const uid = userIdRef.current;
    if (!uid) return;

    const alreadyMine = myReactions[messageId]?.has(emoji);

    if (alreadyMine) {
      // Optimistic remove
      setMyReactions(prev => {
        const next = { ...prev };
        const s = new Set(prev[messageId]);
        s.delete(emoji);
        next[messageId] = s;
        return next;
      });
      setAllReactions(prev => {
        const next = { ...prev };
        if (next[messageId]?.[emoji]) {
          next[messageId] = { ...next[messageId], [emoji]: Math.max(0, next[messageId][emoji] - 1) };
        }
        return next;
      });

      await withRetry(async () =>
        supabase
          .from(DB_TABLES.CHAT_REACTIONS)
          .delete()
          .match({ message_id: messageId, user_id: uid, emoji })
      );
    } else {
      // Optimistic add
      setMyReactions(prev => {
        const next = { ...prev };
        const s = new Set(prev[messageId] || []);
        s.add(emoji);
        next[messageId] = s;
        return next;
      });
      setAllReactions(prev => {
        const next = { ...prev };
        const r = { ...next[messageId] };
        r[emoji] = (r[emoji] || 0) + 1;
        next[messageId] = r;
        return next;
      });

      await withRetry(async () =>
        supabase
          .from(DB_TABLES.CHAT_REACTIONS)
          .insert({ message_id: messageId, user_id: uid, emoji })
      );
    }
  }, [myReactions]);

  return { 
    messages, 
    loading, 
    hasMore, 
    loadingMore, 
    loadMore, 
    sendMessage, 
    readTimestamps,
    allReactions,
    myReactions,
    toggleReaction
  };
}
