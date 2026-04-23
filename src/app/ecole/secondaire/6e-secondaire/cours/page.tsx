import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursPage from "@/app/ecole/secondaire/1ere-secondaire/cours/CoursePage";

export const metadata: Metadata = {
  title: "6e Secondaire — Cours complet | Sakata École",
  description:
    "Intégrales, matrices, nombres complexes et coniques — baccalauréat, parcours animé ancré dans la culture Basakata.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "6e-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursPage program={program} />
      <Footer />
    </main>
  );
}
