import { Suspense } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { secondairePrograms } from "@/app/ecole/data/mathematics-curriculum";
import ExercicesPage from "@/app/ecole/secondaire/1ere-secondaire/exercices/ExercicesPage";

export const metadata = {
  title: "Exercices — 6e Secondaire | Kisakata École",
  description: "Exercices interactifs d'intégrales, matrices, probabilités et baccalauréat pour la 6e secondaire.",
};

export default function Page() {
  const program = secondairePrograms.find((p) => p.slug === "6e-secondaire");
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
