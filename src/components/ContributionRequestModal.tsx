"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, AlertCircle } from "lucide-react";

interface ContributionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestType?: "article_writer" | "contributor";
}

export function ContributionRequestModal({
  isOpen,
  onClose,
  requestType = "article_writer",
}: ContributionRequestModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setStatus("idle");
      setErrorMessage("");

      try {
        const response = await fetch("/api/contribution-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType,
            message: message.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setErrorMessage(data.error || "Erreur lors de l'envoi");
          return;
        }

        setStatus("success");
        setMessage("");
        setTimeout(() => {
          onClose();
          setStatus("idle");
        }, 2000);
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Erreur serveur"
        );
      } finally {
        setLoading(false);
      }
    },
    [requestType, message, onClose]
  );

  const handleClose = useCallback(() => {
    if (!loading) {
      setMessage("");
      setStatus("idle");
      setErrorMessage("");
      onClose();
    }
  }, [loading, onClose]);

  const titleMap = {
    article_writer:
      "Devenir Documentaliste Culturel",
    contributor: "Contribuer à Sakata",
  };

  const descriptionMap = {
    article_writer:
      "Partagez vos savoirs et renforcez le patrimoine Sakata. Les documentalistes culturels rédigent des articles authentiques et vérifiés.",
    contributor:
      "Aidez-nous à préserver et transmettre la culture Sakata. Les contributeurs enrichissent notre base de données et la communauté.",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md rounded-lg border border-amber-600/30 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {titleMap[requestType]}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {descriptionMap[requestType]}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-slate-400 hover:text-white transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            {status === "idle" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Parlez-nous de vous, vos intérêts, vos expériences..."
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:border-amber-600 focus:outline-none disabled:opacity-50 resize-none h-24"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-slate-600 px-4 py-2 text-slate-300 hover:border-slate-500 transition disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Envoyer
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Demande envoyée !
                </h3>
                <p className="text-slate-400 text-sm">
                  L'équipe Sakata examinera votre profil et vous contactera
                  sous peu.
                </p>
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="py-6 space-y-4">
                <div className="flex gap-3 rounded-lg bg-red-500/10 border border-red-500/30 p-4">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm">{errorMessage}</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full rounded-lg bg-amber-600 px-4 py-2 font-medium text-white hover:bg-amber-700 transition"
                >
                  Fermer
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
