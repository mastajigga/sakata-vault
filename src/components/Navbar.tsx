"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { SavoirMenu } from "./navbar/SavoirMenu";
import { CommunityMenu } from "./navbar/CommunityMenu";
import { UserMenu } from "./navbar/UserMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { useGlobalUnreadCount } from "@/hooks/chat/useGlobalUnreadCount";
import { RefreshCw, X } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";

const navLinks = [
  { key: "nav.home", href: ROUTES.HOME },
  { key: "nav.premium", href: ROUTES.PREMIUM },
];

const Navbar = () => {
  const { t } = useLanguage();
  const { user, isLoading: authLoading, connectionError, sessionExpired, signOut, subscriptionTier, role, contributorStatus } = useAuth() as any;
  const totalUnread = useGlobalUnreadCount();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dismissedExpiry, setDismissedExpiry] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

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
              } catch (err) {
                console.error("[Navbar] Cache clearing failed:", {
                  error: err instanceof Error ? err.message : String(err),
                  timestamp: new Date().toISOString(),
                });
              }
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
            SAKATA
          </a>

          {/* Desktop nav links — restructured with dropdowns */}
          <div className="hidden md:flex items-center gap-8">
            {/* Home link */}
            <Link
              href={ROUTES.HOME}
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
              {t("nav.home")}
            </Link>

            {/* Savoir dropdown */}
            <SavoirMenu
              open={openMenu === "savoir"}
              onOpen={() => setOpenMenu("savoir")}
              onClose={() => setOpenMenu(null)}
            />

            {/* Community dropdown */}
            <CommunityMenu
              open={openMenu === "community"}
              onOpen={() => setOpenMenu("community")}
              onClose={() => setOpenMenu(null)}
            />

            {/* Premium link */}
            <Link
              href={ROUTES.PREMIUM}
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
              {t("nav.premium")}
            </Link>
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {!authLoading && (
              user ? (
                <div className="hidden md:block">
                  <UserMenu
                    userName={user.user_metadata?.full_name || user.email?.split("@")[0]}
                    subscriptionTier={subscriptionTier}
                    role={role}
                    isApprovedContributor={contributorStatus === "approved"}
                    onSignOut={() => signOut()}
                    open={openMenu === "user"}
                    onOpen={() => setOpenMenu("user")}
                    onClose={() => setOpenMenu(null)}
                  />
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto"
            style={{
              background: "rgba(10, 31, 21, 0.98)", // Foret Nocturne almost opaque
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
          >
            <nav className="flex flex-col items-center gap-8 py-12">
              {/* Home */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={ROUTES.HOME}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-bold tracking-tight transition-colors"
                  style={{ color: "var(--ivory-warm)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--amber-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--ivory-warm)";
                  }}
                >
                  {t("nav.home")}
                </Link>
              </motion.div>

              {/* Savoir submenu items */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.18,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center gap-4 text-sm text-slate-400"
              >
                <p className="uppercase tracking-widest text-[10px] opacity-30 font-mono mb-2">Savoir & Découverte</p>
                <Link
                  href={ROUTES.SAVOIR}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  Articles & Chroniques
                </Link>
                <Link
                  href={ROUTES.ECOLE}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  Espace École
                </Link>
                <Link
                  href={ROUTES.GEOGRAPHIE}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2"
                  style={{ color: "var(--or-ancestral)" }}
                >
                  Carte Interactive
                </Link>
              </motion.div>

              {/* Communauté submenu items */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.26,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex flex-col items-center gap-4 text-sm text-slate-400"
              >
                <p className="uppercase tracking-widest text-[10px] opacity-30 font-mono mb-2">Vie Sociale</p>
                <Link
                  href={ROUTES.FORUM}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  Le Forum
                </Link>
                <Link
                  href={ROUTES.CHAT}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2 relative"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  Messagerie
                  {totalUnread > 0 && (
                    <span className="absolute -right-4 top-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-[var(--foret-nocturne)]" />
                  )}
                </Link>
                <Link
                  href={ROUTES.MEMBRES}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-bold transition-all hover:translate-x-2"
                  style={{ color: "var(--ivoire-ancien)" }}
                >
                  Cercle Basakata
                </Link>
              </motion.div>

              {/* Premium */}
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.34,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={ROUTES.PREMIUM}
                  onClick={() => setMenuOpen(false)}
                  className="text-3xl font-bold tracking-tight transition-colors"
                  style={{ color: "var(--ivory-warm)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--amber-light)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--ivory-warm)";
                  }}
                >
                  {t("nav.premium")}
                </Link>
              </motion.div>

              {/* Mobile Profile & Sign Out */}
              {user ? (
                <>
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.42,
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
                      delay: 0.5,
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
                  transition={{ duration: 0.5, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
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
