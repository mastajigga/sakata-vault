"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Waves } from "lucide-react";

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
      { id: "salutations", titre: "Salutations", slug: "salutations", description: "Mbóte, Tókó, Lóbí — les premiers mots", icone: "👋", debloquee: true, completee: false },
      { id: "famille", titre: "La Famille", slug: "famille", description: "Tatá, Mamá, Nkókó — les liens sacrés", icone: "👨‍👩‍👧", debloquee: true, completee: false },
      { id: "presentation", titre: "Se présenter", slug: "se-presenter", description: "Nkómbó na ngáí... — Je m'appelle...", icone: "🗣️", debloquee: true, completee: false },
      { id: "nombres", titre: "Les Nombres", slug: "nombres", description: "Mókó, Íbalé, Ísátó — compter de 1 à 6", icone: "🔢", debloquee: true, completee: false },
      { id: "corps", titre: "Le Visage & le Corps", slug: "corps", description: "Mótú, Míso, Motéma — se connaître", icone: "🫀", debloquee: true, completee: false },
      { id: "animaux", titre: "Animaux de la Forêt", slug: "animaux", description: "Nkóyí, Nkósó, Mbwá — les créatures", icone: "🐆", debloquee: true, completee: false },
      { id: "boire-manger", titre: "Boire & Manger", slug: "boire-manger", description: "Kolía, Koméla, Mái — le repas sacré", icone: "🍲", debloquee: true, completee: false },
      { id: "questions", titre: "Questions Simples", slug: "questions", description: "Náni?, Níni?, Wápi? — comprendre", icone: "❓", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Ruisseau",
    slug: "ruisseau",
    couleur: "#B59551",
    etapes: [
      { id: "nourriture", titre: "La Nourriture", slug: "nourriture", description: "Mákémbá, Nsósó, Mbísi — aliments du terroir", icone: "🍗", debloquee: true, completee: false },
      { id: "couleurs", titre: "Les Couleurs", slug: "couleurs", description: "Ntáne, Mbwé, Ngóla — la palette", icone: "🎨", debloquee: true, completee: false },
      { id: "compter", titre: "Compter en Kisakata", slug: "compter", description: "Nsámbó, Mwámbé, Zómi — 7 à 20", icone: "🧮", debloquee: true, completee: false },
      { id: "maison", titre: "La Maison & le Village", slug: "maison", description: "Ndáko, Ekuke, Móto — le foyer", icone: "🏠", debloquee: true, completee: false },
      { id: "vetements", titre: "Les Vêtements", slug: "vetements", description: "Lipúta, Mabéle, Ekótó — se vêtir", icone: "👘", debloquee: true, completee: false },
      { id: "meteo", titre: "Météo & Saisons", slug: "meteo", description: "Mbúla, Mói, Nkáké — le ciel", icone: "🌦️", debloquee: true, completee: false },
      { id: "sentiments", titre: "Les Sentiments", slug: "sentiments", description: "Bosémbo, Elingí, Mawa — le cœur", icone: "💝", debloquee: true, completee: false },
      { id: "marche", titre: "Au Marché", slug: "marche", description: "Zándo, Kosómba, Mbóngo — échanger", icone: "🏪", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Rivière",
    slug: "riviere",
    couleur: "#E9C46A",
    etapes: [
      { id: "actions", titre: "Actions & Verbes", slug: "actions", description: "Kotámbola, Kolía, Kolála — au quotidien", icone: "🏃", debloquee: true, completee: false },
      { id: "temps", titre: "Le Temps", slug: "temps", description: "Lóbí, Lélo, Siká — la rivière du temps", icone: "⏳", debloquee: true, completee: false },
      { id: "lieux", titre: "Lieux & Nature", slug: "lieux", description: "Zámba, Ebale, Mbóka — le territoire", icone: "🌿", debloquee: true, completee: false },
      { id: "conversation", titre: "La Conversation", slug: "conversation", description: "Sángo níni?, Malámu — dialoguer", icone: "💬", debloquee: true, completee: false },
      { id: "metiers", titre: "Métiers & Savoir-faire", slug: "metiers", description: "Motúlí, Molóbi, Mokéli — artisans", icone: "⚒️", debloquee: true, completee: false },
      { id: "ceremonies", titre: "Cérémonies & Fêtes", slug: "ceremonies", description: "Libála, Matánga, Mabína — célébrer", icone: "🎊", debloquee: true, completee: false },
      { id: "voyager", titre: "Voyager", slug: "voyager", description: "Bwátu, Mobémbó, Mosíká — partir", icone: "🛶", debloquee: true, completee: false },
      { id: "raconter", titre: "Raconter sa Journée", slug: "raconter", description: "Ntóngó, Mpókwa, Kozónga — le récit", icone: "📝", debloquee: true, completee: false },
    ],
  },
  {
    nom: "Lukenie",
    slug: "lukenie",
    couleur: "#E8C670",
    etapes: [
      { id: "proverbes", titre: "Proverbes", slug: "proverbes", description: "La sagesse des anciens en une phrase", icone: "📜", debloquee: true, completee: false },
      { id: "recits", titre: "Récits", slug: "recits", description: "Kala kala... — raconter une histoire", icone: "📖", debloquee: true, completee: false },
      { id: "chant", titre: "Chants & Poésie", slug: "chant", description: "Loyémbo, Ngóma — le rythme sacré", icone: "🎵", debloquee: true, completee: false },
      { id: "sagesse", titre: "Sagesse des Anciens", slug: "sagesse", description: "Bakókó, Litéya, Bwányá — transmettre", icone: "🦉", debloquee: true, completee: false },
      { id: "croyances", titre: "Esprits & Croyances", slug: "croyances", description: "Elímá, Ngánga, Molímo — l'invisible", icone: "🔮", debloquee: true, completee: false },
      { id: "plantes", titre: "Guérir & les Plantes", slug: "plantes", description: "Nkéngé, Nzeté, Mpótó — la pharmacie", icone: "🌿", debloquee: true, completee: false },
      { id: "conseil", titre: "La Parole du Conseil", slug: "conseil", description: "Lisángá, Liloba, Mobéko — décider", icone: "🏛️", debloquee: true, completee: false },
      { id: "benedictions", titre: "Bénédictions & Souhaits", slug: "benedictions", description: "Bokiló, Nkéli elámu — les formules", icone: "🙌", debloquee: true, completee: false },
    ],
  },
];

/** SVG rivière sinueuse */
function RiviereSvg() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 800" preserveAspectRatio="none">
      <defs>
        <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C4A035" stopOpacity="0.3" />
          <stop offset="33%" stopColor="#B59551" stopOpacity="0.4" />
          <stop offset="66%" stopColor="#E9C46A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E8C670" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M0,400 C200,150 300,650 500,400 C700,150 800,650 1000,400 C1100,300 1150,350 1200,380" fill="none" stroke="url(#riverGrad)" strokeWidth="40" strokeLinecap="round" opacity="0.5" />
      <path d="M0,400 C200,150 300,650 500,400 C700,150 800,650 1000,400 C1100,300 1150,350 1200,380" fill="none" stroke="#C4A035" strokeWidth="2" strokeLinecap="round" opacity="0.3" strokeDasharray="8 16" />
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
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/20 text-[var(--or-ancestral)] text-xs font-bold uppercase tracking-widest mb-4">
            Méthode
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-[var(--ivoire-ancien)]">
            La Rivière du Savoir
          </h2>
          <p className="mt-4 text-[rgba(212,221,215,0.72)] max-w-2xl mx-auto">
            Chaque niveau est une étape sur la rivière.{" "}
            <span className="text-[var(--or-ancestral)] font-semibold">32 leçons</span>{" "}
            vous attendent, de la Goutte de Rosée au fleuve Lukenie.
          </p>
        </motion.div>

        {/* Tabs des niveaux */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {NIVEAUX_RIVIERE.map((niveau, idx) => (
            <motion.button
              key={niveau.slug}
              onClick={() => setNiveauActif(idx)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 ${
                niveauActif === idx
                  ? "bg-[rgba(196,160,53,0.2)] border border-[rgba(196,160,53,0.4)] text-[var(--or-ancestral)] shadow-[0_0_20px_rgba(196,160,53,0.1)]"
                  : "border border-[rgba(212,221,215,0.08)] text-[rgba(212,221,215,0.6)] hover:border-[rgba(212,221,215,0.2)]"
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: niveau.couleur }} />
              {niveau.nom}
            </motion.button>
          ))}
        </div>

        {/* Étapes du niveau — grille 4 colonnes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={niveauActif}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto"
          >
            {NIVEAUX_RIVIERE[niveauActif].etapes.map((etape, idx) => (
              <motion.div
                key={etape.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <Link
                  href={`/langue/lecon/${NIVEAUX_RIVIERE[niveauActif].slug}/${etape.slug}`}
                  className="block h-full rounded-[1.5rem] border border-[rgba(212,221,215,0.08)] bg-[rgba(10,31,21,0.5)] backdrop-blur-sm p-5 hover:border-[rgba(196,160,53,0.3)] hover:bg-[rgba(10,31,21,0.7)] transition-all duration-500 overflow-hidden relative"
                >
                  {/* Glow au hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_50%_0%,rgba(196,160,53,0.08),transparent_70%)]" />

                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(196,160,53,0.08)] flex items-center justify-center mb-3 text-xl group-hover:scale-110 group-hover:bg-[rgba(196,160,53,0.15)] transition-all duration-300">
                      {etape.icone}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[rgba(196,160,53,0.45)] group-hover:text-[var(--or-ancestral)]/70 transition-colors">
                      Leçon {idx + 1}
                    </span>
                    <h3 className="mt-1 text-base font-display text-[var(--ivoire-ancien)] group-hover:text-[var(--or-ancestral)] transition-colors">
                      {etape.titre}
                    </h3>
                    <p className="mt-2 text-xs text-[rgba(212,221,215,0.6)] leading-relaxed line-clamp-2">
                      {etape.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(196,160,53,0.5)] group-hover:text-[var(--or-ancestral)] transition-colors">
                      <span>Commencer</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Indicateur de progression */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 max-w-xl mx-auto"
        >
          <div className="h-1.5 rounded-full bg-[rgba(212,221,215,0.06)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((niveauActif + 1) / NIVEAUX_RIVIERE.length) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(90deg, ${NIVEAUX_RIVIERE[niveauActif].couleur}, ${NIVEAUX_RIVIERE[niveauActif].couleur}80)`,
              }}
            />
          </div>
          <p className="text-center text-xs text-[rgba(212,221,215,0.4)] mt-3 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-[var(--or-ancestral)]/40" />
            Niveau {niveauActif + 1} sur {NIVEAUX_RIVIERE.length} — {NIVEAUX_RIVIERE[niveauActif].nom}
            <Sparkles className="w-3 h-3 text-[var(--or-ancestral)]/40" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
