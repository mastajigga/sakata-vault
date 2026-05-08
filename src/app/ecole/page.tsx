"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, BookMarked, HelpCircle, Sigma, Languages } from "lucide-react";
import Link from "next/link";
import EcoleHero from "./components/EcoleHero";
import CourseRiver from "./components/CourseRiver";
import { primaryPrograms, secondairePrograms } from "./data/mathematics-curriculum";
import { ROUTES } from "@/lib/constants/routes";

export default function EcolePage() {
  return (
    <main className="min-h-screen bg-foret-nocturne font-sans selection:bg-or-ancestral/30 selection:text-ivoire-ancien">
      <EcoleHero />

      <section className="relative z-10 -mt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-or-ancestral/10 border border-or-ancestral/20 text-or-ancestral text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Sparkles className="w-3 h-3" />
              Sanctuaire éducatif Sakata
            </motion.div>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-ivoire-ancien tracking-tight">
              Choisis ton{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-or-ancestral to-ivoire-ancien">
                Champ d'Apprentissage
              </span>
            </h2>
          </div>

          {/* Bento Grid Navigation — 3 disciplines */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Primaire - Main Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-7 group relative rounded-[2.5rem] overflow-hidden border border-or-ancestral/15 bg-gradient-to-br from-or-ancestral/15 via-foret-nocturne to-foret-nocturne backdrop-blur-sm cursor-pointer min-h-[380px]"
            >
              <Link href="/ecole/primaire" className="absolute inset-0 z-10" aria-label="École Primaire" />
              <div className="absolute inset-0 bg-[url('/images/sakata_heritage_hero.png')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-110 transition-transform duration-700" />

              <div className="relative h-full p-8 md:p-12 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-ivoire-ancien/10 backdrop-blur-md flex items-center justify-center mb-6 border border-ivoire-ancien/20 group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-7 h-7 text-or-ancestral" />
                </div>
                <h3 className="font-display text-3xl md:text-5xl font-bold text-ivoire-ancien mb-3">École Primaire</h3>
                <p className="text-ivoire-ancien/60 text-base md:text-lg max-w-md mb-6 leading-relaxed">
                  Découvre les bases des mathématiques à travers les contes et les défis de la forêt Sakata. Une aventure ludique pour les 6-12 ans.
                </p>
                <div className="flex items-center gap-3 text-or-ancestral font-mono text-xs uppercase tracking-widest">
                  <span>Rejoindre l'aventure</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Secondaire - Tall Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-5 group relative rounded-[2.5rem] overflow-hidden border border-or-ancestral/20 bg-gradient-to-br from-or-ancestral/10 to-foret-nocturne backdrop-blur-sm cursor-pointer min-h-[380px]"
            >
              <Link href="/ecole/secondaire" className="absolute inset-0 z-10" aria-label="École Secondaire" />
              <div className="relative h-full p-8 md:p-10 flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-or-ancestral/15 flex items-center justify-center border border-or-ancestral/30 group-hover:rotate-6 transition-transform">
                  <Sigma className="w-6 h-6 text-or-ancestral" />
                </div>

                <div>
                  <h3 className="font-display text-3xl font-bold text-ivoire-ancien mb-3">École Secondaire</h3>
                  <p className="text-ivoire-ancien/60 text-sm md:text-base mb-6 leading-relaxed">
                    Maîtrise l'algèbre et la géométrie avancées pour devenir les futurs leaders de notre communauté.
                  </p>
                  <div className="flex items-center gap-2 text-or-ancestral font-mono text-xs uppercase tracking-widest">
                    <span>Voir le curriculum</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Langue Kisakata — full width below */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-12 group relative rounded-[2.5rem] overflow-hidden border border-or-ancestral/15 bg-gradient-to-r from-foret-nocturne via-or-ancestral/10 to-foret-nocturne backdrop-blur-sm cursor-pointer"
            >
              <Link href={ROUTES.LANGUE} className="absolute inset-0 z-10" aria-label="Langue Kisakata" />
              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                <div className="w-14 h-14 rounded-2xl bg-or-ancestral/15 flex items-center justify-center border border-or-ancestral/30 flex-shrink-0 group-hover:rotate-6 transition-transform">
                  <Languages className="w-6 h-6 text-or-ancestral" />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-or-ancestral/70">Nouvelle discipline</span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-ivoire-ancien">Langue Kisakata</h3>
                  <p className="text-ivoire-ancien/60 text-sm md:text-base leading-relaxed max-w-2xl">
                    Apprends la langue ancestrale par leçons interactives — vocabulaire, expressions et culture orale du peuple Sakata.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-or-ancestral font-mono text-xs uppercase tracking-widest md:self-end">
                  <span>Commencer la première leçon</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Cours d'eau du savoir */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
          >
            <CourseRiver primaryPrograms={primaryPrograms} secondaryPrograms={secondairePrograms} />
          </motion.div>

          {/* Secondary row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-[2rem] p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Link href="/help/philosophy" className="absolute inset-0 z-10" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-or-ancestral/10 flex items-center justify-center border border-or-ancestral/20">
                  <HelpCircle className="w-6 h-6 text-or-ancestral" />
                </div>
                <h4 className="font-display text-xl font-bold text-ivoire-ancien">Besoin d'aide ?</h4>
              </div>
              <p className="text-ivoire-ancien/50 text-sm leading-relaxed mb-6">
                Comprends notre vision pédagogique, la stack technique et comment naviguer dans le sanctuaire.
              </p>
              <div className="text-or-ancestral text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Espace aide</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 group relative rounded-[2rem] p-8 border border-white/10 bg-gradient-to-r from-or-ancestral/5 to-transparent flex flex-col md:flex-row items-center gap-8 overflow-hidden"
            >
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-or-ancestral/10 flex items-center justify-center border border-or-ancestral/20">
                    <BookMarked className="w-6 h-6 text-or-ancestral" />
                  </div>
                  <h4 className="font-display text-xl font-bold text-ivoire-ancien">Bibliothèque Sakata</h4>
                </div>
                <p className="text-ivoire-ancien/50 text-sm leading-relaxed mb-4">
                  Accède à des documents culturels et des leçons supplémentaires sur l'histoire de notre peuple.
                </p>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-ivoire-ancien/40 font-mono uppercase inline-block">
                  Bientôt disponible
                </div>
              </div>
              <div className="hidden md:block w-32 h-32 bg-or-ancestral/5 rounded-full blur-2xl absolute -right-4 -bottom-4 animate-pulse opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative blur — brume tokens */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-or-ancestral/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-or-ancestral/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </main>
  );
}
