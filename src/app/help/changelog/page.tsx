"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function ChangelogPage() {
  const { language } = useLanguage();

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            Mises à Jour & Changelog
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les dernières améliorations et fonctionnalités
          </p>
        </div>

        <div className="space-y-6">
          <section className="border-l-4 border-[#C16B34] pl-6">
            <h2 className="text-2xl font-bold mb-2">v2.4.0 — Phase 2 Optimisations</h2>
            <p className="text-gray-400 text-sm mb-4">Aujourd'hui — Performances, Caching, Validation, Titre Sakata</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🚀 Optimisations Performance (Phase 2)</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Migration complète **Next.js Image** : 40+ balises &lt;img&gt; optimisées</li>
                  <li>• Chargement lazy du globe 3D (Géographie) et tuiles Mapbox</li>
                  <li>• Pagination infinie messages : 50 messages par lot, scroll-up charge plus</li>
                  <li>• Optimisation TTI (Time To Interactive) : -30% sur pages lourdes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">💾 Caching Hybride Implanté</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• **API Routes ISR** : Cache-Control headers (300s s-maxage + 60s SWR)</li>
                  <li>• **localStorage + TTL** : Persistence client avec validation d'expiration</li>
                  <li>• **Hook useCachedFetch** : Unification SWR + localStorage + focus-revalidation</li>
                  <li>• Articles, profils, cours : tous en cache hybride (hits rate +60%)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">✅ Validation Formulaires Robuste</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• **React Hook Form + Zod** : schemas centralisés dans constants/validation</li>
                  <li>• Formulaires couverts : authentification, profil, chat, articles</li>
                  <li>• Erreurs en temps réel avec bordures rouges et messages explicites</li>
                  <li>• Protection XSS via form registry + HTML escaping</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">🎨 Système d'Erreurs Unifié</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Fichier centralisé errors.ts avec codes et messages utilisateur</li>
                  <li>• Remplacement des "An error occurred" génériques</li>
                  <li>• Erreurs API, Supabase, validation tous standardisés</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">🌍 Rebranding Sakata</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Changement titre site : Kisakata → **Sakata.com**</li>
                  <li>• Logo et métadonnées OG mises à jour</li>
                  <li>• Cohérence visuelle : "Brume de la Rivière — Patrimoine Sakata"</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">📧 Système de Notifications Email</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Template HTML stylisé avec couleurs du site (Or Ancestral #C16B34)</li>
                  <li>• Route API /api/email/notify-updates pour newsletters</li>
                  <li>• Notifications Phase 2 envoyées à tous les utilisateurs inscrits</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-[#C16B34] pl-6">
            <h2 className="text-2xl font-bold mb-2">v2.3.0 — Avril 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Aujourd'hui — Audit Realtime, École complète, Chat réactif</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🌍 Géographie — Command Center 3D</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Migration Ultra-Premium vers **Mapbox GL JS v3**</li>
                  <li>• Activation de la projection **Globe 3D** et du relief (Terrain)</li>
                  <li>• Atmosphère dynamique avec éclairage environnemental en temps réel</li>
                  <li>• Optimisation massive du chargement des données (Promise.all) : -60% de temps d'attente</li>
                  <li>• Nouvelle cinématique "Projection 3D" (Flythrough) pour une exploration guidée</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">🔒 Audit Sécurité & Realtime (15 corrections)</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Injection LIKE neutralisée dans la recherche d'articles (whitelist + échappement)</li>
                  <li>• Handlers CHANNEL_ERROR ajoutés sur toutes les subscriptions Supabase</li>
                  <li>• Channel réactions chat séparé du cycle de vie des messages (anti-reconnexion)</li>
                  <li>• Race condition corrigée dans useTyping au démontage du composant</li>
                  <li>• Stale closure sur user.id corrigée dans la page Contributeur</li>
                  <li>• Boucle de re-render CoursePage (enrichissement sémantique) éliminée</li>
                  <li>• Erreur DB silencieuse dans l'API push/unsubscribe propagée correctement</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">📚 École — 4e, 5e, 6e Secondaire</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 18 nouveaux chapitres : trigonométrie, vecteurs, logarithmes, probabilités, suites, dérivées</li>
                  <li>• Correction sidebar (primaire/secondaire ne se mélangent plus)</li>
                  <li>• Liens "Exercices" visibles sur chaque chapitre et en bas de chaque programme</li>
                  <li>• Mode Exercice gamifié avec score, indices progressifs et sauvegarde Supabase</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">💬 Chat — Réactions & Pagination</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Réactions émoji sur les messages (👍 ❤️ 😂 😮 😢)</li>
                  <li>• Pagination infinie : 50 messages chargés à la fois, scroll vers le haut pour plus</li>
                  <li>• Indicateurs de lecture (✓ envoyé / ✓✓ lu)</li>
                  <li>• Signed URLs pour les images éphémères (contournement du bucket public)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">📊 Analytics Contributeur</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Vues réelles par article depuis site_analytics</li>
                  <li>• Compteur de likes et 4e carte statistique</li>
                  <li>• Fetches avec withRetry pour fiabilité réseau</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">🔔 Notifications Push</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Service Worker avec gestion push + clic de notification</li>
                  <li>• Hook usePushNotifications : subscribe/unsubscribe</li>
                  <li>• Stockage des abonnements en base (push_subscriptions)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">👥 Annuaire Membres Amélioré</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Recherche en temps réel (filtre client-side)</li>
                  <li>• Tri par date ou alphabétique</li>
                  <li>• Pagination progressive (20 par lot)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-white/20 pl-6">
            <h2 className="text-2xl font-bold mb-2">v2.2.0 — Avril 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Navbar, Anglais, Aide, Rôles</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🎯 Navbar & Support Anglais</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Accordéon Navbar : un seul menu ouvert à la fois</li>
                  <li>• Anglais ajouté (5e langue) — 477+ chaînes traduites</li>
                  <li>• 5 pages d'aide : philosophie, stack, changelog, directives, GDPR</li>
                  <li>• Hiérarchie des rôles : admin → manager → contributeur → utilisateur</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-white/20 pl-6">
            <h2 className="text-2xl font-bold mb-2">v2.1.0 — Mars 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Audit et optimisations</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🔧 Corrections Critiques</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Audit complet localStorage/Supabase (15 problèmes corrigés)</li>
                  <li>• Système de retry centralisé avec backoff exponentiel</li>
                  <li>• Synchronisation de session multi-appareils stabilisée</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">💬 Messagerie Améliorée</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Enregistrement audio avec aperçu pré-envoi (style WhatsApp)</li>
                  <li>• Images éphémères : vue unique/double avec countdown</li>
                  <li>• Détection de capture d'écran intégrée</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-white/20 pl-6">
            <h2 className="text-2xl font-bold mb-2">v2.0.0 — Février 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Lancement complet</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🚀 Fonctionnalités Principales</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Forum en temps réel (Mboka) avec catégories</li>
                  <li>• Messagerie privée avec WebSocket Supabase</li>
                  <li>• Système d'articles premium avec paywall</li>
                  <li>• Paiement intégré via Stripe</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-l-4 border-white/20 pl-6">
            <h2 className="text-2xl font-bold mb-2">v1.0.0 — Janvier 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Lancement initial</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">✨ Naissance de Kisakata</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Plateforme d'archive culturelle lancée</li>
                  <li>• 5 langues de base : français, kisakata, lingala, swahili, tshiluba</li>
                  <li>• Authentification Supabase intégrée</li>
                  <li>• Design system "Brume de la Rivière" finalisé</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            À Venir
          </h2>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Traductions d'Articles</strong> : Expansion progressive des articles clés en anglais</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Éditeur d'Articles Amélioré</strong> : Interface riche pour les contributeurs</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Système de Recommandations</strong> : Contenu personnalisé basé sur les préférences</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Intégration Pinecone</strong> : Recherche sémantique avancée</span>
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
          Updates & Changelog
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the latest improvements and features
        </p>
      </div>

      <div className="space-y-6">
        <section className="border-l-4 border-[#C16B34] pl-6">
          <h2 className="text-2xl font-bold mb-2">v2.4.0 — Phase 2 Optimizations</h2>
          <p className="text-gray-400 text-sm mb-4">Today — Performance, Caching, Validation, Sakata Rebrand</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🚀 Performance Optimizations (Phase 2)</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Complete **Next.js Image** migration: 40+ &lt;img&gt; tags optimized</li>
                <li>• Lazy loading 3D globe (Geography) and Mapbox tiles</li>
                <li>• Infinite message pagination: 50 messages per batch, scroll-up loads more</li>
                <li>• TTI (Time To Interactive) optimization: -30% on heavy pages</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">💾 Hybrid Caching Implemented</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• **API Routes ISR**: Cache-Control headers (300s s-maxage + 60s SWR)</li>
                <li>• **localStorage + TTL**: Client persistence with expiration validation</li>
                <li>• **useCachedFetch Hook**: Unified SWR + localStorage + focus-revalidation</li>
                <li>• Articles, profiles, courses: all hybrid cached (hit rate +60%)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">✅ Robust Form Validation</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• **React Hook Form + Zod**: Centralized schemas in constants/validation</li>
                <li>• Covered forms: authentication, profile, chat, articles</li>
                <li>• Real-time errors with red borders and explicit messages</li>
                <li>• XSS protection via form registry + HTML escaping</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🎨 Unified Error System</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Centralized errors.ts file with codes and user messages</li>
                <li>• Replacement of generic "An error occurred" messages</li>
                <li>• API, Supabase, validation errors all standardized</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🌍 Sakata Rebranding</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Site title change: Kisakata → **Sakata.com**</li>
                <li>• Logo and OG metadata updated</li>
                <li>• Visual consistency: "Brume de la Rivière — Patrimoine Sakata"</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📧 Email Notification System</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Styled HTML template with site colors (Ancestral Gold #C16B34)</li>
                <li>• API route /api/email/notify-updates for newsletters</li>
                <li>• Phase 2 notifications sent to all registered users</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-l-4 border-[#C16B34] pl-6">
          <h2 className="text-2xl font-bold mb-2">v2.3.0 — April 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Today — Realtime Audit, Full School, Reactive Chat</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🌍 Geography — 3D Command Center</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Ultra-Premium migration to **Mapbox GL JS v3**</li>
                <li>• Activation of **3D Globe** projection and 3D Terrain</li>
                <li>• Dynamic atmosphere with real-time environmental lighting</li>
                <li>• Massive data loading optimization (Promise.all): 60% reduction in wait time</li>
                <li>• New "3D Projection" cinematic (Flythrough) for guided exploration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🔒 Security & Realtime Audit (15 fixes)</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• LIKE injection neutralized in article search (whitelist + escaping)</li>
                <li>• CHANNEL_ERROR handlers added to all Supabase subscriptions</li>
                <li>• Chat reactions channel decoupled from message lifecycle</li>
                <li>• Race condition fixed in useTyping on component unmount</li>
                <li>• Stale closure on user.id fixed in Contributor page</li>
                <li>• CoursePage re-render loop (semantic enrichment) eliminated</li>
                <li>• Silent DB error in push/unsubscribe API now propagated correctly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📚 School — 4th, 5th, 6th Grade Secondary</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 18 new chapters: trigonometry, vectors, logarithms, probability, sequences, derivatives</li>
                <li>• Sidebar fix (primary/secondary no longer mixed)</li>
                <li>• Exercise links visible on each chapter and at the bottom of each program</li>
                <li>• Gamified Exercise Mode with score, progressive hints and Supabase save</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">💬 Chat — Reactions & Pagination</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Emoji reactions on messages (👍 ❤️ 😂 😮 😢)</li>
                <li>• Infinite pagination: 50 messages loaded at a time, scroll up for more</li>
                <li>• Read indicators (✓ sent / ✓✓ read)</li>
                <li>• Signed URLs for ephemeral images (bypass public bucket)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📊 Contributor Analytics</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Real article views from site_analytics</li>
                <li>• Like counter and 4th stat card</li>
                <li>• Fetches with withRetry for network reliability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🔔 Push Notifications</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Service Worker with push handling + notification click</li>
                <li>• usePushNotifications hook: subscribe/unsubscribe</li>
                <li>• Subscription storage in database (push_subscriptions)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">👥 Enhanced Member Directory</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Real-time search (client-side filter)</li>
                <li>• Sort by date or alphabetically</li>
                <li>• Progressive pagination (20 per batch)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-l-4 border-white/20 pl-6">
          <h2 className="text-2xl font-bold mb-2">v2.2.0 — April 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Navbar, English, Help, Roles</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🎯 Navbar & English Support</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Accordion Navbar: only one menu open at a time</li>
                <li>• English added (5th language) — 477+ strings translated</li>
                <li>• 5 help pages: philosophy, stack, changelog, guidelines, GDPR</li>
                <li>• Role hierarchy: admin → manager → contributor → user</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-l-4 border-white/20 pl-6">
          <h2 className="text-2xl font-bold mb-2">v2.1.0 — March 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Audit and optimizations</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🔧 Critical Fixes</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Complete localStorage/Supabase audit (15 issues fixed)</li>
                <li>• Centralized retry system with exponential backoff</li>
                <li>• Stabilized multi-device session synchronization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">💬 Enhanced Messaging</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Audio recording with pre-send preview (WhatsApp style)</li>
                <li>• Ephemeral images: single/double view with countdown</li>
                <li>• Screenshot detection integrated</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-l-4 border-white/20 pl-6">
          <h2 className="text-2xl font-bold mb-2">v2.0.0 — February 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Full launch</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🚀 Core Features</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Real-time forum (Mboka) with categories</li>
                <li>• Private messaging with Supabase WebSocket</li>
                <li>• Premium article system with paywall</li>
                <li>• Integrated payment via Stripe</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-l-4 border-white/20 pl-6">
          <h2 className="text-2xl font-bold mb-2">v1.0.0 — January 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Initial launch</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">✨ Birth of Kisakata</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Cultural archive platform launched</li>
                <li>• 5 base languages: French, Kisakata, Lingala, Swahili, Tshiluba</li>
                <li>• Supabase authentication integrated</li>
                <li>• "Brume de la Rivière" design system finalized</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Coming Soon
        </h2>
        <div className="space-y-3 text-gray-300">
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Article Translations</strong> : Progressive expansion of key articles in English</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Enhanced Article Editor</strong> : Rich interface for contributors</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Recommendation System</strong> : Personalized content based on preferences</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Pinecone Integration</strong> : Advanced semantic search</span>
          </p>
        </div>
      </section>
    </div>
  );
}
