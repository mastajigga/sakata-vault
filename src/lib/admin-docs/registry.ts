import type { DocEntry } from "./types";

// ── Original 8 ──
import * as videoUpload from "./content/feature-video-upload";
import * as chatMessaging from "./content/feature-chat-messaging";
import * as authPaywall from "./content/feature-auth-paywall";
import * as constants from "./content/feature-constants-architecture";
import * as roadmap12m from "./content/roadmap-12-months";
import * as pwaMobile from "./content/roadmap-pwa-mobile";
import * as veillee from "./content/roadmap-veillee-numerique";
import * as seo from "./content/roadmap-seo-discovery";

// ── Wave 1 (10 nouveaux) ──
import * as forumMboka from "./content/feature-forum-mboka";
import * as geographie3d from "./content/feature-geographie-3d";
import * as articleEditor from "./content/feature-article-editor";
import * as ecoleCurriculum from "./content/feature-ecole-curriculum";
import * as aiOrchestration from "./content/feature-ai-orchestration";
import * as pineconeSearch from "./content/feature-pinecone-search";
import * as rlsSupabase from "./content/architecture-rls-supabase";
import * as realtimeStrategy from "./content/architecture-realtime-strategy";
import * as cacheStrategy from "./content/architecture-cache-strategy";
import * as trafficControl from "./content/architecture-traffic-control-proxy";

export const ALL_DOCS: DocEntry[] = [
  // Features
  { ...videoUpload.meta, Content: videoUpload.Content },
  { ...chatMessaging.meta, Content: chatMessaging.Content },
  { ...authPaywall.meta, Content: authPaywall.Content },
  { ...forumMboka.meta, Content: forumMboka.Content },
  { ...geographie3d.meta, Content: geographie3d.Content },
  { ...articleEditor.meta, Content: articleEditor.Content },
  { ...ecoleCurriculum.meta, Content: ecoleCurriculum.Content },
  { ...aiOrchestration.meta, Content: aiOrchestration.Content },
  { ...pineconeSearch.meta, Content: pineconeSearch.Content },

  // Architecture
  { ...constants.meta, Content: constants.Content },
  { ...rlsSupabase.meta, Content: rlsSupabase.Content },
  { ...realtimeStrategy.meta, Content: realtimeStrategy.Content },
  { ...cacheStrategy.meta, Content: cacheStrategy.Content },
  { ...trafficControl.meta, Content: trafficControl.Content },

  // Roadmap
  { ...roadmap12m.meta, Content: roadmap12m.Content },
  { ...pwaMobile.meta, Content: pwaMobile.Content },
  { ...veillee.meta, Content: veillee.Content },
  { ...seo.meta, Content: seo.Content },
];

export const getDocBySlug = (slug: string): DocEntry | undefined =>
  ALL_DOCS.find((d) => d.slug === slug);

export const getDocsByCategory = (category: DocEntry["category"]): DocEntry[] =>
  ALL_DOCS.filter((d) => d.category === category).sort(
    (a, b) => a.order - b.order
  );
