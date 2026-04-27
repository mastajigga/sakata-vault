import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "strategy-modele-economique",
  title: "Modèle Économique Chiffré",
  subtitle:
    "Projection financière sur 36 mois avec hypothèses, sensibilités, points de break-even et scénarios optimiste/réaliste/pessimiste.",
  category: "strategy",
  order: 2,
  readTime: 11,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["finance", "p&l", "projections", "viability"],
  summary:
    "Détail des sources de revenu, coûts récurrents, hypothèses de croissance, et trois scénarios pour viabiliser ou ajuster la trajectoire.",
};

export const Content = () => (
  <>
    <DocLead>
      Ce document chiffre noir sur blanc ce que la roadmap promet en récits.
      L'objectif n'est pas la précision spéculative — c'est de comprendre quelles
      variables font basculer le projet vers la viabilité et lesquelles, manipulées,
      l'enterrent.
    </DocLead>

    <DocSection title="Sources de revenu" eyebrow="Revenue streams">
      <DocSubsection title="1. Abonnements Premium individuels">
        <DocTable
          headers={["Variable", "Hypothèse"]}
          rows={[
            ["Prix mensuel", "9€ (ou 90€/an avec réduction)"],
            ["Conversion gratuit → Premium", "3% des MAU"],
            ["Churn mensuel", "5% (élevé pour SaaS, normal pour culture)"],
            ["Lifetime value (LTV)", "≈ 9€ × (1 / 0.05) = 180€ par abonné"],
            ["Coût acquisition (CAC) cible", "{`<`} 30€ (organique + référencement diaspora)"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="2. Marketplace Artisanat">
        <DocTable
          headers={["Variable", "Hypothèse"]}
          rows={[
            ["Commission Sakata", "10% du prix produit"],
            ["Panier moyen", "80€"],
            ["Commission moyenne par vente", "8€"],
            ["Volume mois 12", "50 ventes = 400€/mois revenus"],
            ["Volume mois 24", "200 ventes = 1 600€/mois"],
            ["Volume mois 36", "500 ventes = 4 000€/mois"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="3. API Publique Chercheurs">
        <DocTable
          headers={["Variable", "Hypothèse"]}
          rows={[
            ["Tier Discovery (gratuit)", "20 utilisateurs (tunnel)"],
            ["Tier Research (50€/mois)", "5 abonnés mois 12 → 15 mois 36"],
            ["Tier Institution (500€/mois)", "1 partenaire mois 12 → 5 mois 36"],
            ["Revenu mensuel mois 12", "≈ 750€"],
            ["Revenu mensuel mois 36", "≈ 3 250€"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="4. Subventions & Partenariats">
        <DocList
          items={[
            <><strong>Année 1 :</strong> 1 subvention culturelle estimée 15-30k€ (Wallonie-Bruxelles International, Délégation Wallonie-RDC, Fonds Africain).</>,
            <><strong>Année 2-3 :</strong> 1-2 subventions/an + partenariat MRAC ou Inalco (apport en nature : étudiants, contenus académiques, légitimité).</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="5. Sources accessoires (bonus)">
        <DocList
          items={[
            <><strong>Affiliation</strong> sur livres recommandés (Amazon, Decitre) — marginal, ~50€/mois.</>,
            <><strong>Donations volontaires</strong> via Stripe Tipping ou Ko-fi — imprévisible.</>,
            <><strong>Sponsoring d'événements</strong> Audio Rooms — 100-500€ par événement majeur.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Structure de coûts" eyebrow="Costs">
      <DocSubsection title="Coûts récurrents mensuels (an 1)">
        <DocTable
          headers={["Poste", "Montant", "Note"]}
          rows={[
            ["Hébergement Netlify (Pro)", "19$ (~17€)", "Au-delà du free tier dès 100k visites/mois"],
            ["Supabase (Pro plan)", "25$ (~23€)", "Inclus DB, Storage, Auth, Realtime"],
            ["IA (Gemini + Claude + OpenAI)", "10-15$ (~12€) → 150€ à 1k articles", "Variable selon volume"],
            ["Mapbox", "0€", "Gratuit jusqu'à 50k chargements/mois"],
            ["Pinecone", "0€ → 70$", "Gratuit jusqu'à 5M vecteurs"],
            ["Stripe (frais transaction)", "1.4% + 0.25€ par paiement", "Variable"],
            ["Email (Resend)", "0$ → 20$", "Gratuit jusqu'à 3k emails/mois"],
            ["LiveKit (Audio Rooms)", "0$ → 50$", "Activé en Q3"],
            ["Domaines + SSL", "~5€", "Sakata.com + variantes"],
            ["Total infra mensuel mois 12", "≈ 80-120€", "Croissance progressive"],
            ["Total infra mensuel mois 36", "≈ 300-400€", "Avec multi-tribu actif"],
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Coûts humains">
        <DocList
          items={[
            <><strong>Année 1 :</strong> Fondateur seul (rémunération différée si nécessaire). Si financement : 24k€/an pour Fortuné.</>,
            <><strong>Année 2 :</strong> + 1 historien temps partiel à 12k€/an.</>,
            <><strong>Année 3 :</strong> + 1 développeur backend à 36k€/an.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Coûts marketing">
        <DocList
          items={[
            <><strong>Année 1 :</strong> 0€ (organique + bouche-à-oreille diaspora).</>,
            <><strong>Année 2-3 :</strong> 200-500€/mois pour pubs Meta ciblées diaspora + sponsoring podcasts diaspora.</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Projection 36 mois — Scénario réaliste" eyebrow="P&L">
      <DocTable
        headers={["Mois", "Premium", "Marketplace", "API", "Subventions", "Total revenus", "Coûts", "Net mensuel"]}
        rows={[
          ["M1-3", "0€", "0€", "0€", "0€", "0€", "120€", "−120€"],
          ["M4-6", "100€", "0€", "0€", "0€", "100€", "150€", "−50€"],
          ["M7-9", "500€", "100€", "50€", "0€", "650€", "200€", "+450€"],
          ["M10-12", "1 500€", "400€", "750€", "20k€ une fois", "2 650€/mois", "300€", "+2 350€"],
          ["M13-18", "3 000€", "800€", "1 250€", "0€", "5 050€", "2 500€ (+ historien)", "+2 550€"],
          ["M19-24", "5 000€", "1 600€", "1 750€", "0€", "8 350€", "2 700€", "+5 650€"],
          ["M25-30", "8 000€", "2 800€", "2 500€", "30k€ subv. an 3", "13 300€", "5 500€ (+ dev backend)", "+7 800€"],
          ["M31-36", "12 000€", "4 000€", "3 250€", "0€", "19 250€", "6 000€", "+13 250€"],
        ]}
      />
      <DocCallout type="success" title="Break-even">
        <strong>Mois 7-9</strong> en cumulé (récupération des 6 premiers mois de
        pertes). Au mois 12 avec subvention, capital de réserve de ~25k€.
      </DocCallout>
    </DocSection>

    <DocSection title="Scénarios alternatifs" eyebrow="Sensibilité">
      <DocSubsection title="Scénario optimiste (×1.5)">
        <DocList
          items={[
            <>Conversion Premium 5% (au lieu de 3%) — un an plus tôt sur les chiffres réalistes.</>,
            <>2 partenariats institutionnels au lieu d'1.</>,
            <>ARR fin année 3 : ~330k€ au lieu de 230k€.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario pessimiste (÷0.5)">
        <DocList
          items={[
            <>Conversion Premium 1.5%.</>,
            <>Aucune subvention obtenue.</>,
            <>Marketplace lent à décoller.</>,
            <>ARR fin année 3 : ~80k€. Suffit pour solo dev mais pas embauche.</>,
            <>Break-even repoussé à mois 18.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Scénario catastrophe (échec)">
        <DocList
          items={[
            <>Diaspora pas intéressée (mauvaise lecture du marché).</>,
            <>Compétiteur lance même feature en mieux.</>,
            <>Burnout solo.</>,
            <>Pivot ou arrêt nécessaire avant mois 18.</>,
          ]}
        />
        <DocCallout type="warning" title="Indicateurs précoces">
          Si après <strong>6 mois post-launch Premium</strong> on est sous 100
          abonnés, signal fort de pivot nécessaire (changer la proposition de
          valeur, le prix, ou l'audience cible).
        </DocCallout>
      </DocSubsection>
    </DocSection>

    <DocSection title="Variables clés à monitorer" eyebrow="KPIs">
      <DocTable
        headers={["KPI", "Cible mois 6", "Cible mois 12", "Action si en deçà"]}
        rows={[
          ["MAU (Monthly Active Users)", "500", "2 000", "Boost SEO + outreach diaspora"],
          ["Conversion Premium", "2%", "3%", "Tester nouveaux paywalls / pricing"],
          ["Churn mensuel Premium", "{`<`} 8%", "{`<`} 5%", "Améliorer rétention contenu"],
          ["Articles publiés/mois", "20", "40", "Activer bulk import + contributeurs"],
          ["Trafic organique (Google)", "1 500/mois", "10 000/mois", "Renforcer SEO"],
        ]}
      />
    </DocSection>

    <DocSection title="Risques financiers majeurs" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Stripe rejette transactions RDC", "Moyenne", "Haut", "Backup Paystack ou Wise"],
          ["Coût IA explose", "Moyenne", "Moyen", "Quotas par user, cache cross-user, fine-tune"],
          ["Subvention refusée", "Élevée", "Moyen", "Lancer 3-4 dossiers en parallèle"],
          ["Burnout fondateur", "Élevée", "Critique", "Embauche freelance dès 1k€/mois MRR"],
          ["Vague concurrente (gros acteur copie)", "Faible", "Très haut", "Vitesse + corpus exclusif Veillée"],
        ]}
      />
    </DocSection>

    <DocSection title="Recommandations" eyebrow="Décisions">
      <DocCallout type="decision" title="3 actions prioritaires">
        <DocList
          ordered
          items={[
            <><strong>Lancer 2-3 dossiers de subvention dans les 30 jours</strong> — délais d'instruction de 3-6 mois, autant commencer.</>,
            <><strong>Activer Premium maintenant</strong> et viser 50 abonnés en 90 jours — preuve de marché incontournable.</>,
            <><strong>Tracker chaque coût mensuel</strong> dans un tableau partagé. Ce qui n'est pas mesuré dérape.</>,
          ]}
        />
      </DocCallout>
    </DocSection>
  </>
);
