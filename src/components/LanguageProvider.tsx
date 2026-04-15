// src/components/LanguageProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language as LangType } from "@/types/i18n";
import { UI_TRANSLATIONS as Translations } from "@/data/translations";
import { STORAGE_KEYS } from "@/lib/constants/storage";

interface LanguageContextType {
  language: LangType;
  setLanguage: (lang: LangType) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LangType>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG) as LangType;
      if (saved) {
        setLanguage(saved);
        return;
      }

      // Auto-detect browser language on first visit
      const browserLang = navigator.language.split("-")[0];
      const supportedLangs: LangType[] = ["en", "fr", "skt", "lin", "swa", "tsh"];
      const detectedLang: LangType = supportedLangs.includes(browserLang as LangType)
        ? (browserLang as LangType)
        : "en";

      setLanguage(detectedLang);
      localStorage.setItem(STORAGE_KEYS.LANG, detectedLang);
    } catch (e) {
      console.warn("localStorage access restricted - Defaulting to en");
      setLanguage("en");
    }
  }, []);

  const handleSetLanguage = (lang: LangType) => {
    setLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch (e) {
      console.warn("localStorage access restricted - Cannot save preference");
    }
  };

  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = Translations;
    for (const key of keys) {
      if (current[key]) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current[language] || current["fr"] || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
