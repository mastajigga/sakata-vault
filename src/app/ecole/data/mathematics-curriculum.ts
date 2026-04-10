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
        explanation:
          "Une fonction affine décrit une relation proportionnelle décalée. Le coefficient a indique la pente, b le point de départ.",
        formula: "y = ax + b",
        example: "Le prix d'un poisson : y = 150x + 200, avec x le nombre de poissons et 200 F de frais fixes.",
      },
      {
        title: "Résoudre un système par substitution",
        explanation:
          "On exprime une inconnue en fonction de l'autre, puis on substitue dans la seconde équation. On résout, puis on vérifie.",
        formula: "\\begin{cases} x + y = 10 \\\\ x - y = 2 \\end{cases} \\Rightarrow x = 6,\\; y = 4",
        example: "Deux types de sacs dont la somme est 10 et la différence est 2.",
      },
      {
        title: "Angles dans un triangle",
        explanation:
          "La somme des angles d'un triangle est toujours 180°. Cette propriété aide à trouver un angle manquant dans une charpente ou une toiture.",
        formula: "\\alpha + \\beta + \\gamma = 180°",
        example: "Un triangle de toiture avec des angles de 60° et 75° a un troisième angle de 45°.",
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
          "Substitue : x + (x + 3) = 9 → 2x + 3 = 9 → 2x = 6 → x = 3.",
        ],
        solutionSteps: [
          "Système : x + y = 9 et y = x + 3.",
          "Substitution : x + x + 3 = 9 → 2x = 6 → x = 3.",
          "Il y a 3 petits sacs (et 6 grands).",
        ],
        challenge: "Vérifie : 3 + 6 = 9 et 6 - 3 = 3. Correct ?",
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
          "Troisième angle : 180 - 125 = 55°.",
          "La toiture a un troisième angle de 55°.",
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
          "Distance montée : 6t. Distance descente : 9(t - 2).",
          "Les distances sont égales : 6t = 9(t - 2).",
          "6t = 9t - 18 → 18 = 3t → t = 6.",
        ],
        solutionSteps: [
          "Équation : 6t = 9(t - 2).",
          "6t = 9t - 18.",
          "18 = 3t → t = 6 heures.",
        ],
        challenge: "Quelle est la distance parcourue ?",
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
        explanation:
          "Une équation de la forme ax² + bx + c = 0 admet des solutions réelles si le discriminant Δ = b² - 4ac est positif ou nul.",
        formula: "x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}, \\quad \\Delta = b^2 - 4ac",
        example: "x² - 5x + 6 = 0 : Δ = 25 - 24 = 1, x₁ = 3, x₂ = 2.",
      },
      {
        title: "Le théorème de Pythagore",
        explanation:
          "Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.",
        formula: "c^2 = a^2 + b^2",
        example: "Un triangle aux côtés 3 m et 4 m a une hypoténuse de 5 m.",
      },
      {
        title: "Moyenne et médiane",
        explanation:
          "La moyenne arithmétique est la somme des valeurs divisée par leur nombre. La médiane est la valeur centrale quand les données sont ordonnées.",
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
          "Équation : x² + 2x - 15 = 0.",
          "Δ = 4 + 60 = 64. √64 = 8. x = (-2 + 8) / 2 = 3.",
        ],
        solutionSteps: [
          "x² + 2x - 15 = 0.",
          "Δ = 4 + 60 = 64, √Δ = 8.",
          "x = (-2 + 8) / 2 = 3 m (on retient la solution positive).",
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
          "Les deux chemins forment un angle droit : triangle rectangle.",
          "c² = 9² + 12² = 81 + 144 = 225.",
          "c = √225 = 15 m.",
        ],
        solutionSteps: [
          "c² = 9² + 12² = 81 + 144 = 225.",
          "c = √225 = 15 m.",
          "La distance en ligne droite est 15 m.",
        ],
        challenge: "Reconnais-tu le triplet pythagoricien 3-4-5 multiplié par 3 ?",
      },
      {
        id: "3s-moyenne",
        title: "Les captures de la semaine",
        context: "Un pêcheur a capturé 8, 12, 6, 10 et 14 poissons sur cinq jours.",
        prompt: "Quelle est sa moyenne quotidienne de captures ?",
        answerType: "math-input",
        expectedAnswer: "10",
        hintSteps: [
          "Additionne toutes les captures.",
          "8 + 12 + 6 + 10 + 14 = 50.",
          "Divise par le nombre de jours : 50 ÷ 5.",
        ],
        solutionSteps: [
          "Somme : 8 + 12 + 6 + 10 + 14 = 50.",
          "Nombre de jours : 5.",
          "Moyenne : 50 ÷ 5 = 10 poissons/jour.",
        ],
        challenge: "Quel jour le pêcheur a-t-il fait le moins bien par rapport à la moyenne ?",
      },
      {
        id: "3s-factorisation",
        title: "Partage des terrains",
        context: "Un terrain de surface x² - 9 m² doit être partagé en deux parties rectangulaires égales de largeur (x - 3).",
        prompt: "Quelle est la longueur de chaque partie ?",
        answerType: "math-input",
        expectedAnswer: ["x+3", "x + 3"],
        equation: "x^2 - 9 = (x-3)(x+3)",
        hintSteps: [
          "x² - 9 est une différence de deux carrés.",
          "a² - b² = (a - b)(a + b).",
          "Donc x² - 9 = (x - 3)(x + 3).",
        ],
        solutionSteps: [
          "x² - 9 = x² - 3² = (x - 3)(x + 3).",
          "Largeur (x - 3) × Longueur = x² - 9.",
          "Longueur = (x + 3) m.",
        ],
        challenge: "Si x = 5 m, quelle est l'aire totale du terrain ?",
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
  },
];
