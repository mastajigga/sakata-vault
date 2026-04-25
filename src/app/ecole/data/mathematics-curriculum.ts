export type { KnowledgeRiver, TheoryBlock, ExerciseChoice, GuidedExercise, Visualization, CourseChapter, MathematicsProgramYear } from "./curriculum-types";
export { knowledgeRivers } from "./curriculum-types";

import type { MathematicsProgramYear } from "./curriculum-types";
import { primaryPrograms } from "./curriculum-primaire";
import { premiereSecondaryProgram } from "./curriculum-1ere-secondaire";
import { deuxiemeSecondaryProgram } from "./curriculum-2e-secondaire";
import { troisiemeSecondaryProgram } from "./curriculum-3e-secondaire";
import { quatriemeSecondaryProgram } from "./curriculum-4e-secondaire";
import { cinquiemeSecondaryProgram } from "./curriculum-5e-secondaire";
import { sixiemeSecondaryProgram } from "./curriculum-6e-secondaire";

export const mathematicsPrograms: MathematicsProgramYear[] = [
  ...primaryPrograms,
  ...premiereSecondaryProgram,
  ...deuxiemeSecondaryProgram,
  ...troisiemeSecondaryProgram,
  ...quatriemeSecondaryProgram,
  ...cinquiemeSecondaryProgram,
  ...sixiemeSecondaryProgram,
];

export { primaryPrograms };

export const secondaryPrograms: MathematicsProgramYear[] = [
  ...premiereSecondaryProgram,
  ...deuxiemeSecondaryProgram,
  ...troisiemeSecondaryProgram,
  ...quatriemeSecondaryProgram,
  ...cinquiemeSecondaryProgram,
  ...sixiemeSecondaryProgram,
];

// Backward compatibility aliases
export const secondairePrograms = secondaryPrograms;
