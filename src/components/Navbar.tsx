"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogOut, UserCircle, RefreshCw, X, MessageSquare } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useGlobalUnreadCount } from "@/hooks/chat/useGlobalUnreadCount";

const navLinks = [
  { key: "nav.home", href: ROUTES.HOME },
  { key: "nav.knowledge", href: ROUTES.SAVOIR },
  { key: "nav.school", href: ROUTES.ECOLE },
  { key: "nav.geography", href: ROUTES.GEOGRAPHIE },
  { key: "nav.community", href: ROUTES.FORUM },
  { key: "nav.members", href: ROUTES.MEMBRES },
  { key: "nav.chat", href: ROUTES.CHAT },
];

const Navbar = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading, connectionError, sessionExpired, signOut } = useAuth();
  const totalUnread = useGlobalUnreadCount();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dismissedExpiry, setDismissedExpiry] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showExpiryBanner = sessionExpired && !user && !dismissedExpiry;

  return (
    <>
      {/* Session expiry banner — shown when token rotation silently logs user out */}
      <AnimatePresence>
        {showExpiryBanner && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-4 py-2.5"
            style={{
              background: "rgba(196,130,53,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(196,130,53,0.3)",
            }}
          >
            <div className="flex items-center gap-2 text-sm" style={{ color: "var(--or-ancestral)" }}>
              <RefreshCw size={14} className="shrink-0" />
              <span>Votre session a expiré (reconnexion depuis un autre appareil).</span>
              <Link
                href={ROUTES.AUTH}
                className="font-semibold underline underline-offset-2 ml-1 hover:opacity-80 transition-opacity"
              >
                Se reconnecter →
              </Link>
            </div>
            <button
              onClick={() => setDismissedExpiry(true)}
              aria-label="Fermer la notification"
              className="p-1 rounded-full hover:bg-white/10 transition-colors ml-3"
            >
              <X size={14} style={{ color: "var(--or-ancestral)" }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
          {/* Logo — équivalent Ctrl+Shift+R : vide tous les caches avant de recharger */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              // 1. Vider les clés applicatives du localStorage (sakata-*)
              try {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith("sakata-") || k.startsWith("sb-"))
                  .forEach((k) => localStorage.removeItem(k));
                sessionStorage.clear();
              } catch {}
              // 2. Vider le cache Service Worker / Next.js (Cache API)
              if ("caches" in window) {
                caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
              }
              // 3. Navigation dure : vide le Router Cache Next.js + tous les états React
              window.location.href = "/";
            }}
            className="font-display font-bold tracking-tighter cursor-pointer"
            style={{ fontSize: "1.4rem", color: "var(--or-ancestral)" }}
          >
            KISAKATA
          </a>

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
                <span className="relative inline-flex items-center">
                  {t(link.key)}
                  {link.href === ROUTES.CHAT && totalUnread > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2.5 -top-1 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {!authLoading && (
              user ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href={ROUTES.PROFIL}
                    className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-semibold transition-all border border-or/20 hover:border-or/50"
                    style={{
                      background: "rgba(181, 149, 81, 0.05)",
                      color: "var(--or-ancestral)",
                    }}
                  >
                    <div className="relative">
                      <UserCircle className="w-5 h-5 opacity-80" />
                      {!connectionError && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-or-ancestral border-2 border-foret-nocturne animate-pulse" />}
                    </div>
                    <span className="max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email?.split("@")[0]}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="p-2 rounded-full border border-white/5 hover:bg-white/10 transition-all opacity-40 hover:opacity-100"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4 text-ivoire-ancien" />
                  </button>
                </div>
              ) : (
                <Link
                  href={ROUTES.AUTH}
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
                    onClick={() => {
                      setMenuOpen(false);
                    }}
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
                    <span className="relative">
                      {t(link.key)}
                      {link.href === ROUTES.CHAT && totalUnread > 0 && (
                        <span className="absolute -right-4 top-0 w-3 h-3 bg-amber-500 rounded-full border-2 border-foret-nocturne" />
                      )}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Profile & Sign Out */}
              {user ? (
                <>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + navLinks.length * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={ROUTES.PROFIL}
                      onClick={() => {
                        setMenuOpen(false);
                      }}
                      className="text-3xl font-bold tracking-tight transition-colors"
                      style={{ color: "var(--or-ancestral)" }}
                    >
                      {t("nav.profile") || "Mon Profil"}
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + (navLinks.length + 1) * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="text-3xl font-bold tracking-tight transition-colors opacity-60"
                      style={{ color: "var(--ivory-warm)" }}
                    >
                      {t("nav.logout") || "Déconnexion"}
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <Link
                    href={ROUTES.AUTH}
                    onClick={() => {
                      setMenuOpen(false);
                    }}
                    className="inline-flex items-center px-8 py-4 rounded-full text-sm font-semibold"
                    style={{
                      background: "var(--emerald-deep)",
                      color: "var(--ivory-warm)",
                    }}
                  >
                    {t("nav.join")}
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
