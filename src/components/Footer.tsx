"use client";

import React from "react";
import { useLanguage } from "@/components/LanguageProvider";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer
      className="section-container"
      style={{
        paddingTop: "4rem",
        paddingBottom: "4rem",
        borderTop: "1px solid var(--bordure-brume)",
        background: "var(--foret-nocturne)",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="font-display font-bold text-xl" style={{ color: "var(--or-ancestral)" }}>
            KISAKATA
          </span>
          <p className="font-body text-xs opacity-40" style={{ color: "var(--ivoire-ancien)" }}>
            {t("footer.rights")}
          </p>
        </div>
        <div className="flex gap-8">
          {[
            { label: "CULTURE", href: "/savoir" },
            { label: "LANGUE", href: "/#langue" },
            { label: "HISTOIRE", href: "/#histoire" },
            { label: "FORUM", href: "/forum" }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-mono text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity hover:text-or"
              style={{ color: "var(--ivoire-ancien)" }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
