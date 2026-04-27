import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-constants-architecture",
  title: "Architecture des Constantes Centralisées",
  subtitle:
    "Pourquoi aucune valeur n'est jamais codée en dur, et comment les modules de constantes structurent toute l'application.",
  category: "architecture",
  order: 1,
  readTime: 6,
  updatedAt: "2026-04-26",
  author: "Équipe Sakata",
  tags: ["constants", "ddd", "type-safety", "i18n"],
  summary:
    "Modules de constantes (routes, db, storage, timings, business) avec rationale et règles de discipline.",
};

export const Content = () => (
  <>
    <DocLead>
      Une application de cette taille meurt par mille petites incohérences :
      « article-images » écrit avec un tiret ici, un underscore là ; un timeout de 5
      secondes recopié à 12 endroits. La centralisation des constantes est l'antidote
      systématique.
    </DocLead>

    <DocSection title="Pourquoi centraliser ?" eyebrow="Philosophie">
      <DocList
        items={[
          <><strong>Refactor sans risque</strong> — renommer une table demande de toucher 1 ligne, pas 30.</>,
          <><strong>Découverte facilitée</strong> — un nouveau dev voit toutes les routes en un seul fichier.</>,
          <><strong>Type-safety</strong> — TypeScript vérifie à la compilation que la clé existe.</>,
          <><strong>Documentation implicite</strong> — chaque constante est commentée à un seul endroit.</>,
          <><strong>Cohérence i18n</strong> — un seul fichier de timings garantit les mêmes durées partout.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Modules de constantes" eyebrow="Cartographie">
      <DocTable
        headers={["Module", "Fichier", "Contenu"]}
        rows={[
          [<DocInline>ROUTES</DocInline>, "constants/routes.ts", "Toutes les URLs (/admin, /savoir/[slug], etc.)"],
          [<DocInline>DB_TABLES</DocInline>, "constants/db.ts", "Noms des tables Supabase"],
          [<DocInline>DB_BUCKETS</DocInline>, "constants/db.ts", "Noms des buckets Storage"],
          [<DocInline>STORAGE_KEYS</DocInline>, "constants/storage.ts", "Clés localStorage (avec préfixe sakata-)"],
          [<DocInline>SESSION_KEYS</DocInline>, "constants/storage.ts", "Clés sessionStorage (rares)"],
          [<DocInline>TIMINGS</DocInline>, "constants/timings.ts", "Durées (debounce, animations, expirations)"],
          [<DocInline>USER_ROLES</DocInline>, "constants/business.ts", "admin, manager, contributor, user"],
          [<DocInline>SUBSCRIPTION_TIERS</DocInline>, "constants/business.ts", "free, premium"],
          [<DocInline>APP_VERSION</DocInline>, "constants/business.ts", "Version pour purge localStorage"],
        ]}
      />
    </DocSection>

    <DocSection title="Règles de discipline" eyebrow="Standards">
      <DocCallout type="warning" title="Ces règles sont OBLIGATOIRES">
        <DocList
          items={[
            <>Aucune chaîne de caractères représentant une route, table, bucket ou clé localStorage ne doit apparaître en dur dans un composant ou hook.</>,
            <>Toute nouvelle constante DOIT être ajoutée à son module centralisé.</>,
            <>Le préfixe <DocInline>sakata-</DocInline> est obligatoire pour toute clé localStorage (whitelist du AuthProvider).</>,
            <>Les helpers de tests de rôle (<DocInline>canManageContent</DocInline>, etc.) doivent être utilisés au lieu de comparer manuellement avec <DocInline>"admin"</DocInline>.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Imports recommandés" eyebrow="Patterns">
      <DocCode lang="typescript" caption="Imports types via barrel">{`// ✅ Recommandé
import { ROUTES } from "@/lib/constants/routes";
import { DB_TABLES, DB_BUCKETS } from "@/lib/constants/db";
import { STORAGE_KEYS, msgViewedKey } from "@/lib/constants/storage";
import { TIMINGS } from "@/lib/constants/timings";
import { USER_ROLES, canManageContent } from "@/lib/constants/business";

// ✅ Aussi acceptable (barrel)
import { ROUTES, DB_TABLES, TIMINGS } from "@/lib/constants";`}</DocCode>
    </DocSection>

    <DocSection title="Cas concrets : avant / après" eyebrow="Valeur ajoutée">
      <DocSubsection title="Renommage du bucket Storage (cas réel)">
        <DocP>
          Lors de la fonctionnalité « Vidéo Hero », il fallait ajouter un bucket{" "}
          <DocInline>article-videos</DocInline>. Sans constante, il aurait fallu chercher
          chaque occurrence du nom dans le code. Avec :
        </DocP>
        <DocCode lang="typescript">{`// 1. Une seule modification :
// constants/db.ts
export const DB_BUCKETS = {
  CHAT_ATTACHMENTS: "chat_attachments",
  AVATARS: "avatars",
  ARTICLE_VIDEOS: "article-videos",  // ← AJOUT
};

// 2. Usage type-safe partout :
.from(DB_BUCKETS.ARTICLE_VIDEOS)`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Bug évité : durée d'expiration de message éphémère">
        <DocP>
          La durée de countdown <DocInline>VIEW_ONCE_COUNTDOWN</DocInline> existait à 3
          endroits : <DocInline>ChatInput</DocInline>, <DocInline>MessageBubble</DocInline>,{" "}
          et <DocInline>ProtectedImage</DocInline>. Résultat : un changement à un endroit
          créait des incohérences (image disparaît à 5s mais countdown affiche 8s).
        </DocP>
        <DocCallout type="success" title="Solution">
          Centralisé dans <DocInline>TIMINGS.VIEW_ONCE_COUNTDOWN = 5000</DocInline>,
          importé depuis tous les composants concernés.
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Patterns avancés" eyebrow="Pour aller plus loin">
      <DocSubsection title="Helpers de calcul de clé">
        <DocP>
          Pour les clés dynamiques (incluant un ID), on définit des fonctions helpers :
        </DocP>
        <DocCode lang="typescript">{`// constants/storage.ts
export const msgViewedKey = (id: string) => \`sakata-msg-viewed-\${id}\`;
export const ecoleProgressKey = (ns: string) => \`sakata-ecole-progress-\${ns}\`;`}</DocCode>
      </DocSubsection>

      <DocSubsection title="`as const` pour des unions de littéraux">
        <DocP>
          Pour obtenir des types stricts (et l'autocomplétion), utiliser{" "}
          <DocInline>as const</DocInline> :
        </DocP>
        <DocCode lang="typescript">{`export const USER_ROLES = ["admin", "manager", "contributor", "user"] as const;
export type UserRole = typeof USER_ROLES[number];
// → "admin" | "manager" | "contributor" | "user"`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Les noms de colonnes Postgres ne sont PAS dans <DocInline>DB_TABLES</DocInline> — tradeoff entre verbosité et utilité.</>,
          <>Les valeurs CSS / couleurs sont gérées par Tailwind config, pas par ce système.</>,
          <>L'i18n des chaînes user-facing est dans <DocInline>LanguageProvider</DocInline>, pas dans les constantes.</>,
        ]}
      />
    </DocSection>
  </>
);
