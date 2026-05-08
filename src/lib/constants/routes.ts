export const ROUTES = {
  HOME: "/",
  SAVOIR: "/savoir",
  ECOLE: "/ecole",
  GEOGRAPHIE: "/geographie",
  LANGUE: "/langue",
  FORUM: "/forum",
  MEMBRES: "/membres",
  CHAT: "/chat",
  PREMIUM: "/premium",
  PROFIL: "/profil",
  AUTH: "/auth",
  ADMIN: "/admin",
  ADMIN_FORUM: "/admin/forum",
  ADMIN_LOGS: "/admin/logs",
  ADMIN_USERS: "/admin/users",
  // Nouvelles pages communautaires
  GENEALOGIE: "/genealogie",
  CALENDRIER: "/calendrier",
  // Contributeur — new
  CONTRIBUTEUR: "/contributeur",
  CONTRIBUTEUR_GUIDE: "/contributeur/guide",
  ARTICLE_NEW: "/admin/article/new",
  CONTRIBUTION_REQUESTS: "/admin/contribution-requests",
  // Help — new
  HELP_PHILOSOPHY: "/help/philosophy",
  HELP_STACK: "/help/stack",
  HELP_CHANGELOG: "/help/changelog",
  HELP_GUIDELINES: "/help/guidelines",
  HELP_GDPR: "/help/gdpr",
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
