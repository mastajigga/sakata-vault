"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { canManageContent } from "@/lib/constants/business";
import Link from "next/link";

interface NotificationResult {
  sent: number;
  message: string;
  updateType?: string;
  error?: string;
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NotificationResult | null>(null);
  const [selectedType, setSelectedType] = useState<string>("phase2");
  const [showSuccess, setShowSuccess] = useState(false);

  // Vérifier les droits admin
  useEffect(() => {
    if (!user || !canManageContent(user.role)) {
      router.push("/");
    }
  }, [user, router]);

  const sendNotification = async (updateType: string) => {
    setLoading(true);
    setShowSuccess(false);
    setResult(null);

    try {
      const response = await fetch("/api/email/notify-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateType }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setShowSuccess(true);
        // Auto-hide success message après 5s
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setResult({ sent: 0, message: "Erreur", error: data.error });
      }
    } catch (error: any) {
      setResult({
        sent: 0,
        message: "Erreur réseau",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-400">
        Chargement des droits...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F1410] to-[#050B08]">
      <div className="section-container py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/admin"
            className="text-or-ancestral hover:text-[#E9DCC9] transition mb-4 inline-block"
          >
            ← Retour à l'Admin
          </Link>
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--or-ancestral)" }}
          >
            📧 Notifications Email
          </h1>
          <p className="text-gray-400">
            Envoyer les dernières mises à jour à tous les utilisateurs inscrits
          </p>
        </div>

        {/* Main Card */}
        <div
          className="border border-[#C16B34] rounded-lg p-8 mb-8"
          style={{ background: "rgba(15, 20, 16, 0.8)" }}
        >
          <h2 className="text-2xl font-bold mb-6 text-[#E9DCC9]">
            Types de Notifications
          </h2>

          <div className="space-y-4">
            {/* Phase 2 */}
            <div className="border border-[#C16B34] rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#C16B34] mb-2">
                    🚀 Phase 2 — Optimisations & Nouvelles Fonctionnalités
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Notifier tous les utilisateurs des mises à jour Phase 2:
                    images optimisées, caching hybride, validation formulaires,
                    pagination messages, rebranding Sakata.
                  </p>

                  <div className="bg-[#050B08] rounded p-3 mb-4 text-xs text-gray-300 border border-[#C16B34]/30">
                    <p className="font-mono">
                      updateType: <span className="text-[#C16B34]">"phase2"</span>
                    </p>
                  </div>

                  <button
                    onClick={() => sendNotification("phase2")}
                    disabled={loading}
                    className="px-6 py-2 bg-[#C16B34] text-[#050B08] rounded font-semibold hover:bg-[#9B4F24] transition disabled:opacity-50"
                  >
                    {loading && selectedType === "phase2"
                      ? "Envoi en cours..."
                      : "Envoyer Phase 2"}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Updates (Template) */}
            <div className="border border-gray-600 rounded-lg p-6 opacity-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    ✨ Nouvelle Fonctionnalité (Prochainement)
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Template pour futures notifications de nouvelles
                    fonctionnalités.
                  </p>
                  <button
                    disabled
                    className="px-6 py-2 bg-gray-700 text-gray-400 rounded font-semibold cursor-not-allowed"
                  >
                    Désactivé
                  </button>
                </div>
              </div>
            </div>

            {/* Security Updates (Template) */}
            <div className="border border-gray-600 rounded-lg p-6 opacity-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    🔒 Mise à Jour Sécurité (Prochainement)
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Template pour notifications de correctifs sécurité urgents.
                  </p>
                  <button
                    disabled
                    className="px-6 py-2 bg-gray-700 text-gray-400 rounded font-semibold cursor-not-allowed"
                  >
                    Désactivé
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {showSuccess && result && !result.error && (
          <div className="border border-green-600/50 bg-green-500/10 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-green-400 mb-2">
              ✅ Succès
            </h3>
            <p className="text-green-300 mb-2">
              {result.sent} utilisateur{result.sent > 1 ? "s" : ""} notifié
              {result.sent > 1 ? "s" : ""}.
            </p>
            <p className="text-green-200 text-sm">{result.message}</p>
          </div>
        )}

        {result && result.error && (
          <div className="border border-red-600/50 bg-red-500/10 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-red-400 mb-2">❌ Erreur</h3>
            <p className="text-red-300">{result.error}</p>
            {result.sent === 0 && (
              <p className="text-red-200 text-sm mt-2">
                Aucun utilisateur notifié.
              </p>
            )}
          </div>
        )}

        {/* Info Box */}
        <div
          className="border border-[#C16B34]/30 rounded-lg p-6"
          style={{ background: "rgba(193, 107, 52, 0.05)" }}
        >
          <h3 className="text-lg font-semibold text-[#E9DCC9] mb-4">
            ℹ️ Comment ça marche
          </h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>
              ✓ Clique sur le bouton pour envoyer les emails à{" "}
              <strong>tous les utilisateurs inscrits</strong>
            </li>
            <li>
              ✓ Les emails sont stylisés avec les couleurs du site (Or Ancestral
              #C16B34)
            </li>
            <li>
              ✓ Chaque email inclut les mises à jour détaillées du type sélectionné
            </li>
            <li>
              ✓ Un message de confirmation s'affiche avec le nombre de
              destinataires
            </li>
            <li>
              ✓ Les logs d'envoi sont disponibles dans la console serveur
            </li>
          </ul>
        </div>

        {/* Dev Info */}
        <div
          className="border border-gray-700 rounded-lg p-4 mt-8"
          style={{ background: "rgba(0, 0, 0, 0.3)" }}
        >
          <p className="text-gray-500 text-xs font-mono">
            <strong>API Endpoint:</strong> POST /api/email/notify-updates
            <br />
            <strong>Authentification:</strong> Vérifié via canManageContent()
            <br />
            <strong>Destinataires:</strong> Tous les profils avec email valide
          </p>
        </div>
      </div>
    </main>
  );
}
