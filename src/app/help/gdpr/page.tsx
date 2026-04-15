"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function GDPRPage() {
  const { language } = useLanguage();

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            RGPD & Confidentialité
          </h1>
          <p className="text-gray-400 text-lg">
            Comment nous protégeons vos données et respectons votre vie privée
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Notre Engagement
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Chez Kisakata, votre confidentialité est sacrée. Nous respectons strictement le Règlement Général sur la Protection des Données (RGPD) de l'Union Européenne. Cela signifie que vous avez un contrôle total sur vos données personnelles.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Les Données que Nous Collectons
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">Données d'Authentification</h3>
              <p>
                Lorsque vous créez un compte, nous collectons votre adresse email et les informations de profil que vous fournissez volontairement (nom, bio, localisation).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Données d'Utilisation</h3>
              <p>
                Nous enregistrons vos interactions sur la plateforme (articles lus, contributions, messages envoyés) pour améliorer votre expérience.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Données de Paiement</h3>
              <p>
                Les données de paiement sont traitées exclusivement par Stripe. Nous ne stockons jamais vos informations bancaires sur nos serveurs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Données Techniques</h3>
              <p>
                Nous collectons automatiquement votre adresse IP, votre navigateur et votre appareil à des fins de sécurité et d'analyse.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Vos Droits RGPD
          </h2>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Droit d'accès</strong> : Vous pouvez demander une copie de toutes les données que nous détenons sur vous.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Droit de rectification</strong> : Vous pouvez corriger ou mettre à jour vos données personnelles.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Droit à l'oubli</strong> : Vous pouvez demander la suppression de vos données personnelles.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Droit à la portabilité</strong> : Vous pouvez demander une copie de vos données dans un format portable.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Droit d'opposition</strong> : Vous pouvez vous opposer au traitement de vos données à certaines fins.</span>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Sécurité des Données
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Chiffrement</strong> : Toutes les communications entre vous et nos serveurs sont chiffrées en HTTPS/TLS.
            </p>
            <p>
              <strong>Authentification</strong> : Les mots de passe sont hachés de manière sécurisée et jamais stockés en clair.
            </p>
            <p>
              <strong>Accès Limité</strong> : Seules les personnes autorisées ont accès aux données utilisateur.
            </p>
            <p>
              <strong>Sauvegardes</strong> : Nous effectuons des sauvegardes régulières pour protéger vos données contre la perte.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Partage de Données
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement explicite, sauf dans les cas suivants :
            </p>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Supabase</strong> : Notre fournisseur d'authentification et de base de données</li>
              <li>• <strong>Stripe</strong> : Pour traiter les paiements (données financières uniquement)</li>
              <li>• <strong>Obligations légales</strong> : Si requies par la loi ou les autorités compétentes</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Durée de Rétention
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Comptes Actifs</strong> : Nous conservons vos données tant que votre compte est actif.
            </p>
            <p>
              <strong>Comptes Supprimés</strong> : Après suppression, vos données sont complètement effacées dans les 30 jours.
            </p>
            <p>
              <strong>Logs Techniques</strong> : Les logs de serveur sont conservés pendant 90 jours à des fins de sécurité.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Cookies & Traçage
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Nous utilisons des cookies pour :
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Maintenir votre session d'authentification</li>
              <li>• Mémoriser vos préférences de langue</li>
              <li>• Analyser l'utilisation du site (analytics anonyme)</li>
            </ul>
            <p>
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités peuvent ne pas fonctionner correctement.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Contact & Questions
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Vous avez des questions sur notre politique de confidentialité ou souhaitez exercer vos droits RGPD ?
            </p>
            <p>
              Contactez-nous directement via votre profil ou envoyez un email à notre équipe de support. Nous répondrons à votre demande dans les 30 jours.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Modifications de cette Politique
          </h2>
          <p className="text-gray-300">
            Nous pouvons mettre à jour cette politique de temps en temps pour refléter les changements juridiques ou technologiques. Nous vous notifierons de tout changement matériel par email.
          </p>
        </section>
      </div>
    );
  }

  // English version
  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-4xl font-bold mb-4"
          style={{ color: "var(--or-ancestral)" }}
        >
          GDPR & Privacy
        </h1>
        <p className="text-gray-400 text-lg">
          How we protect your data and respect your privacy
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Our Commitment
        </h2>
        <p className="text-gray-300 leading-relaxed">
          At Kisakata, your privacy is sacred. We strictly comply with the European Union's General Data Protection Regulation (GDPR). This means you have complete control over your personal data.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Data We Collect
        </h2>
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold mb-2">Authentication Data</h3>
            <p>
              When you create an account, we collect your email address and profile information you voluntarily provide (name, bio, location).
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Usage Data</h3>
            <p>
              We record your interactions on the platform (articles read, contributions, messages sent) to improve your experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Payment Data</h3>
            <p>
              Payment data is processed exclusively by Stripe. We never store your banking information on our servers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Technical Data</h3>
            <p>
              We automatically collect your IP address, browser, and device for security and analytics purposes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Your GDPR Rights
        </h2>
        <div className="space-y-3 text-gray-300">
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Right to Access</strong> : You can request a copy of all data we hold about you.</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Right to Rectification</strong> : You can correct or update your personal data.</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Right to Erasure</strong> : You can request deletion of your personal data.</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Right to Data Portability</strong> : You can request a copy of your data in a portable format.</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Right to Object</strong> : You can object to processing your data for certain purposes.</span>
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Data Security
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            <strong>Encryption</strong> : All communications between you and our servers are encrypted with HTTPS/TLS.
          </p>
          <p>
            <strong>Authentication</strong> : Passwords are securely hashed and never stored in plain text.
          </p>
          <p>
            <strong>Limited Access</strong> : Only authorized personnel have access to user data.
          </p>
          <p>
            <strong>Backups</strong> : We perform regular backups to protect your data from loss.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Data Sharing
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            We never share your personal data with third parties without your explicit consent, except in these cases:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <strong>Supabase</strong> : Our authentication and database provider</li>
            <li>• <strong>Stripe</strong> : To process payments (financial data only)</li>
            <li>• <strong>Legal Obligations</strong> : If required by law or competent authorities</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Data Retention
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            <strong>Active Accounts</strong> : We retain your data as long as your account is active.
          </p>
          <p>
            <strong>Deleted Accounts</strong> : After deletion, your data is completely erased within 30 days.
          </p>
          <p>
            <strong>Technical Logs</strong> : Server logs are retained for 90 days for security purposes.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Cookies & Tracking
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            We use cookies for:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• Maintaining your authentication session</li>
            <li>• Remembering your language preferences</li>
            <li>• Analyzing site usage (anonymous analytics)</li>
          </ul>
          <p>
            You can disable cookies in your browser settings, but some features may not work properly.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Contact & Questions
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            Have questions about our privacy policy or want to exercise your GDPR rights?
          </p>
          <p>
            Contact us directly via your profile or email our support team. We will respond to your request within 30 days.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Policy Changes
        </h2>
        <p className="text-gray-300">
          We may update this policy from time to time to reflect legal or technological changes. We will notify you of any material changes by email.
        </p>
      </section>
    </div>
  );
}
