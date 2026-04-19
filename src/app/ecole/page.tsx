"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, BookOpen, Sparkles, BookMarked, HelpCircle, Sigma } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EcoleHero from "./components/EcoleHero";
import CourseRiver from "./components/CourseRiver";
import { primaryPrograms, secondairePrograms } from "./data/mathematics-curriculum";

export default function EcolePage() {
  return (
    <main className="min-h-screen bg-[#0a0f16] font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <Navbar />
      <EcoleHero />

      <section className="relative z-10 -mt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center md:text-left transition-all duration-700">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Sparkles className="w-3 h-3" />
              Sakata Educational Hub
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Choisis ton <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Champ d'Apprentissage</span>
            </h2>
          </div>

          {/* Bento Grid Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
            
            {/* Primaire - Main Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-8 group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-blue-600/20 to-teal-600/20 backdrop-blur-sm cursor-pointer min-h-[400px]"
            >
              <Link href="/ecole/primaire" className="absolute inset-0 z-10" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-110 transition-transform duration-700" />
              
              <div className="relative h-full p-8 md:p-12 flex flex-col justify-end">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">École Primaire</h3>
                <p className="text-gray-300 text-lg max-w-md mb-8">
                  Découvrez les bases des mathématiques à travers les contes et les défis de la forêt Sakata. 
                  Une aventure ludique pour les 6-12 ans.
                </p>
                <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-sm">
                  <span>Rejoindre l'Aventure</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Secondaire - Tall Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-4 group relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-sm cursor-pointer min-h-[400px]"
            >
              <Link href="/ecole/secondaire" className="absolute inset-0 z-10" />
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-700" />
              
              <div className="relative h-full p-8 md:p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                    <Sigma className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">École Secondaire</h3>
                  <p className="text-gray-400 text-base mb-6">
                    Maîtrisez l'algèbre et la géométrie avancées pour devenir les futurs leaders de notre communauté.
                  </p>
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-widest">
                    <span>Voir le curriculum</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Cours d'eau du savoir — rivière animée 60fps des 12 années */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
          >
            <CourseRiver
              primaryPrograms={primaryPrograms}
              secondaryPrograms={secondairePrograms}
            />
          </motion.div>

          {/* Secondary Bento Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            
            {/* Help Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative rounded-[2rem] p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Link href="/help/ecole" className="absolute inset-0 z-10" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <HelpCircle className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-xl font-bold text-white">Besoin d'aide ?</h4>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Comprenez notre vision pédagogique, la stack technique et comment naviguer dans le Hub.
              </p>
              <div className="text-amber-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                <span>Espace Help</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Resources Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 group relative rounded-[2rem] p-8 border border-white/10 bg-gradient-to-r from-blue-900/10 to-transparent flex flex-col md:flex-row items-center gap-8"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <BookMarked className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Bibliothèque Sakata</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Accédez à des documents culturels et des leçons supplémentaires sur l'histoire de notre peuple.
                </p>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-500 font-mono uppercase inline-block">
                  Coming soon
                </div>
              </div>
              <div className="hidden md:block w-32 h-32 bg-blue-500/5 rounded-full blur-2xl absolute -right-4 -bottom-4 animate-pulse opacity-20" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Decorative Blur */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Footer />
    </main>
  );
}
