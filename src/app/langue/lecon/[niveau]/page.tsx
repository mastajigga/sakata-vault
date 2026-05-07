"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, BookOpen, Waves } from "lucide-react";
import { getNiveau } from "../../data/lecons";

export default function NiveauPage() {
  const params = useParams();
  const niveauSlug = (params.niveau as string) || "";
  const niveau = getNiveau(niveauSlug);

  if (!niveau) {
    return (
      <div className="min-h-screen bg-[var(--foret-nocturne)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[rgba(196,160,53,0.3)] mx-auto mb-6" />
          <h1 className="text-2xl font-display text-[var(--ivoire-ancien)] mb-4">
            Niveau introuvable
          </h1>
          <p className="text-[rgba(212,221,215,0.6)] mb-8">
            Ce niveau n&apos;existe pas encore. Revenez bientôt !
          </p>
          <Link
            href="/langue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(196,160,53,0.3)] text-[var(--or-ancestral)] hover:bg-[rgba(196,160,53,0.1)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la rivière
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--foret-nocturne)] font-sans">
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,160,53,0.08),transparent_60%)]" />
        <div className="absolute top-10 right-[10%] w-72 h-72 rounded-full bg-[rgba(196,160,53,0.04)] blur-3xl" />

        <div className="relative section-container">
          <Link
            href="/langue#niveaux"
            className="inline-flex items-center gap-2 text-sm text-[rgba(212,221,215,0.5)] hover:text-[var(--or-ancestral)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux niveaux
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{
                backgroundColor: `${niveau.couleur}20`,
                borderColor: `${niveau.couleur}40`,
                color: niveau.couleur,
              }}
            >
              <Waves className="w-3 h-3" />
              {niveau.nom}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--ivoire-ancien)]">
              {niveau.nom}
            </h1>
            <p className="mt-4 text-[rgba(212,221,215,0.7)] max-w-2xl">
              {niveau.description}
            </p>
            <p className="mt-2 text-sm text-[rgba(196,160,53,0.6)]">
              {niveau.lecons.length} leçons disponibles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Leçons du niveau */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {niveau.lecons.map((lecon, idx) => (
              <motion.div
                key={lecon.slug}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <Link
                  href={`/langue/lecon/${niveauSlug}/${lecon.slug}`}
                  className="block h-full rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-5 hover:border-[rgba(196,160,53,0.3)] hover:bg-[rgba(10,31,21,0.7)] transition-all duration-500 overflow-hidden relative"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(196,160,53,0.08),transparent_70%)]" />

                  <div className="relative z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-xl group-hover:scale-110 transition-all duration-300"
                      style={{ backgroundColor: `${niveau.couleur}15` }}
                    >
                      <span className="text-lg">{idx + 1}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[rgba(196,160,53,0.45)] group-hover:text-[var(--or-ancestral)]/70 transition-colors">
                      Leçon {idx + 1}
                    </span>
                    <h3 className="mt-1 text-base font-display text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors">
                      {lecon.titre}
                    </h3>
                    <p className="mt-2 text-xs text-[rgba(212,221,215,0.6)] leading-relaxed line-clamp-2">
                      {lecon.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(196,160,53,0.5)] group-hover:text-[var(--or-ancestral)] transition-colors">
                      <span>Commencer</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 text-center border-t border-[rgba(212,221,215,0.04)]">
        <div className="section-container">
          <Sparkles className="w-8 h-8 text-[rgba(196,160,53,0.3)] mx-auto mb-4" />
          <Link
            href="/langue#niveaux"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] text-sm font-semibold hover:bg-[var(--or-ancestral)]/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les niveaux
          </Link>
        </div>
      </section>
    </main>
  );
}
