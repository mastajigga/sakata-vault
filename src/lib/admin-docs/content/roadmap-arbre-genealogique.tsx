import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead, DocQuote } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-arbre-genealogique",
  title: "Plan d'implémentation : Arbre Généalogique",
  subtitle:
    "Modélisation graphe des liens familiaux Sakata, visualisation D3.js, RLS par branche, et stratégie de partage privé/famille/public.",
  category: "roadmap",
  order: 6,
  readTime: 13,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["genealogy", "graph", "d3", "privacy"],
  summary:
    "Pourquoi la généalogie est culturellement explosive chez les Sakata, comment modéliser les liens en PostgreSQL, et le pattern de visualisation D3.",
};

export const Content = () => (
  <>
    <DocLead>
      Dans la culture Sakata, on ne se présente pas par son métier mais par sa
      lignée. « Je suis le fils de X, qui est le neveu de Y, du clan Z. » L'arbre
      généalogique n'est pas un loisir — c'est l'identité même. Numériser cela, c'est
      offrir aux diasporas la chance de retrouver des cousins jamais rencontrés.
    </DocLead>

    <DocQuote attribution="Proverbe Sakata">
      Mowei te akoyebe na nzela ya bankoko na ye. — « L'enfant ne se connaît qu'à
      travers ses ancêtres. »
    </DocQuote>

    <DocSection title="Le besoin culturel" eyebrow="Pourquoi">
      <DocList
        items={[
          <><strong>Identité par filiation</strong> — Chez les Sakata, la lignée maternelle (matrilinéaire dans certaines branches) et paternelle structurent les héritages, les alliances de mariage, les responsabilités rituelles.</>,
          <><strong>Mariages préventifs</strong> — Pas de mariage entre cousins jusqu'au 4ᵉ degré. Sans connaissance précise, les diasporas risquent des unions tabou sans le savoir.</>,
          <><strong>Reconstitution post-déplacements</strong> — Guerres, exodes, migrations forcées ont dispersé les familles. Beaucoup cherchent activement à reconnecter.</>,
          <><strong>Transmission</strong> — Sans arbre tangible, chaque génération qui passe perd 30% de la mémoire familiale.</>,
        ]}
      />
      <DocCallout type="info" title="Comparable existant">
        Geni.com, Ancestry.com sont occidentalo-centrés et ne gèrent ni la
        polygamie traditionnelle, ni les relations claniques (un clan ≠ une famille
        nucléaire), ni les noms en kisakata. C'est un trou de marché.
      </DocCallout>
    </DocSection>

    <DocSection title="Modélisation des données" eyebrow="Schéma">
      <DocSubsection title="Pourquoi PostgreSQL et pas Neo4j ?">
        <DocCallout type="decision" title="Choix">
          PostgreSQL avec table de relations + CTE récursives, plutôt qu'une base
          graphe dédiée (Neo4j, ArangoDB).
        </DocCallout>
        <DocTable
          headers={["Critère", "PostgreSQL + CTE", "Neo4j", "Verdict"]}
          rows={[
            ["Coût", "Inclus Supabase", "Hosting séparé 50-200$/mois", "PostgreSQL"],
            ["Profondeur typique", "5-10 générations max", "Illimitée", "Égal à cette échelle"],
            ["Performance < 10k personnes", "Très bonne", "Très bonne", "Égal"],
            ["RLS native", "✅", "❌ (à coder)", "PostgreSQL"],
            ["Intégration Sakata", "Déjà là", "Synchroniser deux bases", "PostgreSQL"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma SQL">
        <DocCode lang="sql">{`-- Une personne = un nœud du graphe
CREATE TABLE genealogy_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id UUID REFERENCES genealogy_trees(id),
  name_first TEXT NOT NULL,
  name_kisakata TEXT,                   -- nom traditionnel
  name_clan TEXT,                       -- clan Sakata
  birth_year INT,                       -- année seule (souvent inconnue)
  birth_year_estimated BOOLEAN DEFAULT FALSE,
  death_year INT,
  origin_village TEXT,
  notes TEXT,                            -- récit libre
  is_living BOOLEAN DEFAULT TRUE,
  user_id UUID REFERENCES profiles(id), -- si la personne a un compte Sakata
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Une relation = une arête typée
CREATE TABLE genealogy_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_tree_id UUID REFERENCES genealogy_trees(id),
  from_person_id UUID REFERENCES genealogy_persons(id),
  to_person_id UUID REFERENCES genealogy_persons(id),
  relation_type TEXT NOT NULL CHECK (relation_type IN (
    'parent', 'spouse', 'sibling', 'adopted_parent', 'clan_member'
  )),
  -- Pour les mariages multiples (polygamie traditionnelle)
  marriage_order INT,
  start_year INT,
  end_year INT,
  end_reason TEXT,                       -- 'death', 'divorce', 'separation'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_person_id, to_person_id, relation_type, marriage_order)
);

-- Un arbre = un espace de partage
CREATE TABLE genealogy_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'private',     -- private, family, clan, public
  share_token TEXT,                      -- pour partage par lien
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membres autorisés (visibility = 'family')
CREATE TABLE genealogy_tree_members (
  tree_id UUID REFERENCES genealogy_trees(id),
  user_id UUID REFERENCES profiles(id),
  role TEXT DEFAULT 'viewer',            -- viewer, editor, owner
  invited_by UUID REFERENCES profiles(id),
  PRIMARY KEY (tree_id, user_id)
);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Requête : ancêtres jusqu'au Nᵉ degré">
        <DocCode lang="sql">{`-- Trouver tous les ancêtres d'une personne (CTE récursive)
WITH RECURSIVE ancestors AS (
  SELECT
    r.from_person_id AS ancestor_id,
    1 AS generation
  FROM genealogy_relations r
  WHERE r.to_person_id = $1 AND r.relation_type = 'parent'

  UNION ALL

  SELECT
    r.from_person_id,
    a.generation + 1
  FROM genealogy_relations r
  JOIN ancestors a ON r.to_person_id = a.ancestor_id
  WHERE r.relation_type = 'parent' AND a.generation < 10
)
SELECT p.*, a.generation
FROM ancestors a
JOIN genealogy_persons p ON p.id = a.ancestor_id
ORDER BY a.generation, p.birth_year;`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Visualisation D3.js" eyebrow="Frontend">
      <DocSubsection title="Pourquoi D3 et pas une lib généalogie spécifique ?">
        <DocCallout type="decision" title="Choix">
          D3.js custom plutôt que <DocInline>familytree-js</DocInline>,{" "}
          <DocInline>balkan-genealogy</DocInline> ou autres libs payantes.
        </DocCallout>
        <DocList
          items={[
            <>Les libs spécialisées coûtent cher (200-2 000$ licence) ou sont fermées.</>,
            <>Aucune ne gère bien les mariages polygames (cas Sakata fréquent).</>,
            <>D3 + force-directed graph permet un layout adaptatif aux structures non-binaires.</>,
            <>Contrôle total sur le style (Brume design system).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Trois layouts possibles">
        <DocTable
          headers={["Layout", "Cas d'usage", "Lib"]}
          rows={[
            ["Tree (vertical/horizontal)", "Ascendance pure (parents → enfants)", "d3.tree()"],
            ["Force-directed", "Réseau familial complet (mariages, clans)", "d3.forceSimulation()"],
            ["Sunburst radial", "Vue ancêtres centrée sur ego", "d3.partition() + arc"],
          ]}
        />
        <DocP>
          L'utilisateur peut basculer entre les trois selon ce qu'il cherche.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Confidentialité (sujet sensible)" eyebrow="RLS & visibilité">
      <DocCallout type="warning" title="Données ultra-sensibles">
        Liens familiaux, dates de naissance, lieux d'origine — tout ça est exploitable
        pour identifier précisément un individu. RLS strictes + UI claire sur la
        visibilité.
      </DocCallout>

      <DocSubsection title="Quatre niveaux de visibilité">
        <DocTable
          headers={["Niveau", "Qui voit", "Cas d'usage"]}
          rows={[
            ["private", "Seul l'owner du tree", "Brouillon personnel"],
            ["family", "Members invités", "Famille élargie qui collabore"],
            ["clan", "Tous les users avec même <code>name_clan</code>", "Reconnexion clanique"],
            ["public", "Tout le monde", "Personnages historiques, chefs reconnus"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Personnes vivantes vs décédées">
        <DocP>
          Pour les personnes vivantes, masquer par défaut date de naissance précise et
          adresse. Anonymisation possible : « Mère » / « Frère cadet » sans nom complet
          si l'utilisateur n'a pas donné son consentement.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'implémentation — 5 sprints" eyebrow="Exécution">
      <DocSubsection title="Sprint 1 — Schéma + CRUD (1 semaine)">
        <DocList
          ordered
          items={[
            <>Migration SQL des 4 tables.</>,
            <>RLS pour chaque table selon les 4 niveaux de visibilité.</>,
            <>API Routes : <DocInline>/api/genealogy/persons</DocInline>, <DocInline>/api/genealogy/relations</DocInline>.</>,
            <>Tests RLS avec deux comptes utilisateurs distincts.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Éditeur (2 semaines)">
        <DocList
          ordered
          items={[
            <>Interface React pour ajouter/modifier des personnes.</>,
            <>Glisser-déposer pour créer des relations.</>,
            <>Validation : pas de cycle (A parent de B parent de A impossible).</>,
            <>Auto-suggestion : si l'utilisateur tape « X marié à Y », créer Y et la relation.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Visualisation D3 (2 semaines)">
        <DocList
          ordered
          items={[
            <>Layout tree de base (vertical, ascendance).</>,
            <>Switch vers force-directed pour vue réseau.</>,
            <>Zoom/pan, click pour focus sur une personne.</>,
            <>Photo (avatar) si fournie, initiales sinon.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 4 — Partage & invitations (1 semaine)">
        <DocList
          ordered
          items={[
            <>Génération de lien partage avec token.</>,
            <>Invitation par email d'un parent vers un tree.</>,
            <>Acceptation et fusion de trees (deux cousins qui réalisent qu'ils ont des ancêtres communs).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 5 — Recherche cross-trees (1 semaine)">
        <DocList
          ordered
          items={[
            <>Index sur <DocInline>name_clan</DocInline>, <DocInline>origin_village</DocInline>, <DocInline>birth_year</DocInline>.</>,
            <>Recherche fuzzy : « Personne née ~1920 dans village X » → suggestions de matches dans d'autres trees publics.</>,
            <>Validation manuelle de fusion (consentement des deux owners).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Données fausses (légendes familiales) prises pour vérité", "Élevée", "Moyen", "Champ <code>source_certainty</code> par fait + indicateurs visuels (« mémoire orale »)"],
          ["Conflits familiaux (versions divergentes)", "Élevée", "Haut", "Permettre plusieurs trees concurrents, pas de fusion forcée"],
          ["RGPD : ajouter quelqu'un sans consentement", "Moyenne", "Critique (légal)", "Personnes vivantes anonymisées par défaut + procédure de retrait sur demande"],
          ["Performance avec 5 000+ personnes", "Faible (rare cas)", "Moyen", "Pagination des relations + virtualisation D3"],
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois post-lancement :</strong> 100 trees créés, 2 000 personnes cataloguées.</>,
          <><strong>6 mois :</strong> 5 fusions de trees inter-familles, 3 reconnexions diaspora documentées.</>,
          <><strong>12 mois :</strong> Article presse / podcast diaspora qui mentionne une « retrouvaille Sakata ».</>,
        ]}
      />
    </DocSection>
  </>
);
