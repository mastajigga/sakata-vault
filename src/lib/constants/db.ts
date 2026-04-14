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
  PROFILE_GALLERY: "profile_gallery",
  USER_GALLERY: "user_gallery",
} as const;

export type DbTable = typeof DB_TABLES[keyof typeof DB_TABLES];

export const DB_BUCKETS = {
  CHAT_ATTACHMENTS: "chat_attachments",
  AVATARS: "avatars",
} as const;

export type DbBucket = typeof DB_BUCKETS[keyof typeof DB_BUCKETS];
