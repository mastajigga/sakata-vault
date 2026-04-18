import { supabase } from "../supabase";

/**
 * Résout une URL d'image provenant de Supabase Storage ou d'une source externe.
 * Supporte :
 * - URLs HTTP(S) complètes (ex: avatars Google/Discord)
 * - Format 'storage:bucket/path'
 * - Chemins relatifs (assume le bucket spécifié, par défaut 'avatars')
 */
export function resolveStorageUrl(rawUrl: string | null | undefined, defaultBucket: string = "avatars"): string {
  if (!rawUrl || rawUrl.trim() === "") return "/images/placeholder-avatar.jpg";
  
  // URL complète
  if (rawUrl.startsWith("http")) return rawUrl;
  
  // Format storage:
  if (rawUrl.startsWith("storage:")) {
    try {
      const bucket = rawUrl.substring(8, rawUrl.indexOf("/", 8));
      const path = rawUrl.substring(rawUrl.indexOf("/", 8) + 1);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      console.error("[resolveStorageUrl] Error parsing storage path:", e);
      return "/images/placeholder-avatar.jpg";
    }
  }
  
  // Chemin relatif
  // Si contient un slash, on peut essayer d'extraire le bucket ou assumer le défaut
  // Ici on simplifie : si c'est un path, on utilise le bucket par défaut
  const { data } = supabase.storage.from(defaultBucket).getPublicUrl(rawUrl);
  return data.publicUrl;
}
