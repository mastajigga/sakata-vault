import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-bulk-import-ethnographique",
  title: "Plan d'implémentation : Bulk Import Ethnographique",
  subtitle:
    "Pipeline d'import automatisé : PDFs académiques → articles structurés Sakata via Gemini, avec queue de validation humaine.",
  category: "roadmap",
  order: 7,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["bulk-import", "gemini", "pdf-parsing", "content"],
  summary:
    "Comment passer de 30 articles à 300 en 3 semaines en automatisant l'extraction structurée depuis les PDFs ethnographiques existants.",
};

export const Content = () => (
  <>
    <DocLead>
      Il existe ~50 thèses, articles académiques et rapports ethnographiques publiés
      sur les Sakata, principalement entre 1950 et 1990. Beaucoup sont accessibles en
      PDF mais illisibles pour le grand public (jargon, structure académique).
      L'import automatisé peut les transformer en articles encyclopédiques en
      quelques heures, là où la rédaction manuelle prendrait des mois.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi">
      <DocP>
        Sakata.com a aujourd'hui ~30 articles. Pour atteindre une masse critique
        SEO/utilisateur, il faut viser <strong>300+ articles</strong> en 3 mois. Trois
        approches possibles :
      </DocP>
      <DocTable
        headers={["Approche", "Volume potentiel", "Coût", "Qualité"]}
        rows={[
          ["Rédaction manuelle (auteurs)", "5/semaine", "200€/article", "Excellente"],
          ["Crowdsourcing diaspora", "10-30/semaine", "0€ + animation", "Variable"],
          ["Bulk import IA + validation", "100/semaine", "10€/article", "Bonne après edit"],
        ]}
      />
      <DocCallout type="decision" title="Choix">
        <strong>Combiner les trois</strong>. Le bulk import donne le volume rapide pour
        la SEO, l'humain reste pour les articles signature.
      </DocCallout>
    </DocSection>

    <DocSection title="Stack technique" eyebrow="Pipeline">
      <DocSubsection title="Étapes du pipeline">
        <DocList
          ordered
          items={[
            <><strong>Ingestion</strong> — Upload PDF dans bucket <DocInline>academic-sources</DocInline>.</>,
            <><strong>Parsing</strong> — Extraction texte via <DocInline>pdf-parse</DocInline> ou <DocInline>pdfjs-dist</DocInline>.</>,
            <><strong>Découpage</strong> — Split en sections logiques (chapitres, sous-titres).</>,
            <><strong>Structuration IA</strong> — Gemini 1.5 Pro convertit chaque section en blocs <DocInline>ContentBlock</DocInline>.</>,
            <><strong>Métadonnées IA</strong> — Tags, catégorie, résumé, slug auto-généré.</>,
            <><strong>Citation source</strong> — Auteur, année, ISBN/DOI ajoutés en bas d'article.</>,
            <><strong>File de validation</strong> — État <DocInline>imported</DocInline>, admin valide ou rejette.</>,
            <><strong>Publication</strong> — Une fois validé, status <DocInline>published</DocInline>.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="PDF parsing — choix">
        <DocTable
          headers={["Lib", "Pour", "Contre", "Verdict"]}
          rows={[
            ["pdf-parse (Node)", "Simple, sync", "Layout perdu (multi-colonnes mal géré)", "🟡 OK pour textes simples"],
            ["pdfjs-dist (Mozilla)", "Vrai layout, positions", "Plus complexe", "✅ Pour PDFs académiques"],
            ["Unstructured.io API", "Excellent ML-based", "Service tiers payant 0.01$/page", "🟡 Si volume justifie"],
            ["Tesseract OCR", "Pour PDFs scannés", "Lent, qualité variable", "🟡 Backup pour vieux docs"],
          ]}
        />
        <DocCallout type="decision" title="Choix">
          <DocInline>pdfjs-dist</DocInline> par défaut, fallback Tesseract pour les
          scans. Unstructured.io si on dépasse 1 000 PDFs/mois (peu probable).
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Prompt Gemini structuré">
        <DocCode lang="typescript">{`const STRUCTURING_PROMPT = \`
Tu es un éditeur encyclopédique pour Sakata.com, plateforme du patrimoine
culturel Sakata (RDC). Voici un extrait d'un texte académique :

---
\${textChunk}
---

Convertis ce texte en article web grand public en respectant ces règles :
1. Garder TOUS les faits, dates, noms propres
2. Reformuler le jargon académique en langage clair
3. Préserver les marqueurs culturels (Ngongo, Mboka, Likonde sans traduire)
4. Découper en blocs : { type: "heading"|"text"|"quote", body: string }
5. Maximum 8 blocs

Retourne du JSON strictement conforme au schéma ContentBlock[].
\`;

const result = await gemini.generateContent({
  contents: [{ role: "user", parts: [{ text: STRUCTURING_PROMPT }] }],
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: ContentBlocksSchema,  // Garantie de validité
  },
});`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Queue de validation humaine" eyebrow="Qualité">
      <DocCallout type="warning" title="Non négociable">
        Aucun article généré par IA n'est publié sans validation humaine. Sakata.com
        n'est pas un slop SEO — c'est une référence culturelle.
      </DocCallout>

      <DocSubsection title="Interface admin">
        <DocList
          items={[
            <>Page <DocInline>/admin/imports</DocInline> : liste des articles en attente avec source PDF associée.</>,
            <>Diff side-by-side : extrait original PDF vs. article généré.</>,
            <>Actions : approuver, rejeter, éditer puis approuver.</>,
            <>Métadata édition : tags, catégorie, premium ou pas.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Critères d'acceptation">
        <DocList
          items={[
            <>Aucune erreur factuelle vs. PDF source.</>,
            <>Cohérence ton avec le reste de Sakata.com (sage-basakata).</>,
            <>Source clairement citée en bas d'article.</>,
            <>Si {`>`} 30% à reformuler : rejet et re-prompting.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'exécution — 3 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — Pipeline tech (1 semaine)">
        <DocList
          ordered
          items={[
            <>Bucket Storage <DocInline>academic-sources</DocInline> + RLS admin.</>,
            <>Edge function <DocInline>process-pdf-import</DocInline> avec pipeline complet.</>,
            <>Migration table <DocInline>article_imports</DocInline> (état + lien source).</>,
            <>Tests sur 3 PDFs représentatifs.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Interface validation (1 semaine)">
        <DocList
          ordered
          items={[
            <>UI <DocInline>/admin/imports</DocInline> avec liste, filtres, queue.</>,
            <>Diff viewer side-by-side (PDF embed + article structuré).</>,
            <>Actions approve/reject/edit avec workflow complet.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Bulk run (1 semaine)">
        <DocList
          ordered
          items={[
            <>Import des 50 PDFs académiques accumulés.</>,
            <>Validation manuelle quotidienne (10/jour pendant la semaine).</>,
            <>Mesure qualité : % articles approuvés vs rejetés.</>,
            <>Itération sur le prompt si {`<`} 70% acceptation.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Coût estimé" eyebrow="Budget">
      <DocTable
        headers={["Source de coût", "Volume", "Coût"]}
        rows={[
          ["Gemini structuration", "300 articles × 8 chunks × 0.02$", "≈ 50€"],
          ["Pinecone embeddings", "300 × 0.001$", "≈ 0.30€"],
          ["Storage PDFs (bucket)", "50 PDFs × 5 MB", "Inclus plan actuel"],
          ["Temps validation humain", "300 articles × 5 min", "25h × 30€/h = 750€"],
          ["Total", "—", "≈ 800€ pour 300 articles"],
        ]}
      />
      <DocCallout type="success" title="Comparaison">
        Rédaction manuelle équivalente : 300 × 200€ = <strong>60 000€</strong>. Bulk
        import : <strong>800€</strong>. Soit <strong>75× moins cher</strong> pour une
        qualité « bonne après edit ».
      </DocCallout>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Hallucinations (faits inventés)", "Moyenne", "Très haut", "Validation humaine + prompt strict (« n'invente jamais »)"],
          ["Sources sous copyright", "Élevée", "Haut", "Whitelist de sources : domaine public, OA, autorisation explicite"],
          ["Ton trop académique", "Moyenne", "Moyen", "Few-shot examples dans le prompt (montrer 3 articles existants)"],
          ["Slop SEO si trop de volume", "Moyenne", "Très haut", "Plafond 100 articles/mois, mix avec contenu original"],
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>Sprint 3 :</strong> 50 articles validés, taux acceptation {`>`} 70%.</>,
          <><strong>3 mois :</strong> 300 articles publiés, trafic organique × 5.</>,
          <><strong>6 mois :</strong> Ratio 70% bulk-import / 30% rédigé manuellement, qualité maintenue.</>,
        ]}
      />
    </DocSection>
  </>
);
