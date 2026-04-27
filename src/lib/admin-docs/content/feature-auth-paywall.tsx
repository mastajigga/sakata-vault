import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-auth-paywall",
  title: "Authentification & Paywall Premium",
  subtitle:
    "Gestion de session Supabase SSR, rotation de token cross-tab, gating de contenu premium et intégration Stripe pour les abonnements.",
  category: "feature",
  order: 3,
  readTime: 9,
  updatedAt: "2026-04-26",
  author: "Équipe Sakata",
  tags: ["auth", "supabase-ssr", "stripe", "paywall", "rls"],
  summary:
    "Comment AuthProvider, @supabase/ssr et Stripe Checkout interagissent pour offrir une expérience premium fiable sans double-buy.",
};

export const Content = () => (
  <>
    <DocLead>
      L'authentification est le fondement de tout : sans session stable, ni le chat, ni
      le paywall, ni l'admin ne fonctionnent. La complexité vient de la coexistence de
      deux mondes (browser localStorage et cookies SSR) qu'il faut maintenir
      synchronisés.
    </DocLead>

    <DocSection title="Pourquoi `@supabase/ssr` et pas `@supabase/supabase-js` ?" eyebrow="Décision">
      <DocCallout type="decision" title="Choix retenu">
        Utilisation exclusive de <DocInline>@supabase/ssr</DocInline> avec{" "}
        <DocInline>createBrowserClient</DocInline> et{" "}
        <DocInline>createServerClient</DocInline>. Le package legacy{" "}
        <DocInline>@supabase/supabase-js</DocInline> n'est jamais instancié directement
        dans un composant.
      </DocCallout>

      <DocP>
        La raison est subtile mais critique : <DocInline>@supabase/supabase-js</DocInline>{" "}
        stocke la session en <strong>localStorage</strong> tandis que les Server
        Components Next.js lisent les cookies. Sans le package SSR qui synchronise les
        deux, on obtient un état où le client pense être connecté mais le serveur
        retourne 401 — la classique « page blanche après refresh ».
      </DocP>

      <DocTable
        headers={["Approche", "LocalStorage", "Cookies SSR", "Verdict"]}
        rows={[
          ["@supabase/supabase-js direct", "✅", "❌", "❌ Désync"],
          ["@supabase/ssr + middleware", "✅", "✅", "✅ Retenu"],
          ["NextAuth.js", "❌", "✅", "🟡 Réécriture totale, pas justifié"],
        ]}
      />
    </DocSection>

    <DocSection title="Architecture AuthProvider" eyebrow="Cœur du système">
      <DocSubsection title="Cycle de vie">
        <DocList
          ordered
          items={[
            <>Hydratation : récupération de la session via <DocInline>getSession()</DocInline>.</>,
            <>Verrou <DocInline>initStarted</DocInline> (ref) pour éviter les boucles infinies au montage.</>,
            <>Fetch du profil utilisateur (idempotent via <DocInline>profileFetchPromiseRef</DocInline>).</>,
            <>Subscription <DocInline>onAuthStateChange()</DocInline> pour les évènements (login, logout, token refreshed).</>,
            <>Émission des flags <DocInline>sessionExpired</DocInline> et <DocInline>tokenRefreshPending</DocInline>.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Pourquoi un verrou initStarted ?">
        <DocP>
          Sans verrou, l'effet d'init pouvait s'exécuter deux fois en mode strict React
          (StrictMode + dev), causant des fetches doublonnés et parfois une boucle de
          re-renders quand <DocInline>setUser</DocInline> redéclenchait le hook.
        </DocP>
        <DocCode lang="typescript">{`const initStarted = useRef(false);

useEffect(() => {
  if (initStarted.current) return;
  initStarted.current = true;

  init();  // ne s'exécute qu'une seule fois
}, []);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Pourquoi pas de listener `storage` sur les clés sb-*">
        <DocP>
          La synchronisation cross-tab des sessions Supabase est{" "}
          <strong>nativement gérée</strong> par <DocInline>onAuthStateChange()</DocInline>.
          Ajouter un <DocInline>window.addEventListener("storage", ...)</DocInline> sur
          les clés <DocInline>sb-*</DocInline> est non seulement redondant, mais fragile —
          il peut déclencher des reconnexions WebSocket non désirées.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Versioning localStorage" eyebrow="Stratégie">
      <DocP>
        La constante <DocInline>APP_VERSION</DocInline> dans{" "}
        <DocInline>business.ts</DocInline> sert à invalider toutes les entrées
        localStorage <DocInline>sakata-*</DocInline> obsolètes lors d'un déploiement
        majeur. La whitelist <DocInline>SAKATA_KEY_WHITELIST</DocInline> définit les clés
        autorisées à survivre.
      </DocP>

      <DocCallout type="warning" title="Règles absolues localStorage">
        <DocList
          items={[
            <>Toute clé DOIT commencer par <DocInline>sakata-</DocInline> (tiret, jamais underscore).</>,
            <>Toute nouvelle clé DOIT être déclarée dans <DocInline>storage.ts</DocInline>.</>,
            <>Toute nouvelle clé DOIT être ajoutée à <DocInline>SAKATA_KEY_WHITELIST</DocInline>.</>,
            <>Pas de <DocInline>sessionStorage</DocInline> pour des données critiques.</>,
            <>Jamais de hardcoding de clé — toujours utiliser la constante.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Paywall Premium" eyebrow="Monétisation">
      <DocSubsection title="Modèle de gating">
        <DocP>
          Chaque article a un booléen <DocInline>requires_premium</DocInline>. Pour les
          articles premium, le composant <DocInline>ArticlePaywall</DocInline> affiche
          un overlay glassmorphism qui :
        </DocP>
        <DocList
          items={[
            <>Permet la lecture du préambule (1ʳᵉ section) en clair.</>,
            <>Floute progressivement le contenu suivant.</>,
            <>Affiche une CTA Stripe Checkout vers le plan premium.</>,
            <>Disparaît automatiquement quand <DocInline>profile.subscription_tier === "premium"</DocInline>.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Anti double-buy : sessions Stripe persistées">
        <DocP>
          Sans précaution, un utilisateur impatient qui clique deux fois sur « S'abonner »
          peut créer deux sessions Stripe et payer deux fois. La solution :
        </DocP>
        <DocCode lang="sql" caption="Tables dédiées">{`CREATE TABLE subscription_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Avant de créer une session : check si une est en cours
-- ('open' depuis < 30min)`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Webhook Stripe">
        <DocP>
          La route <DocInline>/api/stripe/webhook</DocInline> écoute :
        </DocP>
        <DocList
          items={[
            <><DocInline>checkout.session.completed</DocInline> → upgrade le user vers premium.</>,
            <><DocInline>customer.subscription.deleted</DocInline> → downgrade vers free.</>,
            <><DocInline>invoice.payment_failed</DocInline> → notification email + grace period 7j.</>,
          ]}
        />
        <DocCallout type="info" title="Vérification de signature">
          La signature webhook est vérifiée avec <DocInline>STRIPE_WEBHOOK_SECRET</DocInline>{" "}
          via <DocInline>stripe.webhooks.constructEvent()</DocInline>. Sans cela, n'importe
          qui pourrait POST des évènements falsifiés.
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Rôles & permissions" eyebrow="Modèle de sécurité">
      <DocTable
        headers={["Rôle", "Capacités", "Use case"]}
        rows={[
          ["admin", "Tout : modération, suppression, configuration", "Fortuné (créateur)"],
          ["manager", "Édition de contenus, gestion des contributions", "Modérateurs invités"],
          ["contributor", "Création d'articles soumis pour validation", "Auteurs externes"],
          ["user", "Lecture, commentaire, chat", "Membre standard (free ou premium)"],
        ]}
      />
      <DocP>
        Les vérifications de rôle se font via les helpers de <DocInline>business.ts</DocInline> :{" "}
        <DocInline>canManageContent()</DocInline>, <DocInline>canCreateArticles()</DocInline>,{" "}
        <DocInline>hasMinRole()</DocInline>. Tout endpoint admin doit appeler ces helpers,
        plus une vérification RLS côté DB en filet de sécurité.
      </DocP>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Lock stolen sur Supabase Auth (v2.7.3)">
        <DocP>
          Sur certains navigateurs, plusieurs onglets se disputaient le lock de session
          Supabase, causant des « flash de déconnexion » aléatoires. Résolu en
          centralisant tous les <DocInline>getSession()</DocInline> via{" "}
          <DocInline>AuthProvider</DocInline> (un seul listener pour toute l'app).
        </DocP>
      </DocSubsection>

      <DocSubsection title="Singleton Supabase strict">
        <DocCallout type="error" title="Anti-pattern à proscrire">
          <DocCode lang="typescript">{`// ❌ Composant qui crée son propre client
const supabase = createBrowserClient(URL, KEY);  // BAD

// ✅ Toujours
import { supabase } from "@/lib/supabase";`}</DocCode>
        </DocCallout>
        <DocP>
          Plusieurs clients Supabase = plusieurs sessions = WebSocket multiples = leak.
          Le singleton dans <DocInline>src/lib/supabase.ts</DocInline> est instrumenté
          (proxy de traffic control) et doit rester unique.
        </DocP>
      </DocSubsection>
    </DocSection>
  </>
);
