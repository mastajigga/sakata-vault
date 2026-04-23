/**
 * withRetry — Wrapper de retry avec backoff exponentiel pour les appels Supabase.
 *
 * Utilisé pour les appels critiques (fetch messages, sendMessage, fetchProfile)
 * afin de survivre aux micro-coupures réseau (mobile, WiFi instable) et aux
 * fenêtres de rotation de token JWT.
 *
 * Backoff : 300ms → 900ms → 2700ms (x3 par défaut)
 *
 * Usage:
 *   const data = await withRetry(() =>
 *     supabase.from("profiles").select("role").eq("id", userId).single()
 *   );
 */

const DEFAULT_MAX_RETRIES = 3;
const BASE_DELAY_MS = 300;

/** Erreurs réseau sur lesquelles on retente (pas les erreurs RLS/auth métier) */
const RETRYABLE_MESSAGES = [
  "Failed to fetch",
  "NetworkError",
  "network error",
  "ETIMEDOUT",
  "ECONNRESET",
  "fetch failed",
  "Load failed",
  "released because another request stole it",
  "Lock was released",
];

function isRetryable(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return RETRYABLE_MESSAGES.some((pattern) => msg.includes(pattern));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<{ data: T | null; error: any }>,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<{ data: T | null; error: any }> {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();

      // Si c'est une erreur réseau Supabase (pas une erreur métier RLS), on retente
      if (result.error && isRetryable(result.error)) {
        lastError = result.error;
        if (attempt < maxRetries) {
          const waitMs = BASE_DELAY_MS * Math.pow(3, attempt);
          console.warn(`[withRetry] Tentative ${attempt + 1}/${maxRetries} échouée. Retry dans ${waitMs}ms...`, result.error?.message);
          await delay(waitMs);
          continue;
        }
        return result; // Dernière tentative — on retourne l'erreur
      }

      // Succès ou erreur métier (RLS, validation) → on retourne directement
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries && isRetryable(err)) {
        const waitMs = BASE_DELAY_MS * Math.pow(3, attempt);
        console.warn(`[withRetry] Exception tentative ${attempt + 1}/${maxRetries}. Retry dans ${waitMs}ms...`, err);
        await delay(waitMs);
        continue;
      }
      return { data: null, error: err };
    }
  }

  return { data: null, error: lastError };
}

/**
 * withRetryRaw — Version pour les fonctions qui retournent directement
 * une valeur (pas un objet { data, error }).
 * Exemple : supabase.auth.getSession()
 */
export async function withRetryRaw<T>(
  fn: () => Promise<T>,
  maxRetries: number = DEFAULT_MAX_RETRIES
): Promise<T> {
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries && isRetryable(err)) {
        const waitMs = BASE_DELAY_MS * Math.pow(3, attempt);
        console.warn(`[withRetryRaw] Exception tentative ${attempt + 1}/${maxRetries}. Retry dans ${waitMs}ms...`, err);
        await delay(waitMs);
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}
