"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Calendar, Clock, Tag, Printer, FileDown } from "lucide-react";
import type { DocMeta } from "./types";

interface DocLayoutProps {
  meta: DocMeta;
  children: ReactNode;
}

export const DocLayout = ({ meta, children }: DocLayoutProps) => {
  const [hasStaticPdf, setHasStaticPdf] = useState(false);

  // Check if a pre-generated PDF exists in /public/docs/
  useEffect(() => {
    fetch(`/docs/${meta.slug}.pdf`, { method: "HEAD" })
      .then((res) => setHasStaticPdf(res.ok))
      .catch(() => setHasStaticPdf(false));
  }, [meta.slug]);

  const handlePrintToPdf = useCallback(() => {
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

          /* ─── 1. Reset html/body to flow naturally ─── */
          html, body {
            background: #ffffff !important;
            color: #1a1a1a !important;
            min-height: 0 !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* ─── 2. KILL EVERY fixed/sticky element (THE critical fix) ─── */
          /*    Without this, position:fixed elements appear on every page  */
          *, *::before, *::after {
            position: static !important;
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }

          /* ─── 3. Hide ALL non-doc chrome explicitly ─── */
          nav, header, aside, footer.app-footer,
          .doc-no-print, [data-print-hidden="true"],
          .grain-overlay, .grain-overlay::before, .grain-overlay::after {
            display: none !important;
            visibility: hidden !important;
          }

          /* ─── 4. The doc print container takes the whole flow ─── */
          .doc-print-wrapper {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            position: static !important;
          }

          .doc-print-root {
            color: #1a1a1a !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }

          .doc-print-root, .doc-print-root * {
            background-image: none !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* ─── 6. Typography for print readability ─── */
          .doc-print-root h1, .doc-print-root h2, .doc-print-root h3 {
            color: #1a1a1a !important;
            page-break-after: avoid;
            background: transparent !important;
          }
          .doc-print-root h2 {
            border-bottom: 1px solid #aaa !important;
          }
          .doc-print-root p, .doc-print-root li, .doc-print-root td, .doc-print-root dd {
            color: #2a2a2a !important;
            background: transparent !important;
          }
          .doc-print-root .text-or-ancestral,
          .doc-print-root .text-or-ancestral * {
            color: #8a6420 !important;
          }
          .doc-print-root .text-ivoire-ancien,
          .doc-print-root .text-ivoire-ancien\\/80,
          .doc-print-root .text-ivoire-ancien\\/85,
          .doc-print-root .text-ivoire-ancien\\/90,
          .doc-print-root .text-ivoire-ancien\\/65,
          .doc-print-root .text-ivoire-ancien\\/60,
          .doc-print-root .text-ivoire-ancien\\/50,
          .doc-print-root .text-ivoire-ancien\\/40 {
            color: #1a1a1a !important;
          }

          /* ─── 7. Code blocks ─── */
          .doc-print-root pre,
          .doc-print-root code {
            background: #f3f1ec !important;
            color: #1a1a1a !important;
            border: 1px solid #d6d2c5 !important;
            page-break-inside: avoid;
          }

          /* ─── 8. Callouts ─── */
          .doc-print-root .doc-callout {
            background: #faf8f3 !important;
            border-left: 3px solid #8a6420 !important;
            border-top: 1px solid #ddd !important;
            border-right: 1px solid #ddd !important;
            border-bottom: 1px solid #ddd !important;
            page-break-inside: avoid;
          }

          /* ─── 9. Tables ─── */
          .doc-print-root table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          .doc-print-root th {
            background: #f3f1ec !important;
            color: #8a6420 !important;
          }
          .doc-print-root th, .doc-print-root td {
            border: 1px solid #ccc !important;
            background: transparent !important;
          }

          /* ─── 10. Page break helpers ─── */
          .doc-print-root .break-inside-avoid,
          .doc-print-root .doc-callout,
          .doc-print-root .doc-table,
          .doc-print-root .doc-code {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="doc-print-wrapper max-w-4xl mx-auto p-6 lg:p-10 doc-print-root">
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
            {hasStaticPdf ? (
              <a
                href={`/docs/${meta.slug}.pdf`}
                download={`${meta.slug}.pdf`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/30 text-or-ancestral hover:bg-or-ancestral/20 transition-all text-sm font-bold"
                title="Télécharger le PDF pré-généré"
              >
                <FileDown className="w-4 h-4" />
                Télécharger PDF
              </a>
            ) : (
              <button
                onClick={handlePrintToPdf}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-or-ancestral/10 border border-or-ancestral/30 text-or-ancestral hover:bg-or-ancestral/20 transition-all text-sm font-bold"
                title="Imprimer ou enregistrer en PDF (via navigateur)"
              >
                <Download className="w-4 h-4" />
                Télécharger PDF
              </button>
            )}
            <button
              onClick={handlePrintToPdf}
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
            {{
              feature: "Fonctionnalité",
              roadmap: "Roadmap & Vision",
              architecture: "Architecture",
              strategy: "Stratégie & Business",
              operational: "Opérationnel & Gouvernance",
            }[meta.category]}
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
