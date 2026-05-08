"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Bell, Hourglass } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";

type Warning = {
  id: string;
  message: string;
  created_at: string;
  moderator: { nickname: string | null; username: string | null } | null;
};

const formatRemaining = (until: string) => {
  const ms = new Date(until).getTime() - Date.now();
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function ModerationGate() {
  const { user, bannedUntil, banReason, deletedAt, refreshProfile, signOut } = useAuth();
  const [now, setNow] = useState(Date.now());
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [warningsLoaded, setWarningsLoaded] = useState(false);

  const isBanned = !!bannedUntil && new Date(bannedUntil).getTime() > now;
  const isDeleted = !!deletedAt;

  // Tick countdown
  useEffect(() => {
    if (!isBanned) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isBanned]);

  // Auto-refresh profile when ban expires (so the modal closes)
  useEffect(() => {
    if (!bannedUntil) return;
    const remaining = new Date(bannedUntil).getTime() - Date.now();
    if (remaining <= 0) return;
    const id = setTimeout(() => refreshProfile(), remaining + 500);
    return () => clearTimeout(id);
  }, [bannedUntil, refreshProfile]);

  // Realtime subscription on own profile (instant unban / ban update)
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`profile-mod-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: DB_TABLES.PROFILES, filter: `id=eq.${user.id}` },
        () => { refreshProfile(); }
      )
      .subscribe((status: string, err?: any) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.warn("[ModerationGate] channel error", err);
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, refreshProfile]);

  // If account is soft-deleted, force logout
  useEffect(() => {
    if (isDeleted && user) {
      // Show the message briefly then logout
      const id = setTimeout(() => signOut(), 5000);
      return () => clearTimeout(id);
    }
  }, [isDeleted, user, signOut]);

  // Fetch unread warnings
  const fetchWarnings = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from(DB_TABLES.MODERATION_WARNINGS)
      .select("id, message, created_at, moderator:profiles!moderator_id (nickname, username)")
      .eq("user_id", user.id)
      .is("read_at", null)
      .order("created_at", { ascending: true });
    setWarnings((data as any) || []);
    setWarningsLoaded(true);
  }, [user?.id]);

  useEffect(() => { fetchWarnings(); }, [fetchWarnings]);

  // Realtime new warnings
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`warnings-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.MODERATION_WARNINGS, filter: `user_id=eq.${user.id}` },
        () => fetchWarnings()
      )
      .subscribe((status: string, err?: any) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.warn("[ModerationGate] warnings channel error", err);
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchWarnings]);

  const acknowledgeWarning = async (id: string) => {
    await supabase
      .from(DB_TABLES.MODERATION_WARNINGS)
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
    setWarnings((w) => w.filter((x) => x.id !== id));
  };

  // ========== Soft-deleted account ==========
  if (isDeleted) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-foret-nocturne">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-1 rounded-[2rem]"
          style={{ background: "linear-gradient(135deg, rgba(242,238,221,0.1), transparent)", border: "1px solid rgba(242,238,221,0.05)" }}
        >
          <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-ivoire-ancien">Compte suspendu</h2>
              <p className="text-sm opacity-60 leading-relaxed">
                Ce compte a été placé en corbeille par un administrateur. Il sera définitivement supprimé après 6 mois.
                Pour toute question, contactez les anciens du sanctuaire.
              </p>
            </div>
            <p className="text-xs opacity-30 italic">Déconnexion automatique...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== Active ban ==========
  if (isBanned && bannedUntil) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-foret-nocturne/95 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-1 rounded-[2rem]"
          style={{ background: "linear-gradient(135deg, rgba(242,238,221,0.1), transparent)", border: "1px solid rgba(242,238,221,0.05)" }}
        >
          <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-8 space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
              <Hourglass className="w-7 h-7 text-red-400" />
            </div>
            <div className="space-y-2">
              <span className="eyebrow text-red-400">Sanctuaire fermé</span>
              <h2 className="font-display text-2xl font-bold text-ivoire-ancien">Votre accès est suspendu</h2>
              <p className="text-sm opacity-60 leading-relaxed">
                Un modérateur vous a temporairement banni du village. Patientez le temps du décompte ou attendez qu'un ancien lève la sanction.
              </p>
            </div>

            {banReason && (
              <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 text-sm">
                <p className="text-[10px] uppercase tracking-widest opacity-40 mb-1">Motif</p>
                <p className="italic opacity-80">"{banReason}"</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest opacity-40">Temps restant</p>
              <p className="font-mono text-3xl font-bold text-or-ancestral tabular-nums">{formatRemaining(bannedUntil)}</p>
            </div>

            <button
              onClick={signOut}
              className="w-full py-3 rounded-xl border border-white/10 text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
            >
              Se déconnecter
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== Warnings stack ==========
  if (warningsLoaded && warnings.length > 0) {
    const w = warnings[0];
    return (
      <AnimatePresence>
        <motion.div
          key={w.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-foret-nocturne/85 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-md w-full p-1 rounded-[2rem]"
            style={{ background: "linear-gradient(135deg, rgba(181,149,81,0.15), transparent)", border: "1px solid rgba(181,149,81,0.15)" }}
          >
            <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-8 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-or-ancestral/15 border border-or-ancestral/30 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-or-ancestral" />
                </div>
                <div className="space-y-1">
                  <span className="eyebrow text-or-ancestral">Rappel à l'ordre</span>
                  <h2 className="font-display text-xl font-bold text-ivoire-ancien">Un message des anciens</h2>
                </div>
              </div>

              <div className="px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm leading-relaxed text-ivoire-ancien/90 whitespace-pre-wrap">
                {w.message}
              </div>

              {w.moderator && (
                <p className="text-[10px] opacity-40 uppercase tracking-widest font-mono">
                  De la part de {w.moderator.nickname || w.moderator.username}
                </p>
              )}

              <button
                onClick={() => acknowledgeWarning(w.id)}
                className="w-full py-3 rounded-xl bg-or-ancestral text-foret-nocturne font-bold hover:bg-or-ancestral/90 transition-all"
              >
                J'ai compris{warnings.length > 1 ? ` (${warnings.length - 1} autre${warnings.length > 2 ? "s" : ""})` : ""}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
}
