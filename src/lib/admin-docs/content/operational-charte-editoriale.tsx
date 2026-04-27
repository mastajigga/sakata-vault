import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead, DocQuote } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "operational-charte-editoriale",
  title: "Charte Éditoriale & Voix Sakata",
  subtitle:
    "Mission narrative, voix sage-basakata, règles de style, fact-checking et traitement des sujets culturels sensibles.",
  category: "operational",
  order: 1,
  readTime: 8,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["editorial", "voice", "style", "guidelines"],
  summary:
    "Document de référence pour tout contributeur, modérateur ou auteur d'article — pour préserver la cohérence narrative et culturelle.",
};

export const Content = () => (
  <>
    <DocLead>
      Sakata.com n'est pas un blog parmi d'autres. Sa voix est ancestrale, son ton
      respectueux, son rythme posé. Cette charte est l'antidote à la dérive vers le
      générique ou le clickbait — elle doit être lue par tout nouveau contributeur
      avant son premier article publié.
    </DocLead>

    <DocSection title="Mission narrative" eyebrow="Pourquoi on écrit">
      <DocQuote attribution="Proverbe Sakata">
        Boko bayebi nzela ya bankoko, bakomata mosika. — « Ceux qui connaissent le
        chemin des ancêtres iront loin. »
      </DocQuote>
      <DocList
        items={[
          <><strong>Préserver</strong> ce qui se perd à chaque génération.</>,
          <><strong>Transmettre</strong> aux diasporas ce que la distance fait oublier.</>,
          <><strong>Élever</strong> le savoir oral au rang de référence consultable.</>,
          <><strong>Connecter</strong> les générations dispersées par les exodes.</>,
        ]}
      />
      <DocCallout type="info" title="Ce que Sakata n'est PAS">
        Pas un Wikipedia bantu (trop neutre), pas un Medium (trop personnel), pas un
        magazine (trop éphémère). Sakata est un <strong>livre vivant</strong>.
      </DocCallout>
    </DocSection>

    <DocSection title="La voix sage-basakata" eyebrow="Ton">
      <DocSubsection title="Caractéristiques">
        <DocList
          items={[
            <><strong>Ancestral</strong> — la voix d'un Doyen qui transmet, pas d'un journaliste qui informe.</>,
            <><strong>Respectueux</strong> — jamais de moquerie envers les coutumes, même si désuètes pour le lecteur urbain.</>,
            <><strong>Imagé</strong> — proverbes, métaphores naturelles (rivière, forêt, masques), évocations sensorielles.</>,
            <><strong>Mesuré</strong> — pas de superlatifs creux (« incroyable », « génial »). La grandeur s'évoque par les faits.</>,
            <><strong>Patient</strong> — phrases longues acceptables, pauses descriptives, rythme du conte oral.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Exemple — voix correcte">
        <DocCode caption="✅ Ton sage-basakata">{`Le masque Ngongo n'est pas un objet de décoration. Il porte les voix
des aïeux — celles qu'on n'entend qu'au crépuscule, quand le tambour
appelle et que le village se rassemble. Le sculpteur le sait. Sa main
ne tremble pas par adresse, mais par déférence.`}</DocCode>
      </DocSubsection>

      <DocSubsection title="Exemple — voix à proscrire">
        <DocCode caption="❌ Ton journalistique standard">{`Le masque Ngongo est un objet rituel important dans la culture Sakata.
Il est utilisé lors de cérémonies traditionnelles. Voici 5 choses à
savoir sur ce masque incroyable !`}</DocCode>
        <DocCallout type="error" title="Pourquoi c'est mauvais">
          <DocList
            items={[
              <>« Important » sans précision = vide.</>,
              <>« Cérémonies traditionnelles » = formule générique applicable à n'importe quelle culture.</>,
              <>« 5 choses à savoir » = listicle Buzzfeed, exact opposé du sage-basakata.</>,
              <>« Incroyable » = superlatif creux.</>,
            ]}
          />
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Règles de style" eyebrow="Forme">
      <DocSubsection title="Longueur">
        <DocList
          items={[
            <>Article minimum : <strong>800 mots</strong>. En-deçà, c'est une note de blog, pas un article encyclopédique.</>,
            <>Article cible : <strong>1 500-3 000 mots</strong> pour les sujets de fond.</>,
            <>Pas de plafond, mais au-delà de 5 000 mots, scinder en série liée.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Structure">
        <DocList
          items={[
            <><strong>Préambule</strong> (résumé) — 50-100 mots, accrocheur sans trahir.</>,
            <><strong>Sections H2</strong> nommées explicitement (pas « Introduction » mais « Quand le tambour s'éveille »).</>,
            <><strong>Pas plus de 3 niveaux de hiérarchie</strong> (H2, H3 max).</>,
            <><strong>Citation finale optionnelle</strong> — proverbe ou parole d'aîné qui clôt narrativement.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Termes intraduisibles">
        <DocCallout type="decision" title="Règle">
          Les termes culturels Sakata <strong>restent en kisakata</strong> dans la
          version française, italicisés au premier usage avec définition courte.
        </DocCallout>
        <DocList
          items={[
            <><em>Ngongo</em> (masque rituel) — pas « masque », « masque traditionnel » ou « masque de cérémonie ».</>,
            <><em>Mboka</em> (le village, mais aussi la communauté) — concept à préserver.</>,
            <><em>Likonde</em> (rite d'initiation à la maturité) — pas « rite de passage » qui dilue le sens.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Photos & illustrations">
        <DocList
          items={[
            <>Toute photo doit avoir <strong>légende explicative</strong> (sujet, lieu, date approximative, photographe si connu).</>,
            <>Pas d'images génériques de safari ou Africa Stock — uniquement des images Sakata authentiques.</>,
            <>Si pas de photo disponible : aucune image plutôt que mauvaise image.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Sources & fact-checking" eyebrow="Rigueur">
      <DocCallout type="warning" title="Non négociable">
        Tout article publié doit citer au moins une source vérifiable (livre,
        publication académique, témoignage de Doyen documenté).
      </DocCallout>

      <DocSubsection title="Hiérarchie des sources">
        <DocTable
          headers={["Tier", "Type", "Crédit"]}
          rows={[
            ["1. Or", "Témoignage direct d'un Doyen Sakata enregistré", "Citation avec date et nom (avec consentement)"],
            ["2. Argent", "Publication académique avec auteur identifié", "Citation bibliographique complète"],
            ["3. Bronze", "Article culturel reconnu, presse africaine de qualité", "Lien direct"],
            ["4. À éviter", "Wikipedia seul, blogs anonymes, ChatGPT", "Refusé sauf cross-vérification"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Procédure de validation">
        <DocList
          ordered
          items={[
            <>Auteur soumet article avec sources listées.</>,
            <>Modérateur vérifie chaque source (lien, citation, page).</>,
            <>Si Doyen interrogé : vérifier le consentement publication.</>,
            <>Cross-référence avec articles Sakata existants (pas de contradiction non explicitée).</>,
            <>Si OK → publication. Sinon → retour à l'auteur avec corrections.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Sujets sensibles" eyebrow="Vigilance culturelle">
      <DocSubsection title="À traiter avec précaution">
        <DocTable
          headers={["Sujet", "Précaution"]}
          rows={[
            ["Rites secrets / initiations", "Demander explicitement aux gardiens du rite ce qui est publiable. Ne jamais publier sans aval."],
            ["Sorcellerie / mystique", "Ton informatif sans dérision ni sensationnalisme. Ce qui est sacré pour les uns reste un sujet d'étude."],
            ["Conflits de chefferies", "Présenter plusieurs versions, ne prendre parti pour aucune lignée actuellement vivante."],
            ["Polygamie / mariages traditionnels", "Décrire comme institution culturelle, sans jugement moral occidental."],
            ["Histoire coloniale", "Ne pas atténuer les violences. Mais ne pas tomber dans le pamphlet — la dignité Sakata se montre par la précision, pas la vengeance."],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sujets interdits sauf permission explicite">
        <DocList
          items={[
            <>Récits initiatiques détaillés (rituels secrets internes au clan).</>,
            <>Identités personnelles de pratiquants spirituels actifs.</>,
            <>Données généalogiques de personnes vivantes sans consentement.</>,
            <>Photos de cérémonies privées sans accord du chef ou des participants.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Multilingue" eyebrow="Politique 6 langues">
      <DocList
        items={[
          <>Tout article publié en FR doit avoir une version EN dans les 30 jours.</>,
          <>Versions kisakata, lingala, swahili, tshiluba : <strong>désirables mais pas bloquantes</strong> (manque de traducteurs natifs).</>,
          <>Traduction IA acceptable uniquement <strong>après relecture humaine</strong> par un locuteur natif.</>,
          <>Si l'article inclut des chants ou poèmes : version originale kisakata + traduction littérale + traduction interprétée.</>,
        ]}
      />
    </DocSection>

    <DocSection title="Checklist avant publication" eyebrow="Validation">
      <DocList
        ordered
        items={[
          <>Article {`>`} 800 mots, structure H2/H3 claire ?</>,
          <>Voix sage-basakata respectée (relire à voix haute) ?</>,
          <>Termes intraduisibles préservés en kisakata ?</>,
          <>Au moins une source vérifiable citée ?</>,
          <>Photos avec légendes complètes ?</>,
          <>Pas de sujet sensible publié sans consentement ?</>,
          <>Préambule + slug + tags + catégorie remplis ?</>,
          <>Version EN soumise ou en cours ?</>,
        ]}
      />
    </DocSection>
  </>
);
