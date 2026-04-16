"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { emailTemplates, getPhase2Updates } from "@/lib/email/templates";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function UpdatesPage() {
  const searchParams = useSearchParams();
  const [emailContent, setEmailContent] = useState<{ subject: string; html: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateType = searchParams.get("type") || "phase2";

    // Get user's name or use default
    const userName = "Utilisateur";

    // Get updates based on type
    let updates: string[] = [];
    if (updateType === "phase2") {
      updates = getPhase2Updates();
    }

    // Generate email content using the same template as emails
    const template = emailTemplates.updateNotification(userName, updates);
    setEmailContent(template);
  }, [searchParams]);

  if (!mounted || !emailContent) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#0F1410] to-[#050B08]">
        <Navbar />
        <div className="section-container py-20 text-center">
          <p className="text-gray-400">Chargement des mises à jour...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F1410] to-[#050B08] flex flex-col">
      <Navbar />

      <div className="section-container py-12 flex-grow">
        {/* Back button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-[#C16B34] hover:text-[#E9DCC9] transition mb-8"
        >
          <ArrowLeft size={18} />
          Retour à l'accueil
        </Link>

        {/* Subject */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#E9DCC9] mb-2">
            {emailContent.subject}
          </h1>
          <p className="text-gray-400">
            Découvrez les dernières mises à jour de Sakata
          </p>
        </div>

        {/* Email preview */}
        <div className="bg-[#0A1F15]/30 rounded-lg border border-[#C16B34]/20 overflow-hidden">
          <div className="flex justify-center p-6 bg-[#050B08]">
            <p className="text-gray-500 text-sm">Aperçu du mail</p>
          </div>
          <div className="bg-white p-8 min-h-screen max-w-2xl mx-auto">
            <iframe
              srcDoc={emailContent.html}
              className="w-full border-0"
              style={{ height: "600px" }}
              title="Email content"
              sandbox=""
            />
          </div>
        </div>

        {/* Info box */}
        <div className="mt-12 p-6 border border-[#C16B34]/30 rounded-lg bg-[#C16B34]/5">
          <p className="text-gray-400 text-sm">
            💡 <strong>Vous recevrez un mail similaire</strong> quand vous serez connecté.
            Vérifiez votre adresse email pour ne pas manquer les futures mises à jour.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
