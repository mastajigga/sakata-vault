import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "operational-onboarding-admin",
  title: "Guide d'Onboarding Admin",
  subtitle:
    "Premiers jours d'un nouveau membre de l'équipe admin/manager — outils à connaître, processus quotidiens, escalade et docs essentielles.",
  category: "operational",
  order: 2,
  readTime: 7,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["onboarding", "admin", "team", "checklist"],
  summary:
    "Plan structuré jour-par-jour pour la première semaine d'un nouvel admin, avec outils, accès et lectures prioritaires.",
};

export const Content = () => (
  <>
    <DocLead>
      Sakata.com fonctionne aujourd'hui largement grâce à une seule personne. C'est
      à la fois sa force (vision unifiée) et sa fragilité (point de défaillance
      unique). Ce document existe pour qu'un nouveau membre puisse devenir
      opérationnel en 5 jours sans solliciter le fondateur sur des questions
      basiques.
    </DocLead>

    <DocSection title="Avant le jour 1 — préparation" eyebrow="Pré-onboarding">
      <DocList
        ordered
        items={[
          <>Création du profil Sakata avec rôle <DocInline>admin</DocInline> ou <DocInline>manager</DocInline> selon scope.</>,
          <>Accès donné aux services tiers (Supabase Studio, Stripe Dashboard, Netlify, Resend).</>,
          <>Compte email pro <DocInline>@sakata.com</DocInline> créé et configuré.</>,
          <>Email de bienvenue avec lien vers cette doc et la charte éditoriale.</>,
          <>Visioconférence d'accueil de 1h prévue avec le fondateur.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Jour 1 — Comprendre la mission" eyebrow="Immersion">
      <DocSubsection title="Lectures obligatoires (matinée, ~3h)">
        <DocList
          items={[
            <><DocInline>strategy-pitch-deck</DocInline> — Le récit complet.</>,
            <><DocInline>strategy-modele-economique</DocInline> — Comment Sakata gagne (ou perd) de l'argent.</>,
            <><DocInline>operational-charte-editoriale</DocInline> — La voix à respecter et faire respecter.</>,
            <><DocInline>roadmap-12-months</DocInline> — Où on va.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Tour produit (après-midi, ~2h)">
        <DocP>Avec le fondateur, parcourir en démo :</DocP>
        <DocList
          items={[
            <>Page d'accueil + parcours utilisateur lambda.</>,
            <>Forum Mboka : créer un message, réagir, modérer.</>,
            <>Articles : lire un article premium / gratuit, suivre le paywall.</>,
            <>Carte 3D Géographie : interactivité.</>,
            <>Command Center admin : dashboard, articles à valider, modération.</>,
            <>Centre d'aide admin : notes personnelles, documentation.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Jour 2 — Outils techniques" eyebrow="Stack">
      <DocSubsection title="Supabase Studio">
        <DocList
          items={[
            <>URL : <DocInline>https://supabase.com/dashboard/project/slbnjjgparojkvxbsdzn</DocInline></>,
            <>Vues principales : Table Editor, Authentication (users), Storage, SQL Editor.</>,
            <>⚠️ Modifications directes en Studio = pas tracées en migration. Toujours préférer SQL Editor avec script versionnable.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Netlify">
        <DocList
          items={[
            <>Surveillance des déploiements (build success/failure).</>,
            <>Logs des fonctions serveur en cas d'erreur 500.</>,
            <>Variables d'environnement (lecture seule pour managers).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Stripe Dashboard">
        <DocList
          items={[
            <>Liste des abonnés Premium actifs.</>,
            <>Webhooks (vérifier qu'ils répondent 200).</>,
            <>Disputes / refunds (escalade : fondateur uniquement).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="GitHub">
        <DocList
          items={[
            <>Repo : <DocInline>github.com/mastajigga/sakata-vault</DocInline> (privé).</>,
            <>Branche principale : <DocInline>main</DocInline> = production (déploie automatique sur Netlify).</>,
            <>Pas de push direct sur main. PR + review requise (sauf urgences).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Jour 3 — Processus quotidiens" eyebrow="Routines">
      <DocSubsection title="Routine matinale (~30 min)">
        <DocList
          items={[
            <>Vérifier les <strong>contributions en attente</strong> dans <DocInline>/admin/contribution-requests</DocInline>.</>,
            <>Vérifier les <strong>articles en review</strong> dans <DocInline>/admin/content</DocInline>.</>,
            <>Survoler les <strong>signalements de modération</strong> du forum.</>,
            <>Lecture rapide des <strong>nouveaux messages chat support</strong>.</>,
            <>Check Stripe pour anomalies de paiement.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Tâches hebdomadaires">
        <DocList
          items={[
            <><strong>Lundi :</strong> Revue des KPIs (MAU, conversions, churn) sur dashboard admin.</>,
            <><strong>Mercredi :</strong> Prise de contact avec 3 contributeurs actifs (encouragement, retours).</>,
            <><strong>Vendredi :</strong> Backup vérifié + bilan de la semaine.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Jour 4 — Modération forum" eyebrow="Procédures">
      <DocCallout type="info" title="Lire d'abord">
        <DocInline>operational-procedure-moderation-forum</DocInline> — guide
        complet avec échelle de sanctions et cas typiques.
      </DocCallout>
      <DocList
        items={[
          <>Exercice : modérer 5 cas-types fournis par le fondateur (en sandbox).</>,
          <>Validation des décisions avec le fondateur.</>,
          <>Premier cas réel sous supervision.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Jour 5 — Autonomie & responsabilités" eyebrow="Lancement">
      <DocSubsection title="Définir le scope du nouveau rôle">
        <DocTable
          headers={["Tâche", "Admin", "Manager"]}
          rows={[
            ["Modération forum", "✅", "✅"],
            ["Validation articles", "✅", "✅"],
            ["Suspension/ban utilisateur", "✅", "✅ (notifier admin)"],
            ["Suppression contenu", "✅", "✅"],
            ["Modification base données via SQL", "✅", "❌"],
            ["Accès Stripe transactions", "✅", "Lecture seule"],
            ["Modification config code", "✅", "❌"],
            ["Communication externe partenaires", "✅", "Sur invitation"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Première contribution autonome">
        <DocList
          items={[
            <>Modérer une journée complète sans supervision.</>,
            <>Valider 3 articles communautaires.</>,
            <>Répondre à 5 messages support utilisateurs.</>,
            <>Documenter 1 nouveau pattern observé dans les notes admin.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Escalade : qui contacter quand" eyebrow="Hiérarchie de décisions">
      <DocTable
        headers={["Situation", "Décide", "Notifier"]}
        rows={[
          ["Modération routine (insulte, spam)", "Manager+", "Admin si récurrent"],
          ["Suspension {`>`} 7 jours", "Admin", "Fondateur si profil notable"],
          ["Bug technique non bloquant", "Logger ticket", "—"],
          ["Bug technique bloquant en prod", "Fondateur immédiat", "—"],
          ["Litige paiement", "Fondateur", "Stripe support"],
          ["Demande presse / média", "Fondateur", "—"],
          ["Demande légale (RGPD, justice)", "Fondateur uniquement", "Avocat"],
          ["Suspicion compromission compte", "Action immédiate (reset)", "Fondateur + sécurité"],
        ]}
      />
    </DocSection>

    <DocSection title="Documentation à lire dans les 30 premiers jours" eyebrow="Lectures">
      <DocList
        items={[
          <>Tous les documents <DocInline>feature-*</DocInline> de la doc admin.</>,
          <>Documents <DocInline>architecture-*</DocInline> (notamment RLS et Realtime).</>,
          <>Document <DocInline>operational-disaster-recovery</DocInline>.</>,
          <>Le fichier <DocInline>CLAUDE.md</DocInline> à la racine du repo (règles dev internes).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Pièges fréquents pour nouveaux admins" eyebrow="À éviter">
      <DocCallout type="error" title="Erreurs courantes">
        <DocList
          items={[
            <>Modifier des données directement en Supabase Studio sans script — risque corruption + pas reversible.</>,
            <>Bannir trop vite (préférer warning → suspension 24h → bannissement).</>,
            <>Approuver un article sans vérifier les sources.</>,
            <>Répondre publiquement à un troll (nourrit le drame).</>,
            <>Faire des promesses au nom de Sakata sans valider avec le fondateur.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Communication interne" eyebrow="Outils">
      <DocList
        items={[
          <>Chat équipe : Telegram ou Slack (selon préférence du fondateur au moment de l'embauche).</>,
          <>Notes partagées : système de notes admin intégré <DocInline>/admin/help/notes</DocInline>.</>,
          <>Documentation : <DocInline>/admin/help/documentation</DocInline>.</>,
          <>Décisions importantes : tracées dans un canal dédié (logs Slack ou commits CLAUDE.md).</>,
        ]}
      />
    </DocSection>
  </>
);
