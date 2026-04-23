"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Cpu, Zap, RefreshCw, AudioLines, Search, Database } from "lucide-react";

const AIOrchestrationPage = () => {
  const [isIndexing, setIsIndexing] = useState(false);

  const stats = [
    { name: "Vecteurs Pinecone", value: "1,284", icon: Database, color: "text-or-ancestral" },
    { name: "Narrations Audio", value: "42", icon: AudioLines, color: "text-emerald-400" },
    { name: "Précision Sémantique", value: "98.2%", icon: Brain, color: "text-blue-400" },
    { name: "Appels API (24h)", value: "156", icon: Zap, color: "text-amber-400" },
  ];

  const handleReindex = () => {
    setIsIndexing(true);
    setTimeout(() => setIsIndexing(false), 3000);
  };

  return (
    <div className="space-y-12 pb-12">
      <header className="space-y-2">
        <span className="eyebrow" style={{ color: "var(--or-ancestral)" }}>Intelligence Artificielle</span>
        <h1 className="font-display text-4xl font-bold text-ivoire-ancien">Orchestration du Vieux Sage</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.name}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{stat.name}</p>
            <p className="text-2xl font-mono font-bold text-ivoire-ancien mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Knowledge Base Management */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-or-ancestral" />
              <h3 className="font-display text-xl font-bold">Mémoire Pinecone</h3>
            </div>
            <button
              onClick={handleReindex}
              disabled={isIndexing}
              className="flex items-center gap-2 px-4 py-2 bg-or-ancestral text-foret-nocturne rounded-full text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
              {isIndexing ? "Synchronisation..." : "Réindexer le Sanctuaire"}
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm opacity-60 leading-relaxed">
              La base de données vectorielle permet au Vieux Sage de retrouver les traditions Sakata avec une précision sémantique. Chaque article et document est fragmenté en vecteurs.
            </p>
            
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-3">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="opacity-40">Index principal : sakata-primary</span>
                  <span className="text-emerald-400">Opérationnel</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-or-ancestral w-3/4 rounded-full" />
               </div>
               <p className="text-[10px] text-ivoire-ancien/40">75% de la capacité de stockage utilisée</p>
            </div>
          </div>
        </motion.div>

        {/* Audio Persona Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl space-y-8"
        >
          <div className="flex items-center gap-3">
            <AudioLines className="w-6 h-6 text-emerald-400" />
            <h3 className="font-display text-xl font-bold">Voix du Vieux Sage</h3>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-40">Modèle</label>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-xs">Eleven Multilingual v2</div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold opacity-40">Accent</label>
                <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-xs">Congolais (Profond)</div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-xs font-bold">Stabilité de la voix</p>
                  <span className="text-xs font-mono text-or-ancestral">0.75</span>
               </div>
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                  <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
                  <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-emerald-500 shadow-lg" />
               </div>
            </div>

            <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors">
              Tester la voix (Générer échantillon)
            </button>
          </div>
        </motion.div>
      </div>

      {/* Advanced Tools */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <Cpu className="w-6 h-6 text-blue-400" />
          <h3 className="font-display text-xl font-bold">Paramètres de Conscience</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
              <h4 className="text-sm font-bold text-ivoire-ancien">Température Créative</h4>
              <p className="text-xs opacity-40">Contrôle l'imagination poétique du Vieux Sage.</p>
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-bold text-ivoire-ancien">Contexte Historique</h4>
              <p className="text-xs opacity-40">Poids donné aux documents d'archives coloniales.</p>
           </div>
           <div className="space-y-2">
              <h4 className="text-sm font-bold text-ivoire-ancien">Filtrage Culturel</h4>
              <p className="text-xs opacity-40">Niveau de protection contre les erreurs de traduction.</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIOrchestrationPage;
