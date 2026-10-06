export type ActivityType = 
  | "login" 
  | "comment" 
  | "like" 
  | "upload" 
  | "view_article" 
  | "admin_action";

/**
 * Neutralisé : l'ancienne implémentation lisait/écrivait `profiles.metadata`,
 * colonne qui n'existe pas en base (chaque appel échouait), et ce module n'a
 * aucun appelant. Conservé comme no-op pour ne casser aucun import éventuel.
 * Ne pas réactiver en lisant `profiles` : les colonnes privées ne sont plus
 * lisibles côté client (voir la RPC get_my_profile).
 */
export async function logUserActivity(_userId: string, _type: ActivityType, _details: string = ""): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[activity] logUserActivity est désactivé (profiles.metadata n'existe pas).");
  }
}
