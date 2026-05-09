"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, MessageSquare, Image, X, ChevronRight, Gavel, ScrollText, TreePine, Compass, Crown } from "lucide-react";

export const AdminPresentationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("sakata-admin-v3-5-seen");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const close = () => {
    localStorage.setItem("sakata-admin-v3-5-seen", "true");
    setIsOpen(false);
  };

  const features = [
    {
      icon: Compass,
      title: "Navigation mobile Constellation",
      desc: "Le menu burger est remplacé par un FAB doré qui s'épanouit en arc. Deux batches alternés (Essentiel / Découverte) + actions contextuelles selon la page.",
      color: "text-or-ancestral"
    },
    {
      icon: Crown,
      title: "Abonnements offerts",
      desc: "Bouton couronne sur /admin/users : offrez un Premium gratuit (7j à illimité). Modale festive + notification au prochain login du membre.",
      color: "text-or-ancestral"
    },
    {
      icon: Sparkles,
      title: "Articles à étages",
      desc: "Trois types d'articles : Résumé (libre), Poétique et Philosophique (Premium). Sélecteur intégré à la page de revue.",
      color: "text-or-ancestral"
    },
    {
      icon: Gavel,
      title: "Modération forum complète",
      desc: "Signalements réels, bannissements 24/48/72h, rappels à l'ordre, corbeille 6 mois, journaux dans /admin/logs.",
      color: "text-or-ancestral"
    },
    {
      icon: TreePine,
      title: "Généalogie 3D immersive",
      desc: "Scène 3D animée (R3F) sur /genealogie : orbes lumineuses, étoiles, focus interactif. Champs Prénom + Nom séparés.",
      color: "text-emerald-400"
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
                <h2 className="text-3xl font-display font-bold text-ivoire-ancien">Bienvenue dans la V3.5</h2>
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
