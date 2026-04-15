"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { Message } from "@/components/chat/ChatWindow";
import { DB_TABLES, DB_BUCKETS } from "@/lib/constants/db";

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // P2-D fix: userIdRef évite les stale closures dans les callbacks realtime.
  // La ref est toujours à jour même si l'userId change (logout/login dans le même onglet).
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

    async function fetchMessages() {
      try {
        // Cleanup non-critique — fire and forget (les messages expirés seront nettoyés au prochain fetch)
        void (supabase.rpc('cleanup_expired_messages') as unknown as Promise<unknown>).catch(() => {});

        // P2-D fix: on lit toujours la ref (jamais une variable locale stale)
        const uid = userIdRef.current;

        // Retry sur le fetch principal — critique pour l'UX
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
            .order('created_at', { ascending: true })
        );

        if (error) {
          console.error("Error fetching messages (after retries):", error);
        } else if (data) {
          const formattedMessages: Message[] = data.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.profiles?.nickname || msg.profiles?.username || "Inconnu",
            content: msg.content || "",
            fileUrl: msg.file_url,
            fileType: msg.file_type,
            createdAt: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: msg.sender_id === uid,
            expiresIn: msg.expires_in,
            maxViews: msg.max_views,
          }));
          setMessages(formattedMessages);
          
          // Mark as read after successful fetch
          markAsRead();
        }
      } catch (err) {
        console.error("JS Exception fetching messages:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();

    // Subscribe to real-time messages
    const channel = supabase.channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: DB_TABLES.CHAT_MESSAGES,
        filter: `conversation_id=eq.${conversationId}`
      }, async (payload) => {
        // Quick fetch or adapt payload
        const newMsg = payload.new;

        // Fetch sender details
        const { data: profileData } = await supabase
          .from(DB_TABLES.PROFILES)
          .select('nickname, username')
          .eq('id', newMsg.sender_id)
          .single();

        // P2-D fix: userIdRef.current toujours à jour même après logout/login
        const uid = userIdRef.current;

        const formattedNewMsg: Message = {
          id: newMsg.id,
          senderId: newMsg.sender_id,
          senderName: profileData?.nickname || profileData?.username || "Inconnu",
          content: newMsg.content || "",
          fileUrl: newMsg.file_url,
          fileType: newMsg.file_type,
          createdAt: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: newMsg.sender_id === uid,
          expiresIn: newMsg.expires_in,
          maxViews: newMsg.max_views,
        };

        setMessages(prev => [...prev, formattedNewMsg]);

        // Mark as read si on regarde cette conversation (jamais pour nos propres messages)
        if (newMsg.sender_id !== uid) {
          markAsRead();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // P2-D fix: re-subscribe si conversationId OU userId change
  // (ex: logout/login dans le même onglet → le channel realtime est rechargé avec le bon userId)
  }, [conversationId, currentUserId]);


  const sendMessage = async (content: string, attachment?: File | null, expiresIn?: string, maxViews?: 1 | 2) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fileUrl = null;
    let fileType = null;

    if (attachment) {
      if (attachment.type.startsWith('audio/')) fileType = 'audio';
      else if (attachment.type.startsWith('image/')) fileType = 'image';
      else if (attachment.type === 'application/pdf') fileType = 'pdf';
      else fileType = 'pdf';

      const fileExt = attachment.name.split('.').pop() || 'tmp';
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload avec retry — une coupure réseau ne doit pas perdre le fichier
      const { data, error } = await withRetry(async () =>
        supabase.storage.from(DB_BUCKETS.CHAT_ATTACHMENTS).upload(fileName, attachment, {
          cacheControl: '3600',
          upsert: false
        })
      );

      if (error) {
        console.error("Erreur lors de l'upload de la pièce jointe (après retries):", error);
      } else if (data) {
        const { data: publicData } = supabase.storage.from(DB_BUCKETS.CHAT_ATTACHMENTS).getPublicUrl(data.path);
        fileUrl = publicData.publicUrl;
      }
    }

    // Insert avec retry — un message ne doit jamais être silencieusement perdu
    await withRetry(async () => supabase.from(DB_TABLES.CHAT_MESSAGES).insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      file_url: fileUrl,
      file_type: fileType,
      expires_in: expiresIn || "never",
      max_views: maxViews
    }));
  };

  return { messages, loading, sendMessage };
}
