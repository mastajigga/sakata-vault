"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import Navbar from "@/components/Navbar";
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  Globe, 
  FileText,
  ChevronLeft,
  Mail,
  Lock,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { resolveStorageUrl } from "@/lib/supabase/storage-utils";
import { MemberImage } from "@/components/MemberImage";

const MemberProfilePage = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchMemberData = async () => {
      // Safety Timeout
      const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn("[Member] Fetch timeout (>8s).");
          setLoading(false);
          setError("Délai d'attente dépassé. Veuillez réessayer.");
        }
      }, 8000);

      try {
        setLoading(true);
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from(DB_TABLES.PROFILES)
          .select("*")
          .eq("username", username)
          .single();

        if (!mounted) return;

        if (profileError || !profileData) {
          setError("Membre introuvable");
          return;
        }

        setProfile(profileData);

        // Fetch gallery
        const { data: galleryData, error: galleryError } = await supabase
          .from(DB_TABLES.PROFILE_GALLERY)
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (!galleryError && galleryData) {
          setGallery(galleryData);
        }
      } catch (err) {
        if (mounted) {
          console.error(err);
          setError("Une erreur est survenue");
        }
      } finally {
        if (mounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    };

    if (username) {
      fetchMemberData();
    }

    return () => { mounted = false; };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-foret-nocturne flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-or-ancestral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-foret-nocturne flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-display text-or-ancestral mb-4">{error}</h1>
        <Link href="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-foret-nocturne">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Header / Cover */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] backdrop-blur-xl mb-8"
        >
          {/* Cover background gradient */}
          <div className="h-32 md:h-48 bg-gradient-to-r from-foret-brumeuse/40 via-or-ancestral/10 to-foret-brumeuse/40" />
          
          <div className="px-6 md:px-10 pb-10 -mt-12 flex flex-col md:flex-row items-end gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-foret-nocturne bg-foret-nocturne relative z-10 shadow-2xl shadow-black/60 overflow-hidden">
              <MemberImage profile={profile} priority={true} />
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold text-or-ancestral">
                  {profile.nickname || profile.username}
                </h1>
                <p className="text-ivoire-ancien/40 font-mono text-sm">@{profile.username}</p>
              </div>

              <div className="flex items-center gap-3">
                <Link 
                  href={`/chat?u=${profile.id}`}
                  className="px-6 py-2.5 rounded-full bg-or-ancestral text-foret-nocturne text-sm font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                  <MessageSquare size={16} />
                  Parler
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Profile Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-or-ancestral/60 mb-6">À propos</h3>
              
              <div className="space-y-4">
                {profile.location && (
                  <div className="flex items-center gap-3 text-ivoire-ancien/60">
                    <MapPin size={16} className="text-or-ancestral/40" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-ivoire-ancien/60">
                  <Calendar size={16} className="text-or-ancestral/40" />
                  <span className="text-sm">Rejoint en {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
                </div>

                {profile.bio && (
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <p className="text-sm text-ivoire-ancien/70 leading-relaxed italic">
                      "{profile.bio}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Main: Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-medium text-or-ancestral">Sanctuaire Visuel</h2>
                <div className="px-3 py-1 rounded-full border border-or-ancestral/20 bg-or-ancestral/5 text-[10px] uppercase font-bold text-or-ancestral/60 tracking-widest flex items-center gap-1.5">
                  <Globe size={10} />
                  Public
                </div>
              </div>

              {gallery.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                  <Lock className="w-10 h-10 text-ivoire-ancien/10 mb-4" />
                  <p className="text-ivoire-ancien/20 font-medium">Aucun contenu public partagé ici.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((item) => (
                    <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                      {item.file_type === 'image' ? (
                        <img 
                          src={resolveStorageUrl(item.file_url, "user_gallery")} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <FileText className="w-10 h-10 text-ivoire-ancien/20" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default MemberProfilePage;
