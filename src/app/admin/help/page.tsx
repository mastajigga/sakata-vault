"use client";

import Link from "next/link";
import { BookOpen, FileText, ArrowUpRight } from "lucide-react";

export default function AdminHelpPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10">
      <div className="mb-10">
        <p className="text-[10px] uppercase tracking-[0.3em] text-or-ancestral font-bold mb-3">
          Command Center · Aide
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-ivoire-ancien mb-3">
          Centre d'Aide Admin
        </h1>
        <p className="text-lg text-ivoire-ancien/60 max-w-2xl leading-relaxed">
          Notes personnelles, documentation technique de chaque fonctionnalité, plans
          d'évolution — tout ce qu'un admin Sakata doit avoir sous la main.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Notes Section ── */}
        <Link
          href="/admin/help/notes"
          className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20">
              <FileText className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-ivoire-ancien group-hover:text-amber-400 transition-colors mb-2">
                Notes Personnelles
              </h2>
              <p className="text-sm text-ivoire-ancien/60 leading-relaxed">
                Créez et gérez vos notes personnelles pour vos rappels, idées et
                références rapides. Chaque admin a son propre espace.
              </p>
            </div>
            <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-ivoire-ancien/30 group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>

        {/* ── Documentation Section (NOW ACTIVE) ── */}
        <Link
          href="/admin/help/documentation"
          className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-or-ancestral/40 hover:bg-white/[0.06] transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-or-ancestral/10 border border-or-ancestral/20">
              <BookOpen className="w-6 h-6 text-or-ancestral" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold text-ivoire-ancien group-hover:text-or-ancestral transition-colors mb-2">
                Documentation
                <span className="ml-2 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 align-middle">
                  Nouveau
                </span>
              </h2>
              <p className="text-sm text-ivoire-ancien/60 leading-relaxed">
                Documentation technique des fonctionnalités, choix d'architecture, et
                plans d'implémentation des prochaines features. Téléchargeable en PDF.
              </p>
            </div>
            <ArrowUpRight className="absolute top-6 right-6 w-4 h-4 text-ivoire-ancien/30 group-hover:text-or-ancestral transition-colors" />
          </div>
        </Link>
      </div>

      {/* Hint footer */}
      <div className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        <p className="text-[12px] text-ivoire-ancien/50 leading-relaxed">
          💡 La documentation s'enrichit progressivement. Pour ajouter un nouveau
          document, créez un fichier dans{" "}
          <code className="text-or-ancestral/80 font-mono text-[11px]">
            src/lib/admin-docs/content/
          </code>{" "}
          et déclarez-le dans{" "}
          <code className="text-or-ancestral/80 font-mono text-[11px]">registry.ts</code>.
        </p>
      </div>
    </div>
  );
}
