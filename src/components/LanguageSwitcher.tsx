// src/components/LanguageSwitcher.tsx
"use client";

import { useLanguage } from "./LanguageProvider";
import { Language } from "@/types/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";

const LANGUAGES: { code: Language; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "skt", label: "Kisakata", short: "SKT" },
  { code: "lin", label: "Lingala", short: "LIN" },
  { code: "swa", label: "Swahili", short: "SWA" },
  { code: "tsh", label: "Tshiluba", short: "TSH" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-or-ancestral/50 transition-all text-ivoire-ancien/60 hover:text-ivoire-ancien"
      >
        <Globe className="h-4 w-4" />
        <span className="text-[10px] font-bold tracking-widest uppercase">{currentLang?.short}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 right-0 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[var(--foret-nocturne)]/90 p-1.5 backdrop-blur-2xl z-[100]"
            style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs transition-all ${
                  language === lang.code
                    ? "bg-or-ancestral text-foret-nocturne font-bold"
                    : "text-ivoire-ancien/60 hover:bg-white/5 hover:text-ivoire-ancien"
                }`}
              >
                <span>{lang.label}</span>
                {language === lang.code && <Check className="h-3 w-3" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
