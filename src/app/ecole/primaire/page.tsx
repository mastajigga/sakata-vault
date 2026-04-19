"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, BookOpen, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { primaryPrograms } from "../data/mathematics-curriculum";
import MathCurriculumStudio from "../components/MathCurriculumStudio";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PrimaireContent() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const [selectedYear, setSelectedYear] = useState<typeof primaryPrograms[0] | null>(null);

  useEffect(() => {
    if (yearParam) {
      const year = primaryPrograms.find((p) => p.slug === yearParam);
      if (year) {
        setSelectedYear(year);
      }
    }
  }, [yearParam]);

  return (
    <div className="min-h-screen bg-[#0a0f16] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
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
              className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Retour au Hub École</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 flex items-center gap-4">
              <GraduationCap className="w-10 h-10 text-blue-400" />
              Le Monde Primaire
            </h1>
            <p className="text-gray-400 mt-2 max-w-xl">
              Découvre les mathématiques à travers les histoires du village. 
              Choisis ton année pour commencer l'aventure !
            </p>
          </motion.div>

          {selectedYear && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedYear(null)}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Changer d'année
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
            {primaryPrograms.map((year, index) => (
              <Link
                key={year.slug}
                href={`/ecole/primaire/${year.slug}/cours`}
                className="group relative block h-64"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="h-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                >
                  {/* Decorative overlay */}
                  <div className="absolute top-0 right-0 p-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-8 pt-0">
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold mb-2 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      {year.degree}
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
                      {year.title}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {year.focus}
                    </p>
                  </div>

                  {/* Bottom line accent */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </motion.div>
              </Link>
            ))}
          </motion.div>
        ) : (
          /* Studio View */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[2.5rem] bg-white/5 border border-white/10 p-4 sm:p-8 backdrop-blur-sm"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-blue-300">{selectedYear.title}</h2>
                <div className="flex items-center gap-4 mt-1">
                   <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    Progression de l'aventure
                  </span>
                </div>
              </div>
            </div>
            
            <MathCurriculumStudio programs={[selectedYear]} hideHeader={true} />
          </motion.div>
        )}
      </div>

      {/* Footer hint */}
      <div className="max-w-7xl mx-auto mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Une question ? Consulte la <Link href="/help/ecole" className="text-blue-400 hover:underline">rubrique d'aide</Link>
        </p>
      </div>
    </div>
  );
}

export default function PrimairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f16]" />}>
      <PrimaireContent />
    </Suspense>
  );
}
