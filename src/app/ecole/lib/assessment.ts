export function normalizeMathAnswer(value: string) {
  return value.replace(/\s+/g, "").replace(/,/g, ".").toLowerCase().trim();
}

export function isMathAnswerCorrect(input: string, expected: string | string[]) {
  const normalizedInput = normalizeMathAnswer(input);
  const acceptedAnswers = Array.isArray(expected) ? expected : [expected];

  return acceptedAnswers.some((candidate) => normalizeMathAnswer(candidate) === normalizedInput);
}

export function calculateCompletion(totalExercises: number, completedExercises: number) {
  if (totalExercises <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((completedExercises / totalExercises) * 100));
}
