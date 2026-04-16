"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function StackPage() {
  const { language } = useLanguage();

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            Stack Technologique
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les technologies qui alimentent Kisakata
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Frontend
          </h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Next.js 16</h3>
              <p className="text-gray-300 text-sm">
                Framework React moderne avec App Router, optimisation des performances et déploiement sur Netlify.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">React 19</h3>
              <p className="text-gray-300 text-sm">
                Dernière version de React pour composants réactifs et optimisés.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">TypeScript</h3>
              <p className="text-gray-300 text-sm">
                Typage statique pour une meilleure maintenabilité et sécurité du code.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Tailwind CSS v4</h3>
              <p className="text-gray-300 text-sm">
                Framework CSS utilitaire avec système de design personnalisé "Brume de la Rivière".
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Framer Motion</h3>
              <p className="text-gray-300 text-sm">
                Bibliothèque d'animation pour interfaces fluides et réactives.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">GSAP</h3>
              <p className="text-gray-300 text-sm">
                Animation avancée et contrôle précis des transitions au scroll.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Backend & Base de Données
          </h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Supabase</h3>
              <p className="text-gray-300 text-sm">
                PostgreSQL hébergé + authentification OAuth + API GraphQL/REST. Gestion complète des données et sessions utilisateurs.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">PostgreSQL</h3>
              <p className="text-gray-300 text-sm">
                Base de données relationnelle robuste avec Row Level Security (RLS) pour la sécurité multi-utilisateurs.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Stripe</h3>
              <p className="text-gray-300 text-sm">
                Plateforme de paiement intégrée pour gérer les abonnements et les transactions.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Déploiement & Infrastructure
          </h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Netlify</h3>
              <p className="text-gray-300 text-sm">
                Déploiement continu depuis le dépôt Git principal (branche main) avec build optimisé.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Node.js 18+</h3>
              <p className="text-gray-300 text-sm">
                Runtime JavaScript pour le backend et la compilation Next.js.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Outils & Utilities
          </h2>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">date-fns</h3>
              <p className="text-gray-300 text-sm">
                Manipulation et formatage des dates avec support multilingue.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Lucide React</h3>
              <p className="text-gray-300 text-sm">
                Bibliothèque d'icônes minimaliste et légère.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">@supabase/ssr</h3>
              <p className="text-gray-300 text-sm">
                Authentification côté serveur et client pour Supabase avec Next.js.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">Web Push API</h3>
              <p className="text-gray-300 text-sm">
                Notifications push natives via Service Worker + VAPID. Stockage des abonnements dans la table <code>push_subscriptions</code>.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">KaTeX + MathLive</h3>
              <p className="text-gray-300 text-sm">
                Rendu mathématique LaTeX haute qualité et saisie d'expressions mathématiques pour l'École de la Brume.
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold mb-2">withRetry (interne)</h3>
              <p className="text-gray-300 text-sm">
                Utilitaire interne de retry avec backoff exponentiel (300ms → 900ms → 2700ms) pour tous les appels Supabase critiques. Obligatoire sur tout <code>.insert()</code>, <code>.upsert()</code>, <code>.update()</code>.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Tables Supabase (v2.3.0)
          </h2>
          <div className="space-y-2 text-gray-300 text-sm">
            <p><code className="bg-white/10 px-1 rounded">chat_reactions</code> — Réactions émoji sur les messages (message_id, user_id, emoji)</p>
            <p><code className="bg-white/10 px-1 rounded">push_subscriptions</code> — Abonnements Web Push par utilisateur</p>
            <p><code className="bg-white/10 px-1 rounded">ecole_scores</code> — Scores du mode exercice par chapitre</p>
            <p><code className="bg-white/10 px-1 rounded">chat_conversations</code> — Étendu avec is_group, group_name, created_by</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Architecture & Patterns
          </h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Server Components</strong> : Utilisation des composants React Server au maximum pour optimiser les performances.
            </p>
            <p>
              <strong>Client Components</strong> : Utilisés seulement pour l'interactivité, les formulaires et les hooks.
            </p>
            <p>
              <strong>API Routes</strong> : Endpoints serverless pour la logique backend et les webhooks.
            </p>
            <p>
              <strong>Context API</strong> : Gestion globale de l'état (authentification, langue, préférences).
            </p>
            <p>
              <strong>Custom Hooks</strong> : Réutilisabilité de la logique complexe (messages, conversations, progression).
            </p>
            <p>
              <strong>Anti-boucle Subscription</strong> : <code className="bg-white/10 px-1 rounded">isFetchingRef</code> + <code className="bg-white/10 px-1 rounded">fetchData(showLoading=false)</code> dans les callbacks realtime — jamais <code>setLoading(true)</code> dans une subscription.
            </p>
          </div>
        </section>
      </div>
    );
  }

  // English version
  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--or-ancestral)" }}
        >
          Technology Stack
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the technologies powering Kisakata
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Frontend
        </h2>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Next.js 16</h3>
            <p className="text-gray-300 text-sm">
              Modern React framework with App Router, performance optimization, and Netlify deployment.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">React 19</h3>
            <p className="text-gray-300 text-sm">
              Latest React version for reactive and optimized components.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">TypeScript</h3>
            <p className="text-gray-300 text-sm">
              Static typing for improved maintainability and code safety.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Tailwind CSS v4</h3>
            <p className="text-gray-300 text-sm">
              Utility-first CSS framework with custom "Brume de la Rivière" design system.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Framer Motion</h3>
            <p className="text-gray-300 text-sm">
              Animation library for fluid and reactive interfaces.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">GSAP</h3>
            <p className="text-gray-300 text-sm">
              Advanced animation and precise scroll-driven transition control.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Backend & Database
        </h2>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Supabase</h3>
            <p className="text-gray-300 text-sm">
              Hosted PostgreSQL + OAuth authentication + GraphQL/REST API. Complete data and user session management.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">PostgreSQL</h3>
            <p className="text-gray-300 text-sm">
              Robust relational database with Row Level Security (RLS) for multi-user safety.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Stripe</h3>
            <p className="text-gray-300 text-sm">
              Integrated payment platform for managing subscriptions and transactions.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Deployment & Infrastructure
        </h2>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Netlify</h3>
            <p className="text-gray-300 text-sm">
              Continuous deployment from main Git branch with optimized builds.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Node.js 18+</h3>
            <p className="text-gray-300 text-sm">
              JavaScript runtime for backend and Next.js compilation.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Tools & Utilities
        </h2>
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">date-fns</h3>
            <p className="text-gray-300 text-sm">
              Date manipulation and formatting with multilingual support.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Lucide React</h3>
            <p className="text-gray-300 text-sm">
              Minimal and lightweight icon library.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">@supabase/ssr</h3>
            <p className="text-gray-300 text-sm">
              Server and client-side authentication for Supabase with Next.js.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Web Push API</h3>
            <p className="text-gray-300 text-sm">
              Native push notifications via Service Worker + VAPID. Subscriptions stored in the <code>push_subscriptions</code> table.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">KaTeX + MathLive</h3>
            <p className="text-gray-300 text-sm">
              High-quality LaTeX math rendering and expression input for the École de la Brume.
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">withRetry (internal)</h3>
            <p className="text-gray-300 text-sm">
              Internal retry utility with exponential backoff (300ms → 900ms → 2700ms). Required on every <code>.insert()</code>, <code>.upsert()</code>, <code>.update()</code>.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Supabase Tables (v2.3.0)
        </h2>
        <div className="space-y-2 text-gray-300 text-sm">
          <p><code className="bg-white/10 px-1 rounded">chat_reactions</code> — Emoji reactions on messages</p>
          <p><code className="bg-white/10 px-1 rounded">push_subscriptions</code> — Web Push subscriptions per user</p>
          <p><code className="bg-white/10 px-1 rounded">ecole_scores</code> — Exercise mode scores per chapter</p>
          <p><code className="bg-white/10 px-1 rounded">chat_conversations</code> — Extended with is_group, group_name, created_by</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Architecture & Patterns
        </h2>
        <div className="space-y-2 text-gray-300">
          <p>
            <strong>Server Components</strong> : Maximize use of React Server Components for performance optimization.
          </p>
          <p>
            <strong>Client Components</strong> : Used only for interactivity, forms, and hooks.
          </p>
          <p>
            <strong>API Routes</strong> : Serverless endpoints for backend logic and webhooks.
          </p>
          <p>
            <strong>Context API</strong> : Global state management (authentication, language, preferences).
          </p>
          <p>
            <strong>Custom Hooks</strong> : Reusable complex logic (messages, conversations, progress).
          </p>
          <p>
            <strong>Anti-loop Subscription</strong> : <code className="bg-white/10 px-1 rounded">isFetchingRef</code> + silent fetch in realtime callbacks — never <code>setLoading(true)</code> inside a subscription.
          </p>
        </div>
      </section>
    </div>
  );
}
