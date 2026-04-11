import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import ExercicesPage from "./ExercicesPage";

export const metadata = {
  title: "Exercices — 1ère Secondaire | Kisakata École",
  description: "Exercices interactifs d'algèbre, équations du 1er degré et ensembles pour la 1ère secondaire.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "1ere-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <Suspense>
        <ExercicesPage program={program} />
      </Suspense>
      <Footer />
    </main>
  );
}
