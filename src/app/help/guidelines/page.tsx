"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function GuidelinesPage() {
  const { language } = useLanguage();

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            Directives du Site
          </h1>
          <p className="text-gray-400 text-lg">
            Les principes et règles qui guident notre communauté
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Principes de Communauté
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Respect</h3>
              <p className="text-gray-300">
                Traitez tous les membres avec dignité et respect. Nous accueillons les perspectives diverses et valorisons le dialogue constructif.
              </p>
            </div>
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Authenticité</h3>
              <p className="text-gray-300">
                Partagez des savoirs vérifiés et authentiques. Les contributions doivent être fondées sur la connaissance réelle et l'expérience.
              </p>
            </div>
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Inclusivité</h3>
              <p className="text-gray-300">
                Kisakata est un espace ouvert à tous. Nous célébrons la diversité des voix et des perspectives.
              </p>
            </div>
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Intégrité</h3>
              <p className="text-gray-300">
                Agissez avec honnêteté et transparence. Rapportez les contenus inappropriés et aidez-nous à maintenir un environnement sain.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Règles de Contenu
          </h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold mb-2">✅ Contenu Autorisé</h3>
              <ul className="space-y-2 ml-4">
                <li>• Articles historiques et culturels vérifiés</li>
                <li>• Témoignages personnels et récits de vie</li>
                <li>• Questions d'apprentissage et discussions éducatives</li>
                <li>• Ressources de référence et liens vers des sources fiables</li>
                <li>• Médias : images, vidéos, audio (avec attribution)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">❌ Contenu Interdit</h3>
              <ul className="space-y-2 ml-4">
                <li>• Discours haineux ou discriminatoire</li>
                <li>• Harcèlement ou intimidation</li>
                <li>• Contenu sexuellement explicite</li>
                <li>• Spam ou contenu commercial non-pertinent</li>
                <li>• Fausses informations ou désinformation</li>
                <li>• Propriété intellectuelle d'autrui (sans permission)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Responsabilités des Contributeurs
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>Documentalistes Culturels</strong> : Vous avez accepté de partager des savoirs authentiques et vérifiés. Vos contributions sont revues et éditées avant publication.
            </p>
            <p>
              <strong>Vérification des Sources</strong> : Citez vos sources et fournissez des références. Les articles sans sources fiables peuvent être rejetés ou modifiés.
            </p>
            <p>
              <strong>Respect de la Propriété Intellectuelle</strong> : N'utilisez que des contenus avec permission ou sous licence appropriée. Attribuez toujours les sources.
            </p>
            <p>
              <strong>Maintenance</strong> : Mettez à jour vos contributions si de nouvelles informations émergent. Nous valorisons l'évolution et la correction des erreurs.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Modération & Sanctions
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Notre équipe de modération surveille le site pour assurer un environnement sûr et respectueux. Les violations des directives peuvent entraîner :
            </p>
            <ul className="space-y-2 ml-4">
              <li>• Avertissement privé (premier incident)</li>
              <li>• Contenu masqué ou rejeté</li>
              <li>• Suspension temporaire du compte (récidive)</li>
              <li>• Suppression permanente du compte (violations graves)</li>
            </ul>
            <p>
              Nous restons justes et proportionnés. Vous avez toujours le droit d'appeler une décision de modération.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Signalements & Feedback
          </h2>
          <div className="space-y-3 text-gray-300">
            <p>
              Avez-vous vu du contenu inapproprié ? Utilisez la fonction "Signaler" sur le contenu en question. Notre équipe examinera rapidement.
            </p>
            <p>
              Avez-vous un feedback sur les directives ou suggestions d'amélioration ? Contactez-nous directement via votre profil ou le formulaire de contact.
            </p>
          </div>
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
          Site Guidelines
        </h1>
        <p className="text-gray-400 text-lg">
          The principles and rules that guide our community
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Community Principles
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Respect</h3>
            <p className="text-gray-300">
              Treat all members with dignity and respect. We welcome diverse perspectives and value constructive dialogue.
            </p>
          </div>
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
            <p className="text-gray-300">
              Share verified and authentic knowledge. Contributions should be grounded in real knowledge and experience.
            </p>
          </div>
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
            <p className="text-gray-300">
              Kisakata is a space open to all. We celebrate the diversity of voices and perspectives.
            </p>
          </div>
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Integrity</h3>
            <p className="text-gray-300">
              Act with honesty and transparency. Report inappropriate content and help us maintain a healthy environment.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Content Rules
        </h2>
        <div className="space-y-4 text-gray-300">
          <div>
            <h3 className="font-semibold mb-2">✅ Allowed Content</h3>
            <ul className="space-y-2 ml-4">
              <li>• Verified historical and cultural articles</li>
              <li>• Personal testimonies and life stories</li>
              <li>• Learning questions and educational discussions</li>
              <li>• Reference resources and reliable sources</li>
              <li>• Media: images, videos, audio (with attribution)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">❌ Forbidden Content</h3>
            <ul className="space-y-2 ml-4">
              <li>• Hate speech or discriminatory content</li>
              <li>• Harassment or intimidation</li>
              <li>• Sexually explicit content</li>
              <li>• Spam or non-relevant commercial content</li>
              <li>• Misinformation or disinformation</li>
              <li>• Others' intellectual property (without permission)</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Contributor Responsibilities
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            <strong>Cultural Documentarians</strong> : You have committed to sharing authentic and verified knowledge. Your contributions are reviewed and edited before publication.
          </p>
          <p>
            <strong>Source Verification</strong> : Cite your sources and provide references. Articles without reliable sources may be rejected or modified.
          </p>
          <p>
            <strong>Intellectual Property Respect</strong> : Only use content with permission or under appropriate license. Always attribute sources.
          </p>
          <p>
            <strong>Maintenance</strong> : Update your contributions as new information emerges. We value evolution and error correction.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Moderation & Sanctions
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            Our moderation team oversees the site to ensure a safe and respectful environment. Guideline violations may result in:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• Private warning (first incident)</li>
            <li>• Content hidden or rejected</li>
            <li>• Temporary account suspension (recurrence)</li>
            <li>• Permanent account deletion (serious violations)</li>
          </ul>
          <p>
            We remain fair and proportionate. You always have the right to appeal a moderation decision.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Reports & Feedback
        </h2>
        <div className="space-y-3 text-gray-300">
          <p>
            Seen inappropriate content? Use the "Report" function on the content in question. Our team will review it promptly.
          </p>
          <p>
            Have feedback on the guidelines or suggestions for improvement? Contact us directly via your profile or the contact form.
          </p>
        </div>
      </section>
    </div>
  );
}
