import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-moderation-system-v34",
  title: "Système de modération v3.4",
  subtitle:
    "Modération forum réelle, rôle Modérateur, bannissements gradués, corbeille 6 mois et journaux consultables.",
  category: "feature",
  order: 12,
  readTime: 6,
  updatedAt: "2026-05-08",
  author: "Direction Sakata",
  tags: ["moderation", "roles", "logs", "ban", "soft-delete"],
  summary:
    "Tout ce qu'un admin/manager/modérateur doit savoir pour utiliser le nouveau système de modération du forum Mboka.",
};

export const Content = () => (
  <>
    <DocLead>
      Depuis la v3.4.0, la modération du forum n'est plus un mock — elle est branchée sur la base
      de données. Les actions sont consignées, les utilisateurs bannis voient une modale avec
      décompte, et la corbeille protège contre les suppressions accidentelles.
    </DocLead>

    <DocSection title="Le rôle Modérateur" eyebrow="Hiérarchie">
      <DocP>
        Un nouveau rôle <DocInline>moderator</DocInline> a été ajouté à l'enum <DocInline>user_role</DocInline>.
        Il se situe entre <DocInline>manager</DocInline> et <DocInline>contributor</DocInline> dans la hiérarchie.
      </DocP>
      <DocList items={[
        <><strong>Accès limité :</strong> uniquement <DocInline>/admin/forum</DocInline> et <DocInline>/admin/logs</DocInline>. Toute autre route admin redirige vers <DocInline>/admin/forum</DocInline>.</>,
        <><strong>Lien dans la nav :</strong> "Modération" apparaît dans le menu Communauté pour les modérateurs.</>,
        <><strong>Promotion :</strong> via la page <DocInline>/admin/users</DocInline>, sélectionner le rôle dans le RolePicker animé.</>,
      ]} />
    </DocSection>

    <DocSection title="Actions disponibles" eyebrow="Boîte à outils">
      <DocTable
        headers={["Action", "Effet", "Restriction"]}
        rows={[
          ["Supprimer un post", "Soft-delete (deleted_at) + log", "Raison obligatoire"],
          ["Avertir (rappel à l'ordre)", "Crée une moderation_warnings affichée à l'utilisateur", "Message visible par la cible"],
          ["Bannir 24/48/72h", "banned_until = now() + durée. Modale bloquante avec décompte côté user.", "Pas de bannissement d'admin"],
          ["Débannir", "banned_until = null (effet immédiat via realtime)", "Tout staff"],
          ["Mettre à la corbeille", "Soft-delete user, purge auto après 6 mois", "Confirmation par username + admin"],
          ["Restaurer un compte", "Annule la corbeille", "Admin titulaire uniquement"],
          ["Résoudre/Rejeter signalement", "Met à jour moderation_reports.status", "Tout staff"],
        ]}
      />
    </DocSection>

    <DocSection title="Modales utilisateur" eyebrow="Côté membre">
      <DocSubsection title="Bannissement">
        <DocP>
          Un utilisateur banni voit une modale plein écran <strong>bloquante</strong> avec :
        </DocP>
        <DocList items={[
          "Le motif fourni par le modérateur",
          "Un décompte HH:MM:SS mis à jour chaque seconde",
          "Un bouton 'Se déconnecter' (seule action possible)",
        ]} />
        <DocP>
          Le débannissement est propagé via Supabase Realtime — la modale disparaît instantanément
          dès qu'un modérateur lève la sanction, sans rechargement.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Rappels à l'ordre">
        <DocP>
          Les avertissements <DocInline>moderation_warnings</DocInline> non lus s'affichent en
          modale au login, une à la fois. L'utilisateur doit acquitter chaque message
          ("J'ai compris") avant de continuer.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Compte en corbeille">
        <DocP>
          Si <DocInline>profiles.deleted_at</DocInline> est non null, l'utilisateur voit une modale
          "Compte suspendu" puis est déconnecté automatiquement après 5s. Ses contenus apparaissent
          partout sous le nom <DocInline>"Utilisateur supprimé"</DocInline> et son profil n'est plus
          cliquable. Restauration possible par un admin pendant 6 mois.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Journaux" eyebrow="Mémoire des anciens">
      <DocP>
        Toute action de modération est consignée dans <DocInline>moderation_logs</DocInline>, accessible
        via <DocInline>/admin/logs</DocInline>. Les entrées incluent : modérateur (avec son rôle au
        moment de l'action), action, cible, motif, durée éventuelle, date.
      </DocP>
      <DocCallout type="info" title="Filtres disponibles">
        <DocP>Type d'action, modérateur, utilisateur cible, plage temporelle (URL params).</DocP>
      </DocCallout>
    </DocSection>

    <DocSection title="Tables et schéma" eyebrow="Référence technique">
      <DocCode lang="sql">{`-- Colonnes ajoutées à profiles
banned_until timestamptz, ban_reason text, banned_by uuid,
deleted_at timestamptz, deleted_by uuid, deletion_reason text, permanent_delete_at timestamptz

-- Soft-delete forum
forum_posts.deleted_at, deleted_by, deletion_reason
forum_threads.deleted_at, deleted_by, deletion_reason

-- Tables nouvelles
moderation_logs   -- une ligne par action de modération
moderation_warnings -- rappels à l'ordre, lus/non lus
moderation_reports -- signalements (déjà existante, maintenant connectée)`}</DocCode>
    </DocSection>

    <DocCallout type="warning" title="Bonnes pratiques">
      <DocList items={[
        "Toujours fournir une raison claire et factuelle — elle est consignée publiquement (côté staff).",
        "Avertir avant de bannir, sauf cas grave (insultes, doxxing, propos haineux).",
        "Préférer la corbeille à la suppression définitive : 6 mois de réversibilité.",
        "Le rôle Modérateur ne peut pas modifier les rôles ni accéder à la médiathèque — c'est volontaire.",
      ]} />
    </DocCallout>
  </>
);
