import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-rls-supabase",
  title: "Pattern de Sécurité — RLS Supabase",
  subtitle:
    "Approche systématique des Row-Level Security policies : default-deny, helpers réutilisables, et tests de non-régression.",
  category: "architecture",
  order: 2,
  readTime: 7,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["security", "rls", "postgres", "supabase"],
  summary:
    "Patterns RLS appliqués à toutes les tables Sakata : owner-only, role-based, public-read. Avec exemples et anti-patterns.",
};

export const Content = () => (
  <>
    <DocLead>
      RLS (Row-Level Security) est la dernière ligne de défense entre un attaquant et
      les données utilisateurs. Sans elle, n'importe qui ayant la clé publique
      Supabase pourrait <DocInline>SELECT * FROM profiles</DocInline> et exfiltrer
      toute la base. Avec elle, même un endpoint API mal écrit ne peut pas violer la
      sécurité.
    </DocLead>

    <DocSection title="Principe : default-deny" eyebrow="Philosophie">
      <DocCallout type="decision" title="Règle absolue">
        Sur Sakata, <strong>toute table contenant des données utilisateur a RLS
        activée</strong>. Les policies ajoutent ensuite des permissions explicites.
        Aucune table user-touchée ne reste « ouverte ».
      </DocCallout>
      <DocCode lang="sql">{`-- Sur chaque nouvelle table :
ALTER TABLE public.ma_table ENABLE ROW LEVEL SECURITY;

-- Sans aucune policy ensuite : NOTHING is accessible
-- (sauf via service_role key, contournement explicite)`}</DocCode>
    </DocSection>

    <DocSection title="Patterns standards" eyebrow="Réutilisables">
      <DocSubsection title="1. Owner-only (le plus courant)">
        <DocP>
          La table contient des données qui n'appartiennent qu'à un seul user. Exemples :
          <DocInline>admin_notes</DocInline>, <DocInline>ecole_scores</DocInline>,
          <DocInline>push_subscriptions</DocInline>.
        </DocP>
        <DocCode lang="sql">{`-- ALL = SELECT + INSERT + UPDATE + DELETE en une policy
CREATE POLICY "owner_only"
  ON ma_table FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());`}</DocCode>
      </DocSubsection>

      <DocSubsection title="2. Public-read, owner-write">
        <DocP>
          Lecture publique (ou pour authentifiés), écriture restreinte au propriétaire.
          Exemples : <DocInline>profiles</DocInline>, <DocInline>articles</DocInline>{" "}
          (sauf premium).
        </DocP>
        <DocCode lang="sql">{`CREATE POLICY "public_read"
  ON profiles FOR SELECT
  TO public USING (true);

CREATE POLICY "self_update"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT par trigger après auth.signup, pas par user direct
-- DELETE jamais autorisé pour le user (admin uniquement)`}</DocCode>
      </DocSubsection>

      <DocSubsection title="3. Role-based">
        <DocP>
          Permission dépendante du rôle dans <DocInline>profiles.role</DocInline>.
          Exemples : tables admin, modération.
        </DocP>
        <DocCode lang="sql">{`CREATE POLICY "admin_or_manager"
  ON contribution_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'manager')
    )
  );`}</DocCode>
      </DocSubsection>

      <DocSubsection title="4. Time-windowed (édition limitée dans le temps)">
        <DocP>
          Le user peut modifier son message pendant 5 minutes seulement.
        </DocP>
        <DocCode lang="sql">{`CREATE POLICY "edit_within_5_min"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid()
    AND created_at > NOW() - INTERVAL '5 minutes'
  );`}</DocCode>
      </DocSubsection>

      <DocSubsection title="5. Premium gating">
        <DocCode lang="sql">{`CREATE POLICY "premium_articles"
  ON articles FOR SELECT
  TO authenticated
  USING (
    requires_premium = false
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.subscription_tier = 'premium'
    )
  );`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Helpers réutilisables" eyebrow="DRY">
      <DocCode lang="sql" caption="migrations/security_helpers.sql">{`-- Vérifier le rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
  );
$$;

-- Usage simplifié dans les policies :
CREATE POLICY "managers_can_lock"
  ON forum_threads FOR UPDATE
  TO authenticated
  USING (is_admin_or_manager());`}</DocCode>
      <DocCallout type="info" title="Bonus performance">
        Les fonctions <DocInline>STABLE</DocInline> sont memoizées par Postgres au
        sein d'une même requête → un seul lookup même si la policy est évaluée 1000
        fois.
      </DocCallout>
    </DocSection>

    <DocSection title="Anti-patterns à proscrire" eyebrow="Erreurs courantes">
      <DocCallout type="error" title="❌ Ne JAMAIS faire">
        <DocList
          items={[
            <>RLS désactivée « pour aller plus vite » sur une table user-touchée.</>,
            <>Faire confiance au service_role key dans une API route sans vérifier l'auth de l'utilisateur en amont.</>,
            <>Policy avec <DocInline>USING (true)</DocInline> sur une table sensible.</>,
            <>Oublier <DocInline>WITH CHECK</DocInline> sur INSERT/UPDATE — la policy lit mais ne valide pas l'écriture.</>,
            <>Comparer <DocInline>auth.role()</DocInline> au lieu de <DocInline>auth.uid()</DocInline> + lookup profile.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Tests de non-régression" eyebrow="Validation">
      <DocP>
        Comment savoir qu'une nouvelle migration n'a pas cassé une RLS ? Tests
        scriptés avec deux clients Supabase :
      </DocP>
      <DocCode lang="typescript">{`// tests/rls/profiles.test.ts
const userA = createBrowserClient(URL, ANON_KEY);
const userB = createBrowserClient(URL, ANON_KEY);

test("user A cannot UPDATE user B's profile", async () => {
  await userA.auth.signInWithPassword({ email: "a@x.com", ... });
  const { error } = await userA
    .from("profiles")
    .update({ username: "hacked" })
    .eq("id", USER_B_ID);

  expect(error).toBeTruthy();  // Doit échouer
});`}</DocCode>
    </DocSection>

    <DocSection title="Checklist nouvelle table" eyebrow="Discipline">
      <DocList
        ordered
        items={[
          <>Activer RLS : <DocInline>ALTER TABLE ... ENABLE ROW LEVEL SECURITY</DocInline>.</>,
          <>Identifier le pattern (owner-only, role-based, etc.).</>,
          <>Écrire les policies SELECT, INSERT, UPDATE, DELETE séparément (granularité).</>,
          <>Penser au <DocInline>WITH CHECK</DocInline> sur INSERT/UPDATE.</>,
          <>Ajouter index sur <DocInline>user_id</DocInline> et autres colonnes filtrées.</>,
          <>Écrire un test de non-régression.</>,
          <>Documenter dans la migration le pourquoi des policies.</>,
        ]}
      />
    </DocSection>
  </>
);
