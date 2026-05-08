"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Check, AlertCircle, Sparkles, Camera, Video, FileText, Mic, Archive, Scroll, MoreHorizontal } from "lucide-react";
import { CAN_SHARE_OPTIONS, type CanShareOption } from "@/lib/schemas/validation";

const CONTRIBUTOR_TYPES = [
  { value: "habitant_region", label: "Habitant de la région", icon: "🏠" },
  { value: "scolaire", label: "Scolaire / Étudiant", icon: "📚" },
  { value: "historien", label: "Historien", icon: "📜" },
  { value: "anthropologue", label: "Anthropologue", icon: "🔬" },
  { value: "photo", label: "Photo / Vidéo", icon: "📸" },
  { value: "patrimoine", label: "Patrimoine", icon: "🏛️" },
  { value: "autre", label: "Autre (précisez)", icon: "✨" },
];

const CAN_SHARE_META: Record<CanShareOption, { label: string; icon: React.ReactNode; description: string }> = {
  photos: { label: "Photos", icon: <Camera className="w-4 h-4" />, description: "Clichés, archives visuelles" },
  videos: { label: "Vidéos", icon: <Video className="w-4 h-4" />, description: "Témoignages filmés, reportages" },
  articles: { label: "Articles", icon: <FileText className="w-4 h-4" />, description: "Récits écrits, recherches" },
  temoignages: { label: "Témoignages", icon: <Mic className="w-4 h-4" />, description: "Histoires orales, anecdotes" },
  archives_familiales: { label: "Archives familiales", icon: <Archive className="w-4 h-4" />, description: "Documents, lettres, photos" },
  documents_historiques: { label: "Documents historiques", icon: <Scroll className="w-4 h-4" />, description: "Sources, manuscrits" },
  audio: { label: "Audio", icon: <Mic className="w-4 h-4" />, description: "Chants, contes, langue parlée" },
  autre: { label: "Autre", icon: <MoreHorizontal className="w-4 h-4" />, description: "À préciser dans le message" },
};

interface ContributionFormProps {
  onSuccess: () => void;
}

export function ContributionForm({ onSuccess }: ContributionFormProps) {
  const [contributorType, setContributorType] = useState("");
  const [contributorTypeOther, setContributorTypeOther] = useState("");
  const [origin, setOrigin] = useState("");
  const [motivation, setMotivation] = useState("");
  const [canShare, setCanShare] = useState<CanShareOption[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleShare = (opt: CanShareOption) => {
    setCanShare((prev) => prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt]);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!contributorType) {
        setStatus("error");
        setErrorMessage("Veuillez sélectionner un profil.");
        return;
      }
      if (contributorType === "autre" && !contributorTypeOther.trim()) {
        setStatus("error");
        setErrorMessage("Précisez votre profil.");
        return;
      }
      if (motivation.trim().length < 20) {
        setStatus("error");
        setErrorMessage("Décrivez brièvement votre motivation (au moins 20 caractères).");
        return;
      }
      if (canShare.length === 0) {
        setStatus("error");
        setErrorMessage("Sélectionnez au moins un type de contribution que vous pouvez partager.");
        return;
      }

      setLoading(true);
      setStatus("idle");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contribution-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "contributor",
            contributorType,
            contributorTypeOther: contributorType === "autre" ? contributorTypeOther.trim() : undefined,
            origin: origin.trim() || undefined,
            motivation: motivation.trim(),
            canShare,
            message: message.trim() || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Erreur lors de l'envoi");
          return;
        }

        setStatus("success");
        setTimeout(() => onSuccess(), 1500);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Erreur serveur");
      } finally {
        setLoading(false);
      }
    },
    [contributorType, contributorTypeOther, origin, motivation, canShare, message, onSuccess]
  );

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-or-ancestral/15 border border-or-ancestral/40 flex items-center justify-center mx-auto mb-4">
          <Check size={28} className="text-or-ancestral" />
        </div>
        <h3 className="font-display text-xl font-bold text-ivoire-ancien mb-2">Demande transmise aux anciens</h3>
        <p className="text-ivoire-ancien/60 text-sm max-w-md mx-auto leading-relaxed">
          L'équipe Sakata examinera votre profil avec attention et reviendra vers vous sous 48h.
          Soyez patient — la rivière coule à son rythme.
        </p>
      </motion.div>
    );
  }

  const labelClass = "block text-[10px] font-mono uppercase tracking-widest opacity-50 mb-3";
  const inputBase = "w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-ivoire-ancien placeholder-ivoire-ancien/30 focus:outline-none transition-all disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Type de contributeur */}
      <div>
        <label className={labelClass}>Vous êtes…</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONTRIBUTOR_TYPES.map((type) => {
            const selected = contributorType === type.value;
            return (
              <motion.button
                key={type.value}
                type="button"
                onClick={() => setContributorType(type.value)}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 py-3 rounded-xl border text-sm text-left transition-all ${
                  selected
                    ? "border-or-ancestral/50 bg-or-ancestral/10 text-ivoire-ancien"
                    : "border-white/10 hover:border-or-ancestral/30 text-ivoire-ancien/60 hover:text-ivoire-ancien"
                } disabled:opacity-50`}
              >
                <span className="text-base">{type.icon}</span>
                <span className="flex-1 leading-tight text-xs">{type.label}</span>
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
          {contributorType === "autre" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
              <input
                type="text"
                value={contributorTypeOther}
                onChange={(e) => setContributorTypeOther(e.target.value)}
                placeholder="Décrivez votre profil en quelques mots…"
                disabled={loading}
                maxLength={200}
                className={`${inputBase} border-white/10 focus:border-or-ancestral/50`}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Origine */}
      <div>
        <label className={labelClass}>D'où venez-vous ? <span className="opacity-60 normal-case tracking-normal">— pour information</span></label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Ex. Inongo, diaspora à Bruxelles, racines familiales à Mushie…"
          disabled={loading}
          maxLength={300}
          className={`${inputBase} border-white/10 focus:border-or-ancestral/50`}
        />
      </div>

      {/* 3. Motivation */}
      <div>
        <label className={labelClass}>
          Pourquoi souhaitez-vous contribuer ? <span className="text-or-ancestral/70 normal-case tracking-normal">*</span>
        </label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Quelques phrases sur votre attache au peuple Sakata, ce qui vous anime, ce que vous espérez transmettre…"
          disabled={loading}
          maxLength={2000}
          rows={4}
          className={`${inputBase} border-white/10 focus:border-or-ancestral/50 resize-none`}
        />
        <p className="text-[10px] text-ivoire-ancien/30 mt-1.5 ml-1 font-mono">
          {motivation.length}/2000 · minimum 20 caractères
        </p>
      </div>

      {/* 4. Can share — multi-select chips */}
      <div>
        <label className={labelClass}>
          Que pouvez-vous partager ? <span className="text-or-ancestral/70 normal-case tracking-normal">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CAN_SHARE_OPTIONS.map((opt, i) => {
            const meta = CAN_SHARE_META[opt];
            const selected = canShare.includes(opt);
            return (
              <motion.button
                key={opt}
                type="button"
                onClick={() => toggleShare(opt)}
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`relative flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  selected
                    ? "border-or-ancestral/50 bg-or-ancestral/10"
                    : "border-white/10 bg-white/[0.02] hover:border-or-ancestral/30"
                } disabled:opacity-50`}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                  selected ? "border-or-ancestral/40 bg-or-ancestral/15 text-or-ancestral" : "border-white/10 bg-white/5 text-ivoire-ancien/60"
                }`}>
                  {meta.icon}
                </span>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className={`text-xs font-bold ${selected ? "text-ivoire-ancien" : "text-ivoire-ancien/80"}`}>
                    {meta.label}
                  </p>
                  <p className="text-[10px] text-ivoire-ancien/40 leading-snug">{meta.description}</p>
                </div>
                <AnimatePresence>
                  {selected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-or-ancestral text-foret-nocturne flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
        <p className="text-[10px] text-ivoire-ancien/30 mt-2 ml-1 font-mono">
          {canShare.length} sélectionné{canShare.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* 5. Message libre */}
      <div>
        <label className={labelClass}>Message libre <span className="opacity-60 normal-case tracking-normal">(optionnel)</span></label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tout autre élément utile : projets en cours, références, contacts…"
          disabled={loading}
          maxLength={5000}
          rows={3}
          className={`${inputBase} border-white/10 focus:border-or-ancestral/50 resize-none`}
        />
      </div>

      {/* Erreur */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 rounded-xl bg-red-500/10 border border-red-500/30 p-4"
          >
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading || !contributorType || motivation.trim().length < 20 || canShare.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-or-ancestral text-foret-nocturne font-bold transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ boxShadow: "0 10px 30px rgba(181, 149, 81, 0.2)" }}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours…
          </>
        ) : (
          <>
            <Send size={18} />
            Transmettre ma demande aux anciens
          </>
        )}
      </button>
    </form>
  );
}
