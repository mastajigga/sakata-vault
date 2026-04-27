import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-mode-multi-tribu",
  title: "Plan d'implémentation : Mode Multi-Tribu",
  subtitle:
    "Architecture multi-tenant pour étendre Sakata.com à d'autres ethnies bantu — Lega, Tetela, Ngongo, Mongo — sans dupliquer le code.",
  category: "roadmap",
  order: 11,
  readTime: 12,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["multi-tenant", "architecture", "scaling", "saas"],
  summary:
    "Décision stratégique à prendre AVANT de scaler en contenu : subdomain vs path routing, isolation données, theming par tribu, et calendrier de pivot.",
};

export const Content = () => (
  <>
    <DocLead>
      Ceci est <strong>la</strong> décision architecturale qui doit être prise avant
      d'avoir 1 000 articles. Refactor un système mono-tribu vers multi-tribu après le
      fait coûte 3-6 mois de travail. Le faire maintenant, alors qu'on a 30 articles,
      coûte 2 semaines. Cette doc plante les bases pour ne pas devoir reverser plus tard.
    </DocLead>

    <DocSection title="Pourquoi viser multi-tribu ?" eyebrow="Vision">
      <DocList
        items={[
          <><strong>Marché 100× plus grand</strong> — Les Sakata sont ~250k. Toutes les ethnies bantu congolaises = 70+ millions.</>,
          <><strong>Économie d'échelle</strong> — Une seule infrastructure, un seul code, plusieurs communautés.</>,
          <><strong>Argument auprès partenaires institutionnels</strong> — Une plateforme qui couvre 5 ethnies = bien plus pitchable qu'une seule.</>,
          <><strong>Réseau de contenus croisés</strong> — Les Sakata et les Tetela partagent des éléments culturels. Cross-référencement enrichit chacun.</>,
        ]}
      />
      <DocCallout type="warning" title="Mais pas tout de suite">
        Le mode multi-tribu ne se lance qu'après avoir prouvé le modèle sur Sakata.
        L'objectif : <strong>préparer l'architecture maintenant</strong>, activer la
        seconde tribu en Q1 2027 quand Sakata est mature.
      </DocCallout>
    </DocSection>

    <DocSection title="Décision n°1 : Subdomain vs Path-based routing" eyebrow="Architecture">
      <DocSubsection title="Options">
        <DocTable
          headers={["Option", "URL", "Pour", "Contre"]}
          rows={[
            [
              "Path-based",
              "platform.com/sakata/savoir/...",
              "Simple, 1 seul certificat SSL, SEO domaine partagé",
              "URLs longues, identité tribale moins forte",
            ],
            [
              "Subdomain",
              "sakata.platform.com/savoir/...",
              "Chaque tribu sa marque visuelle, SEO indépendant",
              "Wildcard SSL, gestion DNS, complexité Next.js",
            ],
            [
              "Domaines séparés",
              "sakata.com / lega.com",
              "Marque maximale",
              "30 domaines à gérer, pas de cross-pollination",
            ],
          ]}
        />
      </DocSubsection>

      <DocCallout type="decision" title="Choix">
        <strong>Subdomain</strong>. Compromis idéal : chaque communauté garde son
        identité (URL, palette, polices), tout en mutualisant l'infrastructure.
        Sakata.com reste l'URL principale ; Lega devient lega.basakata.com (ou
        similaire).
      </DocCallout>
    </DocSection>

    <DocSection title="Décision n°2 : Isolation des données" eyebrow="DB">
      <DocSubsection title="Trois niveaux possibles">
        <DocTable
          headers={["Stratégie", "Isolation", "Coût", "Complexité"]}
          rows={[
            ["Une DB par tribu", "Totale", "Élevé (10×)", "Très haute"],
            ["Schema-per-tenant", "Forte", "Modérée", "Haute"],
            ["Tenant ID partout", "Logique seule", "Faible (mutualisation)", "Modérée"],
          ]}
        />
      </DocSubsection>

      <DocCallout type="decision" title="Choix">
        <strong>Tenant ID partout</strong>. Toutes les tables ajoutent une colonne{" "}
        <DocInline>tenant_id</DocInline> ; les RLS filtrent strictement par tenant.
      </DocCallout>

      <DocSubsection title="Pourquoi ce choix">
        <DocList
          items={[
            <>Une seule DB Supabase = facturation unique, opérations unifiées.</>,
            <>RLS Postgres garantissent l'isolation logique aussi solidement qu'un schema séparé.</>,
            <>Cross-tribu queries possibles (utile pour la recherche transversale future).</>,
            <>Coût marginal d'ajout d'une nouvelle tribu : ~30 minutes (seed la tribu, créer les RLS).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma cible">
        <DocCode lang="sql">{`CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,        -- 'sakata', 'lega', 'tetela', ...
  display_name TEXT NOT NULL,
  primary_language TEXT NOT NULL,   -- 'kisakata', 'kilega', ...
  region_country TEXT,
  population_estimate INT,
  primary_color TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Toutes les tables existantes gagnent une colonne :
ALTER TABLE articles ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE chat_conversations ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE forum_threads ADD COLUMN tenant_id UUID REFERENCES tenants(id);
-- ...

-- RLS adaptées :
CREATE POLICY "tenant_articles_read"
  ON articles FOR SELECT
  USING (
    tenant_id = current_setting('app.tenant_id')::uuid
    OR is_admin_or_manager()
  );`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Décision n°3 : Theming par tenant" eyebrow="UI">
      <DocSubsection title="Approche CSS variables">
        <DocCode lang="typescript">{`// Côté layout root :
async function RootLayout({ children }) {
  const tenant = await getTenantFromHostname();

  return (
    <html style={{
      "--tenant-primary": tenant.primary_color,
      "--tenant-secondary": tenant.secondary_color,
      "--tenant-bg": tenant.bg_color,
    } as CSSProperties}>
      {children}
    </html>
  );
}

// Tailwind utilise les variables :
// className="bg-[var(--tenant-primary)]"`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Au-delà des couleurs">
        <DocList
          items={[
            <>Polices : chaque tribu peut choisir une famille typographique distincte.</>,
            <>Logo : composant <DocInline>{`<TenantLogo />`}</DocInline> qui charge selon le tenant.</>,
            <>Voix narrative IA : prompt sage-basakata adapté par tribu.</>,
            <>Glossaire de termes intraduisibles : par tribu (Ngongo Sakata ≠ équivalent Lega).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan de migration progressive" eyebrow="Exécution">
      <DocSubsection title="Phase A — Préparation (Q3 2026, 2 semaines)">
        <DocList
          ordered
          items={[
            <>Créer la table <DocInline>tenants</DocInline>, seed avec une seule entrée « sakata ».</>,
            <>Ajouter <DocInline>tenant_id</DocInline> à toutes les tables, défault à l'ID Sakata.</>,
            <>Adapter toutes les RLS pour filtrer par tenant.</>,
            <>Middleware Next.js qui détecte le subdomain et set <DocInline>app.tenant_id</DocInline>.</>,
            <>Tests : tout fonctionne identique sur sakata.com.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Phase B — Theming foundation (1 semaine)">
        <DocList
          ordered
          items={[
            <>Refactor : remplacer toutes les couleurs hardcodées par variables CSS.</>,
            <>Layout root qui injecte les variables tenant.</>,
            <>Composants polymorphes : <DocInline>TenantLogo</DocInline>, <DocInline>TenantName</DocInline>.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Phase C — Activation seconde tribu (Q1 2027, 2 semaines)">
        <DocList
          ordered
          items={[
            <>Choisir tribu pilote : Lega ou Ngongo (proche culturellement, communauté demandeuse).</>,
            <>Configuration tenant : couleurs, logo, langue, slug.</>,
            <>Bulk import 20 articles ethnographiques de la tribu.</>,
            <>Recrutement de 2-3 contributeurs natifs.</>,
            <>Lancement soft sur communautés diaspora.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Refactor casse Sakata existant", "Moyenne", "Très haut", "Tests RLS automatisés + migration progressive avec branche staging"],
          ["Confusion utilisateurs Sakata sur la marque", "Moyenne", "Moyen", "Sakata reste l'identité principale visible, Lega est explicitement « via Sakata »"],
          ["Cannibalisation entre tribus", "Faible", "Moyen", "Cross-promotion explicite : 'À voir aussi chez les Lega'"],
          ["Coût IA × N tribus", "Élevée", "Moyen", "Quotas par tenant, coûts prorata des abonnés premium par tribu"],
          ["Sans-fond historique pour la tribu pilote", "Élevée", "Haut", "Recrutement préalable de partenaires académiques (Inalco, ULB)"],
        ]}
      />
    </DocSection>

    <DocSection title="Coût" eyebrow="Budget">
      <DocList
        items={[
          <><strong>Phase A+B (préparation) :</strong> 3 semaines = ~6 000€ ou 0€ interne.</>,
          <><strong>Phase C (activation) par tribu :</strong> 2 semaines = ~4 000€ + 1 500€ bulk import + 1 000€ contributeurs.</>,
          <><strong>Coût marginal d'une nouvelle tribu après ça :</strong> ~30 minutes config + recrutement.</>,
        ]}
      />
      <DocCallout type="success" title="ROI">
        Si une seconde tribu attire 200 abonnés Premium, c'est 1 800€/mois de revenu
        additionnel. Amortissement complet en 6 mois.
      </DocCallout>
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>Phase A complétée :</strong> Sakata.com fonctionne identique, mais l'architecture est multi-tenant ready.</>,
          <><strong>3 mois post-Phase C :</strong> 50 articles + 100 utilisateurs sur la 2ᵉ tribu pilote.</>,
          <><strong>12 mois multi-tribu :</strong> 3-5 tribus actives, infrastructure mutualisée, cross-pollination de contenus.</>,
        ]}
      />
    </DocSection>
  </>
);
