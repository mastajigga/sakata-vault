export const DB_TABLES = {
  PROFILES: "profiles",
  CHAT_MESSAGES: "chat_messages",
  CHAT_PARTICIPANTS: "chat_participants",
  CHAT_CONVERSATIONS: "chat_conversations",
  ARTICLES: "articles",
  ARTICLE_LIKES: "article_likes",
  SITE_ANALYTICS: "site_analytics",
  ECOLE_SEMANTIC_CACHE: "ecole_semantic_cache",
  ECOLE_PROGRESS: "ecole_progress",
  ECOLE_ATTEMPTS: "ecole_attempts",
  FORUM_CATEGORIES: "forum_categories",
  FORUM_THREADS: "forum_threads",
  FORUM_POSTS: "forum_posts",
  FORUM_REACTIONS: "forum_reactions",
  PROFILE_GALLERY: "profile_gallery",
  USER_GALLERY: "user_gallery",
  CHAT_REACTIONS: "chat_reactions",
  PUSH_SUBSCRIPTIONS: "push_subscriptions",
  ECOLE_SCORES: "ecole_scores",
  CONTRIBUTION_REQUESTS: "contribution_requests",
  LANGUE_PROGRESS: "langue_progress",
  SUBSCRIPTION_SESSIONS: "subscription_sessions",
  CHAT_SUBSCRIPTIONS: "chat_subscriptions",
  MESSAGE_READS: "message_reads",
  COMMUNITY_PINS: "community_pins",
  ADMIN_NOTES: "admin_notes",
  MODERATION_REPORTS: "moderation_reports",
  MODERATION_LOGS: "moderation_logs",
  MODERATION_WARNINGS: "moderation_warnings",
  FAMILY_TREE: "family_tree",
  SUBSCRIPTION_GRANTS: "subscription_grants",
  ACTIVE_SUBSCRIPTION_GRANTS: "active_subscription_grants",
  FORUM_NOTIFICATIONS: "forum_notifications",
} as const;

export type DbTable = typeof DB_TABLES[keyof typeof DB_TABLES];

export const DB_BUCKETS = {
  CHAT_ATTACHMENTS: "chat_attachments",
  AVATARS: "avatars",
  ARTICLE_VIDEOS: "article-videos",
} as const;

export type DbBucket = typeof DB_BUCKETS[keyof typeof DB_BUCKETS];

export const DB_RPC = {
  /** Article public avec `content` tronqué côté serveur si l'appelant n'a pas l'accès premium. */
  GET_ARTICLE: "get_article",
  /** Ligne article complète (content inclus) — staff éditorial ou auteur uniquement. */
  GET_ARTICLE_FULL: "get_article_full",
} as const;

/**
 * Colonnes publiques de `articles` lisibles directement (anon/authenticated).
 * `content` n'est PAS lisible en direct (REVOKE SELECT (content)) : passer par DB_RPC.GET_ARTICLE.
 */
export const ARTICLE_LIST_COLUMNS =
  "id, slug, title, summary, category, featured_image, created_at, likes_count, reads_count, is_premium, article_type";
