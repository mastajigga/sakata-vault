import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "operational-procedure-moderation-forum",
  title: "Procédure de Modération Forum Mboka",
  subtitle:
    "Règles communautaires, échelle des sanctions, cas typiques et stratégies pour gérer les conflits sans alimenter le drame.",
  category: "operational",
  order: 3,
  readTime: 6,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["moderation", "community", "conflict-resolution"],
  summary:
    "Manuel pratique pour modérateurs Mboka — graduation des sanctions, cas concrets, et erreurs à ne pas reproduire.",
};

export const Content = () => (
  <>
    <DocLead>
      Modérer un forum culturel n'est pas modérer Reddit. Le ton est plus posé, les
      enjeux émotionnels plus profonds (identité, héritage, mémoire familiale).
      Cette procédure existe pour graduer les réactions et protéger l'esprit du
      village numérique sans étouffer la parole.
    </DocLead>

    <DocSection title="Règles communautaires Mboka" eyebrow="Le contrat">
      <DocCallout type="decision" title="Les 5 piliers">
        <DocList
          ordered
          items={[
            <><strong>Respect des aïeux et des Doyens</strong> — pas de moquerie envers les coutumes, même critiquées.</>,
            <><strong>Pas d'insultes personnelles</strong> — la critique d'idées est libre, l'attaque ad hominem est bannie.</>,
            <><strong>Sources vérifiables</strong> pour les affirmations historiques ou ethnographiques fortes.</>,
            <><strong>Multilingue accueilli</strong> — kisakata, français, lingala, swahili, etc., tous bienvenus, sans hiérarchie.</>,
            <><strong>Confidentialité familiale</strong> — pas de divulgation de noms, lieux, faits privés sans consentement.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Échelle des sanctions" eyebrow="Graduation">
      <DocTable
        headers={["Niveau", "Action", "Critères"]}
        rows={[
          ["1. Avertissement", "Message privé du modérateur citant la règle violée", "Première violation, intention non malicieuse"],
          ["2. Suppression contenu", "Message effacé, raison communiquée", "Violation claire mais user pas problématique"],
          ["3. Suspension 24h", "Compte temporairement bloqué", "2ᵉ avertissement ou violation directe"],
          ["4. Suspension 7j", "Idem 24h, prolongé", "Récidive après suspension courte"],
          ["5. Bannissement", "Compte fermé, IP loguée", "Violation grave (haine, doxxing) OU 3 suspensions"],
          ["6. Ban réseau", "Toute la famille IP/device bannie", "Création multi-comptes pour contourner"],
        ]}
      />
      <DocCallout type="info" title="Principe fondamental">
        <strong>Toujours préférer la pédagogie à la punition.</strong> Un user
        averti privément a 80% de chances de bien se conduire ensuite. Un ban est un
        échec collectif, pas une victoire.
      </DocCallout>
    </DocSection>

    <DocSection title="Cas typiques" eyebrow="Playbook">
      <DocSubsection title="Cas 1 — Insulte directe entre users">
        <DocP>
          User A traite User B de « sorcier » de manière injurieuse.
        </DocP>
        <DocList
          ordered
          items={[
            <>Supprimer le message en citant la règle 2.</>,
            <>MP à User A : avertissement, rappel charte, lien vers règles.</>,
            <>MP à User B : confirmation que le message a été retiré, l'auteur averti.</>,
            <>Si récidive A → suspension 24h.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Cas 2 — Affirmation historique douteuse">
        <DocP>
          User affirme « Le clan X a toujours dirigé le territoire Y » sans source.
        </DocP>
        <DocList
          ordered
          items={[
            <>Ne pas supprimer immédiatement.</>,
            <>Commenter publiquement sous le message : « Pourrais-tu citer ta source ? Cette affirmation contredit [article Sakata sur le sujet]. »</>,
            <>Si l'user fournit une source crédible → laisser le débat, éventuellement créer un article qui synthétise les versions.</>,
            <>Si l'user devient agressif ou refuse → supprimer message, avertissement.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Cas 3 — Message émotionnel sur conflits familiaux">
        <DocP>
          User raconte des conflits intra-familiaux, accuse nominalement des
          personnes vivantes.
        </DocP>
        <DocList
          ordered
          items={[
            <>Supprimer immédiatement (règle 5 : confidentialité familiale).</>,
            <>MP empathique à l'user : « Nous comprenons votre détresse, mais le forum public n'est pas l'espace pour ce genre de conflit. Souhaitez-vous être mis en relation avec un médiateur communautaire ? »</>,
            <>Pas de sanction (intention non malveillante, juste mal placée).</>,
            <>Documenter dans les notes admin (cas récurrent ?).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Cas 4 — Spam ou pub commerciale">
        <DocP>
          User poste un lien vers une boutique sans rapport (« cher community,
          découvrez mes produits beauté »).
        </DocP>
        <DocList
          ordered
          items={[
            <>Suppression immédiate.</>,
            <>Bannissement direct si compte créé récemment et activité 100% spam (probable bot).</>,
            <>MP avertissement si user légitime qui s'égare (inviter à passer par la marketplace officielle).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Cas 5 — Critique radicale d'une coutume">
        <DocP>
          User critique violemment une pratique traditionnelle (ex: dot, polygamie),
          la qualifie de « barbare ».
        </DocP>
        <DocList
          ordered
          items={[
            <>Le débat critique est admissible, le terme « barbare » ne l'est pas (irrespect des aïeux).</>,
            <>Commenter publiquement : « La discussion est bienvenue, mais reformule sans terme méprisant. Le débat sera plus riche. »</>,
            <>Si l'user reformule → laisser le fil continuer.</>,
            <>S'il s'enflamme → suspension 24h pour calmer.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Cas 6 — Doxxing ou divulgation données privées">
        <DocP>
          User publie le nom complet, adresse ou téléphone d'une personne.
        </DocP>
        <DocList
          ordered
          items={[
            <>Suppression immédiate (règle 5).</>,
            <>Suspension 7j minimum, sans avertissement préalable.</>,
            <>Notifier le fondateur (cas potentiellement légal).</>,
            <>Contacter la personne doxxée pour proposer support.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Outils admin du forum" eyebrow="Interface">
      <DocList
        items={[
          <><DocInline>/admin/forum</DocInline> — vue synthétique de tous les fils, signalements en cours, threads verrouillés.</>,
          <><strong>Soft-delete</strong> message — flag <DocInline>deleted_at</DocInline>, message remplacé par « [Message supprimé] » mais audit trail conservé.</>,
          <><strong>Verrouillage de fil</strong> — empêche nouveaux messages mais lecture reste accessible.</>,
          <><strong>Bannissement</strong> — flag <DocInline>profiles.is_banned</DocInline>, RLS bloque toutes les écritures.</>,
          <><strong>Logs de modération</strong> — chaque action loggée dans <DocInline>moderation_logs</DocInline> avec moderator_id, target_id, action_type, raison.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Anti-patterns du modérateur débutant" eyebrow="À éviter">
      <DocCallout type="error" title="N'engagez JAMAIS dans :">
        <DocList
          items={[
            <><strong>Réponses publiques agressives</strong> — donne du grain à moudre à l'attaqueur.</>,
            <><strong>Bannissements immédiats sans avertissement</strong> — privé l'opportunité de correction.</>,
            <><strong>Suppression de messages critiques mais légitimes</strong> — érode la confiance dans la modération.</>,
            <><strong>Modération sélective</strong> (être strict avec un, laxiste avec un autre) — biais détecté = perte de légitimité.</>,
            <><strong>Décisions sous emotion</strong> — toujours laisser 1h de pause si vous êtes énervé avant d'agir.</>,
          ]}
        />
      </DocCallout>
    </DocSection>

    <DocSection title="Quand escalader au fondateur" eyebrow="Hiérarchie">
      <DocList
        items={[
          <>Profil notable (Doyen reconnu, contributeur top, partenaire) impliqué.</>,
          <>Suspicion contenu illégal (incitation haine, doxxing répété, menaces).</>,
          <>Conflit de modération entre deux modérateurs.</>,
          <>Demande légale ou pression externe (presse, justice).</>,
          <>Cas qui n'a pas de précédent dans cette doc.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Suivi & amélioration" eyebrow="Long terme">
      <DocList
        items={[
          <>Revue mensuelle des cas modérés : patterns récurrents identifiés.</>,
          <>Mise à jour de cette doc chaque trimestre avec nouveaux cas.</>,
          <>Statistiques anonymisées partagées avec la communauté annuellement (transparence).</>,
        ]}
      />
    </DocSection>
  </>
);
