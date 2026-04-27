import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-chat-messaging",
  title: "Messagerie Privée Temps Réel",
  subtitle:
    "Conversations 1-à-1 avec messages texte, audio, images éphémères, indicateurs de frappe et synchronisation temps réel via Supabase Realtime.",
  category: "feature",
  order: 2,
  readTime: 10,
  updatedAt: "2026-04-26",
  author: "Équipe Sakata",
  tags: ["realtime", "supabase", "ephemeral", "websocket"],
  summary:
    "Architecture du chat privé : pattern anti-boucle des subscriptions, gestion des images éphémères avec maxViews, et stratégies de stabilité réseau.",
};

export const Content = () => (
  <>
    <DocLead>
      La messagerie privée de Sakata est une expérience proche de WhatsApp/Signal :
      conversations 1-à-1, messages texte, vocaux, images éphémères, indicateurs de
      frappe en direct. Sa fiabilité repose sur quelques patterns critiques que tout
      changement futur doit respecter.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Accessible depuis <DocInline>/chat</DocInline>, la messagerie permet à deux
        utilisateurs authentifiés d'échanger en temps réel. Les fonctionnalités
        principales :
      </DocP>
      <DocList
        items={[
          <>Messages texte avec emoji, longueur illimitée pratique.</>,
          <>Enregistrement audio avec aperçu pré-envoi (style WhatsApp).</>,
          <>Images éphémères : visibles 1 ou 2 fois puis verrouillées.</>,
          <>Mode conversation temporaire (24h ou 48h, expiration auto).</>,
          <>Indicateur de frappe (typing) avec broadcast Realtime.</>,
          <>Statut de lecture par message (vu/non vu).</>,
          <>Détection de capture d'écran sur images éphémères (heuristique).</>,
        ]}
      />
    </DocSection>

    <DocSection title="Architecture" eyebrow="Vue d'ensemble">
      <DocSubsection title="Tables Supabase">
        <DocTable
          headers={["Table", "Rôle"]}
          rows={[
            [<DocInline>chat_conversations</DocInline>, "Conversation (id, créée_at, type, ephemeral_until)"],
            [<DocInline>chat_participants</DocInline>, "Lien M:N conversation ↔ user (lu_at, dernier accès)"],
            [<DocInline>chat_messages</DocInline>, "Messages (texte, attachments, expires_at, max_views)"],
            [<DocInline>chat_reactions</DocInline>, "Réactions emoji par message"],
            [<DocInline>chat_typing</DocInline>, "Présence de frappe (broadcast-only, pas persisté)"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Composants React">
        <DocList
          items={[
            <><DocInline>ChatSidebar</DocInline> — Liste des conversations, badges non-lus.</>,
            <><DocInline>ChatWindow</DocInline> — Fenêtre active, header dynamique.</>,
            <><DocInline>ChatInput</DocInline> — Saisie : texte, audio, image éphémère.</>,
            <><DocInline>MessageBubble</DocInline> — Rendu adaptatif par type de message.</>,
            <><DocInline>EphemeralImagePicker</DocInline> — Sélecteur de mode d'image (Normal / 1× / 2×).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Hooks">
        <DocList
          items={[
            <><DocInline>useConversations</DocInline> — Liste des conversations + Realtime.</>,
            <><DocInline>useMessages</DocInline> — Messages d'une conversation + Realtime + pagination.</>,
            <><DocInline>useTyping</DocInline> — Broadcast d'indicateur de frappe.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Pattern critique : anti-boucle de subscription" eyebrow="Architecture">
      <DocCallout type="warning" title="Bug subtil à éviter à tout prix">
        <DocP>
          Une mauvaise gestion du <DocInline>setLoading</DocInline> dans le callback
          d'une subscription Supabase crée une <strong>boucle infinie de spinner</strong>{" "}
          visible par l'utilisateur. Symptômes : page qui clignote en permanence,
          impossibilité d'interagir.
        </DocP>
      </DocCallout>

      <DocCode lang="typescript" caption="Pattern correct (useConversations.ts)">{`async function fetchConversations(showLoading = false) {
  if (isFetchingRef.current) return;   // 1. Garde concurrence
  isFetchingRef.current = true;
  if (showLoading) setLoading(true);   // 2. Spinner SEULEMENT au montage initial
  try {
    // ... fetch
  } finally {
    isFetchingRef.current = false;
    if (showLoading) setLoading(false);
  }
}

// Montage initial : oui, on veut le spinner
fetchConversations(true);

// Callback realtime : NON, surtout pas
channel.on("postgres_changes", ..., () => {
  fetchConversations(false);  // silent refetch
});`}</DocCode>

      <DocCallout type="error" title="Anti-pattern à proscrire">
        <DocCode lang="typescript">{`// ❌ NE JAMAIS FAIRE
channel.on("postgres_changes", ..., () => {
  setLoading(true);   // déclenche un re-render
  fetchConversations();  // qui se subscribe à nouveau
  // → boucle infinie
});`}</DocCode>
      </DocCallout>
    </DocSection>

    <DocSection title="Images éphémères" eyebrow="Sous-fonctionnalité">
      <DocP>
        Trois modes d'envoi d'image existent : <strong>normal</strong> (pas
        d'expiration), <strong>vue 1×</strong> (visible une fois puis verrouillée), et{" "}
        <strong>vue 2×</strong>. Implémenté via la colonne{" "}
        <DocInline>max_views</DocInline> sur <DocInline>chat_messages</DocInline> et un
        compteur côté client persisté en localStorage.
      </DocP>

      <DocSubsection title="Règle absolue : l'envoyeur voit toujours sa propre image">
        <DocP>
          Le bug initial : l'envoyeur lui-même voyait son image se verrouiller après
          avoir cliqué. Correction : vérifier <DocInline>isMe</DocInline> avant
          d'appliquer <DocInline>viewState = "locked"</DocInline>.
        </DocP>
        <DocCode lang="typescript">{`if (!isMe && viewedCount >= maxViews) {
  setViewState("locked");
}`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Persistence de l'état vu">
        <DocP>
          La clé localStorage est{" "}
          <DocInline>msgViewedKey(id)</DocInline> →{" "}
          <DocInline>"sakata-msg-viewed-{`{id}`}"</DocInline>. Le préfixe{" "}
          <DocInline>sakata-</DocInline> est obligatoire pour respecter la whitelist du
          AuthProvider — sans cela, la clé serait purgée au prochain bump de{" "}
          <DocInline>APP_VERSION</DocInline>.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Détection de capture d'écran">
        <DocP>
          Le navigateur ne peut pas vraiment détecter les screenshots, mais on peut
          intercepter quelques signaux :
        </DocP>
        <DocList
          items={[
            <><DocInline>visibilitychange</DocInline> + <DocInline>window.blur</DocInline> → l'utilisateur a basculé vers un autre onglet/app, suspect.</>,
            <>Application immédiate d'un overlay flou pendant l'absence de focus.</>,
            <>Skippé si <DocInline>isMe</DocInline> (l'envoyeur peut tout faire avec sa propre image).</>,
          ]}
        />
        <DocCallout type="info" title="Limite reconnue">
          Aucune méthode 100% fiable contre les screenshots côté navigateur. C'est une
          mesure dissuasive, pas une garantie cryptographique.
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Stale closure sur user.id dans les subscriptions">
        <DocP>
          Pattern courant : un <DocInline>useEffect</DocInline> qui crée un channel
          Supabase et utilise <DocInline>userId</DocInline> dans son callback. Quand
          l'utilisateur change (rotation token, switch d'onglet), le channel garde
          l'ancien <DocInline>userId</DocInline> en closure → bugs subtils.
        </DocP>
        <DocCode lang="typescript">{`// ✅ Solution : ref synchronisée
const userIdRef = useRef(userId);
useEffect(() => {
  userIdRef.current = userId;
}, [userId]);

useEffect(() => {
  const channel = supabase.channel(...).on(..., () => {
    // Toujours la valeur fraîche
    if (userIdRef.current) { ... }
  });
}, []);`}</DocCode>
      </DocSubsection>

      <DocSubsection title="WebSocket déconnecté silencieusement">
        <DocP>
          Une déconnexion réseau (mode veille, changement de Wi-Fi) ferme le WebSocket
          Supabase. Sans handler d'erreur, c'est <strong>invisible</strong> côté UI.
          Tous les <DocInline>.subscribe()</DocInline> doivent inclure :
        </DocP>
        <DocCode lang="typescript">{`channel.subscribe((status, err) => {
  if (status === "CHANNEL_ERROR" || err) {
    console.error("[Chat] Channel error:", err);
    // Trigger reconnect ou toast utilisateur
  }
});`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Saturation de la file de requêtes">
        <DocP>
          Le proxy Supabase de Sakata limite à 4 requêtes Postgrest simultanées (voir
          <DocInline>src/lib/supabase.ts</DocInline>). Sans <DocInline>AbortController</DocInline>{" "}
          sur les <DocInline>useEffect</DocInline> de fetch, les sockets restent
          occupées trop longtemps après démontage.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Conversations 1-à-1 uniquement (pas de groupes pour l'instant).</>,
          <>Pas de chiffrement end-to-end — Supabase a accès en clair.</>,
          <>Audio limité à ce que <DocInline>MediaRecorder</DocInline> produit (codec dépend du navigateur).</>,
          <>Pas de transcription automatique des messages vocaux (prévu via Whisper dans la roadmap Veillée Numérique).</>,
        ]}
      />
    </DocSection>
  </>
);
