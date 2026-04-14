export const ROUTES = {
  HOME: "/",
  SAVOIR: "/savoir",
  ECOLE: "/ecole",
  GEOGRAPHIE: "/geographie",
  FORUM: "/forum",
  MEMBRES: "/membres",
  CHAT: "/chat",
  PROFIL: "/profil",
  AUTH: "/auth",
  ADMIN: "/admin",
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
