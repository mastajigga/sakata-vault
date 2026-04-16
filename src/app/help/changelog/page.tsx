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
            <h2 className="text-2xl font-bold mb-2">v2.3.0 — Avril 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Aujourd'hui — Audit Realtime, École complète, Chat réactif</p>
            <div className="space-y-3 text-gray-300">
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
          <h2 className="text-2xl font-bold mb-2">v2.3.0 — April 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Today — Realtime Audit, Full School, Reactive Chat</p>
          <div className="space-y-3 text-gray-300">
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
