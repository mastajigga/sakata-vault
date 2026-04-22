"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({ value, onChange, placeholder = "Écrivez votre message ici...", minHeight = "min-h-[250px]" }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="flex flex-col border border-[var(--or-ancestral)]/20 rounded-xl overflow-hidden bg-[var(--foret-nocturne)] focus-within:border-[var(--or-ancestral)]/50 transition-colors">
      <div className="flex items-center space-x-1 border-b border-[var(--or-ancestral)]/20 bg-[var(--eau-sombre)]/50 px-2 py-2">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === "write" ? "bg-[var(--or-ancestral)]/20 text-[var(--or-ancestral)]" : "text-[var(--ivoire-ancien)]/40 hover:text-[var(--ivoire-ancien)]/80"
          }`}
        >
          Écrire
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === "preview" ? "bg-[var(--or-ancestral)]/20 text-[var(--or-ancestral)]" : "text-[var(--ivoire-ancien)]/40 hover:text-[var(--ivoire-ancien)]/80"
          }`}
        >
          Aperçu
        </button>
      </div>

      <div className={`w-full ${minHeight} bg-[var(--foret-nocturne)]/50 p-4`}>
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[inherit] bg-transparent text-[var(--ivoire-ancien)] placeholder-[var(--ivoire-ancien)]/30 resize-y focus:outline-none focus:ring-0 font-light"
          />
        ) : (
          <div className="w-full h-full min-h-[inherit] prose prose-invert prose-p:text-[var(--ivoire-ancien)]/80 prose-headings:text-[var(--ivoire-ancien)] prose-a:text-[var(--or-ancestral)] prose-strong:text-[var(--or-ancestral)] max-w-none font-light">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-[var(--ivoire-ancien)]/30 italic">Rien à afficher...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
