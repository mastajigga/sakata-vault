"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { emailTemplates, getPhase2Updates, getV2_6Updates, getV2_7Updates } from "@/lib/email/templates";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function UpdatesContent() {
  const searchParams = useSearchParams();
  const [emailContent, setEmailContent] = useState<{ subject: string; html: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateType = searchParams.get("type") || "v2.7";

    // Get user's name or use default
    const userName = "Utilisateur";

    // Get updates based on type
    let updates: string[] = [];
    let subject = "✨ Nouvelles du Sanctuaire : Mises à jour";
    
    if (updateType === "v2.7") {
      updates = getV2_7Updates();
      subject = "⚡ Kisakata v2.7 : Interactivité et Fluidité";
    } else if (updateType === "v2.6") {
      updates = getV2_6Updates();
      subject = "🌲 Kisakata v2.6 : Restauration et Intelligence Ancestrale";
    } else if (updateType === "phase2") {
      updates = getPhase2Updates();
      subject = "✨ Nouvelles du Sanctuaire : Phase 2 est Arrivée !";
    }

    // Generate email content using the same template as emails
    const template = emailTemplates.updateNotification(userName, updates);
    // Override subject
    template.subject = subject;
    
    setEmailContent(template);
  }, [searchParams]);

  if (!mounted || !emailContent) {
    return (
      <div className="section-container py-20 text-center flex-grow">
        <p className="text-gray-400">Chargement des mises à jour...</p>
      </div>
    );
  }

  return (
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
      <div className="bg-[var(--foret-nocturne)]/30 rounded-lg border border-[#C16B34]/20 overflow-hidden">
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
  );
}

export default function UpdatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0F1410] to-[#050B08] flex flex-col">
      <Navbar />
      <Suspense fallback={
        <div className="section-container py-20 text-center flex-grow">
          <p className="text-gray-400">Chargement du sanctuaire...</p>
        </div>
      }>
        <UpdatesContent />
      </Suspense>
      <Footer />
    </main>
  );
}
