"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { VARIANTS } from "@/lib/constants/animations";

/**
 * PageAnimate
 * Wraps content to provide smooth transitions between routes.
 * Uses usePathname as a key to trigger animations on navigation.
 */
export function PageAnimate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        variants={VARIANTS.slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-grow w-full relative"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
