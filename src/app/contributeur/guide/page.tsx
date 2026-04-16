"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FileText,
  Users,
  Clock,
  Shield,
  Heart,
  HelpCircle,
} from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { useLanguage } from "@/components/LanguageProvider";

const iconVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
};

export default function ContributorGuidePage() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: "Quels sujets puis-je couvrir comme contributeur ?",
      answer:
        "Vous pouvez couvrir tous les sujets liés à la culture sakata, la langue, l'histoire, les traditions, la sagesse ancestrale, et autres aspects du patrimoine sakata. Nous encourageons aussi les articles sur l'impact contemporain de ces savoirs.",
    },
    {
      question: "Combien de temps dure le processus d'approbation ?",
      answer:
        "En général, les demandes sont examinées dans les 48 heures. Vous recevrez une notification par email avec la décision et, en cas de rejet, une explication détaillée.",
    },
    {
      question: "Puis-je éditer mon article après sa publication ?",
      answer:
        "Oui, les articles publiés peuvent être modifiés. Les changements mineurs (correction typos, clarifications) sont appliqués directement. Les changements majeurs passent par une nouvelle révision.",
    },
    {
      question: "Comment sont rémunérés les contributeurs ?",
      answer:
        "Actuellement, les contributions sont bénévoles et motivées par la passion de partager le patrimoine sakata. À l'avenir, un système de rémunération équitable est prévu.",
    },
    {
      question: "Y a-t-il une limite au nombre d'articles que je peux écrire ?",
      answer:
        "Non, vous pouvez écrire autant d'articles que vous le souhaitez. Nous encourageons les contributeurs actifs à devenir des piliers de notre communauté.",
    },
    {
      question: "Mes articles seront-ils attribués correctement ?",
      answer:
        "Absolument. Votre nom et biographie apparaîtront clairement sur chaque article. Vous conservez les droits moraux d'auteur sur vos contenus.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-12">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href={ROUTES.HOME} className="hover:text-white transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href={ROUTES.CONTRIBUTEUR} className="hover:text-white transition-colors">
              Contributeur
            </Link>
            <span>/</span>
            <span className="text-white">Guide</span>
          </nav>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h1 className="text-5xl font-light mb-4 bg-gradient-to-r from-white via-gray-200 to-[#C16B34] bg-clip-text text-transparent">
              Guide Contributeur
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Devenez gardien de la sagesse sakata. Ce guide vous accompagne à chaque étape
              de votre parcours contributeur.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16"
          >
            {[
              { label: "Contributeurs actifs", value: "150+" },
              { label: "Articles contribués", value: "2500+" },
              { label: "Langues couvertes", value: "5" },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center"
              >
                <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-light text-[#C16B34]">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Section 1: Why Contribute */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div {...iconVariants} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-[#C16B34]">
                <Heart size={32} />
              </motion.div>
              <h2 className="text-3xl font-light">Pourquoi contribuer ?</h2>
            </div>
            <p className="text-gray-400 mb-4">
              En contribuant à Sakata.com, vous participez à un mouvement de transmission
              intergénérationnel. Vos articles :
            </p>
            <ul className="space-y-3">
              {[
                "Préservent la langue et culture sakata pour les générations futures",
                "Atteignent une audience mondiale de personnes intéressées par le patrimoine africain",
                "Renforcent votre crédibilité en tant qu'expert ou passionné du sujet",
                "Contribuent à la diaspora sakata en renforçant le lien avec les racines",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#C16B34] mt-1 shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Section 2: How to Get Started */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div {...iconVariants} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-[#C16B34]">
                <FileText size={32} />
              </motion.div>
              <h2 className="text-3xl font-light">Comment devenir contributeur ?</h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  num: 1,
                  title: "Créer un compte",
                  desc: "Inscrivez-vous sur Sakata.com en quelques secondes.",
                },
                {
                  num: 2,
                  title: "Demander l'accès",
                  desc: "Rendez-vous dans votre profil et soumettez une demande pour devenir contributeur.",
                },
                {
                  num: 3,
                  title: "Attendre l'approbation",
                  desc: "Notre équipe examinera votre profil et vos motivations. Vous serez notifié dans les 48 heures.",
                },
                {
                  num: 4,
                  title: "Commencer à écrire",
                  desc: "Une fois approuvé, accédez à l'éditeur d'articles et commencez à partager votre savoir.",
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C16B34]/20 border border-[#C16B34]/50 flex items-center justify-center text-[#C16B34] font-light">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-lg font-light mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 3: Types of Contributions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div {...iconVariants} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-[#C16B34]">
                <FileText size={32} />
              </motion.div>
              <h2 className="text-3xl font-light">Types de contributions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Article informatif",
                  desc: "Explications détaillées, guides, tutoriels sur un sujet spécifique.",
                },
                {
                  title: "Entretien / Interview",
                  desc: "Conversations avec des anciens, des experts ou des personnalités sakata.",
                },
                {
                  title: "Récit personnel",
                  desc: "Anecdotes, témoignages et expériences qui enrichissent le patrimoine vivant.",
                },
                {
                  title: "Analyse culturelle",
                  desc: "Analyses approfondies des traditions, us et coutumes sakata.",
                },
              ].map((type, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                >
                  <h3 className="text-lg font-light mb-2">{type.title}</h3>
                  <p className="text-gray-400 text-sm">{type.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 4: Quality Standards */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div {...iconVariants} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-[#C16B34]">
                <Shield size={32} />
              </motion.div>
              <h2 className="text-3xl font-light">Critères de qualité</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Pour être approuvé, votre article doit respecter ces standards :
            </p>
            <div className="space-y-4">
              {[
                "**Authenticité** : Contenu basé sur des connaissances réelles ou des recherches",
                "**Clarté** : Langue accessible, bien structurée, facile à suivre",
                "**Respect** : Présentation respectueuse du patrimoine et des traditions",
                "**Sources** : Citations des sources quand approprié (avec déontologie)",
                "**Longueur** : Minimum 800 mots pour assurer une profondeur suffisante",
                "**Originalité** : Contenu créé pour Kisakata, pas copiée d'ailleurs",
              ].map((criterion, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-[#C16B34] mt-1 shrink-0" />
                  <p className="text-gray-300">{criterion}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Section 5: FAQ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <motion.div {...iconVariants} transition={{ type: "spring", stiffness: 260, damping: 20 }} className="text-[#C16B34]">
                <HelpCircle size={32} />
              </motion.div>
              <h2 className="text-3xl font-light">Questions fréquentes</h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                >
                  <h3 className="text-lg font-light mb-3 text-white">{item.question}</h3>
                  <p className="text-gray-400">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#C16B34]/20 to-transparent border border-[#C16B34]/30 rounded-lg p-12 text-center"
          >
            <h2 className="text-3xl font-light mb-4">Prêt à contribuer ?</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté de contributeurs et aidez-nous à préserver et
              partager la richesse du patrimoine sakata.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={ROUTES.PROFIL}
                className="inline-flex items-center justify-center px-8 py-3 bg-[#C16B34] hover:bg-[#a85a2a] text-white rounded-lg transition-colors font-medium"
              >
                Demander l'accès
              </Link>
              <Link
                href={ROUTES.CONTRIBUTEUR}
                className="inline-flex items-center justify-center px-8 py-3 border border-white/20 hover:border-[#C16B34]/50 rounded-lg transition-colors"
              >
                Voir mon tableau de bord
              </Link>
            </div>
          </motion.section>
        </div>
      </main>

      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://kisakata.com/" },
              { "@type": "ListItem", position: 2, name: "Contributeur", item: "https://kisakata.com/contributeur" },
              { "@type": "ListItem", position: 3, name: "Guide", item: "https://kisakata.com/contributeur/guide" },
            ],
          }),
        }}
      />
    </div>
  );
}
