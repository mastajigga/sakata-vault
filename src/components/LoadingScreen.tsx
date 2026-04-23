"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";

const LoadingScreen = ({ isLoading }: { isLoading: boolean }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "var(--foret-nocturne)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Animated Logo */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="font-display font-bold tracking-[-0.05em]"
              style={{
                fontSize: "3.5rem",
                color: "var(--or-ancestral)",
                textShadow: "0 0 40px rgba(196, 160, 53, 0.5)",
              }}
            >
              SAKATA
            </motion.div>

            {/* Loading Indicator */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--or-ancestral)" }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-mono tracking-[3px] uppercase opacity-60"
                style={{ color: "var(--brume-matinale)" }}
              >
                {t("loading.message") || "Transmission des savoirs..."}
              </motion.p>
            </div>

            {/* Subtle river mist line */}
            <motion.div
              className="w-48 h-px"
              style={{ background: "linear-gradient(90deg, transparent, var(--or-ancestral), transparent)" }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
