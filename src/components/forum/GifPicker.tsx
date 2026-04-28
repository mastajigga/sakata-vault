"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Loader2, Sparkles } from "lucide-react";

interface TenorGif {
  id: string;
  title: string;
  url: string;          // page Tenor
  preview: string;      // tiny preview
  full: string;         // gif full size
  width: number;
  height: number;
}

interface GifPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (gif: TenorGif) => void;
}

export default function GifPicker({ open, onClose, onSelect }: GifPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TenorGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on open
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const url = query.trim()
      ? `/api/tenor/search?q=${encodeURIComponent(query)}`
      : `/api/tenor/search?q=&trending=1`;

    const timeout = setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          setResults(data.results || []);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setError("Impossible de charger les GIFs.");
            setLoading(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-3xl border border-or-ancestral/30 bg-foret-nocturne/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-or-ancestral" />
                <h3 className="font-display text-lg font-bold text-ivoire-ancien">
                  Choisir un GIF
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-ivoire-ancien/30">
                  via Tenor
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/5 text-ivoire-ancien/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivoire-ancien/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un GIF..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-or-ancestral/50 outline-none text-ivoire-ancien placeholder-ivoire-ancien/30 text-sm"
                />
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              {error && (
                <div className="text-center text-red-300 py-8">{error}</div>
              )}

              {!error && loading && results.length === 0 && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-or-ancestral" />
                </div>
              )}

              {!error && !loading && results.length === 0 && (
                <div className="text-center text-ivoire-ancien/40 py-16 italic">
                  {query
                    ? "Aucun GIF trouvé."
                    : "Recherchez un thème pour découvrir des GIFs."}
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {results.map((gif) => (
                  <button
                    key={gif.id}
                    onClick={() => {
                      onSelect(gif);
                      onClose();
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-black/30 border border-white/5 hover:border-or-ancestral/50 transition-all"
                  >
                    <img
                      src={gif.preview}
                      alt={gif.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-white/5 text-[10px] text-ivoire-ancien/30 text-center">
              GIFs fournis par Tenor · Aucune publicité, aucun import
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
