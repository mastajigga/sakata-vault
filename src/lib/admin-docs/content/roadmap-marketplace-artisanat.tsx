import { DocSection, DocSubsection, DocP, DocCallout, DocCode, DocInline, DocList, DocTable, DocLead } from "../components";
import type { DocMeta } from "../types";

export const meta: DocMeta = {
  slug: "roadmap-marketplace-artisanat",
  title: "Plan d'implémentation : Marketplace Artisanat",
  subtitle:
    "Plateforme de vente de masques, tissus, livres et œuvres d'art Sakata, avec Stripe Connect, gestion de l'expédition et commission de 10%.",
  category: "roadmap",
  order: 5,
  readTime: 11,
  updatedAt: "2026-04-27",
  author: "Direction Sakata",
  tags: ["marketplace", "stripe-connect", "monetization", "vendors"],
  summary:
    "Choix Stripe Connect Express, modèle de commission, onboarding vendeurs et stratégie d'expédition multi-pays — pour transformer Sakata en place de marché culturelle.",
};

export const Content = () => (
  <>
    <DocLead>
      Une marketplace artisanat n'est pas qu'une feature : c'est un canal de
      monétisation totalement nouveau pour Sakata, et surtout c'est un soutien
      économique direct aux artisans congolais qui peinent à toucher la diaspora.
      Bien construite, elle peut générer 800-1500€/mois de commissions tout en
      faisant vivre des familles entières au pays.
    </DocLead>

    <DocSection title="Le besoin" eyebrow="Pourquoi cette feature">
      <DocP>
        Trois publics, trois besoins convergents :
      </DocP>
      <DocList
        items={[
          <><strong>Diaspora</strong> — Cherche des objets authentiques (masques, paniers tressés, tissus), sans intermédiaire commercial qui dilue la culture.</>,
          <><strong>Artisans Sakata</strong> — Ont des produits magnifiques mais aucun canal de vente international. WhatsApp Business est le top de leur stack.</>,
          <><strong>Sakata.com</strong> — A déjà l'audience et le paiement Stripe. La marketplace est une <em>dette</em> à valoriser, pas un produit à inventer.</>,
        ]}
      />
      <DocCallout type="info" title="Différenciation vs. Etsy / Amazon">
        Pas un énième marketplace généraliste. <strong>Curated</strong> : seuls les
        artisans validés (origine vérifiée, qualité contrôlée) peuvent vendre. Chaque
        produit raconte son histoire, son artisan, sa technique — c'est la culture qui
        se vend, pas juste l'objet.
      </DocCallout>
    </DocSection>

    <DocSection title="Stack technique — choix justifiés" eyebrow="Décisions">
      <DocSubsection title="Stripe Connect Express vs Custom vs Standard">
        <DocTable
          headers={["Variante", "Pour", "Contre", "Verdict"]}
          rows={[
            [
              "Stripe Standard",
              "Vendeur garde le contrôle total, paie pour son compte Stripe",
              "Onboarding séparé, friction énorme, coupe l'expérience",
              "❌ Mauvaise UX",
            ],
            [
              "Stripe Connect Express",
              "Onboarding intégré (KYC géré par Stripe), flux split natif, dashboard simplifié",
              "Stripe demande 0.25%+0.25€ par paiement supplémentaire",
              "✅ Retenu",
            ],
            [
              "Stripe Connect Custom",
              "Contrôle UI total, branding 100% Sakata",
              "Conformité KYC à charge, complexité énorme, illégal sans licence locale",
              "❌ Hors de portée",
            ],
          ]}
        />
        <DocCallout type="decision" title="Choix">
          <DocInline>Stripe Connect Express</DocInline>. Le surcoût (0.25%) est
          négligeable face au gain de simplicité — Stripe gère KYC, fiscalité, payouts.
        </DocCallout>
      </DocSubsection>

      <DocSubsection title="Modèle de commission">
        <DocTable
          headers={["Élément", "Montant"]}
          rows={[
            ["Prix produit (ex)", "100€"],
            ["Frais de port (à charge acheteur)", "+ 25€"],
            ["Total payé acheteur", "125€"],
            ["Commission Sakata (10% du produit, 0% du port)", "10€"],
            ["Frais Stripe (~1.4% + 0.25€)", "1.99€"],
            ["Reversé artisan", "≈ 113€"],
          ]}
        />
        <DocP>
          La commission de 10% est calculée sur le prix produit hors port. Le port est
          encaissé directement par le vendeur (pas de marge Sakata, pas d'illusion).
        </DocP>
      </DocSubsection>

      <DocSubsection title="Schéma de données">
        <DocCode lang="sql">{`CREATE TABLE marketplace_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  shop_name TEXT NOT NULL,
  shop_slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  origin_village TEXT,
  stripe_account_id TEXT UNIQUE,
  stripe_charges_enabled BOOLEAN DEFAULT FALSE,
  stripe_payouts_enabled BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending',  -- pending, active, suspended
  validated_by UUID REFERENCES profiles(id),
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES marketplace_vendors(id),
  title JSONB NOT NULL,            -- multilang
  description JSONB NOT NULL,
  origin_story JSONB,              -- ce qui rend le produit Sakata
  technique TEXT,                  -- "tissage raphia", "sculpture bois", ...
  images TEXT[],                   -- URLs Supabase Storage
  price_cents INT NOT NULL,
  shipping_cents INT NOT NULL,
  shipping_to TEXT[],              -- pays acceptés
  stock INT DEFAULT 1,
  status TEXT DEFAULT 'draft',     -- draft, published, sold, archived
  published_at TIMESTAMPTZ
);

CREATE TABLE marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES profiles(id),
  product_id UUID REFERENCES marketplace_products(id),
  vendor_id UUID REFERENCES marketplace_vendors(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount_cents INT NOT NULL,
  shipping_cents INT NOT NULL,
  commission_cents INT NOT NULL,
  status TEXT NOT NULL,            -- pending, paid, shipped, delivered, refunded
  shipping_address JSONB,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}</DocCode>
      </DocSubsection>
    </DocSection>

    <DocSection title="Plan d'exécution — 5 sprints" eyebrow="Roadmap">
      <DocSubsection title="Sprint 1 — Vendor onboarding (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/marketplace/devenir-vendeur</DocInline> avec formulaire de candidature.</>,
            <>Validation manuelle par admin (le filtre est l'âme du curated).</>,
            <>Intégration Stripe Connect Express : <DocInline>account.create</DocInline> + redirect onboarding.</>,
            <>Webhook <DocInline>account.updated</DocInline> pour suivre le statut KYC.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 2 — Catalogue produits (1 semaine)">
        <DocList
          ordered
          items={[
            <>Dashboard vendeur <DocInline>/marketplace/dashboard</DocInline> : CRUD produits.</>,
            <>Upload images via Supabase Storage (<DocInline>marketplace-products</DocInline> bucket).</>,
            <>Multilang via réutilisation du système d'articles.</>,
            <>Validation produit : draft → admin review → published.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 3 — Vitrine publique (1 semaine)">
        <DocList
          ordered
          items={[
            <>Page <DocInline>/marketplace</DocInline> avec grille produits, filtres (technique, prix, vendeur).</>,
            <>Page produit <DocInline>/marketplace/[slug]</DocInline> avec galerie + récit + bouton Acheter.</>,
            <>Carte interactive : produits localisés sur la carte 3D Géographie.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 4 — Checkout & paiement (1 semaine)">
        <DocList
          ordered
          items={[
            <>Stripe Checkout Session avec <DocInline>application_fee_amount</DocInline> + <DocInline>transfer_data</DocInline> (split natif Connect).</>,
            <>Calcul automatique des frais d'expédition selon pays acheteur.</>,
            <>Email de confirmation acheteur + notification vendeur (table <DocInline>marketplace_orders</DocInline>).</>,
            <>Webhook <DocInline>checkout.session.completed</DocInline> → mise à jour stock + statut.</>,
          ]}
        />
      </DocSubsection>

      <DocSubsection title="Sprint 5 — Suivi & litiges (1 semaine)">
        <DocList
          ordered
          items={[
            <>Tracking number ajouté par vendeur, visible côté acheteur.</>,
            <>Système de litige basique : bouton « Signaler un problème » → ticket admin.</>,
            <>Dashboard admin pour modération + remboursements via Stripe.</>,
            <>Reviews/ratings produit (post-livraison uniquement).</>,
          ]}
        />
      </DocSubsection>
    </DocSection>

    <DocSection title="Risques & mitigations" eyebrow="Lucidité">
      <DocTable
        headers={["Risque", "Probabilité", "Impact", "Mitigation"]}
        rows={[
          ["Vendeur arnaque (vend sans expédier)", "Moyenne", "Très haut", "Stripe Connect retient les fonds 7j post-livraison estimée. Validation curated."],
          ["Coût expédition RDC → Europe imprévisible", "Élevée", "Moyen", "Calculatrice par pays + plafond raisonnable. Vendeurs peuvent regrouper envois."],
          ["Douane / déclaration import", "Moyenne", "Moyen", "Documentation claire sur la page produit + estimation droits possibles à la livraison."],
          ["Faible volume initial (chicken-and-egg)", "Élevée", "Haut", "Lancer avec 5 vendeurs ambassadeurs (acquis manuellement) avant ouverture publique."],
          ["Stripe Connect indisponible en RDC", "Faible mais réelle", "Critique", "Backup : Paystack ou compte vendeur en Belgique pour la diaspora."],
        ]}
      />
    </DocSection>

    <DocSection title="Coût estimé pour 50 ventes/mois" eyebrow="Modèle économique">
      <DocTable
        headers={["Hypothèse", "Valeur"]}
        rows={[
          ["Nombre de ventes mensuelles", "50"],
          ["Panier moyen (hors port)", "80€"],
          ["GMV mensuel", "4 000€"],
          ["Commission Sakata (10%)", "400€"],
          ["Surcoût Stripe Connect (0.25% × GMV)", "10€"],
          ["Stockage images (50 produits × 2 MB)", "Inclus dans plan Supabase actuel"],
          ["Revenu net mensuel", "≈ 390€"],
        ]}
      />
      <DocCallout type="success" title="ROI">
        Le développement (5 semaines × 1 dev) s'amortit en ~6 mois à ces hypothèses
        modestes. À 200 ventes/mois, on est à 1 500€/mois.
      </DocCallout>
    </DocSection>

    <DocSection title="Métriques de succès" eyebrow="KPIs">
      <DocList
        items={[
          <><strong>3 mois post-lancement :</strong> 5 vendeurs actifs, 50 ventes cumulées, GMV {`>`} 5 000€.</>,
          <><strong>6 mois :</strong> 15 vendeurs, 200 ventes/mois, NPS acheteur {`>`} 50.</>,
          <><strong>12 mois :</strong> 30 vendeurs, 500 ventes/mois, présence dans au moins 1 article presse spécialisée artisanat.</>,
        ]}
      />
    </DocSection>
  </>
);
