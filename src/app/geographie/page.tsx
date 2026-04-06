import type { Metadata } from "next";
import GeographieClient from "./GeographieClient";

export const metadata: Metadata = {
  title: "Géographie | Kisakata.com — Voyage au cœur du territoire Basakata",
  description:
    "Explorez en 3D le territoire traditionnel des Basakata : Kutu, le Lac Mai-Ndombe, les rivières, les forêts et les sous-tribus. Carte interactive immersive.",
  openGraph: {
    title: "Géographie — Territoire Basakata en 3D",
    description:
      "Carte 3D interactive du territoire de Kutu (Mai-Ndombe, RDC). Rivières, forêts, sous-tribus et contributions communautaires.",
    type: "website",
  },
};

export default function GeographiePage() {
  return <GeographieClient />;
}
