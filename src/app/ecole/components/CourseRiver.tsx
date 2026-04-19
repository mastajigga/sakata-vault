"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Sigma, ArrowRight } from "lucide-react";
import type { MathematicsProgramYear } from "../data/mathematics-curriculum";

interface CourseRiverProps {
  primaryPrograms: MathematicsProgramYear[];
  secondaryPrograms: MathematicsProgramYear[];
}

interface Station {
  program: MathematicsProgramYear;
  level: "primaire" | "secondaire";
  index: number;
}

export default function CourseRiver({
  primaryPrograms,
  secondaryPrograms,
}: CourseRiverProps) {
  // Combine les 12 années en ordre : primaire (0-5), puis secondaire (6-11)
  const stations: Station[] = [
    ...primaryPrograms.map((program, index) => ({
      program,
      level: "primaire" as const,
      index,
    })),
    ...secondaryPrograms.map((program, index) => ({
      program,
      level: "secondaire" as const,
      index: index + primaryPrograms.length,
    })),
  ];

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-950/40 via-[#0a0f16] to-purple-950/30 backdrop-blur-sm">
      {/* Rivière SVG animée - arrière-plan absolu */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 2400 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Path définissant une ondulation de rivière. Duplication = effet tapis roulant infini */}
            <path
              id="river-wave"
              d="M 0 300
                 C 200 200, 400 200, 600 300
                 S 1000 400, 1200 300
                 S 1600 200, 1800 300
                 S 2200 400, 2400 300"
              fill="none"
            />
            {/* Courant de surface — teal/cyan lumineux */}
            <linearGradient id="river-gradient-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
              <stop offset="50%" stopColor="#5eead4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
            {/* Courant médian — bleu */}
            <linearGradient id="river-gradient-2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
            </linearGradient>
            {/* Profondeur — violet/indigo sombre */}
            <linearGradient id="river-gradient-3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="50%" stopColor="#4338ca" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Couche 3 — profondeur (lente, large, sombre) */}
          <g className="river-flow-anim river-flow-slow">
            <use href="#river-wave" stroke="url(#river-gradient-3)" strokeWidth="32" />
            <use href="#river-wave" x="2400" stroke="url(#river-gradient-3)" strokeWidth="32" />
          </g>

          {/* Couche 2 — courant (moyen) */}
          <g className="river-flow-anim river-flow-medium">
            <use href="#river-wave" stroke="url(#river-gradient-2)" strokeWidth="14" />
            <use href="#river-wave" x="2400" stroke="url(#river-gradient-2)" strokeWidth="14" />
          </g>

          {/* Couche 1 — surface (rapide, fine, éclatante) */}
          <g className="river-flow-anim river-flow-fast">
            <use href="#river-wave" stroke="url(#river-gradient-1)" strokeWidth="3" />
            <use href="#river-wave" x="2400" stroke="url(#river-gradient-1)" strokeWidth="3" />
          </g>

          {/* Reflets - points scintillants sur la crête */}
          <g className="river-ripple-anim">
            <circle cx="300" cy="280" r="2" fill="#5eead4" opacity="0.8" />
            <circle cx="900" cy="320" r="1.5" fill="#ffffff" opacity="0.6" />
            <circle cx="1500" cy="280" r="2" fill="#5eead4" opacity="0.7" />
            <circle cx="2100" cy="320" r="1.5" fill="#ffffff" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* Contenu - stations de la rivière */}
      <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
        {/* En-tête de la section */}
        <div className="mb-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-400"
          >
            <Sigma className="h-3 w-3" />
            Le cours d&apos;eau du savoir
          </motion.div>
          <h3 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Douze années qui coulent comme la{" "}
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Lukenie
            </span>
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
            De la source primaire au delta secondaire, chaque année est une station sur
            le cours d&apos;eau du savoir. Descendez la rivière, posez le pied sur un gué,
            entrez dans le cours.
          </p>
        </div>

        {/* Label des sections */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10">
              <GraduationCap className="h-4 w-4 text-blue-400" />
            </span>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blue-400">
                Source · Primaire
              </p>
              <p className="text-xs text-gray-500">
                6 années · Les premières brumes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:justify-end">
            <div className="md:text-right">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-purple-400">
                Delta · Secondaire
              </p>
              <p className="text-xs text-gray-500">
                6 années · Le cours mûri
              </p>
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
              <Sigma className="h-4 w-4 text-purple-400" />
            </span>
          </div>
        </div>

        {/* Grille des 12 stations */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {stations.map((station) => {
            const { program, level, index } = station;
            const Icon = level === "primaire" ? GraduationCap : Sigma;
            const href = program.courseSlug
              ? `/ecole/${level}/${program.courseSlug}/cours`
              : `/ecole/${level}`;

            // Décalage vertical en zigzag pour évoquer le parcours sur la rivière
            const yOffset = index % 2 === 0 ? "md:-translate-y-3" : "md:translate-y-3";
            const isPrimaire = level === "primaire";
            const iconBg = isPrimaire
              ? "border-blue-500/30 bg-blue-500/10 group-hover:bg-blue-500/20"
              : "border-purple-500/30 bg-purple-500/10 group-hover:bg-purple-500/20";
            const iconColor = isPrimaire ? "text-blue-400" : "text-purple-400";
            const degreeColor = isPrimaire ? "text-blue-400/80" : "text-purple-400/80";
            const hoverBorder = isPrimaire
              ? "hover:border-blue-400/40 hover:shadow-[0_12px_32px_rgba(59,130,246,0.15)]"
              : "hover:border-purple-400/40 hover:shadow-[0_12px_32px_rgba(168,85,247,0.15)]";

            return (
              <motion.div
                key={`${level}-${program.slug}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={yOffset}
              >
                <Link
                  href={href}
                  className={`group relative block h-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 ${hoverBorder}`}
                >
                  {/* Indicateur de station */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 group-hover:scale-110 ${iconBg}`}
                    >
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </span>
                    <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-gray-500">
                      {level === "primaire" ? "P" : "S"}
                      {station.index - (level === "primaire" ? 0 : primaryPrograms.length) + 1}
                    </span>
                  </div>

                  <h4 className="mt-4 text-base font-bold leading-tight tracking-tight text-white">
                    {program.title}
                  </h4>
                  <p className={`mt-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] ${degreeColor}`}>
                    {program.degree}
                  </p>
                  <p className="mt-3 line-clamp-3 text-xs leading-5 text-gray-400">
                    {program.focus}
                  </p>

                  <div className={`mt-4 flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.16em] ${iconColor} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}>
                    Entrer
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
