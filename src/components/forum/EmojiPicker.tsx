"use client";

import dynamic from "next/dynamic";
import data from "@emoji-mart/data";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// emoji-mart needs to be SSR-disabled (uses window APIs)
const Picker = dynamic(() => import("@emoji-mart/react"), { ssr: false });

interface EmojiPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}

export default function EmojiPicker({ open, onClose, onSelect }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Add a tiny delay so the opening click doesn't immediately close
    const t = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 50);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 bottom-full left-0 mb-2"
        >
          <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-or-ancestral/20">
            <Picker
              data={data}
              theme="dark"
              onEmojiSelect={(emoji: any) => {
                onSelect(emoji.native);
                onClose();
              }}
              previewPosition="none"
              navPosition="top"
              perLine={9}
              maxFrequentRows={1}
              locale="fr"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
