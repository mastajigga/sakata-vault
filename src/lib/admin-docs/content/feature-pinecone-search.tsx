import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-pinecone-search",
  title: "Recherche Sémantique — Pinecone",
  subtitle:
    "Indexation vectorielle des articles pour recherche par sens et non par mot-clé exact, avec fallback ilike traditionnel.",
  category: "feature",
  order: 9,
  readTime: 6,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["pinecone", "embeddings", "search", "semantic"],
  summary:
    "Stack Pinecone + OpenAI embeddings pour la recherche par sens, et garde-fous SQL contre l'injection LIKE.",
};

export const Content = () => (
  <>
    <DocLead>
      Un utilisateur cherche « rituels d'initiation à la maturité ». Aucun article ne
      contient cette phrase exacte. Mais l'article « Les passages — du jeune au
      Likonde » répond précisément. La recherche par mots-clés échoue ; la recherche
      sémantique trouve.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        À chaque publication d'article, son contenu est <strong>vectorisé</strong>{" "}
        (transformé en un embedding de 3 072 dimensions par OpenAI), puis stocké dans
        un index Pinecone. Une requête utilisateur est elle-même vectorisée, et
        Pinecone retourne les K articles les plus proches dans l'espace sémantique.
      </DocP>
    </DocSection>

    <DocSection title="Pourquoi Pinecone et pas pgvector ?" eyebrow="Décision">
      <DocCallout type="decision" title="Choix">
        Pinecone (service managé) plutôt que pgvector (extension Postgres dans Supabase).
      </DocCallout>
      <DocTable
        headers={["Critère", "pgvector (Supabase)", "Pinecone managé", "Verdict"]}
        rows={[
          ["Coût", "Gratuit (inclus)", "70$/mois starter, gratuit < 5M vectors", "pgvector"],
          ["Performance < 10k vectors", "Très bonne", "Très bonne", "Égal"],
          ["Performance > 100k vectors", "Acceptable", "Excellente", "Pinecone"],
          ["Filtres metadata", "SQL natif", "API spécifique", "pgvector pour le confort"],
          ["Update sans downtime", "OK", "Excellent (versioning)", "Pinecone"],
          ["Pour Sakata aujourd'hui", "—", "—", "Pinecone — pour la scalabilité Veillée"],
        ]}
      />
      <DocP>
        À 30 articles, pgvector ferait largement l'affaire. Mais avec 500 veillées
        prévues d'ici 1 an et chaque veillée pouvant produire 5-10 chunks, on parle de
        plusieurs milliers de vectors. Pinecone est prévu pour ce scaling.
      </DocP>
    </DocSection>

    <DocSection title="Architecture" eyebrow="Pipeline">
      <DocSubsection title="Indexation à la publication">
        <DocCode lang="typescript">{`// À chaque article.status = "published"
async function indexArticle(article: Article) {
  // 1. Aplatir tout le contenu en texte
  const text = flattenBlocks(article.content.fr);

  // 2. Embedding via OpenAI
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text.slice(0, 8000),  // Cap input
  });

  // 3. Upsert dans Pinecone
  await pinecone.index("sakata-articles").upsert([
    {
      id: article.id,
      values: embedding.data[0].embedding,
      metadata: {
        slug: article.slug,
        title: article.title.fr,
        category: article.category,
        published_at: article.published_at,
      },
    },
  ]);
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Recherche">
        <DocCode lang="typescript">{`async function semanticSearch(query: string, k = 10) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: query,
  });

  const results = await pinecone.index("sakata-articles").query({
    vector: embedding.data[0].embedding,
    topK: k,
    includeMetadata: true,
  });

  return results.matches;
}`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Fallback : recherche ilike traditionnelle" eyebrow="Robustesse">
      <DocP>
        Si Pinecone est down, on dégrade vers une recherche{" "}
        <DocInline>ilike</DocInline> Postgres. Moins pertinente, mais toujours quelque
        chose. Implémentée dans <DocInline>/api/articles/search</DocInline>.
      </DocP>
    </DocSection>

    <DocSection title="Sécurité — injection LIKE" eyebrow="Sécurité">
      <DocCallout type="warning" title="Bug évité (audit cache v2.3)">
        L'utilisateur peut envoyer <DocInline>%</DocInline> ou <DocInline>_</DocInline>{" "}
        dans sa requête, qui sont des wildcards LIKE. Sans échappement, on pourrait
        forcer la DB à scanner toute la table.
      </DocCallout>
      <DocCode lang="typescript">{`function escapeLike(s: string): string {
  return s.replace(/[%_\\\\]/g, "\\\\$&");
}

// Whitelist langue avant interpolation
const ALLOWED_LANGS = ["fr", "en", "skt", "lin", "swa", "tsh"] as const;
if (!ALLOWED_LANGS.includes(lang)) {
  return NextResponse.json({ error: "Invalid lang" }, { status: 400 });
}

// Toujours escaper avant LIKE
const safeQuery = \`%\${escapeLike(query)}%\`;
const { data } = await supabase
  .from("articles")
  .select()
  .ilike(\`title->\${lang}\`, safeQuery);`}</DocCode>
    </DocSection>

    <DocSection title="Recherche hybride — état actuel et futur" eyebrow="Évolution">
      <DocP>
        Aujourd'hui, recherche sémantique <strong>OU</strong> recherche textuelle.
        Idéal : combiner les deux (« hybrid search ») avec re-ranking par un modèle
        cross-encoder. Roadmap Q3 2026.
      </DocP>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Coût des embeddings">
        <DocP>
          OpenAI <DocInline>text-embedding-3-large</DocInline> : 0.13$/M tokens. Un
          article de 2 000 mots ≈ 3 000 tokens ≈ 0.0004$. Soit 0.40$ pour 1 000
          articles. Négligeable, mais à monitorer si la Veillée Numérique multiplie
          le volume par 100.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Pinecone latency aux États-Unis">
        <DocP>
          Index hébergé en us-east-1 par défaut → latence ~200ms depuis Bruxelles, ~400ms
          depuis Kinshasa. Acceptable pour la recherche, douloureux pour l'autocomplete
          en temps réel.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Recherche sémantique non exposée dans l'UI publique aujourd'hui (à débloquer Q2 2026).</>,
          <>Embeddings uniquement sur la version FR (pas par langue).</>,
          <>Pas de re-ranking — le top 10 brut peut contenir du bruit.</>,
        ]}
      />
    </DocSection>
  </>
);
