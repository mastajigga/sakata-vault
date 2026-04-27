import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead, DocQuote } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-veillee-numerique",
  title: "Plan d'implémentation : La Veillée Numérique",
  subtitle:
    "Studio d'enregistrement et de traitement IA d'histoires orales — feature signature qui peut faire de Sakata la référence mondiale en patrimoine bantu.",
  category: "roadmap",
  order: 3,
  readTime: 15,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["ai", "whisper", "gemini", "oral-history", "signature-feature"],
  summary:
    "Stack technique complet (Whisper, Gemini, Supabase), justification des choix, plan en 5 sprints, et stratégie pour les langues bantu.",
};

export const Content = () => (
  <>
    <DocLead>
      Imaginer un outil qui permet à un petit-fils à Bruxelles d'enregistrer son
      grand-père à Kinshasa, qui transcrit automatiquement ses paroles en kisakata, les
      traduit en cinq autres langues, identifie les thèmes culturels évoqués, et les
      relie aux articles déjà existants. Voilà la Veillée Numérique.
    </DocLead>

    <DocQuote attribution="Mission narrative">
      Quand un vieillard meurt, c'est une bibliothèque qui brûle. La Veillée Numérique,
      c'est l'extincteur.
    </DocQuote>

    <DocSection title="Le besoin" eyebrow="Pourquoi cette feature">
      <DocP>
        La culture Sakata, comme la plupart des cultures bantu, est principalement
        orale. Les articles écrits ne capturent qu'une fraction du savoir : les
        intonations, les chants, les expressions faciales, les digressions
        révélatrices se perdent dès qu'on transcrit.
      </DocP>
      <DocP>
        Par ailleurs, les anciens partent. Chaque année, des dizaines de Doyens
        décèdent en emportant leurs récits. Les institutions classiques (musées,
        universités) ne peuvent pas systématiser la collecte. Les diasporas, elles,
        ont l'envie et les moyens techniques.
      </DocP>
      <DocCallout type="decision" title="Ce que la Veillée Numérique permet">
        <DocList
          items={[
            <>À un membre de la diaspora d'enregistrer un aîné depuis n'importe où.</>,
            <>À un chercheur de constituer un corpus exploitable.</>,
            <>À un enfant de découvrir l'histoire d'un grand-parent qu'il n'a pas connu.</>,
            <>À Sakata d'accumuler un actif culturel <strong>irreproductible</strong>.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Le flux utilisateur" eyebrow="Expérience">
      <DocList
        ordered
        items={[
          <><strong>Préparation :</strong> Le contributeur crée une « veillée » avec métadonnées (nom du Doyen, lieu, sujet probable, langue principale).</>,
          <><strong>Enregistrement :</strong> Audio uniquement (50 MB max) ou audio+vidéo (200 MB max). Upload résumable pour résilience 3G.</>,
          <><strong>Transcription :</strong> Whisper en arrière-plan détecte la langue et transcrit. Délai estimé : 1-3 min pour 30 min d'audio.</>,
          <><strong>Validation manuelle :</strong> Le contributeur relit la transcription, corrige les noms propres et expressions kisakata.</>,
          <><strong>Traduction :</strong> Gemini traduit dans les 5 autres langues. Le contributeur peut ajuster.</>,
          <><strong>Tagging IA :</strong> Gemini suggère des thèmes, lieux, personnages, époques. Le contributeur valide.</>,
          <><strong>Cross-référencement :</strong> Affichage des articles existants en lien (via embeddings Pinecone).</>,
          <><strong>Publication :</strong> Veillée visible (privée par défaut, public sur demande de la famille).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Stack technique — choix justifiés" eyebrow="Architecture">
      <DocSubsection title="Capture audio/vidéo navigateur">
        <DocCode lang="typescript">{`navigator.mediaDevices.getUserMedia({ audio: true, video: true })
const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });`}</DocCode>
        <DocCallout type="info" title="Pourquoi Opus">
          Opus est le meilleur codec audio gratuit en 2026 : qualité vocale supérieure
          à MP3 à débit moitié moindre, supporté nativement par Whisper. L'AAC est
          mieux pour la musique mais inutile ici.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Upload résumable : tus.io">
        <DocTable
          headers={["Option", "Pour", "Contre", "Verdict"]}
          rows={[
            [
              "Upload simple Supabase",
              "Déjà en place pour les vidéos",
              "Crash → recommencer 200 MB depuis le début",
              "❌ Inacceptable pour la diaspora 3G",
            ],
            [
              "Tus.io via @uppy/tus",
              "Reprise après coupure, supporté Supabase Storage v2",
              "Plus de complexité, dépendance",
              "✅ Retenu",
            ],
            [
              "Service tiers (UploadThing, Tigris)",
              "Optimisé, CDN global",
              "Coût mensuel, vendor lock",
              "🟡 À reconsidérer si volume",
            ],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Transcription : Whisper local ou API ?">
        <DocTable
          headers={["Option", "Coût", "Qualité kisakata", "Latence", "Verdict"]}
          rows={[
            ["OpenAI Whisper API", "0.006$/min", "Inconnue, à tester", "Rapide (cloud)", "✅ Démarrage"],
            ["Whisper self-hosted (faster-whisper)", "GPU à louer", "Identique", "Plus lent sans GPU", "🟡 Si volume > 10k min/mois"],
            ["Whisper fine-tuné kisakata", "Coût training + hosting", "Potentiellement très bonne", "Identique", "🟡 Phase 2 (Q4 2026)"],
            ["Gemini 1.5 Pro (audio understanding)", "Inclus dans plan existant", "Très bonne pour FR/EN, à tester langues bantu", "Lent (sync)", "✅ Backup pour FR"],
          ]}
        />

        <DocCallout type="decision" title="Stratégie hybride">
          <DocList
            items={[
              <>Démarrer avec <strong>OpenAI Whisper API</strong> (large-v3) pour le MVP.</>,
              <>Mesurer la qualité sur 50 enregistrements kisakata réels.</>,
              <>Si {`<`} 70% précision, lancer un fine-tuning ciblé sur des datasets bantu.</>,
              <>Mettre en place un mécanisme de correction crowdsourcée — chaque correction utilisateur enrichit le dataset de fine-tuning.</>,
            ]}
          />
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Traduction : Gemini 1.5 Pro">
        <DocP>
          Déjà intégré dans Sakata pour la traduction d'articles. Peut être réutilisé
          tel quel pour la Veillée. Particularités à noter :
        </DocP>
        <DocList
          items={[
            <>Pour les langues bantu, prompter explicitement avec contexte culturel (« traduit ce récit Sakata en kisakata en préservant les marqueurs de respect aux ancêtres »).</>,
            <>Maintenir un glossaire de termes intraduisibles (Ngongo, Mboka, Likonde) qui doivent rester en kisakata même dans la version française.</>,
            <>Tokens : 30 min de récit ≈ 6 000 mots ≈ 8 000 tokens en sortie. Coût Gemini 1.5 Pro ≈ 0.025$ par traduction.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Tagging & cross-référencement">
        <DocP>
          Pinecone est déjà en place pour la recherche sémantique. La Veillée s'y
          branche naturellement :
        </DocP>
        <DocList
          ordered
          items={[
            <>Embedding du transcript via <DocInline>text-embedding-3-large</DocInline> (OpenAI) ou Gemini.</>,
            <>Stockage dans Pinecone avec metadata : type=« veillee », lang, date, tags.</>,
            <>Recherche des 5 plus proches voisins parmi les articles existants → suggestions de cross-référencement.</>,
            <>Tagging par <DocInline>Gemini</DocInline> avec un prompt structuré (output JSON typé).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Schéma DB">
        <DocCode lang="sql">{`CREATE TABLE veillees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contributor_id UUID REFERENCES profiles(id),
  doyen_name TEXT NOT NULL,
  doyen_birth_year INT,
  doyen_origin TEXT,
  recorded_at DATE,
  language_primary TEXT NOT NULL,
  audio_url TEXT,
  video_url TEXT,
  transcript_raw TEXT,                    -- Sortie Whisper
  transcript_validated TEXT,              -- Après revue humaine
  translations JSONB,                     -- {fr, en, lin, swa, tsh}
  tags JSONB,                             -- {themes, lieux, personnages, epoque}
  cross_references UUID[],                -- IDs d'articles liés
  visibility TEXT DEFAULT 'private',      -- private, family, public
  status TEXT DEFAULT 'draft',            -- draft, processing, ready, published
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_veillees_status ON veillees(status);
CREATE INDEX idx_veillees_visibility ON veillees(visibility) WHERE visibility = 'public';`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'implémentation — 5 sprints" eyebrow="Exécution">
      <DocSubsection title="Sprint 1 — Schéma + capture (1 semaine)">
        <DocList
          ordered
          items={[
            <>Migration DB : table <DocInline>veillees</DocInline>, RLS strictes.</>,
            <>Bucket Storage <DocInline>veillee-recordings</DocInline> avec policies.</>,
            <>Composant <DocInline>VeilleeRecorder</DocInline> avec MediaRecorder + preview.</>,
            <>Page <DocInline>/veillee/new</DocInline> formulaire de métadonnées.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Upload résumable + storage (1 semaine)">
        <DocList
          ordered
          items={[
            <>Intégration <DocInline>@uppy/tus</DocInline> avec endpoint Supabase.</>,
            <>Indicateur de progression réelle, retry auto, pause/reprise.</>,
            <>Tests sur 200 MB en 3G simulé.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Pipeline IA (2 semaines)">
        <DocList
          ordered
          items={[
            <>Edge function Supabase <DocInline>process-veillee</DocInline> déclenchée par webhook upload-complete.</>,
            <>Appel Whisper API, stockage transcript_raw.</>,
            <>Pipeline Gemini : tagging structuré (JSON output) + traductions.</>,
            <>Embeddings + insertion Pinecone.</>,
            <>Cross-référencement via top-K Pinecone.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 4 — Validation humaine (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/veillee/[id]/edit</DocInline> avec 3 colonnes : audio, transcript, traductions.</>,
            <>Édition inline avec sauvegarde auto.</>,
            <>Validation finale par admin avant publication.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 5 — Affichage public + carte 3D (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/veillee/[slug]</DocInline> : lecteur audio/vidéo synchronisé avec le transcript karaoké-style.</>,
            <>Sélecteur de langue inline.</>,
            <>Marqueurs sur la carte Géographie 3D : un point par lieu d'origine de Doyen.</>,
            <>Filtrage par thème, époque, lieu.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Coût estimé pour 100 veillées/mois" eyebrow="Modèle économique">
      <DocTable
        headers={["Service", "Volume", "Coût"]}
        rows={[
          ["Whisper API", "30 min × 100 = 3 000 min", "18€"],
          ["Gemini traductions", "100 × 6 langues × 0.025$", "15€"],
          ["Gemini tagging", "100 × 0.005$", "0.50€"],
          ["Embeddings + Pinecone", "100 × 0.001$ + tier", "1€ + 70€/mois plan starter"],
          ["Storage Supabase", "100 × 100 MB = 10 GB", "0.20€ (au-delà du free tier)"],
          ["Total estimé", "100 veillées/mois", "≈ 105€/mois"],
        ]}
      />
      <DocCallout type="success" title="Justification Premium">
        Avec un Premium à 12€/mois, il suffit de <strong>9 abonnés supplémentaires</strong>{" "}
        pour amortir le coût IA mensuel. Le ROI est là dès la première année si la
        feature est marketée correctement.
      </DocCallout>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Whisper transcrit mal le kisakata", "Élevée", "Très haut", "Hybrid avec correction humaine + collecte de dataset pour fine-tune"],
          ["Coût IA explose au succès", "Moyenne", "Moyen", "Quotas par tier (free: 1/mois, premium: 5/mois)"],
          ["Réticence familles (vie privée)", "Moyenne", "Haut", "Visibilité 'private' par défaut, opt-in public explicite"],
          ["Vidéo trop lourde 3G", "Élevée", "Moyen", "Mode audio-only par défaut, vidéo opt-in"],
          ["Whisper mauvais sur dialectes mixtes", "Élevée", "Moyen", "Permettre éditeur multi-langue dans le transcript"],
        ]}
      />
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>Q4 2026 (3 mois après lancement) :</strong> 50 veillées publiées, 5 institutions partenaires intéressées.</>,
          <><strong>Q2 2027 :</strong> 500 veillées, mention dans au moins 1 publication académique.</>,
          <><strong>Q4 2027 :</strong> 2 000 veillées, partenariat signé avec MRAC Tervuren ou Inalco.</>,
        ]}
      />
    </DocSection>
  </>
);
