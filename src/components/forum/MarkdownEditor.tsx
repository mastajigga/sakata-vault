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
    <div className="flex flex-col border border-[#B59551]/20 rounded-xl overflow-hidden bg-[#0A1F15] focus-within:border-[#B59551]/50 transition-colors">
      <div className="flex items-center space-x-1 border-b border-[#B59551]/20 bg-[#122A1E]/50 px-2 py-2">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === "write" ? "bg-[#B59551]/20 text-[#B59551]" : "text-[#F2EEDD]/40 hover:text-[#F2EEDD]/80"
          }`}
        >
          Écrire
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === "preview" ? "bg-[#B59551]/20 text-[#B59551]" : "text-[#F2EEDD]/40 hover:text-[#F2EEDD]/80"
          }`}
        >
          Aperçu
        </button>
      </div>

      <div className={`w-full ${minHeight} bg-[#0A1F15]/50 p-4`}>
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[inherit] bg-transparent text-[#F2EEDD] placeholder-[#F2EEDD]/30 resize-y focus:outline-none focus:ring-0 font-light"
          />
        ) : (
          <div className="w-full h-full min-h-[inherit] prose prose-invert prose-p:text-[#F2EEDD]/80 prose-headings:text-[#F2EEDD] prose-a:text-[#B59551] prose-strong:text-[#B59551] max-w-none font-light">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-[#F2EEDD]/30 italic">Rien à afficher...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
