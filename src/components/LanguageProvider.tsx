// src/components/LanguageProvider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language as LangType } from "@/types/i18n";
import { UI_TRANSLATIONS as Translations } from "@/data/translations";

interface LanguageContextType {
  language: LangType;
  setLanguage: (lang: LangType) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LangType>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sakata-lang") as LangType;
      if (saved) setLanguage(saved);
    } catch (e) {
      console.warn("localStorage access restricted - Defaulting to fr");
    }
  }, []);

  const handleSetLanguage = (lang: LangType) => {
    setLanguage(lang);
    try {
      localStorage.setItem("sakata-lang", lang);
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
