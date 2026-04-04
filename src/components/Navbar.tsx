"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogOut, LayoutDashboard, UserCircle } from "lucide-react";

const navLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.knowledge", href: "/savoir" },
  { key: "nav.community", href: "#communaute" },
];

const Navbar = () => {
  const { t } = useLanguage();
  const { user, role, isLoading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all"
        style={{
          transitionDuration: "800ms",
          transitionTimingFunction: "var(--ease-smooth)",
          background: scrolled
            ? "var(--verre-forestier)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid var(--bordure-brume)"
            : "1px solid transparent",
        }}
      >
        <div
          className="section-container flex items-center justify-between"
          style={{ height: "var(--header-height)" }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold tracking-tighter"
            style={{ fontSize: "1.4rem", color: "var(--or-ancestral)" }}
          >
            KISAKATA
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-all"
                style={{
                  color: "var(--brume-matinale)",
                  opacity: 0.7,
                  transitionDuration: "var(--duration-base)",
                  transitionTimingFunction: "var(--ease-smooth)",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.opacity = "1";
                  (e.target as HTMLElement).style.color = "var(--or-ancestral)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.opacity = "0.7";
                  (e.target as HTMLElement).style.color = "var(--brume-matinale)";
                }}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {!isLoading && (
              user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href={role && ["admin", "manager", "contributor"].includes(role) ? "/admin" : "/profil"}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all border border-or/30 hover:border-or"
                    style={{
                      background: "rgba(181, 149, 81, 0.1)",
                      color: "var(--or-ancestral)",
                    }}
                  >
                    {role && ["admin", "manager", "contributor"].includes(role) ? (
                      <LayoutDashboard className="w-4 h-4" />
                    ) : (
                      <UserCircle className="w-4 h-4" />
                    )}
                    {role && ["admin", "manager", "contributor"].includes(role) ? t("nav.dashboard") : user.email?.split("@")[0]}
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-all"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4 text-ivoire-ancien/60" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all border border-or/30 hover:border-or"
                  style={{
                    background: "transparent",
                    color: "var(--or-ancestral)",
                    transitionDuration: "var(--duration-base)",
                    transitionTimingFunction: "var(--ease-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = "var(--or-ancestral)";
                    (e.target as HTMLElement).style.color = "var(--foret-nocturne)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color = "var(--or-ancestral)";
                  }}
                >
                  {t("nav.login")}
                </Link>
              )
            )}

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden relative z-50 flex flex-col justify-center items-center gap-1.5"
              style={{ width: "32px", height: "32px" }}
              aria-label="Toggle menu"
            >
              <span
                className="block rounded-full transition-all"
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "var(--ivory-warm)",
                  transitionDuration: "300ms",
                  transform: menuOpen
                    ? "rotate(45deg) translate(2px, 2px)"
                    : "none",
                }}
              />
              <span
                className="block rounded-full transition-all"
                style={{
                  width: "16px",
                  height: "1.5px",
                  background: "var(--ivory-warm)",
                  transitionDuration: "300ms",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                className="block rounded-full transition-all"
                style={{
                  width: "22px",
                  height: "1.5px",
                  background: "var(--ivoire-ancien)",
                  transitionDuration: "300ms",
                  transform: menuOpen
                    ? "rotate(-45deg) translate(2px, -2px)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: "rgba(10, 31, 21, 0.98)", // Foret Nocturne almost opaque
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-bold tracking-tight transition-colors"
                    style={{ color: "var(--ivory-warm)" }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color =
                        "var(--amber-light)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color =
                        "var(--ivory-warm)";
                    }}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8"
              >
                <Link
                  href="/auth"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center px-8 py-4 rounded-full text-sm font-semibold"
                  style={{
                    background: "var(--emerald-deep)",
                    color: "var(--ivory-warm)",
                  }}
                >
                  {t("nav.join")}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
