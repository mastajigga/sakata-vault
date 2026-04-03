"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl glass-card px-8 py-4 flex justify-between items-center"
      style={{ height: "var(--header-height)" }}
    >
      <Link href="/" className="text-2xl font-bold tracking-tighter text-gradient">
        KISAKATA
      </Link>
      
      <div className="hidden md:flex gap-8 items-center font-medium text-sm transition-smooth">
        <Link href="/savoir" className="hover:text-[var(--sakata-gold)] opacity-70 hover:opacity-100 transition-opacity">Savoir</Link>
        <Link href="/langue" className="hover:text-[var(--sakata-gold)] opacity-70 hover:opacity-100 transition-opacity">Langue</Link>
        <Link href="/spirituality" className="hover:text-[var(--sakata-gold)] opacity-70 hover:opacity-100 transition-opacity">Spiritualité</Link>
        <Link href="/forum" className="hover:text-[var(--sakata-gold)] opacity-70 hover:opacity-100 transition-opacity">Forum</Link>
      </div>
      
      <Link href="/auth" className="bg-[var(--sakata-green-vibrant)] text-white px-6 py-2 rounded-full text-sm font-semibold hover:scale-105 transition-transform active:scale-95">
        Rejoindre
      </Link>
    </motion.nav>
  );
};

export default Navbar;
