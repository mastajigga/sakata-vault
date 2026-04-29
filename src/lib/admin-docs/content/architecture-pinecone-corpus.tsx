import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-pinecone-corpus",
  title: "Cerveau Sakata — Corpus Pinecone unifié",
  subtitle:
    "Index `sakata` (768 dim, multilingual-e5-base) avec 1607 vecteurs répartis en 4 namespaces : sources externes, articles, livres internes et forums scrappés.",
  category: "architecture",
  order: 7,
  readTime: 8,
  updatedAt: "2026-04-29",
  author: "Direction Sakata",
  tags: ["pinecone", "corpus", "embeddings", "rag", "ingestion"],
  summary:
    "Cartographie complète du corpus existant, scripts d'ingestion intelligente, pipeline OCR pour PDFs scannés (Gemini/Claude/OpenAI), et plan d'extension via scraping Facebook.",
};

export const Content = () => (
  <>
    <DocLead>
      Le « Cerveau Sakata » est l'index Pinecone qui agrège toutes les sources
      de connaissance — livres ethnographiques, articles publiés, forums
      diaspora, futurs transcripts de Veillée Numérique. Toute production
      d'article peut s'appuyer sur cette mémoire vectorielle pour suggérer
      sources et cohérence factuelle.
    </DocLead>

    <DocSection title="Configuration de l'index" eyebrow="Stack">
      <DocTable
        headers={["Élément", "Valeur"]}
        rows={[
          ["Index name", <DocInline>sakata</DocInline>],
          ["Cloud provider", "AWS us-east-1 (serverless)"],
          ["Dimension", "768"],
          ["Métrique", "cosine"],
          ["Modèle d'embedding", <DocInline>intfloat/multilingual-e5-base</DocInline>],
          ["Préfixe E5 documents", <DocInline>passage:</DocInline>],
          ["Préfixe E5 requêtes", <DocInline>query:</DocInline>],
          ["Total vecteurs", "1607 (au 2026-04-29)"],
          ["Chunking", "500 mots, overlap 50"],
        ]}
      />
      <DocCallout type="decision" title="Pourquoi 768 et pas 3072 ?">
        <DocP>
          <DocInline>multilingual-e5-base</DocInline> (768 dim) est :
        </DocP>
        <DocList items={[
          <>Excellent en multilingue : français, kisakata, lingala, swahili, flamand, latin.</>,
          <>10× plus économique en stockage que <DocInline>text-embedding-3-large</DocInline>.</>,
          <>Open source — pas de dépendance OpenAI pour l'indexation initiale.</>,
          <>Suffisant en qualité pour le corpus Sakata (validé sur 1500+ chunks).</>,
        ]} />
        Migrer vers 3072 dim plus tard est possible mais coûterait : re-embed total + Pinecone plus cher.
      </DocCallout>
    </DocSection>

    <DocSection title="Organisation par namespaces" eyebrow="Structure">
      <DocTable
        headers={["Namespace", "Vecteurs", "Contenu"]}
        rows={[
          [<DocInline>__default__</DocInline>, "1554", "Sources externes brutes : PDFs académiques, OCR de scans"],
          [<DocInline>sakata</DocInline>, "43", "Articles publiés sur sakata-basakata.com (chunks)"],
          [<DocInline>iluo_livres_site</DocInline>, "9", "Mini-livres internes (Mboka, Origines, Épopée)"],
          [<DocInline>iluo_forums</DocInline>, "1", "Posts Facebook scrappés (test initial validé)"],
        ]}
      />
      <DocCallout type="info" title="Pourquoi des namespaces et pas un metadata field ?">
        Les namespaces Pinecone offrent : isolation des index, query par namespace
        natif, possibilité future de facturation/quotas séparés, et migration
        plus simple si on veut sortir une catégorie.
      </DocCallout>
    </DocSection>

    <DocSection title="Sources déjà indexées (livres)" eyebrow="Bibliothèque">
      <DocTable
        headers={["Livre", "Statut"]}
        rows={[
          [<><strong>The Sakata Society in the Congo</strong> — Roger Vanzila Munsi</>, "✅ Référence ethnographique majeure"],
          [<><strong>L'Évangélisation du Mai-Ndombe</strong> — Mpia Bekina (2009)</>, "✅ Thèse philosophie/théologie"],
          [<><strong>Religie en magie onder de Basakata</strong> — Van Everbroeck (1952, flamand)</>, "✅ Religion et magie chez les Basakata"],
          [<><strong>Sakata profil DICE</strong></>, "✅ Dictionary of Indigenous Cultural Expressions"],
          [<><strong>Formation Récentes de Sociétés Secrètes au Congo Belge</strong></>, "✅ OCR manuel ingéré"],
          [<>MEPST programmes scolaires (3e/4e/5e Sec MATH + PE7/PE8 + Primaire)</>, "✅ Curriculum officiel RDC"],
          [<><strong>Phonologie de la langue sakata</strong> — Thèse 1987</>, "🟡 PDF scanné, OCR à faire"],
          [<><strong>Formations Récentes de sociétés secrètes</strong> (PDF scanné)</>, "🟡 PDF scanné, OCR à faire"],
        ]}
      />
    </DocSection>

    <DocSection title="Pipeline d'ingestion" eyebrow="Scripts">
      <DocSubsection title="Scripts disponibles">
        <DocList items={[
          <><DocInline>scripts/ingest_books_smart.py</DocInline> — Détecte les sources déjà indexées et n'ingère que les manquantes (idempotent)</>,
          <><DocInline>scripts/vectorize_sakata.py</DocInline> — Pipeline initial complet (réindexation totale)</>,
          <><DocInline>scripts/batch_index_articles.py</DocInline> — Articles publiés vers namespace <DocInline>sakata</DocInline></>,
          <><DocInline>scripts/batch_index_forum.py</DocInline> — Forum/Facebook vers namespace <DocInline>iluo_forums</DocInline></>,
          <><DocInline>scripts/batch_index_pages.py</DocInline> — Pages internes vers <DocInline>iluo_livres_site</DocInline></>,
          <><DocInline>scripts/pinecone_stats.mjs</DocInline> — Stats live de l'index</>,
          <><DocInline>scripts/pinecone_inspect.mjs</DocInline> — Échantillonnage par namespace pour voir le contenu</>,
        ]} />
      </DocSubsection>

      <DocSubsection title="Format de chunks">
        <DocCode lang="python">{`{
  "id": f"{filename}__p{page}__c{chunk_index}",  # ASCII-safe
  "values": [...]  # 768-dim embedding (passage: prefix)
  "metadata": {
    "source": "filename.pdf",
    "directory": "Folder Name",
    "page": 42,
    "chunk_index": 0,
    "text": "...first 1000 chars for retrieval display...",
  }
}`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Pipeline OCR pour PDFs scannés" eyebrow="3 fournisseurs">
      <DocCallout type="warning" title="Pourquoi 3 scripts OCR ?">
        Chaque fournisseur IA a un blocage différent sur les vieux textes
        ethnographiques. Avoir les 3 permet de basculer sans refactor.
      </DocCallout>

      <DocTable
        headers={["Script", "Modèle", "Coût (200 pages)", "Limitation"]}
        rows={[
          [<DocInline>ocr_pdf_gemini.py</DocInline>, "gemini-2.5-pro", "~$0.02", "FinishReason.RECITATION sur académique"],
          [<DocInline>ocr_pdf_claude.py</DocInline>, "claude-haiku-4-5", "~$0.30", "Pas de blocage, requiert crédit"],
          [<DocInline>ocr_pdf_openai.py</DocInline>, "gpt-4o-mini", "~$0.14", "Quota dépendant du tier"],
        ]}
      />

      <DocSubsection title="Format de sortie unifié">
        <DocCode>{`# OCR via <model>
# Source: <filename>.pdf

--- PAGE 1 ---

[texte transcrit fidèlement]

--- PAGE 2 ---

[texte transcrit fidèlement]

...`}</DocCode>
        <DocP>
          Le fichier <DocInline>.ocr.txt</DocInline> est ensuite ingéré
          automatiquement par <DocInline>ingest_books_smart.py</DocInline>
          (détection du format <DocInline>--- PAGE N ---</DocInline>).
        </DocP>
      </DocSubsection>

      <DocSubsection title="Reprise (resume) automatique">
        <DocP>
          Si l'OCR plante (rate limit, crédit), relancer la même commande
          reprend là où ça s'était arrêté. Le script lit le fichier .ocr.txt
          existant, identifie les pages déjà OCR'd via les markers
          <DocInline>--- PAGE N ---</DocInline>, et continue.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'utilisation runtime" eyebrow="RAG">
      <DocSubsection title="Recherche sémantique côté public">
        <DocCode lang="typescript">{`// Côté API : /api/articles/search
// Le user tape "rituel d'initiation"
// → embed avec prefix "query:"
// → query Pinecone namespace 'sakata' (articles publiés)
// → ranger par score, retourner top 10

import { getPineconeIndex } from "@/lib/pinecone/client";

const index = getPineconeIndex();
const results = await index
  .namespace("sakata")
  .query({
    vector: queryEmbedding,
    topK: 10,
    includeMetadata: true,
    filter: { lang: "fr" },  // optional metadata filter
  });`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Assistance rédaction côté admin">
        <DocP>
          Dans l'éditeur d'article, à chaque sauvegarde du brouillon :
        </DocP>
        <DocList ordered items={[
          <>Embed du brouillon (prefix <DocInline>query:</DocInline>).</>,
          <>Query <DocInline>__default__</DocInline> namespace (livres académiques).</>,
          <>Top 5 chunks affichés en panneau latéral comme « Sources liées ».</>,
          <>Bouton « Citer » insère le passage avec citation source/page.</>,
        ]} />
      </DocSubsection>
    </DocSection>

    <DocSection title="Extension future" eyebrow="Roadmap">
      <DocList items={[
        <><strong>Scraping Facebook en masse</strong> via Playwright (groupes diaspora) → namespace <DocInline>iluo_forums</DocInline>.</>,
        <><strong>Veillée Numérique</strong> : transcripts Whisper → namespace dédié <DocInline>veillees</DocInline>.</>,
        <><strong>Notes admin</strong> : indexation des notes personnelles comme contexte privé pour l'auteur.</>,
        <><strong>Cross-référencement automatique</strong> : à chaque publication d'article, suggérer 3 articles existants liés sémantiquement.</>,
        <><strong>Migration vers 3072 dim</strong> : si la qualité 768 devient limitante (probablement pas avant 10k+ chunks).</>,
      ]} />
    </DocSection>

    <DocSection title="Sécurité & confidentialité" eyebrow="Bonnes pratiques">
      <DocList items={[
        <>Clé Pinecone (<DocInline>PINECONE_API_KEY</DocInline>) jamais exposée côté client.</>,
        <>Tous les appels embed/query passent par des API routes Next.js avec auth.</>,
        <>Le namespace <DocInline>__default__</DocInline> contient des œuvres sous copyright — usage interne uniquement (pas de re-publication verbatim).</>,
        <>Quand un chunk est cité publiquement, toujours afficher source + page + auteur.</>,
        <>Sensibilité culturelle : les textes ethnographiques coloniaux contiennent parfois des biais — le prompt système des assistants IA doit explicitement reformuler en respectant la dignité Sakata.</>,
      ]} />
    </DocSection>
  </>
);
