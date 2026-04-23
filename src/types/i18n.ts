// src/types/i18n.ts

export type Language = "en" | "fr" | "skt" | "lin" | "swa" | "tsh";

export interface TranslatedText {
  en?: string;
  fr: string;
  skt?: string;
  lin?: string;
  swa?: string;
  tsh?: string;
}

export interface ContentBlock {
  id: string;
  type: "text" | "image" | "quote" | "heading";
  body?: string;
  url?: string;
  caption?: string;
  alignment?: "full" | "left" | "right" | "sidebar";
  level?: 1 | 2 | 3;
}

export type StructuredContent = {
  [key in Language]?: ContentBlock[];
};

/**
 * ============================================
 * DISTINCTION ARTICLE vs LIVRE (BOOK)
 * ============================================
 *
 * Dans Kisakata, chaque contenu de savoir suit une hiérarchie :
 *
 * 1. ARTICLE (ArticleMetadata)
 *    - Utilisé pour l'indexation, la navigation, les listes
 *    - Contient : slug, title, category, summary, image
 *    - "Summary" = résumé court (100-200 mots) destiné aux listings
 *    - Exemple : Vue d'accueil /savoir, cartes de contenu, recherche
 *
 * 2. LIVRE / BOOK (BookContent)
 *    - Utilisé pour la lecture profonde et l'indexation sémantique
 *    - Le champ "content" du ArticleData
 *    - "Content" = texte complet et détaillé (2000+ mots)
 *    - Poétique, narratif, richement contextualisé
 *    - Destiné à Pinecone (namespace iluo_livres)
 *    - Exemple : Page complète /savoir/[slug]
 *
 * RÈGLE PINECONE :
 * - Indexer UNIQUEMENT le champ .content (livres)
 * - N'indexer JAMAIS le champ .summary (articles)
 * - Les requêtes sémantiques doivent retourner la profondeur du livre,
 *   pas la superficialité du résumé
 *
 * EXEMPLE D'ILUO :
 * - ARTICLE : "L'Iluo est le double spirituel du peuple Sakata."
 * - LIVRE   : [2500 mots détaillant cosmologie, initiation, pouvoir,
 *             exemples historiques, poésie, rituels associés]
 */

/**
 * ArticleData — Structure complète d'un contenu de savoir
 * Utilisée pour stocker ET servir articles ET livres
 */
export interface ArticleData {
  id?: string;
  slug: string;
  title: TranslatedText;
  category: "langue" | "culture" | "spiritualite" | "histoire";

  /** ARTICLE : résumé court (100-200 mots) pour listings/navigations */
  summary: TranslatedText;

  /** LIVRE : contenu complet et détaillé (2000+ mots) pour lecture profonde */
  content: TranslatedText | StructuredContent;

  /** Métadonnées d'affichage */
  image?: string;
  video_background?: string;
  featured_image?: string;
  
  /** Narration et Stats */
  has_narrator?: boolean;
  date?: string;
  likes_count?: number;
  reads_count?: number;
  is_premium?: boolean;
  created_at?: string;
  narrator_extension?: string;
}

/**
 * BookContent — Alias pour clarifier qu'on accède à la partie "livre" d'un article
 * Utilisé surtout dans les requêtes Pinecone et indexation profonde
 */
export type BookContent = TranslatedText;

/**
 * ArticleMetadata — Alias pour clarifier qu'on accède à la partie "article" d'une ressource
 * Utilisé pour les listings, navigations, et résumés
 */
export interface ArticleMetadata {
  slug: string;
  title: TranslatedText;
  category: "langue" | "culture" | "spiritualite" | "histoire";
  summary: TranslatedText;
  image?: string;
  video_background?: string;
  narrator_extension?: string;
}

export type Dictionary = Record<string, unknown>;
