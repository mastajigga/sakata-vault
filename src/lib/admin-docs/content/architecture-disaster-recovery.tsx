import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-disaster-recovery",
  title: "Plan de Continuité (Disaster Recovery)",
  subtitle:
    "Stratégie de backup, RTO/RPO par scénario, procédures de récupération et tests réguliers pour garantir la résilience de Sakata.com.",
  category: "architecture",
  order: 6,
  readTime: 9,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["disaster-recovery", "backup", "resilience", "ops"],
  summary:
    "Que faire quand Supabase tombe, quand le repo Git est compromis, quand un admin efface accidentellement des données — procédures par scénario.",
};

export const Content = () => (
  <>
    <DocLead>
      Tout le travail accumulé sur Sakata.com — articles, veillées orales, arbres
      généalogiques — repose sur des systèmes faillibles. Sans plan de récupération,
      une seule mauvaise nuit peut effacer des années de patrimoine numérisé. Ce
      document est le filet de sécurité.
    </DocLead>

    <DocSection title="Risques identifiés" eyebrow="Cartographie">
      <DocTable
        headers={["Scénario", "Probabilité", "Impact", "RTO cible", "RPO cible"]}
        rows={[
          ["Supabase incident DB régional", "Faible (~1×/2 ans)", "Critique", "4h", "1h"],
          ["Suppression accidentelle data par admin", "Moyenne (1-2×/an)", "Élevé", "24h", "0 (rollback exact)"],
          ["Compromission compte admin", "Faible", "Très élevé", "1h (révocation)", "—"],
          ["Suppression repo GitHub", "Très faible", "Critique", "24h (re-clone)", "0"],
          ["Netlify outage prolongé (>4h)", "Faible", "Élevé", "8h (failover Vercel)", "—"],
          ["Stripe suspend compte", "Très faible", "Critique business", "Indéterminé", "—"],
          ["Fuite SUPABASE_SERVICE_ROLE_KEY", "Faible", "Critique sécurité", "30 min (rotation)", "—"],
          ["Domain hijacked (DNS)", "Très faible", "Critique business", "48h (registrar support)", "—"],
        ]}
      />
      <DocCallout type="info" title="Définitions">
        <DocList
          items={[
            <><strong>RTO</strong> (Recovery Time Objective) — temps maximum acceptable pour rétablir le service.</>,
            <><strong>RPO</strong> (Recovery Point Objective) — perte de données maximale acceptable (en temps).</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Stratégie de backup" eyebrow="Préparation">
      <DocSubsection title="Base de données Supabase">
        <DocList
          items={[
            <><strong>Backups automatiques Supabase</strong> — quotidiens, conservés 7 jours sur plan Pro. Restauration ponctuelle disponible.</>,
            <><strong>Dump manuel hebdomadaire</strong> — script <DocInline>scripts/backup-db.sh</DocInline> qui exécute <DocInline>pg_dump</DocInline> et upload vers bucket Storage privé <DocInline>db-backups</DocInline>.</>,
            <><strong>Dump mensuel offsite</strong> — copie sur S3 ou Backblaze B2 (région différente, account différent).</>,
          ]}
        />
        <DocCode lang="bash" caption="scripts/backup-db.sh">{`#!/bin/bash
DATE=$(date +%Y%m%d)
PGPASSWORD=$SUPABASE_DB_PASSWORD pg_dump \\
  -h db.slbnjjgparojkvxbsdzn.supabase.co \\
  -U postgres -d postgres \\
  -F c -b -v \\
  -f "/tmp/sakata-backup-\${DATE}.dump"

# Upload to private bucket
curl -X POST \\
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \\
  -F "file=@/tmp/sakata-backup-\${DATE}.dump" \\
  "https://slbnjjgparojkvxbsdzn.supabase.co/storage/v1/object/db-backups/\${DATE}.dump"

# Cleanup
rm /tmp/sakata-backup-\${DATE}.dump`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Storage (fichiers)">
        <DocList
          items={[
            <>Buckets sensibles : <DocInline>article-videos</DocInline>, <DocInline>veillee-recordings</DocInline>, <DocInline>marketplace-products</DocInline>.</>,
            <>Sync mensuel vers <DocInline>rclone</DocInline> mirror (Backblaze B2 ou local NAS).</>,
            <>Test restauration aléatoire d'1 fichier par mois.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Code source">
        <DocList
          items={[
            <>GitHub <DocInline>github.com/mastajigga/sakata-vault</DocInline> = source principale.</>,
            <>Mirror automatique sur GitLab (configuré dans repo settings).</>,
            <>Clone local annuel sur disque dur externe (zip + chiffré GPG).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Secrets & credentials">
        <DocList
          items={[
            <>Tous les secrets dans <DocInline>.env.local</DocInline> + Netlify env vars.</>,
            <>Backup chiffré du <DocInline>.env.local</DocInline> dans 1Password ou Bitwarden.</>,
            <>Liste des services + URL admin documentée dans note privée.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Procédures par scénario" eyebrow="Réaction">
      <DocSubsection title="Scénario 1 — Supabase DB indisponible">
        <DocList
          ordered
          items={[
            <>Vérifier <DocInline>status.supabase.com</DocInline> — confirmation outage régional.</>,
            <>Activer mode dégradé : page <DocInline>/maintenance</DocInline> servie par Netlify (HTML statique pré-déployé).</>,
            <>Communiquer sur Twitter/Telegram diaspora.</>,
            <>Attendre résolution Supabase (généralement 1-4h).</>,
            <>Si {`>`} 8h : envisager restauration sur projet Supabase de backup (préconfiguré pour cas extrême).</>,
            <>Post-mortem : analyser, ajuster.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario 2 — Suppression accidentelle de données">
        <DocCallout type="warning" title="Cas concret">
          Un admin lance par erreur <DocInline>DELETE FROM articles WHERE status = 'draft'</DocInline>{" "}
          au lieu d'un WHERE plus précis → 200 articles supprimés.
        </DocCallout>
        <DocList
          ordered
          items={[
            <>NE RIEN ÉCRIRE en DB qui pourrait écraser le backup.</>,
            <>Identifier précisément les lignes affectées (si possible via <DocInline>updated_at</DocInline> dans logs).</>,
            <>Restaurer depuis backup quotidien Supabase via point-in-time recovery.</>,
            <>Cross-vérifier avec dump hebdomadaire si point-in-time pas dispo.</>,
            <>Notifier les auteurs concernés si downtime perceptible.</>,
            <>Post-mortem : ajouter <DocInline>UPDATE</DocInline> à <DocInline>archived = true</DocInline> au lieu de <DocInline>DELETE</DocInline> dans tous les flows admin.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario 3 — Compte admin compromis">
        <DocList
          ordered
          items={[
            <>Révoquer la session via Supabase : <DocInline>DELETE FROM auth.sessions WHERE user_id = $admin_id</DocInline>.</>,
            <>Reset password forcé.</>,
            <>Changer la clé <DocInline>SUPABASE_JWT_SECRET</DocInline> (invalide tous les JWT existants).</>,
            <>Audit des actions récentes : <DocInline>SELECT * FROM moderation_logs WHERE moderator_id = $admin AND created_at &gt; $suspect_time</DocInline>.</>,
            <>Reverser les actions suspectes.</>,
            <>Activer 2FA sur le compte si pas déjà fait.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario 4 — Repo GitHub supprimé">
        <DocList
          ordered
          items={[
            <>Vérifier que mirror GitLab est intact.</>,
            <>Si oui : créer nouveau repo GitHub à partir du mirror.</>,
            <>Mettre à jour Netlify (déploiement pointe vers nouveau repo).</>,
            <>Notifier équipe pour <DocInline>git remote set-url</DocInline> sur leurs clones locaux.</>,
            <>Si mirror compromis aussi : restaurer depuis backup local annuel.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario 5 — Netlify outage prolongé">
        <DocList
          ordered
          items={[
            <>Vérifier <DocInline>netlifystatus.com</DocInline>.</>,
            <>Si {`>`} 4h : déploiement de secours sur Vercel (configuration backup préparée).</>,
            <>Mise à jour DNS (CNAME) vers Vercel.</>,
            <>Communiquer aux utilisateurs.</>,
            <>Retour Netlify quand stable.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario 6 — Fuite SUPABASE_SERVICE_ROLE_KEY">
        <DocCallout type="error" title="Critique — agir en {`<`} 30 min">
          Cette clé donne accès <strong>total</strong> à la base, RLS contournées.
          C'est la clé la plus sensible du système.
        </DocCallout>
        <DocList
          ordered
          items={[
            <>Aller dans Supabase Dashboard → Settings → API → Roll service_role key.</>,
            <>Mettre à jour Netlify env var <DocInline>SUPABASE_SERVICE_ROLE_KEY</DocInline>.</>,
            <>Mettre à jour <DocInline>.env.local</DocInline> dev.</>,
            <>Redéployer.</>,
            <>Audit : <DocInline>SELECT * FROM auth.audit_log_entries WHERE created_at &gt; $leak_time</DocInline> pour détecter usages suspects.</>,
            <>Si activité malveillante détectée : restaurer depuis backup pré-fuite.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Tests réguliers" eyebrow="Validation">
      <DocSubsection title="Routine mensuelle">
        <DocList
          items={[
            <>Test restauration : prendre 1 fichier random du backup, restaurer dans environnement test, vérifier intégrité.</>,
            <>Test rotation secret : roll <DocInline>SUPABASE_JWT_SECRET</DocInline> sur staging, vérifier que tout fonctionne.</>,
            <>Drill complet 1× par an : simuler le scénario 1 (DB down), mesurer le RTO réel.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Métriques à tracker">
        <DocTable
          headers={["Métrique", "Cible", "Fréquence"]}
          rows={[
            ["Uptime mensuel", "{`>`} 99.5%", "Continu via UptimeRobot"],
            ["Backup successful rate", "100%", "Quotidien"],
            ["Restauration test successful", "100%", "Mensuel"],
            ["RTO réel mesuré (drill)", "≤ cible scenario", "Annuel"],
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Communication de crise" eyebrow="Externe">
      <DocSubsection title="Canaux">
        <DocList
          items={[
            <><strong>Statut publique</strong> : page <DocInline>/status</DocInline> qui peut être éditée même si DB down (HTML statique Netlify).</>,
            <><strong>Twitter / X</strong> : compte officiel @sakatadotcom — communication courte, factuelle.</>,
            <><strong>Telegram diaspora</strong> : groupe modéré pour les communautés actives.</>,
            <><strong>Email d'urgence</strong> : tous les utilisateurs Premium notifiés via Resend si downtime {`>`} 1h.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Templates message">
        <DocCode caption="Template downtime court">{`Sakata.com rencontre actuellement un problème technique. Notre
équipe travaille à le résoudre. Estimation de retour : [X heures].
Vos données sont en sécurité, aucune information n'est perdue.

Suivi en temps réel : sakata.com/status`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Contacts d'urgence" eyebrow="Annuaire">
      <DocList
        items={[
          <><strong>Fortuné Mwa Mbenza</strong> (fondateur) — masta.jigga@gmail.com — +XX numéro privé</>,
          <><strong>Supabase Support Pro</strong> — via dashboard, SLA 24h</>,
          <><strong>Netlify Support</strong> — support@netlify.com</>,
          <><strong>Stripe Support</strong> — dashboard.stripe.com → Support</>,
          <><strong>Domain registrar</strong> — [à compléter]</>,
        ]}
      />
    </DocSection>
  </>
);
