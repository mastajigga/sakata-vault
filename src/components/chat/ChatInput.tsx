"use client";

import React, { useState, useRef } from "react";
import { Send, Paperclip, Mic, X, Clock } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string, attachment?: File | null, expiresIn?: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [expiresIn, setExpiresIn] = useState<"never" | "7_days" | "30_days">("never");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    onSend(content, null, expiresIn);
    setContent("");
  };

  return (
    <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-3 md:p-4 relative">
      {/* Expiration Options Popup */}
      {showOptions && (
        <div className="absolute bottom-full left-4 mb-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-hidden flex flex-col z-20 w-48">
          <div className="p-2 border-b border-stone-100 dark:border-stone-700 text-xs font-semibold text-stone-500 uppercase tracking-wider flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
            <span>Auto-destruction</span>
            <button onClick={() => setShowOptions(false)}><X size={14} /></button>
          </div>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 ${expiresIn === 'never' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("never"); setShowOptions(false); }}
          >
            Jamais (Conserver)
          </button>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center ${expiresIn === '30_days' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("30_days"); setShowOptions(false); }}
          >
            <Clock size={14} className="mr-2" />
            Après 30 jours
          </button>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center ${expiresIn === '7_days' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("7_days"); setShowOptions(false); }}
          >
            <Clock size={14} className="mr-2 text-rose-500" />
            Après 7 jours
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <button 
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          title="Paramètres d'auto-destruction"
          className={`p-3 rounded-full flex-shrink-0 transition-colors duration-200 ${
            expiresIn !== 'never' 
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock size={20} />
        </button>

        <button 
          type="button"
          className="p-3 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full flex-shrink-0 transition-colors"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 bg-stone-100 dark:bg-stone-800 rounded-3xl relative overflow-hidden flex items-center shadow-inner">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent px-4 py-3 focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-500"
            placeholder="Écrire un message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {content.trim() ? (
          <button 
            type="submit"
            className="p-3 bg-amber-600 text-white rounded-full flex-shrink-0 hover:bg-amber-700 transition shadow-md hover:scale-105 active:scale-95 flex items-center justify-center h-12 w-12"
          >
            <Send size={20} className="ml-1" />
          </button>
        ) : (
          <button 
            type="button"
            className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-full flex-shrink-0 hover:bg-stone-200 dark:hover:bg-stone-700 transition flex items-center justify-center h-12 w-12"
          >
            <Mic size={20} />
          </button>
        )}
      </form>
    </div>
  );
}
