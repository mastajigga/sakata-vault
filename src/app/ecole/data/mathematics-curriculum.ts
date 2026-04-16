export interface KnowledgeRiver {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  highlight: string;
}

export interface TheoryBlock {
  title: string;
  explanation: string;
  formula?: string;
  example?: string;
}

export interface ExerciseChoice {
  label: string;
  value: string;
}

export interface GuidedExercise {
  id: string;
  title: string;
  context: string;
  prompt: string;
  answerType: "math-input" | "choice";
  expectedAnswer: string | string[];
  equation?: string;
  hintSteps: string[];
  solutionSteps: string[];
  challenge: string;
  choices?: ExerciseChoice[];
}

export interface Visualization {
  type: "balance" | "venn" | "function-plot" | "system" | "angle-triangle" | "proportion" | "parabola" | "pythagorean-squares" | "statistics-bars" | "pie-chart" | "number-line" | "place-value-grid" | "area-rectangle" | "fraction-circle" | "timeline" | "counting-beads" | "number-bonds" | "coin-counter" | "ruler-measure" | "multiplication-grid" | "fraction-bar" | "decimal-grid" | "bar-model" | "shape-explorer" | "clock-face" | "equation-steps" | "number-sets" | "coordinate-plane" | "slope-explorer" | "discriminant-viz" | "angle-measurer" | "histogram" | "scatter-plot" | "algebraic-tiles" | "truth-table" | "none";
  title: string;
  description?: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  subtitle: string;
  exerciseIds: string[];
  sakataContext: string;
  visualizations?: Visualization[];
  theoryBlocks?: TheoryBlock[];
}

export interface MathematicsProgramYear {
  slug: string;
  title: string;
  degree: string;
  focus: string;
  overview: string;
  learningObjectives: string[];
  localContexts: string[];
  theoryBlocks: TheoryBlock[];
  exercises: GuidedExercise[];
  courseSlug?: string;
  courseChapters?: CourseChapter[];
}

export const knowledgeRivers: KnowledgeRiver[] = [
  {
    slug: "langue",
    title: "La Langue Kisakata",
    subtitle: "Notre voix ancestrale",
    summary:
      "Lecture, oralité, proverbes, tournures du quotidien et mémoire des anciens pour que la langue soit parlée avec précision et tendresse.",
    highlight: "Voix, écoute, récitation, collecte de vocabulaire.",
  },
  {
    slug: "mathematiques",
    title: "Mathématiques – Brilliant Basakata",
    subtitle: "La rivière maîtresse",
    summary:
      "Une progression guidée, interactive et locale, pensée comme un atelier vivant où l'enfant manipule des pirogues, des paniers, des nasses et des étals.",
    highlight: "Objectifs officiels, théorie guidée, feedback instantané.",
  },
  {
    slug: "histoire",
    title: "Histoire Précoloniale",
    subtitle: "Mémoire du peuple Sakata",
    summary:
      "Chefferies, migrations, gestes rituels et transmission orale pour replacer chaque savoir scolaire dans la continuité de la mémoire Sakata.",
    highlight: "Chronologies, territoires, récits fondateurs.",
  },
];

export const mathematicsPrograms: MathematicsProgramYear[] = [
  {
    slug: "1ere-annee",
    title: "1ère année",
    degree: "Degré élémentaire",
    focus: "Compter, rassembler, retirer",
    overview:
      "L'enfant découvre les nombres, les petites additions, les petites soustractions et les formes simples à partir d'objets du quotidien.",
    learningObjectives: [
      "Lire, écrire et comparer les nombres jusqu'à 20.",
      "Réaliser des additions et des soustractions très simples en manipulant des collections.",
      "Reconnaître les formes usuelles dans l'environnement : rond, triangle, carré, rectangle.",
      "Résoudre de petits problèmes oraux liés à la vie familiale et au marché.",
    ],
    localContexts: ["graines de palme", "pirogues", "poissons du lac", "paniers tressés"],
    theoryBlocks: [
      {
        title: "Compter une collection sans se tromper",
        explanation:
          "On pointe chaque objet une seule fois. Le dernier nombre prononcé donne la quantité totale. Compter, c'est faire correspondre une parole et une chose.",
        formula: "1, 2, 3, 4, 5",
        example: "Quatre poissons alignés donnent la quantité 4.",
      },
      {
        title: "L'addition rassemble",
        explanation:
          "Quand deux groupes se rejoignent, on additionne. On peut imaginer deux pirogues d'un côté et trois pirogues de l'autre qui accostent ensemble.",
        formula: "2 + 3 = 5",
        example: "Deux paniers et encore trois paniers forment cinq paniers.",
      },
      {
        title: "La soustraction retire ou sépare",
        explanation:
          "Quand une partie s'en va, on soustrait. Le résultat dit combien il reste. On le voit bien lorsqu'un pêcheur vend une partie de sa prise.",
        formula: "7 - 2 = 5",
        example: "Sept poissons au départ, deux vendus, il en reste cinq.",
      },
    ],
    exercises: [
      {
        id: "1a-pirogues",
        title: "Compter les pirogues",
        context: "Trois pirogues sont déjà au rivage. Deux autres arrivent depuis la Lukenie.",
        prompt: "Combien de pirogues sont maintenant au rivage ?",
        answerType: "math-input",
        expectedAnswer: "5",
        equation: "3 + 2 = ?",
        hintSteps: [
          "Commence avec les 3 pirogues déjà là.",
          "Ajoute encore 2 pirogues, une par une.",
          "Compte le total final.",
        ],
        solutionSteps: [
          "Il y a d'abord 3 pirogues.",
          "On en ajoute 2 : 3 puis 4 puis 5.",
          "Le total est donc 5 pirogues.",
        ],
        challenge: "Explique à voix haute comment tu as compté.",
      },
      {
        id: "1a-marche",
        title: "Le petit marché",
        context: "Maman apporte 8 poissons fumés au marché. Elle en vend 3 le matin.",
        prompt: "Combien de poissons fumés lui reste-t-il ?",
        answerType: "math-input",
        expectedAnswer: "5",
        equation: "8 - 3 = ?",
        hintSteps: [
          "Pars de 8 poissons.",
          "Retire 3 poissons un à un.",
          "Compte ce qui reste.",
        ],
        solutionSteps: [
          "Au départ il y a 8 poissons.",
          "Après en avoir retiré 3, on obtient 7, puis 6, puis 5.",
          "Il reste 5 poissons fumés.",
        ],
        challenge: "Trouve une autre histoire du village qui donne aussi 8 - 3.",
      },
      {
        id: "1a-panier",
        title: "La forme du panier",
        context: "Le panier de raphia vu de dessus a quatre côtés égaux.",
        prompt: "Quelle forme reconnais-tu ?",
        answerType: "choice",
        expectedAnswer: "carre",
        hintSteps: [
          "Compte les côtés de la forme.",
          "Tous les côtés ont la même longueur.",
          "Cette forme a aussi quatre coins.",
        ],
        solutionSteps: [
          "Un carré a quatre côtés égaux.",
          "Le panier vu de dessus possède cette propriété.",
          "La bonne réponse est donc le carré.",
        ],
        challenge: "Cherche dans la maison un autre objet qui ressemble à un carré.",
        choices: [
          { label: "Cercle", value: "cercle" },
          { label: "Carré", value: "carre" },
          { label: "Triangle", value: "triangle" },
        ],
      },
      {
        id: "1a-filets",
        title: "Le défi des filets",
        context: "Deux enfants portent 4 filets. Leur oncle leur en confie encore 4.",
        prompt: "Combien de filets portent-ils maintenant ?",
        answerType: "math-input",
        expectedAnswer: "8",
        equation: "4 + 4 = ?",
        hintSteps: [
          "Compter 4 filets d'abord.",
          "Ajouter encore 4 filets.",
          "Tu peux compter sur tes doigts pour aller jusqu'à 8.",
        ],
        solutionSteps: [
          "On part de 4 filets.",
          "On ajoute 4 autres : 5, 6, 7, 8.",
          "Ils portent maintenant 8 filets.",
        ],
        challenge: "Essaie de raconter la réponse avec des cailloux ou des graines.",
      },
    ],
  },
  {
    slug: "2e-annee",
    title: "2e année",
    degree: "Degré élémentaire",
    focus: "Nombres jusqu'à 100, échanges, mesures proches",
    overview:
      "La deuxième année consolide le calcul mental, la lecture des nombres jusqu'à 100 et les premiers problèmes avec monnaie, temps et longueurs.",
    learningObjectives: [
      "Lire, écrire et comparer les nombres jusqu'à 100.",
      "Additionner et soustraire avec retenue simple dans des situations concrètes.",
      "Utiliser les pièces, les jours et les mesures usuelles du quotidien.",
      "Décrire et reproduire des suites simples et des regroupements par dizaines.",
    ],
    localContexts: ["étal du marché", "mesure de tissu", "jours de traversée", "régimes de bananes"],
    theoryBlocks: [
      {
        title: "Regrouper par dizaines",
        explanation:
          "Dix unités peuvent être réunies pour former une dizaine. Regrouper aide à compter plus vite et à comprendre les échanges.",
        formula: "10 \\text{ unités} = 1 \\text{ dizaine}",
        example: "23 signifie 2 dizaines et 3 unités.",
      },
      {
        title: "Additionner avec passage à la dizaine",
        explanation:
          "Quand les unités dépassent 9, on échange 10 unités contre 1 dizaine. Cela rend le calcul plus ordonné.",
        formula: "28 + 7 = 35",
        example: "8 unités plus 7 unités font 15 unités, soit 1 dizaine et 5 unités.",
      },
      {
        title: "Soustraire avec échange",
        explanation:
          "Quand les unités du nombre du bas dépassent celles du nombre du haut, on échange 1 dizaine contre 10 unités avant de soustraire.",
        formula: "45 - 18 = 27",
        example: "De 45, on ne peut pas enlever 8 unités directement depuis 5, donc on emprunte 1 dizaine.",
      },
    ],
    exercises: [
      {
        id: "2a-bananes",
        title: "Régimes sur la pirogue",
        context: "Une pirogue transporte 28 régimes de bananes. On en charge 7 de plus.",
        prompt: "Quel est le nouveau total ?",
        answerType: "math-input",
        expectedAnswer: "35",
        equation: "28 + 7 = ?",
        hintSteps: [
          "Ajoute les unités d'abord : 8 + 7.",
          "15 unités, c'est 1 dizaine et 5 unités.",
          "Ajoute cette dizaine aux 2 dizaines déjà présentes.",
        ],
        solutionSteps: [
          "28 = 2 dizaines et 8 unités.",
          "8 + 7 = 15 unités, soit 1 dizaine et 5 unités.",
          "2 dizaines + 1 dizaine = 3 dizaines, il reste 5 unités, donc 35.",
        ],
        challenge: "Rejoue le calcul avec des bâtonnets regroupés par 10.",
      },
      {
        id: "2a-marche-soustraction",
        title: "Retour du marché",
        context: "Grand-père part avec 63 francs. Il dépense 24 francs pour du sel et de l'huile.",
        prompt: "Combien de francs lui reste-t-il ?",
        answerType: "math-input",
        expectedAnswer: "39",
        equation: "63 - 24 = ?",
        hintSteps: [
          "Commence par les unités : 3 - 4 est impossible directement.",
          "Emprunte 1 dizaine à la colonne des dizaines : 13 - 4 = 9.",
          "Dans les dizaines, il reste 5 dizaines, moins 2 dizaines = 3 dizaines.",
        ],
        solutionSteps: [
          "Unités : 3 est plus petit que 4, on emprunte 1 dizaine.",
          "13 - 4 = 9 unités.",
          "Dizaines : (6 - 1) - 2 = 3 dizaines.",
          "Résultat : 39 francs.",
        ],
        challenge: "Vérifie en additionnant : 24 + 39 doit redonner 63.",
      },
      {
        id: "2a-tissu",
        title: "Le tissu de la fête",
        context: "La tisserande dispose de 46 cm de raphia. Elle en utilise 19 cm pour un bracelet.",
        prompt: "Combien de centimètres lui reste-t-il ?",
        answerType: "math-input",
        expectedAnswer: "27",
        equation: "46 - 19 = ?",
        hintSteps: [
          "On soustrait d'abord les unités.",
          "6 - 9 est impossible : on emprunte 1 dizaine.",
          "16 - 9 = 7, et les dizaines : 3 - 1 = 2.",
        ],
        solutionSteps: [
          "Unités : 6 - 9 impossible, on emprunte 1 dizaine : 16 - 9 = 7.",
          "Dizaines : (4 - 1) - 1 = 2.",
          "Il reste 27 cm de raphia.",
        ],
        challenge: "Combien de bracelets de 19 cm peut-elle faire avec 46 cm ?",
      },
      {
        id: "2a-jours",
        title: "Les jours de traversée",
        context: "Un pêcheur navigue 30 jours sur la Lukenie puis encore 20 jours sur un affluent.",
        prompt: "Combien de jours a-t-il voyagé en tout ?",
        answerType: "math-input",
        expectedAnswer: "50",
        equation: "30 + 20 = ?",
        hintSteps: [
          "On additionne des dizaines entières.",
          "3 dizaines plus 2 dizaines.",
          "Cela fait 5 dizaines, soit 50.",
        ],
        solutionSteps: [
          "30 = 3 dizaines, 20 = 2 dizaines.",
          "3 dizaines + 2 dizaines = 5 dizaines.",
          "Le pêcheur a voyagé 50 jours.",
        ],
        challenge: "Combien de semaines cela représente-t-il (1 semaine = 7 jours) ?",
      },
    ],
  },
  {
    slug: "3e-annee",
    title: "3e année",
    degree: "Degré moyen",
    focus: "Multiplication, partage, repérage",
    overview:
      "La troisième année introduit les tables, les partages égaux et des problèmes plus longs où l'enfant choisit lui-même l'opération utile.",
    learningObjectives: [
      "Maîtriser les premières tables de multiplication et les partages simples.",
      "Lire et écrire les nombres jusqu'à 1 000.",
      "Résoudre des problèmes à une ou deux étapes autour de la vie du village.",
      "Repérer des segments, des angles simples et des figures dans des objets fabriqués.",
    ],
    localContexts: ["nasses", "rangées de poissons séchés", "nattes", "trajets entre villages"],
    theoryBlocks: [
      {
        title: "Multiplier, c'est additionner plusieurs fois le même groupe",
        explanation:
          "Trois rangées de quatre poissons séchés peuvent se lire 4 + 4 + 4 ou 3 × 4. La multiplication raccourcit l'écriture.",
        formula: "3 \\times 4 = 12",
        example: "Trois nattes avec quatre motifs chacune donnent douze motifs.",
      },
      {
        title: "Partager sans reste",
        explanation:
          "Diviser consiste à répartir équitablement. On vérifie ensuite la réponse avec la multiplication.",
        formula: "12 \\div 3 = 4",
        example: "Douze mangues partagées entre trois enfants donnent quatre mangues chacun.",
      },
      {
        title: "Les nombres jusqu'à 1 000",
        explanation:
          "Dix dizaines forment une centaine. Un nombre à trois chiffres se lit en centaines, dizaines et unités.",
        formula: "347 = 3 \\times 100 + 4 \\times 10 + 7",
        example: "347 sacs : 3 centaines, 4 dizaines et 7 sacs.",
      },
    ],
    exercises: [
      {
        id: "3a-nasses",
        title: "Rangées de nasses",
        context: "Le chef du débarcadère pose 4 rangées de 3 nasses pour les faire sécher.",
        prompt: "Combien de nasses y a-t-il en tout ?",
        answerType: "math-input",
        expectedAnswer: ["12", "4x3", "3x4"],
        equation: "4 \\times 3 = ?",
        hintSteps: [
          "Compter 3 nasses dans une rangée.",
          "Comme il y a 4 rangées identiques, on répète 3 quatre fois.",
          "3 + 3 + 3 + 3 = 12.",
        ],
        solutionSteps: [
          "Une rangée contient 3 nasses.",
          "Quatre rangées donnent 3 + 3 + 3 + 3 = 12.",
          "On peut écrire cela 4 × 3 = 12.",
        ],
        challenge: "Retrouve la même réponse avec l'addition répétée.",
      },
      {
        id: "3a-mangues",
        title: "Partage des mangues",
        context: "La grand-mère rapporte 15 mangues du jardin. Elle les partage également entre 3 enfants.",
        prompt: "Combien de mangues chaque enfant reçoit-il ?",
        answerType: "math-input",
        expectedAnswer: "5",
        equation: "15 \\div 3 = ?",
        hintSteps: [
          "On cherche combien de fois 3 entre dans 15.",
          "Essaie : 3 × 4 = 12, 3 × 5 = 15.",
          "Quand le produit est 15, le quotient est 5.",
        ],
        solutionSteps: [
          "On divise 15 en 3 groupes égaux.",
          "15 ÷ 3 = 5.",
          "Chaque enfant reçoit 5 mangues.",
        ],
        challenge: "Vérifie en multipliant : 3 × 5 = 15.",
      },
      {
        id: "3a-poissons",
        title: "Les poissons séchés",
        context: "Un pêcheur étale 7 rangées de 6 poissons séchés sur ses claies.",
        prompt: "Combien de poissons a-t-il étalés en tout ?",
        answerType: "math-input",
        expectedAnswer: ["42", "7x6", "6x7"],
        equation: "7 \\times 6 = ?",
        hintSteps: [
          "Chaque rangée contient 6 poissons.",
          "Il y a 7 rangées.",
          "Utilise la table de 6 : 6, 12, 18, 24, 30, 36, 42.",
        ],
        solutionSteps: [
          "7 rangées de 6 poissons chacune.",
          "7 × 6 = 42.",
          "Le pêcheur a étalé 42 poissons.",
        ],
        challenge: "Compare avec 6 rangées de 7 : est-ce le même résultat ?",
      },
      {
        id: "3a-trajet",
        title: "Trajet entre les villages",
        context: "La distance entre deux villages est de 240 km. Le voyage se fait en 3 étapes égales.",
        prompt: "Quelle est la longueur de chaque étape ?",
        answerType: "math-input",
        expectedAnswer: "80",
        equation: "240 \\div 3 = ?",
        hintSteps: [
          "On partage 240 en 3 parts égales.",
          "Combien de fois 3 entre dans 24 ? → 8 fois.",
          "Donc 240 ÷ 3 = 80.",
        ],
        solutionSteps: [
          "240 ÷ 3 : on peut écrire 240 = 3 × 80.",
          "En vérifiant : 3 × 80 = 240. Correct.",
          "Chaque étape est longue de 80 km.",
        ],
        challenge: "Si on faisait 4 étapes, combien mesurerait chacune ?",
      },
    ],
  },
  {
    slug: "4e-annee",
    title: "4e année",
    degree: "Degré moyen",
    focus: "Fractions usuelles, périmètres, problèmes composés",
    overview:
      "À ce niveau, l'élève commence à organiser plusieurs étapes de raisonnement, découvre les fractions simples et mesure davantage l'espace.",
    learningObjectives: [
      "Utiliser les quatre opérations sur des nombres entiers plus grands.",
      "Reconnaître et nommer les fractions usuelles : demi, tiers, quart.",
      "Calculer des périmètres simples et comparer des longueurs.",
      "Résoudre des problèmes à plusieurs étapes liés aux échanges et aux déplacements.",
    ],
    localContexts: ["parcelles de manioc", "cordes", "paniers partagés", "débarcadères"],
    theoryBlocks: [
      {
        title: "La fraction décrit une part d'un tout",
        explanation:
          "Quand un panier de manioc est partagé en 4 parts égales, chaque part vaut un quart du panier.",
        formula: "\\frac{1}{4}",
        example: "Deux quarts réunis forment la moitié du panier.",
      },
      {
        title: "Le périmètre mesure le tour complet",
        explanation:
          "Pour connaître le périmètre, on additionne toutes les longueurs du contour, comme si l'on faisait le tour d'un enclos.",
        formula: "P = a + b + c + d",
        example: "Un rectangle de 6 m et 4 m a un périmètre de 20 m.",
      },
      {
        title: "Résoudre un problème en plusieurs étapes",
        explanation:
          "Certains problèmes demandent deux opérations : d'abord on trouve une donnée intermédiaire, ensuite on l'utilise pour répondre à la question finale.",
        formula: "\\text{étape 1} \\rightarrow \\text{étape 2} \\rightarrow \\text{réponse}",
        example: "On calcule d'abord le total des sacs, puis on en déduit ce qu'il faut payer.",
      },
    ],
    exercises: [
      {
        id: "4a-enclos",
        title: "Le tour de l'enclos",
        context: "Un petit enclos a deux côtés de 6 m et deux côtés de 4 m.",
        prompt: "Quel est son périmètre ?",
        answerType: "math-input",
        expectedAnswer: "20",
        equation: "6 + 4 + 6 + 4 = ?",
        hintSteps: [
          "Le périmètre, c'est tout le contour.",
          "Additionne les quatre côtés.",
          "Regroupe 6 + 6 puis 4 + 4.",
        ],
        solutionSteps: [
          "On additionne tous les côtés : 6 + 4 + 6 + 4.",
          "6 + 6 = 12 et 4 + 4 = 8.",
          "12 + 8 = 20. Le périmètre est de 20 m.",
        ],
        challenge: "Dessine un autre rectangle de même périmètre.",
      },
      {
        id: "4a-manioc-fraction",
        title: "Le panier de manioc",
        context: "Un grand panier contient 24 tubercules de manioc. On offre la moitié aux voisins.",
        prompt: "Combien de tubercules offre-t-on ?",
        answerType: "math-input",
        expectedAnswer: "12",
        equation: "\\frac{1}{2} \\text{ de } 24 = ?",
        hintSteps: [
          "La moitié, c'est diviser par 2.",
          "Combien font 24 ÷ 2 ?",
          "Pense : 2 × 12 = 24.",
        ],
        solutionSteps: [
          "La moitié de 24 se calcule en divisant par 2.",
          "24 ÷ 2 = 12.",
          "On offre 12 tubercules de manioc.",
        ],
        challenge: "Si on avait offert un quart, combien aurait-on donné ?",
      },
      {
        id: "4a-corde",
        title: "La corde du débarcadère",
        context: "Un pêcheur utilise une corde pour délimiter un triangle de séchage. Les côtés mesurent 5 m, 7 m et 8 m.",
        prompt: "Quelle longueur de corde lui faut-il ?",
        answerType: "math-input",
        expectedAnswer: "20",
        equation: "5 + 7 + 8 = ?",
        hintSteps: [
          "Le périmètre d'un triangle est la somme de ses trois côtés.",
          "Additionne 5 et 7 d'abord.",
          "Puis ajoute 8 au résultat.",
        ],
        solutionSteps: [
          "Périmètre = 5 + 7 + 8.",
          "5 + 7 = 12.",
          "12 + 8 = 20. Il faut 20 m de corde.",
        ],
        challenge: "Dessine ce triangle et vérifie avec une règle si les proportions semblent justes.",
      },
      {
        id: "4a-probleme-compose",
        title: "La récolte partagée",
        context: "Trois familles récoltent ensemble 96 kg de manioc. Chaque famille reçoit la même quantité, puis une famille donne 6 kg à ses voisins.",
        prompt: "Combien de kilogrammes cette famille garde-t-elle finalement ?",
        answerType: "math-input",
        expectedAnswer: "26",
        hintSteps: [
          "D'abord, calcule la part de chaque famille : 96 ÷ 3.",
          "Ensuite, retire les 6 kg donnés.",
          "32 - 6 = ?",
        ],
        solutionSteps: [
          "Étape 1 : 96 ÷ 3 = 32 kg par famille.",
          "Étape 2 : cette famille donne 6 kg.",
          "32 - 6 = 26 kg restants.",
        ],
        challenge: "Quelle fraction de sa part cette famille a-t-elle donnée ?",
      },
    ],
  },
  {
    slug: "5e-annee",
    title: "5e année",
    degree: "Degré terminal",
    focus: "Décimaux, aires, proportion simple",
    overview:
      "La cinquième année approfondit les mesures, introduit les nombres décimaux et fait entrer l'élève dans les calculs d'aires et de prix plus fins.",
    learningObjectives: [
      "Lire, comparer et utiliser les nombres décimaux dans des mesures et des achats.",
      "Calculer l'aire de rectangles simples et interpréter le résultat.",
      "Résoudre des problèmes de prix, de quantités et de proportion simple.",
      "Passer d'une écriture fractionnaire simple à une écriture décimale usuelle.",
    ],
    localContexts: ["mesure de terrain", "vente de poisson fumé", "sacs de sel", "étoffes"],
    theoryBlocks: [
      {
        title: "Le nombre décimal précise une mesure",
        explanation:
          "Les décimaux servent quand les unités ne suffisent plus. On peut parler de 3,5 m de tissu ou de 2,25 kg de sel.",
        formula: "3{,}5 = 3 + \\frac{5}{10}",
        example: "2,5 kg signifie 2 kg et un demi-kilo.",
      },
      {
        title: "L'aire mesure une surface",
        explanation:
          "Pour un rectangle, l'aire se calcule en multipliant la longueur par la largeur. Cela aide à comparer des parcelles.",
        formula: "A = L \\times l",
        example: "Une parcelle de 8 m sur 5 m a une aire de 40 m².",
      },
      {
        title: "La proportion simple",
        explanation:
          "Si une quantité double, son prix double aussi. On peut utiliser ce raisonnement pour résoudre beaucoup de problèmes de marché.",
        formula: "\\frac{p_1}{q_1} = \\frac{p_2}{q_2}",
        example: "Si 2 kg de sel coûtent 300 F, alors 4 kg coûtent 600 F.",
      },
    ],
    exercises: [
      {
        id: "5a-parcelle",
        title: "Parcelle de manioc",
        context: "Une petite parcelle rectangulaire mesure 8 m de long et 5 m de large.",
        prompt: "Quelle est son aire ?",
        answerType: "math-input",
        expectedAnswer: "40",
        equation: "8 \\times 5 = ?",
        hintSteps: [
          "L'aire d'un rectangle se calcule longueur × largeur.",
          "Ici, la longueur vaut 8 et la largeur 5.",
          "Effectue la multiplication.",
        ],
        solutionSteps: [
          "On applique la formule A = L × l.",
          "A = 8 × 5 = 40.",
          "L'aire de la parcelle est de 40 m².",
        ],
        challenge: "Compare avec une parcelle de 10 m sur 4 m.",
      },
      {
        id: "5a-sel",
        title: "Le prix du sel",
        context: "Au marché, 3 kg de sel coûtent 450 francs. Un acheteur veut 6 kg.",
        prompt: "Combien doit-il payer ?",
        answerType: "math-input",
        expectedAnswer: "900",
        hintSteps: [
          "Si 3 kg coûtent 450 F, combien coûte 1 kg ?",
          "1 kg = 450 ÷ 3 = 150 F.",
          "6 kg = 6 × 150 F.",
        ],
        solutionSteps: [
          "Prix de 1 kg : 450 ÷ 3 = 150 francs.",
          "Prix de 6 kg : 150 × 6 = 900 francs.",
          "L'acheteur doit payer 900 francs.",
        ],
        challenge: "Vérifie en utilisant la proportion : 450 / 3 = 900 / 6.",
      },
      {
        id: "5a-tissu",
        title: "Le tissu de la fête",
        context: "Une tisserande coupe 2,5 m de tissu pour un vêtement et encore 1,5 m pour un châle.",
        prompt: "Quelle longueur totale de tissu a-t-elle utilisée ?",
        answerType: "math-input",
        expectedAnswer: "4",
        equation: "2{,}5 + 1{,}5 = ?",
        hintSteps: [
          "Additionne les parties entières : 2 + 1 = 3.",
          "Additionne les parties décimales : 0,5 + 0,5 = 1,0.",
          "3 + 1 = 4.",
        ],
        solutionSteps: [
          "2,5 + 1,5 : on additionne colonne par colonne.",
          "Dixièmes : 5 + 5 = 10, on pose 0 et retient 1.",
          "Unités : 2 + 1 + 1 (retenue) = 4.",
          "Elle a utilisé 4 m de tissu.",
        ],
        challenge: "Si le tissu mesure 10 m au total, combien lui en reste-t-il ?",
      },
      {
        id: "5a-poisson",
        title: "La vente de poisson fumé",
        context: "Un pêcheur vend 12 poissons fumés à 75 francs chacun.",
        prompt: "Quel est le montant total de la vente ?",
        answerType: "math-input",
        expectedAnswer: "900",
        equation: "12 \\times 75 = ?",
        hintSteps: [
          "On peut décomposer : 12 × 75 = 12 × 70 + 12 × 5.",
          "12 × 70 = 840.",
          "12 × 5 = 60, et 840 + 60 = 900.",
        ],
        solutionSteps: [
          "12 × 75 = 12 × (70 + 5).",
          "12 × 70 = 840.",
          "12 × 5 = 60.",
          "840 + 60 = 900 francs.",
        ],
        challenge: "S'il garde 3 poissons pour sa famille, combien gagne-t-il ?",
      },
    ],
  },
  {
    slug: "6e-annee",
    title: "6e année",
    degree: "Degré terminal",
    focus: "Synthèse, pourcentages simples, raisonnement autonome",
    overview:
      "La sixième année prépare à l'entrée au secondaire avec des problèmes plus ouverts, la consolidation des fractions et des décimaux, et des raisonnements plus autonomes.",
    learningObjectives: [
      "Maîtriser les quatre opérations dans des problèmes plus complexes.",
      "Utiliser fractions, décimaux et pourcentages simples dans des contextes concrets.",
      "Interpréter des données simples et organiser une solution rédigée.",
      "Réviser géométrie, mesures, aire, périmètre et partage proportionnel.",
    ],
    localContexts: ["récoltes", "caisse du marché", "trajets scolaires", "répartition des sacs"],
    theoryBlocks: [
      {
        title: "Le pourcentage décrit une part sur cent",
        explanation:
          "Dire 25 % revient à dire 25 sur 100. Cela aide à parler de réduction, de réussite ou de partage.",
        formula: "25\\% = \\frac{25}{100}",
        example: "25 % d'une caisse de 200 francs, c'est 50 francs.",
      },
      {
        title: "Résoudre un problème composé",
        explanation:
          "On lit, on cherche les données utiles, on choisit l'ordre des opérations puis on vérifie que la réponse a du sens dans la situation.",
        formula: "\\text{données} \\rightarrow \\text{opérations} \\rightarrow \\text{vérification}",
        example: "D'abord additionner les sacs, puis calculer la part d'un quart.",
      },
      {
        title: "Consolider fractions et décimaux",
        explanation:
          "Une fraction peut toujours s'écrire en décimal. Connaître les correspondances les plus courantes aide à calculer rapidement.",
        formula: "\\frac{1}{2} = 0{,}5 \\quad \\frac{1}{4} = 0{,}25 \\quad \\frac{3}{4} = 0{,}75",
        example: "La moitié d'un sac de 80 kg s'écrit aussi 0,5 × 80 = 40 kg.",
      },
    ],
    exercises: [
      {
        id: "6a-caisse",
        title: "Part de la caisse commune",
        context: "La caisse d'un groupe de pêcheurs contient 200 francs. On réserve 25 % pour réparer les filets.",
        prompt: "Combien de francs sont réservés pour la réparation ?",
        answerType: "math-input",
        expectedAnswer: "50",
        equation: "25\\% \\text{ de } 200 = ?",
        hintSteps: [
          "25 % signifie 25 sur 100, soit un quart.",
          "Cherche le quart de 200.",
          "200 ÷ 4 = 50.",
        ],
        solutionSteps: [
          "25 % correspond à un quart.",
          "Le quart de 200 se calcule par 200 ÷ 4.",
          "On obtient 50 francs réservés pour la réparation.",
        ],
        challenge: "Calcule ensuite ce qu'il reste dans la caisse.",
      },
      {
        id: "6a-reste-caisse",
        title: "Ce qu'il reste",
        context: "La caisse contient 200 francs. On a réservé 50 francs pour les filets. On dépense encore 30 francs pour du matériel.",
        prompt: "Combien reste-t-il dans la caisse ?",
        answerType: "math-input",
        expectedAnswer: "120",
        hintSteps: [
          "D'abord, enlève les 50 francs : 200 - 50 = 150.",
          "Ensuite, enlève les 30 francs dépensés.",
          "150 - 30 = ?",
        ],
        solutionSteps: [
          "Après les filets : 200 - 50 = 150 francs.",
          "Après le matériel : 150 - 30 = 120 francs.",
          "Il reste 120 francs dans la caisse.",
        ],
        challenge: "Quel pourcentage de la caisse initiale reste-t-il ?",
      },
      {
        id: "6a-sacs",
        title: "Répartition des sacs",
        context: "Cinq porteurs transportent 120 sacs en parts égales. Chaque porteur reçoit ensuite 10 % de sac bonus.",
        prompt: "Combien de sacs chaque porteur a-t-il au total ?",
        answerType: "math-input",
        expectedAnswer: "26",
        hintSteps: [
          "D'abord : 120 ÷ 5 = 24 sacs chacun.",
          "10 % de 24 = 24 ÷ 10 = 2,4. On arrondit à 2 sacs bonus.",
          "24 + 2 = 26 sacs.",
        ],
        solutionSteps: [
          "Part initiale : 120 ÷ 5 = 24 sacs.",
          "Bonus de 10 % : 10 % de 24 = 2,4 ≈ 2 sacs.",
          "Total : 24 + 2 = 26 sacs par porteur.",
        ],
        challenge: "Si on leur donnait 25 % de bonus, combien cela ferait-il ?",
      },
      {
        id: "6a-trajet",
        title: "Le trajet scolaire",
        context: "Un élève marche 1,2 km le matin et 1,2 km le soir pendant 5 jours.",
        prompt: "Quelle distance totale a-t-il parcourue dans la semaine ?",
        answerType: "math-input",
        expectedAnswer: "12",
        hintSteps: [
          "Distance par jour : 1,2 + 1,2 = 2,4 km.",
          "Distance sur 5 jours : 2,4 × 5.",
          "2,4 × 5 = 12 km.",
        ],
        solutionSteps: [
          "Aller-retour quotidien : 1,2 × 2 = 2,4 km.",
          "Sur 5 jours : 2,4 × 5 = 12 km.",
          "L'élève a marché 12 km dans la semaine.",
        ],
        challenge: "En combien de semaines atteint-il 60 km parcourus ?",
      },
    ],
  },
];

export const secondairePrograms: MathematicsProgramYear[] = [
  {
    slug: "1ere-secondaire",
    title: "1ère secondaire",
    degree: "Secondaire — 1er cycle",
    focus: "Algèbre, équations du 1er degré, ensembles",
    overview:
      "L'élève entre dans la pensée abstraite : les lettres remplacent des inconnues, les équations décrivent des situations du village et la notion d'ensemble ordonne le monde des objets.",
    learningObjectives: [
      "Manipuler des expressions algébriques simples avec des inconnues.",
      "Résoudre des équations du 1er degré à une inconnue.",
      "Utiliser la notion d'ensemble pour classifier des données du quotidien.",
      "Transposer un problème de la vie réelle en équation et interpréter le résultat.",
    ],
    localContexts: ["poids des sacs de manioc", "recettes du marché", "tailles de pirogues", "comptes de pêcheurs"],
    theoryBlocks: [
      {
        title: "La variable représente une inconnue",
        explanation:
          "On utilise une lettre pour désigner ce qu'on cherche. L'équation est une balance : les deux côtés doivent rester égaux.",
        formula: "x + 5 = 12 \\Rightarrow x = 7",
        example: "Un sac plus 5 kg pèse 12 kg. Le sac pèse donc 7 kg.",
      },
      {
        title: "Résoudre une équation du 1er degré",
        explanation:
          "Pour isoler l'inconnue, on effectue la même opération des deux côtés de l'égalité. On vérifie en remplaçant.",
        formula: "3x - 6 = 9 \\Rightarrow 3x = 15 \\Rightarrow x = 5",
        example: "Trois fois un nombre moins 6 donne 9 : le nombre est 5.",
      },
      {
        title: "Les ensembles et l'appartenance",
        explanation:
          "Un ensemble regroupe des éléments ayant une propriété commune. On note l'appartenance avec le symbole ∈.",
        formula: "A = \\{2, 4, 6, 8\\}, \\quad 4 \\in A",
        example: "L'ensemble des jours de pêche cette semaine peut être {lundi, mercredi, vendredi}.",
      },
    ],
    exercises: [
      {
        id: "1s-balance",
        title: "La balance du marché",
        context: "Un sac de manioc et 3 kg de légumes pèsent ensemble 15 kg.",
        prompt: "Quel est le poids du sac de manioc seul ?",
        answerType: "math-input",
        expectedAnswer: "12",
        equation: "x + 3 = 15",
        hintSteps: [
          "Pose x pour le poids du sac.",
          "L'équation est x + 3 = 15.",
          "Soustrait 3 des deux côtés : x = 15 - 3.",
        ],
        solutionSteps: [
          "On pose x + 3 = 15.",
          "On soustrait 3 des deux côtés : x = 15 - 3.",
          "x = 12 kg.",
        ],
        challenge: "Vérifie : 12 + 3 = 15. Correct ?",
      },
      {
        id: "1s-pirogue",
        title: "Le prix de la pirogue",
        context: "Le menuisier vend une pirogue. Il reçoit le triple du prix convenu, puis rend 20 000 F. Il garde finalement 40 000 F.",
        prompt: "Quel était le prix convenu ?",
        answerType: "math-input",
        expectedAnswer: "20000",
        equation: "3x - 20000 = 40000",
        hintSteps: [
          "Pose x pour le prix convenu.",
          "Il reçoit 3x, puis rend 20 000 : 3x - 20 000 = 40 000.",
          "3x = 60 000, donc x = 20 000.",
        ],
        solutionSteps: [
          "Équation : 3x - 20 000 = 40 000.",
          "3x = 40 000 + 20 000 = 60 000.",
          "x = 60 000 ÷ 3 = 20 000 F.",
        ],
        challenge: "Si le menuisier avait rendu 30 000 F, quel aurait été le prix convenu ?",
      },
      {
        id: "1s-ensemble-poissons",
        title: "L'ensemble des espèces",
        context: "Un pêcheur capture ces espèces : capitaine, tilapia, silure, carpe et tilapia encore. L'ensemble des espèces différentes capturées est noté E.",
        prompt: "Combien d'espèces différentes contient l'ensemble E ?",
        answerType: "math-input",
        expectedAnswer: "4",
        hintSteps: [
          "Un ensemble ne contient pas de doublons.",
          "Liste les espèces sans répétition.",
          "Capitaine, tilapia, silure, carpe : combien y en a-t-il ?",
        ],
        solutionSteps: [
          "Espèces listées : capitaine, tilapia, silure, carpe, tilapia.",
          "On supprime les doublons : tilapia n'apparaît qu'une fois.",
          "E = {capitaine, tilapia, silure, carpe} → 4 éléments.",
        ],
        challenge: "Si une nouvelle espèce est capturée, quel est le cardinal de E ?",
      },
      {
        id: "1s-recette",
        title: "La recette du soir",
        context: "La mère gagne deux fois le salaire de son fils plus 500 F. Ensemble ils gagnent 3 500 F.",
        prompt: "Quel est le salaire du fils ?",
        answerType: "math-input",
        expectedAnswer: "1000",
        equation: "x + 2x + 500 = 3500",
        hintSteps: [
          "Pose x pour le salaire du fils.",
          "La mère gagne 2x + 500. La somme : x + 2x + 500 = 3 500.",
          "3x + 500 = 3 500, donc 3x = 3 000.",
        ],
        solutionSteps: [
          "Équation : x + (2x + 500) = 3 500.",
          "3x + 500 = 3 500.",
          "3x = 3 000 → x = 1 000 F.",
        ],
        challenge: "Quel est alors le salaire de la mère ?",
      },
      {
        id: "1s-mangue",
        title: "Les paniers de mangues",
        context: "Une vendeuse avait x paniers de mangues. Elle en a vendu 5 et il lui en reste 8.",
        prompt: "Combien de paniers avait-elle au départ ?",
        answerType: "math-input",
        expectedAnswer: "13",
        equation: "x - 5 = 8",
        hintSteps: [
          "Pose x pour le nombre de paniers au départ.",
          "Après la vente : x - 5 = 8.",
          "Ajoute 5 des deux côtés : x = 8 + 5.",
        ],
        solutionSteps: [
          "Équation : x - 5 = 8.",
          "On ajoute 5 des deux côtés : x = 13.",
          "La vendeuse avait 13 paniers au départ.",
        ],
        challenge: "Si elle avait vendu 3 paniers de plus, combien lui en resterait-il ?",
      },
      {
        id: "1s-pirogue-long",
        title: "La longueur de la pirogue",
        context: "Une pirogue mesure (2x + 4) mètres. Sa longueur totale est 10 mètres.",
        prompt: "Quelle est la valeur de x ?",
        answerType: "math-input",
        expectedAnswer: "3",
        equation: "2x + 4 = 10",
        hintSteps: [
          "Pose l'équation : 2x + 4 = 10.",
          "Soustrait 4 des deux côtés : 2x = 6.",
          "Divise par 2 : x = 3.",
        ],
        solutionSteps: [
          "2x + 4 = 10.",
          "2x = 10 - 4 = 6.",
          "x = 6 ÷ 2 = 3.",
        ],
        challenge: "Quelle est la longueur réelle de la pirogue ? Vérifie : 2×3 + 4 = 10.",
      },
      {
        id: "1s-champs",
        title: "Le périmètre du champ",
        context: "Un champ rectangulaire a une largeur x et une longueur 2x. Son périmètre total est 60 m.",
        prompt: "Quelle est la largeur x du champ ?",
        answerType: "math-input",
        expectedAnswer: "10",
        equation: "2(x + 2x) = 60",
        hintSteps: [
          "Périmètre = 2 × (largeur + longueur) = 2(x + 2x).",
          "2(3x) = 60 → 6x = 60.",
          "x = 60 ÷ 6 = 10.",
        ],
        solutionSteps: [
          "Périmètre : 2(x + 2x) = 2 × 3x = 6x.",
          "6x = 60 → x = 10 m.",
          "Largeur = 10 m, longueur = 20 m. Vérif : 2(10 + 20) = 60 ✓",
        ],
        challenge: "Quelle est l'aire du champ en m² ?",
      },
      {
        id: "1s-deux-pecheurs",
        title: "Les deux pêcheurs",
        context: "Le pêcheur aîné a capturé trois fois plus de poissons que son cadet. Ensemble ils en ont 48.",
        prompt: "Combien de poissons le cadet a-t-il capturé ?",
        answerType: "math-input",
        expectedAnswer: "12",
        equation: "x + 3x = 48",
        hintSteps: [
          "Pose x pour le cadet. L'aîné a 3x.",
          "Ensemble : x + 3x = 48 → 4x = 48.",
          "x = 48 ÷ 4 = 12.",
        ],
        solutionSteps: [
          "x + 3x = 4x = 48.",
          "x = 12 poissons (cadet).",
          "L'aîné : 3 × 12 = 36 poissons.",
        ],
        challenge: "Quelle fraction du total représente la part du cadet ?",
      },
      {
        id: "1s-union",
        title: "L'union des jours de pêche",
        context: "A = {lundi, mercredi, vendredi} et B = {mercredi, jeudi, vendredi} sont les jours de pêche de deux pirogues.",
        prompt: "Combien de jours distincts au total les deux pirogues ont-elles pêché ?",
        answerType: "math-input",
        expectedAnswer: "4",
        hintSteps: [
          "L'union A∪B contient tous les jours de A et B sans doublons.",
          "Liste : lundi, mercredi, jeudi, vendredi.",
          "Compte les éléments distincts.",
        ],
        solutionSteps: [
          "A∪B = {lundi, mercredi, jeudi, vendredi}.",
          "Mercredi et vendredi apparaissent dans les deux mais ne se comptent qu'une fois.",
          "A∪B contient 4 jours.",
        ],
        challenge: "Quels jours ont-ils pêché ensemble (intersection A∩B) ?",
      },
      {
        id: "1s-card-inter",
        title: "Les espèces communes",
        context: "A = {tilapia, carpe, silure} est le butin de lundi. B = {carpe, capitaine, tilapia} est le butin de mercredi.",
        prompt: "Combien d'espèces se trouvent à la fois dans A et dans B ?",
        answerType: "math-input",
        expectedAnswer: "2",
        hintSteps: [
          "L'intersection A∩B contient les éléments présents dans les deux ensembles.",
          "Cherche les espèces communes à A et B.",
          "Tilapia et carpe sont dans les deux.",
        ],
        solutionSteps: [
          "A = {tilapia, carpe, silure}, B = {carpe, capitaine, tilapia}.",
          "A∩B = {tilapia, carpe} — 2 espèces communes.",
          "Le cardinal de A∩B est 2.",
        ],
        challenge: "Combien d'espèces au total (A∪B) les deux jours réunis donnent-ils ?",
      },
    ],
    courseSlug: "1ere-secondaire",
    courseChapters: [
      {
        id: "ch1-variables",
        title: "Variables & Inconnues",
        subtitle: "La lettre qui cache ce qu'on cherche",
        exerciseIds: ["1s-balance", "1s-mangue", "1s-pirogue-long"],
        sakataContext: "Un sac de manioc de poids inconnu sur la balance du marché — x représente ce qu'on ne sait pas encore.",
        visualizations: [
          { type: "algebraic-tiles", title: "Tuiles algébriques", description: "Représenter x² et x avec des tuiles colorées pour comprendre les inconnues" },
          { type: "balance", title: "Balance interactive", description: "Poser l'équation comme un équilibre : le sac inconnu x d'un côté, les poids connus de l'autre" },
          { type: "equation-steps", title: "Résolution pas à pas", description: "Isoler x étape par étape en maintenant l'équilibre" },
          { type: "number-line", title: "Droite des nombres", description: "Localiser la valeur de x sur une droite numérique" }
        ],
        theoryBlocks: [
          {
            title: "La variable représente une inconnue",
            explanation: "On utilise une lettre — souvent x — pour désigner ce qu'on cherche. Cette lettre peut prendre la valeur qui rend une affirmation vraie.",
            formula: "x = \\text{ce qu'on cherche}",
            example: "Un sac de manioc a un poids inconnu. On l'appelle x. Quand on sait que x + 5 = 12, on peut trouver x.",
          },
          {
            title: "Les conventions de notation",
            explanation: "On choisit souvent x pour une inconnue, n pour un entier, t pour le temps. La lettre n'a pas d'importance : ce qui compte, c'est qu'elle désigne une seule valeur inconnue.",
            formula: "x,\\; y,\\; n,\\; t \\text{ sont des inconnues courantes}",
            example: "Si le pêcheur a n filets et qu'on sait que n - 2 = 7, alors n = 9 filets.",
          },
          {
            title: "L'inconnue dans une balance",
            explanation: "L'équation est comme une balance : les deux côtés sont égaux. Pour trouver x, on effectue les mêmes opérations des deux côtés pour maintenir l'équilibre.",
            formula: "x + 5 = 12 \\Rightarrow x = 12 - 5 = 7",
            example: "Un sac plus 5 kg pèse 12 kg. Le sac seul pèse 12 − 5 = 7 kg.",
          },
          {
            title: "Vérification par substitution",
            explanation: "Après avoir trouvé x, on remet sa valeur dans l'équation originale pour vérifier que les deux membres sont bien égaux. Cette étape est obligatoire.",
            formula: "\\text{Si } x = 7 : \\quad 7 + 5 = 12 \\checkmark",
            example: "On pose x = 7 dans x + 5 = 12 : 7 + 5 = 12. Les deux membres sont égaux. C'est correct.",
          },
          {
            title: "Inconnues positives, nulles ou négatives",
            explanation: "Une inconnue peut valoir 0, un nombre positif ou négatif selon le contexte. En pratique, une longueur ou un poids est toujours positif — on garde uniquement la solution qui a un sens.",
            formula: "x = 0, \\quad x > 0, \\quad x < 0 \\text{ sont possibles}",
            example: "Un solde de compte peut être négatif : si x + 500 = 200, alors x = −300 F (dette).",
          },
        ],
      },
      {
        id: "ch2-algebre",
        title: "Expressions algébriques",
        subtitle: "Combiner, simplifier, nommer",
        exerciseIds: ["1s-champs"],
        sakataContext: "Trois pirogues de même taille : 3x. Ajouter une demi-pirogue : 3x + 0,5x. Nommer le tout : 3,5x.",
        visualizations: [
          { type: "algebraic-tiles", title: "Tuiles algébriques", description: "Modéliser 2x² + 3x + 4 avec des grandes tuiles bleues (x²), des rectangles verts (x) et des petits carrés jaunes (unités)" },
          { type: "equation-steps", title: "Simplification guidée", description: "Réduire une expression en regroupant les termes semblables étape par étape" },
          { type: "coordinate-plane", title: "Plan cartésien", description: "Tracer des expressions algébriques sur le plan pour observer leur évolution" },
          { type: "balance", title: "Équilibre des termes", description: "Vérifier l'égalité après simplification — les deux membres restent en équilibre" }
        ],
        theoryBlocks: [
          {
            title: "Termes et coefficients",
            explanation: "Une expression algébrique est formée de termes. Chaque terme est le produit d'un coefficient (nombre) et d'une ou plusieurs variables. Le coefficient de 3x est 3.",
            formula: "3x + 2y - 5 : \\text{ trois termes}",
            example: "Dans 4x + 7 : le terme 4x a le coefficient 4, et 7 est un terme constant (sans variable).",
          },
          {
            title: "Termes semblables — regrouper ce qui se ressemble",
            explanation: "On ne peut additionner que les termes qui ont la même variable avec le même exposant. 3x et 5x sont semblables : 3x + 5x = 8x. Mais 3x et 5x² ne le sont pas.",
            formula: "3x + 5x = 8x, \\quad 3x + 5x^2 \\text{ ne se simplifie pas}",
            example: "Trois pirogues + cinq pirogues = huit pirogues : 3p + 5p = 8p. En revanche, 3 pirogues + 5 pagaies ne se combinent pas.",
          },
          {
            title: "Développer une expression",
            explanation: "Développer, c'est supprimer les parenthèses en appliquant la distributivité : a(b + c) = ab + ac. On distribue le facteur extérieur à chaque terme intérieur.",
            formula: "a(b + c) = ab + ac",
            example: "2(x + 4) = 2x + 8. Le double d'un panier plus quatre est le double du panier plus huit.",
          },
          {
            title: "Réduire une expression",
            explanation: "Réduire, c'est regrouper tous les termes semblables pour obtenir la forme la plus simple. On additionne les coefficients des mêmes variables.",
            formula: "5x + 3 - 2x + 7 = 3x + 10",
            example: "Cinq paniers plus trois francs moins deux paniers plus sept francs : il reste trois paniers et dix francs.",
          },
          {
            title: "L'expression algébrique comme modèle",
            explanation: "Une expression algébrique permet de modéliser une situation réelle. On choisit une variable, on construit l'expression, puis on lui donne des valeurs selon le problème.",
            formula: "\\text{Bénéfice} = 500x - 1500 \\text{ (avec } x \\text{ paniers vendus)}",
            example: "Si on vend x kg de poisson à 500 F/kg avec 1500 F de frais, le bénéfice est 500x − 1500. Pour x = 5 : bénéfice = 1000 F.",
          },
        ],
      },
      {
        id: "ch3-equations",
        title: "Équations du 1er degré",
        subtitle: "Trouver l'inconnue par l'équilibre",
        exerciseIds: ["1s-pirogue", "1s-recette", "1s-deux-pecheurs"],
        sakataContext: "Le menuisier connaît le total mais pas le prix unitaire — l'équation retrouve ce qui manque.",
        visualizations: [
          { type: "equation-steps", title: "Résolution pas à pas", description: "Résoudre 2x + 5 = 13 en suivant chaque étape animée : soustraction, division, solution finale" },
          { type: "balance", title: "Balance d'équation", description: "Maintenir l'équilibre en effectuant les mêmes opérations des deux côtés" },
          { type: "number-line", title: "Droite numérique", description: "Localiser la solution x sur la droite des nombres après résolution" },
          { type: "coordinate-plane", title: "Plan cartésien", description: "Voir graphiquement où la droite y = 2x + 5 croise y = 13 — c'est la solution" }
        ],
        theoryBlocks: [
          {
            title: "Qu'est-ce qu'une équation ?",
            explanation: "Une équation est une égalité qui contient au moins une inconnue. Résoudre l'équation, c'est trouver la valeur de l'inconnue qui rend l'égalité vraie.",
            formula: "3x - 6 = 9 : \\text{ résoudre} = \\text{ trouver } x",
            example: "Le triple d'un nombre moins 6 donne 9. Quel est ce nombre ? On écrit 3x − 6 = 9 et on résout.",
          },
          {
            title: "Le principe d'équilibre",
            explanation: "On peut effectuer n'importe quelle opération des deux côtés d'une équation sans rompre l'égalité : ajouter, soustraire, multiplier ou diviser (par ≠ 0) les deux membres.",
            formula: "a = b \\Rightarrow a + c = b + c \\Rightarrow a \\times c = b \\times c",
            example: "Si 3x = 15, on divise les deux membres par 3 : x = 5. L'équilibre est maintenu.",
          },
          {
            title: "Résolution par addition ou soustraction",
            explanation: "Pour isoler x, on déplace les termes constants de l'autre côté en effectuant l'opération inverse : si +5 est à gauche, on soustrait 5 des deux membres.",
            formula: "x + 5 = 12 \\Rightarrow x = 12 - 5 = 7",
            example: "x + 3 = 15 → on soustrait 3 de chaque côté → x = 12.",
          },
          {
            title: "Résolution par multiplication ou division",
            explanation: "Si x est multiplié par un coefficient, on divise les deux membres par ce coefficient pour isoler x.",
            formula: "3x = 15 \\Rightarrow x = \\frac{15}{3} = 5",
            example: "3x − 20 000 = 40 000 → 3x = 60 000 → x = 20 000 F.",
          },
          {
            title: "Transposer un problème réel en équation",
            explanation: "On lit le problème, on identifie l'inconnue, on la nomme x, on traduit chaque donnée en opération et on construit l'égalité. Puis on résout et on vérifie que le résultat a un sens.",
            formula: "\\text{Problème} \\rightarrow \\text{équation} \\rightarrow \\text{résolution} \\rightarrow \\text{vérification}",
            example: "La mère gagne deux fois le salaire du fils plus 500 F. Ensemble, ils gagnent 3 500 F. On pose x pour le fils → x + 2x + 500 = 3 500 → x = 1 000 F.",
          },
        ],
      },
      {
        id: "ch4-ensembles",
        title: "Théorie des ensembles",
        subtitle: "Classer, réunir, distinguer",
        exerciseIds: ["1s-ensemble-poissons", "1s-union", "1s-card-inter"],
        sakataContext: "Les espèces pêchées lundi et mercredi — quelles sont les communes ? Quelles sont celles d'un seul jour ?",
        visualizations: [
          { type: "number-sets", title: "Ensembles de nombres", description: "Voir ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ en cercles concentriques — cliquer pour explorer les exemples de chaque ensemble" },
          { type: "truth-table", title: "Table d'appartenance", description: "Tester interactivement si un élément appartient à A, B, A∩B ou A∪B" },
          { type: "venn", title: "Diagramme de Venn", description: "Visualiser graphiquement les unions et intersections entre les deux ensembles de poissons" },
          { type: "statistics-bars", title: "Cardinalité des ensembles", description: "Comparer le nombre d'éléments dans A, B, A∩B et A∪B avec des barres" }
        ],
        theoryBlocks: [
          {
            title: "Définition d'un ensemble",
            explanation: "Un ensemble est une collection bien définie d'objets appelés éléments. Chaque élément n'apparaît qu'une seule fois dans un ensemble. On note un ensemble avec des accolades.",
            formula: "E = \\{\\text{capitaine, tilapia, silure, carpe}\\}",
            example: "L'ensemble des espèces pêchées dans la Lukenie un lundi donné ne contient pas de doublons : chaque espèce n'est listée qu'une fois.",
          },
          {
            title: "Appartenance et non-appartenance",
            explanation: "Le symbole ∈ signifie 'appartient à'. Le symbole ∉ signifie 'n'appartient pas à'. On teste si un élément est ou non dans un ensemble.",
            formula: "4 \\in A, \\quad 5 \\notin A \\text{ si } A = \\{2, 4, 6, 8\\}",
            example: "Si E = {tilapia, carpe, capitaine}, alors tilapia ∈ E mais silure ∉ E.",
          },
          {
            title: "Sous-ensembles",
            explanation: "B est un sous-ensemble de A (noté B ⊂ A) si tout élément de B est aussi dans A. L'ensemble vide ∅ est sous-ensemble de tout ensemble.",
            formula: "B \\subset A \\Leftrightarrow \\forall x \\in B,\\; x \\in A",
            example: "Si A = {carpe, tilapia, silure} et B = {carpe, silure}, alors B ⊂ A.",
          },
          {
            title: "Union A∪B — réunir les deux ensembles",
            explanation: "L'union de A et B contient tous les éléments de A ET tous les éléments de B, sans doublons. C'est l'ensemble de tout ce qu'on trouve dans l'un ou l'autre.",
            formula: "A \\cup B = \\{x \\mid x \\in A \\text{ ou } x \\in B\\}",
            example: "A = {tilapia, carpe} et B = {carpe, silure}. A∪B = {tilapia, carpe, silure} — 3 éléments.",
          },
          {
            title: "Intersection A∩B — ce qui est commun",
            explanation: "L'intersection de A et B contient uniquement les éléments qui appartiennent à la fois à A ET à B. Si A et B n'ont rien en commun, A∩B = ∅.",
            formula: "A \\cap B = \\{x \\mid x \\in A \\text{ et } x \\in B\\}",
            example: "A = {tilapia, carpe, capitaine} et B = {carpe, silure, tilapia}. A∩B = {tilapia, carpe} — 2 éléments communs.",
          },
        ],
      },
    ],
  },
  {
    slug: "2e-secondaire",
    title: "2e secondaire",
    degree: "Secondaire — 1er cycle",
    focus: "Fonctions linéaires, systèmes d'équations, géométrie plane",
    overview:
      "L'élève découvre les fonctions affines, résout des systèmes de deux équations et approfondit la géométrie des triangles et des cercles.",
    learningObjectives: [
      "Représenter et interpréter une fonction affine y = ax + b.",
      "Résoudre un système de deux équations du 1er degré à deux inconnues.",
      "Calculer des angles dans des figures géométriques planes.",
      "Utiliser les propriétés des triangles semblables pour calculer des longueurs.",
    ],
    localContexts: ["prix variables du marché", "distances sur la Lukenie", "angles de toiture", "triangles de charpente"],
    theoryBlocks: [
      {
        title: "La fonction affine y = ax + b",
        explanation: "Une fonction affine décrit une relation proportionnelle décalée. Le coefficient a indique la pente, b le point de départ.",
        formula: "y = ax + b",
        example: "Le prix du poisson : y = 150x + 200, avec x le nombre de kilos et 200 F de frais fixes.",
      },
      {
        title: "Résoudre un système par substitution",
        explanation: "On exprime une inconnue en fonction de l'autre, puis on substitue dans la seconde équation.",
        formula: "\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases} \\Rightarrow x = 6,\\; y = 4",
        example: "Deux types de sacs : somme = 10, différence = 2.",
      },
      {
        title: "Angles dans un triangle",
        explanation: "La somme des angles d'un triangle est toujours 180°.",
        formula: "\\alpha + \\beta + \\gamma = 180°",
        example: "Un triangle de toiture avec 60° et 75° a un troisième angle de 45°.",
      },
    ],
    exercises: [
      {
        id: "2s-prix-poisson",
        title: "Le prix du poisson",
        context: "Le prix total d'une vente de poisson suit la formule : y = 200x + 500, où x est le nombre de kilos et y le prix total en francs.",
        prompt: "Quel est le prix total pour 4 kg ?",
        answerType: "math-input",
        expectedAnswer: "1300",
        equation: "y = 200 \\times 4 + 500",
        hintSteps: [
          "Remplace x par 4 dans la formule.",
          "Calcule 200 × 4.",
          "Ajoute 500 au résultat.",
        ],
        solutionSteps: [
          "y = 200 × 4 + 500.",
          "y = 800 + 500.",
          "y = 1 300 francs.",
        ],
        challenge: "Pour quel nombre de kilos le prix atteint-il 2 500 F ?",
      },
      {
        id: "2s-systeme",
        title: "Les deux types de sacs",
        context: "Un porteur transporte deux types de sacs. En tout il en a 9. Les grands sacs sont 3 de plus que les petits.",
        prompt: "Combien y a-t-il de petits sacs ?",
        answerType: "math-input",
        expectedAnswer: "3",
        hintSteps: [
          "Pose x pour les petits sacs et y pour les grands.",
          "x + y = 9 et y = x + 3.",
          "Substitue : x + (x + 3) = 9 → 2x = 6 → x = 3.",
        ],
        solutionSteps: [
          "Système : x + y = 9 et y = x + 3.",
          "2x + 3 = 9 → 2x = 6 → x = 3.",
          "Il y a 3 petits sacs et 6 grands.",
        ],
        challenge: "Vérifie : 3 + 6 = 9 et 6 − 3 = 3. Correct ?",
      },
      {
        id: "2s-angle-toiture",
        title: "L'angle de la toiture",
        context: "Un charpentier construit une toiture triangulaire. Deux des angles mesurent 55° et 70°.",
        prompt: "Quel est le troisième angle de la toiture ?",
        answerType: "math-input",
        expectedAnswer: "55",
        equation: "55 + 70 + x = 180",
        hintSteps: [
          "La somme des angles d'un triangle est 180°.",
          "Additionne les deux angles connus : 55 + 70.",
          "Soustrait ce total de 180.",
        ],
        solutionSteps: [
          "55 + 70 = 125.",
          "Troisième angle : 180 − 125 = 55°.",
        ],
        challenge: "Ce triangle est-il isocèle ? Justifie.",
      },
      {
        id: "2s-distance-riviere",
        title: "La distance sur la rivière",
        context: "Un pêcheur remonte la Lukenie à 6 km/h pendant t heures, et la redescend à 9 km/h. La descente dure 2 heures de moins. Les deux distances sont égales.",
        prompt: "Quelle est la durée de la montée en heures ?",
        answerType: "math-input",
        expectedAnswer: "6",
        equation: "6t = 9(t-2)",
        hintSteps: [
          "Distance montée : 6t. Distance descente : 9(t − 2).",
          "6t = 9(t − 2) → 6t = 9t − 18.",
          "18 = 3t → t = 6.",
        ],
        solutionSteps: [
          "6t = 9(t − 2) = 9t − 18.",
          "18 = 3t → t = 6 heures.",
        ],
        challenge: "Quelle est la distance parcourue ?",
      },
      {
        id: "2s-pente",
        title: "La pente du sentier",
        context: "Un sentier suit la fonction y = ax + 3. Il passe par le point (2, 11).",
        prompt: "Quelle est la valeur du coefficient directeur a ?",
        answerType: "math-input",
        expectedAnswer: "4",
        equation: "11 = a \\times 2 + 3",
        hintSteps: [
          "Substitue x = 2 et y = 11 dans y = ax + 3.",
          "11 = 2a + 3 → 2a = 8.",
          "a = 4.",
        ],
        solutionSteps: [
          "11 = 2a + 3.",
          "2a = 8 → a = 4.",
          "Le sentier monte de 4 mètres par unité de distance horizontale.",
        ],
        challenge: "Quelle est la valeur de y quand x = 5 ?",
      },
      {
        id: "2s-table-valeurs",
        title: "Le tableau du marché",
        context: "Le bénéfice d'un vendeur suit y = 300x − 600, où x est le nombre de paniers vendus.",
        prompt: "À partir de combien de paniers le vendeur commence-t-il à gagner de l'argent (y > 0) ?",
        answerType: "math-input",
        expectedAnswer: "3",
        equation: "300x - 600 > 0",
        hintSteps: [
          "On cherche x tel que 300x − 600 = 0.",
          "300x = 600 → x = 2.",
          "Pour x > 2, donc à partir de 3 paniers.",
        ],
        solutionSteps: [
          "300x − 600 = 0 → x = 2.",
          "Pour x = 3 : y = 300×3 − 600 = 300 F (bénéfice positif).",
          "Il faut vendre au moins 3 paniers.",
        ],
        challenge: "Quel est le bénéfice pour 10 paniers vendus ?",
      },
      {
        id: "2s-systeme-pirogue",
        title: "Les deux pirogues",
        context: "Deux pirogues transportent ensemble 24 personnes. La grande en transporte 6 de plus que la petite.",
        prompt: "Combien de personnes la petite pirogue transporte-t-elle ?",
        answerType: "math-input",
        expectedAnswer: "9",
        hintSteps: [
          "Pose x pour la petite et y pour la grande.",
          "x + y = 24 et y = x + 6.",
          "x + (x + 6) = 24 → 2x = 18 → x = 9.",
        ],
        solutionSteps: [
          "x + (x + 6) = 24 → 2x + 6 = 24.",
          "2x = 18 → x = 9.",
          "Petite pirogue : 9 personnes. Grande : 15.",
        ],
        challenge: "Vérifie : 9 + 15 = 24 et 15 − 9 = 6. ✓",
      },
      {
        id: "2s-angles-complementaires",
        title: "Les angles complémentaires",
        context: "Deux angles complémentaires (somme = 90°) sont tels que l'un est le double de l'autre.",
        prompt: "Quelle est la mesure du plus petit angle en degrés ?",
        answerType: "math-input",
        expectedAnswer: "30",
        equation: "x + 2x = 90",
        hintSteps: [
          "Pose x pour le plus petit angle. Le grand est 2x.",
          "x + 2x = 90 → 3x = 90.",
          "x = 30°.",
        ],
        solutionSteps: [
          "3x = 90 → x = 30°.",
          "Les angles sont 30° et 60°.",
          "Vérif : 30 + 60 = 90°. ✓",
        ],
        challenge: "Ces deux angles forment-ils un triangle rectangle ? Justifie.",
      },
      {
        id: "2s-triangle-isocele",
        title: "Le triangle de la charpente",
        context: "Un triangle isocèle a ses deux angles à la base égaux. L'angle au sommet mesure 40°.",
        prompt: "Quelle est la mesure de chacun des angles à la base ?",
        answerType: "math-input",
        expectedAnswer: "70",
        equation: "2x + 40 = 180",
        hintSteps: [
          "Somme des angles : 2x + 40 = 180.",
          "2x = 140 → x = 70.",
        ],
        solutionSteps: [
          "2x + 40 = 180 → 2x = 140 → x = 70°.",
          "Chaque angle à la base mesure 70°.",
          "Vérif : 70 + 70 + 40 = 180°. ✓",
        ],
        challenge: "Ce triangle peut-il être équilatéral ? Pourquoi ?",
      },
      {
        id: "2s-ombre-arbre",
        title: "L'ombre de l'arbre",
        context: "Un bâton de 1 m projette une ombre de 0,8 m. Un arbre voisin projette une ombre de 6,4 m. Les triangles formés sont semblables.",
        prompt: "Quelle est la hauteur de l'arbre en mètres ?",
        answerType: "math-input",
        expectedAnswer: "8",
        hintSteps: [
          "Triangles semblables : rapport constant.",
          "Hauteur/Ombre = 1/0,8 = h/6,4.",
          "h = 6,4 × (1/0,8) = 6,4 × 1,25 = 8.",
        ],
        solutionSteps: [
          "Rapport : 1 m / 0,8 m = 1,25.",
          "Hauteur arbre = 6,4 × 1,25 = 8 m.",
        ],
        challenge: "Si l'arbre mesure 12 m, quelle serait son ombre ?",
      },
    ],
    courseSlug: "2e-secondaire",
    courseChapters: [
      {
        id: "ch1-fonctions",
        title: "Fonctions affines",
        subtitle: "y = ax + b — la droite qui modélise",
        exerciseIds: ["2s-prix-poisson", "2s-pente", "2s-table-valeurs"],
        sakataContext: "Le prix du poisson au marché de Mushie augmente avec le poids : y = 150x + 200. La droite trace la relation entre quantité et coût.",
        visualizations: [
          { type: "slope-explorer", title: "Explorateur de pente", description: "Modifier la pente a et l'ordonnée b pour voir comment la droite y = ax + b se transforme en temps réel" },
          { type: "coordinate-plane", title: "Plan cartésien interactif", description: "Déplacer le point sur le plan et lire ses coordonnées — observer comment chaque point satisfait l'équation" },
          { type: "function-plot", title: "Graphe de la fonction", description: "Tracer la droite y = ax + b et lire les images et antécédents" },
          { type: "statistics-bars", title: "Table de valeurs", description: "Comparer les images f(1), f(2), f(3)... sous forme de barres pour voir la croissance linéaire" }
        ],
        theoryBlocks: [
          {
            title: "Qu'est-ce qu'une fonction ?",
            explanation: "Une fonction associe à chaque valeur d'entrée x une valeur de sortie y. Pour chaque x, il n'existe qu'un seul y correspondant. On écrit y = f(x).",
            formula: "f : x \\mapsto y = f(x)",
            example: "Le prix d'une vente : pour chaque nombre de kilos x, il y a un seul prix total y. C'est une fonction.",
          },
          {
            title: "La forme y = ax + b",
            explanation: "Une fonction affine est représentée par une droite. Le coefficient a est la pente (combien y augmente quand x augmente de 1). Le terme b est la valeur de y quand x = 0.",
            formula: "y = ax + b",
            example: "y = 150x + 200 : pour chaque kilo supplémentaire, le prix augmente de 150 F. À 0 kilo, le prix de base est 200 F.",
          },
          {
            title: "Calculer une image (valeur de y)",
            explanation: "Pour trouver l'image d'un x donné, on substitue x dans la formule et on calcule. C'est évaluer la fonction en un point.",
            formula: "y = 150 \\times 4 + 200 = 800",
            example: "Pour 4 kg de poisson : y = 150 × 4 + 200 = 600 + 200 = 800 F.",
          },
          {
            title: "Trouver x à partir de y (antécédent)",
            explanation: "On cherche le x qui produit un y donné. On pose l'équation y = ax + b avec y connu, puis on résout pour x.",
            formula: "800 = 150x + 200 \\Rightarrow x = \\frac{600}{150} = 4",
            example: "Pour quel nombre de kilos le prix atteint-il 800 F ? → 150x + 200 = 800 → x = 4 kg.",
          },
          {
            title: "Identifier la pente et l'ordonnée à l'origine",
            explanation: "Dans y = ax + b, la pente a est le taux de variation : si a > 0, la fonction est croissante ; si a < 0, elle est décroissante. L'ordonnée à l'origine b est le point de départ.",
            formula: "a > 0 \\Rightarrow \\text{croissante}, \\quad a < 0 \\Rightarrow \\text{décroissante}",
            example: "y = −100x + 3000 : le stock diminue de 100 unités par jour. Au départ (x = 0), le stock est de 3000 unités.",
          },
        ],
      },
      {
        id: "ch2-systemes",
        title: "Systèmes d'équations",
        subtitle: "Deux inconnues, deux équations",
        exerciseIds: ["2s-systeme", "2s-systeme-pirogue", "2s-distance-riviere"],
        sakataContext: "Deux vendeurs au marché de Nioki : la somme de leurs stocks est connue, et la différence aussi. Deux équations, deux inconnues — on retrouve les deux quantités.",
        visualizations: [
          { type: "coordinate-plane", title: "Intersection graphique", description: "Les deux équations sont deux droites — leur point d'intersection est la solution unique du système" },
          { type: "balance", title: "Double équilibre", description: "Visualiser les deux équations simultanément comme deux balances qui doivent être en équilibre en même temps" },
          { type: "equation-steps", title: "Méthode de substitution", description: "Résoudre le système étape par étape : isoler y dans l'équation 1, substituer dans l'équation 2" },
          { type: "slope-explorer", title: "Les deux droites", description: "Ajuster les pentes pour voir quand deux droites se croisent, sont parallèles ou confondues" }
        ],
        theoryBlocks: [
          {
            title: "Pourquoi deux équations ?",
            explanation: "Avec deux inconnues x et y, une seule équation ne suffit pas : il y a une infinité de solutions. Deux équations indépendantes permettent de trouver le couple (x, y) unique qui satisfait les deux.",
            formula: "\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases}",
            example: "Deux sacs : leur somme est 10 kg et leur différence est 2 kg. Une seule information ne permet pas de savoir lequel est lequel.",
          },
          {
            title: "Méthode par substitution",
            explanation: "On isole une inconnue dans la première équation, puis on substitue cette expression dans la seconde. On obtient une équation à une seule inconnue, qu'on résout.",
            formula: "y = 10 - x \\Rightarrow x - (10 - x) = 2 \\Rightarrow 2x = 12 \\Rightarrow x = 6",
            example: "De x + y = 10 : y = 10 − x. Dans x − y = 2 : x − (10 − x) = 2 → 2x = 12 → x = 6, y = 4.",
          },
          {
            title: "Méthode par addition (élimination)",
            explanation: "On additionne les deux équations membre à membre pour éliminer une inconnue. Si nécessaire, on multiplie d'abord une équation par un coefficient pour que l'élimination fonctionne.",
            formula: "\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases} \\xrightarrow{+} 2x = 12",
            example: "En additionnant : (x + y) + (x − y) = 10 + 2 → 2x = 12 → x = 6. Puis y = 10 − 6 = 4.",
          },
          {
            title: "Vérification des deux équations",
            explanation: "On substitue la solution (x, y) dans chacune des deux équations d'origine pour vérifier. Les deux doivent être satisfaites.",
            formula: "x = 6, y = 4 : \\quad 6 + 4 = 10 \\checkmark \\quad 6 - 4 = 2 \\checkmark",
            example: "Pour les sacs : 6 + 4 = 10 ✓ et 6 − 4 = 2 ✓. La solution est correcte.",
          },
          {
            title: "Problèmes à deux inconnues",
            explanation: "Pour transposer un problème en système : on nomme les deux inconnues, on traduit chaque contrainte en équation, on résout et on interprète les résultats dans le contexte.",
            formula: "\\text{Deux contraintes} \\rightarrow \\text{deux équations} \\rightarrow (x, y)",
            example: "Deux pirogues transportent 24 personnes. La grande en a 6 de plus que la petite. → x + y = 24 et y = x + 6 → x = 9, y = 15.",
          },
        ],
      },
      {
        id: "ch3-geometrie",
        title: "Géométrie plane",
        subtitle: "Angles, triangles et propriétés",
        exerciseIds: ["2s-angle-toiture", "2s-angles-complementaires", "2s-triangle-isocele"],
        sakataContext: "La toiture d'une maison Sakata forme un triangle. Les charpentiers calculent les angles pour que la structure tienne — la géométrie est une technique de construction ancestrale.",
        visualizations: [
          { type: "angle-measurer", title: "Rapporteur interactif", description: "Mesurer des angles de 0° à 180° — classification automatique : aigu, droit, obtus, plat" },
          { type: "angle-triangle", title: "Angles du triangle", description: "Visualiser la somme des angles intérieurs = 180° et les propriétés des triangles isocèles" },
          { type: "shape-explorer", title: "Explorateur de formes", description: "Explorer les propriétés géométriques des triangles, carrés et autres polygones" },
          { type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer les longueurs des côtés pour vérifier les propriétés des triangles" }
        ],
        theoryBlocks: [
          {
            title: "Les types d'angles",
            explanation: "Un angle droit mesure 90°. Deux angles sont complémentaires si leur somme est 90°, supplémentaires si elle est 180°. Ces propriétés sont fondamentales en géométrie plane.",
            formula: "\\alpha + \\beta = 90° \\text{ (complémentaires)}, \\quad \\alpha + \\beta = 180° \\text{ (supplémentaires)}",
            example: "Un angle de 35° et un angle de 55° sont complémentaires : 35 + 55 = 90°.",
          },
          {
            title: "Somme des angles d'un triangle",
            explanation: "Dans tout triangle, la somme des trois angles intérieurs est toujours 180°. Cette propriété est invariable quelle que soit la forme du triangle.",
            formula: "\\alpha + \\beta + \\gamma = 180°",
            example: "Toiture triangulaire avec 60° et 75° : le troisième angle est 180 − 60 − 75 = 45°.",
          },
          {
            title: "Triangle isocèle et ses propriétés",
            explanation: "Un triangle isocèle a deux côtés égaux. Les angles à la base (en face des côtés égaux) sont aussi égaux. On peut trouver l'angle au sommet ou les angles à la base.",
            formula: "\\text{isocèle} \\Rightarrow \\alpha_1 = \\alpha_2, \\quad 2\\alpha + \\gamma = 180°",
            example: "Si l'angle au sommet est 40°, les angles à la base valent chacun (180 − 40) / 2 = 70°.",
          },
          {
            title: "Triangle équilatéral",
            explanation: "Un triangle équilatéral a ses trois côtés égaux et ses trois angles égaux. Chaque angle mesure 60°. C'est le triangle le plus symétrique.",
            formula: "\\alpha = \\beta = \\gamma = 60°",
            example: "Les toitures coniques des cases Sakata sont souvent construites sur des bases hexagonales composées de triangles équilatéraux.",
          },
          {
            title: "Angles alternes-internes et droites parallèles",
            explanation: "Quand une droite coupe deux droites parallèles, les angles alternes-internes sont égaux. Cette propriété est utile pour calculer des angles dans des figures complexes.",
            formula: "d_1 \\parallel d_2 \\Rightarrow \\alpha = \\beta \\text{ (alternes-internes)}",
            example: "Le toit d'une charpente parallèle au sol : l'angle d'inclinaison est le même des deux côtés.",
          },
        ],
      },
      {
        id: "ch4-triangles",
        title: "Triangles semblables",
        subtitle: "Proportions et distances inaccessibles",
        exerciseIds: ["2s-ombre-arbre"],
        sakataContext: "Pour mesurer la hauteur d'un arbre ou la largeur d'une rivière sans y accéder, on utilise l'ombre et les triangles semblables — une technique que les géomètres Sakata pratiquaient intuitivement.",
        visualizations: [
          { type: "proportion", title: "Rapports de similitude", description: "Vérifier que a/a' = b/b' = c/c' — le rapport entre côtés homologues est constant" },
          { type: "angle-measurer", title: "Angles égaux", description: "Vérifier que les angles des deux triangles semblables sont égaux deux à deux" },
          { type: "ruler-measure", title: "Mesurer et proportionner", description: "Mesurer les côtés et calculer le rapport de similitude k" },
          { type: "scatter-plot", title: "Nuage de points", description: "Tracer les paires (ombre, hauteur) pour voir la relation linéaire de proportionnalité" }
        ],
        theoryBlocks: [
          {
            title: "Triangles semblables — définition",
            explanation: "Deux triangles sont semblables si leurs angles sont égaux deux à deux. Leurs côtés correspondants sont alors proportionnels : ils ont le même rapport de longueurs.",
            formula: "\\frac{a}{a'} = \\frac{b}{b'} = \\frac{c}{c'} = k \\text{ (rapport de similitude)}",
            example: "Un bâton de 1 m et un arbre projettent des ombres dans le même soleil. Les deux triangles formés (objet + ombre) sont semblables.",
          },
          {
            title: "Le théorème de Thalès",
            explanation: "Si une droite est parallèle à un côté d'un triangle et coupe les deux autres côtés, elle les divise dans le même rapport. C'est le cas fondamental des triangles semblables emboîtés.",
            formula: "\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}",
            example: "Si MN est parallèle à BC, alors AM/AB = AN/AC. On peut calculer une longueur inconnue à partir des trois autres.",
          },
          {
            title: "Calculer une distance par similitude",
            explanation: "On identifie deux triangles semblables, on repère les côtés correspondants, on pose le rapport d'égalité et on résout pour la longueur inconnue.",
            formula: "\\frac{h}{\\text{ombre}} = \\frac{h'}{\\text{ombre}'} \\Rightarrow h' = h \\times \\frac{\\text{ombre}'}{\\text{ombre}}",
            example: "Bâton 1 m, ombre 0,8 m. Arbre, ombre 6,4 m. Hauteur arbre = 1 × (6,4/0,8) = 8 m.",
          },
          {
            title: "Mesurer sans accéder — distances inaccessibles",
            explanation: "On place deux jalons à distance connue, on mesure des angles ou des longueurs accessibles, et on utilise la similitude pour déduire la distance inconnue (largeur d'une rivière, hauteur d'un falaise).",
            formula: "d_{\\text{inaccessible}} = \\frac{d_{\\text{connue}} \\times l_{\\text{grand}}}{l_{\\text{petit}}}",
            example: "Pour mesurer la largeur de la Lukenie, on plante deux piquets et on mesure les triangles formés depuis la rive.",
          },
          {
            title: "Agrandissement et réduction",
            explanation: "Le rapport de similitude k > 1 correspond à un agrandissement, k < 1 à une réduction. Les surfaces sont multipliées par k², les volumes par k³.",
            formula: "k > 1 \\text{ (agrandissement)}, \\quad k < 1 \\text{ (réduction)}",
            example: "Une carte au 1/50 000 : 1 cm sur la carte = 50 000 cm = 500 m dans la réalité. k = 1/50 000.",
          },
        ],
      },
    ],
  },
  {
    slug: "3e-secondaire",
    title: "3e secondaire",
    degree: "Secondaire — 1er cycle",
    focus: "Équations du 2nd degré, théorème de Pythagore, statistiques",
    overview:
      "L'élève découvre les équations quadratiques, utilise Pythagore pour résoudre des problèmes de distance et commence l'organisation de données statistiques.",
    learningObjectives: [
      "Résoudre des équations du 2nd degré par factorisation et par la formule du discriminant.",
      "Appliquer le théorème de Pythagore dans des contextes réels.",
      "Calculer la moyenne, la médiane et le mode d'une série de données.",
      "Construire et lire des tableaux et diagrammes statistiques simples.",
    ],
    localContexts: ["filets de pêche", "distances de chasse", "relevés de capture", "hauteurs d'arbres"],
    theoryBlocks: [
      {
        title: "L'équation du 2nd degré et son discriminant",
        explanation: "Une équation de la forme ax² + bx + c = 0 admet des solutions réelles si le discriminant Δ = b² - 4ac est positif ou nul.",
        formula: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4ac",
        example: "x² − 5x + 6 = 0 : Δ = 25 − 24 = 1, x₁ = 3, x₂ = 2.",
      },
      {
        title: "Le théorème de Pythagore",
        explanation: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.",
        formula: "c^2 = a^2 + b^2",
        example: "Un triangle aux côtés 3 m et 4 m a une hypoténuse de 5 m.",
      },
      {
        title: "Moyenne et médiane",
        explanation: "La moyenne arithmétique est la somme des valeurs divisée par leur nombre. La médiane est la valeur centrale quand les données sont ordonnées.",
        formula: "\\bar{x} = \\frac{\\sum x_i}{n}",
        example: "Captures de 5, 8, 3, 9, 5 poissons → moyenne = 30/5 = 6.",
      },
    ],
    exercises: [
      {
        id: "3s-quadratique",
        title: "La largeur du filet",
        context: "Un filet rectangulaire a une longueur de (x + 2) m et une largeur de x m. Son aire est 15 m².",
        prompt: "Quelle est la largeur x du filet ?",
        answerType: "math-input",
        expectedAnswer: "3",
        equation: "x(x+2) = 15",
        hintSteps: [
          "Développe : x² + 2x = 15.",
          "Équation : x² + 2x − 15 = 0.",
          "Δ = 4 + 60 = 64. √64 = 8. x = (−2 + 8) / 2 = 3.",
        ],
        solutionSteps: [
          "x² + 2x − 15 = 0.",
          "Δ = 4 + 60 = 64, √Δ = 8.",
          "x = (−2 + 8) / 2 = 3 m.",
        ],
        challenge: "Vérification : 3 × 5 = 15. Correct.",
      },
      {
        id: "3s-pythagore",
        title: "La traverse du marécage",
        context: "Pour traverser un marécage, un chasseur marche 9 m vers le nord puis 12 m vers l'est.",
        prompt: "Quelle est la distance en ligne droite jusqu'à son camp ?",
        answerType: "math-input",
        expectedAnswer: "15",
        equation: "c = \\sqrt{9^2 + 12^2}",
        hintSteps: [
          "Les deux chemins forment un angle droit.",
          "c² = 9² + 12² = 81 + 144 = 225.",
          "c = √225 = 15 m.",
        ],
        solutionSteps: [
          "c² = 81 + 144 = 225.",
          "c = √225 = 15 m.",
        ],
        challenge: "Reconnais-tu le triplet 3-4-5 multiplié par 3 ?",
      },
      {
        id: "3s-moyenne",
        title: "Les captures de la semaine",
        context: "Un pêcheur a capturé 8, 12, 6, 10 et 14 poissons sur cinq jours.",
        prompt: "Quelle est sa moyenne quotidienne de captures ?",
        answerType: "math-input",
        expectedAnswer: "10",
        hintSteps: [
          "Additionne toutes les captures : 8 + 12 + 6 + 10 + 14.",
          "Divise par le nombre de jours.",
        ],
        solutionSteps: [
          "Somme : 8 + 12 + 6 + 10 + 14 = 50.",
          "Moyenne : 50 ÷ 5 = 10 poissons/jour.",
        ],
        challenge: "Quel jour le pêcheur a-t-il fait le moins bien par rapport à la moyenne ?",
      },
      {
        id: "3s-factorisation",
        title: "Partage des terrains",
        context: "Un terrain de surface (x² − 9) m² doit être partagé. La largeur est (x − 3) m.",
        prompt: "Quelle est la longueur en fonction de x ?",
        answerType: "math-input",
        expectedAnswer: ["x+3", "x + 3"],
        equation: "x^2 - 9 = (x-3)(x+3)",
        hintSteps: [
          "x² − 9 est une différence de deux carrés.",
          "a² − b² = (a − b)(a + b).",
          "x² − 9 = (x − 3)(x + 3).",
        ],
        solutionSteps: [
          "x² − 9 = (x − 3)(x + 3).",
          "Longueur = (x + 3) m.",
        ],
        challenge: "Si x = 5 m, quelle est l'aire totale du terrain ?",
      },
      {
        id: "3s-delta-nul",
        title: "L'équation parfaite",
        context: "Un terrain carré de côté (x − 3) a une aire de x² − 6x + 9 m².",
        prompt: "Pour quelle valeur de x l'équation x² − 6x + 9 = 0 a-t-elle une solution double ?",
        answerType: "math-input",
        expectedAnswer: "3",
        equation: "x^2 - 6x + 9 = (x-3)^2 = 0",
        hintSteps: [
          "Calcule Δ = b² − 4ac avec a=1, b=−6, c=9.",
          "Δ = 36 − 36 = 0 : solution double.",
          "x = −b/(2a) = 6/2 = 3.",
        ],
        solutionSteps: [
          "Δ = (−6)² − 4×1×9 = 36 − 36 = 0.",
          "x = 6/(2×1) = 3.",
          "Solution double : x = 3.",
        ],
        challenge: "Factorise x² − 6x + 9 directement.",
      },
      {
        id: "3s-diagonale",
        title: "La diagonale du grenier",
        context: "Un grenier rectangulaire mesure 5 m de long et 12 m de large.",
        prompt: "Quelle est la longueur de sa diagonale en mètres ?",
        answerType: "math-input",
        expectedAnswer: "13",
        equation: "d = \\sqrt{5^2 + 12^2}",
        hintSteps: [
          "La diagonale est l'hypoténuse du triangle rectangle formé.",
          "d² = 5² + 12² = 25 + 144.",
          "d = √169 = 13.",
        ],
        solutionSteps: [
          "d² = 25 + 144 = 169.",
          "d = √169 = 13 m.",
        ],
        challenge: "Reconnais-tu le triplet pythagoricien 5-12-13 ?",
      },
      {
        id: "3s-hauteur-arbre",
        title: "La hauteur de l'arbre sacré",
        context: "Un arbre sacré projette son ombre à 8 m. Depuis l'extrémité de l'ombre, un fil tendu jusqu'au sommet de l'arbre mesure 10 m.",
        prompt: "Quelle est la hauteur de l'arbre en mètres ?",
        answerType: "math-input",
        expectedAnswer: "6",
        equation: "h^2 + 8^2 = 10^2",
        hintSteps: [
          "Le sol, l'arbre et le fil forment un triangle rectangle.",
          "h² + 64 = 100.",
          "h² = 36 → h = 6.",
        ],
        solutionSteps: [
          "h² = 100 − 64 = 36.",
          "h = √36 = 6 m.",
        ],
        challenge: "Reconnais-tu le triplet 6-8-10 (= 2 × 3-4-5) ?",
      },
      {
        id: "3s-mediane",
        title: "La médiane des pêches",
        context: "Un pêcheur a capturé ces quantités cette semaine, dans l'ordre : 4, 7, 9, 11, 14 poissons.",
        prompt: "Quelle est la médiane de cette série ?",
        answerType: "math-input",
        expectedAnswer: "9",
        hintSteps: [
          "La série est déjà ordonnée : 4, 7, 9, 11, 14.",
          "La médiane est la valeur centrale.",
          "5 valeurs → la 3ème est centrale.",
        ],
        solutionSteps: [
          "Série ordonnée : 4, 7, 9, 11, 14.",
          "5 valeurs → valeur centrale à la position 3.",
          "Médiane = 9.",
        ],
        challenge: "Si on ajoute une capture de 20 poissons, quelle devient la médiane ?",
      },
      {
        id: "3s-mode",
        title: "Le mode des espèces",
        context: "Un pêcheur note les espèces capturées : tilapia, carpe, tilapia, silure, tilapia, carpe, tilapia.",
        prompt: "Quelle espèce est le mode (la plus fréquente) ?",
        answerType: "choice",
        expectedAnswer: "tilapia",
        choices: [
          { label: "Tilapia", value: "tilapia" },
          { label: "Carpe", value: "carpe" },
          { label: "Silure", value: "silure" },
        ],
        hintSteps: [
          "Compte les occurrences de chaque espèce.",
          "Tilapia : 4 fois. Carpe : 2 fois. Silure : 1 fois.",
          "Le mode est la valeur qui apparaît le plus souvent.",
        ],
        solutionSteps: [
          "Tilapia : 4 captures. Carpe : 2. Silure : 1.",
          "Le mode est tilapia (4 fois).",
        ],
        challenge: "Si on capture 2 carpes de plus, le mode change-t-il ?",
      },
      {
        id: "3s-ecart-moyenne",
        title: "L'écart à la moyenne",
        context: "Les températures du mois (en °C) sont : 24, 27, 25, 28, 26. La moyenne est 26°C.",
        prompt: "Quelle est la température qui s'écarte le plus de la moyenne ?",
        answerType: "math-input",
        expectedAnswer: "24",
        hintSteps: [
          "Calcule l'écart de chaque valeur avec 26.",
          "|24-26|=2, |27-26|=1, |25-26|=1, |28-26|=2, |26-26|=0.",
          "Les valeurs 24 et 28 s'écartent de 2. La plus petite est 24.",
        ],
        solutionSteps: [
          "Écarts : 2, 1, 1, 2, 0.",
          "Maximum : 2, pour 24°C et 28°C.",
          "La plus basse (24°C) est celle qui s'écarte le plus vers le bas.",
        ],
        challenge: "Calcule la moyenne des écarts absolus.",
      },
      {
        id: "3s-deux-solutions",
        title: "Les deux dimensions du camp",
        context: "Un camp a une longueur (x + 3) et une largeur (x − 1). Son aire est 21 m².",
        prompt: "Quelle est la valeur positive de x ?",
        answerType: "math-input",
        expectedAnswer: "4",
        equation: "(x+3)(x-1) = 21",
        hintSteps: [
          "Développe : x² + 2x − 3 = 21.",
          "x² + 2x − 24 = 0.",
          "Δ = 4 + 96 = 100. x = (−2 + 10)/2 = 4.",
        ],
        solutionSteps: [
          "x² + 2x − 24 = 0.",
          "Δ = 100, √Δ = 10.",
          "x = (−2 + 10)/2 = 4 (on retient la valeur positive).",
        ],
        challenge: "Quelles sont les dimensions du camp ? (longueur × largeur)",
      },
    ],
    courseSlug: "3e-secondaire",
    courseChapters: [
      {
        id: "ch1-quadratique",
        title: "Équations du 2nd degré",
        subtitle: "ax² + bx + c = 0 et le discriminant",
        exerciseIds: ["3s-quadratique", "3s-delta-nul", "3s-deux-solutions", "3s-factorisation"],
        sakataContext: "L'aire d'un champ en fonction de sa largeur inconnue donne une équation du 2nd degré — les deux solutions possibles correspondent aux deux orientations du problème.",
        visualizations: [
          { type: "discriminant-viz", title: "Discriminant et paraboles", description: "Faire varier Δ pour voir les 3 cas : deux intersections (Δ>0), tangente (Δ=0), aucune intersection réelle (Δ<0)" },
          { type: "parabola", title: "Graphe parabolique", description: "Voir la parabole y = ax² + bx + c et ses racines sur le plan" },
          { type: "coordinate-plane", title: "Plan cartésien", description: "Localiser graphiquement les racines x₁ et x₂ là où la parabole croise l'axe des abscisses" },
          { type: "equation-steps", title: "Méthode du discriminant", description: "Calculer Δ = b² − 4ac et appliquer la formule x = (−b ± √Δ) / 2a étape par étape" }
        ],
        theoryBlocks: [
          {
            title: "La forme générale ax² + bx + c = 0",
            explanation: "Une équation du 2nd degré contient un terme en x². Elle peut avoir 0, 1 ou 2 solutions réelles selon le discriminant. Le terme en x² doit avoir a ≠ 0.",
            formula: "ax^2 + bx + c = 0, \\quad a \\neq 0",
            example: "x² − 5x + 6 = 0 : a = 1, b = −5, c = 6. C'est une équation du 2nd degré.",
          },
          {
            title: "Le discriminant Δ = b² − 4ac",
            explanation: "Le discriminant détermine le nombre de solutions : Δ > 0 → deux solutions, Δ = 0 → une solution double, Δ < 0 → pas de solution réelle.",
            formula: "\\Delta = b^2 - 4ac",
            example: "x² − 5x + 6 : Δ = 25 − 24 = 1 > 0 → deux solutions. x² − 4x + 4 : Δ = 16 − 16 = 0 → une solution double.",
          },
          {
            title: "La formule des solutions",
            explanation: "Quand Δ ≥ 0, les solutions sont données par la formule quadratique. Le ± donne les deux solutions possibles.",
            formula: "x_{1,2} = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}",
            example: "x² − 5x + 6 = 0 : x₁ = (5 + 1)/2 = 3, x₂ = (5 − 1)/2 = 2.",
          },
          {
            title: "Factorisation d'une équation du 2nd degré",
            explanation: "Quand les racines x₁ et x₂ sont connues, on peut écrire ax² + bx + c = a(x − x₁)(x − x₂). C'est la forme factorisée, utile pour résoudre ou simplifier.",
            formula: "ax^2 + bx + c = a(x - x_1)(x - x_2)",
            example: "x² − 5x + 6 = (x − 2)(x − 3). Pour trouver où c'est nul : x = 2 ou x = 3.",
          },
          {
            title: "Différence de deux carrés",
            explanation: "La formule a² − b² = (a − b)(a + b) est un cas particulier de factorisation très utile. Elle permet de factoriser directement sans passer par le discriminant.",
            formula: "a^2 - b^2 = (a-b)(a+b)",
            example: "x² − 9 = x² − 3² = (x − 3)(x + 3). L'aire d'un terrain de côté x moins 9 se factorise ainsi.",
          },
        ],
      },
      {
        id: "ch2-pythagore",
        title: "Théorème de Pythagore",
        subtitle: "Distances, triangles rectangles, triplets",
        exerciseIds: ["3s-pythagore", "3s-diagonale", "3s-hauteur-arbre"],
        sakataContext: "Pour traverser un marécage sans s'y aventurer, le chasseur Sakata calcule la distance diagonale à partir des deux distances accessibles — c'est Pythagore en pratique.",
        visualizations: [
          { type: "pythagorean-squares", title: "Carrés de Pythagore", description: "Voir visuellement que l'aire du grand carré (c²) égale la somme des deux petits (a² + b²)" },
          { type: "angle-measurer", title: "L'angle droit", description: "Identifier l'angle droit à 90° — la condition nécessaire pour appliquer le théorème de Pythagore" },
          { type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer les cathètes a et b pour calculer l'hypoténuse c = √(a² + b²)" },
          { type: "coordinate-plane", title: "Distance entre deux points", description: "Calculer la distance entre deux points (x₁,y₁) et (x₂,y₂) avec Pythagore sur le plan cartésien" }
        ],
        theoryBlocks: [
          {
            title: "Le triangle rectangle",
            explanation: "Un triangle rectangle contient un angle de 90°. Le côté opposé à cet angle est l'hypoténuse — le plus long des trois côtés. Les deux autres côtés s'appellent les cathètes.",
            formula: "\\text{Angle droit} \\rightarrow \\text{hypoténuse = côté le plus long}",
            example: "Le sol, le mur et l'échelle forment un triangle rectangle. Le mur et le sol sont les cathètes, l'échelle est l'hypoténuse.",
          },
          {
            title: "Le théorème de Pythagore",
            explanation: "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux cathètes. Ce théorème permet de calculer n'importe quel côté à partir des deux autres.",
            formula: "c^2 = a^2 + b^2",
            example: "Triangle 3-4-5 : 3² + 4² = 9 + 16 = 25 = 5². C'est un triplet pythagoricien classique.",
          },
          {
            title: "Calculer l'hypoténuse",
            explanation: "Quand les deux cathètes a et b sont connues, on calcule c = √(a² + b²). On simplifie si possible.",
            formula: "c = \\sqrt{a^2 + b^2}",
            example: "Cathètes 9 m et 12 m : c = √(81 + 144) = √225 = 15 m.",
          },
          {
            title: "Calculer une cathète",
            explanation: "Quand l'hypoténuse et une cathète sont connues, on isole l'autre cathète : a² = c² − b², donc a = √(c² − b²).",
            formula: "a = \\sqrt{c^2 - b^2}",
            example: "Hypoténuse 10 m, cathète 8 m : a = √(100 − 64) = √36 = 6 m.",
          },
          {
            title: "Les triplets pythagoriciens",
            explanation: "Un triplet pythagoricien est un ensemble de trois entiers (a, b, c) tels que a² + b² = c². Les connaître permet de reconnaître instantanément les triangles rectangles.",
            formula: "(3,4,5), \\; (5,12,13), \\; (8,15,17), \\; (7,24,25)",
            example: "Un filet de 5 m tendu entre deux piquets à 3 m et 4 m forme automatiquement un angle droit : c'est le triplet 3-4-5.",
          },
        ],
      },
      {
        id: "ch3-statistiques",
        title: "Statistiques descriptives",
        subtitle: "Organiser, résumer, interpréter les données",
        exerciseIds: ["3s-moyenne", "3s-mediane", "3s-mode", "3s-ecart-moyenne"],
        sakataContext: "Un chef de village qui suit les captures journalières de ses pêcheurs fait de la statistique — il cherche la tendance centrale, les jours exceptionnels, et les variations.",
        visualizations: [
          { type: "histogram", title: "Histogramme de fréquences", description: "Distribution des poids de poissons capturés par tranches — modifier les effectifs et voir la moyenne, médiane et mode recalculés en temps réel" },
          { type: "scatter-plot", title: "Nuage de points", description: "Visualiser la relation entre jours de pêche et quantité capturée — afficher la droite de tendance" },
          { type: "statistics-bars", title: "Diagramme en barres", description: "Comparer les captures journalières avec un repère visuel de la moyenne" },
          { type: "pie-chart", title: "Répartition par espèce", description: "Visualiser la proportion de chaque espèce pêchée sous forme de camembert" }
        ],
        theoryBlocks: [
          {
            title: "La moyenne arithmétique",
            explanation: "La moyenne est la valeur que chaque donnée aurait si toutes étaient égales. On divise la somme totale par le nombre de données.",
            formula: "\\bar{x} = \\frac{x_1 + x_2 + \\cdots + x_n}{n}",
            example: "Captures : 8, 12, 6, 10, 14. Somme = 50. Moyenne = 50 ÷ 5 = 10 poissons/jour.",
          },
          {
            title: "La médiane",
            explanation: "La médiane est la valeur centrale d'une série ordonnée. Elle partage les données en deux moitiés égales. Pour n impair : valeur à la position (n+1)/2. Pour n pair : moyenne des deux valeurs centrales.",
            formula: "\\tilde{x} = \\text{valeur centrale (série ordonnée)}",
            example: "Série ordonnée : 4, 7, 9, 11, 14. 5 valeurs → médiane = 3ème valeur = 9.",
          },
          {
            title: "Le mode",
            explanation: "Le mode est la valeur la plus fréquente dans une série. Une série peut avoir plusieurs modes (bimodale, multimodale) ou pas de mode si toutes les valeurs sont différentes.",
            formula: "\\text{mode} = \\text{valeur la plus fréquente}",
            example: "Espèces : tilapia, carpe, tilapia, silure, tilapia → mode = tilapia (3 fois).",
          },
          {
            title: "Quelle mesure choisir ?",
            explanation: "La moyenne est sensible aux valeurs extrêmes (une capture exceptionnelle la fausse). La médiane est plus robuste. Le mode convient aux données qualitatives ou aux valeurs très répétées.",
            formula: "\\text{Extrêmes} \\rightarrow \\text{médiane}, \\quad \\text{Qualitatif} \\rightarrow \\text{mode}",
            example: "Si un pêcheur capture 100 poissons un jour exceptionnel, la moyenne est faussée. La médiane reflète mieux la performance habituelle.",
          },
          {
            title: "Tableaux et fréquences",
            explanation: "Un tableau de fréquences organise les données : on liste chaque valeur, on compte ses occurrences et on calcule sa fréquence relative (proportion du total). La somme des fréquences = 1 (ou 100%).",
            formula: "f_i = \\frac{n_i}{n}, \\quad \\sum f_i = 1",
            example: "10 pêches : 4 tilapias, 3 carpes, 2 silures, 1 capitaine → fréquences : 40%, 30%, 20%, 10%.",
          },
        ],
      },
      {
        id: "ch4-diagrammes",
        title: "Représentation graphique",
        subtitle: "Lire et construire des diagrammes",
        exerciseIds: [],
        sakataContext: "Les relevés de capture au fil des saisons, tracés sur un graphique, révèlent les cycles naturels des poissons dans la Lukenie — la statistique visuelle est un outil de gestion des ressources.",
        visualizations: [
          { type: "scatter-plot", title: "Nuage de points", description: "10 points — jours en mer vs kg pêchés — avec droite de régression pour dégager la tendance générale" },
          { type: "histogram", title: "Histogramme de distribution", description: "Distribuer les captures par intervalles et lire la forme de la distribution : symétrique, étalée, concentrée" },
          { type: "statistics-bars", title: "Diagramme en bâtons", description: "Représenter les captures quotidiennes sous forme de barres comparatives" },
          { type: "coordinate-plane", title: "Graphique personnalisé", description: "Placer manuellement des points de données sur le plan cartésien pour construire votre propre diagramme" }
        ],
        theoryBlocks: [
          {
            title: "Le diagramme en bâtons",
            explanation: "Pour des données discrètes (nombre entier de poissons, d'élèves…), le diagramme en bâtons représente chaque valeur par une barre verticale dont la hauteur est la fréquence.",
            formula: "\\text{Hauteur} = \\text{fréquence ou effectif}",
            example: "Captures par jour : lundi 5, mardi 8, mercredi 3, jeudi 9, vendredi 6 → 5 bâtons de hauteurs correspondantes.",
          },
          {
            title: "Le diagramme circulaire (camembert)",
            explanation: "Le cercle est divisé en secteurs dont les angles sont proportionnels aux fréquences. Un secteur représentant 25% occupe un angle de 0,25 × 360° = 90°.",
            formula: "\\text{Angle secteur} = f_i \\times 360°",
            example: "Tilapia 40% → angle = 144°. Carpe 30% → 108°. Silure 20% → 72°. Capitaine 10% → 36°.",
          },
          {
            title: "Le diagramme en courbe",
            explanation: "Pour des données évoluant dans le temps, on relie les points par une courbe. L'axe horizontal est le temps, l'axe vertical la valeur mesurée. La pente indique la tendance.",
            formula: "\\text{Pente positive} \\rightarrow \\text{croissance}, \\quad \\text{pente négative} \\rightarrow \\text{décroissance}",
            example: "Captures mensuelles tracées sur un an : on voit les pics de saison sèche et les creux de saison des pluies.",
          },
          {
            title: "Lire un graphique — tendances et anomalies",
            explanation: "Un bon lecteur de graphique identifie : la tendance générale (croissance, décroissance, stabilité), les points extrêmes (maximum, minimum) et les anomalies (valeurs isolées hors de la tendance).",
            formula: "\\text{Max, Min, Tendance, Anomalie}",
            example: "Si une courbe de captures est stable à 10/jour mais chute à 2 un mardi, c'est une anomalie à expliquer (tempête, fête, maladie).",
          },
          {
            title: "Interpréter les résultats",
            explanation: "Les statistiques ne parlent que si on les relie au contexte. Un chiffre isolé dit peu ; comparé à une moyenne, une période ou un groupe de référence, il prend sens.",
            formula: "\\text{Donnée} + \\text{contexte} = \\text{information}",
            example: "Une moyenne de 10 poissons/jour est bonne ou mauvaise selon la saison, la rivière, le type de filet utilisé.",
          },
        ],
      },
    ],
  },
  {
    slug: "4e-secondaire",
    title: "4e secondaire",
    degree: "Secondaire — 2e cycle",
    focus: "Trigonométrie, vecteurs, logarithmes",
    overview:
      "L'élève aborde les ratios trigonométriques, utilise les vecteurs pour décrire des déplacements et découvre les propriétés des logarithmes.",
    learningObjectives: [
      "Calculer sinus, cosinus et tangente dans un triangle rectangle.",
      "Représenter et additionner des vecteurs dans le plan.",
      "Utiliser les propriétés des logarithmes et résoudre des équations exponentielles simples.",
      "Résoudre des problèmes de navigation et d'orientation sur la rivière.",
    ],
    localContexts: ["angles de cap sur la Lukenie", "hauteurs d'arbres et de berges", "vitesses de courant", "croissance de récoltes"],
    theoryBlocks: [
      {
        title: "Les ratios trigonométriques",
        explanation:
          "Dans un triangle rectangle d'angle θ, le sinus est le rapport du côté opposé à l'hypoténuse, le cosinus du côté adjacent à l'hypoténuse.",
        formula: "\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}, \\quad \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}",
        example: "Pour un angle de 30° : sin 30° = 0,5 et cos 30° = √3/2.",
      },
      {
        title: "Les vecteurs et leurs propriétés",
        explanation:
          "Un vecteur représente un déplacement défini par une direction, un sens et une longueur. On additionne des vecteurs bout à bout.",
        formula: "\\vec{AB} + \\vec{BC} = \\vec{AC}",
        example: "Remonter 3 km nord puis 4 km est revient à un déplacement diagonal de 5 km.",
      },
      {
        title: "Le logarithme décimal",
        explanation:
          "log(x) est l'exposant auquel il faut élever 10 pour obtenir x. Il permet de simplifier les calculs sur de très grands nombres.",
        formula: "\\log(10^n) = n, \\quad \\log(a \\times b) = \\log a + \\log b",
        example: "log(100) = 2 car 10² = 100.",
      },
    ],
    exercises: [
      {
        id: "4s-hauteur-arbre",
        title: "La hauteur du fromager",
        context: "Un chasseur s'éloigne de 20 m d'un fromager et lève les yeux à 60° pour voir sa cime.",
        prompt: "Quelle est la hauteur approximative du fromager ? (tan 60° ≈ 1,73)",
        answerType: "math-input",
        expectedAnswer: ["34.6", "34,6", "34"],
        equation: "h = 20 \\times \\tan(60°)",
        hintSteps: [
          "La tangente relie la hauteur (côté opposé) à la distance (côté adjacent).",
          "tan θ = h / distance, donc h = distance × tan θ.",
          "h = 20 × 1,73 = 34,6 m.",
        ],
        solutionSteps: [
          "tan 60° = h / 20.",
          "h = 20 × tan 60° = 20 × 1,73.",
          "h ≈ 34,6 m.",
        ],
        challenge: "Si le chasseur se place à 30 m, quelle serait la hauteur calculée ?",
      },
      {
        id: "4s-vecteur",
        title: "La navigation sur la Lukenie",
        context: "Une pirogue remonte 5 km vers le nord puis dérive 12 km vers l'est à cause du courant.",
        prompt: "Quelle est la distance totale parcourue en ligne droite depuis le départ ?",
        answerType: "math-input",
        expectedAnswer: "13",
        equation: "d = \\sqrt{5^2 + 12^2}",
        hintSteps: [
          "Les deux déplacements sont perpendiculaires : triangle rectangle.",
          "d² = 5² + 12² = 25 + 144 = 169.",
          "d = √169 = 13 km.",
        ],
        solutionSteps: [
          "Le vecteur résultant a pour norme : d² = 5² + 12² = 169.",
          "d = √169 = 13 km.",
          "La pirogue est à 13 km de son point de départ.",
        ],
        challenge: "Quel angle fait la trajectoire réelle avec le nord ?",
      },
      {
        id: "4s-log",
        title: "La croissance de la récolte",
        context: "Une récolte triple chaque année. Au départ, elle est de 10 unités. On cherche après combien d'années elle atteindra 810 unités.",
        prompt: "Après combien d'années la récolte atteint-elle 810 unités ?",
        answerType: "math-input",
        expectedAnswer: "4",
        equation: "10 \\times 3^n = 810",
        hintSteps: [
          "10 × 3ⁿ = 810, donc 3ⁿ = 81.",
          "Essaie : 3¹=3, 3²=9, 3³=27, 3⁴=81.",
          "n = 4 ans.",
        ],
        solutionSteps: [
          "3ⁿ = 810 ÷ 10 = 81.",
          "3⁴ = 81.",
          "La récolte atteint 810 unités après 4 ans.",
        ],
        challenge: "En utilisant log : n = log(81) / log(3). Calcule.",
      },
      {
        id: "4s-sin",
        title: "La pente de la berge",
        context: "Une berge inclinée à 30° par rapport à l'horizontale mesure 10 m de longueur.",
        prompt: "Quelle est la hauteur verticale de la berge ? (sin 30° = 0,5)",
        answerType: "math-input",
        expectedAnswer: "5",
        equation: "h = 10 \\times \\sin(30°)",
        hintSteps: [
          "sin θ = côté opposé / hypoténuse.",
          "h = 10 × sin(30°).",
          "h = 10 × 0,5 = 5 m.",
        ],
        solutionSteps: [
          "sin(30°) = h / 10.",
          "h = 10 × 0,5 = 5 m.",
          "La berge a une hauteur verticale de 5 m.",
        ],
        challenge: "Calcule la distance horizontale au sol avec cos(30°) ≈ 0,866.",
      },
    ],
    courseSlug: "4e-secondaire",
    courseChapters: [
      {
        id: "4s-ch1-trigo",
        title: "Trigonométrie fondamentale",
        subtitle: "sin, cos, tan — les ratios du triangle rectangle",
        exerciseIds: ["4s-hauteur-arbre", "4s-sin"],
        sakataContext: "Les batteurs de tam-tam règlent l'angle de leur instrument avec précision — sin, cos et tan décrivent ces proportions exactes dans tout triangle rectangle.",
        visualizations: [
          { type: "angle-triangle", title: "Triangle rectangle interactif", description: "Faire varier l'angle θ pour voir sin, cos, tan évoluer en temps réel" },
          { type: "coordinate-plane", title: "Cercle trigonométrique", description: "Visualiser sin et cos comme les coordonnées d'un point sur le cercle unité" },
          { type: "slope-explorer", title: "Tangente comme pente", description: "La tangente est la pente de la droite — relier trigonométrie et fonctions affines" },
          { type: "scatter-plot", title: "Table des valeurs", description: "Valeurs de sin/cos/tan pour 0°, 30°, 45°, 60°, 90° en points sur le plan" },
        ],
        theoryBlocks: [
          {
            title: "Les trois ratios trigonométriques",
            explanation: "Dans un triangle rectangle d'angle θ, le sinus est le rapport de la longueur du côté opposé à celle de l'hypoténuse. Le cosinus utilise le côté adjacent. La tangente est le rapport opposé/adjacent.",
            formula: "\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}, \\quad \\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}, \\quad \\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}",
            example: "Pour θ = 30° : sin 30° = 0,5, cos 30° ≈ 0,866, tan 30° ≈ 0,577.",
          },
          {
            title: "Calculer une longueur inconnue",
            explanation: "On choisit le ratio qui relie l'angle connu aux côtés connus et inconnus. On pose l'équation et on résout pour le côté inconnu.",
            formula: "h = \\text{hyp} \\times \\sin\\theta \\quad \\text{ou} \\quad h = \\text{adj} \\times \\tan\\theta",
            example: "Un arbre vu à 60° depuis 20 m : h = 20 × tan 60° ≈ 20 × 1,73 = 34,6 m.",
          },
          {
            title: "Valeurs remarquables",
            explanation: "Certains angles ont des valeurs de sin, cos, tan exactes qu'il faut mémoriser : 30°, 45° et 60° apparaissent souvent dans les problèmes pratiques.",
            formula: "\\sin 30° = 0{,}5,\\; \\cos 60° = 0{,}5,\\; \\tan 45° = 1",
            example: "Un toit incliné à 45° a la même montée que son avancée horizontale, car tan 45° = 1.",
          },
        ],
      },
      {
        id: "4s-ch2-trigo-identites",
        title: "Identités trigonométriques",
        subtitle: "Cycles saisonniers et équations",
        exerciseIds: ["4s-hauteur-arbre", "4s-sin"],
        sakataContext: "Les cycles saisonniers Sakata — saison sèche, saison des pluies — se répètent comme les fonctions trigonométriques. Les identités permettent de simplifier et résoudre des équations périodiques.",
        visualizations: [
          { type: "function-plot", title: "Graphe de sin et cos", description: "Tracer y = sin(x) et y = cos(x) sur [0°, 360°] — observer la période et l'amplitude" },
          { type: "angle-triangle", title: "Identité fondamentale", description: "Vérifier sin²θ + cos²θ = 1 pour tout angle" },
          { type: "coordinate-plane", title: "Cercle unité", description: "Le cercle de rayon 1 : chaque angle produit un point (cos θ, sin θ)" },
        ],
        theoryBlocks: [
          {
            title: "L'identité fondamentale",
            explanation: "Pour tout angle θ, la somme des carrés de sin et cos vaut toujours 1. Cette propriété découle directement du théorème de Pythagore appliqué au cercle unité.",
            formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
            example: "Pour θ = 30° : sin²30° + cos²30° = 0,25 + 0,75 = 1. ✓",
          },
          {
            title: "Résoudre une équation trigonométrique simple",
            explanation: "Une équation comme sin x = 0,5 a des solutions multiples. On cherche d'abord l'angle principal puis on utilise la symétrie de la fonction pour trouver toutes les solutions dans [0°, 360°].",
            formula: "\\sin x = 0{,}5 \\Rightarrow x = 30° \\text{ ou } x = 150°",
            example: "sin x = 0,5 : premier angle 30°, et par symétrie 180° − 30° = 150°.",
          },
        ],
      },
      {
        id: "4s-ch3-logarithmes",
        title: "Logarithmes et exposants",
        subtitle: "Mesurer les distances fluviales",
        exerciseIds: ["4s-log"],
        sakataContext: "Les explorateurs Sakata estimaient les distances fluviales en calculant les durées de voyage. Les logarithmes permettent de retrouver un exposant inconnu — combien d'étapes pour doubler une distance ?",
        visualizations: [
          { type: "function-plot", title: "Courbe exponentielle vs logarithme", description: "Tracer y = 10ˣ et y = log(x) — observer la symétrie par rapport à y = x" },
          { type: "scatter-plot", title: "Croissance exponentielle", description: "Points de croissance 1, 10, 100, 1000 : l'échelle logarithmique les rend lisibles" },
          { type: "coordinate-plane", title: "Graphe du logarithme", description: "y = log(x) : croissance lente, toujours positive pour x > 1" },
        ],
        theoryBlocks: [
          {
            title: "Le logarithme — inverser la puissance",
            explanation: "log₁₀(x) répond à la question : à quelle puissance faut-il élever 10 pour obtenir x ? C'est l'opération inverse de l'exponentiation en base 10.",
            formula: "\\log_{10}(10^n) = n, \\quad 10^{\\log(x)} = x",
            example: "log(1000) = 3 car 10³ = 1000. log(0,01) = −2 car 10⁻² = 0,01.",
          },
          {
            title: "Propriétés des logarithmes",
            explanation: "Le logarithme transforme les multiplications en additions et les puissances en multiplications — ce qui simplifie les grands calculs.",
            formula: "\\log(ab) = \\log a + \\log b, \\quad \\log(a^n) = n\\log a",
            example: "log(300) = log(3 × 100) = log 3 + log 100 = log 3 + 2 ≈ 0,477 + 2 = 2,477.",
          },
          {
            title: "Résoudre une équation exponentielle",
            explanation: "Pour résoudre aˣ = b, on prend le logarithme des deux membres et on isole x grâce aux propriétés.",
            formula: "a^x = b \\Rightarrow x = \\frac{\\log b}{\\log a}",
            example: "3ⁿ = 81 : n = log(81)/log(3) = 4 × log(3) / log(3) = 4.",
          },
        ],
      },
      {
        id: "4s-ch4-geo-analytique",
        title: "Géométrie analytique",
        subtitle: "Droites et distances — cartographie des chefferies",
        exerciseIds: ["4s-vecteur"],
        sakataContext: "Les chefs Sakata délimitaient leurs territoires par des frontières naturelles. La géométrie analytique permet de calculer exactement la distance entre deux points ou de trouver l'équation d'une frontière.",
        visualizations: [
          { type: "coordinate-plane", title: "Plan cartésien", description: "Tracer des droites, mesurer des distances et lire les coordonnées de points" },
          { type: "slope-explorer", title: "Équation de droite", description: "Modifier pente et ordonnée pour construire l'équation y = ax + b" },
          { type: "scatter-plot", title: "Distance entre points", description: "Deux points sur le plan — calculer la distance avec Pythagore" },
        ],
        theoryBlocks: [
          {
            title: "Distance entre deux points",
            explanation: "La distance entre deux points A(x₁, y₁) et B(x₂, y₂) est la longueur du segment AB, calculée grâce au théorème de Pythagore.",
            formula: "d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}",
            example: "Distance entre A(1, 2) et B(4, 6) : d = √((4−1)² + (6−2)²) = √(9 + 16) = 5.",
          },
          {
            title: "Milieu d'un segment",
            explanation: "Le milieu M du segment [AB] a pour coordonnées la moyenne de celles de A et B.",
            formula: "M = \\left(\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2}\\right)",
            example: "Milieu de A(2, 4) et B(8, 10) : M = (5, 7).",
          },
        ],
      },
      {
        id: "4s-ch5-vecteurs",
        title: "Vecteurs dans le plan",
        subtitle: "Trajectoires de pirogues",
        exerciseIds: ["4s-vecteur"],
        sakataContext: "Une pirogue remonte la rivière contre le courant. Sa trajectoire est la somme vectorielle de sa vitesse propre et du courant. Les vecteurs décrivent avec précision chaque déplacement.",
        visualizations: [
          { type: "coordinate-plane", title: "Vecteurs sur le plan", description: "Représenter un vecteur par une flèche — visualiser l'addition bout à bout" },
          { type: "scatter-plot", title: "Résultante", description: "Deux vecteurs et leur somme — le triangle des forces" },
          { type: "angle-triangle", title: "Norme et angle", description: "Calculer la norme (longueur) d'un vecteur et son angle avec l'axe horizontal" },
        ],
        theoryBlocks: [
          {
            title: "Définition d'un vecteur",
            explanation: "Un vecteur est défini par une direction, un sens et une longueur (norme). Il représente un déplacement. Deux vecteurs sont égaux si et seulement si ils ont la même direction, le même sens et la même norme.",
            formula: "\\vec{u} = \\begin{pmatrix} x \\\\ y \\end{pmatrix}, \\quad \\|\\vec{u}\\| = \\sqrt{x^2 + y^2}",
            example: "Vecteur nord de 5 km : (0, 5). Sa norme est 5 km.",
          },
          {
            title: "Addition de vecteurs",
            explanation: "On additionne les vecteurs en ajoutant leurs composantes. Géométriquement, on place les vecteurs bout à bout.",
            formula: "\\vec{u} + \\vec{v} = \\begin{pmatrix} x_1+x_2 \\\\ y_1+y_2 \\end{pmatrix}",
            example: "5 km nord + 12 km est = vecteur (12, 5). Norme = √(144 + 25) = 13 km.",
          },
        ],
      },
      {
        id: "4s-ch6-geo-espace",
        title: "Géométrie dans l'espace",
        subtitle: "Construction des greniers traditionnels",
        exerciseIds: ["4s-vecteur"],
        sakataContext: "Les greniers à grain Sakata ont une base carrée et un toit pyramidal. Calculer leur hauteur, leur surface et leur volume exige la géométrie dans l'espace — l'architecture comme mathématique vivante.",
        visualizations: [
          { type: "pythagorean-squares", title: "Pythagore en 3D", description: "Calculer la diagonale d'un prisme rectangulaire avec Pythagore en deux étapes" },
          { type: "angle-triangle", title: "Sections planes", description: "Couper un solide par un plan — voir la section résultante" },
          { type: "coordinate-plane", title: "Projections", description: "Projection orthogonale d'un point 3D sur le plan XY" },
        ],
        theoryBlocks: [
          {
            title: "Volumes des solides usuels",
            explanation: "Chaque solide a une formule de volume. Le prisme (parallélépipède) : base × hauteur. La pyramide : (base × hauteur) / 3.",
            formula: "V_{\\text{prisme}} = B \\times h, \\quad V_{\\text{pyramide}} = \\frac{B \\times h}{3}",
            example: "Grenier cubique de 2 m de côté : V = 2³ = 8 m³. Grenier pyramidal de base 4 m² et hauteur 3 m : V = 4 m.",
          },
          {
            title: "Diagonale d'un parallélépipède",
            explanation: "La grande diagonale d'un parallélépipède de dimensions a × b × c se calcule en appliquant Pythagore deux fois.",
            formula: "d = \\sqrt{a^2 + b^2 + c^2}",
            example: "Grenier 3 m × 4 m × 5 m : d = √(9 + 16 + 25) = √50 ≈ 7,07 m.",
          },
        ],
      },
    ],
  },
  {
    slug: "5e-secondaire",
    title: "5e secondaire",
    degree: "Secondaire — 2e cycle",
    focus: "Suites, exponentielles, statistiques avancées",
    overview:
      "L'élève étudie les suites arithmétiques et géométriques, maîtrise les fonctions exponentielles et logarithmiques, et analyse des données avec variance et écart-type.",
    learningObjectives: [
      "Identifier et calculer les termes d'une suite arithmétique ou géométrique.",
      "Résoudre des équations et inéquations exponentielles.",
      "Calculer la variance et l'écart-type d'une distribution.",
      "Modéliser des phénomènes naturels (croissance, décroissance) avec une loi exponentielle.",
    ],
    localContexts: ["croissance démographique de villages", "déclin des stocks de poissons", "épargne accumulée", "variations de récolte"],
    theoryBlocks: [
      {
        title: "La suite arithmétique",
        explanation:
          "Dans une suite arithmétique, on passe d'un terme au suivant en ajoutant toujours la même valeur, appelée raison.",
        formula: "u_n = u_0 + n \\cdot r",
        example: "Suite de captures : 5, 8, 11, 14 — raison r = 3.",
      },
      {
        title: "La suite géométrique",
        explanation:
          "Dans une suite géométrique, on multiplie chaque terme par la même valeur (la raison). Très utile pour modéliser la croissance.",
        formula: "u_n = u_0 \\times q^n",
        example: "Récolte doublant chaque saison : 100, 200, 400, 800 — raison q = 2.",
      },
      {
        title: "L'écart-type mesure la dispersion",
        explanation:
          "L'écart-type σ mesure à quel point les valeurs s'éloignent de la moyenne. Un σ faible signifie des données régulières.",
        formula: "\\sigma = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n}}",
        example: "Des captures très irrégulières ont un grand écart-type.",
      },
    ],
    exercises: [
      {
        id: "5s-suite-arith",
        title: "L'épargne mensuelle",
        context: "Un pêcheur épargne 500 F le premier mois, puis ajoute 200 F de plus chaque mois suivant.",
        prompt: "Combien épargne-t-il le 6e mois ?",
        answerType: "math-input",
        expectedAnswer: "1500",
        equation: "u_n = 500 + (n-1) \\times 200",
        hintSteps: [
          "Suite arithmétique de premier terme 500 et de raison 200.",
          "u₆ = 500 + (6 - 1) × 200.",
          "u₆ = 500 + 5 × 200 = 500 + 1 000 = 1 500.",
        ],
        solutionSteps: [
          "u₁ = 500, r = 200.",
          "u₆ = u₁ + (6 - 1) × r = 500 + 5 × 200 = 1 500 F.",
          "Il épargne 1 500 F le 6e mois.",
        ],
        challenge: "Quel est le total épargné après 6 mois ?",
      },
      {
        id: "5s-suite-geo",
        title: "La population du village",
        context: "Un village comptait 1 000 habitants il y a 3 ans et croît de 10 % chaque année.",
        prompt: "Combien d'habitants compte-t-il aujourd'hui ? (1,1³ ≈ 1,331)",
        answerType: "math-input",
        expectedAnswer: "1331",
        equation: "P = 1000 \\times 1{,}1^3",
        hintSteps: [
          "Suite géométrique : u₀ = 1 000, q = 1,1.",
          "u₃ = 1 000 × 1,1³.",
          "u₃ = 1 000 × 1,331 = 1 331.",
        ],
        solutionSteps: [
          "Chaque année, la population est multipliée par 1,1.",
          "Après 3 ans : 1 000 × 1,1³ = 1 000 × 1,331.",
          "Le village compte 1 331 habitants.",
        ],
        challenge: "En combien d'années la population doublera-t-elle ?",
      },
      {
        id: "5s-exponentielle",
        title: "Le déclin des stocks",
        context: "Les stocks de poissons d'un lac décroissent de 20 % par an. Le stock initial est 5 000 tonnes.",
        prompt: "Quel est le stock après 2 ans ? (0,8² = 0,64)",
        answerType: "math-input",
        expectedAnswer: "3200",
        equation: "S = 5000 \\times 0{,}8^2",
        hintSteps: [
          "Une perte de 20 % signifie qu'il reste 80 % = 0,8.",
          "Après 2 ans : S = 5 000 × 0,8².",
          "S = 5 000 × 0,64 = 3 200.",
        ],
        solutionSteps: [
          "Facteur annuel : 1 - 0,2 = 0,8.",
          "Après 2 ans : S = 5 000 × 0,8² = 5 000 × 0,64.",
          "S = 3 200 tonnes.",
        ],
        challenge: "Après combien d'années le stock sera-t-il inférieur à 1 000 tonnes ?",
      },
      {
        id: "5s-ecart-type",
        title: "La régularité des captures",
        context: "En cinq jours, un pêcheur a capturé 8, 10, 12, 10, 10 poissons. La moyenne est 10.",
        prompt: "Calcule l'écart-type (arrondi à l'unité).",
        answerType: "math-input",
        expectedAnswer: ["1", "2"],
        hintSteps: [
          "Calcule les écarts à la moyenne : (8-10)²=4, (10-10)²=0, (12-10)²=4, (10-10)²=0, (10-10)²=0.",
          "Somme des carrés : 4 + 0 + 4 + 0 + 0 = 8.",
          "Variance = 8/5 = 1,6 → σ = √1,6 ≈ 1,26 ≈ 1.",
        ],
        solutionSteps: [
          "Écarts² : 4, 0, 4, 0, 0. Somme = 8.",
          "Variance = 8 / 5 = 1,6.",
          "σ = √1,6 ≈ 1,26 ≈ 1 poisson.",
        ],
        challenge: "Que signifie un écart-type proche de 0 pour les captures ?",
      },
    ],
    courseSlug: "5e-secondaire",
    courseChapters: [
      {
        id: "5s-ch1-suites-arith",
        title: "Suites arithmétiques",
        subtitle: "Comptage des cycles de plantation",
        exerciseIds: ["5s-suite-arith"],
        sakataContext: "Les Basakata comptent les cycles de plantation en ajoutant chaque saison le même nombre de nouvelles parcelles — une progression arithmétique naturelle inscrite dans le calendrier agricole.",
        visualizations: [
          { type: "scatter-plot", title: "Nuage de points de la suite", description: "Tracer les termes (n, uₙ) — voir la disposition en droite des suites arithmétiques" },
          { type: "slope-explorer", title: "Raison comme pente", description: "La raison r est la pente de la droite uₙ = u₀ + n·r" },
          { type: "statistics-bars", title: "Barres des termes", description: "Visualiser les premiers termes comme des barres qui grandissent régulièrement" },
          { type: "number-line", title: "Droite numérique", description: "Les termes de la suite : points régulièrement espacés sur la droite" },
        ],
        theoryBlocks: [
          {
            title: "Définition d'une suite arithmétique",
            explanation: "Une suite arithmétique est une suite où on passe d'un terme au suivant en ajoutant toujours la même valeur constante, appelée raison r.",
            formula: "u_{n+1} = u_n + r, \\quad u_n = u_0 + n \\cdot r",
            example: "Épargne mensuelle : 500, 700, 900, 1 100 F — raison r = 200 F.",
          },
          {
            title: "Somme des premiers termes",
            explanation: "La somme des n premiers termes d'une suite arithmétique se calcule avec la formule de Gauss : on multiplie la demi-somme du premier et du dernier terme par le nombre de termes.",
            formula: "S_n = \\frac{n \\cdot (u_1 + u_n)}{2}",
            example: "Épargne sur 6 mois (500 à 1 500 F) : S = 6 × (500 + 1500) / 2 = 6 000 F.",
          },
          {
            title: "Identifier et construire",
            explanation: "Pour identifier une suite arithmétique, on vérifie que les différences successives sont constantes. Pour la construire, on a besoin du premier terme u₀ et de la raison r.",
            formula: "r = u_{n+1} - u_n = \\text{constante}",
            example: "Captures 5, 8, 11, 14 : différences = 3, 3, 3. Suite arithmétique de raison 3.",
          },
        ],
      },
      {
        id: "5s-ch2-suites-geo",
        title: "Suites géométriques",
        subtitle: "Croissance des populations de villages",
        exerciseIds: ["5s-suite-geo", "5s-exponentielle"],
        sakataContext: "La population d'un village Sakata qui croît de 10 % chaque année suit une suite géométrique. Cette loi de croissance multiplicative explique l'expansion rapide des communautés prospères.",
        visualizations: [
          { type: "scatter-plot", title: "Croissance exponentielle", description: "Points (n, uₙ) pour une suite géométrique — courbe exponentielle caractéristique" },
          { type: "function-plot", title: "Fonction exponentielle", description: "f(x) = u₀ × qˣ — variation selon la valeur de q (q>1 croissance, q<1 décroissance)" },
          { type: "statistics-bars", title: "Termes en barres", description: "Les barres multiplient par q à chaque étape : voir l'accélération de la croissance" },
        ],
        theoryBlocks: [
          {
            title: "Définition d'une suite géométrique",
            explanation: "Une suite géométrique est une suite où on passe d'un terme au suivant en multipliant toujours par la même valeur constante, appelée raison q.",
            formula: "u_{n+1} = u_n \\times q, \\quad u_n = u_0 \\times q^n",
            example: "Population d'un village : 1000, 1100, 1210, 1331 — raison q = 1,1.",
          },
          {
            title: "Croissance et décroissance",
            explanation: "Si q > 1, la suite est croissante (croissance). Si 0 < q < 1, elle est décroissante (déclin). Si q = 1, elle est constante.",
            formula: "q > 1 \\Rightarrow \\text{croissance}, \\quad 0 < q < 1 \\Rightarrow \\text{décroissance}",
            example: "Stocks de poisson avec q = 0,8 : décroissance de 20 % par an.",
          },
        ],
      },
      {
        id: "5s-ch3-limites",
        title: "Limite et continuité",
        subtitle: "Approches progressives des berges",
        exerciseIds: ["5s-exponentielle"],
        sakataContext: "Quand une pirogue approche progressivement de la berge sans jamais tout à fait l'atteindre, elle illustre intuitivement la notion de limite — une approche infinie vers une valeur précise.",
        visualizations: [
          { type: "function-plot", title: "Comportement à l'infini", description: "Observer comment f(x) se comporte quand x → +∞ ou x → −∞" },
          { type: "coordinate-plane", title: "Limites graphiques", description: "Asymptotes horizontales et verticales — les frontières que la courbe ne traverse jamais" },
          { type: "slope-explorer", title: "Convergence", description: "La suite 1/n → 0 : voir les points se rapprocher sans atteindre zéro" },
        ],
        theoryBlocks: [
          {
            title: "La notion de limite",
            explanation: "La limite d'une suite ou d'une fonction en un point est la valeur vers laquelle elle s'approche sans nécessairement l'atteindre. On note lim f(x) = L quand x tend vers une valeur.",
            formula: "\\lim_{n \\to \\infty} \\frac{1}{n} = 0, \\quad \\lim_{n \\to \\infty} q^n = 0 \\text{ si } |q| < 1",
            example: "La suite 1, 0,5, 0,25, 0,125... tend vers 0 mais ne l'atteint jamais.",
          },
          {
            title: "Asymptotes",
            explanation: "Une asymptote est une droite dont la courbe s'approche indéfiniment sans jamais la toucher. L'asymptote horizontale correspond à la limite en ±infini.",
            formula: "\\lim_{x \\to +\\infty} f(x) = L \\Rightarrow \\text{asymptote } y = L",
            example: "f(x) = 1/(1 + e⁻ˣ) tend vers 1 quand x → +∞ : asymptote y = 1.",
          },
        ],
      },
      {
        id: "5s-ch4-probabilites",
        title: "Probabilités et dénombrement",
        subtitle: "Jeux et divination traditionnels",
        exerciseIds: ["5s-ecart-type"],
        sakataContext: "La divination par les cauris Sakata utilise intuitivement le calcul des chances. Le dénombrement et les probabilités formalisent ces pratiques ancestrales de prédiction.",
        visualizations: [
          { type: "histogram", title: "Distribution de probabilité", description: "Fréquences relatives des résultats d'une expérience aléatoire" },
          { type: "scatter-plot", title: "Loi des grands nombres", description: "La fréquence converge vers la probabilité théorique quand n augmente" },
          { type: "venn", title: "Événements et intersections", description: "Probabilité d'union et d'intersection dans le diagramme de Venn" },
        ],
        theoryBlocks: [
          {
            title: "Vocabulaire des probabilités",
            explanation: "L'univers Ω est l'ensemble de tous les résultats possibles. Un événement est un sous-ensemble de Ω. La probabilité d'un événement est comprise entre 0 et 1.",
            formula: "P(A) = \\frac{\\text{cas favorables}}{\\text{cas totaux}}, \\quad 0 \\leq P(A) \\leq 1",
            example: "Lancer un cauri : Ω = {face, pile}. P(face) = 1/2.",
          },
          {
            title: "Dénombrement — arrangements et combinaisons",
            explanation: "Le dénombrement compte les façons d'organiser ou de choisir des éléments. Les combinaisons comptent des sélections sans ordre, les arrangements tiennent compte de l'ordre.",
            formula: "C_n^k = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
            example: "Choisir 3 pêcheurs parmi 6 : C₆³ = 6!/(3!×3!) = 20 façons.",
          },
        ],
      },
      {
        id: "5s-ch5-statistiques-avancees",
        title: "Statistiques — loi normale",
        subtitle: "Mesures anthropométriques de la communauté",
        exerciseIds: ["5s-ecart-type"],
        sakataContext: "Les mesures de taille et de poids des membres d'une communauté Sakata suivent une distribution normale. L'écart-type révèle la diversité naturelle du groupe.",
        visualizations: [
          { type: "histogram", title: "Distribution normale", description: "Histogramme de données réelles : observer la forme en cloche de la courbe normale" },
          { type: "statistics-bars", title: "Variance et écart-type", description: "Visualiser la dispersion des données autour de la moyenne" },
          { type: "scatter-plot", title: "Nuage de points", description: "Données individuelles et moyenne — voir les écarts à la moyenne" },
        ],
        theoryBlocks: [
          {
            title: "Variance et écart-type",
            explanation: "La variance est la moyenne des carrés des écarts à la moyenne. L'écart-type est sa racine carrée et s'exprime dans la même unité que les données.",
            formula: "\\sigma^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}, \\quad \\sigma = \\sqrt{\\sigma^2}",
            example: "Captures 8, 10, 12, 10, 10 — moyenne 10. Variance = 8/5 = 1,6. σ ≈ 1,26.",
          },
          {
            title: "La loi normale",
            explanation: "La courbe normale (en cloche) décrit de nombreuses données naturelles. 68 % des données se trouvent dans [μ − σ, μ + σ] et 95 % dans [μ − 2σ, μ + 2σ].",
            formula: "68\\% \\text{ dans } [\\mu-\\sigma, \\mu+\\sigma], \\quad 95\\% \\text{ dans } [\\mu-2\\sigma, \\mu+2\\sigma]",
            example: "Taille moyenne 170 cm, σ = 5 cm : 68 % des membres mesurent entre 165 et 175 cm.",
          },
        ],
      },
      {
        id: "5s-ch6-derivees",
        title: "Dérivées et optimisation",
        subtitle: "Maximiser les récoltes",
        exerciseIds: ["5s-suite-arith", "5s-suite-geo"],
        sakataContext: "Quel est l'espace de plantation optimal pour maximiser la récolte ? La dérivée trouve le point exact où le bénéfice est maximal — l'outil mathématique du cultivateur raisonné.",
        visualizations: [
          { type: "function-plot", title: "Courbe et tangente", description: "La dérivée est la pente de la tangente — visualiser comment elle varie le long de la courbe" },
          { type: "parabola", title: "Parabole et maximum", description: "f(x) = −x² + 8x : trouver graphiquement le sommet puis le confirmer par la dérivée" },
          { type: "coordinate-plane", title: "Zéros de la dérivée", description: "f'(x) = 0 correspond aux extrema : points hauts et bas de la courbe" },
        ],
        theoryBlocks: [
          {
            title: "La dérivée — définition intuitive",
            explanation: "La dérivée f'(x) mesure le taux de variation instantané de la fonction en x. C'est la pente de la tangente à la courbe en ce point.",
            formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}",
            example: "Si f(x) = x², alors f'(x) = 2x. En x = 3, la pente vaut 6 : la courbe monte rapidement.",
          },
          {
            title: "Règles de dérivation",
            explanation: "La dérivée d'un polynôme se calcule terme par terme : la dérivée de xⁿ est nxⁿ⁻¹, et le coefficient se garde.",
            formula: "(x^n)' = nx^{n-1}, \\quad (ax)' = a, \\quad c' = 0",
            example: "f(x) = −x² + 8x : f'(x) = −2x + 8.",
          },
          {
            title: "Extrema — maximum et minimum",
            explanation: "Un extremum local se produit là où f'(x) = 0 et où la dérivée change de signe. Si f' passe de + à −, c'est un maximum ; de − à +, c'est un minimum.",
            formula: "f'(x_0) = 0 \\text{ et signe change} \\Rightarrow \\text{extremum}",
            example: "f(x) = −x² + 8x : f'(x) = 0 pour x = 4. La récolte est maximale pour 4 unités plantées.",
          },
        ],
      },
    ],
  },
  {
    slug: "6e-secondaire",
    title: "6e secondaire",
    degree: "Secondaire — Terminal",
    focus: "Dérivées, intégrales, probabilités et synthèse",
    overview:
      "L'année terminale consolide l'ensemble du programme et ouvre la porte au calcul différentiel et intégral, aux probabilités avancées et à la modélisation mathématique.",
    learningObjectives: [
      "Calculer et interpréter la dérivée d'une fonction polynomiale.",
      "Calculer une intégrale simple et interpréter l'aire sous une courbe.",
      "Utiliser les probabilités conditionnelles et la loi binomiale.",
      "Modéliser une situation complexe, rédiger une solution complète et la défendre.",
    ],
    localContexts: ["optimisation de filets", "aires de parcelles irrégulières", "probabilités de marché", "maximisation de récolte"],
    theoryBlocks: [
      {
        title: "La dérivée mesure la variation instantanée",
        explanation:
          "La dérivée d'une fonction en un point donne la pente de la tangente. Elle indique si la fonction croît ou décroît.",
        formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        example: "Si f(x) = x², alors f'(x) = 2x. Au point x = 3, la pente est 6.",
      },
      {
        title: "L'intégrale calcule une aire",
        explanation:
          "L'intégrale définie d'une fonction positive sur [a, b] correspond à l'aire sous la courbe, utile pour estimer une surface irrégulière.",
        formula: "\\int_a^b f(x)\\,dx",
        example: "L'aire sous la courbe y = x de 0 à 4 est ∫₀⁴ x dx = [x²/2]₀⁴ = 8.",
      },
      {
        title: "La probabilité conditionnelle",
        explanation:
          "P(A|B) est la probabilité que A se produise sachant que B a déjà eu lieu. Elle modifie la probabilité initiale selon l'information disponible.",
        formula: "P(A|B) = \\frac{P(A \\cap B)}{P(B)}",
        example: "Si 60 % des poissons capturés le matin sont capitaines, et 70 % sont capturés le matin, quelle est P(capitaine) ?",
      },
    ],
    exercises: [
      {
        id: "6s-derivee",
        title: "Maximiser la récolte",
        context: "Le bénéfice d'une récolte suit B(x) = -x² + 8x, où x est la quantité plantée (en dizaines de kg). On cherche le maximum.",
        prompt: "Pour quelle valeur de x le bénéfice est-il maximal ?",
        answerType: "math-input",
        expectedAnswer: "4",
        equation: "B'(x) = -2x + 8 = 0",
        hintSteps: [
          "On dérive : B'(x) = -2x + 8.",
          "Au maximum, B'(x) = 0 : -2x + 8 = 0.",
          "x = 4.",
        ],
        solutionSteps: [
          "B'(x) = -2x + 8.",
          "B'(x) = 0 ⟹ x = 4.",
          "Le bénéfice est maximal pour x = 4 (40 kg plantés).",
        ],
        challenge: "Calcule le bénéfice maximum B(4).",
      },
      {
        id: "6s-integrale",
        title: "L'aire de la parcelle",
        context: "Une parcelle a un profil modélisé par y = 2x sur l'intervalle [0, 3].",
        prompt: "Calcule l'aire sous cette courbe.",
        answerType: "math-input",
        expectedAnswer: "9",
        equation: "\\int_0^3 2x\\,dx",
        hintSteps: [
          "La primitive de 2x est x².",
          "On évalue entre 0 et 3 : [x²]₀³.",
          "3² - 0² = 9.",
        ],
        solutionSteps: [
          "∫₀³ 2x dx = [x²]₀³.",
          "= 3² - 0² = 9 - 0.",
          "L'aire est 9 m².",
        ],
        challenge: "Comparez avec le triangle de base 3 et hauteur 6 : même aire ?",
      },
      {
        id: "6s-probabilite",
        title: "La pêche du matin",
        context: "70 % des sorties de pêche ont lieu le matin. Lors d'une sortie matinale, la probabilité de capturer un capitaine est 60 %. La probabilité d'une sortie non matinale avec capitaine est 20 %.",
        prompt: "Quelle est la probabilité de capturer un capitaine lors d'une sortie quelconque ? (en pourcentage)",
        answerType: "math-input",
        expectedAnswer: "48",
        hintSteps: [
          "P(capitaine) = P(matin) × P(cap|matin) + P(soir) × P(cap|soir).",
          "= 0,7 × 0,6 + 0,3 × 0,2.",
          "= 0,42 + 0,06 = 0,48 = 48 %.",
        ],
        solutionSteps: [
          "P(matin) = 0,7, P(cap|matin) = 0,6.",
          "P(soir) = 0,3, P(cap|soir) = 0,2.",
          "P(capitaine) = 0,7 × 0,6 + 0,3 × 0,2 = 0,42 + 0,06 = 0,48 = 48 %.",
        ],
        challenge: "Sachant qu'on a capturé un capitaine, quelle est la probabilité que c'était le matin ?",
      },
      {
        id: "6s-synthese",
        title: "Le problème de la Lukenie",
        context: "Une pirogue remonte la Lukenie à v km/h. Sa vitesse effective contre le courant est (v - 3) km/h. Elle parcourt 60 km en 4 heures.",
        prompt: "Quelle est la vitesse propre v de la pirogue ?",
        answerType: "math-input",
        expectedAnswer: "18",
        equation: "(v - 3) \\times 4 = 60",
        hintSteps: [
          "Distance = vitesse × temps.",
          "(v - 3) × 4 = 60.",
          "v - 3 = 15, donc v = 18.",
        ],
        solutionSteps: [
          "(v - 3) × 4 = 60.",
          "v - 3 = 60 / 4 = 15.",
          "v = 15 + 3 = 18 km/h.",
        ],
        challenge: "Combien de temps faudrait-il à cette pirogue pour descendre les mêmes 60 km avec le courant ?",
      },
    ],
    courseSlug: "6e-secondaire",
    courseChapters: [
      {
        id: "6s-ch1-integration",
        title: "Intégration — primitives",
        subtitle: "Calcul des surfaces cultivées",
        exerciseIds: ["6s-integrale"],
        sakataContext: "La surface d'une parcelle dont le bord suit une courbe irrégulière ne peut se calculer avec les formules géométriques classiques. L'intégrale permet de calculer exactement ces surfaces cultivées au bord de la rivière.",
        visualizations: [
          { type: "function-plot", title: "Aire sous la courbe", description: "Visualiser l'intégrale comme l'aire entre la courbe et l'axe des abscisses" },
          { type: "coordinate-plane", title: "Primitive et intégrale", description: "Tracer f(x) et F(x) pour comprendre la relation entre dérivée et intégrale" },
          { type: "parabola", title: "Intégrer une parabole", description: "∫ x² dx — voir l'aire sous la parabole calculée analytiquement" },
        ],
        theoryBlocks: [
          {
            title: "La primitive — intégrale indéfinie",
            explanation: "La primitive F(x) d'une fonction f(x) est une fonction dont la dérivée vaut f(x). L'ensemble des primitives diffère d'une constante C.",
            formula: "F'(x) = f(x), \\quad \\int f(x)\\,dx = F(x) + C",
            example: "Primitive de f(x) = 2x : F(x) = x² + C. En vérifiant : (x²)' = 2x. ✓",
          },
          {
            title: "Règles de calcul des primitives",
            explanation: "La primitive d'un polynôme s'obtient terme par terme en augmentant l'exposant de 1 et en divisant par le nouvel exposant.",
            formula: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C \\; (n \\neq -1)",
            example: "∫ x² dx = x³/3 + C. ∫ 3x dx = 3x²/2 + C.",
          },
          {
            title: "L'intégrale définie — calcul de l'aire",
            explanation: "L'intégrale définie de a à b est la différence F(b) − F(a). Elle calcule l'aire (algébrique) sous la courbe entre x = a et x = b.",
            formula: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            example: "∫₀³ 2x dx = [x²]₀³ = 9 − 0 = 9. Aire de la parcelle : 9 m².",
          },
        ],
      },
      {
        id: "6s-ch2-applications-integrales",
        title: "Applications des intégrales",
        subtitle: "Volumes de stockage de nourriture",
        exerciseIds: ["6s-integrale"],
        sakataContext: "Un grenier dont la section varie avec la hauteur peut être modélisé par une intégrale. Les Basakata calculaient empiriquement leurs capacités de stockage — les intégrales donnent la réponse exacte.",
        visualizations: [
          { type: "function-plot", title: "Sections variables", description: "f(h) = section du grenier à la hauteur h — l'intégrale donne le volume total" },
          { type: "coordinate-plane", title: "Aire entre deux courbes", description: "∫[f(x) − g(x)]dx — surface comprise entre deux courbes" },
          { type: "histogram", title: "Approximation par rectangles", description: "La méthode des rectangles approxime l'intégrale — voir la convergence" },
        ],
        theoryBlocks: [
          {
            title: "Volume par intégration",
            explanation: "Un solide de révolution (un grenier cylindrique, par exemple) a un volume calculable par intégrale. On intègre l'aire de la section transversale selon la hauteur.",
            formula: "V = \\int_a^b A(h)\\,dh",
            example: "Grenier cylindrique de rayon r et hauteur h : V = ∫₀ʰ πr² dh = πr²h.",
          },
          {
            title: "Aire entre deux courbes",
            explanation: "L'aire de la région comprise entre les courbes y = f(x) et y = g(x) sur [a, b] est l'intégrale de leur différence, à condition que f ≥ g sur cet intervalle.",
            formula: "A = \\int_a^b [f(x) - g(x)]\\,dx",
            example: "Aire entre y = x² et y = x sur [0, 1] : ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6.",
          },
        ],
      },
      {
        id: "6s-ch3-matrices",
        title: "Matrices et déterminants",
        subtitle: "Systèmes d'échanges marchands",
        exerciseIds: ["6s-synthese"],
        sakataContext: "Au grand marché de Mushie, plusieurs vendeurs échangent plusieurs types de marchandises. Une matrice encode ces flux d'échanges complexes — les déterminants révèlent si un système a une solution unique.",
        visualizations: [
          { type: "truth-table", title: "Table de multiplication matricielle", description: "Visualiser comment chaque entrée du produit matriciel se calcule" },
          { type: "coordinate-plane", title: "Transformation linéaire", description: "Une matrice transforme le plan : rotation, homothétie, cisaillement" },
          { type: "scatter-plot", title: "Système 2×2", description: "Les deux équations sont deux droites — leur intersection est la solution" },
        ],
        theoryBlocks: [
          {
            title: "Définition d'une matrice",
            explanation: "Une matrice est un tableau rectangulaire de nombres organisés en lignes et en colonnes. Une matrice m×n a m lignes et n colonnes.",
            formula: "A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
            example: "Matrice d'échanges : ligne = vendeur, colonne = acheteur, entrée = quantité échangée.",
          },
          {
            title: "Déterminant d'une matrice 2×2",
            explanation: "Le déterminant d'une matrice 2×2 est ad − bc. Si det ≠ 0, le système associé a une unique solution. Si det = 0, les équations sont dépendantes.",
            formula: "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
            example: "det([[3, 1], [2, 4]]) = 3×4 − 1×2 = 10 ≠ 0 : système à solution unique.",
          },
          {
            title: "Résoudre un système par matrices",
            explanation: "On écrit le système sous forme matricielle AX = B. Si det(A) ≠ 0, la solution est X = A⁻¹B.",
            formula: "AX = B \\Rightarrow X = A^{-1}B",
            example: "Système x + y = 10 et 2x − y = 5 : matrice A = [[1,1],[2,−1]], X = A⁻¹ × [10, 5].",
          },
        ],
      },
      {
        id: "6s-ch4-complexes",
        title: "Nombres complexes",
        subtitle: "Oscillations musicales du balafon",
        exerciseIds: ["6s-derivee"],
        sakataContext: "Les vibrations des lames du balafon Sakata créent des sons harmoniques. Les nombres complexes décrivent mathématiquement ces oscillations — la forme exponentielle révèle l'amplitude et la phase de chaque son.",
        visualizations: [
          { type: "coordinate-plane", title: "Plan complexe", description: "L'axe réel et l'axe imaginaire — représenter un nombre complexe comme un point ou un vecteur" },
          { type: "angle-triangle", title: "Module et argument", description: "Module = longueur du vecteur, argument = angle avec l'axe réel" },
          { type: "function-plot", title: "Forme trigonométrique", description: "z = r(cos θ + i sin θ) — relier coordonnées cartésiennes et polaires" },
        ],
        theoryBlocks: [
          {
            title: "L'unité imaginaire i",
            explanation: "Le nombre imaginaire i est défini par i² = −1. Un nombre complexe z = a + bi a une partie réelle a et une partie imaginaire b.",
            formula: "i^2 = -1, \\quad z = a + bi, \\quad a,b \\in \\mathbb{R}",
            example: "z = 3 + 4i : partie réelle 3, partie imaginaire 4.",
          },
          {
            title: "Module et conjugué",
            explanation: "Le module |z| est la distance de z à l'origine dans le plan complexe. Le conjugué z̄ = a − bi est son symétrique par rapport à l'axe réel.",
            formula: "|z| = \\sqrt{a^2 + b^2}, \\quad \\bar{z} = a - bi",
            example: "|3 + 4i| = √(9 + 16) = 5. Conjugué : 3 − 4i.",
          },
          {
            title: "Opérations sur les complexes",
            explanation: "Addition, soustraction et multiplication suivent les règles algébriques habituelles en utilisant i² = −1. La division utilise le conjugué du dénominateur.",
            formula: "(a+bi)(c+di) = (ac-bd) + (ad+bc)i",
            example: "(2+3i)(1+i) = 2 + 2i + 3i + 3i² = 2 + 5i − 3 = −1 + 5i.",
          },
        ],
      },
      {
        id: "6s-ch5-coniques",
        title: "Coniques",
        subtitle: "Arcs rituels et trajectoires",
        exerciseIds: ["6s-derivee", "6s-integrale"],
        sakataContext: "L'arc lancé lors d'un rituel Sakata décrit une parabole. L'ellipse décrit la trajectoire d'un objet gravitationnel. Les coniques sont les formes fondamentales des trajectoires naturelles.",
        visualizations: [
          { type: "parabola", title: "La parabole", description: "y = ax² + bx + c — sommet, axe de symétrie, ouverture vers le haut ou le bas" },
          { type: "coordinate-plane", title: "Ellipse et hyperbole", description: "Les coniques sur le plan cartésien — équations standard et propriétés" },
          { type: "discriminant-viz", title: "Types de coniques", description: "Selon le discriminant de l'équation générale, identifier le type de conique" },
        ],
        theoryBlocks: [
          {
            title: "La parabole",
            explanation: "Une parabole est le lieu des points équidistants d'un point (foyer) et d'une droite (directrice). Son équation standard est y = ax² + bx + c.",
            formula: "y = ax^2 + bx + c, \\quad x_{\\text{sommet}} = -\\frac{b}{2a}",
            example: "Trajectoire d'un arc : y = −0,1x² + 2x. Sommet à x = 10 m, hauteur maximale y = 10 m.",
          },
          {
            title: "L'ellipse",
            explanation: "Une ellipse est le lieu des points dont la somme des distances à deux foyers est constante. Son équation standard utilise les demi-axes a et b.",
            formula: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1",
            example: "Ellipse de demi-axes 5 et 3 : x²/25 + y²/9 = 1.",
          },
        ],
      },
      {
        id: "6s-ch6-baccalaureat",
        title: "Révision et préparation au baccalauréat",
        subtitle: "Bilan du parcours Basakata",
        exerciseIds: ["6s-derivee", "6s-integrale", "6s-probabilite", "6s-synthese"],
        sakataContext: "À l'issue de ce parcours, l'élève Basakata a acquis les outils mathématiques fondamentaux. Ce chapitre de révision synthétise les six années de secondaire et prépare à l'épreuve finale du baccalauréat.",
        visualizations: [
          { type: "function-plot", title: "Synthèse des fonctions", description: "Fonctions polynomiales, trigonométriques, exponentielles — révision des graphes essentiels" },
          { type: "coordinate-plane", title: "Géométrie analytique", description: "Droites, coniques, distances — révision complète de la géométrie analytique" },
          { type: "histogram", title: "Statistiques et probabilités", description: "Distribution, moyenne, écart-type, loi normale — révision des outils statistiques" },
        ],
        theoryBlocks: [
          {
            title: "Synthèse Analyse — dérivée et intégrale",
            explanation: "La dérivée donne la variation locale, l'intégrale donne l'accumulation. Ensemble, elles forment le calcul différentiel et intégral — le cœur des mathématiques modernes.",
            formula: "f'(x) \\text{ mesure la pente}, \\quad \\int_a^b f(x)\\,dx \\text{ mesure l'aire}",
            example: "Bénéfice B(x) = −x² + 8x : maximum à B'(x) = 0 → x = 4. Bénéfice total sur [0, 4] : ∫₀⁴ B(x) dx.",
          },
          {
            title: "Synthèse Probabilités et Statistiques",
            explanation: "Les probabilités quantifient l'incertitude, les statistiques analysent les données. La loi normale relie les deux et modélise les phénomènes naturels.",
            formula: "P(A) \\in [0,1], \\quad \\bar{x} = \\frac{\\sum x_i}{n}, \\quad \\sigma = \\sqrt{\\frac{\\sum(x_i - \\bar{x})^2}{n}}",
            example: "Probabilité de pêche 48 %. Moyenne des captures 10/jour. Écart-type 2.",
          },
          {
            title: "Méthode pour la rédaction au baccalauréat",
            explanation: "Pour tout problème : lire attentivement, identifier les données, choisir les outils adaptés, rédiger chaque étape clairement, vérifier la cohérence du résultat.",
            formula: "\\text{Lire} \\rightarrow \\text{Identifier} \\rightarrow \\text{Choisir l'outil} \\rightarrow \\text{Calculer} \\rightarrow \\text{Vérifier}",
            example: "Problème de probabilité conditionnelle : identifier les événements, écrire la formule, substituer, calculer, interpréter.",
          },
        ],
      },
    ],
  },
];

export const primaireProgramsData: MathematicsProgramYear[] = [
  // PRIMAIRE 1 - Ages 5-6
  {
    slug: "primaire-1",
    title: "Primaire 1",
    degree: "Degré élémentaire",
    focus: "Compter jusqu'à 10, formes, avant et après",
    overview: "L'enfant découvre les nombres de 1 à 10 en manipulant des objets concrets du village : pirogues, paniers, poissons.",
    learningObjectives: [
      "Compter jusqu'à 10 de manière fiable.",
      "Reconnaître les nombres 1 à 10 par écrit et par oralité.",
      "Identifier les formes géométriques simples : rond, carré, triangle.",
      "Comprendre avant et après dans les séquences.",
    ],
    localContexts: ["graines", "pirogues miniatures", "poissons séchés", "paniers tressés"],
    theoryBlocks: [
      { title: "Compter une à une", explanation: "On pointe chaque objet une seule fois. Le dernier nombre dit est la quantité totale.", formula: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10", example: "Trois graines de palme : 1, 2, 3." },
    ],
    exercises: [
      { id: "p1-pirogues-1", title: "Compter les pirogues", context: "Trois pirogues sont amarrées au débarcadère. Deux autres arrivent du lac.", prompt: "Combien de pirogues y a-t-il maintenant ?", answerType: "math-input", expectedAnswer: "5", equation: "3 + 2 = ?", hintSteps: ["Commence avec les 3 pirogues.", "Ajoute 2 pirogues.", "Compte le total."], solutionSteps: ["Il y a 3 pirogues au départ.", "2 arrivent : 3, 4, 5.", "Total : 5 pirogues."], challenge: "Peux-tu trouver une autre histoire avec 5 ?" },
      { id: "p1-graines-2", title: "Les graines de palme", context: "Maman a 4 graines. Papa en apporte 3 du marché.", prompt: "Combien de graines y a-t-il en tout ?", answerType: "math-input", expectedAnswer: "7", equation: "4 + 3 = ?", hintSteps: ["Commence avec 4.", "Ajoute 3 une à une.", "Compte jusqu'au bout."], solutionSteps: ["4 graines au départ.", "Ajouter 3 : 4, 5, 6, 7.", "Total : 7 graines."], challenge: "Y a-t-il plus de 5 ?" },
      { id: "p1-poissons-3", title: "Compter les poissons", context: "Le pêcheur rentre avec 6 poissons séchés. Il en vend 2 au marché.", prompt: "Combien de poissons lui reste-t-il ?", answerType: "math-input", expectedAnswer: "4", equation: "6 - 2 = ?", hintSteps: ["Tu commences avec 6.", "Tu enlèves 2.", "Compte ce qui reste."], solutionSteps: ["Au départ : 6 poissons.", "Il en vend 2 : 6, 5, 4.", "Il en reste 4."], challenge: "Trouve une autre histoire qui donne 4." },
      { id: "p1-formes-4", title: "Les formes du village", context: "Dans le village, tu vois des formes partout.", prompt: "Quel est le nom de cette forme ?", answerType: "choice", expectedAnswer: "cercle", choices: [{ label: "Cercle", value: "cercle" }, { label: "Carré", value: "carre" }, { label: "Triangle", value: "triangle" }, { label: "Rectangle", value: "rectangle" }], hintSteps: ["Compte les côtés.", "Pas de côtés ? C'est arrondi."], solutionSteps: ["Les formes sans côtés sont rondes.", "Le cercle n'a pas de coins."], challenge: "Trouve une forme ronde dans ta maison." },
      { id: "p1-sequence-5", title: "L'ordre de la journée", context: "La journée du pêcheur : il se lève, il prépare sa pirogue, il rentre avec les poissons.", prompt: "Quoi en premier ?", answerType: "choice", expectedAnswer: "se-leve", choices: [{ label: "Se lever", value: "se-leve" }, { label: "Préparer la pirogue", value: "prepare" }, { label: "Rentrer avec les poissons", value: "rentre" }], hintSteps: ["Pense à ta journée.", "Qu'est-ce que tu fais le matin en premier ?"], solutionSteps: ["Chaque matin, on se lève d'abord.", "Puis on prépare.", "Puis on rentre."], challenge: "Que fais-tu après te lever ?" },
      { id: "p1-compter-6", title: "Compte jusqu'à 10", context: "Tu as 10 doigts : 5 à chaque main.", prompt: "Montre-moi 10 sur tes doigts. Quel est le dernier nombre ?", answerType: "math-input", expectedAnswer: "10", equation: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10", hintSteps: ["Lève un doigt à la fois.", "Dis le nombre à chaque doigt.", "Continue jusqu'à ne plus avoir de doigts."], solutionSteps: ["Main 1 : 1, 2, 3, 4, 5.", "Main 2 : 6, 7, 8, 9, 10.", "Total : 10 doigts."], challenge: "Peut-on compter plus que 10 ?" },
      { id: "p1-paniers-7", title: "Les paniers tressés", context: "Maman a 2 paniers pleins et en achète 3 de plus au marché.", prompt: "Combien de paniers a-t-elle au total ?", answerType: "math-input", expectedAnswer: "5", equation: "2 + 3 = ?", hintSteps: ["Elle en a 2.", "Elle en achète 3.", "Ajoute 3 à 2."], solutionSteps: ["Au départ : 2 paniers.", "Elle en achète 3 : 2, 3, 4, 5.", "Total : 5 paniers."], challenge: "Si elle en achète 4 au lieu de 3, combien ?" },
      { id: "p1-avant-apres-8", title: "Avant et après", context: "Le matin le soleil n'est pas levé. Le jour, le soleil est haut. Le soir, il redescend.", prompt: "Qu'est-ce qui vient après le jour ?", answerType: "choice", expectedAnswer: "soir", choices: [{ label: "Le matin", value: "matin" }, { label: "Le soir", value: "soir" }, { label: "La nuit", value: "nuit" }], hintSteps: ["Pense à ta journée.", "Le matin : soleil qui monte.", "Jour : soleil haut.", "Après le jour ?"], solutionSteps: ["La journée : matin, jour, soir.", "Après le jour vient le soir.", "Après le soir vient la nuit."], challenge: "Qu'est-ce qui vient avant le jour ?" },
    ],
    courseSlug: "primaire-1",
    courseChapters: [
      { id: "p1-ch1", title: "Compter de 1 à 5", subtitle: "Les premiers nombres", exerciseIds: ["p1-pirogues-1", "p1-graines-2"], sakataContext: "Au débarcadère, on compte les pirogues.", visualizations: [{ type: "counting-beads", title: "Boulier", description: "Déplacer les billes pour compter de 1 à 5" }, { type: "number-line", title: "Ligne des nombres", description: "Placer 1, 2, 3, 4, 5 sur la droite" }, { type: "number-bonds", title: "Ponts", description: "Décomposer 5 en deux parties" }, { type: "bar-model", title: "Barre modèle", description: "Montrer 5 comme une barre entière" }], theoryBlocks: [{ title: "Le nombre 1", explanation: "Un seul objet.", formula: "1", example: "Une pirogue." }] },
      { id: "p1-ch2", title: "Les chiffres", subtitle: "Les signes écrits", exerciseIds: ["p1-compter-6"], sakataContext: "Le marchand écrit les prix en chiffres.", visualizations: [{ type: "counting-beads", title: "Boulier", description: "Associer chaque chiffre à une quantité de billes" }, { type: "number-line", title: "Chiffres et nombres", description: "Chaque chiffre trouve sa place sur la droite numérique" }, { type: "place-value-grid", title: "Visualiser", description: "Associer le signe écrit à sa représentation en objets" }, { type: "bar-model", title: "Barre modèle", description: "Représenter chaque chiffre comme une barre" }], theoryBlocks: [{ title: "Un chiffre", explanation: "Signe écrit qui représente un nombre.", formula: "3 = trois", example: "Trois paniers." }] },
      { id: "p1-ch3", title: "Les formes", subtitle: "Cercle, carré, triangle", exerciseIds: ["p1-formes-4"], sakataContext: "Le panier carré, le tambour rond, le toit triangulaire.", visualizations: [{ type: "shape-explorer", title: "Explorateur", description: "Découvrir les propriétés de chaque forme" }, { type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer la longueur des côtés avec la règle" }, { type: "area-rectangle", title: "Surface", description: "Surface intérieure du carré et du rectangle" }, { type: "fraction-circle", title: "Le cercle", description: "Forme ronde sans angles : le tambour, le soleil" }], theoryBlocks: [{ title: "Le cercle", explanation: "Forme ronde, sans coins.", formula: "Cercle", example: "Le soleil." }] },
      { id: "p1-ch4", title: "Avant et après", subtitle: "L'ordre des événements", exerciseIds: ["p1-sequence-5", "p1-avant-apres-8"], sakataContext: "Le pêcheur rentre le matin, sa prise sèche, la famille cuisine le soir.", visualizations: [{ type: "timeline", title: "Chronologie", description: "Matin → Midi → Soir : l'ordre de la journée du pêcheur" }, { type: "number-line", title: "Avant/après", description: "Sur la droite : ce qui vient avant est à gauche, après est à droite" }, { type: "clock-face", title: "L'heure du pêcheur", description: "Visualiser le départ à 5h et le retour à 18h" }, { type: "bar-model", title: "Bandes", description: "Bandes illustrées placées dans le bon ordre chronologique" }], theoryBlocks: [{ title: "L'ordre", explanation: "Avant → Après.", formula: "Avant → Après", example: "Matin → Jour → Soir." }] },
      { id: "p1-ch5", title: "Jusqu'à 10", subtitle: "Les deux mains", exerciseIds: ["p1-poissons-3", "p1-paniers-7"], sakataContext: "L'enfant compte sur ses dix doigts. 5 + 5 = 10.", visualizations: [{ type: "counting-beads", title: "Boulier jusqu'à 10", description: "Déplacer les 10 billes une par une" }, { type: "number-bonds", title: "Décomposer 10", description: "Trouver toutes les façons de faire 10" }, { type: "number-line", title: "1 à 10", description: "Tous les nombres de 1 à 10 sur la droite" }, { type: "place-value-grid", title: "Dix unités", description: "Dix cases remplies une par une jusqu'au groupe complet" }], theoryBlocks: [{ title: "Dix", explanation: "Un groupe complet. Les dix doigts.", formula: "10", example: "Dix pièces de monnaie." }] },
    ],
  },
  // PRIMAIRE 2
  { slug: "primaire-2", title: "Primaire 2", degree: "Degré élémentaire", focus: "Ajouter et retirer, argent", overview: "L'enfant approfondit le calcul.", learningObjectives: ["Additionner et soustraire jusqu'à 20.", "Utiliser la monnaie locale."], localContexts: ["pièces", "tissu", "trajet", "récolte"], theoryBlocks: [], exercises: [
    { id: "p2-addition-1", title: "Addition au marché", context: "Maman a 8 francs. Papa lui donne 7 francs pour acheter du tissu.", prompt: "Combien de francs a-t-elle en tout ?", answerType: "math-input", expectedAnswer: "15", equation: "8 + 7 = ?", hintSteps: ["Elle en a 8.", "On ajoute 7.", "Compte le total."], solutionSteps: ["Au départ : 8 francs.", "Ajouter 7 : 8, 9, 10, 11, 12, 13, 14, 15.", "Total : 15 francs."], challenge: "Et si papa lui donnait 6 ?" },
    { id: "p2-soustraction-2", title: "Soustraire au marché", context: "Le vendeur a 18 poissons. Il en vend 5 le matin.", prompt: "Combien de poissons lui reste-t-il ?", answerType: "math-input", expectedAnswer: "13", equation: "18 - 5 = ?", hintSteps: ["Il en a 18.", "Il en vend 5.", "Compte ce qui reste."], solutionSteps: ["Au départ : 18 poissons.", "Il en vend 5 : 18, 17, 16, 15, 14, 13.", "Il en reste 13."], challenge: "S'il en vend 7 ?" },
    { id: "p2-argent-3", title: "Les pièces", context: "Tu as une pièce de 5 francs et une pièce de 10 francs.", prompt: "Combien d'argent as-tu ?", answerType: "math-input", expectedAnswer: "15", equation: "5 + 10 = ?", hintSteps: ["Une pièce = 5 francs.", "Une autre = 10 francs.", "Additionne."], solutionSteps: ["Pièce 1 : 5 francs.", "Pièce 2 : 10 francs.", "Total : 15 francs."], challenge: "As-tu assez pour acheter quelque chose à 12 ?" },
    { id: "p2-distance-4", title: "Le trajet", context: "De chez toi au marché il y a 12 pas. Du marché au puits il y a 8 pas.", prompt: "Combien de pas au total de chez toi au puits ?", answerType: "math-input", expectedAnswer: "20", equation: "12 + 8 = ?", hintSteps: ["Première partie : 12 pas.", "Deuxième partie : 8 pas.", "Additionne."], solutionSteps: ["Chez moi → marché : 12 pas.", "Marché → puits : 8 pas.", "Total : 20 pas."], challenge: "C'est combien de fois 10 ?" },
    { id: "p2-mesure-5", title: "Mesurer le tissu", context: "Maman achète 19 coudées de tissu. Elle en utilise 6 pour une robe.", prompt: "Combien de coudées lui reste-t-il ?", answerType: "math-input", expectedAnswer: "13", equation: "19 - 6 = ?", hintSteps: ["Elle a 19 coudées.", "Elle en utilise 6.", "Compte ce qui reste."], solutionSteps: ["Au départ : 19 coudées.", "Elle utilise 6 : 19, 18, 17, 16, 15, 14, 13.", "Il en reste 13 coudées."], challenge: "Et si elle utilisait 8 ?" },
    { id: "p2-recolte-6", title: "La récolte", context: "Hier on a récolté 9 paniers de mangues. Aujourd'hui on en a récolté 11.", prompt: "Combien de paniers en tout ?", answerType: "math-input", expectedAnswer: "20", equation: "9 + 11 = ?", hintSteps: ["Hier : 9 paniers.", "Aujourd'hui : 11 paniers.", "Additionne."], solutionSteps: ["Jour 1 : 9 paniers.", "Jour 2 : 11 paniers.", "Total : 20 paniers."], challenge: "C'est 2 fois combien ?" },
    { id: "p2-retrait-7", title: "Vendre des poissons", context: "Au début de la journée, le pêcheur a 17 poissons. Le soir il en a vendu 8.", prompt: "Combien en reste-t-il ?", answerType: "math-input", expectedAnswer: "9", equation: "17 - 8 = ?", hintSteps: ["Il en a 17.", "Il en vend 8.", "Compte le reste."], solutionSteps: ["Au départ : 17 poissons.", "Il en vend 8 : 17, 16, 15, 14, 13, 12, 11, 10, 9.", "Il en reste 9."], challenge: "Si c'était 7 au lieu de 8 ?" },
    { id: "p2-paiement-8", title: "Payer au marché", context: "Un objet coûte 12 francs. Tu as 20 francs.", prompt: "Combien d'argent te reste-t-il ?", answerType: "math-input", expectedAnswer: "8", equation: "20 - 12 = ?", hintSteps: ["Tu as 20 francs.", "Tu paies 12 francs.", "Compte ce qui reste."], solutionSteps: ["Tu commences avec 20 francs.", "Tu paies 12 : 20, 19, 18, 17, 16, 15, 14, 13, 12.", "Il te reste 8 francs."], challenge: "Peux-tu acheter un autre objet à 8 ?" },
  ], courseSlug: "primaire-2", courseChapters: [
    { id: "p2-ch1", title: "Additionner", subtitle: "Deux groupes", exerciseIds: ["p2-addition-1", "p2-recolte-6"], sakataContext: "Au marché.", visualizations: [{ type: "number-bonds", title: "Ponts numériques", description: "Décomposer et recomposer les additions jusqu'à 20" }, { type: "number-line", title: "Sauts", description: "Sauter vers l'avant sur la droite numérique" }, { type: "balance", title: "Équilibre", description: "Les deux côtés de la balance s'équilibrent" }, { type: "bar-model", title: "Barre modèle", description: "Deux parties qui forment un tout" }], theoryBlocks: [{ title: "L'addition", explanation: "Deux groupes ensemble.", formula: "a + b = c", example: "8 + 7 = 15." }] },
    { id: "p2-ch2", title: "Soustraire", subtitle: "Enlever", exerciseIds: ["p2-soustraction-2", "p2-retrait-7"], sakataContext: "Douze poissons.", visualizations: [{ type: "number-bonds", title: "Ponts", description: "La soustraction défait un pont numérique" }, { type: "number-line", title: "Sauts arrière", description: "Reculer sur la droite numérique" }, { type: "balance", title: "Équilibre", description: "Retirer un poids : comment rééquilibrer ?" }, { type: "counting-beads", title: "Boulier", description: "Repousser les billes pour soustraire" }], theoryBlocks: [{ title: "Soustraction", explanation: "Enlever une partie.", formula: "a - b = c", example: "15 - 7 = 8." }] },
    { id: "p2-ch3", title: "L'argent", subtitle: "Pièces", exerciseIds: ["p2-argent-3", "p2-paiement-8"], sakataContext: "Marché.", visualizations: [{ type: "coin-counter", title: "Compteur de pièces", description: "Trouver la combinaison optimale de pièces" }, { type: "number-line", title: "Prix", description: "Placer les prix sur la droite pour les comparer" }, { type: "balance", title: "Prix = paiement", description: "Le prix de l'objet s'équilibre avec les pièces posées en face" }, { type: "bar-model", title: "Budget", description: "Argent dépensé vs argent restant" }], theoryBlocks: [{ title: "Pièces", explanation: "Chaque pièce a une valeur.", formula: "1 = 1 franc", example: "Trois pièces de 5 = 15." }] },
    { id: "p2-ch4", title: "Mesurer", subtitle: "Corps", exerciseIds: ["p2-distance-4", "p2-mesure-5"], sakataContext: "Tissu.", visualizations: [{ type: "ruler-measure", title: "Règle interactive", description: "Mesurer la pirogue et les objets avec la règle" }, { type: "number-line", title: "Mesure", description: "Chaque unité marque un point sur la droite de mesure" }, { type: "bar-model", title: "Longueurs comparées", description: "Comparer deux longueurs côte à côte" }, { type: "statistics-bars", title: "Barres comparées", description: "Comparer la taille du puits, du champ, du trajet en barres" }], theoryBlocks: [{ title: "Corps", explanation: "L'empan, le pas, la coudée.", formula: "Distance = nombre de pas", example: "Puits à 50 pas." }] },
    { id: "p2-ch5", title: "Problèmes", subtitle: "Histoires", exerciseIds: ["p2-addition-1", "p2-soustraction-2"], sakataContext: "Mangues.", visualizations: [{ type: "bar-model", title: "Modèle de barre", description: "Visualiser la situation : avant, ce qui change, après" }, { type: "timeline", title: "Histoire en étapes", description: "Situation de départ → Ce qui se passe → Question finale" }, { type: "number-line", title: "Chemin de la solution", description: "Partir du nombre initial, sauter vers la réponse" }, { type: "balance", title: "Vérification", description: "Vérifier la réponse par l'équilibre" }], theoryBlocks: [{ title: "Lire", explanation: "Lire, identifier, choisir.", formula: "Histoire → Opération → Réponse", example: "6 − 2 = 4." }] },
  ] },
  // PRIMAIRE 3
  { slug: "primaire-3", title: "Primaire 3", degree: "Degré moyen", focus: "Valeur de position, multiplication", overview: "Dix unités = une dizaine.", learningObjectives: ["Nombres jusqu'à 100.", "Dizaines et unités.", "Multiplier.", "Diviser."], localContexts: ["régimes", "nasses", "sacs", "poissons"], theoryBlocks: [], exercises: [
    { id: "p3-dizaines-1", title: "Les dizaines et unités", context: "Le vendeur a 3 paquets de 10 poissons et 5 poissons seuls. Combien de poissons au total ?", prompt: "3 dizaines et 5 unités = combien ?", answerType: "math-input", expectedAnswer: "35", equation: "30 + 5 = ?", hintSteps: ["3 paquets de 10 = 30.", "Plus 5 poissons seuls.", "Additionne."], solutionSteps: ["3 × 10 = 30 poissons.", "Plus 5 = 35 poissons au total.", "35 = 3 dizaines et 5 unités."], challenge: "Et si c'était 4 dizaines et 7 unités ?" },
    { id: "p3-addition-2", title: "Additionner avec dizaines", context: "Maman a 28 francs. Papa lui donne 14 francs.", prompt: "Combien a-t-elle en tout ?", answerType: "math-input", expectedAnswer: "42", equation: "28 + 14 = ?", hintSteps: ["Elle en a 28.", "On ajoute 14.", "28 + 14 = ?"], solutionSteps: ["28 + 14 : d'abord ajouter 10 : 28 + 10 = 38.", "Puis ajouter 4 : 38 + 4 = 42.", "Total : 42 francs."], challenge: "Et si on ajoutait 16 ?" },
    { id: "p3-multiplication-3", title: "Les nasses", context: "Il y a 4 nasses dans le bateau. Chaque nasse capture 3 poissons par jour.", prompt: "Combien de poissons en tout par jour ?", answerType: "math-input", expectedAnswer: "12", equation: "4 × 3 = ?", hintSteps: ["4 nasses.", "3 poissons par nasse.", "4 fois 3."], solutionSteps: ["Nasse 1 : 3 poissons.", "Nasse 2 : 3 poissons.", "Nasse 3 : 3 poissons.", "Nasse 4 : 3 poissons.", "Total : 3 + 3 + 3 + 3 = 12."], challenge: "Et s'il y avait 5 nasses ?" },
    { id: "p3-division-4", title: "Partager équalement", context: "On a 12 mangues. Elles sont distribuées à 3 enfants en parts égales.", prompt: "Combien de mangues par enfant ?", answerType: "math-input", expectedAnswer: "4", equation: "12 ÷ 3 = ?", hintSteps: ["12 mangues au total.", "3 enfants.", "Partage équalement."], solutionSteps: ["Enfant 1 : 4 mangues.", "Enfant 2 : 4 mangues.", "Enfant 3 : 4 mangues.", "4 + 4 + 4 = 12."], challenge: "Et s'il y avait 15 mangues ?" },
    { id: "p3-sac-5", title: "Compter par paquets", context: "Un sac de riz pèse 10 kg. Au marché on a 7 sacs.", prompt: "Quel est le poids total ?", answerType: "math-input", expectedAnswer: "70", equation: "7 × 10 = ?", hintSteps: ["Chaque sac pèse 10 kg.", "Il y a 7 sacs.", "Multiplie."], solutionSteps: ["7 × 10 = 70 kg.", "Ou : 10, 20, 30, 40, 50, 60, 70."], challenge: "C'est combien de fois 10 ?" },
    { id: "p3-regime-6", title: "Les régimes", context: "On partage équalement un régime de 20 bananes entre 4 personnes.", prompt: "Combien de bananes par personne ?", answerType: "math-input", expectedAnswer: "5", equation: "20 ÷ 4 = ?", hintSteps: ["20 bananes.", "4 personnes.", "Partage équalement."], solutionSteps: ["Personne 1 : 5 bananes.", "Personne 2 : 5 bananes.", "Personne 3 : 5 bananes.", "Personne 4 : 5 bananes."], challenge: "Et avec 24 bananes ?" },
    { id: "p3-deux-ops-7", title: "Deux opérations", context: "On a 3 pirogues. Chaque pirogue capture 4 poissons. Puis on en vend 5.", prompt: "Combien de poissons il reste ?", answerType: "math-input", expectedAnswer: "7", equation: "3 × 4 - 5 = ?", hintSteps: ["D'abord : 3 × 4 = 12.", "Puis enlever 5 : 12 - 5 = ?"], solutionSteps: ["Étape 1 : 3 pirogues × 4 poissons = 12 poissons.", "Étape 2 : on en vend 5 : 12 - 5 = 7.", "Il en reste 7."], challenge: "Et si on en vendait 7 ?" },
    { id: "p3-ordre-8", title: "Ordre des nombres", context: "Compare les nombres : 42, 38, 47, 35.", prompt: "Quel est le plus grand nombre ?", answerType: "choice", expectedAnswer: "47", choices: [{ label: "42", value: "42" }, { label: "38", value: "38" }, { label: "47", value: "47" }, { label: "35", value: "35" }], hintSteps: ["Regarde les dizaines d'abord.", "47 a 4 dizaines et 7 unités."], solutionSteps: ["35 = 3 dizaines 5 unités (le plus petit).", "38 = 3 dizaines 8 unités.", "42 = 4 dizaines 2 unités.", "47 = 4 dizaines 7 unités (le plus grand)."], challenge: "Quel est le deuxième plus grand ?" },
  ], courseSlug: "primaire-3", courseChapters: [
    { id: "p3-ch1", title: "Dizaines et unités", subtitle: "Compter par 10", exerciseIds: ["p3-dizaines-1", "p3-sac-5"], sakataContext: "Débarcadère.", visualizations: [{ type: "place-value-grid", title: "Grille valeur", description: "Colonne dizaines / colonne unités : 3 dizaines et 2 unités = 32" }, { type: "counting-beads", title: "Boulier", description: "Compter avec les deux rangées de billes pour visualiser les dizaines" }, { type: "number-line", title: "Sauts de 10", description: "Sauts de 10 en 10 sur la droite : 10, 20, 30..." }, { type: "bar-model", title: "Barre dizaine", description: "Une barre entière = une dizaine, les segments = des unités" }], theoryBlocks: [{ title: "Dizaine", explanation: "10 objets = 1 paquet.", formula: "10 = 1 dizaine", example: "10 filets = 1 groupe." }] },
    { id: "p3-ch2", title: "Addition", subtitle: "Avec dizaines", exerciseIds: ["p3-addition-2"], sakataContext: "28 + 4.", visualizations: [{ type: "place-value-grid", title: "Grille", description: "Aligner les dizaines et les unités en colonnes" }, { type: "number-bonds", title: "Ponts", description: "Décomposer pour passer à la dizaine : 28 + 2 + 2 = 32" }, { type: "number-line", title: "Sauts", description: "Visualiser l'addition par sauts sur la droite" }, { type: "balance", title: "Équilibre", description: "Les deux membres égaux : 28 + 4 = 32" }], theoryBlocks: [{ title: "Addition", explanation: "Quand unités >= 10, dizaine.", formula: "27 + 5 = 32", example: "7 + 5 = 12." }] },
    { id: "p3-ch3", title: "Multiplication", subtitle: "Plusieurs fois", exerciseIds: ["p3-multiplication-3"], sakataContext: "4 nasses.", visualizations: [{ type: "multiplication-grid", title: "Grille de tables", description: "Visualiser 4 × 3 sur la grille colorée" }, { type: "area-rectangle", title: "Grille rectangulaire", description: "4 rangées de 3 cases = 12 au total" }, { type: "number-line", title: "Sauts égaux", description: "Sauts de 3 en 3 : 0, 3, 6, 9, 12" }, { type: "bar-model", title: "Groupes répétés", description: "4 barres identiques de taille 3 font 12" }], theoryBlocks: [{ title: "Multiplier", explanation: "4 × 3 = 3 + 3 + 3 + 3.", formula: "4 × 3 = 12", example: "4 nasses × 3 = 12." }] },
    { id: "p3-ch4", title: "Division", subtitle: "Parts égales", exerciseIds: ["p3-division-4", "p3-regime-6"], sakataContext: "12 mangues.", visualizations: [{ type: "multiplication-grid", title: "Grille inverse", description: "Trouver combien de rangées de 3 pour obtenir 12" }, { type: "fraction-circle", title: "Parts du cercle", description: "Visualiser 12 divisé en 4 parts égales" }, { type: "number-line", title: "Sauts de retrait", description: "Compter combien de fois 3 entre dans 12" }, { type: "bar-model", title: "Parts égales", description: "Un bar de 12 divisé en parts identiques" }], theoryBlocks: [{ title: "Diviser", explanation: "12 ÷ 3 = 4.", formula: "12 ÷ 3 = 4", example: "12 poissons ÷ 4." }] },
    { id: "p3-ch5", title: "Deux opérations", subtitle: "Combiner", exerciseIds: ["p3-deux-ops-7", "p3-ordre-8"], sakataContext: "3 pirogues.", visualizations: [{ type: "number-line", title: "Chemin en deux sauts", description: "Deux sauts successifs : d'abord ×4 puis −5" }, { type: "balance", title: "Résultat intermédiaire", description: "L'étape 1 s'équilibre avant d'entrer dans l'étape 2" }, { type: "bar-model", title: "Deux étapes", description: "Barre 1 = résultat intermédiaire, Barre 2 = résultat final" }, { type: "place-value-grid", title: "Colonnes d'étapes", description: "Une colonne par étape pour ne pas confondre" }], theoryBlocks: [{ title: "Deux étapes", explanation: "Étape 1 → Étape 2.", formula: "Étape 1 → Étape 2", example: "3 × 4 = 12, puis 12 − 5 = 7." }] },
  ] },
  // PRIMAIRE 4
  { slug: "primaire-4", title: "Primaire 4", degree: "Degré moyen", focus: "Tables, fractions, géométrie", overview: "Tables 2 à 5. Fractions.", learningObjectives: ["Tables 2-5.", "Fractions 1/2, 1/3, 1/4.", "Périmètres."], localContexts: ["tissu", "parcelles", "enclos", "récoltes"], theoryBlocks: [], exercises: [], courseSlug: "primaire-4", courseChapters: [
    { id: "p4-ch1", title: "Tables", subtitle: "Mémoriser 2 à 5", exerciseIds: [], sakataContext: "4 rangées.", visualizations: [{ type: "multiplication-grid", title: "Grille de tables", description: "Explorer les tables 2 à 5 sur la grille 10×10" }, { type: "area-rectangle", title: "Grilles rectangulaires", description: "Grille de la table : 4 lignes × 3 colonnes = 12" }, { type: "number-line", title: "Sauts réguliers", description: "Bonds de 2 en 2, de 3 en 3 sur la droite" }, { type: "statistics-bars", title: "Progression", description: "2, 4, 6, 8... chaque barre croît régulièrement" }], theoryBlocks: [{ title: "Table 2", explanation: "2, 4, 6, 8...", formula: "2 × n", example: "2 pirogues × 3." }] },
    { id: "p4-ch2", title: "Fractions", subtitle: "Moitié, tiers, quart", exerciseIds: [], sakataContext: "Tissu.", visualizations: [{ type: "fraction-bar", title: "Barres de fractions", description: "Visualiser 1/2, 1/3, 1/4 en barres comparées" }, { type: "fraction-circle", title: "Cercle fractionné", description: "Couper le cercle en parts égales" }, { type: "area-rectangle", title: "Rectangle divisé", description: "Diviser un rectangle en 2, 3 ou 4 parties égales" }, { type: "number-line", title: "Fractions sur la droite", description: "Placer 1/2, 1/3, 1/4 entre 0 et 1" }], theoryBlocks: [{ title: "Moitié", explanation: "Couper en 2.", formula: "1/2", example: "La moitié du manioc." }] },
    { id: "p4-ch3", title: "Périmètres", subtitle: "Tour des formes", exerciseIds: [], sakataContext: "Enclos.", visualizations: [{ type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer chaque côté avec la règle interactive" }, { type: "shape-explorer", title: "Explorer les formes", description: "Voir le nombre de côtés de chaque forme" }, { type: "area-rectangle", title: "Contour du rectangle", description: "Tracer et mesurer le contour rectangulaire" }, { type: "statistics-bars", title: "Côtés comparés", description: "Une barre par côté : comparer et additionner visuellement" }], theoryBlocks: [{ title: "Périmètre", explanation: "Distance autour.", formula: "P = a + b + c + d", example: "Rectangle." }] },
    { id: "p4-ch4", title: "Formes géométriques", subtitle: "Triangles et rectangles", exerciseIds: [], sakataContext: "Toit.", visualizations: [{ type: "shape-explorer", title: "Explorateur", description: "Propriétés de chaque forme : côtés, angles, symétries" }, { type: "area-rectangle", title: "Surface intérieure", description: "La surface à l'intérieur du rectangle ou du carré" }, { type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer et comparer la longueur des côtés" }, { type: "fraction-circle", title: "Angles et cercle", description: "Visualiser les angles intérieurs" }], theoryBlocks: [{ title: "Triangle", explanation: "3 côtés.", formula: "3 côtés", example: "Toit." }] },
    { id: "p4-ch5", title: "Intérêt simple", subtitle: "Argent augmente", exerciseIds: [], sakataContext: "100 francs.", visualizations: [{ type: "number-line", title: "Croissance du capital", description: "100, 110, 120... le capital grandit mois après mois" }, { type: "statistics-bars", title: "Évolution par mois", description: "Chaque barre représente le capital après intérêt" }, { type: "bar-model", title: "Capital + Intérêt", description: "Barre totale = capital de départ + intérêts cumulés" }, { type: "timeline", title: "Ligne de temps", description: "Mois 1 → Mois 2 → Mois 3 : chronologie de la croissance" }], theoryBlocks: [{ title: "Intérêt", explanation: "On reçoit intérêt chaque mois.", formula: "Intérêt = Capital × Taux", example: "100 F × 10 F." }] },
  ] },
  // PRIMAIRE 5
  { slug: "primaire-5", title: "Primaire 5", degree: "Degré moyen", focus: "Décimaux, fractions, surfaces", overview: "Décimaux. Fractions. Surface.", learningObjectives: ["Décimaux simples.", "Fractions numériques.", "Surface rectangle.", "Volumes."], localContexts: ["litres", "prix", "champs", "récipients"], theoryBlocks: [], exercises: [], courseSlug: "primaire-5", courseChapters: [
    { id: "p5-ch1", title: "Décimaux", subtitle: "Virgule et dixièmes", exerciseIds: [], sakataContext: "Tissu.", visualizations: [{ type: "decimal-grid", title: "Grille décimale", description: "Chaque case = 0,01 : voir le nombre décimal sur 100 cases" }, { type: "place-value-grid", title: "Valeur de position", description: "Entiers | dixièmes | centièmes : 3,5 se décompose" }, { type: "number-line", title: "Droite numérique", description: "Placer 3,5 entre 3 et 4 sur la droite" }, { type: "bar-model", title: "Entier + décimal", description: "3,5 = barre de 3 entiers + demi-barre" }], theoryBlocks: [{ title: "Virgule", explanation: "Sépare entiers.", formula: "3,5 = 3 + 0,5", example: "15,5 F." }] },
    { id: "p5-ch2", title: "Opérations décimales", subtitle: "Additionner", exerciseIds: [], sakataContext: "12,5 kg.", visualizations: [{ type: "decimal-grid", title: "Grille décimale", description: "Voir l'addition de deux décimaux case par case" }, { type: "number-line", title: "Sauts décimaux", description: "Sauter sur la droite par pas décimaux" }, { type: "balance", title: "Équilibre", description: "12,5 + 8,3 = 20,8 : l'équilibre se maintient" }, { type: "bar-model", title: "Modèle de barre", description: "Deux barres qui se cumulent jusqu'au total" }], theoryBlocks: [{ title: "Ajouter", explanation: "Aligner virgules.", formula: "12,5 + 8,3 = 20,8", example: "15,7 kg." }] },
    { id: "p5-ch3", title: "Fractions numériques", subtitle: "Lire 2/3, 3/4", exerciseIds: [], sakataContext: "Parcelle.", visualizations: [{ type: "fraction-bar", title: "Barres de fractions", description: "Lire 2/3, 3/4 sur les barres comparées" }, { type: "fraction-circle", title: "Cercle fractionné", description: "Colorier 3 parts sur 4 dans le cercle" }, { type: "decimal-grid", title: "Fraction = décimal", description: "3/4 = 75 cases sur 100 : voir la relation" }, { type: "number-line", title: "Fractions sur droite", description: "Placer 2/3 et 3/4 entre 0 et 1" }], theoryBlocks: [{ title: "Lire", explanation: "3/4 : 4 dit combien.", formula: "3/4", example: "3/4 de manioc." }] },
    { id: "p5-ch4", title: "Surface rectangle", subtitle: "Longueur × largeur", exerciseIds: [], sakataContext: "Champ.", visualizations: [{ type: "area-rectangle", title: "Grille surface", description: "Compter les cases à l'intérieur : chaque case = 1 m²" }, { type: "ruler-measure", title: "Mesurer les dimensions", description: "Mesurer la longueur et la largeur du champ" }, { type: "multiplication-grid", title: "Longueur × Largeur", description: "La grille montre que L × l = Surface" }, { type: "statistics-bars", title: "Surfaces comparées", description: "Comparer deux champs de dimensions différentes" }], theoryBlocks: [{ title: "Surface", explanation: "Surface = longueur × largeur.", formula: "S = L × l", example: "Champ." }] },
    { id: "p5-ch5", title: "Volumes et litres", subtitle: "Mesurer l'eau", exerciseIds: [], sakataContext: "Jarre.", visualizations: [{ type: "bar-model", title: "Volumes comparés", description: "Comparer les volumes : bol, verre, jarre, seau" }, { type: "number-line", title: "Droite des volumes", description: "Placer 0,5 L, 1 L, 2 L, 5 L sur la droite" }, { type: "statistics-bars", title: "Comparaison en barres", description: "Bol, verre, jarre, seau : volumes en barres" }, { type: "balance", title: "Équilibre des volumes", description: "2 L + 3 L équivaut à 5 L sur la balance" }], theoryBlocks: [{ title: "Litre", explanation: "1 L = 1 000 mL.", formula: "1 L = 1000 mL", example: "Jarre 5 L." }] },
  ] },
  // PRIMAIRE 6
  { slug: "primaire-6", title: "Primaire 6", degree: "Degré moyen", focus: "Pourcentages, proportions, géométrie", overview: "Pourcentages. Proportions. Graphiques.", learningObjectives: ["Pourcentages.", "Proportionnalité.", "Polygones.", "Lire graphiques."], localContexts: ["profit", "partage", "cartes", "statistiques"], theoryBlocks: [], exercises: [], courseSlug: "primaire-6", courseChapters: [
    { id: "p6-ch1", title: "Pourcentages", subtitle: "50% 25% 10%", exerciseIds: [], sakataContext: "Nasse.", visualizations: [{ type: "decimal-grid", title: "Grille des pourcentages", description: "100 cases : colorier 50, 25, 10 pour voir le pourcentage" }, { type: "fraction-circle", title: "Cercle %", description: "50% = demi-cercle, 25% = quart : voir visuellement" }, { type: "statistics-bars", title: "Barres comparées", description: "50%, 25%, 10% : trois barres côte à côte" }, { type: "fraction-bar", title: "Barres de fractions", description: "Relier pourcentage et fraction : 50% = 1/2, 25% = 1/4" }], theoryBlocks: [{ title: "Pourcentage", explanation: "Fraction sur 100.", formula: "% = Nombre/100", example: "25% de 200 = 50." }] },
    { id: "p6-ch2", title: "Proportionnalité", subtitle: "Grandeurs proportionnelles", exerciseIds: [], sakataContext: "1 kg poisson.", visualizations: [{ type: "statistics-bars", title: "Deux grandeurs liées", description: "Quand l'une double, l'autre double aussi" }, { type: "number-line", title: "Valeurs proportionnelles", description: "Placer les valeurs sur la droite pour voir la régularité" }, { type: "bar-model", title: "Modèle proportionnel", description: "Les barres grandissent de façon régulière" }, { type: "fraction-bar", title: "Ratios", description: "Vérifier que chaque ratio est identique" }], theoryBlocks: [{ title: "Proportion", explanation: "Une augmente, l'autre augmente.", formula: "x1/y1 = x2/y2", example: "2 pirogues = 2 pêcheurs." }] },
    { id: "p6-ch3", title: "Polygones", subtitle: "Carrés rectangles triangles", exerciseIds: [], sakataContext: "Terrain.", visualizations: [{ type: "shape-explorer", title: "Explorateur de polygones", description: "Propriétés de chaque polygone : côtés, angles, symétries" }, { type: "ruler-measure", title: "Mesurer les côtés", description: "Mesurer et comparer les côtés de chaque polygone" }, { type: "area-rectangle", title: "Surface intérieure", description: "L × l pour calculer la surface" }, { type: "place-value-grid", title: "Tableau des propriétés", description: "Nombre de côtés, angles, symétries pour chaque forme" }], theoryBlocks: [{ title: "Carré", explanation: "4 côtés égaux.", formula: "Carré", example: "Terrain 10×10." }] },
    { id: "p6-ch4", title: "Graphiques", subtitle: "Lire données visuellement", exerciseIds: [], sakataContext: "Tableau poissons.", visualizations: [{ type: "statistics-bars", title: "Graphique en barres", description: "Lire la hauteur : Lundi = 5 kg, Mardi = 8 kg" }, { type: "decimal-grid", title: "Données en grille", description: "Représenter les proportions sur une grille" }, { type: "timeline", title: "Séries temporelles", description: "Données semaine par semaine : variations de la récolte" }, { type: "number-line", title: "Échelle du graphique", description: "Choisir l'échelle pour l'axe vertical" }], theoryBlocks: [{ title: "Graphique barres", explanation: "Hauteur = quantité.", formula: "Hauteur barre = Quantité", example: "Graphique." }] },
    { id: "p6-ch5", title: "Problèmes complexes", subtitle: "Réunir apprentissages", exerciseIds: [], sakataContext: "Pêcheur.", visualizations: [{ type: "bar-model", title: "Modèle de barre", description: "Décomposer le problème : données connues vs inconnue" }, { type: "statistics-bars", title: "Données visuelles", description: "Représenter les données pour mieux les voir" }, { type: "number-line", title: "Étapes de calcul", description: "Suivre chaque étape sur la droite numérique" }, { type: "timeline", title: "Processus de résolution", description: "Lire → Identifier → Opérer → Répondre" }], theoryBlocks: [{ title: "Résoudre", explanation: "Lire → Identifier → Choisir → Calculer.", formula: "Données → Opérations", example: "60 kg, 50%." }] },
  ] },
];

export const primaryPrograms: MathematicsProgramYear[] = primaireProgramsData;