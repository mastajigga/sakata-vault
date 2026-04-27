import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-api-publique-chercheurs",
  title: "Plan d'implémentation : API Publique Chercheurs",
  subtitle:
    "API publique structurée pour les universités et chercheurs, avec OAuth, rate limiting, pricing tiers et exigences de citation académique.",
  category: "roadmap",
  order: 12,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["api", "oauth", "research", "monetization"],
  summary:
    "Comment ouvrir le corpus Sakata aux chercheurs en monétisant l'usage tout en préservant la qualité — auth, rate limit, et citation tracking.",
};

export const Content = () => (
  <>
    <DocLead>
      Une fois Sakata.com riche de 1 000+ articles, 500 veillées orales et un arbre
      généalogique étendu, ce corpus devient un actif de recherche unique. Une API
      publique payante permet aux universités de l'exploiter, génère des revenus
      récurrents, et ancre Sakata comme infrastructure académique de référence.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi">
      <DocList
        items={[
          <><strong>Inalco, ULB, KU Leuven, MRAC Tervuren</strong> ont des chercheurs en linguistique bantu, anthropologie centrale-africaine, ethnomusicologie qui ont besoin de corpus structurés.</>,
          <><strong>Le scraping est leur alternative actuelle</strong> — fragile, partiel, parfois interdit par CGU.</>,
          <><strong>Sakata bénéficie aussi</strong> — citations académiques = légitimité = SEO + nouveaux articles cités.</>,
          <><strong>Modèle économique récurrent</strong> — Subscription B2B 50-500€/mois selon volume.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Stack technique" eyebrow="Architecture">
      <DocSubsection title="Authentification : API keys ou OAuth ?">
        <DocCallout type="decision" title="Choix">
          <strong>API keys</strong> pour le démarrage. OAuth uniquement si besoin
          d'accès à des données utilisateur (n'arrivera probablement jamais ici).
        </DocCallout>
        <DocList
          items={[
            <>Plus simple à implémenter et documenter.</>,
            <>Les chercheurs sont à l'aise avec curl + header.</>,
            <>Permet quotas par clé, révocation immédiate.</>,
            <>Évite la complexité OAuth dance qui n'apporte rien ici.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma DB">
        <DocCode lang="sql">{`CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_user_id UUID REFERENCES profiles(id),
  key_hash TEXT UNIQUE NOT NULL,        -- bcrypt(api_key)
  key_prefix TEXT NOT NULL,             -- 'sak_live_xyz...' (8 premiers chars visibles pour identification)
  tier TEXT NOT NULL,                   -- 'discovery', 'research', 'institution'
  status TEXT DEFAULT 'active',         -- active, suspended, revoked
  monthly_quota INT NOT NULL,           -- requêtes/mois
  monthly_used INT DEFAULT 0,           -- reset par cron mensuel
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ                -- abonnement annuel par défaut
);

CREATE TABLE api_request_logs (
  id BIGSERIAL PRIMARY KEY,
  api_key_id UUID REFERENCES api_keys(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT,
  response_time_ms INT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_logs_key_date
  ON api_request_logs(api_key_id, created_at);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Endpoints exposés">
        <DocTable
          headers={["Endpoint", "Description", "Tier minimal"]}
          rows={[
            ["GET /api/v1/articles", "Liste paginée des articles publiés", "discovery"],
            ["GET /api/v1/articles/:slug", "Détail article + traductions", "discovery"],
            ["GET /api/v1/articles/:slug/audio", "URL audio narration si disponible", "research"],
            ["GET /api/v1/veillees", "Liste des veillées publiques", "research"],
            ["GET /api/v1/veillees/:id", "Détail + transcript + traductions", "research"],
            ["GET /api/v1/veillees/:id/audio", "URL audio brut", "institution"],
            ["GET /api/v1/genealogy/persons", "Personnes publiques généalogie", "institution"],
            ["POST /api/v1/search/semantic", "Recherche sémantique Pinecone", "research"],
            ["GET /api/v1/glossary", "Glossaire termes culturels", "discovery"],
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Pricing tiers" eyebrow="Modèle économique">
      <DocTable
        headers={["Tier", "Prix mensuel", "Quota", "Endpoints"]}
        rows={[
          ["Discovery (gratuit)", "0€", "1 000 req/mois", "Articles publics seulement"],
          ["Research", "50€", "10 000 req/mois", "+ Audio + Veillées + Recherche sémantique"],
          ["Institution", "500€", "100 000 req/mois", "Tout + accès données privées sous contrat"],
          ["Custom", "Sur devis", "Illimité", "Bulk export, dump complet annuel, support dédié"],
        ]}
      />
      <DocCallout type="info" title="Stratégie">
        Le tier Discovery gratuit est crucial : permet aux chercheurs de tester avant
        de se battre pour un budget. Conversion attendue : 10-15% de Discovery →
        Research dans les 3 mois.
      </DocCallout>
    </DocSection>

    <DocSection title="Rate limiting" eyebrow="Sécurité">
      <DocSubsection title="Stratégie en couches">
        <DocList
          items={[
            <><strong>Quota mensuel</strong> : par clé, hard cap. Reset le 1er du mois.</>,
            <><strong>Burst limit</strong> : max 60 req/minute pour éviter les pics agressifs.</>,
            <><strong>Per-IP</strong> : 100 req/minute toutes API keys confondues (anti-DoS).</>,
          ]}
        />
        <DocCode lang="typescript">{`// Edge middleware Next.js
export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/api/v1/")) return;

  const apiKey = req.headers.get("X-API-Key");
  if (!apiKey) return new Response("Missing API key", { status: 401 });

  const keyData = await getApiKeyData(apiKey);
  if (!keyData || keyData.status !== "active") {
    return new Response("Invalid API key", { status: 403 });
  }

  // Quota mensuel
  if (keyData.monthly_used >= keyData.monthly_quota) {
    return new Response("Monthly quota exceeded", { status: 429 });
  }

  // Burst limit (Redis ou Upstash)
  const burst = await checkBurstLimit(apiKey);
  if (burst.exceeded) {
    return new Response("Rate limit exceeded", {
      status: 429,
      headers: { "Retry-After": String(burst.retryAfter) }
    });
  }

  // Logger la requête (async, non-bloquant)
  logRequest(keyData.id, req).catch(() => {});

  return NextResponse.next();
}`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Citation académique" eyebrow="Politique">
      <DocCallout type="warning" title="Exigence des Conditions d'Utilisation">
        Toute publication scientifique utilisant l'API Sakata doit citer la
        plateforme avec un identifiant DOI ou format spécifique.
      </DocCallout>

      <DocCode caption="Format de citation suggéré">{`Sakata.com (2027). Plateforme du patrimoine culturel Sakata.
Récupéré le DD/MM/YYYY de https://sakata.com/api
DOI: 10.5281/sakata.api.v1`}</DocCode>

      <DocList
        items={[
          <>Demande d'enregistrer un DOI via Zenodo (gratuit pour open data).</>,
          <>Page <DocInline>/api/cite</DocInline> qui génère la citation au format BibTeX, APA, MLA.</>,
          <>Tracking des publications citantes via Google Scholar alerts → audit annuel.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Documentation API" eyebrow="DX">
      <DocList
        items={[
          <>Site dédié <DocInline>docs.sakata.com</DocInline> ou <DocInline>/api/docs</DocInline>.</>,
          <>OpenAPI 3.0 spec auto-générée depuis le code.</>,
          <>Playground interactif (essai live d'endpoints avec clé Discovery).</>,
          <>Exemples curl, Python, R, JavaScript.</>,
          <>Notes éthiques : sensibilité culturelle, données privées, consentement.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Plan d'exécution — 4 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — API keys & auth (1 semaine)">
        <DocList
          ordered
          items={[
            <>Migration tables + RLS.</>,
            <>UI admin pour créer/révoquer clés.</>,
            <>Middleware Next.js auth + rate limit.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Endpoints v1 (1 semaine)">
        <DocList
          ordered
          items={[
            <>Implémenter les 9 endpoints catalogués.</>,
            <>Pagination, filtres, formats JSON cohérents.</>,
            <>Tests d'intégration avec différents tiers.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Documentation & playground (1 semaine)">
        <DocList
          ordered
          items={[
            <>OpenAPI auto-gen.</>,
            <>Site doc avec MDX.</>,
            <>Playground interactif.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 4 — Stripe billing & onboarding (1 semaine)">
        <DocList
          ordered
          items={[
            <>Subscriptions Stripe pour tiers Research/Institution.</>,
            <>Self-service signup avec génération clé immédiate (Discovery).</>,
            <>Demande personnalisée pour Institution (form admin valide).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Scraping malgré l'API (clé revendue)", "Moyenne", "Moyen", "Pattern detection (User-Agent + heatmap), révocation immédiate"],
          ["Données sensibles exposées", "Moyenne", "Très haut", "Endpoint privés gardés derrière contrat signé"],
          ["Faible adoption (chercheurs préfèrent scraping)", "Élevée", "Moyen", "Tier Discovery gratuit + outreach actif universités"],
          ["Coût infra dépassé par usage", "Faible", "Moyen", "Cache agressif + quotas hard"],
        ]}
      />
    </DocSection>

    <DocSection title="Coût & revenu projeté" eyebrow="Budget">
      <DocTable
        headers={["Hypothèse", "Valeur"]}
        rows={[
          ["Tier Discovery (gratuit)", "20 utilisateurs, 0€"],
          ["Tier Research (50€/mois)", "5 utilisateurs × 50€ = 250€/mois"],
          ["Tier Institution (500€/mois)", "1 partenaire = 500€/mois"],
          ["Total revenu mensuel projeté", "750€/mois"],
          ["Coût infra additionnel", "≈ 10€/mois (Redis Upstash + traffic)"],
          ["Net mensuel", "≈ 740€/mois"],
        ]}
      />
      <DocCallout type="success" title="Long terme">
        Si 3 institutions à 500€ + 15 chercheurs à 50€ : <strong>2 250€/mois</strong>{" "}
        de revenu B2B récurrent. Très stable, peu de churn (les institutions ont des
        budgets annuels).
      </DocCallout>
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois post-launch :</strong> 10 utilisateurs Discovery, 1 conversion Research.</>,
          <><strong>6 mois :</strong> 1 partenariat Institution signé.</>,
          <><strong>12 mois :</strong> 3 publications scientifiques citent l'API.</>,
        ]}
      />
    </DocSection>
  </>
);
