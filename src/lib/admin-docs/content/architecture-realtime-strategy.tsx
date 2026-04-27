import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "architecture-realtime-strategy",
  title: "Stratégie Realtime — WebSocket & Subscriptions",
  subtitle:
    "Patterns critiques pour les subscriptions Supabase Realtime : anti-loop, gestion d'erreur, garde isMounted, et stale closures.",
  category: "architecture",
  order: 3,
  readTime: 7,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["realtime", "websocket", "react-patterns", "anti-patterns"],
  summary:
    "Toutes les règles d'or pour ne pas avoir de bugs subtils en Realtime — accumulés via 3 audits successifs.",
};

export const Content = () => (
  <>
    <DocLead>
      Le Realtime de Supabase est puissant mais traître. Une mauvaise dépendance dans
      un useEffect, un setLoading mal placé, un userId capturé en closure — et la
      magie devient cauchemar. Ces règles sont le fruit de trois audits de code
      successifs.
    </DocLead>

    <DocSection title="Règle 1 — Anti-loop subscription" eyebrow="Le bug le plus courant">
      <DocCallout type="error" title="❌ Anti-pattern">
        <DocCode lang="typescript">{`// MAUVAIS : setLoading(true) dans le callback
channel.on("postgres_changes", ..., () => {
  setLoading(true);
  await fetchData();
  setLoading(false);
});

// → Re-render à chaque event
// → useEffect se ré-exécute
// → Nouvelle subscription créée
// → Boucle visible (spinner clignote)`}</DocCode>
      </DocCallout>
      <DocCallout type="success" title="✅ Pattern correct">
        <DocCode lang="typescript">{`async function fetchData(showLoading = false) {
  if (isFetchingRef.current) return;
  isFetchingRef.current = true;
  if (showLoading) setLoading(true);
  try { /* ... */ } finally {
    isFetchingRef.current = false;
    if (showLoading) setLoading(false);
  }
}

// Initial mount → spinner OK
fetchData(true);

// Realtime callback → silent refetch
channel.on("postgres_changes", ..., () => fetchData(false));`}</DocCode>
      </DocCallout>
    </DocSection>

    <DocSection title="Règle 2 — Toujours un handler d'erreur subscribe" eyebrow="Visibilité">
      <DocP>
        Sans handler d'erreur, une déconnexion WebSocket (mode veille, changement
        Wi-Fi) est <strong>invisible</strong>. L'utilisateur croit que le chat
        fonctionne, mais aucun nouveau message n'arrive jamais.
      </DocP>
      <DocCode lang="typescript">{`channel.subscribe((status, err) => {
  if (status === "CHANNEL_ERROR" || status === "CLOSED" || err) {
    console.error("[Realtime] Channel error:", { status, err });
    // 1. Marquer le state comme "déconnecté"
    setRealtimeStatus("disconnected");
    // 2. Tenter une reconnexion après backoff
    setTimeout(() => recreateChannel(), 2000);
  }
  if (status === "SUBSCRIBED") {
    setRealtimeStatus("connected");
  }
});`}</DocCode>
    </DocSection>

    <DocSection title="Règle 3 — Garde isMounted avant channel async" eyebrow="Memory leaks">
      <DocP>
        Quand un useEffect contient une fonction async qui crée un channel, le
        composant peut se démonter avant que le channel soit prêt. Sans garde, on
        crée des channels orphelins qui consomment des ressources.
      </DocP>
      <DocCode lang="typescript">{`useEffect(() => {
  let isMounted = true;

  async function setup() {
    const data = await fetchInitial();
    if (!isMounted) return;  // ← critique

    const channel = supabase.channel(\`thread:\${threadId}\`)
      .on("postgres_changes", ..., handleEvent)
      .subscribe();

    channelRef.current = channel;
  }

  setup();

  return () => {
    isMounted = false;
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }
  };
}, [threadId]);`}</DocCode>
    </DocSection>

    <DocSection title="Règle 4 — Pas d'arrays d'objets dans les dep arrays" eyebrow="Stable refs">
      <DocCallout type="error" title="❌ Anti-pattern">
        <DocCode lang="typescript">{`useEffect(() => {
  const channel = supabase.channel(...);
  // ...
}, [messages]);  // messages est un array → ref change à chaque render`}</DocCode>
      </DocCallout>
      <DocCallout type="success" title="✅ Pattern correct">
        <DocCode lang="typescript">{`// Synchroniser via ref, mais ne pas dépendre dans le useEffect principal
const messagesRef = useRef(messages);
useEffect(() => { messagesRef.current = messages; }, [messages]);

useEffect(() => {
  const channel = supabase.channel(...).on(..., () => {
    // Toujours messagesRef.current, pas messages
    const latest = messagesRef.current;
    // ...
  });
}, []);  // pas de deps fluctuantes`}</DocCode>
      </DocCallout>
    </DocSection>

    <DocSection title="Règle 5 — Stale closures sur userId / props" eyebrow="Référentiel">
      <DocP>
        Une subscription créée au mount capture <DocInline>userId</DocInline> en
        closure. Si l'auth change (rotation, switch d'onglet), le channel garde
        l'ancien <DocInline>userId</DocInline>.
      </DocP>
      <DocCode lang="typescript">{`const userIdRef = useRef(userId);
useEffect(() => { userIdRef.current = userId; }, [userId]);

useEffect(() => {
  const channel = supabase.channel(...).on(..., (payload) => {
    if (payload.new.recipient_id === userIdRef.current) {
      // valeur fraîche, toujours à jour
      handleNewMessage(payload.new);
    }
  });
}, []);`}</DocCode>
    </DocSection>

    <DocSection title="Règle 6 — Filtrer les events côté client si filtre serveur impossible" eyebrow="Performance">
      <DocP>
        Le filtre Supabase Realtime ne supporte que <DocInline>=</DocInline> sur une
        seule colonne. Pour des conditions plus complexes, vérifier dans le callback :
      </DocP>
      <DocCode lang="typescript">{`channel.on("postgres_changes",
  { event: "INSERT", schema: "public", table: "chat_messages" },
  (payload) => {
    // Filtrer côté client : seulement nos conversations
    if (!ourConversationIds.has(payload.new.conversation_id)) return;
    // ...
  }
);`}</DocCode>
    </DocSection>

    <DocSection title="Règle 7 — broadcast pour l'éphémère, postgres_changes pour le persisté" eyebrow="Choix du canal">
      <DocTable
        headers={["Cas d'usage", "Mode", "Pourquoi"]}
        rows={[
          ["Nouveau message chat", "postgres_changes", "Persisté + Realtime"],
          ["Indicateur de frappe", "broadcast", "Éphémère, 0 écriture DB"],
          ["Réaction emoji ajoutée", "postgres_changes", "Persisté + Realtime"],
          ["Présence (online/offline)", "presence", "API dédiée Supabase"],
          ["Curseur en édition collab", "broadcast", "Volume très élevé, pas besoin de log"],
        ]}
      />
    </DocSection>

    <DocSection title="Règle 8 — Activer la publication Realtime sur la table" eyebrow="Configuration">
      <DocP>
        Beaucoup d'heures perdues à debugger « pourquoi je ne reçois pas les events ».
        Réponse : la table n'est pas dans la publication Realtime de Postgres.
      </DocP>
      <DocCode lang="sql">{`ALTER PUBLICATION supabase_realtime
  ADD TABLE chat_messages, forum_messages, forum_reactions;`}</DocCode>
      <DocCallout type="warning" title="À vérifier">
        Cette config se fait via Supabase Studio ou migration SQL — facile à oublier
        en local mais critique en prod.
      </DocCallout>
    </DocSection>

    <DocSection title="Checklist nouveau channel Realtime" eyebrow="Discipline">
      <DocList
        ordered
        items={[
          <>Garde <DocInline>isMounted</DocInline> avant <DocInline>supabase.channel</DocInline>.</>,
          <>Refs synchronisées pour toutes les valeurs « volatiles » utilisées dans le callback.</>,
          <>Handler d'erreur sur <DocInline>.subscribe()</DocInline>.</>,
          <>Cleanup avec <DocInline>removeChannel</DocInline> dans le return du useEffect.</>,
          <>Filtres côté client si nécessaire.</>,
          <>Ne JAMAIS appeler <DocInline>setLoading(true)</DocInline> dans le callback.</>,
          <>Vérifier que la table est dans la publication Realtime.</>,
        ]}
      />
    </DocSection>
  </>
);
