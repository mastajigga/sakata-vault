"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";

interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  level: number; // 1=bronze, 2=argent, 3=or
}

interface ReputationStats {
  articlesCount: number;
  forumPosts: number;
  langueLessonsCompleted: number;
  contributionStatus: string;
  totalScore: number;
  badges: Badge[];
}

function computeBadges(stats: ReputationStats): Badge[] {
  const badges: Badge[] = [];

  // Gardien du Savoir — articles écrits
  if (stats.articlesCount >= 10) badges.push({ id: "gardien-or", name: "Gardien du Savoir", emoji: "📜", description: "10+ articles publiés", level: 3 });
  else if (stats.articlesCount >= 5) badges.push({ id: "gardien-argent", name: "Gardien du Savoir", emoji: "📜", description: "5+ articles", level: 2 });
  else if (stats.articlesCount >= 1) badges.push({ id: "gardien-bronze", name: "Gardien du Savoir", emoji: "📜", description: "1er article", level: 1 });

  // Voix du Village — posts forum
  if (stats.forumPosts >= 50) badges.push({ id: "voix-or", name: "Voix du Village", emoji: "🗣️", description: "50+ messages forum", level: 3 });
  else if (stats.forumPosts >= 20) badges.push({ id: "voix-argent", name: "Voix du Village", emoji: "🗣️", description: "20+ messages", level: 2 });
  else if (stats.forumPosts >= 5) badges.push({ id: "voix-bronze", name: "Voix du Village", emoji: "🗣️", description: "5+ messages", level: 1 });

  // Élève de la Rivière — leçons de langue
  if (stats.langueLessonsCompleted >= 9) badges.push({ id: "eleve-or", name: "Élève de la Rivière", emoji: "🌊", description: "9+ leçons complétées", level: 3 });
  else if (stats.langueLessonsCompleted >= 5) badges.push({ id: "eleve-argent", name: "Élève de la Rivière", emoji: "🌊", description: "5+ leçons", level: 2 });
  else if (stats.langueLessonsCompleted >= 1) badges.push({ id: "eleve-bronze", name: "Élève de la Rivière", emoji: "🌊", description: "1ère leçon", level: 1 });

  // Griot — contributeur approuvé
  if (stats.contributionStatus === "approved") badges.push({ id: "griot", name: "Griot", emoji: "🎤", description: "Contributeur officiel", level: 3 });

  // Ancien — score total élevé
  if (stats.totalScore >= 500) badges.push({ id: "ancien", name: "Ancien du Village", emoji: "👴", description: "500+ points de sagesse", level: 3 });

  return badges;
}

const LEVEL_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "rgba(180,130,80,0.08)", border: "rgba(180,130,80,0.2)", text: "#CD7F32" },
  2: { bg: "rgba(192,192,192,0.08)", border: "rgba(192,192,192,0.2)", text: "#C0C0C0" },
  3: { bg: "rgba(196,160,53,0.12)", border: "rgba(196,160,53,0.3)", text: "var(--or-ancestral)" },
};

export function useReputation() {
  const { user } = useAuth() as any;
  const [stats, setStats] = useState<ReputationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchStats(user.id);
  }, [user?.id]);

  const fetchStats = async (userId: string) => {
    try {
      // Articles
      const { count: articlesCount } = await supabase
        .from(DB_TABLES.ARTICLES)
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId);

      // Forum posts
      const { count: forumPosts } = await supabase
        .from(DB_TABLES.FORUM_POSTS)
        .select("*", { count: "exact", head: true })
        .eq("author_id", userId);

      // Langue progress
      const { data: langueData } = await supabase
        .from(DB_TABLES.LANGUE_PROGRESS)
        .select("completed_lessons, score, streak")
        .eq("user_id", userId)
        .single();

      const langueLessonsCompleted = langueData?.completed_lessons?.length || 0;
      const langueScore = langueData?.score || 0;

      // Contribution status
      const { data: profile } = await supabase
        .from(DB_TABLES.PROFILES)
        .select("contributor_status")
        .eq("id", userId)
        .single();

      const baseStats: ReputationStats = {
        articlesCount: articlesCount || 0,
        forumPosts: forumPosts || 0,
        langueLessonsCompleted,
        contributionStatus: profile?.contributor_status || "none",
        totalScore: (articlesCount || 0) * 15 + (forumPosts || 0) * 3 + langueScore,
        badges: [],
      };

      baseStats.badges = computeBadges(baseStats);
      setStats(baseStats);
    } catch (err) {
      console.error("Reputation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading };
}

/** Composant d'affichage des badges */
export function BadgeDisplay({ badges }: { badges: Badge[] }) {
  if (!badges.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map(badge => {
        const colors = LEVEL_COLORS[badge.level];
        return (
          <div key={badge.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text }}>
            <span>{badge.emoji}</span>
            <span>{badge.name}</span>
          </div>
        );
      })}
    </div>
  );
}

/** Composant résumé de réputation pour le profil */
export function ReputationSummary() {
  const { stats, loading } = useReputation();

  if (loading || !stats) return null;

  return (
    <div className="rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-6">
      <h3 className="text-lg font-display text-[var(--ivoire-ancien)] mb-4">Réputation</h3>

      {/* Score */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-[rgba(196,160,53,0.12)] border border-[rgba(196,160,53,0.25)] flex items-center justify-center">
          <span className="text-xl font-bold text-[var(--or-ancestral)]">{stats.totalScore}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--ivoire-ancien)]">Points de Sagesse</p>
          <p className="text-xs text-[rgba(212,221,215,0.4)]">Articles · Forum · Cours de langue</p>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-center p-3 rounded-xl bg-[rgba(10,31,21,0.3)]">
          <p className="text-lg font-bold text-[var(--ivoire-ancien)]">{stats.articlesCount}</p>
          <p className="text-[10px] text-[rgba(212,221,215,0.4)]">Articles</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-[rgba(10,31,21,0.3)]">
          <p className="text-lg font-bold text-[var(--ivoire-ancien)]">{stats.forumPosts}</p>
          <p className="text-[10px] text-[rgba(212,221,215,0.4)]">Messages</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-[rgba(10,31,21,0.3)]">
          <p className="text-lg font-bold text-[var(--ivoire-ancien)]">{stats.langueLessonsCompleted}</p>
          <p className="text-[10px] text-[rgba(212,221,215,0.4)]">Leçons</p>
        </div>
      </div>

      {/* Badges */}
      <p className="text-xs text-[rgba(212,221,215,0.4)] mb-3 uppercase tracking-wider">Badges</p>
      {stats.badges.length === 0 ? (
        <p className="text-xs text-[rgba(212,221,215,0.3)] italic">
          Aucun badge pour le moment. Écrivez un article, participez au forum ou suivez un cours de langue !
        </p>
      ) : (
        <BadgeDisplay badges={stats.badges} />
      )}
    </div>
  );
}
