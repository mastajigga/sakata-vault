"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MousePointer2, Layers, Search, Sun, Users, MapPin, Info } from "lucide-react";

export default function AidePage() {
  return (
    <main className="min-h-[100dvh] bg-[var(--foret-nocturne)] text-[var(--ivoire-ancien)]">
      {/* Header */}
      <header className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/geographie"
            className="flex items-center gap-2 text-sm transition-colors hover:text-[var(--or-ancestral)]"
            style={{ color: "var(--brume-matinale)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la carte
          </Link>
          <h1
            className="text-lg font-bold tracking-[0.15em] uppercase"
            style={{ color: "var(--or-ancestral)" }}
          >
            Guide d'utilisation
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Introduction */}
        <section>
          <p
            className="text-lg leading-relaxed italic"
            style={{ color: "var(--brume-matinale)" }}
          >
            Bienvenue sur la carte interactive du territoire Sakata. Ce guide vous aidera à naviguer et explorer notre patrimoine géographique et culturel.
          </p>
        </section>

        {/* Navigation */}
        <section>
          <h2
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2"
            style={{ color: "var(--or-ancestral)" }}
          >
            <MousePointer2 className="w-4 h-4" />
            Navigation sur la carte
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2">Zoom</h3>
              <p className="text-xs opacity-70">Molette de la souris ou boutons +/− en haut à gauche</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2">Rotation</h3>
              <p className="text-xs opacity-70">Clic droit + glisser, ou touche Ctrl + glisser</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2">Inclinaison 3D</h3>
              <p className="text-xs opacity-70">Clic droit + glisser vers le haut/bas</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2">Déplacement</h3>
              <p className="text-xs opacity-70">Clic gauche + glisser</p>
            </div>
          </div>
        </section>

        {/* Couches */}
        <section>
          <h2
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2"
            style={{ color: "var(--or-ancestral)" }}
          >
            <Layers className="w-4 h-4" />
            Couches disponibles
          </h2>
          <div className="space-y-3">
            {[
              { name: "Rivières & Lac", skt: "Mbela & Iyâ", desc: "Réseau hydrographique — rivières, lac Mai-Ndombe" },
              { name: "Sous-tribus", skt: "Bikolo", desc: "Territoires des sous-tribus Basakata" },
              { name: "Villages & Ports", skt: "Mboka & Libongo", desc: "Localités et ports historiques" },
              { name: "Chefferies", skt: "Idju", desc: "7 chefferies du territoire Sakata" },
              { name: "Dialectes", skt: "Ndinga", desc: "Zones dialectales du kisakata" },
              { name: "Communauté", skt: "Bato", desc: "Contributions des membres" },
            ].map((layer) => (
              <div
                key={layer.name}
                className="p-4 rounded-xl flex items-start gap-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--or-ancestral)" }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{layer.name}</span>
                    <span className="text-[10px] opacity-50 italic">{layer.skt}</span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">{layer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Fonctionnalités */}
        <section>
          <h2
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6 flex items-center gap-2"
            style={{ color: "var(--or-ancestral)" }}
          >
            <Search className="w-4 h-4" />
            Fonctionnalités
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Search className="w-3 h-3" />
                Recherche
              </h3>
              <p className="text-xs opacity-70">Tapez le nom d'un village ou lieu pour le trouver instantanément sur la carte.</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sun className="w-3 h-3" />
                Luminosité
              </h3>
              <p className="text-xs opacity-70">Ajustez la luminosité de la carte avec le slider ou les presets (Nuit, Aube, Jour, Zénith).</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Layers className="w-3 h-3" />
                Command Center
              </h3>
              <p className="text-xs opacity-70">Une interface immersive avec onglets latéraux pour une gestion centralisée des données.</p>
            </div>
            <div
              className="p-4 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Projection 3D
              </h3>
              <p className="text-xs opacity-70">
                Lancez une séquence de survol (Flythrough) stabilisée. Le moteur de rendu a été optimisé pour une fluidité maximale sur tous les navigateurs modernes.
              </p>
            </div>
          </div>
        </section>

        {/* Saison */}
        <section>
          <h2
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--or-ancestral)" }}
          >
            Saisons
          </h2>
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-sm leading-relaxed opacity-80">
              Le slider en bas de la carte permet de visualiser l'impact des saisons sur le territoire. 
              En saison des pluies, les rivières grossissent et le lac Mai-Ndombe s'étend. 
              En saison sèche, le niveau des eaux baisse, révélant les zones de pêche traditionnelles.
            </p>
          </div>
        </section>

        {/* Données */}
        <section>
          <h2
            className="text-sm font-bold tracking-[0.2em] uppercase mb-6"
            style={{ color: "var(--or-ancestral)" }}
          >
            À propos des données
          </h2>
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <p className="text-sm leading-relaxed opacity-80">
              Les données géographiques sont basées sur les recherches ethnographiques de Roger Vanzila Munsi (2016), 
              Nkiere (1984) et d'autres sources académiques. Le territoire Sakata couvre environ 18 000 km² 
              dans la province Mai-Ndombe, RDC, avec une population estimée à 300 000 habitants répartis en 7 chefferies.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/5 text-center">
          <p className="text-xs opacity-40 italic">
            « La terre ne ment pas. Elle garde la mémoire de ceux qui l'ont foulée. »
          </p>
        </footer>
      </div>
    </main>
  );
}