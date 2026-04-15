"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { ROUTES } from "@/lib/constants/routes";
import { BookOpen, Code2, RefreshCw, FileText, Shield } from "lucide-react";

interface HelpLayoutProps {
  children: ReactNode;
}

const helpLinks = [
  {
    href: ROUTES.HELP_PHILOSOPHY,
    icon: BookOpen,
    label: "Philosophy",
    labelFr: "Philosophie",
  },
  {
    href: ROUTES.HELP_STACK,
    icon: Code2,
    label: "Technology Stack",
    labelFr: "Stack Technologique",
  },
  {
    href: ROUTES.HELP_CHANGELOG,
    icon: RefreshCw,
    label: "Changelog",
    labelFr: "Mises à jour",
  },
  {
    href: ROUTES.HELP_GUIDELINES,
    icon: FileText,
    label: "Guidelines",
    labelFr: "Directives",
  },
  {
    href: ROUTES.HELP_GDPR,
    icon: Shield,
    label: "GDPR & Privacy",
    labelFr: "GDPR & Confidentialité",
  },
];

export default function HelpLayout({ children }: HelpLayoutProps) {
  const pathname = usePathname();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="sticky top-32">
              <h2
                className="text-lg font-bold mb-6"
                style={{ color: "var(--or-ancestral)" }}
              >
                {language === "fr" ? "Aide & Documentation" : "Help & Documentation"}
              </h2>
              <nav className="space-y-2">
                {helpLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  const label = language === "fr" ? link.labelFr : link.label;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-white/10 border-l-2 border-[#C16B34]"
                          : "hover:bg-white/5"
                      }`}
                      style={{
                        color: isActive ? "var(--or-ancestral)" : "var(--brume-matinale)",
                      }}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            <div className="prose prose-invert max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
