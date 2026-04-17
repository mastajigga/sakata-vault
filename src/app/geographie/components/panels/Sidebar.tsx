"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  children: React.ReactNode;
  position: "left" | "right";
  className?: string;
  isMobile?: boolean;
}

export default function Sidebar({ children, position, className, isMobile }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: position === "left" ? -400 : 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        isMobile ? "w-full" : "w-80",
        "flex flex-col pointer-events-auto",
        position === "left" ? "items-start" : "items-end",
        className
      )}
    >
      <div className={cn(
        "w-full h-full p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-black/40 md:bg-black/30 backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden relative group",
        "after:absolute after:inset-0 after:rounded-2xl md:after:rounded-[2rem] after:border after:border-white/5 after:pointer-events-none"
      )}>
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* Corner HUD markers */}
        <div className={cn(
            "absolute top-4 w-3 h-3 border-t border-white/10",
            position === "left" ? "left-4 border-l" : "right-4 border-r"
        )} />
        
        <div className="relative z-10 h-full flex flex-col">
          {children}
        </div>
      </div>
    </motion.aside>
  );
}
