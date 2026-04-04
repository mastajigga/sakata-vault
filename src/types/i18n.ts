// src/types/i18n.ts

export type Language = "fr" | "skt" | "lin" | "swa" | "tsh";

export interface TranslatedText {
  fr: string;
  skt?: string;
  lin?: string;
  swa?: string;
  tsh?: string;
}

export interface ArticleData {
  slug: string;
  title: TranslatedText;
  category: "langue" | "culture" | "spiritualite" | "histoire";
  summary: TranslatedText;
  content: TranslatedText;
  image?: string;
  videoBackground?: string;
}

export type Dictionary = Record<string, any>;
