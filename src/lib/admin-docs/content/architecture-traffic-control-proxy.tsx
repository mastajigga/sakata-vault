import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-traffic-control-proxy",
  title: "Traffic Control Proxy Supabase",
  subtitle:
    "File d'attente de requêtes avec limite de concurrence et priorisation, instrumentée pour observabilité réseau fine.",
  category: "architecture",
  order: 5,
  readTime: 5,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["proxy", "performance", "concurrency", "observability"],
  summary:
    "Pourquoi limiter à 4 requêtes Postgrest simultanées, comment prioriser les profils, et obligation des AbortController.",
};

export const Content = () => (
  <>
    <DocLead>
      Sans contrôle, un composant React monté simultanément avec d'autres peut
      lancer 20 requêtes Supabase en parallèle. Les sockets se saturent, l'auth
      timeout, le chat se déconnecte. Le proxy de traffic control est la solution
      maison pour garantir que les sockets prioritaires (auth, profils) sont
      toujours dispos.
    </DocLead>

    <DocSection title="Pourquoi" eyebrow="Problème">
      <DocP>
        Supabase Postgrest tourne sur HTTP/1.1 par défaut côté navigateur. La plupart
        des navigateurs limitent à 6 connexions parallèles par origine. Si on en
        consomme 6 simultanément pour des SELECT lourds, plus aucune n'est dispo
        pour :
      </DocP>
      <DocList
        items={[
          <>Refresh du JWT auth (bloque l'utilisateur).</>,
          <>Heartbeat WebSocket Realtime (chat se croit déconnecté).</>,
          <>Chargement des assets statiques (avatars, images).</>,
        ]}
      />
      <DocCallout type="decision" title="Solution">
        Limiter à <strong>4 requêtes Postgrest simultanées</strong>, garder 2 sockets
        libres pour Auth et assets. File d'attente FIFO avec priorisation des appels
        critiques.
      </DocCallout>
    </DocSection>

    <DocSection title="Implémentation" eyebrow="Code">
      <DocSubsection title="Le proxy enveloppant le client">
        <DocCode lang="typescript" caption="src/lib/supabase.ts (extrait)">{`const MAX_CONCURRENT = 4;
let activeRequests = 0;
const requestQueue: QueueEntry[] = [];

async function acquireRequest(callName: string, isPriority = false) {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return;
  }
  return new Promise<void>(resolve => {
    if (requestQueue.length > 5) {
      console.warn(\`[NET-SATURATION] File d'attente: \${requestQueue.length}\`);
    }
    requestQueue.push({ resolve, callName, isPriority });
  });
}

function releaseRequest() {
  activeRequests--;
  if (requestQueue.length > 0) {
    // Priorité aux requêtes critiques
    const nextIndex = requestQueue.findIndex(q => q.isPriority);
    const next = nextIndex !== -1
      ? requestQueue.splice(nextIndex, 1)[0]
      : requestQueue.shift();

    if (next) {
      activeRequests++;
      next.resolve();
    }
  }
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Priorisation des appels profile">
        <DocP>
          Un appel <DocInline>from("profiles")</DocInline> est marqué automatiquement
          comme prioritaire — c'est ce dont l'auth dépend pour vérifier les rôles.
        </DocP>
        <DocCode lang="typescript">{`if (prop === "then") {
  return (onfulfilled, onrejected) => {
    const isPriority = callName.includes("profiles");

    return acquireRequest(callName, isPriority).then(() => {
      // ... exécuter la requête
    });
  };
}`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Logs structurés" eyebrow="Observabilité">
      <DocTable
        headers={["Tag", "Sens"]}
        rows={[
          [<DocInline>[NET-QUEUE-WAIT]</DocInline>, "Une requête a dû attendre dans la file"],
          [<DocInline>[NET-QUEUE-EXEC]</DocInline>, "Une requête de la file s'exécute"],
          [<DocInline>[NET-START]</DocInline>, "Une requête démarre directement (slot libre)"],
          [<DocInline>[NET-RESOLVED]</DocInline>, "Une requête a abouti (succès ou erreur)"],
          [<DocInline>[NET-SATURATION]</DocInline>, "File > 5 → alerte, possible bug"],
          [<DocInline>[NET-ERROR]</DocInline>, "Requête en erreur, avec callName + ID"],
        ]}
      />
      <DocCallout type="info" title="Debug rapide">
        Filter Chrome DevTools sur <DocInline>[NET-</DocInline> donne immédiatement
        une vue waterfall de toutes les requêtes Supabase et leur état.
      </DocCallout>
    </DocSection>

    <DocSection title="Obligation : AbortController" eyebrow="Règle absolue">
      <DocCallout type="error" title="Sans AbortController, leak garanti">
        Quand un composant se démonte, ses requêtes en cours <strong>doivent être
        abandonnées</strong>. Sinon elles consomment un slot du proxy après le démontage.
      </DocCallout>
      <DocCode lang="typescript">{`useEffect(() => {
  const controller = new AbortController();

  async function fetch() {
    const { data, error } = await supabase
      .from("articles")
      .select()
      .abortSignal(controller.signal);

    if (controller.signal.aborted) return;
    setArticles(data);
  }

  fetch();

  return () => controller.abort();  // ← OBLIGATOIRE
}, []);`}</DocCode>
    </DocSection>

    <DocSection title="Cas limites" eyebrow="À connaître">
      <DocSubsection title="Realtime (WebSocket) hors proxy">
        <DocP>
          Le proxy n'intercepte que <DocInline>from()</DocInline> et{" "}
          <DocInline>rpc()</DocInline>. Les channels Realtime utilisent un WebSocket
          dédié et ne consomment pas de slot HTTP — c'est intentionnel.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Storage hors proxy">
        <DocP>
          Les uploads/downloads via <DocInline>supabase.storage</DocInline> ne passent
          pas par le proxy. Pour les gros fichiers (vidéo héro), c'est correct — ils
          ont leurs propres limites de bande passante.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Tuning de MAX_CONCURRENT" eyebrow="Calibrage">
      <DocP>
        Pourquoi 4 et pas 6 ? Compromis empirique :
      </DocP>
      <DocList
        items={[
          <><strong>2 :</strong> trop conservateur, file s'accumule en burst.</>,
          <><strong>4 :</strong> sweet spot — garantit auth/assets dispos.</>,
          <><strong>6 :</strong> sature, l'auth peut timeout en burst.</>,
          <><strong>8+ :</strong> dépasse la limite navigateur, requêtes en attente même sans proxy.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Limitations & évolutions" eyebrow="À savoir">
      <DocList
        items={[
          <>Le proxy est in-memory : si on a plusieurs onglets, chacun a sa propre file.</>,
          <>Pas de circuit breaker — un Supabase down sature la file indéfiniment (timeout fallback à ajouter).</>,
          <>HTTP/2 sur Supabase pourrait rendre le proxy moins critique (à monitorer).</>,
        ]}
      />
    </DocSection>
  </>
);
