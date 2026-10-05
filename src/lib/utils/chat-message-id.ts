// Identifiants de messages du chat.
// Un message envoyé reçoit d'abord un id local "optimistic-<ts>" (useMessages.sendMessage)
// jusqu'à sa confirmation par le serveur. Cet id n'est PAS un UUID : il ne doit jamais
// être envoyé aux routes API ni à PostgREST.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const OPTIMISTIC_ID_PREFIX = "optimistic-";

export const PENDING_MESSAGE_ERROR = "Message en cours d'envoi, réessayez dans un instant.";

export function isUuid(id: unknown): id is string {
  return typeof id === "string" && UUID_RE.test(id);
}

export function isOptimisticMessage(message: { id: string }): boolean {
  return (
    (message as { isOptimistic?: boolean }).isOptimistic === true ||
    message.id.startsWith(OPTIMISTIC_ID_PREFIX) ||
    !isUuid(message.id)
  );
}
