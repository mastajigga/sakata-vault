"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, ChevronLeft, Quote, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

interface Profile {
  id: string;
  username: string;
  nickname: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  bio: string | null;
  short_bio: string | null;
  location: string | null;
}

export default function MembreProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const decodedUsername = decodeURIComponent(username as string);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", decodedUsername)
        .single();
        
      if (data) {
        setProfile(data as Profile);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username]);

  const startDirectMessage = async () => {
    if (!currentUser || !profile || creatingChat) return;
    setCreatingChat(true);

    try {
      const { data: convData, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          type: 'direct',
          created_by: currentUser.id
        })
        .select('id')
        .single();
        
      if (convError) throw convError;
      const convId = convData.id;
      
      const { error: partError } = await supabase
        .from('chat_participants')
        .insert([
          { conversation_id: convId, user_id: currentUser.id, role: 'admin' },
          { conversation_id: convId, user_id: profile.id, role: 'member' }
        ]);
        
      if (partError) throw partError;
      
      router.push(`/chat/${convId}`);
      
    } catch (e) {
      console.error("Failed to start conversation:", e);
      alert("Erreur lors de l'ouverture de la discussion.");
    } finally {
      setCreatingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1F15] flex items-center justify-center">
        <div className="animate-pulse text-[#B59551] flex flex-col items-center">
          <div className="w-16 h-16 border-t-2 border-[#B59551] rounded-full animate-spin mb-4" />
          <p>Lecture des âmes...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A1F15] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-display text-[#B59551] mb-6">Profil introuvable</h1>
        <p className="text-[#F2EEDD]/70 mb-8 max-w-md">Cet esprit n'a pas encore laissé de trace dans la brume.</p>
        <Link href="/membres" className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition">
          Retour à la communauté
        </Link>
      </div>
    );
  }

  const imageToUse = profile.cover_photo_url || profile.avatar_url;

  return (
    <div className="min-h-screen bg-[#0A1F15] flex flex-col md:flex-row relative">
      
      {/* Mobile/Floating Back Button */}
      <Link 
        href="/membres" 
        className="fixed top-24 left-6 z-50 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <ChevronLeft size={24} />
      </Link>

      {/* Picture / Graphic Half (Full screen on mobile, left half on desktop) */}
      <div className="relative w-full h-[60vh] md:h-screen md:flex-1 md:sticky md:top-0 bg-[#0A1F15] overflow-hidden">
        {imageToUse ? (
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={imageToUse}
            alt={profile.username}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center border-r border-[#B59551]/10">
            <UserIcon size={120} className="text-[#B59551]/20 mb-6" />
          </div>
        )}
        
        {/* Gradient mapping for text overlap readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F15] via-[#0A1F15]/40 to-transparent md:bg-gradient-to-r md:from-transparent md:via-[#0A1F15]/20 md:to-[#0A1F15] pointer-events-none" />
      </div>

      {/* Scrollable Content Half (Bottom attached on mobile, right half on desktop) */}
      <div className="w-full md:flex-1 bg-[#0A1F15] relative z-10 -mt-8 md:mt-0 px-6 sm:px-12 pt-12 pb-32 rounded-t-[40px] md:rounded-none flex flex-col">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl mx-auto w-full flex-1"
        >
          {/* Header ID */}
          <div className="mb-10">
            <h1 className="text-5xl sm:text-7xl font-display font-medium text-white mb-2 tracking-tight">
              {profile.nickname || profile.username}
            </h1>
            <p className="text-[#B59551] text-xl font-medium tracking-wide">
              @{profile.username}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-12">
            {profile.location && (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#183125] border border-[#B59551]/30 text-[#F2EEDD]">
                <MapPin size={18} className="text-[#B59551]" />
                <span className="text-sm font-medium">{profile.location}</span>
              </div>
            )}
            
            {/* Direct message button */}
            {currentUser && currentUser.id !== profile.id && (
              <button 
                onClick={startDirectMessage}
                disabled={creatingChat}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B59551] text-[#0A1F15] hover:bg-white transition-colors duration-300 font-bold disabled:opacity-50"
              >
                <MessageCircle size={18} className="fill-current" />
                <span>Discuter</span>
              </button>
            )}
          </div>

          {/* Bios & Details */}
          {profile.short_bio && (
            <div className="mb-12 relative">
              <Quote className="absolute -top-4 -left-4 w-12 h-12 text-[#B59551]/10" />
              <p className="text-[#B59551] text-2xl font-serif italic leading-relaxed pl-6 border-l-2 border-[#B59551]/30">
                "{profile.short_bio}"
              </p>
            </div>
          )}

          {profile.bio && (
            <div className="mb-10">
              <h3 className="text-sm uppercase tracking-widest text-[#F2EEDD]/40 font-semibold mb-4">À Propos</h3>
              <p className="text-[#F2EEDD]/80 leading-relaxed text-lg font-light">
                {profile.bio}
              </p>
            </div>
          )}
          
        </motion.div>
      </div>
    </div>
  );
}
