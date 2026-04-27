import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-pwa-mobile",
  title: "Plan d'implémentation : PWA Mobile",
  subtitle:
    "Pourquoi transformer Sakata.com en Progressive Web App, quel stack utiliser, et comment exécuter en 3 sprints d'une semaine.",
  category: "roadmap",
  order: 2,
  readTime: 11,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["pwa", "mobile", "service-worker", "offline"],
  summary:
    "Justification métier, stack technique (next-pwa vs Workbox brut), plan de mise en œuvre détaillé, et critères de succès mesurables.",
};

export const Content = () => (
  <>
    <DocLead>
      Une PWA n'est pas une appli mobile « light ». C'est la reconnaissance qu'en 2026,
      la frontière entre web et mobile est devenue artificielle, et que les
      utilisateurs africains méritent autant la qualité d'expérience d'une vraie appli
      que ses contraintes (offline, push, install).
    </DocLead>

    <DocSection title="Pourquoi maintenant ?" eyebrow="Justification">
      <DocSubsection title="Le contexte africain">
        <DocList
          items={[
            <><strong>70% du trafic africain est mobile</strong>, principalement sur Android entry-level (RAM 2 Go, processeurs lents).</>,
            <>Connexions <strong>3G majoritaires</strong> en zones rurales, latences {`>`} 500ms fréquentes.</>,
            <>Coût des données : 1 Go peut représenter une journée de salaire — l'offline est un argument économique.</>,
            <>Play Store : payer 25$ pour publier, plus le coût de maintenance d'une app native… La PWA contourne ce coût.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Le contexte diaspora">
        <DocList
          items={[
            <>La diaspora est sur iOS Belgique/France/Canada (RAM 4 Go+, fibre).</>,
            <>iOS supporte les PWA installées (depuis iOS 16.4) — install à l'écran d'accueil, push notifications.</>,
            <>Le mobile est le device principal de consommation culturelle (audio, vidéo, lecture).</>,
          ]}
        />
      </DocSubsection>

      <DocCallout type="decision" title="Conclusion">
        Une PWA bien faite couvre 95% des besoins mobile à 5% du coût d'une app native.
      </DocCallout>
    </DocSection>

    <DocSection title="Choix du stack" eyebrow="Décisions techniques">
      <DocSubsection title="Service Worker : next-pwa ou Workbox direct ?">
        <DocTable
          headers={["Option", "Pour", "Contre", "Verdict"]}
          rows={[
            [
              "next-pwa (wrapper)",
              "Configuration déclarative, intégration Next.js",
              "Maintenance lente (dernière release > 1 an), pas Next 15+",
              "❌ Obsolète",
            ],
            [
              "@serwist/next",
              "Successeur officiel de next-pwa, maintenu, Next 15 ✓",
              "Plus jeune, moins d'exemples",
              "✅ Recommandé",
            ],
            [
              "Workbox direct + custom SW",
              "Contrôle total, dernières features",
              "Beaucoup de boilerplate, plus de maintenance",
              "🟡 Si besoin spécifique",
            ],
          ]}
        />
        <DocCallout type="decision" title="Choix">
          <DocInline>@serwist/next</DocInline> — c'est ce qu'utilisent maintenant les
          projets Next.js qui veulent une PWA propre.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Stratégie de cache">
        <DocTable
          headers={["Type de ressource", "Stratégie", "Justification"]}
          rows={[
            ["HTML pages dynamiques", "NetworkFirst (timeout 3s, fallback cache)", "Contenu peut changer, mais offline = fallback acceptable"],
            ["API GET /articles, /profiles", "StaleWhileRevalidate (24h)", "Articles changent rarement, fraîcheur en arrière-plan"],
            ["Images Supabase Storage", "CacheFirst (30 jours)", "Immutables (URL avec ID), gain énorme"],
            ["Mapbox tiles", "CacheFirst (7 jours)", "Tiles immutables, mais limite quota Mapbox"],
            ["Polices, JS, CSS", "CacheFirst (1 an, hash dans URL)", "Build artifacts immutables"],
            ["POST/PUT/DELETE", "Pas de cache, network only", "Mutations doivent être en ligne"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Push notifications">
        <DocP>
          Déjà partiellement implémenté (table <DocInline>push_subscriptions</DocInline>,
          API routes <DocInline>/api/push/subscribe</DocInline> et{" "}
          <DocInline>/api/push/unsubscribe</DocInline>). Il manque :
        </DocP>
        <DocList
          items={[
            <>L'envoi effectif de notifications (worker côté serveur via web-push).</>,
            <>L'UX d'opt-in non intrusif (pas de popup au premier visit).</>,
            <>La centralisation des préférences dans <DocInline>/profil/notifications</DocInline>.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'implémentation — 3 sprints" eyebrow="Exécution">
      <DocSubsection title="Sprint 1 — Fondations PWA (1 semaine)">
        <DocList
          ordered
          items={[
            <>Installer <DocInline>@serwist/next</DocInline> et configurer <DocInline>next.config.ts</DocInline>.</>,
            <>Créer <DocInline>public/manifest.json</DocInline> avec couleurs Brume, icônes 192px et 512px.</>,
            <>Définir le <DocInline>service-worker.ts</DocInline> avec runtime caching configuré.</>,
            <>Ajouter <DocInline>{'<link rel="manifest" />'}</DocInline> et meta theme-color dans le layout.</>,
            <>Tester install banner Chrome Android + iOS Safari.</>,
            <>Validation Lighthouse PWA score {`>`} 90.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Offline & cache stratégique (1 semaine)">
        <DocList
          ordered
          items={[
            <>Implémenter une page <DocInline>/offline</DocInline> brandée Sakata.</>,
            <>Pré-cacher les routes critiques au build (homepage, /savoir, /chat).</>,
            <>Cache des images d'avatar et hero avec stratégie CacheFirst.</>,
            <>UI : indicateur visuel quand l'app est offline (banner discret).</>,
            <>Tests sur connexion 3G simulée (Chrome DevTools).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Push & install UX (1 semaine)">
        <DocList
          ordered
          items={[
            <>Worker Node.js avec <DocInline>web-push</DocInline> pour envoyer les notifs.</>,
            <>API <DocInline>/api/push/send</DocInline> appelable depuis le admin pour broadcast.</>,
            <>Triggers automatiques : nouveau message chat, nouvel article publié, mention forum.</>,
            <>Composant <DocInline>InstallPrompt</DocInline> qui apparaît après 3 visites (pas avant).</>,
            <>Préférences notifications par catégorie dans <DocInline>/profil</DocInline>.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Pièges connus" eyebrow="À anticiper">
      <DocCallout type="warning" title="iOS spécifiquement">
        <DocList
          items={[
            <>iOS Safari demande de cliquer le bouton de share puis « Sur l'écran d'accueil » — pas d'install banner natif comme Android.</>,
            <>Les push notifications iOS nécessitent que la PWA soit <strong>installée</strong> (pas juste ouverte dans Safari).</>,
            <>iOS limite le storage IndexedDB à ~50 MB — ne pas y stocker d'audio/vidéo.</>,
          ]}
        />
      </DocCallout>

      <DocCallout type="warning" title="Cache Supabase Realtime">
        Le service worker ne doit JAMAIS cacher les WebSockets Supabase. Exclure
        explicitement <DocInline>realtime/v1/websocket</DocInline> dans la config Serwist.
      </DocCallout>

      <DocCallout type="warning" title="Versioning de cache">
        Bumper la version du SW à chaque release majeure. Sinon, les utilisateurs
        restent bloqués sur l'ancienne version pendant des semaines.
      </DocCallout>
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="Comment mesurer">
      <DocTable
        headers={["Métrique", "Cible", "Outil"]}
        rows={[
          ["Lighthouse PWA score", "> 90", "Chrome DevTools / CI"],
          ["LCP P75 sur 3G simulé", "< 2.5s", "WebPageTest / RUM"],
          ["Taux d'install (Android)", "> 5% des MAU", "navigator.getInstalledRelatedApps"],
          ["Re-engagement via push", "> 15% CTR", "PostHog event tracking"],
          ["Pages vues offline", "> 200/mois", "SW analytics personnalisé"],
        ]}
      />
    </DocSection>

    <DocSection title="Coût estimé" eyebrow="Budget">
      <DocList
        items={[
          <><strong>Temps dev :</strong> 3 semaines × 1 dev = 0€ si interne, ~6 000€ si freelance.</>,
          <><strong>Service push :</strong> 0€ (web-push est gratuit, on s'auto-héberge).</>,
          <><strong>Stockage cache :</strong> 0€ (côté navigateur uniquement).</>,
          <><strong>Total :</strong> 0 à 6 000€ — l'option la moins chère pour étendre la portée mobile.</>,
        ]}
      />
    </DocSection>
  </>
);
