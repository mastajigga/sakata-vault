---
name: seo-geo-expert
description: Expert SEO technique et sémantique optimisé pour Google et les moteurs IA (Perplexity, Gemini), avec ciblage géographique précis sur la RDC, la diaspora congolaise, et l'audience francophone européenne (France, Belgique).
---

# SEO & GEO Expert Skill — Kisakata.com

## 1. SÉMANTIQUE HTML5 (OBLIGATOIRE)

Chaque page DOIT utiliser une structure sémantique stricte :
- `<article>` pour tout contenu autonome (articles de savoir, contes, biographies)
- `<section>` pour les regroupements thématiques avec un `<h2>` obligatoire
- `<aside>` pour les contenus connexes (liens vers d'autres articles, lexiques)
- `<nav>` pour la navigation principale ET les fil d'Ariane
- `<time datetime="ISO8601">` pour toute mention de date ou de période historique
- `<figure>` + `<figcaption>` pour toute image, vidéo ou illustration
- **Hiérarchie stricte** : un seul `<h1>` par page, puis `<h2>` > `<h3>` > `<h4>` sans saut

## 2. JSON-LD & SCHEMA.ORG

### Chaque page DOIT inclure :
- `WebSite` sur la page d'accueil (avec `potentialAction.SearchAction`)
- `Organization` (Kisakata.com, type `EducationalOrganization`)
- `BreadcrumbList` sur toute page avec une profondeur > 1

### Schémas spécifiques par type de contenu :
- **Articles de savoir** : `Article` avec `author`, `datePublished`, `articleSection`
- **Contes audio** : `AudioObject` avec `duration`, `inLanguage: "sak"` (code ISO 639-3 du Kisakata)
- **Événements culturels** : `Event` avec `location.address` (Mai-Ndombe, Inongo)
- **Lieux historiques** : `Place` avec `geo` (latitude/longitude du Mai-Ndombe)
- **Forums** : `DiscussionForumPosting` avec `author` et `dateCreated`

## 3. INTERNATIONALISATION SEO

- **Langue principale** : Français (`fr`)
- **Langues secondaires** : Kisakata (`sak`), Lingala (`ln`), Anglais (`en`)
- Balises `hreflang` sur chaque page multilingue
- URLs propres : `/fr/savoir/langue`, `/sak/savoir/langue`
- Attribut `lang` correct sur chaque bloc de texte en langue différente

## 4. GEO-TARGETING

### Audience Prioritaire :
1. **Mai-Ndombe, RDC** : Inongo, Kutu, Bandundu (population locale)
2. **Kinshasa, RDC** : Diaspora urbaine congolaise
3. **Bruxelles, Belgique** : Communauté congolaise de Belgique
4. **Paris/Île-de-France** : Communauté congolaise de France
5. **Mondial** : Chercheurs, ethnologues, passionnés de cultures bantoues

### Optimisations :
- **Google Business Profile** : Rattacher le site à la région du Mai-Ndombe
- **Contenu localisé** : Mentionner explicitement les villes et régions cibles dans les méta-descriptions
- **Timezone** : Toutes les dates affichées en `Africa/Kinshasa` (UTC+1) avec conversion locale

## 5. AEO (AI ENGINE OPTIMIZATION)

Pour que les moteurs de réponse IA (Perplexity, Gemini, ChatGPT) extraient correctement nos contenus :
- **Résumé factuel** en haut de chaque article (2-3 lignes, données brutes)
- **Structure Q&A** : Utiliser des sous-titres sous forme de questions ("Qui sont les Basakata ?")
- **FAQ structurée** : Schéma `FAQPage` sur les pages de savoir les plus consultées
- **Données citables** : Chiffres, dates, noms propres clairement balisés

## 6. CORE WEB VITALS

### Règles de Performance SEO :
- **LCP (Largest Contentful Paint)** : La vidéo du Hero DOIT être lazy-loaded avec `poster` image
- **CLS (Cumulative Layout Shift)** : Toutes les images/vidéos DOIVENT avoir `width` et `height` explicites
- **INP (Interaction to Next Paint)** : Les handlers d'événements DOIVENT être légers (< 200ms)
- **FID (First Input Delay)** : Les scripts tiers (analytics) DOIVENT être `async` ou `defer`

## 7. CONFORMITÉ RGPD

Pour l'audience européenne (Belgique, France) :
- **Bandeau de cookies** : Consentement explicite avant tout tracking
- **Politique de confidentialité** : Page dédiée, rédigée en français
- **Droit à l'effacement** : Fonctionnalité de suppression de compte utilisateur
- **Stockage des données** : Supabase hébergé en Europe (`eu-central-1`)

## 8. ANTI-PATTERNS SEO (INTERDIT)

- JAMAIS de contenu dupliqué entre pages
- JAMAIS de balises `<title>` identiques sur deux pages
- JAMAIS de méta-description > 160 caractères
- JAMAIS d'images sans attribut `alt`
- JAMAIS de liens cassés (vérification avant déploiement)
- JAMAIS d'URLs avec paramètres (#, ?, &) pour le contenu indexable
