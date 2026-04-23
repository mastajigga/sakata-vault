"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, MessageSquare, Image, X, ChevronRight } from "lucide-react";

export const AdminPresentationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("sakata-admin-v3-seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const close = () => {
    localStorage.setItem("sakata-admin-v3-seen", "true");
    setIsOpen(false);
  };

  const features = [
    {
      icon: Sparkles,
      title: "Orchestration IA",
      desc: "Discutez avec vos données Pinecone et générez des voix automatiques avec Gemini 1.5 Pro.",
      color: "text-or-ancestral"
    },
    {
      icon: ShieldCheck,
      title: "Gestion Membres V3",
      desc: "Nouveau système de recherche résilient et logging d'activité complet.",
      color: "text-emerald-400"
    },
    {
      icon: Zap,
      title: "Optimisation Réseau",
      desc: "Liaison BDD avec retry intelligent et gestion de file d'attente pour une stabilité totale.",
      color: "text-blue-400"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="w-full max-w-xl bg-[#050C09] border border-or-ancestral/20 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(193,107,52,0.15)] flex flex-col"
          >
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-or-ancestral">Command Center Upgrade</span>
                <h2 className="text-3xl font-display font-bold text-ivoire-ancien">Bienvenue dans la V3.1</h2>
                <p className="text-ivoire-ancien/60 text-sm leading-relaxed">
                  Votre centre de commandement a été renforcé par les puissances de l'IA et une infrastructure réseau de nouvelle génération.
                </p>
              </div>

              <div className="space-y-6">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${f.color} group-hover:scale-110 transition-transform`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-ivoire-ancien text-sm">{f.title}</h4>
                      <p className="text-xs opacity-50 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={close}
                className="w-full py-4 rounded-2xl bg-or-ancestral text-foret-nocturne font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                Accéder au Sanctuaire
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={close}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
