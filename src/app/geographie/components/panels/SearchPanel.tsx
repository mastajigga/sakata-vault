"use client";

import React, { useState, useMemo } from "react";
import { Search, MapPin, Users, X } from "lucide-react";

interface Village {
  name: string;
  coordinates: [number, number];
  type?: string;
  population?: number;
  description?: string;
}

interface SearchPanelProps {
  villagesData: GeoJSON.FeatureCollection<GeoJSON.Point> | null;
  onResultClick: (coordinates: [number, number], feature: Village) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ villagesData, onResultClick }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const villages: Village[] = useMemo(() => {
    if (!villagesData?.features) return [];
    return villagesData.features.map((f) => ({
      name: f.properties?.name || f.properties?.nom || "Lieu inconnu",
      coordinates: f.geometry.coordinates as [number, number],
      type: f.properties?.type || f.properties?.category || "village",
      population: f.properties?.population,
      description: f.properties?.description,
    }));
  }, [villagesData]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return villages.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.type?.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q)
    );
  }, [query, villages]);

  const handleSelect = (village: Village) => {
    onResultClick(village.coordinates, village);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="absolute top-20 left-6 z-20 w-80">
      {/* Search input */}
      <div
        className="rounded-xl overflow-hidden backdrop-blur-md"
        style={{
          background: "rgba(10, 31, 21, 0.85)",
          border: "1px solid rgba(196, 160, 53, 0.15)",
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--or-ancestral, #C4A035)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher un village, un lieu..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
            style={{ color: "var(--ivoire-ancien, #F0EDE5)" }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3 opacity-50" style={{ color: "var(--brume-matinale, #D4DDD7)" }} />
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {isOpen && results.length > 0 && (
          <div
            className="max-h-64 overflow-y-auto border-t border-white/5"
            style={{ background: "rgba(10, 31, 21, 0.95)" }}
          >
            {results.map((village, index) => (
              <button
                key={village.name + index}
                onClick={() => handleSelect(village)}
                className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-white/5"
                style={{
                  background:
                    index === selectedIndex ? "rgba(196, 160, 53, 0.1)" : "transparent",
                }}
              >
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: "var(--or-ancestral, #C4A035)" }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--ivoire-ancien, #F0EDE5)" }}
                  >
                    {village.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--or-ancestral, #C4A035)", opacity: 0.7 }}
                    >
                      {village.type}
                    </span>
                    {village.population && (
                      <>
                        <span style={{ color: "var(--brume-matinale, #D4DDD7)", opacity: 0.3 }}>•</span>
                        <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--brume-matinale, #D4DDD7)", opacity: 0.6 }}>
                          <Users className="w-3 h-3" />
                          {village.population.toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No results */}
        {isOpen && query && results.length === 0 && (
          <div className="px-4 py-6 text-center border-t border-white/5">
            <p className="text-xs opacity-50" style={{ color: "var(--brume-matinale, #D4DDD7)" }}>
              Aucun résultat pour "{query}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;