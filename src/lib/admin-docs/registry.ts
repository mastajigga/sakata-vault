import type { DocEntry } from "./types";

import * as videoUpload from "./content/feature-video-upload";
import * as chatMessaging from "./content/feature-chat-messaging";
import * as authPaywall from "./content/feature-auth-paywall";
import * as constants from "./content/feature-constants-architecture";
import * as roadmap12m from "./content/roadmap-12-months";
import * as pwaMobile from "./content/roadmap-pwa-mobile";
import * as veillee from "./content/roadmap-veillee-numerique";
import * as seo from "./content/roadmap-seo-discovery";

export const ALL_DOCS: DocEntry[] = [
  { ...videoUpload.meta, Content: videoUpload.Content },
  { ...chatMessaging.meta, Content: chatMessaging.Content },
  { ...authPaywall.meta, Content: authPaywall.Content },
  { ...constants.meta, Content: constants.Content },
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
