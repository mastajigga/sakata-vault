"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, Wrench, Clock, Tag, Download } from "lucide-react";
import { ALL_DOCS, getDocsByCategory } from "@/lib/admin-docs/registry";
import type { DocEntry } from "@/lib/admin-docs/types";

const categoryConfig = {
  feature: {
    label: "Fonctionnalités Techniques",
    description: "Comment chaque feature est construite, pourquoi ces choix, et quelles difficultés ont été rencontrées.",
    Icon: Wrench,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  roadmap: {
    label: "Roadmap & Plans",
    description: "Vision stratégique et plans d'implémentation détaillés des prochaines fonctionnalités.",
    Icon: Compass,
    color: "text-or-ancestral",
    bg: "bg-or-ancestral/10",
    border: "border-or-ancestral/20",
  },
  architecture: {
    label: "Architecture & Patterns",
    description: "Décisions structurelles transversales — patterns, conventions, fondations.",
    Icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

const DocCard = ({ doc }: { doc: DocEntry }) => {
  const cfg = categoryConfig[doc.category];
  const Icon = cfg.Icon;
  return (
    <Link
      href={`/admin/help/documentation/${doc.slug}`}
      className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-or-ancestral/40 hover:bg-white/[0.06] transition-all"
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.border} border`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-bold text-ivoire-ancien group-hover:text-or-ancestral transition-colors leading-tight mb-1.5">
            {doc.title}
          </h3>
          <p className="text-[13px] text-ivoire-ancien/60 leading-relaxed mb-4">
            {doc.summary}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ivoire-ancien/40">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {doc.readTime} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {doc.tags.slice(0, 2).join(" · ")}
            </span>
          </div>
        </div>

        <Download className="absolute top-5 right-5 w-4 h-4 text-ivoire-ancien/30 group-hover:text-or-ancestral transition-colors" />
      </div>
    </Link>
  );
};

export default function DocumentationHub() {
  const features = getDocsByCategory("feature");
  const roadmap = getDocsByCategory("roadmap");
  const architecture = getDocsByCategory("architecture");

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10">
        <Link
          href="/admin/help"
          className="inline-flex items-center gap-2 text-sm text-ivoire-ancien/60 hover:text-or-ancestral transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au centre d'aide
        </Link>

        <p className="text-[10px] uppercase tracking-[0.3em] text-or-ancestral font-bold mb-3">
          Centre d'Aide · Documentation Technique
        </p>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-ivoire-ancien mb-3">
          Documentation Sakata
        </h1>
        <p className="text-lg text-ivoire-ancien/60 max-w-2xl leading-relaxed">
          Documentation technique complète des fonctionnalités, des choix d'architecture
          et de la roadmap. Chaque document est téléchargeable au format PDF.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-3 mt-6">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] text-ivoire-ancien/60">
            <span className="font-bold text-or-ancestral">{ALL_DOCS.length}</span>
            documents
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] text-ivoire-ancien/60">
            <span className="font-bold text-or-ancestral">
              {ALL_DOCS.reduce((sum, d) => sum + d.readTime, 0)}
            </span>
            min de lecture totale
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] text-ivoire-ancien/60">
            <Download className="w-3 h-3" />
            PDF natifs
          </span>
        </div>
      </div>

      {/* Roadmap section first — ce qui inspire passe en premier */}
      {roadmap.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <Compass className="w-5 h-5 text-or-ancestral" />
            <h2 className="font-display text-2xl font-bold text-ivoire-ancien">
              {categoryConfig.roadmap.label}
            </h2>
            <span className="text-sm text-ivoire-ancien/40">— {roadmap.length} doc{roadmap.length > 1 ? "s" : ""}</span>
          </div>
          <p className="text-sm text-ivoire-ancien/50 mb-6 max-w-2xl">
            {categoryConfig.roadmap.description}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {roadmap.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {features.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-ivoire-ancien">
              {categoryConfig.feature.label}
            </h2>
            <span className="text-sm text-ivoire-ancien/40">— {features.length} doc{features.length > 1 ? "s" : ""}</span>
          </div>
          <p className="text-sm text-ivoire-ancien/50 mb-6 max-w-2xl">
            {categoryConfig.feature.description}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {/* Architecture */}
      {architecture.length > 0 && (
        <section className="mb-12">
          <div className="flex items-baseline gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h2 className="font-display text-2xl font-bold text-ivoire-ancien">
              {categoryConfig.architecture.label}
            </h2>
            <span className="text-sm text-ivoire-ancien/40">— {architecture.length} doc{architecture.length > 1 ? "s" : ""}</span>
          </div>
          <p className="text-sm text-ivoire-ancien/50 mb-6 max-w-2xl">
            {categoryConfig.architecture.description}
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {architecture.map((doc) => (
              <DocCard key={doc.slug} doc={doc} />
            ))}
          </div>
        </section>
      )}

      {/* Help footer */}
      <div className="mt-16 p-6 rounded-2xl bg-or-ancestral/5 border border-or-ancestral/20">
        <h3 className="font-display text-lg font-bold text-or-ancestral mb-2">
          Pour télécharger un document en PDF
        </h3>
        <p className="text-sm text-ivoire-ancien/70 leading-relaxed">
          Ouvrez n'importe quel document, puis cliquez sur le bouton{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-or-ancestral/20 text-or-ancestral text-[12px] font-bold">
            <Download className="w-3 h-3" /> Télécharger PDF
          </span>{" "}
          en haut à droite. Votre navigateur ouvrira sa boîte de dialogue d'impression —
          choisissez « Enregistrer au format PDF » comme destination. Le PDF généré est
          vectoriel (texte sélectionnable, qualité parfaite).
        </p>
      </div>
    </div>
  );
}
