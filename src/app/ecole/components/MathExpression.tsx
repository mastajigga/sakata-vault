import katex from "katex";

interface MathExpressionProps {
  expression: string;
  displayMode?: boolean;
}

export default function MathExpression({ expression, displayMode = false }: MathExpressionProps) {
  let html = expression;

  try {
    html = katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: "ignore",
    });
  } catch (error) {
    console.warn("[ecole] Erreur de rendu KaTeX", error);
  }

  return (
    <div
      className={displayMode ? "katex-shell overflow-x-auto" : "inline-block"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
