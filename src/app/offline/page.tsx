"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, Home, BookOpen } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[var(--foret-nocturne)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Icône */}
        <div className="w-20 h-20 rounded-full bg-[rgba(196,160,53,0.1)] border border-[rgba(196,160,53,0.2)] flex items-center justify-center mx-auto mb-8">
          <WifiOff className="w-10 h-10 text-[var(--or-ancestral)]" />
        </div>

        <h1 className="text-3xl font-display font-bold text-[var(--ivoire-ancien)] mb-4">
          La brume est épaisse...
        </h1>
        <p className="text-[rgba(212,221,215,0.7)] mb-2">
          Vous êtes hors ligne. La connexion à la rivière est momentanément coupée.
        </p>
        <p className="text-[rgba(212,221,215,0.5)] text-sm mb-8">
          Certaines pages déjà visitées restent accessibles. Réessayez quand le
          réseau reviendra.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--or-ancestral)]/15 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] hover:bg-[var(--or-ancestral)]/25 transition-all text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[rgba(212,221,215,0.1)] text-[rgba(212,221,215,0.8)] hover:border-[rgba(212,221,215,0.2)] transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>

        <p className="mt-12 text-xs text-[rgba(212,221,215,0.25)] italic">
          « Mái ma mbúla maké kosíla » — L&apos;eau de pluie ne finit jamais.
          <br />
          La connaissance, comme la rivière, attend votre retour.
        </p>
      </motion.div>
    </main>
  );
}
