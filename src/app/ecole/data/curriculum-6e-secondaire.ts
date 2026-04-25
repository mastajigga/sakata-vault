import type { MathematicsProgramYear } from "./curriculum-types";

export const sixiemeSecondaryProgram: MathematicsProgramYear[] = [
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
