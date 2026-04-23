import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import CoursPage from "./CoursePage";

export const metadata: Metadata = {
  title: "1ère Secondaire — Cours complet | Sakata École",
  description:
    "Algèbre, équations du 1er degré et théorie des ensembles — parcours animé style Brilliant.org ancré dans la culture Basakata.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "1ere-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <CoursPage program={program} />
      <Footer />
    </main>
  );
}
