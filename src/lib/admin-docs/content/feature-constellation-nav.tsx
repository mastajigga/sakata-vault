import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-constellation-nav",
  title: "Navigation mobile — Constellation",
  subtitle:
    "FAB doré qui s'épanouit en arc, deux batches alternés et actions contextuelles selon la page.",
  category: "feature",
  order: 13,
  readTime: 5,
  updatedAt: "2026-05-09",
  author: "Direction Sakata",
  tags: ["mobile", "navigation", "ux", "fab"],
  summary:
    "Comment la nouvelle navigation mobile fonctionne, comment elle s'adapte aux rôles et aux routes.",
};

export const Content = () => (
  <>
    <DocLead>
      Sur mobile, le menu burger fullscreen a été remplacé par un FAB doré
      bottom-right qui s'épanouit en constellation au tap. Objectif : écran
      dégagé, gestes premium, deux batches alternés pour limiter l'encombrement.
    </DocLead>

    <DocSection title="Architecture" eyebrow="Composants">
      <DocList items={[
        <><DocInline>ConstellationLayout.ts</DocInline> — séquences d'angles tunées à la main pour 3-6 satellites + rayon adaptatif.</>,
        <><DocInline>useConstellationActions.ts</DocInline> — calcule les batches Essentiel / Découverte + l'action contextuelle selon route et rôle.</>,
        <><DocInline>useScrollDirection.ts</DocInline> — masque le FAB au scroll-down, le révèle au scroll-up (sauf si ouvert).</>,
        <><DocInline>FabButton.tsx</DocInline> — bouton orbe pulsant, icône morphée selon route, X quand ouvert.</>,
        <><DocInline>Satellite.tsx</DocInline> — orbe + label pill (gauche) + badge ; supporte les destinations (Link) ET les bascules (button).</>,
        <><DocInline>ConstellationNav.tsx</DocInline> — orchestrateur (state, portal, scroll lock, escape).</>,
      ]} />
    </DocSection>

    <DocSection title="Batches" eyebrow="Contenu">
      <DocSubsection title="Essentiel (par défaut)">
        <DocList items={[
          "Accueil",
          "Savoir",
          "Communauté (badge messagerie non-lues)",
          "Notifications (badge) ou Se connecter si anonyme",
          "→ Découverte (bouton-bascule or)",
        ]} />
      </DocSubsection>
      <DocSubsection title="Découverte">
        <DocList items={[
          "École",
          "Géographie",
          "Membres",
          "Messagerie ou Modération (si rôle staff)",
          "← Essentiel (bouton-retour or)",
        ]} />
      </DocSubsection>
      <DocCallout type="info" title="Action contextuelle">
        <DocP>
          Au sommet de l'arc, un satellite or plus grand peut apparaître selon la route :
          "Nouveau sujet" sur <DocInline>/forum/[cat]</DocInline>, "Répondre" sur un thread,
          "Ajouter un membre" sur <DocInline>/genealogie</DocInline>, "Devenir contributeur"
          ou "Écrire un article" sur <DocInline>/savoir</DocInline>.
        </DocP>
      </DocCallout>
    </DocSection>

    <DocSection title="Comportements" eyebrow="UX">
      <DocList items={[
        "Tap FAB → ouvre l'arc avec stagger 0.04s × index, easing premium.",
        "Tap satellite-destination → navigue + ferme.",
        "Tap satellite-bascule → swap des satellites avec re-animation d'entrée.",
        "Tap backdrop / Escape / changement de route → ferme.",
        "Body scroll verrouillé pendant l'ouverture.",
        "Reset auto au batch Essentiel à la fermeture (350ms).",
      ]} />
    </DocSection>

    <DocSection title="Détails techniques" eyebrow="Z-index & portail">
      <DocCode lang="ts">{`// FAB stays in component tree (focus / accessibility)
<FabButton z-60 />

// Backdrop + satellites portaled to <body>
createPortal(
  <div className="fixed inset-0 z-58" /* backdrop */>
    <div /* satellites layer anchored bottom-right */>
      {items.map((item, i) =>
        <Satellite key={\`\${batch}-\${item.id}\`} ... />
      )}
    </div>
  </div>,
  document.body
);`}</DocCode>
      <DocCallout type="warning" title="Portail obligatoire">
        <DocP>
          Plusieurs ancêtres dans la nav utilisent <DocInline>transform</DocInline> via Framer
          Motion, ce qui crée un containing block et piège les enfants <DocInline>position: fixed</DocInline>.
          Le portail garantit que le backdrop couvre toute la viewport.
        </DocP>
      </DocCallout>
    </DocSection>

    <DocCallout type="decision" title="Évolutions possibles">
      <DocList items={[
        "Onboarding micro-tooltip au premier login.",
        "Long-press sur un satellite pour menu d'actions secondaires.",
        "Personnalisation : laisser l'utilisateur réordonner les satellites du batch Essentiel.",
        "Haptic feedback iOS au tap.",
      ]} />
    </DocCallout>
  </>
);
