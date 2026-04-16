import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import ExercicesPage from "@/app/ecole/secondaire/1ere-secondaire/exercices/ExercicesPage";

export const metadata = {
  title: "Exercices — 4e Secondaire | Kisakata École",
  description: "Exercices interactifs de trigonométrie, logarithmes et vecteurs pour la 4e secondaire.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "4e-secondaire");
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
