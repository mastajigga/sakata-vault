"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Message } from "@/components/chat/ChatWindow";

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conversationId) return;

    let userId = "";

    async function fetchMessages() {
      try {
        const { data: activeSession } = await supabase.auth.getSession();
        userId = activeSession?.session?.user?.id || "";

        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            id, content, file_url, file_type, created_at, expires_in,
            sender_id, max_views,
            profiles:sender_id ( nickname, username )
          `)
          .eq('conversation_id', conversationId)
          .eq('is_deleted', false)
          .order('created_at', { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
        } else if (data) {
          const formattedMessages: Message[] = data.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.profiles?.nickname || msg.profiles?.username || "Inconnu",
            content: msg.content || "",
            fileUrl: msg.file_url,
            fileType: msg.file_type,
            createdAt: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: msg.sender_id === userId,
            expiresIn: msg.expires_in,
            maxViews: msg.max_views,
          }));
          setMessages(formattedMessages);
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
        table: 'chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, async (payload) => {
        // Quick fetch or adapt payload
        const newMsg = payload.new;
        
        // Fetch sender details
        const { data: profileData } = await supabase
          .from('profiles')
          .select('nickname, username')
          .eq('id', newMsg.sender_id)
          .single();

        const formattedNewMsg: Message = {
          id: newMsg.id,
          senderId: newMsg.sender_id,
          senderName: profileData?.nickname || profileData?.username || "Inconnu",
          content: newMsg.content || "",
          fileUrl: newMsg.file_url,
          fileType: newMsg.file_type,
          createdAt: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: newMsg.sender_id === userId,
          expiresIn: newMsg.expires_in,
          maxViews: newMsg.max_views,
        };

        setMessages(prev => [...prev, formattedNewMsg]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const sendMessage = async (content: string, attachment?: File | null, expiresIn?: string, maxViews?: 1 | 2) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fileUrl = null;
    let fileType = null;

    if (attachment) {
      if (attachment.type.startsWith('audio/')) fileType = 'audio';
      else if (attachment.type.startsWith('image/')) fileType = 'image';
      else if (attachment.type === 'application/pdf') fileType = 'pdf';
      else fileType = 'pdf'; // fallback or adjust DB schema if you want 'other'

      const fileExt = attachment.name.split('.').pop() || 'tmp';
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data, error } = await supabase.storage.from('chat_attachments').upload(fileName, attachment, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        console.error("Erreur lors de l'upload de la pièce jointe:", error);
      } else if (data) {
        const { data: publicData } = supabase.storage.from('chat_attachments').getPublicUrl(data.path);
        fileUrl = publicData.publicUrl;
      }
    }

    await supabase.from('chat_messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      file_url: fileUrl,
      file_type: fileType,
      expires_in: expiresIn || "never",
      max_views: maxViews
    });
  };

  return { messages, loading, sendMessage };
}
