"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] bg-[var(--foret-nocturne)] text-[var(--ivoire-ancien)] flex flex-col items-center justify-center gap-6 px-4">
      <span className="font-mono text-[var(--or-ancestral)] text-sm tracking-widest uppercase">
        Erreur 404
      </span>
      <h1 className="text-4xl font-light text-center">Page introuvable</h1>
      <p className="text-[var(--ivoire-ancien)]/50 text-center max-w-sm leading-relaxed">
        Cette page n&apos;existe pas ou a été déplacée dans les archives.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 text-[var(--or-ancestral)] hover:underline mt-4 transition-colors"
      >
        <ArrowLeft size={16} /> Retour à l&apos;accueil
      </Link>
    </main>
  );
}
