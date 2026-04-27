import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-ai-orchestration",
  title: "Orchestration IA — Gemini, Claude, OpenAI",
  subtitle:
    "Stratégie de routage entre fournisseurs d'IA en fonction de la tâche, et gestion des coûts à l'échelle.",
  category: "feature",
  order: 8,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["ai", "gemini", "claude", "cost-optimization"],
  summary:
    "Quel modèle pour quelle tâche, pourquoi pas tout sur un seul, et comment garder les coûts sous contrôle.",
};

export const Content = () => (
  <>
    <DocLead>
      Sakata.com utilise trois fournisseurs d'IA : Anthropic (Claude), Google (Gemini),
      OpenAI. Pas par mode mais par stratégie. Chaque modèle a ses forces, ses
      faiblesses, et son prix. Le routage intelligent peut diviser les coûts par
      trois sans perdre en qualité.
    </DocLead>

    <DocSection title="Pourquoi pas tout sur un seul ?" eyebrow="Décision">
      <DocCallout type="decision" title="Choix">
        Routage multi-providers, pas de monoculture IA.
      </DocCallout>
      <DocList
        items={[
          <><strong>Robustesse</strong> : si Anthropic a un outage, Sakata continue de fonctionner sur Gemini.</>,
          <><strong>Spécialisation</strong> : Gemini est meilleur sur les langues bantu, Claude sur la voix narrative, GPT sur le tooling structuré.</>,
          <><strong>Coût</strong> : faire tourner Claude Opus 4 pour traduire un titre de 5 mots = gaspillage. Gemini Flash le fait pour 1/100ᵉ du prix.</>,
          <><strong>Pas de vendor lock</strong> : si un provider change ses prix de 10×, on peut migrer en 1 jour.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Matrice de routage" eyebrow="Stratégie">
      <DocTable
        headers={["Tâche", "Modèle retenu", "Raison"]}
        rows={[
          ["Voix narrative ancestrale (sage-basakata)", "Claude Sonnet 4.5", "Ton et nuance supérieurs"],
          ["Traduction multilingue (FR ↔ langues bantu)", "Gemini 1.5 Pro", "Couverture africaine supérieure"],
          ["Synthèse vocale (TTS)", "Gemini Voice", "Qualité voix + multilingue natif"],
          ["Chat sémantique encyclopédie", "Gemini 1.5 Pro", "Contexte long, RAG-friendly"],
          ["Tagging / structuration JSON", "Gemini 1.5 Flash", "10× moins cher, JSON output fiable"],
          ["Embedding pour Pinecone", "OpenAI text-embedding-3-large", "Meilleur état de l'art"],
          ["Transcription audio (futur Veillée)", "Whisper API (OpenAI)", "Standard de marché"],
          ["Modération automatique", "Claude Haiku 4.5", "Petit, rapide, raisonnable"],
        ]}
      />
    </DocSection>

    <DocSection title="Variables d'environnement" eyebrow="Configuration">
      <DocCode caption=".env.local">{`# Routage par défaut (override possible par tâche)
LLM_PROVIDER=claude

# API keys (rotables)
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AI...
OPENAI_API_KEY=sk-proj-...
ALIBABA_QWEN_API_KEY=sk-...    # Backup futur

# Limites de sécurité
AI_MAX_TOKENS_PER_USER_DAY=50000
AI_MAX_COST_PER_USER_MONTH_USD=2`}</DocCode>
    </DocSection>

    <DocSection title="Pattern d'appel typique" eyebrow="Code">
      <DocCode lang="typescript">{`// src/lib/ai/route.ts (simplifié)
async function callLLM({
  task,             // "translate" | "narrate" | "tag" | ...
  prompt,
  context,
  userId,
}: LLMRequest) {

  // 1. Vérifier les quotas
  await assertWithinQuota(userId);

  // 2. Choisir le provider
  const provider = ROUTING_TABLE[task];

  // 3. Logger l'activité (audit + analytics)
  await logActivity(userId, "ai_call", {
    task,
    provider,
    timestamp: Date.now(),
  });

  // 4. Appeler avec retry & fallback
  try {
    return await provider.call({ prompt, context });
  } catch (err) {
    if (err.code === "RATE_LIMIT") {
      return await FALLBACK_PROVIDER[task].call({ prompt, context });
    }
    throw err;
  }
}`}</DocCode>
    </DocSection>

    <DocSection title="Coûts mensuels actuels (estimation)" eyebrow="Budget">
      <DocTable
        headers={["Provider", "Volume mensuel actuel", "Coût USD"]}
        rows={[
          ["Anthropic (Claude Sonnet)", "~50k tokens output", "~3$"],
          ["Gemini 1.5 Pro", "~200k tokens", "~5$"],
          ["Gemini Voice", "~30 articles narrés × 1500 chars", "~2$"],
          ["OpenAI (embeddings)", "~50 articles vectorisés", "~0.5$"],
          ["Total estimé", "—", "≈ 10-12 $/mois"],
        ]}
      />
      <DocCallout type="info" title="Projection à 1 000 articles + 500 veillées/mois">
        Coût projeté : <strong>≈ 150 $/mois</strong>. Reste largement amortissable
        avec 30 abonnés Premium.
      </DocCallout>
    </DocSection>

    <DocSection title="Activity logging structuré" eyebrow="Observabilité">
      <DocP>
        Chaque appel IA est loggé dans la table <DocInline>activity_log</DocInline>{" "}
        avec metadata typée (provider, task, tokens, latency, cost). Permet :
      </DocP>
      <DocList
        items={[
          <>Audit des coûts par utilisateur, par feature.</>,
          <>Détection d'abus (un user qui consomme 10× la moyenne).</>,
          <>Analyse de qualité (corrélation user-rating ↔ provider).</>,
          <>Optimisation A/B : tester deux providers sur la même tâche.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="JSON output fragile sur Claude">
        <DocP>
          Claude est excellent en prose mais parfois capricieux quand on lui demande
          du JSON strict. Solution : passer à Gemini 1.5 Pro qui supporte le mode
          <DocInline>responseSchema</DocInline> natif (garantie de validité).
        </DocP>
      </DocSubsection>

      <DocSubsection title="Coûts qui dérapent silencieusement">
        <DocP>
          Un test mal écrit peut faire 1 000 appels Claude Opus en boucle.
          Mitigation : quota strict côté serveur (par user et par jour) qui retourne
          429 si dépassé.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Latence Gemini sur grandes contextes">
        <DocP>
          Gemini 1.5 Pro avec 100k tokens en input prend 30+ secondes. Pour
          l'expérience interactive, on découpe en chunks ou on streame.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de fine-tuning maison (kisakata pourrait en bénéficier).</>,
          <>Pas encore de A/B testing automatisé sur les providers.</>,
          <>Pas de cache cross-user (deux users qui demandent la même chose paient deux fois).</>,
        ]}
      />
    </DocSection>
  </>
);
