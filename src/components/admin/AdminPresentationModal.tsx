"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, MessageSquare, Image, X, ChevronRight, Gavel, ScrollText, TreePine } from "lucide-react";

export const AdminPresentationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("sakata-admin-v3-4-seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const close = () => {
    localStorage.setItem("sakata-admin-v3-4-seen", "true");
    setIsOpen(false);
  };

  const features = [
    {
      icon: Gavel,
      title: "Modération réelle",
      desc: "Signalements live, bannissements 24/48/72h, rappels à l'ordre, corbeille 6 mois. Nouveau rôle Modérateur dédié.",
      color: "text-or-ancestral"
    },
    {
      icon: ScrollText,
      title: "Journaux des anciens",
      desc: "Toute action de modération laisse une trace consultable dans /admin/logs : filtrable par type, modérateur, utilisateur cible.",
      color: "text-or-ancestral"
    },
    {
      icon: TreePine,
      title: "Arbre généalogique 3D",
      desc: "Page /genealogie refondue avec une scène 3D immersive : orbes lumineuses, étoiles, rotation auto, focus interactif.",
      color: "text-emerald-400"
    },
    {
      icon: ShieldCheck,
      title: "RolePicker & demandes contributeur",
      desc: "Sélecteur de rôle animé (incl. Modérateur), formulaire de candidature enrichi (motivation, origine, types de partage).",
      color: "text-or-ancestral"
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
                <h2 className="text-3xl font-display font-bold text-ivoire-ancien">Bienvenue dans la V3.4</h2>
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
