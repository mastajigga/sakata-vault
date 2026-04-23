"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Leaf, Construction, Zap } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { STORAGE_KEYS } from "@/lib/constants/storage";

export default function WelcomeModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { t } = useLanguage();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN);
      if (!hasSeen) {
        setIsOpen(true);
      }
    } catch (e) {
      // In constraints like Safari incognito, we assume they haven't seen it
      setIsOpen(true);
    }
  }, []);

  // Premium sequential animations for all steps
  useEffect(() => {
    if (contentRef.current) {
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline();

        if (step === 1 || step === 2) {
          // Animation pour steps 1 et 2: icon → title → descriptions → button
          const icon = contentRef.current?.querySelector("[data-icon]");
          const title = contentRef.current?.querySelector("h1, h2");
          const descriptions = contentRef.current?.querySelectorAll("[data-description]");
          const button = contentRef.current?.querySelector("button");

          // Icon scale + fade
          if (icon) {
            timeline.fromTo(icon,
              { scale: 0, opacity: 0, rotate: -20 },
              { scale: 1, opacity: 1, rotate: 0, duration: 0.6, ease: "back.out" },
              0
            );
          }

          // Title slides in
          if (title) {
            timeline.fromTo(title,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              0.1
            );
          }

          // Descriptions stagger in
          descriptions?.forEach((desc, i) => {
            timeline.fromTo(desc,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
              0.3 + i * 0.12
            );
          });

          // Button at the end
          if (button) {
            timeline.fromTo(button,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
              "-=0.15"
            );
          }
        } else if (step === 3) {
          // Animation pour step 3: title → cards → button
          const title = contentRef.current?.querySelector("h2");
          const cards = contentRef.current?.querySelectorAll("[data-card]");
          const button = contentRef.current?.querySelector("button");

          if (title) {
            timeline.fromTo(title,
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
              0
            );
          }

          cards?.forEach((card, i) => {
            timeline.fromTo(card,
              { y: 40, opacity: 0, scale: 0.95 },
              { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
              0.2 + i * 0.15
            );
          });

          if (button) {
            timeline.fromTo(button,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
              "-=0.2"
            );
          }
        }
      });

      return () => ctx.revert();
    }
  }, [step]);

  const handleNext = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1|2|3);
  };

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEYS.WELCOME_SEEN, "true");
    } catch (e) {
      console.warn("Could not save welcome state to localStorage");
    }
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-[#0A1F15]/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none"></div>
      
      {/* Top right language switcher specifically for the modal */}
      <div className="absolute top-6 right-6 z-[10000]">
        <LanguageSwitcher />
      </div>

      <div className="relative max-w-2xl w-full max-h-[90vh] bg-[#122A1E]/80 border border-[#B59551]/30 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-y-auto flex flex-col custom-scrollbar">
        {/* Step 1: Project Goal */}
        {step === 1 && (
          <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center">
            <div data-icon className="w-16 h-16 bg-gradient-to-br from-[#B59551]/20 to-[#B59551]/5 rounded-full flex items-center justify-center mb-6 border border-[#B59551]/40 hover:border-[#B59551]/70 transition-colors duration-300">
              <Leaf className="w-8 h-8 text-[#B59551]" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-display text-[#B59551] mb-6">
              {t("welcome.step1Title")}
            </h1>

            <p data-description className="text-[#F2EEDD]/80 text-lg leading-relaxed mb-6">
              <span dangerouslySetInnerHTML={{ __html: t("welcome.step1Desc1").replace("Sakata", "<strong>Sakata</strong>") }} />
            </p>
            <p data-description className="text-[#F2EEDD]/80 text-lg leading-relaxed mb-10">
              {t("welcome.step1Desc2")}
            </p>

            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-8 py-4 bg-[#B59551] text-[#0A1F15] rounded-full font-semibold hover:bg-white transition-colors duration-300 group"
            >
              {t("welcome.next")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 2: Under Construction Warning */}
        {step === 2 && (
          <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center">
            <div data-icon className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 border border-white/20 hover:border-[#B59551]/30 transition-colors duration-300">
              <Construction className="w-8 h-8 text-white/70" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-display text-white mb-6">
              {t("welcome.step2Title")}
            </h2>

            <div data-description className="bg-black/20 border border-[#B59551]/20 rounded-2xl p-6 text-left mb-10 w-full">
              <p className="text-[#F2EEDD]/80 text-base leading-relaxed mb-4">
                <span dangerouslySetInnerHTML={{ __html: t("welcome.step2Notice").replace("évolution permanente", "<strong>évolution permanente</strong>") }} />
              </p>
              <ul className="text-[#F2EEDD]/60 text-sm leading-relaxed space-y-3 list-disc pl-5">
                <li>{t("welcome.step2L1")}</li>
                <li>{t("welcome.step2L2")}</li>
                <li><strong>{t("welcome.step2L3")}</strong></li>
              </ul>
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-8 py-4 bg-[#B59551] text-[#0A1F15] rounded-full font-semibold hover:bg-white transition-colors duration-300 group"
            >
              {t("welcome.next")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Step 3: Roadmap & Features */}
        {step === 3 && (
          <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center">

            <h2 className="text-3xl sm:text-4xl font-display text-[#B59551] mb-8">
              {t("welcome.step3Title")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-left mb-10">

              {/* Dernières Mises à Jour (v2.6.0) */}
              <div data-card className="bg-gradient-to-br from-[#1A3A2E] to-[#0F2818] border border-[#B59551]/40 rounded-2xl p-5 hover:border-[#B59551]/60 transition-colors duration-300">
                <h3 className="text-[#B59551] font-medium text-base mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 flex-shrink-0" />
                  Mises à jour (v2.6.0)
                </h3>
                <ul className="text-[#F2EEDD]/70 text-sm space-y-2 list-disc pl-4">
                  <li><strong>Stabilité 3D:</strong> Carte interactive sans crash (fix Mapbox)</li>
                  <li><strong>Forum Mboka:</strong> Correction sérialisation (Next.js fix)</li>
                  <li><strong>Fluidité:</strong> Nouvelles transitions de pages premium</li>
                  <li><strong>Robustesse Auth:</strong> Hardening des sessions Supabase</li>
                </ul>
              </div>

              {/* Plateforme Complète */}
              <div data-card className="bg-gradient-to-br from-[#1A3A2E] to-[#0F2818] border border-white/10 rounded-2xl p-5 hover:border-[#B59551]/30 transition-colors duration-300">
                <h3 className="text-white font-medium text-base mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {t("welcome.deployed")}
                </h3>
                <ul className="text-[#F2EEDD]/70 text-sm space-y-2 list-disc pl-4">
                  <li dangerouslySetInnerHTML={{ __html: t("welcome.feat5").replace("Messagerie instantanée", "<strong>Messagerie instantanée</strong>") }} />
                  <li dangerouslySetInnerHTML={{ __html: t("welcome.feat1").replace("Forum Mboka", "<strong>Forum Mboka</strong>") }} />
                  <li>{t("welcome.feat2")}</li>
                  <li>{t("welcome.feat3")}</li>
                  <li>{t("welcome.feat4")}</li>
                </ul>
              </div>

            </div>

            <button
              onClick={handleClose}
              className="px-10 py-4 bg-[#B59551] text-[#0A1F15] rounded-full font-medium hover:bg-white transition-all duration-300 hover:shadow-xl"
            >
              {t("welcome.enterButton")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
