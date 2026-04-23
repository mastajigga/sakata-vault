import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import ExercicesPage from "../../1ere-secondaire/exercices/ExercicesPage";

export const metadata = {
  title: "Exercices — 3e Secondaire | Sakata École",
  description: "Exercices interactifs d'équations du 2nd degré, Pythagore et statistiques pour la 3e secondaire.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "3e-secondaire");
  if (!program) notFound();

  return (
    <main className="grain-overlay min-h-[100dvh] bg-[var(--foret-nocturne)]">
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--or-ancestral)] border-t-transparent" />
        </div>
      }>
        <ExercicesPage program={program} />
      </Suspense>
      <Footer />
    </main>
  );
}
