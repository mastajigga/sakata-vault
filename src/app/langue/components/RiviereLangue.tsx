"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Circle, Lock } from "lucide-react";

interface Etape {
  id: string;
  titre: string;
  slug: string;
  description: string;
  icone: string;
  debloquee: boolean;
  completee: boolean;
}

interface NiveauRiviere {
  nom: string;
  slug: string;
  couleur: string;
  etapes: Etape[];
}

const NIVEAUX_RIVIERE: NiveauRiviere[] = [
  {
    nom: "Goutte de Rosée",
    slug: "goutte-rosee",
    couleur: "#C4A035",
    etapes: [
      { id: "salutations", titre: "Salutations", slug: "salutations", description: "Mbote, Tókó, Lóbí — les premiers mots", icone: "👋", debloquee: true, completee: false },
      { id: "famille", titre: "La Famille", slug: "famille", description: "Tatá, Mamá, Nkókó — les liens sacrés", icone: "👨‍👩‍👧", debloquee: true, completee: false },
      { id: "presentation", titre: "Se présenter", slug: "se-presenter", description: "Nkómbó na ngáí... — Je m'appelle...", icone: "🗣️", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Ruisseau",
    slug: "ruisseau",
    couleur: "#B59551",
    etapes: [
      { id: "nourriture", titre: "La Nourriture", slug: "nourriture", description: "Mákémbá, Nsósó, Mbísi — aliments", icone: "🍲", debloquee: true, completee: false },
      { id: "couleurs", titre: "Les Couleurs", slug: "couleurs", description: "Ntáne, Mbwé, Ngóla — la palette", icone: "🎨", debloquee: true, completee: false },
      { id: "nombres", titre: "Compter en Kisakata", slug: "nombres", description: "Mókó, Íbalé, Ísátó... — les nombres", icone: "🔢", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Rivière",
    slug: "riviere",
    couleur: "#E9C46A",
    etapes: [
      { id: "actions", titre: "Actions & Verbes", slug: "actions", description: "Kotámbola, Kolía, Kolála — au quotidien", icone: "🏃", debloquee: true, completee: false },
      { id: "temps", titre: "Le Temps", slug: "temps", description: "Lóbí, Lélo, Mái — hier, aujourd'hui, demain", icone: "⏳", debloquee: true, completee: false },
      { id: "lieux", titre: "Lieux & Nature", slug: "lieux", description: "Zámba, Ebale, Mbóka — forêt, rivière, village", icone: "🌿", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Lukenie",
    slug: "lukenie",
    couleur: "#E8C670",
    etapes: [
      { id: "proverbes", titre: "Proverbes", slug: "proverbes", description: "La sagesse des anciens en une phrase", icone: "📜", debloquee: true, completee: false },
      { id: "recits", titre: "Récits", slug: "recits", description: "Raconter une histoire en Kisakata", icone: "📖", debloquee: true, completee: false },
      { id: "chant", titre: "Chants & Poésie", slug: "chant", description: "Le rythme et la musicalité de la langue", icone: "🎵", debloquee: true, completee: false },
    ],
  },
];

/** Mini canvas pour la rivière sinueuse */
function RiviereSvg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4A035" stopOpacity="0.3" />
          <stop offset="33%" stopColor="#B59551" stopOpacity="0.4" />
          <stop offset="66%" stopColor="#E9C46A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8C670" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M0,300 C200,100 300,500 500,300 C700,100 800,500 1000,300 C1100,200 1150,250 1200,280" fill="none" stroke="url(#riverGrad)" strokeWidth="40" strokeLinecap="round" opacity="0.5" />
      <path d="M0,300 C200,100 300,500 500,300 C700,100 800,500 1000,300 C1100,200 1150,250 1200,280" fill="none" stroke="#C4A035" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="8 16" />
    </svg>
  );
}

export default function RiviereLangue() {
  const [niveauActif, setNiveauActif] = useState(0);

  return (
    <section id="methode" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,31,21,0.8),transparent_70%)]" />
      <RiviereSvg />

      <div className="relative section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-xs font-bold uppercase tracking-widest mb-4">Méthode</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--ivoire-ancien)]">La Rivière du Savoir</h2>
          <p className="mt-4 text-[rgba(212,221,215,0.72)] max-w-2xl mx-auto">Chaque niveau est une étape sur la rivière. 12 leçons vous attendent, de la Goutte de Rosée au fleuve Lukenie.</p>
        </motion.div>

        {/* Tabs des niveaux */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {NIVEAUX_RIVIERE.map((niveau, idx) => (
            <button key={niveau.slug} onClick={() => setNiveauActif(idx)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${niveauActif === idx ? "bg-[rgba(196,160,53,0.2)] border border-[rgba(196,160,53,0.4)] text-[var(--or-ancestral)]" : "border border-[rgba(212,221,215,0.08)] text-[rgba(212,221,215,0.6)] hover:border-[rgba(212,221,215,0.2)]"}`}>
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: niveau.couleur }} />
              {niveau.nom}
            </button>
          ))}
        </div>

        {/* Étapes du niveau */}
        <motion.div key={niveauActif} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {NIVEAUX_RIVIERE[niveauActif].etapes.map((etape, idx) => (
            <motion.div key={etape.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="group">
              <Link href={`/langue/lecon/${NIVEAUX_RIVIERE[niveauActif].slug}/${etape.slug}`}
                className="block h-full rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-6 hover:border-[rgba(196,160,53,0.3)] transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-[rgba(196,160,53,0.08)] flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">{etape.icone}</div>
                <h3 className="text-lg font-display text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors">{etape.titre}</h3>
                <p className="mt-2 text-sm text-[rgba(212,221,215,0.64)] leading-relaxed">{etape.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(196,160,53,0.5)] group-hover:text-[var(--or-ancestral)] transition-colors">
                  <span>Commencer la leçon</span><ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicateur de progression */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 max-w-xl mx-auto">
          <div className="h-1.5 rounded-full bg-[rgba(212,221,215,0.06)] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${NIVEAUX_RIVIERE[niveauActif].couleur}, ${NIVEAUX_RIVIERE[niveauActif].couleur}80)`, width: `${((niveauActif) / (NIVEAUX_RIVIERE.length - 1)) * 100}%` }} />
          </div>
          <p className="text-center text-xs text-[rgba(212,221,215,0.4)] mt-3">Niveau {niveauActif + 1} sur {NIVEAUX_RIVIERE.length} — {NIVEAUX_RIVIERE[niveauActif].nom}</p>
        </motion.div>
      </div>
    </section>
  );
}
