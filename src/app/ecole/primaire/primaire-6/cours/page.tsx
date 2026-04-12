import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { primaryPrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursePage from "@/app/ecole/secondaire/1ere-secondaire/cours/CoursePage";

export const metadata: Metadata = {
  title: "Primaire 6 — Cours complet | Kisakata École",
  description:
    "Pourcentages, proportions et graphiques — parcours animé pour enfants de 10-11 ans ancré dans la culture Basakata.",
};

export default function Page() {
  const program = primaryPrograms.find((p) => p.slug === "primaire-6");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursePage program={program} />
      <Footer />
    </main>
  );
}
