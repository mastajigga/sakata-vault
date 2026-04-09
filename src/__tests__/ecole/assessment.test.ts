import { describe, expect, it } from "vitest";
import { mathematicsPrograms } from "@/app/ecole/data/mathematics-curriculum";
import { calculateCompletion, isMathAnswerCorrect, normalizeMathAnswer } from "@/app/ecole/lib/assessment";

describe("ecole assessment helpers", () => {
  it("normalizes spaces and decimal separators", () => {
    expect(normalizeMathAnswer(" 3,5 ")).toBe("3.5");
  });

  it("accepts one among multiple valid answers", () => {
    expect(isMathAnswerCorrect("4x3", ["12", "4x3"])).toBe(true);
    expect(isMathAnswerCorrect(" 12 ", ["12", "4x3"])).toBe(true);
    expect(isMathAnswerCorrect("11", ["12", "4x3"])).toBe(false);
  });

  it("calculates completion safely", () => {
    expect(calculateCompletion(4, 1)).toBe(25);
    expect(calculateCompletion(0, 0)).toBe(0);
  });
});

describe("mathematics curriculum data", () => {
  it("covers the six primary school years", () => {
    expect(mathematicsPrograms).toHaveLength(6);
  });

  it("ensures every year has objectives, theory and exercises", () => {
    for (const program of mathematicsPrograms) {
      expect(program.learningObjectives.length).toBeGreaterThan(0);
      expect(program.theoryBlocks.length).toBeGreaterThan(0);
      expect(program.exercises.length).toBeGreaterThan(0);
    }
  });

  it("ships a richer demo for first year", () => {
    const firstYear = mathematicsPrograms.find((program) => program.slug === "1ere-annee");
    expect(firstYear?.exercises.length).toBeGreaterThanOrEqual(4);
  });
});
