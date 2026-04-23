---
name: documentaliste-culturel
description: Rigueur documentaire pour structurer le savoir ethnographique du peuple Sakata. Impose des normes de sourcing, de taxonomie culturelle, de translittération, et de gestion des variantes dialectales pour garantir la fiabilité académique du contenu.
---

# Documentaliste Culturel — Skill de Rigueur Ethnographique

## 1. SYSTÈME DE CITATIONS & SOURCES

### Catégories de Sources :
Chaque information publiée sur Kisakata.com DOIT être rattachée à une catégorie de source :

| Catégorie | Format de Citation | Exemple |
|---|---|---|
| **Tradition orale** | `[Oral] Nom du conteur, village, année approximative` | `[Oral] Mama Mboyo, Inongo, ~1975` |
| **Source écrite** | `[Écrit] Auteur, Titre, Éditeur, Année` | `[Écrit] Vansina, J., "Les anciens royaumes de la savane", IRES, 1965` |
| **Terrain** | `[Terrain] Enquêteur, lieu, date` | `[Terrain] Fortuné M., Kutu, Mars 2024` |
| **Archive coloniale** | `[Archive] Institution, référence, année` | `[Archive] MRAC Tervuren, Fonds Torday, 1907` |
| **Communauté** | `[Communauté] Pseudo, forum/groupe, date` | `[Communauté] @MbokaYa, Forum Kisakata, 04/2026` |

### Règles :
- Tout contenu SANS source est marqué `[À vérifier]` et affiché avec un indicateur visuel
- Les sources orales sont considérées LÉGITIMES et de première importance (pas de hiérarchie académique)
- Les contradictions entre sources sont DOCUMENTÉES, pas effacées (mentionner les deux versions)
- **Vérification Mboka :** Les discussions sur le forum peuvent servir de source `[Communauté]` après validation par un `mokambi` (ancien) ou par consensus de plusieurs membres `premium`.

## 2. TAXONOMIE CULTURELLE

### Structure hiérarchique obligatoire :

```
Savoir Sakata
├── Langue (Kisakata)
│   ├── Phonétique & Alphabet
│   ├── Grammaire
│   │   ├── Noms & Classes nominales
│   │   ├── Verbes & Conjugaisons
│   │   └── Syntaxe
│   ├── Dictionnaire
│   │   ├── A-K
│   │   └── L-Z
│   └── Littérature orale
│       ├── Contes (Masango)
│       ├── Proverbes (Nkundi)
│       └── Chants
├── Histoire
│   ├── Origines & Migrations
│   ├── Royaume du Mai-Ndombe
│   ├── Période coloniale
│   └── Ère moderne
├── Culture
│   ├── Danses & Musique
│   ├── Artisanat
│   ├── Cuisine & Alimentation
│   └── Rites de passage
└── Spiritualité
    ├── Cosmogonie
    ├── Médecine traditionnelle
    ├── Rites & Cérémonies
    └── Symbolisme (animaux, plantes, eaux)
```

### Règles de taxonomie :
- Chaque article DOIT être rattaché à au moins UNE branche de la taxonomie
- Les articles multi-thématiques sont autorisés (tags multiples)
- Toute nouvelle branche DOIT être approuvée par un membre de la communauté

## 3. TRANSLITTÉRATION DU KISAKATA

### Alphabet utilisé (Latin étendu) :
Les sons spécifiques du Kisakata sont transcrits selon les conventions bantoues :

| Son | Transcription | Exemple |
|---|---|---|
| Son nasal vélaire | `ŋ` ou `ng'` | `ŋgudi` (mère) |
| Voyelle ouverte | `ɛ` ou `è` | `bèlè` (apporter) |
| Voyelle fermée | `ɔ` ou `ò` | `mòto` (personne) |
| Consonne implosive | `ɓ` ou `b'` | `ɓato` (gens) |
| Ton haut | accent aigu `é` | `mbóka` (village) |
| Ton bas | accent grave `è` | `mbòka` (autre sens) |

### Règles :
- Chaque mot en Kisakata est suivi de sa traduction entre parenthèses : `mboka (village)`
- Les tons sont optionnels dans le corps du texte mais OBLIGATOIRES dans le dictionnaire
- La forme de base (infinitif pour les verbes, singulier pour les noms) est utilisée en entrée de dictionnaire

## 4. GESTION DES VARIANTES DIALECTALES

Le Kisakata présente des variations selon les zones géographiques :

| Zone | Sous-dialecte | Particularités |
|---|---|---|
| Inongo (Centre) | Kisakata standard | Forme de référence |
| Kutu (Sud) | Kisakata-Kutu | Variations tonales, vocabulaire agricole spécifique |
| Oshwe (Nord) | Kisakata-Oshwe | Influence du Ntomba, certains emprunts |
| Diaspora | Kisakata urbain | Emprunts au Lingala et au Français |
| OSINT / Digital | Recherche Numérique | Forums Facebook (Sakata, Basakata, Kisakata), validation communautaire |

### Règles :
- La forme d'Inongo est la référence par défaut
- Les variantes dialectales sont signalées par une étiquette : `[Kutu]`, `[Oshwe]`, `[Urbain]`
- Aucune variante n'est considérée comme "incorrecte" — toutes sont documentées

## 5. RECHERCHE NUMÉRIQUE DE TERRAIN (Nouveau)
La recherche sur les réseaux sociaux (Facebook, forums) est une extension du terrain :
- Utiliser `playwright` pour extraire les témoignages et débats culturels.
- Recouper les témoignages de plusieurs membres avant inclusion.
- Citer comme `[Communauté]`.

## 5. FORMAT DES ARTICLES DE SAVOIR

Chaque article publié sur Kisakata.com DOIT suivre cette structure :

```markdown
# [Titre de l'article]

> [Proverbe ou conte introductif en Kisakata]
> — [Traduction française]

## Résumé
[2-3 lignes résumant le contenu, optimisées pour le SEO et l'AEO]

## Contenu principal
[Corps de l'article avec sous-sections <h3>]

## Sources
[Liste des citations selon le système défini en Section 1]

## Mots-clés
[Tags taxonomiques : Langue > Grammaire > Verbes]
```

## 6. ANTI-PATTERNS DOCUMENTAIRES (INTERDIT)

- JAMAIS de contenu sans catégorisation taxonomique
- JAMAIS d'affirmation culturelle présentée comme "universelle" (toujours contextualiser)
- JAMAIS de translittération sans explication phonétique
- JAMAIS de source coloniale présentée sans recul critique
- JAMAIS de contenu copié d'un autre site sans vérification et reformulation
- JAMAIS de simplification excessive des croyances spirituelles (respecter la complexité)

## 7. REPRÉSENTATION VISUELLE ROBUSTE
Chaque membre ou contributeur doit être représenté avec dignité.
- **MemberImage** : Utiliser systématiquement le composant `MemberImage` pour garantir que chaque visage (même en l'absence d'avatar) est rendu avec harmonie (fallbacks, initiales, design 1px).
- **Crédits visuels** : Les photos issues de recherches (Facebook, Archives) doivent porter une mention de copyright ou de source `[Media]`.

## 8. ÉDITION STRUCTURÉE & MÉDIA (V3)
L'article n'est plus un simple bloc de texte Markdown. Il est désormais composé de **blocs structurels** (`ContentBlock`) :
- **Bloc Texte :** Contenu rédactionnel principal.
- **Bloc Image :** Intégration visuelle avec gestion de l'alignement (`full`, `left`, `right`).
- **Bloc Citation :** Mise en exergue des paroles d'anciens ou proverbes.
- **Bloc Titre :** Structure hiérarchique (H2, H3).

### Règles de mise en page :
- **Insertion Médias :** Privilégier l'insertion d'images entre les paragraphes pour illustrer des concepts spécifiques.
- **Alignement :** Utiliser `full` pour les paysages ou cartes, et `left/right` pour les portraits ou illustrations secondaires.
- **Migration :** Les anciens articles Markdown sont supportés, mais toute nouvelle contribution de haute qualité DOIT utiliser l'éditeur par blocs.
