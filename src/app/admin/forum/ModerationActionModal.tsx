"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { BAN_DURATIONS_HOURS } from "@/lib/constants/business";

export type ActionKind =
  | "delete_post"
  | "delete_thread"
  | "warn_user"
  | "ban_user"
  | "unban_user"
  | "soft_delete_user"
  | "restore_user"
  | "resolve_report"
  | "dismiss_report";

interface Props {
  open: boolean;
  kind: ActionKind | null;
  context: {
    postId?: string;
    threadId?: string;
    userId?: string;
    reportId?: string;
    username?: string;
    nickname?: string;
    excerpt?: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const KIND_META: Record<ActionKind, { title: string; cta: string; danger?: boolean; needsReason: boolean; needsMessage: boolean; needsDuration: boolean; needsUsernameConfirm: boolean }> = {
  delete_post: { title: "Supprimer ce post", cta: "Supprimer", danger: true, needsReason: true, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
  delete_thread: { title: "Supprimer ce sujet", cta: "Supprimer", danger: true, needsReason: true, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
  warn_user: { title: "Adresser un rappel à l'ordre", cta: "Envoyer l'avertissement", needsReason: false, needsMessage: true, needsDuration: false, needsUsernameConfirm: false },
  ban_user: { title: "Bannir temporairement", cta: "Bannir", danger: true, needsReason: true, needsMessage: false, needsDuration: true, needsUsernameConfirm: false },
  unban_user: { title: "Lever le bannissement", cta: "Débannir", needsReason: false, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
  soft_delete_user: { title: "Mettre à la corbeille", cta: "Supprimer le compte", danger: true, needsReason: true, needsMessage: false, needsDuration: false, needsUsernameConfirm: true },
  restore_user: { title: "Restaurer le compte", cta: "Restaurer", needsReason: false, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
  resolve_report: { title: "Marquer comme résolu", cta: "Résoudre", needsReason: false, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
  dismiss_report: { title: "Rejeter le signalement", cta: "Rejeter", needsReason: false, needsMessage: false, needsDuration: false, needsUsernameConfirm: false },
};

export default function ModerationActionModal({ open, kind, context, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState<24 | 48 | 72>(24);
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setReason(""); setMessage(""); setDuration(24); setConfirm(""); setError(null);
    }
  }, [open, kind]);

  if (!kind) return null;
  const meta = KIND_META[kind];

  const submit = async () => {
    setError(null);
    if (meta.needsReason && !reason.trim()) { setError("La raison est requise"); return; }
    if (meta.needsMessage && !message.trim()) { setError("Le message est requis"); return; }
    if (meta.needsUsernameConfirm && confirm.trim().toLowerCase() !== (context.username || "").toLowerCase()) {
      setError("Le username de confirmation ne correspond pas"); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: kind,
          postId: context.postId,
          threadId: context.threadId,
          userId: context.userId,
          reportId: context.reportId,
          reason: meta.needsReason ? reason : undefined,
          message: meta.needsMessage ? message : undefined,
          durationHours: meta.needsDuration ? duration : undefined,
          usernameConfirm: meta.needsUsernameConfirm ? confirm : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur");
      onSuccess?.();
      onClose();
    } catch (e: any) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foret-nocturne/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-[2rem] p-1"
            style={{ background: "linear-gradient(135deg, rgba(242,238,221,0.1), transparent)", border: "1px solid rgba(242,238,221,0.05)" }}
          >
            <div className="bg-foret-nocturne/95 rounded-[1.9rem] p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="eyebrow" style={{ color: meta.danger ? "#f87171" : "var(--or-ancestral)" }}>
                    {meta.danger ? "Action irréversible" : "Modération"}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-ivoire-ancien">{meta.title}</h2>
                </div>
                <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {(context.username || context.nickname) && (
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                  <span className="opacity-50">Cible : </span>
                  <span className="font-bold text-ivoire-ancien">{context.nickname || context.username}</span>
                  {context.username && context.nickname && <span className="opacity-40 text-xs ml-2">@{context.username}</span>}
                </div>
              )}

              {context.excerpt && (
                <blockquote className="px-4 py-3 rounded-xl bg-white/[0.02] border-l-2 border-or-ancestral/40 text-sm italic opacity-60">
                  "{context.excerpt.slice(0, 200)}{context.excerpt.length > 200 ? "..." : ""}"
                </blockquote>
              )}

              {meta.needsReason && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Raison (visible dans les journaux)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Ex. Contenu hors charte, propos haineux..."
                    className="w-full bg-white/5 border border-white/10 focus:border-or-ancestral/50 rounded-xl px-4 py-3 outline-none text-sm text-ivoire-ancien resize-none"
                  />
                </div>
              )}

              {meta.needsMessage && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Message à l'utilisateur (rappel à l'ordre)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Ex. Vos propos contreviennent à la charte. Merci de respecter les autres membres..."
                    className="w-full bg-white/5 border border-white/10 focus:border-or-ancestral/50 rounded-xl px-4 py-3 outline-none text-sm text-ivoire-ancien resize-none"
                  />
                  <p className="text-[10px] opacity-40">Affiché à l'utilisateur lors de sa prochaine visite.</p>
                </div>
              )}

              {meta.needsDuration && (
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">Durée du bannissement</label>
                  <div className="grid grid-cols-3 gap-2">
                    {BAN_DURATIONS_HOURS.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setDuration(h)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all ${
                          duration === h
                            ? "bg-or-ancestral/20 border border-or-ancestral/40 text-or-ancestral"
                            : "bg-white/5 border border-white/10 text-ivoire-ancien/60 hover:border-white/20"
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {meta.needsUsernameConfirm && (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300 leading-relaxed">
                      Le compte sera mis à la corbeille pour <strong>6 mois</strong>. Au-delà, suppression définitive et irréversible.
                      Un administrateur peut le restaurer durant cette période.
                    </p>
                  </div>
                  <label className="text-[10px] font-mono uppercase tracking-widest opacity-50">
                    Tapez <span className="text-or-ancestral">{context.username}</span> pour confirmer
                  </label>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-red-500/50 rounded-xl px-4 py-3 outline-none text-sm text-ivoire-ancien"
                    placeholder={context.username}
                  />
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-widest opacity-50 hover:opacity-100 border border-white/10"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    meta.danger
                      ? "bg-red-500/90 text-white hover:bg-red-500"
                      : "bg-or-ancestral text-foret-nocturne hover:bg-or-ancestral/90"
                  }`}
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? "Envoi..." : meta.cta}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
