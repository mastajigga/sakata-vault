import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-geographie-3d",
  title: "Géographie 3D — Globe Mapbox v3",
  subtitle:
    "Carte interactive ultra-premium avec globe 3D, terrain, atmosphère dynamique et 16 calques GeoJSON du territoire Sakata.",
  category: "feature",
  order: 5,
  readTime: 7,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["mapbox", "3d", "performance", "geojson"],
  summary:
    "Migration MapLibre→Mapbox v3, gestion des 16 calques GeoJSON, fix du crash setFog, et patterns d'optimisation pour mobile 3G.",
};

export const Content = () => (
  <>
    <DocLead>
      La carte de Sakata.com n'est pas une simple carte : c'est une scénographie. Globe
      3D rotatif, terrain en relief, atmosphère qui se teinte du jaune doré au bleu
      profond selon l'heure du regard, calques narratifs qui s'éclairent au survol.
      Cette ambition coûte cher à orchestrer — voici pourquoi et comment.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Accessible via <DocInline>/geographie</DocInline>, la page intègre Mapbox GL
        JS v3 dans un layout Command Center : carte plein écran centrale, HUD latéral
        de contrôle des calques, infographies contextuelles.
      </DocP>
      <DocP>
        Les 16 calques GeoJSON couvrent tout le territoire Mai-Ndombe : rivières,
        provinces, chefferies, villages, dialectes, masques rituels, sites historiques.
        Chaque calque est un fichier JSON statique servi depuis <DocInline>/public/data/geo/</DocInline>.
      </DocP>
    </DocSection>

    <DocSection title="Pourquoi Mapbox et pas MapLibre ?" eyebrow="Décision">
      <DocCallout type="decision" title="Migration effectuée">
        Passage de MapLibre GL (open-source) à <strong>Mapbox GL JS v3</strong>{" "}
        propriétaire. Choix conscient et assumé.
      </DocCallout>

      <DocTable
        headers={["Critère", "MapLibre", "Mapbox v3", "Verdict"]}
        rows={[
          ["Coût", "Gratuit", "50k chargements/mois gratuits, puis $0.5/1k", "MapLibre gagne sur le papier"],
          ["Globe 3D", "❌ Non supporté", "✅ Natif", "Mapbox indispensable"],
          ["Terrain elevation", "Partiel (DEM)", "Excellent", "Mapbox"],
          ["Atmosphere & fog", "❌", "✅ setFog()", "Mapbox"],
          ["Vector tiles styles", "Limité", "Très riche", "Mapbox"],
          ["Verdict final", "—", "—", "Mapbox v3 — l'esthétique justifie le coût"],
        ]}
      />

      <DocCallout type="info" title="Coût réel attendu">
        50 000 chargements gratuits/mois. À 5 000 visiteurs uniques mensuels avec 1
        chargement chacun, on est à 10% du quota. Le coût ne devient sensible qu'à
        100 000+ MAU — un problème qu'on aimerait avoir.
      </DocCallout>
    </DocSection>

    <DocSection title="Architecture technique" eyebrow="Implémentation">
      <DocSubsection title="Structure du composant MapContainer">
        <DocCode lang="typescript">{`useEffect(() => {
  const map = new mapboxgl.Map({
    container: mapRef.current,
    style: "mapbox://styles/mastajigga/...",  // Style custom
    projection: "globe",                       // Pas "mercator"
    zoom: 3,
    center: [18.5, -2.5],                      // Mai-Ndombe
    pitch: 45,                                  // Inclinaison 3D
    bearing: 0,
  });

  // ⚠️ Attendre l'event "load" avant tout setFog/addLayer
  map.on("load", () => {
    map.setFog({
      range: [0.8, 8],
      color: "rgba(193, 107, 52, 0.15)",  // Or ancestral
      "horizon-blend": 0.05,
      "high-color": "#0a1f15",            // Forêt nocturne
      "space-color": "#000000",
      "star-intensity": 0.8,
    });

    loadAllLayers(map);
  });
}, []);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Chargement progressif des 16 calques">
        <DocP>
          Sans précaution, les 16 fichiers GeoJSON font ~1.5 MB en cumul → bloque le
          rendu de la carte sur 3G. Stratégie actuelle :
        </DocP>
        <DocList
          ordered
          items={[
            <>Au montage : 2 calques essentiels (rivières, provinces) chargés en priorité.</>,
            <>À l'event <DocInline>idle</DocInline> de la carte : les calques détaillés (chefferies, villages).</>,
            <>Sur interaction utilisateur (toggle HUD) : les calques narratifs (masques, dialectes).</>,
          ]}
        />
        <DocCallout type="warning" title="Évolution prévue">
          Voir <DocInline>roadmap-12-months.tsx</DocInline> — passer à un chargement
          par zoom level pour réduire encore l'initial bundle.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Cinématique d'arrivée (flythrough)">
        <DocP>
          Au premier chargement, la caméra effectue un <strong>flythrough</strong> :
          elle arrive depuis l'espace, se rapproche en spirale du Mai-Ndombe, puis se
          stabilise sur la zone Sakata. Implémenté via <DocInline>map.flyTo()</DocInline>{" "}
          chaîné avec des durées calculées.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Crash setFog avec variables CSS (v2.6)">
        <DocP>
          Symptôme : <DocInline>map.setFog()</DocInline> crashait avec « Style is not
          done loading » sur déploiement Netlify, alors que tout fonctionnait en dev.
        </DocP>
        <DocP>
          Cause : on passait des couleurs en variables CSS (<DocInline>var(--or-ancestral)</DocInline>),
          que Mapbox tentait de parser à un moment où le DOM n'était pas prêt. Solution :
          hardcoder les valeurs hex dans le JS (pas joli, mais Mapbox n'accepte pas les
          var CSS).
        </DocP>
      </DocSubsection>

      <DocSubsection title="Bouton « Masquer HUD » bloqué (v2.7.1)">
        <DocP>
          Le HUD avait <DocInline>z-index: 50</DocInline>, la Navbar{" "}
          <DocInline>z-index: 60</DocInline>. Au scroll, la Navbar passait par-dessus
          le bouton « Masquer HUD » et bloquait les clics. Fix : isolement du contrôle
          HUD à <DocInline>z-index: 70</DocInline>.
        </DocP>
        <DocCallout type="warning" title="Leçon">
          Toujours documenter les z-index dans une constante centralisée :{" "}
          <DocInline>Z_INDEX = {`{ MAP: 0, HUD: 70, NAV: 60, MODAL: 100 }`}</DocInline>.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Performance mobile catastrophique avant optimisation">
        <DocP>
          Premier déploiement : <strong>LCP 8.2s sur 3G simulé</strong>. Mesures prises :
        </DocP>
        <DocList
          items={[
            <>Lazy loading du composant Geographie via <DocInline>dynamic(() =&gt; ..., {`{ ssr: false }`})</DocInline>.</>,
            <>Suppression des calques non visibles à zoom {`<`} 5.</>,
            <>Tile cache via service worker (à venir, voir roadmap PWA).</>,
            <>Compression des GeoJSON avec <DocInline>simplify-geojson</DocInline> (50% de gain de taille pour 1% de perte de précision).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de mode offline (les tiles Mapbox ne sont pas dans le bucket Storage).</>,
          <>Performance dégradée en dessous de iPhone 11 / Galaxy A30.</>,
          <>Le mode WebGL2 est requis — fallback bas de gamme non géré.</>,
        ]}
      />
    </DocSection>
  </>
);
