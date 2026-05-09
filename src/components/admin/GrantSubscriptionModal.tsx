"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Crown, Clock, AlertTriangle } from "lucide-react";
import { SUBSCRIPTION_GRANT_DURATIONS } from "@/lib/constants/business";

interface Props {
  open: boolean;
  target: { id: string; nickname?: string | null; username?: string | null } | null;
  onClose: () => void;
  onSuccess?: () => void;
  /** If true, the modal acts as "revoke" instead of grant (target already has an active grant) */
  mode?: "grant" | "revoke";
}

export default function GrantSubscriptionModal({ open, target, onClose, onSuccess, mode = "grant" }: Props) {
  const [tier, setTier] = useState<"premium" | "elite">("premium");
  const [durationDays, setDurationDays] = useState<number | null>(30);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) { setTier("premium"); setDurationDays(30); setReason(""); setError(null); }
  }, [open]);

  const submit = async () => {
    if (!target) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/subscriptions/grant", {
        method: mode === "grant" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "grant"
            ? { userId: target.id, tier, durationDays, reason: reason.trim() || undefined }
            : { userId: target.id }
        ),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Erreur");
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && target && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foret-nocturne/85 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[2rem] p-1"
            style={{
              background: mode === "grant"
                ? "linear-gradient(135deg, rgba(181,149,81,0.2), rgba(232,192,120,0.05))"
                : "linear-gradient(135deg, rgba(248,113,113,0.18), transparent)",
              border: "1px solid rgba(242,238,221,0.05)",
            }}
          >
            <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-7 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="eyebrow" style={{ color: mode === "grant" ? "var(--or-ancestral)" : "#f87171" }}>
                    {mode === "grant" ? "Don d'abonnement" : "Révocation"}
                  </span>
                  <h2 className="font-display text-xl font-bold text-ivoire-ancien">
                    {mode === "grant" ? "Offrir un abonnement" : "Retirer l'abonnement"}
                  </h2>
                  <p className="text-xs text-ivoire-ancien/50">
                    Pour <span className="font-bold text-ivoire-ancien">{target.nickname || target.username}</span>
                  </p>
                </div>
                <button onClick={onClose} className="p-1 rounded-md text-ivoire-ancien/50 hover:text-ivoire-ancien hover:bg-white/5">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {mode === "grant" && (
                <>
                  {/* Tier selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Niveau</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { v: "premium", label: "Premium", icon: Sparkles, desc: "Articles poétique & philosophique" },
                        { v: "elite", label: "Elite", icon: Crown, desc: "Tout + futurs privilèges" },
                      ] as const).map((t) => {
                        const selected = tier === t.v;
                        const Icon = t.icon;
                        return (
                          <button
                            key={t.v}
                            type="button"
                            onClick={() => setTier(t.v)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              selected
                                ? "border-or-ancestral/50 bg-or-ancestral/10"
                                : "border-white/10 bg-white/[0.02] hover:border-or-ancestral/30"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-3.5 h-3.5 ${selected ? "text-or-ancestral" : "text-ivoire-ancien/60"}`} />
                              <span className={`text-xs font-bold ${selected ? "text-or-ancestral" : "text-ivoire-ancien"}`}>
                                {t.label}
                              </span>
                            </div>
                            <p className="text-[10px] text-ivoire-ancien/40 leading-snug">{t.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Durée</label>
                    <div className="grid grid-cols-3 gap-2">
                      {SUBSCRIPTION_GRANT_DURATIONS.map((d) => {
                        const selected = durationDays === d.value;
                        return (
                          <button
                            key={String(d.value)}
                            type="button"
                            onClick={() => setDurationDays(d.value)}
                            className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                              selected
                                ? "bg-or-ancestral/15 border-or-ancestral/40 text-or-ancestral"
                                : "bg-white/5 border-white/10 text-ivoire-ancien/60 hover:border-white/20"
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                    {durationDays === null && (
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-or-ancestral/10 border border-or-ancestral/20 text-[10px] text-or-ancestral/90">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <p>Abonnement <strong>illimité</strong> — révocable manuellement à tout moment.</p>
                      </div>
                    )}
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Raison <span className="opacity-60 normal-case tracking-normal">(optionnel — visible par l'utilisateur)</span></label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Ex. Contributeur émérite, ambassadeur du sanctuaire…"
                      className="w-full bg-white/5 border border-white/10 focus:border-or-ancestral/50 rounded-xl px-4 py-3 outline-none text-sm text-ivoire-ancien resize-none"
                    />
                  </div>
                </>
              )}

              {mode === "revoke" && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 flex gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>L'utilisateur perdra immédiatement l'accès aux articles premium. Cette action est consignée.</p>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  disabled={submitting}
                  className="px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 border border-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={submit}
                  disabled={submitting}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    mode === "grant"
                      ? "bg-or-ancestral text-foret-nocturne hover:brightness-110"
                      : "bg-red-500/90 text-white hover:bg-red-500"
                  } disabled:opacity-60`}
                  style={mode === "grant" ? { boxShadow: "0 8px 24px rgba(181, 149, 81, 0.2)" } : undefined}
                >
                  {submitting ? "Envoi…" : mode === "grant" ? "Offrir l'abonnement" : "Révoquer"}
                </button>
              </div>

              {mode === "grant" && (
                <div className="text-center">
                  <p className="text-[10px] text-ivoire-ancien/30 italic">
                    L'utilisateur recevra une notification et une modale d'annonce à sa prochaine connexion.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
