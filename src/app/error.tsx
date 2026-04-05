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
    console.error("🔥 [CRITICAL RENDER ERROR] Kisakata App Crashed:", error);
    if (error.digest) {
      console.error("Digest ID:", error.digest);
    }
  }, [error]);

  return (
    <main className="min-h-[100dvh] bg-[#0A1F15] flex items-center justify-center p-6 text-[#F2EEDD]">
      <div className="max-w-xl text-center space-y-8 bg-[#122A1E]/50 border border-[#B59551]/20 p-12 rounded-3xl backdrop-blur-md">
        <div className="w-20 h-20 mx-auto bg-[#B59551]/10 rounded-full flex items-center justify-center border border-[#B59551]/30">
          <AlertTriangle className="text-[#B59551] w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-3xl font-display text-[#B59551] mb-4">Une perturbation est survenue</h1>
          <p className="text-[#F2EEDD]/70 font-light text-lg">
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
            className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#B59551]/10 border border-[#B59551]/50 text-[#B59551] hover:bg-[#B59551] hover:text-[#0A1F15] transition-all font-medium"
          >
            <RefreshCw size={18} />
            Tenter de rétablir
          </button>
          <Link 
             href="/"
             className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[#F2EEDD]/80"
          >
            Retour au sanctuaire
          </Link>
        </div>
      </div>
    </main>
  );
}
