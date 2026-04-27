import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-systeme-reputation",
  title: "Plan d'implémentation : Système de Réputation Contributeur",
  subtitle:
    "Badges Griot, Doyen, Gardien — gamification culturellement ancrée pour récompenser les contributions de qualité et créer un effet de communauté.",
  category: "roadmap",
  order: 9,
  readTime: 7,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["gamification", "reputation", "community", "engagement"],
  summary:
    "Pourquoi la gamification doit servir la culture (et pas l'inverse), taxonomie des badges Sakata, calcul XP et anti-gaming.",
};

export const Content = () => (
  <>
    <DocLead>
      Tout système de gamification est culturellement marqué. Importer Stack Overflow
      sur Sakata serait une trahison esthétique. Les badges ici doivent évoquer les
      figures que la culture Sakata respecte déjà : le Griot qui transmet, le Doyen
      qui sait, le Gardien qui protège la mémoire.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi">
      <DocList
        items={[
          <><strong>Reconnaître les contributeurs</strong> — Un membre qui publie 50 articles mérite plus de visibilité qu'un anonyme.</>,
          <><strong>Créer un effet de communauté</strong> — Voir ses pairs progresser stimule les contributions.</>,
          <><strong>Filtrer la qualité</strong> — Un commentaire d'un Doyen porte plus que celui d'un newcomer.</>,
          <><strong>Onboarding ludique</strong> — Les premiers badges (« Premier Article ») guident l'utilisateur dans les actions clés.</>,
        ]}
      />
      <DocCallout type="warning" title="Piège à éviter">
        La gamification peut dégrader la qualité — les utilisateurs farment du
        contenu vide pour des points. Le système doit récompenser l'<strong>impact</strong>
        (lectures, citations) plus que le volume.
      </DocCallout>
    </DocSection>

    <DocSection title="Taxonomie des badges" eyebrow="Identité">
      <DocSubsection title="Trois familles, ancrées dans la culture Sakata">
        <DocTable
          headers={["Famille", "Évoque", "Critère"]}
          rows={[
            ["Griot", "Le conteur, le transmetteur", "Volume et qualité de contributions écrites"],
            ["Doyen", "Le sage, l'expert reconnu", "Profondeur d'expertise (citations, validations)"],
            ["Gardien", "Le veilleur, le mainteneur", "Modération, corrections, vérifications"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Niveaux par famille (5 niveaux)">
        <DocTable
          headers={["Niveau", "Griot", "Doyen", "Gardien"]}
          rows={[
            ["1", "Apprenti Griot (1 article)", "Curieux (10 commentaires utiles)", "Veilleur Novice (5 corrections)"],
            ["2", "Griot (10 articles)", "Connaisseur (50 commentaires utiles)", "Veilleur (25 corrections)"],
            ["3", "Maître Griot (50 articles)", "Sachant (200 commentaires utiles)", "Gardien (100 corrections)"],
            ["4", "Grand Griot (200 articles)", "Doyen (500 + 5 articles cités par autres)", "Grand Gardien (500 + modération validée)"],
            ["5", "Griot Ancestral (500 + impact diaspora)", "Patriarche (référence reconnue)", "Sentinelle (rôle officiel modération)"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Badges spéciaux (non répétables)">
        <DocList
          items={[
            <><strong>Pionnier</strong> — Inscrit dans les 100 premiers utilisateurs.</>,
            <><strong>Premier Article</strong> — Publié son premier article validé.</>,
            <><strong>Polyglotte</strong> — Publié dans les 6 langues de la plateforme.</>,
            <><strong>Veilleur de Veillée</strong> — A enregistré une veillée numérique avec un Doyen.</>,
            <><strong>Famille Reconnectée</strong> — A généré une fusion d'arbre généalogique.</>,
            <><strong>Gardien des Sources</strong> — A vérifié 50+ sources d'articles bulk-importés.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Calcul XP" eyebrow="Mécanique">
      <DocSubsection title="Points par action">
        <DocTable
          headers={["Action", "XP", "Note"]}
          rows={[
            ["Article publié", "+50", "Après validation admin"],
            ["Article cité par autre auteur", "+30", "Multiplicateur d'impact"],
            ["Article lu (par 100 visiteurs uniques)", "+5", "Reflète l'utilité réelle"],
            ["Commentaire upvoté ≥ 5×", "+10", "Pas de XP pour commentaires sans engagement"],
            ["Réaction reçue sur message forum", "+1", "Plafonné à 10/jour"],
            ["Source vérifiée (bulk import)", "+15", "Travail invisible mais essentiel"],
            ["Veillée enregistrée", "+200", "Pénurie → premium"],
            ["Modération validée", "+5", "Encourage le travail collectif"],
            ["Profil signalé puis banni", "−500", "Désincite les abus"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Décroissance temporelle">
        <DocCallout type="decision" title="Choix">
          XP « tout-temps » + XP « 90 derniers jours » affiché en parallèle.
        </DocCallout>
        <DocP>
          Un user qui a publié 100 articles il y a 3 ans mais rien depuis n'est plus
          activement contributeur. Le score 90j capture la vitalité actuelle, le
          score tout-temps capture la légitimité.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Anti-gaming" eyebrow="Sécurité">
      <DocCallout type="warning" title="Patterns à détecter">
        <DocList
          items={[
            <>Création de plusieurs comptes pour s'auto-upvoter (network analysis).</>,
            <>Spam de commentaires courts pour farm les XP de réaction.</>,
            <>Articles ultra-courts pour gonfler le compteur d'articles.</>,
            <>Citations circulaires entre comptes amis.</>,
          ]}
        />
      </DocCallout>

      <DocList
        items={[
          <><strong>Plafonds journaliers</strong> par type d'action (max 10 commentaires comptés/jour).</>,
          <><strong>Validation humaine</strong> des articles avant XP attribué.</>,
          <><strong>Décroissance des votes circulaires</strong> : si A vote toujours B, leurs votes mutuels valent moins.</>,
          <><strong>Audit manuel</strong> mensuel des top contributeurs (vérification qualité du contenu).</>,
          <><strong>Réduction massive si ban</strong> : −500 XP à toute personne dont un article est dépublié pour fraude.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Affichage UI" eyebrow="Visibilité">
      <DocList
        items={[
          <>Badge principal (le plus haut niveau atteint) à côté du nom partout.</>,
          <>Tooltip au survol : tous les badges débloqués + XP courant.</>,
          <>Profil public : section « Reconnaissance » avec timeline des badges.</>,
          <>Classement mensuel <DocInline>/membres/classement</DocInline> avec top 20 par famille.</>,
          <>Notification temps réel quand on débloque un badge (toast festif).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Plan d'exécution — 3 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — Schéma + calcul XP (1 semaine)">
        <DocList
          ordered
          items={[
            <>Migration tables <DocInline>user_xp_events</DocInline> (audit log) + <DocInline>user_badges</DocInline>.</>,
            <>Edge function calcul XP déclenchée par triggers (article published, commentaire upvoted, etc.).</>,
            <>Test : simuler 10 utilisateurs avec activités variées, vérifier les calculs.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — UI badges & profil (1 semaine)">
        <DocList
          ordered
          items={[
            <>Composant <DocInline>UserBadge</DocInline> réutilisable (à côté de chaque nom).</>,
            <>Page profil enrichie avec section badges.</>,
            <>Toast festif au déblocage d'un nouveau badge (Framer Motion).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Classement + admin (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/membres/classement</DocInline>.</>,
            <>Dashboard admin : top contributeurs, alertes anti-gaming.</>,
            <>Email mensuel diasporaà la nouvelle promotion (« 5 nouveaux Doyens ce mois-ci »).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Course à la quantité au détriment de la qualité", "Élevée", "Haut", "XP basé sur l'impact (citations, lectures), pas le volume"],
          ["Frustration des newcomers (trop loin du top)", "Moyenne", "Moyen", "Beaucoup de petits badges débloquables rapidement"],
          ["Perception 'trop ludique' chez les Doyens", "Moyenne", "Moyen", "Option de masquer les badges si on préfère"],
          ["Anti-gaming insuffisant (multi-comptes)", "Moyenne", "Haut", "Audit mensuel + détection IP/device"],
        ]}
      />
    </DocSection>

    <DocSection title="Coût" eyebrow="Budget">
      <DocList
        items={[
          <>Développement : 3 sprints × 1 dev = ~6 000€ ou 0€ si interne.</>,
          <>Infra : zéro (calculs en base, pas de service externe).</>,
          <>Récompenses physiques optionnelles (badge + carte au top contributeur de l'année) : ~50€/an.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois post-launch :</strong> 50% des MAU ont au moins 1 badge débloqué.</>,
          <><strong>6 mois :</strong> Le top 10 contributeurs représentent 40% du contenu publié (effet 80/20 sain).</>,
          <><strong>12 mois :</strong> Au moins 1 « Doyen niveau 5 » reconnu organiquement (cité par d'autres médias).</>,
        ]}
      />
    </DocSection>
  </>
);
