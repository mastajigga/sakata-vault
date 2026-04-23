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

  // P1-B: Batching pour éviter N+1 profile queries sur les realtime inserts
  const pendingProfileFetchRef = useRef<Set<string>>(new Set());
  const profileFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Résoudre l'userId une seule fois au montage, puis le mettre à jour si la session change
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: any }) => {
      const uid = data.session?.user?.id || "";
      userIdRef.current = uid;
      setCurrentUserId(uid);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      const uid = session?.user?.id || "";
      userIdRef.current = uid;
      setCurrentUserId(uid);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Résoudre une signed URL depuis un chemin storage:
  // - Images éphémères (maxViews > 0) : TTL 60s pour forcer l'expiration après countdown
  // - Images normales : TTL 3600s (1h) — URL publique signée sécurisée
  // - Audio/PDF : URL publique directe (pas de contrainte d'expiration)
  const resolveFileUrl = useCallback(async (
    fileUrl: string | undefined,
    fileType: string | undefined,
    maxViews: number | undefined
  ): Promise<string | undefined> => {
    if (!fileUrl) return fileUrl;
    if (fileUrl.startsWith('storage:')) {
      const path = fileUrl.replace(`storage:${DB_BUCKETS.CHAT_ATTACHMENTS}/`, '');
      const ttl = maxViews ? 60 : 3600;
      const { data } = await supabase.storage
        .from(DB_BUCKETS.CHAT_ATTACHMENTS)
        .createSignedUrl(path, ttl);
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
    reply_to_message_id: msg.reply_to_message_id,
  }), []);

  const resolveSignedUrls = useCallback(async (msgs: Message[]): Promise<Message[]> => {
    return Promise.all(msgs.map(async (msg) => {
      // Résoudre toutes les URLs storage: (images éphémères ET normales, audio, pdf)
      if (msg.fileUrl?.startsWith('storage:')) {
        const resolved = await resolveFileUrl(msg.fileUrl, msg.fileType, msg.maxViews);
        return { ...msg, fileUrl: resolved };
      }
      return msg;
    }));
  }, [resolveFileUrl]);

  // P1-B: Batch fetch profiles pour éviter N+1 queries
  const batchFetchProfiles = useCallback(async (userIds: string[]): Promise<Record<string, any>> => {
    if (userIds.length === 0) return {};
    const { data } = await supabase
      .from(DB_TABLES.PROFILES)
      .select('id, nickname, username')
      .in('id', userIds);
    const profiles: Record<string, any> = {};
    if (data) {
      for (const p of data) {
        profiles[p.id] = p;
      }
    }
    return profiles;
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const controller = new AbortController();
    let mounted = true;

    async function markAsRead() {
      const uid = userIdRef.current;
      if (!uid || !conversationId || !mounted) return;
      await supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', uid)
        .abortSignal(controller.signal);
    }

    async function fetchReadTimestamps() {
      if (!mounted) return;
      const { data: participants } = await supabase
        .from(DB_TABLES.CHAT_PARTICIPANTS)
        .select('user_id, last_read_at')
        .eq('conversation_id', conversationId)
        .abortSignal(controller.signal);

      if (participants && mounted) {
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
      if (msgIds.length === 0 || !mounted) return;
      const uid = userIdRef.current;
      const { data } = await supabase
        .from(DB_TABLES.CHAT_REACTIONS)
        .select("message_id, user_id, emoji")
        .in("message_id", msgIds)
        .abortSignal(controller.signal);

      if (!data || !mounted) return;

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
        if (!mounted) return;
        setLoading(true);
        // Cleanup non-critique — fire and forget
        Promise.resolve(supabase.rpc('cleanup_expired_messages')).catch(() => {});

        const uid = userIdRef.current;

        const { data, error } = await withRetry(async () =>
          supabase
            .from(DB_TABLES.CHAT_MESSAGES)
            .select(`
              id, content, file_url, file_type, created_at, expires_in,
              sender_id, max_views, reply_to_message_id,
              profiles:sender_id ( nickname, username )
            `)
            .eq('conversation_id', conversationId)
            .eq('is_deleted', false)
            .order('created_at', { ascending: false })
            .limit(PAGE_SIZE)
            .abortSignal(controller.signal)
        );

        if (!mounted) return;
        if (error) {
          if (error.message?.includes("AbortError") || error.message?.includes("abort")) {
            console.log("[Chat] Fetch annulé.");
          } else {
            console.error("Error fetching messages (after retries):", error);
          }
        } else if (data) {
          const reversed = [...(data as any[])].reverse();
          const formatted = reversed.map((msg: any) => formatMessage(msg, uid));
          const resolved = await resolveSignedUrls(formatted);
          if (!mounted) return;
          setMessages(resolved);
          setHasMore((data as any[]).length === PAGE_SIZE);

          markAsRead();
          fetchReadTimestamps();
          fetchReactions((data as any[]).map(m => m.id));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("JS Exception fetching messages:", err);
        }
      } finally {
        if (mounted) setLoading(false);
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
      }, async (payload: any) => {
        if (!mounted) return;
        const newMsg = payload.new;

        // P1-B: Accumulate sender_id for batched profile fetch
        const senderId = newMsg.sender_id;
        pendingProfileFetchRef.current.add(senderId);

        // Clear existing timeout if any
        if (profileFetchTimeoutRef.current) {
          clearTimeout(profileFetchTimeoutRef.current);
        }

        // Schedule batch fetch after 150ms to allow multiple messages to accumulate
        profileFetchTimeoutRef.current = setTimeout(async () => {
          if (!mounted) return;

          const userIds = Array.from(pendingProfileFetchRef.current);
          pendingProfileFetchRef.current.clear();
          profileFetchTimeoutRef.current = null;

          const profiles = await batchFetchProfiles(userIds);

          // Update messages that are waiting for these profiles
          setMessages(prev => prev.map(msg => {
            if (msg.senderId in profiles && !msg.senderName.includes('·')) {
              const profileData = profiles[msg.senderId];
              return {
                ...msg,
                senderName: profileData.nickname || profileData.username || "Inconnu"
              };
            }
            return msg;
          }));
        }, 150);

        // Still add message optimistically with placeholder name
        const uid = userIdRef.current;
        let formatted = formatMessage({ ...newMsg, profiles: { nickname: null, username: newMsg.sender_id } }, uid);

        if (formatted.fileType === 'image' && formatted.maxViews && formatted.fileUrl?.startsWith('storage:')) {
          const resolved = await resolveFileUrl(formatted.fileUrl, formatted.fileType, formatted.maxViews);
          formatted = { ...formatted, fileUrl: resolved };
        }

        setMessages(prev => {
          // Si c'est notre propre message qui revient via Realtime, 
          // on cherche s'il y a une version optimiste à remplacer.
          if (newMsg.sender_id === uid) {
            const hasOptimistic = prev.some(m => (m as any).isOptimistic && m.content === newMsg.content);
            if (hasOptimistic) {
              // On remplace le premier message optimiste correspondant par la version officielle
              let replaced = false;
              return prev.map(m => {
                if (!replaced && (m as any).isOptimistic && m.content === newMsg.content) {
                  replaced = true;
                  return formatted;
                }
                return m;
              });
            }
          }
          
          // Sinon (message d'autrui ou pas d'optimiste trouvé), on l'ajoute simplement
          // On vérifie quand même les doublons par ID
          if (prev.some(m => m.id === formatted.id)) return prev;
          return [...prev, formatted];
        });
        if (newMsg.sender_id !== uid) markAsRead();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: DB_TABLES.CHAT_PARTICIPANTS,
        filter: `conversation_id=eq.${conversationId}`
      }, (payload: any) => {
        if (!mounted) return;
        const updated = payload.new;
        if (updated.user_id && updated.last_read_at) {
          setReadTimestamps(prev => ({ ...prev, [updated.user_id]: updated.last_read_at }));
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: DB_TABLES.CHAT_REACTIONS
      }, async (payload: any) => {
        if (!mounted) return;
        const msgId = (payload.new as any)?.message_id || (payload.old as any)?.message_id;
        if (msgId) {
          fetchReactions(messages.map(m => m.id)); 
        }
      })
      .subscribe((status: any, err: any) => {
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('[Chat] WebSocket error:', err || status);
        }
      });

    return () => {
      mounted = false;
      controller.abort();
      supabase.removeChannel(channel);
      if (profileFetchTimeoutRef.current) {
        clearTimeout(profileFetchTimeoutRef.current);
      }
    };
  }, [conversationId, currentUserId, formatMessage, resolveSignedUrls, resolveFileUrl]); // Supression de messages.length pour stabiliser le WebSocket


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
            sender_id, max_views, reply_to_message_id,
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
        const reversed = [...(data as any[])].reverse();
        const formatted = reversed.map((msg: any) => formatMessage(msg, uid));
        const resolved = await resolveSignedUrls(formatted);
        setMessages(prev => [...resolved, ...prev]);
        setHasMore((data as any[]).length === PAGE_SIZE);
      }
    } catch (err) {
      console.error("JS Exception loading more messages:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [conversationId, hasMore, loadingMore, messages, formatMessage, resolveSignedUrls]);


  const sendMessage = async (content: string, attachment?: File | null, expiresIn?: string, maxViews?: 1 | 2, reply_to_message_id?: string) => {
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
        // Toujours stocker le PATH storage: pour générer des Signed URLs à la lecture.
        // Cela sécurise à la fois les images éphémères ET les fichiers normaux.
        fileUrl = `storage:${DB_BUCKETS.CHAT_ATTACHMENTS}/${(data as any).path}`;
      }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname, username")
      .eq("id", user.id)
      .single();

    const senderName = profile?.nickname || profile?.username || "Utilisateur";
    const messagePreview = content.substring(0, 50) + (content.length > 50 ? "..." : "");

    // Optimistic UI update
    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      senderId: user.id,
      senderName: senderName,
      content,
      fileUrl: fileUrl || undefined,
      fileType: (fileType as any) || undefined,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAtRaw: new Date().toISOString(),
      isMe: true,
      reply_to_message_id: reply_to_message_id,
    };
    (optimisticMessage as any).isOptimistic = true;

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      await withRetry(async () => supabase.from(DB_TABLES.CHAT_MESSAGES).insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        file_url: fileUrl,
        file_type: fileType,
        expires_in: expiresIn || "never",
        max_views: maxViews,
        reply_to_message_id: reply_to_message_id || null
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
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticId));
      throw err;
    }
  };

  // Soft delete: set is_deleted=true (sender only, optimistic UI)
  const deleteMessage = useCallback(async (id: string) => {
    // Optimistic: remove immediately from local state
    setMessages(prev => prev.filter(m => m.id !== id));
    try {
      await withRetry(async () =>
        supabase
          .from(DB_TABLES.CHAT_MESSAGES)
          .update({ is_deleted: true })
          .eq('id', id)
          .eq('sender_id', userIdRef.current)
      );
    } catch (err) {
      console.error('[Chat] Failed to delete message:', err);
    }
  }, []);

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
    deleteMessage,
    readTimestamps,
    allReactions,
    myReactions,
    toggleReaction
  };
}
