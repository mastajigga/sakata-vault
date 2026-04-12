"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { MapPin, MessageCircle } from "lucide-react";

interface Profile {
  id: string;
  username: string;
  nickname: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  short_bio: string | null;
  location: string | null;
}

export default function MembresPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .not("username", "is", null)
        .order("updated_at", { ascending: false });

      if (data) {
        setProfiles(data as Profile[]);
      }
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1F15] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display text-[#B59551] mb-4">La Communauté</h1>
          <p className="text-[#F2EEDD]/70 max-w-2xl text-lg">
            Découvrez les gardiens du savoir, les documentalistes et les membres de la famille Sakata à travers le monde.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-[#B59551]">
            <div className="animate-pulse flex items-center gap-2">Recherche des membres...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile, i) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <Link href={`/membre/${profile.username}`} className="block relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-[#122A1E]">
                  {/* Photo Background */}
                  {(profile.cover_photo_url || profile.avatar_url) ? (
                    <img 
                      src={profile.cover_photo_url || profile.avatar_url || ""} 
                      alt={profile.username}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full border border-[#B59551]/20 bg-[#183125] flex items-center justify-center">
                      <span className="text-[#B59551]/20 font-display text-8xl">?</span>
                    </div>
                  )}

                  {/* Glassmorphism Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F15] via-[#0A1F15]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

                  {/* Content Container */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                    <h2 className="text-3xl font-display font-medium text-white drop-shadow-lg mb-1">
                      {profile.nickname || profile.username}
                    </h2>
                    
                    <p className="text-[#B59551] font-semibold text-sm tracking-wide uppercase mb-3 drop-shadow flex items-center gap-2">
                       @{profile.username}
                    </p>

                    {profile.short_bio && (
                      <p className="text-[#F2EEDD]/90 text-sm line-clamp-2 italic mb-4">
                        "{profile.short_bio}"
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto">
                      {profile.location && (
                        <div className="flex items-center text-[#F2EEDD]/70 text-xs">
                          <MapPin size={14} className="mr-1" />
                          {profile.location}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <div className="w-10 h-10 rounded-full bg-[#B59551] flex items-center justify-center text-[#0A1F15] opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <MessageCircle fill="currentColor" size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
