"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function PhilosophyPage() {
  const { language } = useLanguage();

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            Philosophie de Kisakata
          </h1>
          <p className="text-gray-400 text-lg">
            Comprendre la mission et les valeurs fondamentales de notre plateforme
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Notre Raison d'Être
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Kisakata est bien plus qu'une simple archive numérique. C'est un sanctuaire vivant dédié à la préservation et à la transmission de l'identité culturelle du peuple Sakata. Fondée sur le principe que chaque voix a de la valeur et que chaque histoire est un fil du tissu collectif, notre plateforme vise à unir les racines ancestrales avec la splendeur numérique moderne.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Nous croyons que la culture n'est pas figée dans le passé, mais qu'elle est vivante, respirante, en constante évolution. Kisakata offre un espace pour que les savoirs intemporels dialoguent avec les réalités contemporaines.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Les Trois Piliers
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Préservation</h3>
              <p className="text-gray-300">
                Documenter et archiver les savoirs, les traditions et les histoires du peuple Sakata pour les générations futures.
              </p>
            </div>
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Transmission</h3>
              <p className="text-gray-300">
                Créer des pont entre les générations, permettant aux jeunes de se connecter à leurs racines tout en naviguant le monde moderne.
              </p>
            </div>
            <div className="border-l-4 border-[#C16B34] pl-4">
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-gray-300">
                Bâtir un esprit communautaire où chacun est invité à contribuer, à apprendre et à grandir ensemble.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            Notre Approche
          </h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Kisakata adopte une approche multidisciplinaire et collaborative :
          </p>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold mt-1">•</span>
              <span><strong>Rigueur académique</strong> : Chaque article est vérifié et enrichi par des documentalistes culturels approuvés.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold mt-1">•</span>
              <span><strong>Inclusivité linguistique</strong> : Disponible en français, kisakata, lingala, swahili, tshiluba et anglais.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold mt-1">•</span>
              <span><strong>Respect de la propriété intellectuelle</strong> : Les savoirs sont documentés avec attribution appropriée.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold mt-1">•</span>
              <span><strong>Évolution continue</strong> : La plateforme grandit avec les contributions communautaires.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            L'Engagement Envers Vous
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Nous nous engageons à maintenir Kisakata comme un espace sûr, inclusif et respectueux. Vos données sont protégées, votre vie privée est sacrée, et votre contribution est valorisée. Ensemble, nous créons un héritage numérique pour les générations à venir.
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
          Kisakata Philosophy
        </h1>
        <p className="text-gray-400 text-lg">
          Understanding the mission and core values of our platform
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Our Purpose
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Kisakata is far more than a simple digital archive. It is a living sanctuary dedicated to the preservation and transmission of the cultural identity of the Sakata people. Founded on the principle that every voice has value and every story is a thread in the collective tapestry, our platform seeks to unite ancestral roots with modern digital excellence.
        </p>
        <p className="text-gray-300 leading-relaxed">
          We believe that culture is not frozen in the past, but is living, breathing, constantly evolving. Kisakata provides a space for timeless wisdom to dialogue with contemporary realities.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          The Three Pillars
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Preservation</h3>
            <p className="text-gray-300">
              Document and archive the knowledge, traditions, and stories of the Sakata people for future generations.
            </p>
          </div>
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Transmission</h3>
            <p className="text-gray-300">
              Create bridges between generations, enabling young people to connect with their roots while navigating the modern world.
            </p>
          </div>
          <div className="border-l-4 border-[#C16B34] pl-4">
            <h3 className="text-xl font-semibold mb-2">Community</h3>
            <p className="text-gray-300">
              Build a community spirit where everyone is invited to contribute, learn, and grow together.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Our Approach
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4">
          Kisakata adopts a multidisciplinary and collaborative approach:
        </p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold mt-1">•</span>
            <span><strong>Academic Rigor</strong> : Every article is verified and enriched by approved cultural documentarians.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold mt-1">•</span>
            <span><strong>Linguistic Inclusivity</strong> : Available in French, Kisakata, Lingala, Swahili, Tshiluba, and English.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold mt-1">•</span>
            <span><strong>Intellectual Property Respect</strong> : Knowledge is documented with appropriate attribution.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold mt-1">•</span>
            <span><strong>Continuous Evolution</strong> : The platform grows with community contributions.</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Our Commitment to You
        </h2>
        <p className="text-gray-300 leading-relaxed">
          We are committed to maintaining Kisakata as a safe, inclusive, and respectful space. Your data is protected, your privacy is sacred, and your contribution is valued. Together, we create a digital legacy for generations to come.
        </p>
      </section>
    </div>
  );
}
