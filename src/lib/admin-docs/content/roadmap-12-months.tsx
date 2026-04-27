import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead, DocQuote } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-12-months",
  title: "Roadmap Sakata.com — Horizon 12 mois",
  subtitle:
    "Vision stratégique d'avril 2026 à avril 2027 : transformer Sakata d'encyclopédie premium en arche numérique vivante du patrimoine bantu.",
  category: "roadmap",
  order: 1,
  readTime: 12,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["strategy", "product", "vision", "monetization"],
  summary:
    "Plan trimestriel détaillé avec feature signature (Veillée Numérique), métriques, modèle économique et risques.",
};

export const Content = () => (
  <>
    <DocLead>
      Cette roadmap est l'expression d'une conviction : Sakata.com peut devenir une
      référence mondiale en préservation numérique du patrimoine bantu, à condition
      d'opérer trois bascules — mobile-first, contenu audio-vidéo, effets de réseau.
    </DocLead>

    <DocSection title="La vision centrale" eyebrow="Cap stratégique">
      <DocQuote attribution="Proverbe Sakata">
        Moto oyo ayebi te kotombola miso na likolo, akoki te koyeba esika oyo mbula
        eutaka. — « Celui qui ne sait pas lever les yeux ne connaîtra jamais d'où vient
        la pluie. »
      </DocQuote>
      <DocP>
        En 12 mois, Sakata.com doit cesser d'être perçu comme une encyclopédie payante
        de plus pour devenir <strong>l'archive vivante</strong> de la culture Sakata —
        accessible aux diasporas, exploitable par la recherche, jouable par les
        enfants, écoutable par les anciens.
      </DocP>
      <DocCallout type="decision" title="Trois leviers">
        <DocList
          items={[
            <><strong>Découvrabilité</strong> : SEO + PWA mobile pour exister dans les recherches Google et fonctionner offline.</>,
            <><strong>Contenu signature</strong> : la <strong>Veillée Numérique</strong> (oral history studio) pour créer un corpus irreproductible.</>,
            <><strong>Communauté</strong> : marketplace, généalogie, événements pour des effets de réseau qui portent le projet.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Q2 2026 — Consolidation des Racines" eyebrow="Mai → Juillet">
      <DocP>
        <strong>But trimestriel :</strong> rendre le site trouvable, mobile-first, et
        facile à enrichir.
      </DocP>
      <DocTable
        headers={["Initiative", "Pourquoi", "Effort", "Métrique de succès"]}
        rows={[
          [
            "PWA mobile (offline + push)",
            "70% du trafic africain est mobile, souvent en 3G",
            "M (3 sem.)",
            "Lighthouse PWA score > 90",
          ],
          [
            "SEO complet (sitemap, schema.org, OG)",
            "Sakata invisible sur 'histoire Sakata RDC'",
            "S (1 sem.)",
            "Top 10 Google sur 5 requêtes cibles",
          ],
          [
            "Bulk-import ethnographique",
            "50 articles → 500 en 3 semaines",
            "M (2 sem.)",
            "300+ articles publiés",
          ],
          [
            "Recherche sémantique exposée",
            "Différenciation majeure vs Wikipédia",
            "S (1 sem.)",
            "% requêtes avec résultat pertinent > 70%",
          ],
          [
            "Performance LCP < 2s 3G",
            "Bounce rate africain explose au-dessus de 4s",
            "M (2 sem.)",
            "LCP P75 < 2000ms en simulé 3G",
          ],
        ]}
      />
    </DocSection>

    <DocSection title="Q3 2026 — La Veillée Numérique" eyebrow="Août → Octobre">
      <DocCallout type="decision" title="Feature signature">
        Studio d'enregistrement et de traitement IA d'histoires orales. C'est ce qui
        peut faire de Sakata une référence mondiale en patrimoine bantu.
      </DocCallout>

      <DocSubsection title="Flux utilisateur cible">
        <DocCode caption="Schéma narratif">{`1. Diaspora enregistre un aîné (audio/vidéo, navigateur direct)
2. Transcription auto en kisakata (Whisper fine-tuné ou Gemini)
3. Traduction auto fr / en / lin / swa / tsh
4. Tagging IA (thèmes, lieux, époques)
5. Cross-référencement avec articles existants → suggestions auto
6. Archive consultable, visualisable sur la carte 3D Géographie`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Pourquoi c'est gigantesque">
        <DocList
          items={[
            <>Aucun concurrent sérieux n'existe pour les langues bantu.</>,
            <>Justifie un Premium à 9-15€/mois (vs. les 5€ actuels).</>,
            <>Crée un corpus irreproductible → moat permanent.</>,
            <>Peut intéresser Inalco, KU Leuven, MRAC Tervuren (Musée Royal de l'Afrique Centrale).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Initiatives parallèles Q3">
        <DocList
          items={[
            <>Articles → Audio TTS (chaque article devient un podcast en 6 langues).</>,
            <>École : passage texte → vidéo (curriculum maths déjà solide, manque le format jeune).</>,
            <>Audio Rooms forum (Discord Stage-style pour conversations culturelles live).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Q4 2026 — Effets de Réseau" eyebrow="Novembre → Janvier 2027">
      <DocP>
        <strong>But trimestriel :</strong> la communauté commence à porter le projet,
        pas l'inverse.
      </DocP>
      <DocList
        ordered
        items={[
          <><strong>Système de réputation contributeur</strong> — badges <em>Griot</em>, <em>Doyen</em>, <em>Gardien</em>, levels visibles, classement mensuel.</>,
          <><strong>Arbre généalogique</strong> — feature culturellement explosive chez les Sakata. Visualisation D3, RLS strict, partage privé/public au choix.</>,
          <><strong>Calendrier culturel</strong> — fêtes traditionnelles, anniversaires de chefs, événements diaspora (Bruxelles, Paris, Montréal).</>,
          <><strong>Marketplace artisanat</strong> — masques, tissus, livres ; commission de 10%, paiement Stripe déjà en place.</>,
          <><strong>Email digest</strong> — résumé hebdomadaire personnalisé.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Q1 2027 — Au-delà des Sakata" eyebrow="Février → Avril 2027">
      <DocP>
        <strong>Pivot stratégique :</strong> Sakata devient le <strong>proof-of-concept</strong>{" "}
        d'une plateforme multi-ethnique.
      </DocP>
      <DocList
        items={[
          <><strong>Mode multi-tribu</strong> : Lega, Ngongo, Tetela, Mongo héritent de la même architecture.</>,
          <><strong>API publique</strong> pour chercheurs (tier payant à 50€/mois).</>,
          <><strong>Partenariats académiques</strong> (Inalco, ULB, université Kinshasa).</>,
          <><strong>Documentaire</strong> : le contenu accumulé devient une mini-série (YouTube, Arte ?).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Cross-cutting — toujours actif" eyebrow="Hygiène permanente">
      <DocTable
        headers={["Domaine", "Action concrète"]}
        rows={[
          ["Observabilité", "Sentry pour erreurs, PostHog pour funnel"],
          ["Tests", "7 fichiers actuels → coverage 60% sur paths critiques"],
          ["A11y", "Mode dyslexie, lecteur d'écran sur Mboka, contrastes WCAG AA"],
          ["Low-bandwidth", "Mode dégradé : images base64 < 50ko, JS < 100ko"],
          ["i18n", "Curriculum école traduit dans les 6 langues"],
        ]}
      />
    </DocSection>

    <DocSection title="Modèle économique cible" eyebrow="Viabilité">
      <DocTable
        headers={["Source", "Aujourd'hui", "Cible Q1 2027", "Hypothèse"]}
        rows={[
          ["Premium individuels", "?", "4 500€/mois", "500 abonnés × 9€"],
          ["Marketplace (commission 10%)", "0", "800€/mois", "8 000€ GMV/mois"],
          ["API académique", "0", "500€/mois", "10 partenaires × 50€"],
          ["Subventions / partenariats", "0", "15 000€/an", "1 partenariat MRAC ou Inalco"],
        ]}
      />
      <DocCallout type="success" title="ARR potentiel">
        Total ARR potentiel : <strong>~80 k€/an</strong> — assez pour financer 1
        développeur + 1 historien à temps partiel, et atteindre l'autonomie.
      </DocCallout>
    </DocSection>

    <DocSection title="Risques majeurs & mitigation" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Whisper ne marche pas bien sur le kisakata", "Moyenne", "Haut", "Plan B : Gemini + corrections humaines crowdsourcées"],
          ["Coût IA explose avec le volume", "Moyenne", "Moyen", "Cache agressif, tier free limité, batch processing"],
          ["Pas assez de contributeurs", "Haute", "Très haut", "Bulk-import + rémunération des Griots Doyens"],
          ["Stripe restrictions Afrique", "Faible", "Haut", "Backup : Paystack ou Flutterwave"],
          ["Burnout solo", "Élevée", "Critique", "Embaucher freelance dès 1 000€/mois MRR"],
        ]}
      />
    </DocSection>

    <DocSection title="Recommandation par où commencer" eyebrow="Priorité">
      <DocCallout type="decision" title="Si une seule chose en mai 2026">
        <DocP>
          La <strong>PWA + SEO</strong>. Ça débloque tout le reste — pas la peine de
          bâtir la Veillée si personne ne te trouve sur Google et que les utilisateurs
          mobiles galèrent.
        </DocP>
      </DocCallout>
      <DocCallout type="info" title="Si tu veux le wow factor immédiat">
        <DocP>
          Prototype la <strong>Veillée Numérique</strong> sur 2 semaines avec Whisper +
          Gemini, même très brut. Une seule histoire bien racontée d'un aîné Sakata sur
          la home page change tout.
        </DocP>
      </DocCallout>
    </DocSection>
  </>
);
