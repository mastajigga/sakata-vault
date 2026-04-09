"use client";

import { useEffect, useRef } from "react";

interface MathFieldInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type MathFieldElement = HTMLElement & {
  value?: string;
};

export default function MathFieldInput({ value, onChange, placeholder }: MathFieldInputProps) {
  const fieldRef = useRef<MathFieldElement | null>(null);

  useEffect(() => {
    let active = true;

    import("mathlive").catch((error) => {
      console.warn("[ecole] MathLive n'a pas pu être initialisé", error);
    });

    const field = fieldRef.current;
    if (!field) {
      return;
    }

    const handleInput = () => {
      if (!active) {
        return;
      }

      onChange(field.value ?? "");
    };

    field.addEventListener("input", handleInput);

    return () => {
      active = false;
      field.removeEventListener("input", handleInput);
    };
  }, [onChange]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) {
      return;
    }

    if ((field.value ?? "") !== value) {
      field.value = value;
    }
  }, [value]);

  return (
    <math-field
      ref={fieldRef}
      aria-label="Réponse mathématique"
      className="w-full"
      placeholder={placeholder ?? "Écris ton calcul ou ton nombre"}
      smart-mode="false"
      virtual-keyboard-mode="manual"
    />
  );
}
