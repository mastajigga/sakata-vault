import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursPage from "../../1ere-secondaire/cours/CoursPage";

export const metadata: Metadata = {
  title: "3e Secondaire — Cours complet | Kisakata École",
  description:
    "Équations du 2nd degré, théorème de Pythagore et statistiques — parcours animé style Brilliant.org ancré dans la culture Basakata.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "3e-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursPage program={program} />
      <Footer />
    </main>
  );
}
