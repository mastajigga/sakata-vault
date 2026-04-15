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
            <h2 className="text-2xl font-bold mb-2">v2.2.0 — Avril 2026</h2>
            <p className="text-gray-400 text-sm mb-4">Aujourd'hui</p>
            <div className="space-y-3 text-gray-300">
              <div>
                <h3 className="font-semibold mb-1">🎯 Navbar Améliorations</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Suppression du lien "Réseaux" dupliqué du menu Savoir</li>
                  <li>• Comportement accordéon : un seul menu ouvert à la fois</li>
                  <li>• Cohérence des couleurs d'icônes avec le design system</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">🌐 Support Anglais Complet</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Anglais ajouté comme 5e langue (après français, kisakata, lingala, swahili, tshiluba)</li>
                  <li>• Détection automatique de la langue du navigateur</li>
                  <li>• 477+ chaînes d'interface utilisateur traduites</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">📚 Système d'Aide</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 5 pages d'aide dédiées : philosophie, stack, changelog, directives, GDPR</li>
                  <li>• Menu utilisateur enrichi avec liens Help et Admin</li>
                  <li>• Contenu traduit en français et anglais</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-1">👤 Architecture des Rôles Clarifiée</h3>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Hiérarchie : admin → manager → contributeur → utilisateur</li>
                  <li>• Permissions héritées pour les rôles supérieurs</li>
                  <li>• Gestion des demandes de contribution améliorée</li>
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
          <h2 className="text-2xl font-bold mb-2">v2.2.0 — April 2026</h2>
          <p className="text-gray-400 text-sm mb-4">Today</p>
          <div className="space-y-3 text-gray-300">
            <div>
              <h3 className="font-semibold mb-1">🎯 Navbar Improvements</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Removed duplicate "Networks" link from Knowledge menu</li>
                <li>• Accordion behavior: only one menu open at a time</li>
                <li>• Icon color consistency with design system</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">🌐 Complete English Support</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• English added as 5th language (after French, Kisakata, Lingala, Swahili, Tshiluba)</li>
                <li>• Automatic browser language detection</li>
                <li>• 477+ user interface strings translated</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">📚 Help System</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 5 dedicated help pages: philosophy, stack, changelog, guidelines, GDPR</li>
                <li>• Enhanced user menu with Help and Admin links</li>
                <li>• Content translated to French and English</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1">👤 Clarified Role Architecture</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Hierarchy: admin → manager → contributor → user</li>
                <li>• Inherited permissions for higher roles</li>
                <li>• Improved contribution request management</li>
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
