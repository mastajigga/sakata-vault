"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Leaf, Construction } from "lucide-react";

export default function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    setMounted(true);
    try {
      const hasSeen = localStorage.getItem("sakata_welcome_seen");
      if (!hasSeen) {
        setIsOpen(true);
      }
    } catch (e) {
      // In constraints like Safari incognito, we assume they haven't seen it
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1|2|3);
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem("sakata_welcome_seen", "true");
    } catch (e) {
      console.warn("Could not save welcome state to localStorage");
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-[#0A1F15]/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
      
      <div className="relative max-w-2xl w-full bg-[#122A1E]/80 border border-[#B59551]/30 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col">
        {/* Step 1: Project Goal */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-forwards relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#B59551]/10 rounded-full flex items-center justify-center mb-6 border border-[#B59551]/30">
              <Leaf className="w-8 h-8 text-[#B59551]" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-display text-[#B59551] mb-6">
              Bienvenue sur Kisakata
            </h1>
            
            <p className="text-[#F2EEDD]/80 text-lg leading-relaxed mb-6">
              Ce portail est un sanctuaire numérique dédié à la préservation et à la transmission de l'identité culturelle du peuple <strong>Sakata</strong>.
            </p>
            <p className="text-[#F2EEDD]/80 text-lg leading-relaxed mb-10">
              Notre objectif est d'unir nos racines ancestrales avec la splendeur numérique moderne, en offrant à la fois des archives vivantes, des sagesses intemporelles et un forum d'échange intergénérationnel.
            </p>

            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-8 py-4 bg-[#B59551] text-[#0A1F15] rounded-full font-semibold hover:bg-white transition-colors duration-300 group"
            >
              Suivant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 2: Under Construction Warning */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-forwards relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
              <Construction className="w-8 h-8 text-white/70" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display text-white mb-6">
              Site en cours de construction
            </h2>
            
            <div className="bg-black/20 border border-[#B59551]/20 rounded-2xl p-6 text-left mb-10 w-full">
              <p className="text-[#F2EEDD]/80 text-base leading-relaxed mb-4">
                Veuillez noter que Kisakata est une initiative en <strong>évolution permanente</strong>.
              </p>
              <ul className="text-[#F2EEDD]/60 text-sm leading-relaxed space-y-3 list-disc pl-5">
                <li>Le portail est actuellement en mode construction.</li>
                <li>Des améliorations visuelles et structurelles surviennent quotidiennement.</li>
                <li><strong>Les articles du savoir sont édités et enrichis manuellement plusieurs fois par jour.</strong></li>
              </ul>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-8 py-4 bg-[#B59551] text-[#0A1F15] rounded-full font-semibold hover:bg-white transition-colors duration-300 group"
            >
              Suivant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 3: Roadmap & Features */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-500 fill-mode-forwards relative z-10 flex flex-col items-center text-center">
            
            <h2 className="text-3xl sm:text-4xl font-display text-[#B59551] mb-6">
              Nouveautés & Horizon
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left mb-10">
              
              {/* Nouveautés */}
              <div className="bg-[#183125] border border-white/5 rounded-2xl p-5">
                <h3 className="text-white font-medium text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Récemment Déployé
                </h3>
                <ul className="text-[#F2EEDD]/70 text-sm space-y-2 list-disc pl-4">
                  <li><strong>Forum Mboka</strong> (Discussions en temps réel)</li>
                  <li>Liaison automatique Savoir ↔ Forum</li>
                  <li>Système de traduction et mémorisation optimisé</li>
                  <li>Interface "Brume de la Rivière" fluidifiée</li>
                </ul>
              </div>

              {/* Futur */}
              <div className="bg-[#183125] border border-[#B59551]/30 rounded-2xl p-5">
                <h3 className="text-[#B59551] font-medium text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B59551] animate-pulse"></span>
                  Prochainement
                </h3>
                <ul className="text-[#F2EEDD]/70 text-sm space-y-2 list-disc pl-4">
                  <li><strong>L'Accès aux Archives Supérieures</strong> (Paywall)</li>
                  <li>Paiement intégré sécurisé via Stripe</li>
                  <li>Tableau de bord de télémétrie</li>
                  <li>Enrichissement participatif</li>
                </ul>
              </div>

            </div>

            <button
              onClick={handleClose}
              className="px-10 py-4 bg-transparent border border-[#B59551] text-[#B59551] rounded-full font-medium hover:bg-[#B59551] hover:text-[#0A1F15] transition-colors duration-300"
            >
              Entrer dans le Sanctuaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
