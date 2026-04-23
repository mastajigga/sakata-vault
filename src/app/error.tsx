"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log profoundly to the console for tracking
    console.error("🔥 [CRITICAL RENDER ERROR] Sakata App Crashed:", error);
    if (error.digest) {
      console.error("Digest ID:", error.digest);
    }
  }, [error]);

  return (
    <main className="min-h-[100dvh] bg-[var(--foret-nocturne)] flex items-center justify-center p-6 text-[var(--ivoire-ancien)]">
      <div className="max-w-xl text-center space-y-8 bg-[var(--foret-nocturne)]/50 border border-[var(--or-ancestral)]/20 p-12 rounded-3xl backdrop-blur-md">
        <div className="w-20 h-20 mx-auto bg-[var(--or-ancestral)]/10 rounded-full flex items-center justify-center border border-[var(--or-ancestral)]/30">
          <AlertTriangle className="text-[var(--or-ancestral)] w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-3xl font-display text-[var(--or-ancestral)] mb-4">Une perturbation est survenue</h1>
          <p className="text-[var(--ivoire-ancien)]/70 font-light text-lg">
            Les esprits sont troublés et notre connexion au sanctuaire semble instable. Notre équipe technique en a été notifiée.
          </p>
        </div>

        <div className="bg-black/20 p-4 rounded-xl text-left border border-white/5 overflow-auto max-h-32">
          <p className="text-xs font-mono text-red-400/80">
            {error.message || "Erreur inconnue lors du rendu de la page."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={() => reset()} 
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/50 text-[var(--or-ancestral)] hover:bg-[var(--or-ancestral)] hover:text-[var(--foret-nocturne)] transition-all font-medium"
          >
            <RefreshCw size={18} />
            Tenter de rétablir
          </button>
          <Link 
             href="/"
             className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[var(--ivoire-ancien)]/80"
          >
            Retour au sanctuaire
          </Link>
        </div>
      </div>
    </main>
  );
}
