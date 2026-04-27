import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-audio-rooms",
  title: "Plan d'implémentation : Audio Rooms",
  subtitle:
    "Salons audio en direct façon Discord Stage / Twitter Spaces, dédiés aux conversations culturelles, débats communautaires et veillées partagées.",
  category: "roadmap",
  order: 8,
  readTime: 9,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["audio", "livekit", "real-time", "community"],
  summary:
    "Comparaison LiveKit / Daily.co / Agora, modèle de coût, modération et stratégie d'archivage des sessions intéressantes.",
};

export const Content = () => (
  <>
    <DocLead>
      Le forum Mboka est asynchrone. Mais une partie de la culture Sakata vit dans la
      parole vivante : raconter à plusieurs, débattre, chanter ensemble. Audio Rooms
      ramène cette dimension orale et collective au cœur de la plateforme — sans
      passer par Discord ou WhatsApp où la culture se dilue.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi">
      <DocList
        items={[
          <><strong>Veillées hebdomadaires</strong> — Un Doyen raconte une histoire ; 50 personnes écoutent en direct depuis 4 continents.</>,
          <><strong>Débats culturels</strong> — Sujets sensibles (mariage, héritage, modernité) qui méritent voix humaine et nuance.</>,
          <><strong>Apprentissage langue</strong> — Pratique conversationnelle kisakata avec native speakers.</>,
          <><strong>Lancements d'articles</strong> — L'auteur d'un article majeur l'annonce et répond aux questions.</>,
        ]}
      />
      <DocCallout type="info" title="Différenciation vs. Discord/WhatsApp">
        Audio Rooms intégrés à Sakata = contenu archivé, indexé, retrouvable. Sur
        Discord, une bonne discussion disparaît à la prochaine. Ici, elle devient
        ressource pérenne.
      </DocCallout>
    </DocSection>

    <DocSection title="Choix de provider WebRTC" eyebrow="Stack">
      <DocTable
        headers={["Provider", "Pour", "Contre", "Coût (50 users)"]}
        rows={[
          [
            "LiveKit Cloud",
            "Open source, self-host possible, SDK React excellent",
            "Pricing à la minute-participant",
            "0.5$/h × 50 = 25$/h",
          ],
          [
            "Daily.co",
            "API simplissime, recording inclus",
            "Pricing élevé sur volume",
            "≈ 60$/h",
          ],
          [
            "Agora",
            "Très scalable, leader Asie",
            "SDK plus lourd, moins documenté",
            "≈ 30$/h",
          ],
          [
            "Twilio Live",
            "Établi, stable",
            "Plus cher, en voie de deprecation",
            "≈ 50$/h",
          ],
          [
            "Self-hosted (mediasoup)",
            "Gratuit en théorie",
            "Ops nightmare, pas pour solo dev",
            "Serveur 50€/mois + temps",
          ],
        ]}
      />
      <DocCallout type="decision" title="Choix">
        <strong>LiveKit Cloud</strong>. Bon ratio coût/simplicité, SDK React
        first-class, possibilité de migrer vers self-host plus tard sans réécrire le
        code.
      </DocCallout>
    </DocSection>

    <DocSection title="Architecture" eyebrow="Implémentation">
      <DocSubsection title="Modèle de room — type Stage">
        <DocList
          items={[
            <><strong>Speakers (max 8)</strong> — Micro ouvert, peuvent parler.</>,
            <><strong>Listeners (illimité)</strong> — Écoutent en silence, peuvent demander à parler (raise hand).</>,
            <><strong>Hosts (1-3)</strong> — Modèrent : invitent à parler, mute, kick.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma DB">
        <DocCode lang="sql">{`CREATE TABLE audio_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livekit_room_name TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  host_id UUID REFERENCES profiles(id),
  category TEXT,                    -- veillee, debat, apprentissage, ...
  visibility TEXT DEFAULT 'public', -- public, premium, invite-only
  recording_url TEXT,
  recording_duration_sec INT,
  participant_peak INT,
  status TEXT DEFAULT 'scheduled'   -- scheduled, live, ended, archived
);

CREATE TABLE audio_room_participants (
  room_id UUID REFERENCES audio_rooms(id),
  user_id UUID REFERENCES profiles(id),
  role TEXT NOT NULL,               -- host, speaker, listener
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  PRIMARY KEY (room_id, user_id)
);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Flux d'auth LiveKit">
        <DocCode lang="typescript">{`// Backend : générer un token LiveKit signé
import { AccessToken } from "livekit-server-sdk";

async function generateRoomToken(userId: string, roomName: string, role: Role) {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: userId,
    ttl: 60 * 60,  // 1h
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: role !== "listener",
    canSubscribe: true,
    canPublishData: role === "host",  // pour broadcast events modération
  });

  return at.toJwt();
}`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Modération" eyebrow="Critique pour la culture Sakata">
      <DocCallout type="warning" title="Sujets sensibles">
        Les conversations culturelles touchent souvent à des sujets délicats : héritage,
        rites secrets, conflits intergénérationnels. La modération doit être ferme et
        culturellement éclairée.
      </DocCallout>

      <DocList
        items={[
          <>Host peut <strong>mute</strong> un speaker à tout moment, <strong>kick</strong> en cas de violation.</>,
          <>Listener-driven <strong>signalement</strong> avec contexte (timestamp dans la session).</>,
          <>Ban automatique après 3 signalements validés sur 30 jours.</>,
          <>Logs des actions de modération (audit).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Recording & archivage" eyebrow="Valeur long terme">
      <DocSubsection title="Stratégie">
        <DocList
          items={[
            <>Toutes les rooms sont enregistrées par défaut (consentement à l'inscription).</>,
            <>Hosts peuvent désactiver le recording pour rooms privées.</>,
            <>Recording stocké dans bucket <DocInline>audio-rooms-recordings</DocInline>.</>,
            <>Si la session est intéressante : transcription Whisper → article éditorial.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Lien avec la Veillée Numérique">
        <DocP>
          Une veillée enregistrée dans Audio Rooms peut alimenter directement le
          pipeline Veillée Numérique : transcription, traduction, tagging. C'est une
          synergie naturelle entre les deux features.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'exécution — 3 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — Tech foundations (1 semaine)">
        <DocList
          ordered
          items={[
            <>Compte LiveKit Cloud + clés API en .env.</>,
            <>Migration DB des 2 tables.</>,
            <>API <DocInline>/api/audio-rooms/token</DocInline> qui génère JWT LiveKit selon rôle.</>,
            <>Composant <DocInline>AudioRoomClient</DocInline> avec @livekit/components-react.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — UX & rôles (2 semaines)">
        <DocList
          ordered
          items={[
            <>Pages <DocInline>/audio</DocInline> (catalogue) et <DocInline>/audio/[id]</DocInline> (room).</>,
            <>UI Stage : speakers en haut, listeners en grille en bas.</>,
            <>Raise hand → host approuve/refuse.</>,
            <>Push notification pour rooms programmées (suivies).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Recording + archivage (1 semaine)">
        <DocList
          ordered
          items={[
            <>LiveKit Egress vers bucket Supabase.</>,
            <>Page d'archive <DocInline>/audio/archives</DocInline> avec lecteur audio.</>,
            <>Bouton « Convertir en veillée » → trigger pipeline Veillée Numérique.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Coût estimé" eyebrow="Budget">
      <DocTable
        headers={["Hypothèse", "Valeur"]}
        rows={[
          ["Heures de room par mois", "20h"],
          ["Participants moyens par room", "30"],
          ["Volume LiveKit", "20h × 30 × 60min = 36 000 minutes"],
          ["Coût LiveKit (~0.004$/min participant)", "≈ 144$"],
          ["Recording storage (20h × 50 MB)", "≈ 1 GB → inclus"],
          ["Total mensuel", "≈ 130-150€"],
        ]}
      />
      <DocCallout type="info" title="Limite gratuit LiveKit">
        Plan gratuit LiveKit : 10 GB bandwidth/mois. Pour démarrer modeste (5h/mois),
        zéro coût. Au-delà, plan Pro à 50$/mois + usage.
      </DocCallout>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Latence trop élevée RDC ↔ Europe", "Élevée", "Moyen", "LiveKit a edges en EU + US, latence acceptable. Test avant launch."],
          ["Modération en temps réel (insulte, etc.)", "Moyenne", "Haut", "Hosts entraînés + signalement express. Ban automatique au seuil."],
          ["Coût qui dérape (room qui dure 8h)", "Moyenne", "Moyen", "Plafond 4h par room par défaut. Premium pour rooms longues."],
          ["Faible adoption initiale", "Élevée", "Moyen", "Lancer avec 3 veillées programmées des Doyens connus + comm diaspora."],
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois :</strong> 1 room/semaine, 30+ participants en moyenne.</>,
          <><strong>6 mois :</strong> 3 rooms/semaine, 1 veillée enregistrée → article majeur (pipeline Veillée).</>,
          <><strong>12 mois :</strong> Audio Rooms représentent 20% du temps passé sur la plateforme.</>,
        ]}
      />
    </DocSection>
  </>
);
