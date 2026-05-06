"use client";

import { useState, useCallback } from "react";
import { Send, Loader2, Check, AlertCircle, ChevronDown } from "lucide-react";

const CONTRIBUTOR_TYPES = [
  { value: "habitant_region", label: "Habitant de la région", icon: "🏠" },
  { value: "scolaire", label: "Scolaire / Étudiant", icon: "📚" },
  { value: "historien", label: "Historien", icon: "📜" },
  { value: "anthropologue", label: "Anthropologue", icon: "🔬" },
  { value: "photo", label: "Photo / Vidéo", icon: "📸" },
  { value: "patrimoine", label: "Patrimoine", icon: "🏛️" },
  { value: "autre", label: "Autre (précisez)", icon: "✨" },
];

interface ContributionFormProps {
  onSuccess: () => void;
}

export function ContributionForm({ onSuccess }: ContributionFormProps) {
  const [contributorType, setContributorType] = useState("");
  const [contributorTypeOther, setContributorTypeOther] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!contributorType) {
        setStatus("error");
        setErrorMessage("Veuillez sélectionner un type de contributeur.");
        return;
      }
      if (contributorType === "autre" && !contributorTypeOther.trim()) {
        setStatus("error");
        setErrorMessage("Veuillez préciser votre profil.");
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
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Erreur serveur");
      } finally {
        setLoading(false);
      }
    },
    [contributorType, contributorTypeOther, message, onSuccess]
  );

  if (status === "success") {
    return (
      <div className="py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mx-auto mb-4">
          <Check size={24} className="text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Demande envoyée !</h3>
        <p className="text-gray-400 text-sm">
          L'équipe Sakata examinera votre profil et vous contactera sous 48h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Type de contributeur */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-3">
          Vous êtes ...
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CONTRIBUTOR_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setContributorType(type.value)}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-3 rounded-lg border text-sm text-left transition-all ${
                contributorType === type.value
                  ? "border-[var(--or-ancestral)] bg-[var(--or-ancestral)]/10 text-white"
                  : "border-white/10 hover:border-white/30 text-gray-400 hover:text-white"
              } disabled:opacity-50`}
            >
              <span className="text-base">{type.icon}</span>
              <span className="flex-1">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Champ "autre" */}
        {contributorType === "autre" && (
          <div className="mt-3">
            <input
              type="text"
              value={contributorTypeOther}
              onChange={(e) => setContributorTypeOther(e.target.value)}
              placeholder="Décrivez votre profil en quelques mots..."
              disabled={loading}
              maxLength={200}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[var(--or-ancestral)] focus:outline-none disabled:opacity-50 text-sm"
            />
          </div>
        )}
      </div>

      {/* Message optionnel */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Message (optionnel)
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Parlez-nous de vous, vos motivations, vos centres d'intérêt..."
          disabled={loading}
          maxLength={5000}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[var(--or-ancestral)] focus:outline-none disabled:opacity-50 text-sm resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">{message.length}/5000</p>
      </div>

      {/* Erreur */}
      {status === "error" && (
        <div className="flex gap-3 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
          <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !contributorType}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--or-ancestral)] hover:opacity-90 text-white rounded-lg transition-opacity disabled:opacity-50 font-medium"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} />
            Envoyer ma demande
          </>
        )}
      </button>
    </form>
  );
}
