import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-contribution-system",
  title: "Système de Contribution",
  subtitle:
    "Formulaire de demande de contribution avec 7 profils types, workflow d'approbation admin, et espace contributeur dédié.",
  category: "feature",
  order: 6,
  readTime: 6,
  updatedAt: "2026-05-06",
  author: "Équipe Sakata",
  tags: ["contribution", "workflow", "admin", "community"],
  summary:
    "Architecture du système de contribution : formulaire enrichi à 7 types, table contribution_requests, validation admin, et espace contributeur.",
};

export const Content = () => (
  <>
    <DocLead>
      Le système de contribution permet à tout utilisateur authentifié de demander
      un statut de contributeur. Sept profils types sont proposés pour couvrir tous
      les talents : des habitants locaux aux anthropologues, en passant par les
      photographes et les historiens.
    </DocLead>

    <DocSection title="Parcours utilisateur" eyebrow="Flow">
      <DocList
        ordered
        items={[
          <>L'utilisateur accède à <DocInline>/contributeur</DocInline> via le menu Communauté → Contribuer.</>,
          <>Il remplit le <strong>formulaire de contribution</strong> : sélection du type de profil + message de motivation.</>,
          <>La requête est stockée dans <DocInline>contribution_requests</DocInline> avec statut <DocInline>pending</DocInline>.</>,
          <>Un admin examine la requête depuis <DocInline>/admin/contribution-requests</DocInline>.</>,
          <>Approbation → l'utilisateur reçoit le rôle <DocInline>contributeur</DocInline> et accède à son espace.</>,
          <>Rejet → la requête est archivée, l'utilisateur peut soumettre à nouveau.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Les 7 types de contributeurs" eyebrow="Profils">
      <DocTable
        headers={["Valeur", "Libellé", "Description"]}
        rows={[
          ["habitant_region", "🏠 Habitant de la région", "Témoignage direct, connaissance du terrain, traditions orales"],
          ["scolaire", "📚 Scolaire / Étudiant", "Recherches, mémoires, travaux académiques"],
          ["historien", "📜 Historien", "Archives, chronologies, analyse documentaire"],
          ["anthropologue", "🔬 Anthropologue", "Études de terrain, ethnographie, rites et coutumes"],
          ["photo", "📸 Photo / Vidéo", "Documentation visuelle, reportages, archives audiovisuelles"],
          ["patrimoine", "🏛️ Patrimoine", "Conservation, muséographie, artisanat traditionnel"],
          ["autre", "✨ Autre", "Profil personnalisé avec champ libre"],
        ]}
      />
      <DocCallout type="info" title="Champ personnalisé">
        Si le type <DocInline>autre</DocInline> est sélectionné, un champ{' '}
        <DocInline>contributorTypeOther</DocInline> est requis pour préciser le profil.
      </DocCallout>
    </DocSection>

    <DocSection title="Schéma de données" eyebrow="Tables">
      <DocSubsection title="contribution_requests">
        <DocTable
          headers={["Colonne", "Type", "Description"]}
          rows={[
            ["id", "uuid (PK)", "Identifiant unique"],
            ["user_id", "uuid (FK → profiles)", "Utilisateur demandeur"],
            ["contributor_type", "text", "Type de contributeur (enum 7 valeurs)"],
            ["contributor_type_other", "text?", "Précision si type = 'autre'"],
            ["message", "text?", "Message de motivation"],
            ["status", "text", "pending | approved | rejected"],
            ["created_at", "timestamptz", "Date de soumission"],
            ["updated_at", "timestamptz", "Dernière modification"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="API">
        <DocList
          items={[
            <><strong>POST</strong> <DocInline>/api/contribution-request</DocInline> — Soumettre une demande (auth requise).</>,
            <><strong>GET</strong> (admin) — Liste toutes les requêtes, filtrable par statut.</>,
            <><strong>PATCH</strong> (admin) — Approuver (<DocInline>{"status: 'approved'"}</DocInline>) ou rejeter (<DocInline>{"status: 'rejected'"}</DocInline>).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Validation Zod" eyebrow="Schéma">
      <DocP>Le formulaire utilise une validation Zod côté client et serveur :</DocP>
      <DocCode lang="typescript">{`const schema = z.object({
  contributorType: z.enum([
    "habitant_region", "scolaire", "historien",
    "anthropologue", "photo", "patrimoine", "autre"
  ]),
  contributorTypeOther: z.string().optional(),
  message: z.string().min(1).max(1000),
});`}</DocCode>
    </DocSection>

    <DocSection title="Espace contributeur" eyebrow="Interface">
      <DocP>
        Une fois approuvé, le contributeur accède à <DocInline>/contributeur</DocInline> qui affiche :
      </DocP>
      <DocList
        items={[
          <>Statistiques de ses articles (total, publiés, brouillons, vues, likes).</>,
          <>Liste de ses articles avec statut (draft, review, published).</>,
          <>Bouton pour créer un nouvel article.</>,
          <><DocInline>ContributionForm</DocInline> (si pas encore approuvé) ou <DocInline>ContributionUploads</DocInline> (upload médias).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Workflow admin" eyebrow="Modération">
      <DocP>
        Depuis <DocInline>/admin/contribution-requests</DocInline>, l'admin peut :
      </DocP>
      <DocList
        items={[
          <>Voir la liste des requêtes avec leur statut (pending / approved / rejected).</>,
          <>Lire le profil du demandeur (nickname, username) et son message.</>,
          <>Approuver ou rejeter en un clic.</>,
          <>Les requêtes approuvées mettent à jour le <DocInline>contributor_status</DocInline> du profil.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Fichiers clés" eyebrow="Code">
      <DocTable
        headers={["Fichier", "Rôle"]}
        rows={[
          [<DocInline>src/components/ContributionForm.tsx</DocInline>, "Formulaire client avec 7 types + validation"],
          [<DocInline>src/app/contributeur/page.tsx</DocInline>, "Page espace contributeur (stats + articles)"],
          [<DocInline>src/app/admin/contribution-requests/page.tsx</DocInline>, "Interface admin de gestion des requêtes"],
          [<DocInline>src/app/api/contribution-request/route.ts</DocInline>, "API de soumission / traitement"],
        ]}
      />
    </DocSection>
  </>
);
