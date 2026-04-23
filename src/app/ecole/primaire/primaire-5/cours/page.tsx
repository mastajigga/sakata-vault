import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { primaryPrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursePage from "@/app/ecole/secondaire/1ere-secondaire/cours/CoursePage";

export const metadata: Metadata = {
  title: "Primaire 5 — Cours complet | Sakata École",
  description:
    "Décimaux, fractions numériques et surfaces — parcours animé pour enfants de 9-10 ans ancré dans la culture Basakata.",
};

export default function Page() {
  const program = primaryPrograms.find((p) => p.slug === "primaire-5");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursePage program={program} />
      <Footer />
    </main>
  );
}
