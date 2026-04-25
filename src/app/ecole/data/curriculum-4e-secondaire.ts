import type { MathematicsProgramYear } from "./curriculum-types";

export const quatriemeSecondaryProgram: MathematicsProgramYear[] = [
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
];
