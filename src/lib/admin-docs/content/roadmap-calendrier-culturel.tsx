import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-calendrier-culturel",
  title: "Plan d'implémentation : Calendrier Culturel",
  subtitle:
    "Calendrier des fêtes traditionnelles, anniversaires de chefs, événements diaspora — avec export iCal, notifications et affichage géographique.",
  category: "roadmap",
  order: 10,
  readTime: 6,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["calendar", "events", "ical", "timezone"],
  summary:
    "Modélisation des événements culturels (récurrents et ponctuels), gestion des timezones diaspora, export iCal et intégration avec la carte 3D.",
};

export const Content = () => (
  <>
    <DocLead>
      La culture Sakata a un rythme cyclique : fêtes saisonnières liées aux récoltes,
      cérémonies d'initiation, dates rituelles. Mais la diaspora vit sur des
      calendriers étrangers — ils oublient. Un calendrier centralisé qui leur rappelle
      ces dates, c'est offrir un fil culturel ininterrompu malgré la distance.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi">
      <DocList
        items={[
          <><strong>Diaspora désynchronisée</strong> — À Bruxelles ou Montréal, on ne voit pas que c'est la fête de Mukenge si personne ne le rappelle.</>,
          <><strong>Événements à organiser</strong> — La diaspora elle-même monte des événements (concerts, conférences). Les centraliser leur donne plus de visibilité.</>,
          <><strong>Mémoire de chefs</strong> — Anniversaires, commémorations, dates de référence du peuple Sakata.</>,
          <><strong>Lien avec Audio Rooms</strong> — Une room programmée = un événement calendrier auto.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Stack technique" eyebrow="Choix">
      <DocSubsection title="Pourquoi pas Google Calendar embed ?">
        <DocCallout type="decision" title="Choix">
          Calendrier maison plutôt qu'embed Google.
        </DocCallout>
        <DocList
          items={[
            <>Embed Google = expérience tierce, pas dans le design Brume.</>,
            <>Pas de contrôle sur les permissions (qui peut soumettre un événement).</>,
            <>Pas d'intégration possible avec Audio Rooms / articles / géographie.</>,
            <>Au final, on génère un export iCal pour ceux qui veulent synchroniser avec Google/Apple.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma DB">
        <DocCode lang="sql">{`CREATE TABLE cultural_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,             -- multilang
  description JSONB,
  category TEXT NOT NULL,           -- fete, ceremonie, anniversaire, conference, audio-room
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  timezone TEXT DEFAULT 'Africa/Kinshasa',
  is_all_day BOOLEAN DEFAULT FALSE,

  -- Récurrence (RFC 5545 RRULE)
  recurrence_rule TEXT,             -- ex: 'FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25'
  recurrence_until TIMESTAMPTZ,

  -- Géolocalisation (lien carte 3D)
  location_name TEXT,
  location_lat NUMERIC,
  location_lng NUMERIC,

  -- Liens contextuels
  related_article_id UUID REFERENCES articles(id),
  related_audio_room_id UUID REFERENCES audio_rooms(id),

  -- Métadonnées
  visibility TEXT DEFAULT 'public', -- public, members, premium
  created_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_starts ON cultural_events(starts_at) WHERE approved_at IS NOT NULL;
CREATE INDEX idx_events_category ON cultural_events(category);

-- Pour les rappels personnalisés
CREATE TABLE event_subscribers (
  event_id UUID REFERENCES cultural_events(id),
  user_id UUID REFERENCES profiles(id),
  remind_minutes_before INT DEFAULT 60,
  PRIMARY KEY (event_id, user_id)
);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Récurrence : RRULE (RFC 5545)">
        <DocP>
          Standard utilisé par Google Calendar, Apple Calendar, Outlook. Lib JS{" "}
          <DocInline>rrule</DocInline> pour parser et expander :
        </DocP>
        <DocCode lang="typescript">{`import { RRule } from "rrule";

const rule = RRule.fromString(event.recurrence_rule);
const occurrences = rule.between(
  new Date("2026-01-01"),
  new Date("2026-12-31")
);
// → array de dates pour cette année`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Gestion timezone — la diaspora globale" eyebrow="Critique">
      <DocCallout type="warning" title="Problème">
        Une cérémonie « le 15 août à 18h » à Kinshasa, c'est 17h à Bruxelles, 12h à
        Montréal, 11h à New York. La conversion doit être automatique.
      </DocCallout>

      <DocList
        items={[
          <>Stockage UTC en DB, conversion à l'affichage selon le profil utilisateur.</>,
          <>Le créateur de l'événement choisit la timezone (souvent Africa/Kinshasa).</>,
          <>L'utilisateur voit l'horaire dans sa timezone native, mais peut switcher.</>,
          <>Composant <DocInline>{`<EventTime event={...} />`}</DocInline> affiche les deux.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Vues & UX" eyebrow="Frontend">
      <DocSubsection title="Trois vues">
        <DocList
          items={[
            <><strong>Mois</strong> — Grid classique, événements en carrés colorés par catégorie.</>,
            <><strong>Liste</strong> — Chronologique, optimal mobile.</>,
            <><strong>Carte</strong> — Événements géolocalisés sur la carte 3D Géographie.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Filtres">
        <DocList
          items={[
            <>Par catégorie (fête, conférence, audio-room).</>,
            <>Par lieu (Kinshasa, Mai-Ndombe, Bruxelles, Paris, Montréal).</>,
            <>Par mois.</>,
            <>« Mes événements » : ceux auxquels je suis abonné.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Export iCal">
        <DocP>
          Bouton « Exporter mon agenda » → endpoint{" "}
          <DocInline>/api/calendar/ical?token={`{user_token}`}</DocInline> qui retourne
          un fichier <DocInline>.ics</DocInline> avec ses abonnements. URL stable
          que Google Calendar peut s'abonner à pour mise à jour automatique.
        </DocP>
        <DocCode lang="typescript">{`import ical from "ical-generator";

const cal = ical({ name: "Sakata Calendrier" });
events.forEach(e => {
  cal.createEvent({
    start: e.starts_at,
    end: e.ends_at,
    summary: e.title.fr,
    description: e.description?.fr,
    location: e.location_name,
    url: \`https://sakata.com/calendrier/\${e.id}\`,
    repeating: e.recurrence_rule,
  });
});

return new Response(cal.toString(), {
  headers: { "Content-Type": "text/calendar" }
});`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Notifications" eyebrow="Engagement">
      <DocList
        items={[
          <>L'utilisateur peut s'abonner à un événement (table <DocInline>event_subscribers</DocInline>).</>,
          <>Cron job quotidien à 8h Kinshasa : checker les events à venir dans X minutes pour chaque abonné.</>,
          <>Notification push (PWA) + email pour les événements importants.</>,
          <>Lien direct vers la page de l'événement avec rappel contextuel.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Plan d'exécution — 2 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — Modèle + CRUD admin (1 semaine)">
        <DocList
          ordered
          items={[
            <>Migration table + RLS.</>,
            <>Page <DocInline>/admin/calendrier</DocInline> pour création/validation événements.</>,
            <>Pré-seed de 30 événements culturels Sakata historiques.</>,
            <>Edge function ical export.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — UI publique + notifications (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/calendrier</DocInline> avec 3 vues.</>,
            <>Cron quotidien notifications via PWA push.</>,
            <>Soumission communautaire : un user peut proposer un événement (admin valide).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Coût & complexité" eyebrow="Budget">
      <DocList
        items={[
          <>Développement : 2 sprints × 1 dev.</>,
          <>Lib RRule, ical-generator : open source, gratuit.</>,
          <>Notifications : infra PWA déjà en place.</>,
          <>Total : zéro coût récurrent.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Calendrier vide → impression abandonné", "Moyenne", "Haut", "Pré-seed avec 30 événements historiques connus"],
          ["Spam d'événements communautaires", "Moyenne", "Moyen", "Validation admin avant publication"],
          ["Bug timezone (RDC pas observée correctement)", "Faible", "Critique (mauvaise heure affichée)", "Tests automatisés sur 5 timezones"],
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois :</strong> 50 événements publiés, 100 abonnements utilisateurs cumulés.</>,
          <><strong>6 mois :</strong> 5+ événements diaspora soumis communautairement par mois.</>,
          <><strong>12 mois :</strong> 200+ utilisateurs avec export iCal actif.</>,
        ]}
      />
    </DocSection>
  </>
);
