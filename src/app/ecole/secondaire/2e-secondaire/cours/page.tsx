import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursePage from "../../1ere-secondaire/cours/CoursePage";

export const metadata: Metadata = {
  title: "2e Secondaire — Cours complet | Sakata École",
  description:
    "Fonctions linéaires, systèmes d'équations et géométrie plane — parcours animé style Brilliant.org ancré dans la culture Basakata.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "2e-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursePage program={program} />
      <Footer />
    </main>
  );
}
