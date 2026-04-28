"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Loader2, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { value: "off_topic", label: "Hors sujet" },
  { value: "insult_hate", label: "Insulte ou haine" },
  { value: "spam", label: "Spam" },
  { value: "misinformation", label: "Désinformation" },
  { value: "other", label: "Autre" },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

interface ReportModalProps {
  open: boolean;
  postId: string;
  onClose: () => void;
}

export default function ReportModal({ open, postId, onClose }: ReportModalProps) {
  const [category, setCategory] = useState<Category>("off_topic");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/forum/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, category, description }),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Erreur lors du signalement");
      }
      setDone(true);
      setTimeout(() => {
        onClose();
        setDone(false);
        setDescription("");
        setCategory("off_topic");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-md rounded-3xl border border-or-ancestral/30 bg-foret-nocturne/95 backdrop-blur-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-400" />
                <h3 className="font-display text-lg font-bold text-ivoire-ancien">
                  Signaler ce message
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-ivoire-ancien/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {done ? (
              <div className="py-8 text-center text-emerald-300 flex flex-col items-center gap-3">
                <CheckCircle2 className="w-8 h-8" />
                <p>Signalement envoyé. Merci.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-ivoire-ancien/50 mb-2">
                    Motif
                  </label>
                  <div className="space-y-2">
                    {CATEGORIES.map((c) => (
                      <label
                        key={c.value}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          category === c.value
                            ? "border-or-ancestral/50 bg-or-ancestral/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={c.value}
                          checked={category === c.value}
                          onChange={() => setCategory(c.value)}
                          className="accent-or-ancestral"
                        />
                        <span className="text-sm text-ivoire-ancien/85">
                          {c.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-ivoire-ancien/50 mb-2">
                    Détails (optionnel)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Précisions pour le modérateur..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-or-ancestral/50 outline-none text-sm text-ivoire-ancien placeholder-ivoire-ancien/30 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien text-sm transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-sm font-bold inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Flag className="w-4 h-4" />
                    )}
                    Signaler
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
