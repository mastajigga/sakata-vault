export const ROUTES = {
  HOME: "/",
  SAVOIR: "/savoir",
  ECOLE: "/ecole",
  GEOGRAPHIE: "/geographie",
  FORUM: "/forum",
  MEMBRES: "/membres",
  CHAT: "/chat",
  PREMIUM: "/premium",
  PROFIL: "/profil",
  AUTH: "/auth",
  ADMIN: "/admin",
  // Contributeur — new
  CONTRIBUTEUR: "/contributeur",
  CONTRIBUTEUR_GUIDE: "/contributeur/guide",
  ARTICLE_NEW: "/admin/article/new",
  CONTRIBUTION_REQUESTS: "/admin/contribution-requests",
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
