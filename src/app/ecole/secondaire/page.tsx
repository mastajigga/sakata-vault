"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, BookOpen, Star, Sparkles, Binary } from "lucide-react";
import Link from "next/link";
import { secondaryPrograms } from "../data/mathematics-curriculum";
import MathCurriculumStudio from "../components/MathCurriculumStudio";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SecondaireContent() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const [selectedYear, setSelectedYear] = useState<typeof secondaryPrograms[0] | null>(null);

  useEffect(() => {
    if (yearParam) {
      const year = secondaryPrograms.find((p) => p.slug === yearParam);
      if (year) {
        setSelectedYear(year);
      }
    }
  }, [yearParam]);

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative font-sans">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/ecole"
              className="group flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour au Hub École</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-4">
              <Binary className="w-10 h-10 text-purple-400" />
              Le Monde Secondaire
            </h1>
            <p className="text-gray-400 mt-2 max-w-xl">
              Prépare ton avenir avec des mathématiques avancées appliquées aux richesses de notre terre.
              Maîtrise les nombres pour diriger les projets de demain.
            </p>
          </motion.div>

          {selectedYear && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedYear(null)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Changer de niveau
            </motion.button>
          )}
        </div>

        {!selectedYear ? (
          /* Year Selection Grid */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {secondaryPrograms.map((year, index) => (
              <Link
                key={year.slug}
                href={`/ecole/secondaire/${year.slug}/cours`}
                className="group relative block h-64"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className="h-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left p-8"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-purple-500/60 font-bold border border-purple-500/20 px-2 py-1 rounded">
                      Advanced
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="text-purple-400 text-sm font-semibold mb-1">
                      {year.degree}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform">
                      {year.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {year.focus}
                    </p>
                  </div>

                  {/* Glass effect hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          /* Studio View */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/5 border border-white/10 p-4 sm:p-10 backdrop-blur-md shadow-2xl"
          >
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                  Session d'apprentissage active
                </span>
                <h2 className="text-3xl font-bold text-white">{selectedYear.title}</h2>
              </div>
              <div className="flex items-center gap-3 text-purple-400 text-sm bg-purple-500/5 px-4 py-2 rounded-xl border border-purple-500/10">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{selectedYear.focus}</span>
              </div>
            </div>
            
            <MathCurriculumStudio programs={[selectedYear]} hideHeader={true} level="secondaire" />
          </motion.div>
        )}
      </div>

      {/* Footer hint */}
      <div className="max-w-7xl mx-auto mt-16 text-center">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto mb-6" />
        <p className="text-gray-500 text-sm">
          Besoin d'aide technique ? Visite <Link href="/help/ecole" className="text-purple-400 hover:underline">l'Espace Help École</Link>
        </p>
      </div>
    </div>
  );
}

export default function SecondairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f16]" />}>
      <SecondaireContent />
    </Suspense>
  );
}
