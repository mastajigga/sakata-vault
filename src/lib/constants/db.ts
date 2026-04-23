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
  SUBSCRIPTION_SESSIONS: "subscription_sessions",
  CHAT_SUBSCRIPTIONS: "chat_subscriptions",
  MESSAGE_READS: "message_reads",
  COMMUNITY_PINS: "community_pins",
} as const;

export type DbTable = typeof DB_TABLES[keyof typeof DB_TABLES];

export const DB_BUCKETS = {
  CHAT_ATTACHMENTS: "chat_attachments",
  AVATARS: "avatars",
} as const;

export type DbBucket = typeof DB_BUCKETS[keyof typeof DB_BUCKETS];
