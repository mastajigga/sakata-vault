import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-article-editor",
  title: "Éditeur d'Articles par Blocs",
  subtitle:
    "Éditeur multilingue à blocs avec drag-and-drop, traduction automatique IA, médiathèque intégrée et synthèse vocale.",
  category: "feature",
  order: 6,
  readTime: 9,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["editor", "multilang", "ai-translation", "drag-drop"],
  summary:
    "Architecture du block editor à 4 types (texte, titre, image, citation), gestion multilangue, et intégration des outils IA pour traduire et narrer.",
};

export const Content = () => (
  <>
    <DocLead>
      Un éditeur d'articles c'est trompeusement simple à imaginer mais redoutable à
      implémenter. Le bon équilibre entre liberté éditoriale et structure se trouve
      dans le pattern « blocks » — popularisé par Notion, devenu standard de
      l'édition web moderne.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Accessible via <DocInline>/admin/content/[slug]</DocInline> (édition) ou{" "}
        <DocInline>/admin/content/new</DocInline> (création), l'éditeur permet aux
        admins/managers de composer des articles riches et multilingues.
      </DocP>
      <DocList
        items={[
          <><strong>4 types de blocs</strong> : paragraphe, titre, image, citation.</>,
          <><strong>6 langues</strong> en parallèle (fr, en, skt, lin, swa, tsh) via tabs.</>,
          <><strong>Drag-and-drop</strong> pour réordonner les blocs.</>,
          <><strong>Médiathèque</strong> latérale pour insérer des images existantes en un clic.</>,
          <><strong>Vidéo héro</strong> optionnelle (voir doc dédiée).</>,
          <><strong>Traduction auto</strong> via Gemini — depuis FR vers les 5 autres langues.</>,
          <><strong>Synthèse vocale</strong> auto via Gemini Voice (option « Auto Voix »).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Pourquoi le pattern blocks et pas Markdown brut ?" eyebrow="Décision">
      <DocCallout type="decision" title="Choix">
        Modèle de données : <DocInline>ContentBlock[]</DocInline> sérialisé en JSONB
        Postgres, plutôt qu'un blob Markdown.
      </DocCallout>

      <DocTable
        headers={["Aspect", "Markdown brut", "Blocks structurés", "Verdict"]}
        rows={[
          ["Stockage", "TEXT simple", "JSONB structuré", "Égal"],
          ["Édition WYSIWYG", "Difficile (parser bidir)", "Naturel", "Blocks"],
          ["Validation IA", "Devine la structure", "Structure explicite", "Blocks"],
          ["Migration de format", "Tout casse", "Schema versioning facile", "Blocks"],
          ["Reorder de paragraphes", "Couper/coller", "Drag-drop natif", "Blocks"],
          ["Mode legacy", "Lecture immédiate", "Rendu via composant", "Markdown"],
        ]}
      />

      <DocP>
        Un mode <strong>« Markdown brut »</strong> est conservé en bascule (bouton{" "}
        <DocInline>toggleMode</DocInline>) pour les utilisateurs qui préfèrent — utile
        pour les articles très longs où le block editor devient lourd.
      </DocP>
    </DocSection>

    <DocSection title="Type ContentBlock" eyebrow="Modèle de données">
      <DocCode lang="typescript">{`export type ContentBlock = {
  id: string;
  type: "text" | "heading" | "image" | "quote";
  body?: string;       // text, heading, quote
  url?: string;        // image only
  caption?: string;    // image, quote
  alignment?: "left" | "full" | "right" | "sidebar";  // image only
};

// Stocké en DB :
articles.content = {
  fr: ContentBlock[],
  en: ContentBlock[],
  // ...
}`}</DocCode>
    </DocSection>

    <DocSection title="Drag-and-drop : Framer Motion Reorder" eyebrow="Implémentation">
      <DocP>
        Plutôt que <DocInline>react-dnd</DocInline> (lourd, complexe), on utilise{" "}
        <DocInline>{`<Reorder.Group>`}</DocInline> de Framer Motion. Une seule prop{" "}
        <DocInline>values + onReorder</DocInline> suffit.
      </DocP>
      <DocCode lang="tsx">{`<Reorder.Group axis="y" values={blocks} onReorder={onChange}>
  {blocks.map(block => (
    <Reorder.Item key={block.id} value={block}>
      {/* Contenu éditable */}
    </Reorder.Item>
  ))}
</Reorder.Group>`}</DocCode>
      <DocCallout type="success" title="Bonus">
        Le réordonnancement est animé fluidement (60fps) sans config supplémentaire.
        Sur mobile, tactile-friendly out-of-the-box.
      </DocCallout>
    </DocSection>

    <DocSection title="Traduction automatique" eyebrow="IA">
      <DocSubsection title="Pourquoi Gemini et pas Claude ou GPT ?">
        <DocCallout type="decision" title="Choix">
          Gemini 1.5 Pro est le routage par défaut pour les traductions multilangues,
          en particulier vers les langues bantu.
        </DocCallout>
        <DocP>
          Tests empiriques sur 20 articles types :
        </DocP>
        <DocTable
          headers={["Langue cible", "Gemini 1.5 Pro", "Claude 3.5 Sonnet", "GPT-4"]}
          rows={[
            ["Anglais", "9/10", "10/10", "9/10"],
            ["Lingala", "8/10", "6/10", "5/10"],
            ["Swahili", "9/10", "7/10", "7/10"],
            ["Kisakata", "7/10", "4/10 (refuse souvent)", "5/10"],
            ["Tshiluba", "8/10", "5/10", "6/10"],
          ]}
        />
        <DocP>
          Gemini a clairement été entraîné sur plus de données africaines. Pour les
          langues bantu, c'est lui qui passe.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Préservation du glossaire">
        <DocP>
          Certains termes ne doivent pas être traduits : <em>Ngongo</em>,{" "}
          <em>Mboka</em>, <em>Likonde</em>. Le prompt Gemini contient un glossaire
          explicite avec instructions de conservation.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Synthèse vocale (Auto Voix)" eyebrow="IA">
      <DocP>
        Bouton « Auto Voix » dans le header de l'éditeur → appel à{" "}
        <DocInline>/api/admin/ai/voice</DocInline> qui utilise Gemini Voice
        Synthesis. Le fichier MP3 résultant est stocké et lié à l'article via{" "}
        <DocInline>has_narrator = true</DocInline>.
      </DocP>
      <DocList
        items={[
          <>Voix masculine grave par défaut, ton narratif (style « conteur »).</>,
          <>Génération en arrière-plan, ~30s pour un article de 1000 mots.</>,
          <>L'admin doit toujours sauvegarder l'article après génération pour persister <DocInline>has_narrator</DocInline>.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Sérialisation JSONB et casts en TypeScript">
        <DocP>
          Postgres renvoie le JSONB tel quel, mais TypeScript ne peut pas inférer la
          forme. Le pattern <DocInline>article.content[lang] as ContentBlock[]</DocInline>{" "}
          est utilisé partout — c'est la seule façon propre de typer.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Mode bascule text↔blocks et perte de données">
        <DocP>
          Le toggle <DocInline>text ↔ blocks</DocInline> tente de convertir, mais la
          conversion blocks→text est lossy (un image block devient juste un{" "}
          <DocInline>{`![](url)`}</DocInline>). Avertissement utilisateur ajouté avant
          la bascule.
        </DocP>
      </DocSubsection>

      <DocSubsection title="React Hook Form + Zod imbriqués">
        <DocP>
          Validation des champs simples (titre, slug) via Zod. Validation des blocs
          imbriqués déléguée à des helpers manuels — Zod sur des structures profondes
          devient vite illisible.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de versioning des articles (l'historique est perdu à chaque save).</>,
          <>Pas d'édition collaborative (deux admins en édition = dernier qui save écrase).</>,
          <>Pas d'embed YouTube/SoundCloud comme bloc dédié.</>,
        ]}
      />
    </DocSection>
  </>
);
