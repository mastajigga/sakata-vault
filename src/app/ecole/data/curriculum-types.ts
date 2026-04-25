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
