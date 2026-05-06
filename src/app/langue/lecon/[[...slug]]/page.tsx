"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Volume2, Sparkles, BookOpen } from "lucide-react";

const NIVEAUX_STRUCTURE: Record<string, { nom: string; leçons: Record<string, { titre: string; mots: { kisakata: string; francais: string; phonetique: string }[] }> }> = {
  "goutte-rosee": {
    nom: "Goutte de Rosée",
    leçons: {
      salutations: {
        titre: "Salutations",
        mots: [
          { kisakata: "Mbóte", francais: "Bonjour", phonetique: "m-BOH-teh" },
          { kisakata: "Tókó", francais: "Ça va / D'accord", phonetique: "TOH-koh" },
          { kisakata: "Lóbí", francais: "À demain / Salut", phonetique: "LOH-bee" },
          { kisakata: "Bótámbólá", francais: "Bienvenue", phonetique: "boh-tam-BOH-lah" },
        ],
      },
      famille: {
        titre: "La Famille",
        mots: [
          { kisakata: "Tatá", francais: "Papa", phonetique: "tah-TAH" },
          { kisakata: "Mamá", francais: "Maman", phonetique: "mah-MAH" },
          { kisakata: "Nkókó", francais: "Grand-père / Ancêtre", phonetique: "n-KOH-koh" },
          { kisakata: "Kókó", francais: "Grand-mère", phonetique: "KOH-koh" },
        ],
      },
    },
  },
};

export default function LeconPage() {
  const params = useParams();
  const niveauSlug = params.niveau as string;
  const leconSlug = params.lecon as string;

  const niveau = NIVEAUX_STRUCTURE[niveauSlug];
  const lecon = niveau?.leçons[leconSlug];

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
              Apprenez ces mots en les écoutant, en les répétant, en les vivant.
              Cliquez sur chaque carte pour voir la traduction.
            </p>
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
