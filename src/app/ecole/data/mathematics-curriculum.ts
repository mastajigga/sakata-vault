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
        formula: "10 unités = 1 dizaine",
        example: "23 signifie 2 dizaines et 3 unités.",
      },
      {
        title: "Additionner avec passage à la dizaine",
        explanation:
          "Quand les unités dépassent 9, on échange 10 unités contre 1 dizaine. Cela rend le calcul plus ordonné.",
        formula: "28 + 7 = 35",
        example: "8 unités plus 7 unités font 15 unités, soit 1 dizaine et 5 unités.",
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
        formula: "3,5 = 3 + \\frac{5}{10}",
        example: "2,5 kg signifie 2 kg et un demi-kilo.",
      },
      {
        title: "L'aire mesure une surface",
        explanation:
          "Pour un rectangle, l'aire se calcule en multipliant la longueur par la largeur. Cela aide à comparer des parcelles.",
        formula: "A = L \\times l",
        example: "Une parcelle de 8 m sur 5 m a une aire de 40 m².",
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
        formula: "données \\rightarrow opérations \\rightarrow vérification",
        example: "D'abord additionner les sacs, puis calculer la part d'un quart.",
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
    ],
  },
];
