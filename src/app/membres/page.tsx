"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Search, SortAsc, Clock, Users, MapPin, MessageCircle } from "lucide-react";
import { MemberImage } from "@/components/MemberImage";
import { useAuth } from "@/components/AuthProvider";

const PAGE_SIZE = 20;

interface Profile {
  id: string;
  username: string;
  nickname: string | null;
  avatar_url: string | null;
  cover_photo_url: string | null;
  short_bio: string | null;
  location: string | null;
  contributor_status?: string | null;
  created_at?: string;
}

type SortMode = "recent" | "alpha";

export default function MembresPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortMode>("recent");
  const [showContributors, setShowContributors] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { isLoading: authLoading } = useAuth();

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchProfiles() {
      // SÉQUENÇAGE : Attendre que l'auth soit stable avant de lancer les requêtes lourdes
      if (authLoading) {
        console.log("[Membres] En attente de la fin du chargement Auth...");
        return;
      }

      // Petit délai de courtoisie pour laisser respirer le réseau
      await new Promise(resolve => setTimeout(resolve, 300));
      if (!mounted) return;

      console.log("[Membres] Début fetchProfiles...");
      setLoading(true);

      // Safety Timeout local : Si le fetch prend trop de temps, on libère l'UI
      const safetyTimeout = setTimeout(() => {
        if (mounted && loading) {
          console.warn("[Membres] Fetch profiles timeout (>8s). Forcer la fin du chargement.");
          setLoading(false);
        }
      }, 8000);

      try {
        const { data, error } = await supabase
          .from(DB_TABLES.PROFILES)
          .select("id, username, nickname, avatar_url, cover_photo_url, short_bio, location, contributor_status, created_at")
          .order("created_at", { ascending: false })
          .abortSignal(controller.signal);
        
        if (!mounted) return;

        if (error) {
          if (error.message?.includes("AbortError") || error.message?.includes("abort")) {
            console.log("[Membres] Requête annulée par l'utilisateur.");
          } else {
            console.error("[Membres] Fetch error:", error.message);
          }
        } else if (data) {
          console.log("[Membres] Profils récupérés:", data.length);
          setProfiles(data as Profile[]);
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("[Membres] Requête interrompue proprement.");
        } else {
          console.error("[Membres] Exception fetchProfiles:", err);
        }
      } finally {
        if (mounted) {
          clearTimeout(safetyTimeout);
          setLoading(false);
        }
      }
    }
    
    fetchProfiles();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [authLoading]); // Redéclenche quand l'auth est prête

  // Filtrage + tri client-side
  const filtered = useMemo(() => {
    let list = [...profiles];

    // Filtre contributeurs approuvés
    if (showContributors) {
      list = list.filter(p => p.contributor_status === "approved");
    }

    // Recherche
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(p =>
        (p.nickname?.toLowerCase().includes(q)) ||
        (p.username?.toLowerCase().includes(q)) ||
        (p.short_bio?.toLowerCase().includes(q)) ||
        (p.location?.toLowerCase().includes(q))
      );
    }

    // Tri
    if (sort === "alpha") {
      list.sort((a, b) => {
        const nameA = (a.nickname || a.username || "").toLowerCase();
        const nameB = (b.nickname || b.username || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    return list;
  }, [profiles, search, sort, showContributors]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen pb-12" style={{ backgroundColor: "var(--foret-nocturne)" }}>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[35vh] min-h-[250px]">
        <Image
          src="/images/community-banner.png"
          alt="Sakata Community"
          fill
          priority={true}
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--foret-nocturne)]/60 to-[var(--foret-nocturne)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">

        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display mb-4" style={{ color: "var(--or-ancestral)" }}>
            Les Membres de la Communauté
          </h1>
          <p className="max-w-2xl text-lg drop-shadow-md" style={{ color: "var(--ivoire-ancien)", opacity: 0.9 }}>
            Découvrez les gardiens du savoir, les documentalistes, les membres de la famille Sakata ainsi que les amis à travers le monde.
          </p>
        </div>

        {/* Barre de recherche + filtres */}
        <div className="flex flex-col md:flex-row gap-3 mb-8" role="search">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Rechercher un membre..."
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)] transition"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSort("recent")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                sort === "recent"
                  ? "border-[var(--or-ancestral)] text-[var(--or-ancestral)] bg-[var(--or-ancestral)]/10"
                  : "border-white/20 text-white/60 hover:border-white/40"
              }`}
            >
              <Clock size={15} />
              Récents
            </button>
            <button
              onClick={() => setSort("alpha")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                sort === "alpha"
                  ? "border-[var(--or-ancestral)] text-[var(--or-ancestral)] bg-[var(--or-ancestral)]/10"
                  : "border-white/20 text-white/60 hover:border-white/40"
              }`}
            >
              <SortAsc size={15} />
              A → Z
            </button>
            <button
              onClick={() => { setShowContributors(v => !v); setVisibleCount(PAGE_SIZE); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
                showContributors
                  ? "border-emerald-400 text-emerald-400 bg-emerald-400/10"
                  : "border-white/20 text-white/60 hover:border-white/40"
              }`}
            >
              <Users size={15} />
              Contributeurs
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20" style={{ color: "var(--or-ancestral)" }}>
            <div className="animate-pulse mb-4">Recherche des membres...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--ivoire-ancien)", opacity: 0.5 }}>
            <p className="text-2xl mb-2">🔍</p>
            <p>Aucun membre ne correspond à votre recherche.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visible.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.5) }}
                  className="group"
                >
                  <Link href={`/membre/${profile.username}`} className="block relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-stone-800">
                    <MemberImage profile={profile} priority={i < 4} />

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--foret-nocturne)] via-[var(--foret-nocturne)]/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-80" />

                    {profile.contributor_status === "approved" && (
                      <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        ✍ Contributeur
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                      <h2 className="text-2xl font-display font-medium text-white drop-shadow-lg mb-1">
                        {profile.nickname || profile.username}
                      </h2>
                      <p className="text-xs tracking-wide uppercase mb-3" style={{ color: "var(--or-ancestral)", fontWeight: 600 }}>
                        @{profile.username}
                      </p>

                      {profile.short_bio && (
                        <p className="text-sm line-clamp-2 italic mb-4" style={{ color: "var(--ivoire-ancien)", opacity: 0.8 }}>
                          "{profile.short_bio}"
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        {profile.location && (
                          <div className="flex items-center text-[10px]" style={{ color: "var(--ivoire-ancien)", opacity: 0.7 }}>
                            <MapPin size={12} className="mr-1" />
                            {profile.location}
                          </div>
                        )}
                        {profile.created_at && (
                          <div className="flex items-center text-[10px]" style={{ color: "var(--ivoire-ancien)", opacity: 0.7 }}>
                            <Clock size={12} className="mr-1" />
                            {new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                          </div>
                        )}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" style={{ backgroundColor: "var(--or-ancestral)", color: "var(--foret-nocturne)" }}>
                          <MessageCircle size={16} fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
                  className="px-8 py-3 rounded-xl font-medium transition-colors border"
                  style={{ borderColor: "var(--or-ancestral)", color: "var(--or-ancestral)" }}
                >
                  Voir plus ({filtered.length - visibleCount} restants)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
