import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-temp-admin-role",
  title: "Rôle Administrateur Temporaire",
  subtitle:
    "Délégation 24h des pouvoirs admin à un user de confiance, avec garde-fou non-révocable contre la prise de contrôle.",
  category: "feature",
  order: 10,
  readTime: 7,
  updatedAt: "2026-04-28",
  author: "Direction Sakata",
  tags: ["roles", "permissions", "security", "rls"],
  summary:
    "Architecture du rôle temp_admin : enum + colonnes + table d'audit, helpers SQL, et garde-fou empêchant la modification d'un admin titulaire.",
};

export const Content = () => (
  <>
    <DocLead>
      Le rôle <DocInline>temp_admin</DocInline> permet à un admin titulaire de
      déléguer ses pouvoirs pour 24 heures à un user de confiance, sans risquer une
      compromission permanente du contrôle. Le temp_admin agit comme un admin
      <strong> sauf</strong> sur deux opérations sensibles : il ne peut pas
      supprimer un autre admin, ni modifier son rôle.
    </DocLead>

    <DocSection title="Modèle de données" eyebrow="Schéma">
      <DocSubsection title="Enum + colonnes profiles">
        <DocCode lang="sql">{`-- Ajout dans l'enum
ALTER TYPE user_role ADD VALUE 'temp_admin';

-- Trois colonnes pour le cycle de vie
ALTER TABLE profiles
  ADD COLUMN temp_admin_expires_at TIMESTAMPTZ,
  ADD COLUMN temp_admin_granted_by UUID REFERENCES profiles(id),
  ADD COLUMN temp_admin_original_role user_role;`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Table d'audit temp_admin_grants">
        <DocCode lang="sql">{`CREATE TABLE temp_admin_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES profiles(id),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoked_by UUID REFERENCES profiles(id),
  reason TEXT,
  original_role user_role NOT NULL
);`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Helpers SQL" eyebrow="API DB">
      <DocTable
        headers={["Fonction", "Retourne true si"]}
        rows={[
          [<DocInline>is_admin_effectively(uid)</DocInline>, "role='admin' OU (role='temp_admin' ET expires_at > NOW())"],
          [<DocInline>is_real_admin(uid)</DocInline>, "role='admin' uniquement"],
          [<DocInline>is_admin_or_manager(uid)</DocInline>, "Précédent OU role='manager'"],
          [<DocInline>can_modify_profile(actor, target)</DocInline>, "actor real_admin OU (actor admin_eff ET target NOT real_admin)"],
        ]}
      />
    </DocSection>

    <DocSection title="Cycle de vie" eyebrow="Flux">
      <DocList
        ordered
        items={[
          <>Admin titulaire ouvre <DocInline>/admin/users</DocInline>, clique sur l'icône éclair <DocInline>⚡</DocInline> du user cible.</>,
          <>Modal saisit la raison (optionnelle), confirme.</>,
          <>POST <DocInline>/api/admin/temp-grants</DocInline> :
            <DocList items={[
              <>Vérifie actor = real_admin</>,
              <>Vérifie target ≠ admin titulaire</>,
              <>Si target déjà temp_admin actif : revoque le grant courant</>,
              <>Insert audit row dans <DocInline>temp_admin_grants</DocInline></>,
              <>UPDATE profile : role='temp_admin', expires_at=NOW()+24h, granted_by, original_role</>,
            ]} />
          </>,
          <>Pendant 24h, le user voit Command Center avec badge « Admin Temp · Xh restant ».</>,
          <>À l'expiration ou révocation : profile remis à <DocInline>original_role</DocInline>, grant.revoked_at renseigné.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Restrictions du temp_admin" eyebrow="Garde-fous">
      <DocCallout type="warning" title="Ce qu'un temp_admin NE peut PAS faire">
        <DocList items={[
          <>Supprimer un autre administrateur titulaire</>,
          <>Modifier le rôle d'un administrateur titulaire (rétrograder ou supprimer)</>,
          <>S'octroyer à lui-même un autre temp_admin (anti-cascade)</>,
          <>Prolonger sa propre durée</>,
        ]} />
      </DocCallout>

      <DocCallout type="success" title="Ce qu'il PEUT faire">
        <DocList items={[
          <>Modérer le forum et le chat</>,
          <>Valider et publier les contributions</>,
          <>Éditer tous les contenus</>,
          <>Supprimer/modifier le rôle des managers, contributors, users</>,
          <>Bannir des utilisateurs (sauf admins)</>,
        ]} />
      </DocCallout>
    </DocSection>

    <DocSection title="UI" eyebrow="Interface">
      <DocList items={[
        <><strong>Admin titulaire</strong> sur <DocInline>/admin/users</DocInline> : icône <DocInline>⚡</DocInline> pour promouvoir, icône <DocInline>⌛</DocInline> ambre pour révoquer.</>,
        <><strong>Modal de promotion</strong> avec récap et champ raison.</>,
        <><strong>Badge dans la Navbar</strong> pour le temp_admin actif : « Admin Temp · 21h 42min », pulse rouge à moins d'1h.</>,
        <><strong>Colonne rôle</strong> dans le tableau membres affiche le countdown sous le label.</>,
      ]} />
    </DocSection>

    <DocSection title="Côté code TypeScript" eyebrow="Helpers">
      <DocCode lang="typescript">{`import {
  isTempAdminActive,
  getEffectiveRole,
  canModifyUser,
  formatTempAdminRemaining,
} from "@/lib/constants/business";

// Le profile retourné par AuthProvider contient désormais :
// - role          : rôle brut ('temp_admin' possible)
// - effectiveRole : rôle calculé ('admin' si temp_admin actif)
// - tempAdminExpiresAt
// - isTempAdminActive

const { role, effectiveRole, isTempAdminActive } = useAuth();

// Pour les checks runtime : préférer effectiveRole
if (effectiveRole === 'admin') {
  // marche pour vrai admin ET temp_admin actif
}`}</DocCode>
    </DocSection>

    <DocSection title="Sécurité — RLS et garde-fous" eyebrow="Règles">
      <DocCallout type="decision" title="Règles non négociables">
        <DocList items={[
          <>Seul un VRAI admin peut accorder ou révoquer un temp_admin (RLS sur <DocInline>temp_admin_grants</DocInline>).</>,
          <>Un temp_admin ne peut PAS toucher à un profile.role = 'admin' (vérifié côté UI + RLS via <DocInline>can_modify_profile</DocInline>).</>,
          <>L'expiration est checkée à chaque requête via <DocInline>NOW() &gt; expires_at</DocInline> — pas de cache, pas de latence.</>,
          <>Toute action est traçable via <DocInline>temp_admin_grants</DocInline> (qui a été promu, par qui, quand, raison).</>,
        ]} />
      </DocCallout>
    </DocSection>

    <DocSection title="Cas d'usage" eyebrow="Quand l'utiliser">
      <DocList items={[
        <><strong>Voyage du fondateur</strong> : déléguer à un manager pendant un déplacement de plusieurs jours.</>,
        <><strong>Test de promotion</strong> : essayer un manager comme admin avant promotion définitive.</>,
        <><strong>Modération de crise</strong> : apporter du renfort temporaire en cas de pic de signalements.</>,
        <><strong>Couverture événement</strong> : Audio Room en live qui nécessite plus de modérateurs.</>,
      ]} />
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList items={[
        <>Pas de notification push automatique au user promu (à venir avec PWA).</>,
        <>Pas de notification 1h avant expiration (à ajouter).</>,
        <>Pas de cron qui flush les grants expirés en DB — mais ils n'ont aucun effet runtime grâce aux helpers SQL.</>,
        <>Un seul temp_admin actif par user (le nouveau revoque l'ancien).</>,
      ]} />
    </DocSection>
  </>
);
