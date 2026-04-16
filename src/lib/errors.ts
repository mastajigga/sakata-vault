// Centralized error message system with user-friendly mappings

export type ErrorCode =
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_SESSION_EXPIRED"
  | "AUTH_NETWORK"
  | "CHAT_SEND_FAILED"
  | "CHAT_LOAD_FAILED"
  | "CHAT_DELETE_FAILED"
  | "IMAGE_UPLOAD_FAILED"
  | "IMAGE_TOO_LARGE"
  | "DATABASE_CONFLICT"
  | "ARTICLE_SAVE_FAILED"
  | "ARTICLE_LOAD_FAILED"
  | "VALIDATION_FAILED"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

interface ErrorInfo {
  message: string;
  actionable: boolean;
  action?: string;
}

const ERROR_MAP: Record<ErrorCode, ErrorInfo> = {
  AUTH_INVALID_CREDENTIALS: {
    message: "Email ou mot de passe incorrect. Vérifie et réessaye.",
    actionable: true,
    action: "Recommencer",
  },
  AUTH_SESSION_EXPIRED: {
    message: "Ta session a expiré. Reconnecte-toi pour continuer.",
    actionable: true,
    action: "Se reconnecter",
  },
  AUTH_NETWORK: {
    message: "Problème de connexion. Vérifie ta connexion internet.",
    actionable: true,
    action: "Réessayer",
  },
  CHAT_SEND_FAILED: {
    message: "Le message n'a pas pu être envoyé. Réessaye.",
    actionable: true,
    action: "Renvoyer",
  },
  CHAT_LOAD_FAILED: {
    message: "Les messages n'ont pas pu charger. Actualise la page.",
    actionable: true,
    action: "Actualiser",
  },
  CHAT_DELETE_FAILED: {
    message: "Le message n'a pas pu être supprimé. Réessaye.",
    actionable: true,
    action: "Réessayer",
  },
  IMAGE_UPLOAD_FAILED: {
    message: "L'image n'a pas pu être téléchargée. Réessaye avec une autre image.",
    actionable: true,
    action: "Réessayer",
  },
  IMAGE_TOO_LARGE: {
    message: "L'image est trop grande (max 10 MB). Choisis une image plus petite.",
    actionable: false,
  },
  DATABASE_CONFLICT: {
    message: "Données en conflit. Actualise et réessaye.",
    actionable: true,
    action: "Actualiser",
  },
  ARTICLE_SAVE_FAILED: {
    message: "L'article n'a pas pu être sauvegardé. Vérifie tes données.",
    actionable: true,
    action: "Réessayer",
  },
  ARTICLE_LOAD_FAILED: {
    message: "L'article n'a pas pu charger. Réessaye.",
    actionable: true,
    action: "Réessayer",
  },
  VALIDATION_FAILED: {
    message: "Les données saisies ne sont pas valides. Corrige les erreurs.",
    actionable: false,
  },
  NETWORK_ERROR: {
    message: "Problème réseau. Vérifie ta connexion internet.",
    actionable: true,
    action: "Réessayer",
  },
  UNKNOWN_ERROR: {
    message: "Une erreur inattendue s'est produite. Réessaye.",
    actionable: true,
    action: "Réessayer",
  },
};

/**
 * Get user-friendly error message from error object or code
 */
export function getErrorMessage(error: unknown, fallbackCode: ErrorCode = "UNKNOWN_ERROR"): ErrorInfo {
  if (!error) return ERROR_MAP[fallbackCode];

  // If it's already an error code
  if (typeof error === "string" && error in ERROR_MAP) {
    return ERROR_MAP[error as ErrorCode];
  }

  // If it's an error object, try to infer the code
  const err = error as any;
  const message = err?.message?.toLowerCase() || "";

  if (message.includes("invalid login")) return ERROR_MAP.AUTH_INVALID_CREDENTIALS;
  if (message.includes("session")) return ERROR_MAP.AUTH_SESSION_EXPIRED;
  if (message.includes("network") || message.includes("fetch")) return ERROR_MAP.NETWORK_ERROR;
  if (message.includes("validation")) return ERROR_MAP.VALIDATION_FAILED;
  if (message.includes("constraint")) return ERROR_MAP.DATABASE_CONFLICT;

  return ERROR_MAP[fallbackCode];
}

/**
 * Create a standardized error with code for better error handling
 */
export class SakataError extends Error {
  constructor(
    public code: ErrorCode = "UNKNOWN_ERROR",
    message?: string
  ) {
    super(message || ERROR_MAP[code].message);
    this.name = "SakataError";
  }
}
