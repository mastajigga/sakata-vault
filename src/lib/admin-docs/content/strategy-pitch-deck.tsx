import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead, DocQuote } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "strategy-pitch-deck",
  title: "Pitch Deck Sakata",
  subtitle:
    "Document narratif structuré pour présenter Sakata.com à des partenaires institutionnels, fonds culturels, universités et investisseurs.",
  category: "strategy",
  order: 1,
  readTime: 9,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["pitch", "strategy", "partnerships", "fundraising"],
  summary:
    "Le récit de Sakata en une douzaine de slides : problème, solution, marché, traction, modèle, équipe, demande.",
};

export const Content = () => (
  <>
    <DocLead>
      Ce document n'est pas le pitch deck final — c'est sa structure source.
      Reprenez chaque section pour générer slides Keynote/Figma, brochure PDF
      partenaires ou page web institutionnelle. La cohérence narrative compte plus
      que le formatage.
    </DocLead>

    <DocSection title="Slide 1 — Le problème" eyebrow="Pourquoi Sakata existe">
      <DocQuote attribution="Amadou Hampâté Bâ">
        En Afrique, quand un vieillard meurt, c'est une bibliothèque qui brûle.
      </DocQuote>
      <DocList
        items={[
          <>La culture Sakata (~250k personnes en RDC, ~50k en diaspora) est principalement orale.</>,
          <>30% de la mémoire culturelle se perd à chaque génération.</>,
          <>La diaspora veut transmettre à ses enfants mais n'a pas d'outil.</>,
          <>Les institutions classiques (musées, universités) ne couvrent qu'une fraction et restent inaccessibles.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Slide 2 — La solution" eyebrow="Sakata.com">
      <DocP>
        Une plateforme numérique vivante du patrimoine Sakata, qui combine :
      </DocP>
      <DocList
        items={[
          <><strong>Encyclopédie multilingue</strong> (6 langues dont kisakata, lingala, swahili).</>,
          <><strong>Forum communautaire</strong> temps réel pour les diasporas.</>,
          <><strong>École en ligne</strong> avec curriculum mathématique et culturel.</>,
          <><strong>Carte 3D interactive</strong> du territoire Mai-Ndombe.</>,
          <><strong>Veillée Numérique</strong> — studio d'enregistrement IA d'histoires orales (signature feature).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Slide 3 — Le marché" eyebrow="Taille addressable">
      <DocTable
        headers={["Audience", "Volume", "Stratégie d'acquisition"]}
        rows={[
          ["Diaspora Sakata (Bruxelles, Paris, Montréal)", "~50 000 individus", "Bouche-à-oreille communautaire"],
          ["Sakata en RDC connectés", "~30 000", "Partenariats radios locales, écoles"],
          ["Chercheurs académiques bantu", "~500 institutions", "API publique, conférences"],
          ["Curieux culture africaine", "~5M en Europe + Amérique", "SEO, presse, YouTube"],
          ["Total adressable initial", "~6 millions", "—"],
        ]}
      />
      <DocCallout type="info" title="Au-delà">
        Le mode multi-tribu (Q1 2027) ouvre l'addressable à <strong>70 millions</strong>{" "}
        de Bantous parlant 200+ langues apparentées.
      </DocCallout>
    </DocSection>

    <DocSection title="Slide 4 — Pourquoi maintenant" eyebrow="Timing">
      <DocList
        items={[
          <><strong>IA bantu enfin viable</strong> — Gemini est correct sur kisakata, Whisper transcrit l'audio à coût acceptable. Il y a 3 ans, c'était impossible.</>,
          <><strong>Smartphones pénétration {`>`} 70%</strong> en zone urbaine RDC. La diaspora est ultra-équipée.</>,
          <><strong>Réveil identitaire post-2020</strong> — les diasporas africaines réinvestissent activement leur héritage.</>,
          <><strong>Subventions culturelles</strong> ouvertes (Belgique, France, UE) avec budgets consacrés au patrimoine immatériel.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Slide 5 — Traction (à date)" eyebrow="Preuves">
      <DocList
        items={[
          <>Plateforme déployée en production, 4 mois d'opération.</>,
          <>30+ articles publiés, 6 langues, contenu original validé par des Sakata natifs.</>,
          <>Architecture v3.1 stable (chat temps réel, paywall premium, 3D map).</>,
          <>Stripe Premium activé, premiers abonnés payants.</>,
          <>Documentation technique exhaustive (26+ documents).</>,
          <>Pipeline IA opérationnel (Gemini, Claude, Pinecone).</>,
        ]}
      />
      <DocCallout type="warning" title="Honnêteté">
        À adapter selon le moment réel du pitch — chiffres précis au lieu d'estimations.
      </DocCallout>
    </DocSection>

    <DocSection title="Slide 6 — Modèle économique" eyebrow="Comment on gagne">
      <DocTable
        headers={["Source", "Cible 12 mois", "Cible 24 mois"]}
        rows={[
          ["Premium individuels (9€/mois)", "500 abonnés = 4 500€/mois", "2 000 = 18 000€/mois"],
          ["Marketplace artisanat (10% commission)", "800€/mois", "3 000€/mois"],
          ["API académique (B2B)", "500€/mois", "2 250€/mois"],
          ["Subventions / partenariats culturels", "15k€/an", "50k€/an"],
          ["ARR estimé", "≈ 80k€", "≈ 320k€"],
        ]}
      />
    </DocSection>

    <DocSection title="Slide 7 — Avantage compétitif" eyebrow="Moat">
      <DocList
        items={[
          <><strong>Corpus irreproductible</strong> — Veillée Numérique = enregistrements de Doyens uniques.</>,
          <><strong>Culture-first, tech-second</strong> — On a sage-basakata interne, pas un porte-parole marketing.</>,
          <><strong>Multilingue bantu natif</strong> — Là où Wikipedia / Google échouent.</>,
          <><strong>Effet de réseau communautaire</strong> — Plus de Sakata sur la plateforme = plus de raisons d'y aller.</>,
          <><strong>Stack technique mature</strong> — Pas un MVP fragile, infrastructure prête à scaler.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Slide 8 — Roadmap" eyebrow="Vision 12 mois">
      <DocList
        items={[
          <><strong>Q2 2026</strong> — PWA mobile, SEO complet, bulk import (300 articles).</>,
          <><strong>Q3 2026</strong> — Veillée Numérique (signature), Audio Rooms, École vidéo.</>,
          <><strong>Q4 2026</strong> — Marketplace, Généalogie, Réputation, Calendrier.</>,
          <><strong>Q1 2027</strong> — Mode multi-tribu (Lega pilote), API publique.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Slide 9 — Équipe" eyebrow="Qui">
      <DocP>
        <strong>Fortuné Mwa Mbenza</strong> — Fondateur, développeur full-stack,
        Sakata natif. Background tech (Next.js, Supabase, IA). Né à Kinshasa, basé en
        Belgique. Connaît la culture de l'intérieur.
      </DocP>
      <DocCallout type="warning" title="Plan team">
        À enrichir : conseil culturel (Doyens), partenaires académiques, futurs
        recrutements (Q4 2026 : 1 dev backend + 1 historien).
      </DocCallout>
    </DocSection>

    <DocSection title="Slide 10 — Investissement / partenariat demandé" eyebrow="Demande">
      <DocSubsection title="Pour un pitch fonds culturel (subvention)">
        <DocList
          items={[
            <><strong>Montant :</strong> 30-50k€ sur 12 mois.</>,
            <><strong>Affectation :</strong> 60% rémunération équipe (Fortuné + 1 historien temps partiel), 25% IA & infra, 15% marketing diaspora.</>,
            <><strong>Livrables :</strong> Veillée Numérique opérationnelle + 50 veillées enregistrées + bulk-import 300 articles.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Pour un partenariat académique">
        <DocList
          items={[
            <><strong>Pas d'argent demandé.</strong> Accès à corpus, co-publications, étudiants en stage.</>,
            <><strong>Apport pour le partenaire :</strong> données structurées (API), citation académique, terrain de recherche.</>,
            <><strong>Apport pour Sakata :</strong> légitimité, contenu validé scientifiquement, étudiants contributeurs.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Slide 11 — Contact" eyebrow="Suite">
      <DocP>
        <strong>Fortuné Mwa Mbenza</strong> — masta.jigga@gmail.com<br />
        Plateforme : <DocInline>https://sakata.com</DocInline> (ou{" "}
        <DocInline>sakata.netlify.app</DocInline>)<br />
        Documentation : <DocInline>/admin/help/documentation</DocInline> (accès sur demande)
      </DocP>
    </DocSection>

    <DocSection title="Annexe — Slides additionnels au cas par cas" eyebrow="Selon audience">
      <DocList
        items={[
          <><strong>Slide tech</strong> — Architecture (Next.js, Supabase, Mapbox, IA stack) si interlocuteur technique.</>,
          <><strong>Slide impact culturel</strong> — Cas concrets de transmission diaspora si interlocuteur fonds culturels.</>,
          <><strong>Slide concurrence</strong> — Comparatif Wikipedia, Geni, Mukuru… si interlocuteur business.</>,
          <><strong>Slide P&L</strong> — Détaillé jusqu'au break-even si interlocuteur investisseur.</>,
        ]}
      />
    </DocSection>
  </>
);
