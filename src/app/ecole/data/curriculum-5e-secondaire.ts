import type { MathematicsProgramYear } from "./curriculum-types";

export const cinquiemeSecondaryProgram: MathematicsProgramYear[] = [
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
];
