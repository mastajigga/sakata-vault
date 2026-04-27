import React, { ReactNode } from "react";

// ─────────────────────────────────────────────
// Reusable doc primitives — print-friendly Brume style
// ─────────────────────────────────────────────

export const DocLead = ({ children }: { children: ReactNode }) => (
  <p className="doc-lead text-lg leading-relaxed text-ivoire-ancien/80 italic border-l-2 border-or-ancestral/40 pl-5 my-8">
    {children}
  </p>
);

export const DocSection = ({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) => (
  <section className="doc-section my-10 break-inside-avoid">
    {eyebrow && (
      <p className="text-[10px] uppercase tracking-[0.3em] text-or-ancestral font-bold mb-2">
        {eyebrow}
      </p>
    )}
    <h2 className="font-display text-2xl font-bold text-ivoire-ancien border-b border-white/10 pb-3 mb-6">
      {title}
    </h2>
    <div className="space-y-4 text-ivoire-ancien/80 leading-relaxed">
      {children}
    </div>
  </section>
);

export const DocSubsection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="my-6 break-inside-avoid">
    <h3 className="font-display text-lg font-semibold text-or-ancestral mb-3">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

export const DocP = ({ children }: { children: ReactNode }) => (
  <p className="text-[15px] leading-[1.75]">{children}</p>
);

export const DocCallout = ({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warning" | "success" | "error" | "decision";
  title?: string;
  children: ReactNode;
}) => {
  const palette = {
    info: { bg: "bg-blue-500/5", border: "border-blue-500/30", text: "text-blue-300", label: "Info" },
    warning: { bg: "bg-amber-500/5", border: "border-amber-500/30", text: "text-amber-300", label: "Attention" },
    success: { bg: "bg-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-300", label: "Succès" },
    error: { bg: "bg-red-500/5", border: "border-red-500/30", text: "text-red-300", label: "Risque" },
    decision: { bg: "bg-or-ancestral/5", border: "border-or-ancestral/40", text: "text-or-ancestral", label: "Décision" },
  }[type];

  return (
    <div className={`doc-callout my-5 rounded-xl border-l-4 ${palette.bg} ${palette.border} p-5 break-inside-avoid`}>
      <p className={`text-[10px] uppercase tracking-[0.2em] font-bold mb-2 ${palette.text}`}>
        {title || palette.label}
      </p>
      <div className="text-[14px] leading-relaxed text-ivoire-ancien/85 space-y-2">
        {children}
      </div>
    </div>
  );
};

export const DocCode = ({
  children,
  lang,
  caption,
}: {
  children: string;
  lang?: string;
  caption?: string;
}) => (
  <div className="doc-code my-5 break-inside-avoid">
    {(lang || caption) && (
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-ivoire-ancien/40 mb-2">
        <span>{caption || "Code"}</span>
        {lang && <span className="text-or-ancestral">{lang}</span>}
      </div>
    )}
    <pre className="bg-black/40 border border-white/10 rounded-xl p-5 overflow-x-auto text-[12.5px] leading-[1.7] font-mono text-ivoire-ancien/90 whitespace-pre-wrap">
      <code>{children}</code>
    </pre>
  </div>
);

export const DocInline = ({ children }: { children: ReactNode }) => (
  <code className="bg-white/5 px-1.5 py-0.5 rounded text-[13px] font-mono text-or-ancestral">
    {children}
  </code>
);

export const DocList = ({
  items,
  ordered = false,
}: {
  items: ReactNode[];
  ordered?: boolean;
}) => {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`my-4 space-y-2 pl-6 ${
        ordered ? "list-decimal" : "list-disc"
      } marker:text-or-ancestral/60 text-[15px] leading-[1.75]`}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
};

export const DocTable = ({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: ReactNode[][];
  caption?: string;
}) => (
  <div className="doc-table my-6 break-inside-avoid">
    {caption && (
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-ivoire-ancien/40 mb-2">
        {caption}
      </p>
    )}
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-[13.5px]">
        <thead className="bg-white/5">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-4 py-3 font-bold text-or-ancestral text-[11px] uppercase tracking-wider border-b border-white/10"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-3 text-ivoire-ancien/80 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DocKeyValue = ({
  pairs,
}: {
  pairs: { label: string; value: ReactNode }[];
}) => (
  <dl className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-3 break-inside-avoid">
    {pairs.map(({ label, value }, i) => (
      <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
        <dt className="text-[10px] uppercase tracking-[0.2em] font-bold text-or-ancestral mb-1">
          {label}
        </dt>
        <dd className="text-[14px] text-ivoire-ancien/85 leading-relaxed">{value}</dd>
      </div>
    ))}
  </dl>
);

export const DocQuote = ({ children, attribution }: { children: ReactNode; attribution?: string }) => (
  <blockquote className="my-6 pl-5 border-l-2 border-or-ancestral/40 italic text-ivoire-ancien/75 break-inside-avoid">
    <p className="text-[15.5px] leading-[1.7]">{children}</p>
    {attribution && (
      <footer className="mt-2 text-[12px] text-ivoire-ancien/50 not-italic">
        — {attribution}
      </footer>
    )}
  </blockquote>
);
