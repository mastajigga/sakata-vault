"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, X, Gift } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { DB_TABLES } from "@/lib/constants/db";
import Link from "next/link";

type Grant = {
  id: string;
  tier: "premium" | "elite";
  expires_at: string | null;
  reason: string | null;
  created_at: string;
  acknowledged_at: string | null;
  granted_by: string | null;
  granter?: { nickname: string | null; username: string | null } | null;
};

const formatExpiry = (iso: string | null) => {
  if (!iso) return "illimité";
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
};

const formatDuration = (iso: string | null, createdAt: string) => {
  if (!iso) return "Accès illimité";
  const ms = new Date(iso).getTime() - new Date(createdAt).getTime();
  const days = Math.round(ms / (24 * 60 * 60 * 1000));
  if (days >= 365) return `${Math.round(days / 365)} an${days >= 730 ? "s" : ""}`;
  if (days >= 30) return `${Math.round(days / 30)} mois`;
  return `${days} jours`;
};

export default function SubscriptionGrantGate() {
  const { user } = useAuth();
  const [pending, setPending] = useState<Grant | null>(null);

  const fetchPending = useCallback(async () => {
    if (!user?.id) { setPending(null); return; }
    const { data } = await supabase
      .from(DB_TABLES.SUBSCRIPTION_GRANTS)
      .select("id, tier, expires_at, reason, created_at, acknowledged_at, granted_by, granter:profiles!granted_by (nickname, username)")
      .eq("user_id", user.id)
      .is("acknowledged_at", null)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .limit(1);
    const first = (data as any)?.[0];
    if (first && (!first.expires_at || new Date(first.expires_at) > new Date())) {
      setPending(first as Grant);
    } else {
      setPending(null);
    }
  }, [user?.id]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  // Realtime: any new grant for this user → show
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`sub-grant-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: DB_TABLES.SUBSCRIPTION_GRANTS, filter: `user_id=eq.${user.id}` },
        () => fetchPending()
      )
      .subscribe((status: string, err?: any) => {
        if (status === "CHANNEL_ERROR" || err) {
          console.warn("[SubscriptionGrantGate] channel error", err);
        }
      });
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, fetchPending]);

  const acknowledge = async () => {
    if (!pending) return;
    await supabase
      .from(DB_TABLES.SUBSCRIPTION_GRANTS)
      .update({ acknowledged_at: new Date().toISOString() })
      .eq("id", pending.id);
    setPending(null);
  };

  if (!pending) return null;

  const isElite = pending.tier === "elite";
  const granterName = pending.granter?.nickname || pending.granter?.username || "L'équipe Sakata";

  return (
    <AnimatePresence>
      <motion.div
        key={pending.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-foret-nocturne/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-md w-full"
        >
          {/* Glow halo */}
          <div className="absolute -inset-12 bg-or-ancestral/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative rounded-[2rem] p-1"
            style={{
              background: "linear-gradient(135deg, rgba(232,192,120,0.4) 0%, rgba(181,149,81,0.2) 50%, rgba(242,238,221,0.05) 100%)",
              border: "1px solid rgba(232,192,120,0.3)",
            }}
          >
            <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-8 space-y-6 text-center backdrop-blur-xl">
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
                className="relative w-24 h-24 mx-auto"
              >
                <div className="absolute inset-0 rounded-full bg-or-ancestral/20 animate-pulse" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-or-ancestral to-or-ancestral/40 border-2 border-or-ancestral/60 flex items-center justify-center shadow-[0_0_40px_rgba(181,149,81,0.4)]">
                  {isElite ? (
                    <Crown className="w-10 h-10 text-foret-nocturne" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-foret-nocturne" />
                  )}
                </div>
                {/* Sparkle particles */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 + i * 0.3 }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-or-ancestral"
                    style={{
                      top: ["20%", "20%", "70%", "70%"][i],
                      left: ["20%", "75%", "15%", "80%"][i],
                    }}
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <span className="eyebrow flex items-center justify-center gap-2" style={{ color: "var(--or-ancestral)" }}>
                  <Gift className="w-3 h-3" /> Don du sanctuaire
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ivoire-ancien">
                  Vous avez reçu un abonnement {isElite ? "Elite" : "Premium"}
                </h2>
              </motion.div>

              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="space-y-3"
              >
                <p className="text-ivoire-ancien/70 text-sm leading-relaxed">
                  <strong className="text-or-ancestral">{granterName}</strong> vous a offert un accès Premium au sanctuaire.
                  Les articles <em>poétiques</em> et <em>philosophiques</em> vous sont désormais ouverts.
                </p>

                {pending.reason && (
                  <div className="px-4 py-3 rounded-xl bg-white/[0.03] border border-or-ancestral/15 text-sm">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-or-ancestral/60 mb-1">Message du donateur</p>
                    <p className="italic text-ivoire-ancien/80">"{pending.reason}"</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="px-3 py-3 rounded-xl bg-white/[0.04] border border-or-ancestral/15">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-ivoire-ancien/40 mb-1">Durée</p>
                    <p className="font-display text-base font-bold text-or-ancestral">
                      {formatDuration(pending.expires_at, pending.created_at)}
                    </p>
                  </div>
                  <div className="px-3 py-3 rounded-xl bg-white/[0.04] border border-or-ancestral/15">
                    <p className="text-[9px] font-mono uppercase tracking-widest text-ivoire-ancien/40 mb-1">Échéance</p>
                    <p className="font-display text-base font-bold text-or-ancestral">
                      {formatExpiry(pending.expires_at)}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-3 pt-2"
              >
                <button
                  onClick={acknowledge}
                  className="flex-1 py-3 rounded-xl bg-or-ancestral text-foret-nocturne font-bold transition-all hover:brightness-110 active:scale-[0.99]"
                  style={{ boxShadow: "0 10px 30px rgba(181, 149, 81, 0.3)" }}
                >
                  J'ai compris
                </button>
                <Link
                  href="/savoir"
                  onClick={acknowledge}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-ivoire-ancien text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Découvrir
                </Link>
              </motion.div>

              <p className="text-[10px] text-ivoire-ancien/30 italic pt-2">
                Cette annonce reste consultable dans vos notifications.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
