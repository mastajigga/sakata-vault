"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, Sparkles, BookOpen, GraduationCap, Brain, Info } from "lucide-react";
import { useState, useCallback } from "react";
import ExerciceWidget from "../../../components/ExerciceWidget";
import { useAuth } from "@/components/AuthProvider";
import { getLecon, getNiveau } from "../../../data/lecons";

export default function LeconPage() {
  const params = useParams();
  const niveauSlug = (params.niveau as string) || "";
  const leconSlug = (params.lecon as string) || "";
  const { user } = useAuth() as any;
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [showCulture, setShowCulture] = useState(false);

  const niveau = getNiveau(niveauSlug);
  const lecon = getLecon(niveauSlug, leconSlug);

  const handleExerciseComplete = useCallback(
    async (score: number) => {
      setLessonCompleted(true);
      if (!user) return;

      try {
        await fetch("/api/langue/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed_lesson: `${niveauSlug}/${leconSlug}`,
            current_niveau: niveauSlug,
            score_increment: score,
            streak_update: 1,
          }),
        });
      } catch (err) {
        console.error("Erreur sauvegarde progression:", err);
      }
    },
    [user, niveauSlug, leconSlug]
  );

  if (!niveau || !lecon) {
    return (
      <div className="min-h-screen bg-[var(--foret-nocturne)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[rgba(196,160,53,0.3)] mx-auto mb-6" />
          <h1 className="text-2xl font-display text-[var(--ivoire-ancien)] mb-4">
            Leçon introuvable
          </h1>
          <p className="text-[rgba(212,221,215,0.6)] mb-8">
            Cette leçon n&apos;existe pas encore. Revenez bientôt !
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
        <div className="absolute top-10 left-[10%] w-72 h-72 rounded-full bg-[rgba(196,160,53,0.04)] blur-3xl" />

        <div className="relative section-container">
          {/* Breadcrumb */}
          <Link
            href="/langue"
            className="inline-flex items-center gap-2 text-sm text-[rgba(212,221,215,0.5)] hover:text-[var(--or-ancestral)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la rivière
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-xs font-bold uppercase tracking-widest mb-4">
              {niveau.nom}
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--ivoire-ancien)]">
              {lecon.titre}
            </h1>
            <p className="mt-4 text-[rgba(212,221,215,0.7)] max-w-2xl">
              {lecon.description}
            </p>

            {/* Note culturelle — accordéon */}
            {lecon.noteCulturelle && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCulture(!showCulture)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(196,160,53,0.06)] border border-[rgba(196,160,53,0.12)] text-[var(--or-ancestral)] text-sm hover:bg-[rgba(196,160,53,0.12)] transition-all"
                >
                  <Info className="w-4 h-4" />
                  Note culturelle
                  <span className={`transition-transform ${showCulture ? "rotate-180" : ""}`}>▾</span>
                </button>
                {showCulture && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 rounded-xl bg-[rgba(196,160,53,0.05)] border border-[rgba(196,160,53,0.1)] text-sm text-[rgba(240,237,229,0.78)] leading-relaxed"
                  >
                    {lecon.noteCulturelle}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mots */}
      <section className="pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lecon.mots.map((mot, idx) => (
              <motion.div
                key={mot.kisakata}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group relative rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.6)] backdrop-blur-sm p-6 hover:border-[rgba(196,160,53,0.3)] transition-all duration-500 overflow-hidden"
              >
                {/* Glow au hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_50%,rgba(196,160,53,0.06),transparent_70%)]" />

                <div className="relative z-10">
                  {/* Mot Kisakata */}
                  <h3 className="text-2xl font-display font-bold text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors">
                    {mot.kisakata}
                  </h3>

                  {/* Phonétique */}
                  <p className="mt-1 text-sm text-[rgba(196,160,53,0.6)] font-mono">
                    {mot.phonetique}
                  </p>

                  {/* Traduction — apparaît au hover */}
                  <div className="mt-4 pt-4 border-t border-[rgba(212,221,215,0.06)]">
                    <p className="text-sm text-[rgba(212,221,215,0.8)]">
                      {mot.francais}
                    </p>
                  </div>

                  {/* Bouton audio (placeholder) */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(196,160,53,0.4)] group-hover:text-[var(--or-ancestral)] transition-colors">
                    <Volume2 className="w-3 h-3" />
                    <span>Écouter</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exercices */}
      <section className="pb-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[rgba(196,160,53,0.1)] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[var(--or-ancestral)]" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-[var(--ivoire-ancien)]">
                  Exercices
                </h2>
                <p className="text-sm text-[rgba(212,221,215,0.5)]">
                  Testez vos connaissances et gagnez des points
                </p>
              </div>
            </div>
          </motion.div>

          {lessonCompleted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[1.5rem] border border-[rgba(196,160,53,0.15)] bg-[rgba(196,160,53,0.05)] backdrop-blur-sm p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[rgba(196,160,53,0.15)] border border-[var(--or-ancestral)]/30 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-[var(--or-ancestral)]" />
              </div>
              <h3 className="text-xl font-display text-[var(--ivoire-ancien)] mb-2">
                Leçon terminée !
              </h3>
              <p className="text-[rgba(212,221,215,0.6)] mb-6">
                Votre progression a été sauvegardée. Continuez votre voyage sur la rivière.
              </p>
              <Link
                href="/langue#niveaux"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 text-[var(--or-ancestral)] text-sm font-semibold hover:bg-[var(--or-ancestral)]/20 transition-all"
              >
                Niveau suivant
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            <ExerciceWidget
              leconSlug={leconSlug}
              onComplete={handleExerciseComplete}
            />
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 text-center border-t border-[rgba(212,221,215,0.04)]">
        <div className="section-container">
          <Sparkles className="w-8 h-8 text-[rgba(196,160,53,0.3)] mx-auto mb-4" />
          <p className="text-[rgba(212,221,215,0.4)] text-sm">
            La langue s&apos;apprend en parlant. N&apos;ayez pas peur de vous tromper —
            chaque erreur est une goutte de plus dans la rivière.
          </p>
        </div>
      </section>
    </main>
  );
}
