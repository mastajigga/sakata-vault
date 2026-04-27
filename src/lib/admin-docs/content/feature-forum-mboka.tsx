import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "feature-forum-mboka",
  title: "Forum Mboka — Le Village Numérique",
  subtitle:
    "Forum communautaire temps réel avec catégories, fils de discussion enrichis, réactions emoji et système de modération.",
  category: "feature",
  order: 4,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Équipe Sakata",
  tags: ["realtime", "supabase", "rls", "moderation"],
  summary:
    "Architecture du forum Mboka : tables, RLS par catégorie, broadcast temps réel des messages et réactions, et patterns de modération.",
};

export const Content = () => (
  <>
    <DocLead>
      « Mboka » signifie « le village » en kisakata. Le forum est conçu comme la place
      publique du village numérique : ouvert mais ordonné, vivant mais respectueux. Sa
      complexité technique vient de la coexistence de trois modes — fil long terme,
      chat temps réel, réactions instantanées — sur la même infrastructure.
    </DocLead>

    <DocSection title="Qu'est-ce que c'est ?" eyebrow="Définition">
      <DocP>
        Accessible via <DocInline>/forum</DocInline>, Mboka organise les discussions
        en trois niveaux :
      </DocP>
      <DocList
        items={[
          <><strong>Catégories</strong> (Histoire, Langue, Musique, Cuisine, Diaspora, Actualité) — fixes, non créables par les users.</>,
          <><strong>Fils (threads)</strong> — discussions thématiques créables par tout user authentifié.</>,
          <><strong>Messages</strong> — au sein d'un fil, échanges en temps réel avec réactions et mentions.</>,
        ]}
      />
      <DocP>
        Chaque fil a un éditeur Markdown personnalisé pour le post initial (riche),
        puis dégénère en chat texte simple pour les réponses (rapide).
      </DocP>
    </DocSection>

    <DocSection title="Schéma de données" eyebrow="Tables">
      <DocTable
        headers={["Table", "Rôle", "Particularité"]}
        rows={[
          [<DocInline>forum_categories</DocInline>, "Catégories fixes", "Slug, icon, couleur, ordre — seed initial"],
          [<DocInline>forum_threads</DocInline>, "Fils de discussion", "Slug auto-généré + verrouillage par auteur ou modo"],
          [<DocInline>forum_messages</DocInline>, "Messages dans un fil", "Markdown nettoyé côté client + serveur"],
          [<DocInline>forum_reactions</DocInline>, "Réactions emoji", "M:N user × message × emoji (unique constraint)"],
          [<DocInline>forum_typing</DocInline>, "Présence de frappe", "Broadcast-only (pas persisté)"],
        ]}
      />
    </DocSection>

    <DocSection title="Pourquoi cette structure" eyebrow="Décisions">
      <DocSubsection title="Catégories fixes (et non user-generated)">
        <DocCallout type="decision" title="Choix">
          Les catégories sont définies par seed et non créables dynamiquement.
        </DocCallout>
        <DocP>
          Les forums où n'importe qui crée une catégorie deviennent des marécages :
          doublons, catégories vides, pollution. Six catégories fixes, claires, suffisent
          à couvrir tous les sujets attendus. Si le besoin émerge plus tard, il sera plus
          simple d'ajouter une 7ᵉ que de purger 50 doublons mal triés.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Markdown personnalisé pour les posts initiaux">
        <DocP>
          On utilise un sous-ensemble strict de Markdown : <strong>gras</strong>,
          <em>italique</em>, citations, listes, liens, images. Pas de HTML brut, pas
          d'iframe, pas de scripts. Sanitisation via <DocInline>DOMPurify</DocInline>{" "}
          côté client + validation longueur/contenu côté serveur.
        </DocP>
        <DocCallout type="warning" title="Anti-XSS">
          Tout texte contenant <DocInline>{`<script>`}</DocInline>, <DocInline>{`<iframe>`}</DocInline>,
          ou des handlers <DocInline>onerror=</DocInline> est rejeté à l'insertion.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="RLS par catégorie">
        <DocCode lang="sql">{`-- Lecture : tous les users authentifiés peuvent lire
CREATE POLICY "forum_messages_read"
  ON forum_messages FOR SELECT
  TO authenticated USING (true);

-- Écriture : seul l'auteur de son propre message
CREATE POLICY "forum_messages_insert"
  ON forum_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Modification : auteur (5 min) OU manager+ (toujours)
CREATE POLICY "forum_messages_update"
  ON forum_messages FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = author_id AND created_at > NOW() - INTERVAL '5 minutes')
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role IN ('admin', 'manager')
    )
  );`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Realtime — broadcast vs postgres_changes" eyebrow="Pattern">
      <DocSubsection title="Pour les messages : postgres_changes">
        <DocP>
          Les messages sont persistés. Subscription Supabase Realtime sur la table{" "}
          <DocInline>forum_messages</DocInline> filtrée par <DocInline>thread_id</DocInline>.
          Garantit que tout client connecté voit les nouveaux messages en {`< 200ms`}.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Pour la frappe : broadcast">
        <DocP>
          La frappe est éphémère par nature. Pas besoin de persister. Le canal{" "}
          <DocInline>thread:typing:{`{thread_id}`}</DocInline> diffuse les events sans
          écrire en DB → 10× moins de pression sur la base.
        </DocP>
        <DocCode lang="typescript">{`channel.send({
  type: "broadcast",
  event: "typing",
  payload: { user_id: userId, name: profile.username }
});`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Pour les réactions : optimistic UI">
        <DocP>
          Quand un user clique 👍 sur un message, on met à jour l'UI immédiatement avant
          la confirmation serveur. Si l'INSERT échoue (rare, RLS satisfaite), on rollback
          avec un toast d'erreur.
        </DocP>
      </DocSubsection>
    </DocSection>

    <DocSection title="Modération" eyebrow="Outils">
      <DocList
        items={[
          <><strong>Verrouillage de fil</strong> — bouton « Verrouiller » dans <DocInline>/admin/forum</DocInline>, empêche nouveaux messages.</>,
          <><strong>Soft-delete de message</strong> — flag <DocInline>deleted_at</DocInline>, affichage « [Message supprimé] » mais audit conservé.</>,
          <><strong>Bannissement</strong> — flag <DocInline>profiles.is_banned</DocInline>, RLS interdit insert sur tables forum.</>,
          <><strong>Signalement user-driven</strong> — bouton « Signaler » crée un ticket dans <DocInline>moderation_reports</DocInline>.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Difficultés rencontrées" eyebrow="Retour d'expérience">
      <DocSubsection title="Sérialisation Next.js des icônes lucide">
        <DocP>
          Les composants serveur ne peuvent pas sérialiser les icônes Lucide passées
          comme prop. Solution : passer le <strong>nom</strong> de l'icône en string,
          puis mapper vers le composant côté client.
        </DocP>
      </DocSubsection>

      <DocSubsection title="Subscription qui ne reçoit jamais d'event">
        <DocP>
          Symptôme : nouveau message en DB visible dans Studio Supabase, mais le client
          ne le voit pas en temps réel. Cause : la table n'avait pas la <strong>publication
          realtime activée</strong>.
        </DocP>
        <DocCode lang="sql">{`ALTER PUBLICATION supabase_realtime
  ADD TABLE forum_messages, forum_reactions;`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Limitations connues" eyebrow="À savoir">
      <DocList
        items={[
          <>Pas de threading dans un message (pas de réponse imbriquée).</>,
          <>Pas de notifications push pour les mentions (prévu en roadmap PWA).</>,
          <>Recherche dans les messages limitée à ilike — pas de full-text search Postgres pour l'instant.</>,
        ]}
      />
    </DocSection>
  </>
);
