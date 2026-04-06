"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Image, Video, BookOpen, MessageCircle, Heart, MapPin } from "lucide-react";

interface CommunityFeedProps {
  onClose: () => void;
  onPinSelect: (pin: Record<string, unknown>) => void;
}

// Données simulées en attendant Supabase
const MOCK_PINS = [
  {
    id: "1",
    title: "Village de mon grand-père",
    description: "Ici se trouvait le village de mon grand-père, un lieu de mémoire pour notre famille.",
    annotation_type: "story",
    user_name: "Jean-Pierre M.",
    likes_count: 12,
    coordinates: [17.75, -2.95] as [number, number],
    created_at: "2026-04-01",
  },
  {
    id: "2",
    title: "Pêche collective sur la Lebili",
    description: "Photo de la pêche annuelle collective sur la rivière Lebili.",
    annotation_type: "photo",
    user_name: "Marie K.",
    likes_count: 24,
    coordinates: [17.68, -2.82] as [number, number],
    created_at: "2026-03-28",
  },
  {
    id: "3",
    title: "Proverbe du jour",
    description: "\"La rivière ne tarit pas, elle change de chemin.\" — Proverbe sakata",
    annotation_type: "proverb",
    user_name: "Sage Mboko",
    likes_count: 45,
    coordinates: [17.82, -2.92] as [number, number],
    created_at: "2026-03-25",
  },
  {
    id: "4",
    title: "Cérémonie traditionnelle",
    description: "Vidéo de la cérémonie d'initiation des jeunes au bord du lac.",
    annotation_type: "video",
    user_name: "Patrick B.",
    likes_count: 38,
    coordinates: [17.90, -2.60] as [number, number],
    created_at: "2026-03-20",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  photo: Image,
  video: Video,
  story: BookOpen,
  proverb: MessageCircle,
  memory: Heart,
  historical: MapPin,
  question: MessageCircle,
};

export default function CommunityFeed({ onClose, onPinSelect }: CommunityFeedProps) {
  const [likedPins, setLikedPins] = useState<Set<string>>(new Set());

  const handleLike = (e: React.MouseEvent, pinId: string) => {
    e.stopPropagation();
    setLikedPins((prev) => {
      const next = new Set(prev);
      if (next.has(pinId)) {
        next.delete(pinId);
      } else {
        next.add(pinId);
      }
      return next;
    });
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full z-30 w-full max-w-sm"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: "rgba(10, 31, 21, 0.95)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(196, 160, 53, 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(196, 160, 53, 0.15)" }}
        >
          <div>
            <h2
              className="text-sm font-semibold tracking-wide"
              style={{
                color: "var(--or-ancestral)",
                fontFamily: "var(--font-geist-mono)",
                letterSpacing: "0.05em",
              }}
            >
              Contributions
            </h2>
            <p className="text-[10px] opacity-50 mt-0.5" style={{ color: "var(--brume-matinale)" }}>
              {MOCK_PINS.length} épingles
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-200 hover:bg-white/10"
            style={{ color: "var(--brume-matinale)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {MOCK_PINS.map((pin) => {
            const TypeIcon = typeIcons[pin.annotation_type] || BookOpen;
            const isLiked = likedPins.has(pin.id);

            return (
              <motion.div
                key={pin.id}
                className="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-white/5"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(196, 160, 53, 0.1)",
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onPinSelect(pin as unknown as Record<string, unknown>)}
              >
                {/* Type + User */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TypeIcon
                      size={12}
                      style={{ color: "var(--or-ancestral)", opacity: 0.7 }}
                    />
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{
                        color: "var(--or-ancestral)",
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      {pin.annotation_type}
                    </span>
                  </div>
                  <span
                    className="text-[10px] opacity-40"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {pin.created_at}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-sm font-medium mb-1.5"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  {pin.title}
                </h3>

                {/* Description */}
                <p
                  className="text-xs leading-relaxed mb-3 line-clamp-2"
                  style={{ color: "var(--brume-matinale)" }}
                >
                  {pin.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] opacity-50"
                      style={{ color: "var(--brume-matinale)" }}
                    >
                      {pin.user_name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleLike(e, pin.id)}
                    className="flex items-center gap-1.5 transition-colors duration-200"
                    style={{
                      color: isLiked ? "#EF4444" : "rgba(212, 221, 215, 0.4)",
                    }}
                  >
                    <Heart
                      size={12}
                      fill={isLiked ? "#EF4444" : "none"}
                    />
                    <span className="text-[10px]">
                      {pin.likes_count + (isLiked ? 1 : 0)}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "rgba(196, 160, 53, 0.15)" }}
        >
          <button
            className="w-full py-2.5 rounded-xl text-xs font-medium tracking-wider uppercase transition-all duration-200 hover:bg-white/10"
            style={{
              background: "rgba(196, 160, 53, 0.15)",
              border: "1px solid rgba(196, 160, 53, 0.3)",
              color: "var(--or-ancestral)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            Ajouter une épingle
          </button>
        </div>
      </div>
    </motion.div>
  );
}