"use client";

import { ReactNode, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Calendar, Clock, Tag, Printer } from "lucide-react";
import type { DocMeta } from "./types";

interface DocLayoutProps {
  meta: DocMeta;
  children: ReactNode;
}

export const DocLayout = ({ meta, children }: DocLayoutProps) => {
  const handleDownload = useCallback(() => {
    // Native browser print → "Save as PDF" produces a true vector PDF
    window.print();
  }, []);

  return (
    <>
      {/* Print stylesheet — hides chrome, sets A4 margins, force light text on dark */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 18mm 16mm 22mm 16mm;
          }
          html, body {
            background: #ffffff !important;
            color: #1a1a1a !important;
          }
          /* Hide navigation chrome and admin sidebar */
          nav, header.app-nav, aside, .doc-no-print,
          [data-print-hidden="true"] {
            display: none !important;
          }
          /* Strip global background overlays / grain */
          .grain-overlay::before, .grain-overlay::after { display: none !important; }
          /* Make backgrounds plain for print */
          .doc-print-root, .doc-print-root * {
            background: transparent !important;
            box-shadow: none !important;
          }
          .doc-print-root {
            color: #1a1a1a !important;
            max-width: 100% !important;
            padding: 0 !important;
          }
          .doc-print-root h1, .doc-print-root h2, .doc-print-root h3 {
            color: #1a1a1a !important;
            page-break-after: avoid;
          }
          .doc-print-root h2 {
            border-bottom: 1px solid #aaa !important;
          }
          .doc-print-root p, .doc-print-root li, .doc-print-root td, .doc-print-root dd {
            color: #2a2a2a !important;
          }
          .doc-print-root .text-or-ancestral,
          .doc-print-root .text-or-ancestral * {
            color: #8a6420 !important;
          }
          .doc-print-root .text-ivoire-ancien,
          .doc-print-root .text-ivoire-ancien\\/80,
          .doc-print-root .text-ivoire-ancien\\/85,
          .doc-print-root .text-ivoire-ancien\\/90 {
            color: #1a1a1a !important;
          }
          .doc-print-root pre,
          .doc-print-root code {
            background: #f3f1ec !important;
            color: #1a1a1a !important;
            border: 1px solid #d6d2c5 !important;
          }
          .doc-print-root .doc-callout {
            background: #faf8f3 !important;
            border-left: 3px solid #8a6420 !important;
            border-top: 1px solid #ddd !important;
            border-right: 1px solid #ddd !important;
            border-bottom: 1px solid #ddd !important;
          }
          .doc-print-root table {
            border-collapse: collapse !important;
          }
          .doc-print-root th {
            background: #f3f1ec !important;
            color: #8a6420 !important;
          }
          .doc-print-root th, .doc-print-root td {
            border: 1px solid #ccc !important;
          }
          .doc-print-root .break-inside-avoid {
            page-break-inside: avoid;
          }
          .doc-print-root .doc-section h2 {
            page-break-before: auto;
          }
          .doc-print-root .doc-print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #888;
          }
        }

        /* Watermark / header for printed pages (only shown in print) */
        .doc-print-meta { display: none; }
        @media print {
          .doc-print-meta { display: block !important; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto p-6 lg:p-10 doc-print-root">
        {/* ── Top bar (hidden in print) ── */}
        <div className="doc-no-print flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link
            href="/admin/help/documentation"
            className="inline-flex items-center gap-2 text-sm text-ivoire-ancien/60 hover:text-or-ancestral transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la documentation
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/30 text-or-ancestral hover:bg-or-ancestral/20 transition-all text-sm font-bold"
              title="Imprimer ou enregistrer en PDF"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>
            <button
              onClick={handleDownload}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-ivoire-ancien/60 hover:text-ivoire-ancien transition-all text-sm"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>

        {/* ── Print header (only shown in PDF) ── */}
        <div className="doc-print-meta mb-6" style={{ display: "none" }}>
          <p style={{ fontSize: "10px", color: "#888", textTransform: "uppercase", letterSpacing: "2px" }}>
            Sakata.com — Documentation Technique
          </p>
        </div>

        {/* ── Document header ── */}
        <header className="mb-10 pb-8 border-b border-white/10 break-inside-avoid">
          <p className="text-[10px] uppercase tracking-[0.3em] text-or-ancestral font-bold mb-3">
            {meta.category === "feature"
              ? "Fonctionnalité"
              : meta.category === "roadmap"
              ? "Roadmap & Vision"
              : "Architecture"}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-ivoire-ancien leading-tight mb-4">
            {meta.title}
          </h1>
          <p className="text-lg text-ivoire-ancien/65 leading-relaxed">
            {meta.subtitle}
          </p>

          {/* Metadata strip */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 text-[12px] text-ivoire-ancien/50">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Mis à jour le {new Date(meta.updatedAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              ~{meta.readTime} min de lecture
            </span>
            {meta.author && (
              <span className="inline-flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {meta.author}
              </span>
            )}
          </div>

          {/* Tags */}
          {meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-ivoire-ancien/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* ── Document body ── */}
        <article className="prose prose-invert max-w-none">{children}</article>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-[12px] text-ivoire-ancien/40 break-inside-avoid">
          <p>
            <span className="text-or-ancestral font-bold">Sakata.com</span> — Documentation
            interne · {meta.slug} · v{new Date(meta.updatedAt).getFullYear()}.
            {new Date(meta.updatedAt).getMonth() + 1}
          </p>
          <p className="mt-1 italic">
            « Moto oyo ayebi te kotombola miso na likolo, akoki te koyeba esika oyo mbula
            eutaka. » — Proverbe Sakata
          </p>
        </footer>
      </div>
    </>
  );
};
