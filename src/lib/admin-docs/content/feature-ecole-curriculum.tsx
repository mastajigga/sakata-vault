import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-ecole-curriculum",
  title: "École & Curriculum Mathématiques",
  subtitle:
    "Espace scolaire avec curriculum mathématiques structuré sur 3 années secondaires, mode jeu gamifié et persistance des scores.",
  category: "feature",
  order: 7,
  readTime: 6,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["education", "gamification", "supabase", "ecole"],
  summary:
    "Architecture pédagogique : structure curriculum, GameMode component, score persistence, et stratégie d'extension à d'autres matières.",
};

export const Content = () => (
  <>
    <DocLead>
      L'École de Sakata a une mission spécifique : offrir aux jeunes des diasporas un
      contenu pédagogique solide ancré dans le système congolais (programme secondaire
      RDC), avec une couche ludique qui rend l'auto-apprentissage soutenable.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Accessible via <DocInline>/ecole</DocInline>, propose pour l'instant le
        curriculum mathématiques :
      </DocP>
      <DocList
        items={[
          <><strong>Primaire</strong> (introduction, calcul, géométrie de base).</>,
          <><strong>Secondaire 1ʳᵉ année</strong> (algèbre élémentaire, équations 1er degré).</>,
          <><strong>Secondaire 2ᵉ année</strong> (équations 2nd degré, fonctions linéaires).</>,
          <><strong>Secondaire 3ᵉ année</strong> (trigonométrie, statistiques).</>,
        ]}
      />
      <DocP>
        Chaque chapitre contient : leçon (Markdown), exemples interactifs, série
        d'exercices, mode jeu (auto-évaluation gamifiée).
      </DocP>
    </DocSection>

    <DocSection title="Architecture des données" eyebrow="Modèle">
      <DocSubsection title="Curriculum statique (TypeScript)">
        <DocP>
          Le curriculum complet est dans <DocInline>src/app/ecole/data/mathematics-curriculum.ts</DocInline>,
          ~3 000 lignes. Choix volontaire : <strong>pas en DB</strong>.
        </DocP>
        <DocCallout type="decision" title="Pourquoi statique ?">
          <DocList
            items={[
              <>Le contenu pédagogique évolue rarement (1-2× par an), pas besoin de DB.</>,
              <>Type-safety : autocompletion sur tout le curriculum, erreurs détectées au build.</>,
              <>Performance : lecture instantanée, pas de roundtrip Supabase.</>,
              <>Versioning git : l'évolution pédagogique est tracée naturellement.</>,
            ]}
          />
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Scores en DB (table ecole_scores)">
        <DocCode lang="sql">{`CREATE TABLE ecole_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  curriculum_namespace TEXT NOT NULL,  -- ex: "math.s1.equations"
  exercise_id TEXT NOT NULL,
  score NUMERIC NOT NULL,              -- 0..100
  attempts INT DEFAULT 1,
  best_score NUMERIC,
  last_attempt_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, curriculum_namespace, exercise_id)
);

-- RLS : chaque user voit/écrit seulement ses propres scores
CREATE POLICY "ecole_scores_owner"
  ON ecole_scores FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Progression locale (localStorage)">
        <DocP>
          Pour les utilisateurs non connectés, la progression est stockée en
          localStorage avec la clé <DocInline>ecoleProgressKey(ns)</DocInline> →{" "}
          <DocInline>"sakata-ecole-progress-{`{namespace}`}"</DocInline>. À la connexion,
          un sync optionnel migre les données vers Supabase.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="GameMode — composant clé" eyebrow="Gamification">
      <DocP>
        Le composant <DocInline>GameMode</DocInline> transforme une série d'exercices
        en mini-quiz timé :
      </DocP>
      <DocList
        items={[
          <>Score affiché en temps réel, animation à chaque bonne réponse.</>,
          <>3 indices disponibles par exercice, coût en points.</>,
          <>Streak counter — bonus à 3, 5, 10 réussites consécutives.</>,
          <>Persistence automatique en DB via <DocInline>useEcoleProgress</DocInline> hook.</>,
        ]}
      />
      <DocCallout type="warning" title="Bug évité">
        Le composant initial créait un <DocInline>createBrowserClient()</DocInline> à
        chaque render — leak WebSocket. Fix : utiliser le singleton{" "}
        <DocInline>supabase</DocInline> importé.
      </DocCallout>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Boucle infinie sur les enrichments">
        <DocP>
          Symptôme : la page <DocInline>CoursePage</DocInline> faisait des centaines
          de fetches à la seconde. Cause : un <DocInline>useEffect</DocInline> qui
          dépendait de l'array des programmes, dont la référence changeait à chaque
          render.
        </DocP>
        <DocP>
          Fix : utiliser un <DocInline>Set&lt;string&gt;</DocInline> en{" "}
          <DocInline>useRef</DocInline> pour mémoriser les IDs déjà fetchés et bloquer
          les doublons.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Sidebar mal organisée">
        <DocP>
          Initialement, primaire et secondaire étaient mélangés dans la sidebar →
          confusion totale pour les utilisateurs. Refonte : sections séparées avec
          icônes distinctives, niveau actif mis en évidence.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Extension prévue à d'autres matières" eyebrow="Roadmap">
      <DocP>
        Le pattern est extensible : ajouter une matière = ajouter un fichier dans{" "}
        <DocInline>src/app/ecole/data/</DocInline>. Matières envisagées :
      </DocP>
      <DocList
        items={[
          <><strong>Histoire RDC</strong> — pré-colonial, colonisation, indépendance, post-indépendance.</>,
          <><strong>Langues bantu</strong> — kisakata, lingala, swahili (modules débutant/intermédiaire).</>,
          <><strong>Sciences naturelles</strong> — adaptées au contexte écologique du Mai-Ndombe.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de tableau noir interactif (résolution étape par étape).</>,
          <>Pas de comparaison sociale (classements amicaux).</>,
          <>Mathématiques uniquement — autres matières en backlog.</>,
        ]}
      />
    </DocSection>
  </>
);
