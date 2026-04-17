"use client";

import { useLanguage } from "@/components/LanguageProvider";
import changelogData from "@/data/changelog.json";

export default function ChangelogPage() {
  const { language } = useLanguage();

  const renderChangelog = (isFrench: boolean) => {
    return (
      <div className="space-y-6">
        {changelogData.map((version, index) => (
          <section
            key={version.version}
            className={`border-l-4 pl-6 ${
              index === 0 ? "border-[#C16B34]" : "border-white/20"
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">
              {version.version} — {version.date}
            </h2>
            <p className="text-gray-400 text-sm mb-4">{version.subtitle}</p>
            <div className="space-y-3 text-gray-300">
              {version.sections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-1">{section.title}</h3>
                  <ul className="text-sm space-y-1 ml-4">
                    {section.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  if (language === "fr") {
    return (
      <div className="space-y-8">
        <div>
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--or-ancestral)" }}
          >
            Mises à Jour & Changelog
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les dernières améliorations et fonctionnalités
          </p>
        </div>

        {renderChangelog(true)}

        <section>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
            À Venir
          </h2>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Traductions d'Articles</strong> : Expansion progressive des articles clés en anglais</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Éditeur d'Articles Amélioré</strong> : Interface riche pour les contributeurs</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Système de Recommandations</strong> : Contenu personnalisé basé sur les préférences</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-[#C16B34] font-bold">→</span>
              <span><strong>Intégration Pinecone</strong> : Recherche sémantique avancée</span>
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
          Updates & Changelog
        </h1>
        <p className="text-gray-400 text-lg">
          Discover the latest improvements and features
        </p>
      </div>

      {renderChangelog(false)}

      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--or-ancestral)" }}>
          Coming Soon
        </h2>
        <div className="space-y-3 text-gray-300">
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Article Translations</strong> : Progressive expansion of key articles in English</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Enhanced Article Editor</strong> : Rich interface for contributors</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Recommendation System</strong> : Personalized content based on preferences</span>
          </p>
          <p className="flex items-start gap-3">
            <span className="text-[#C16B34] font-bold">→</span>
            <span><strong>Pinecone Integration</strong> : Advanced semantic search</span>
          </p>
        </div>
      </section>
    </div>
  );
}
