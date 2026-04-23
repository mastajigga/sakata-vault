"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import changelogData from "@/data/changelog.json";
import { Send, Eye, Edit3, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

import { broadcastUpdateEmail } from "./actions";

interface ChangelogSection {
  title: string;
  items: string[];
}

interface ChangelogVersion {
  version: string;
  date: string;
  subtitle: string;
  sections: ChangelogSection[];
}

export default function AdminNotificationPage() {
  const [selectedVersion, setSelectedVersion] = useState<string>(changelogData[0].version);
  const [emailContent, setEmailContent] = useState("");
  const [subject, setSubject] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const versionData = changelogData.find(v => v.version === selectedVersion);
    if (versionData) {
      setSubject(`Mise à jour Sakata Digital : ${versionData.version}`);
      
      let content = `Mboté la communauté Basakata,\n\nNous sommes ravis de vous annoncer la sortie de la version ${versionData.version} (${versionData.date}).\n\n${versionData.subtitle}\n\n`;
      
      versionData.sections.forEach(section => {
        content += `### ${section.title}\n`;
        section.items.forEach(item => {
          content += `- ${item}\n`;
        });
        content += `\n`;
      });
      
      content += `Explorez ces nouveautés dès maintenant sur https://sakata-basakata.com\n\nL'équipe Sakata Digital Hub`;
      setEmailContent(content);
    }
  }, [selectedVersion]);

  const handleSend = async () => {
    if (!subject || !emailContent) {
      setErrorMessage("Le sujet et le contenu ne peuvent pas être vides.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMessage(null);

    try {
      const result = await broadcastUpdateEmail({
        subject,
        content: emailContent,
        version: selectedVersion,
      });

      if (result.success) {
        setStatus("success");
      } else {
        setErrorMessage(result.error || "Une erreur inattendue est survenue.");
        setStatus("error");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "La forêt numérique rencontre des perturbations.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen p-8 text-white space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: "var(--or-ancestral)" }}>
            Notification Center
          </h1>
          <p className="text-gray-400 mt-2">
            Composez et envoyez les mises à jour culturelles à la communauté.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            {previewMode ? <Edit3 size={18} /> : <Eye size={18} />}
            {previewMode ? "Éditer" : "Aperçu"}
          </button>
          <button
            onClick={handleSend}
            disabled={status === "sending"}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--or-ancestral)] hover:bg-[var(--or-profond,#A15B24)] transition-all font-bold disabled:opacity-50"
          >
            <Send size={18} />
            {status === "sending" ? "Envoi..." : "Diffuser"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[var(--or-ancestral)]" />
              Source des données
            </h3>
            <div className="space-y-3">
              <label className="text-sm text-gray-400">Choisir une version du Changelog</label>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--or-ancestral)] outline-none"
              >
                {changelogData.map(v => (
                  <option key={v.version} value={v.version}>{v.version} ({v.date})</option>
                ))}
              </select>
            </div>
            
            <div className="mt-8 p-4 bg-[var(--or-ancestral)]/10 border border-[var(--or-ancestral)]/30 rounded-xl space-y-2">
              <p className="text-sm text-[var(--or-ancestral)] font-medium flex items-center gap-2">
                <AlertCircle size={14} />
                Conseil Éditorial
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Utilisez un ton sage et inspirant. Les membres apprécient le lien entre 
                la modernité et nos racines Basakata.
              </p>
            </div>
          </div>

          {status === "success" && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 text-emerald-400 mb-2 font-bold">
                <CheckCircle2 /> Succès
              </div>
              <p className="text-sm text-emerald-100/70 leading-relaxed font-body">
                La notification a été diffusée avec succès à tous les membres du sanctuaire numérique.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <div className="flex items-center gap-3 text-red-400 mb-2 font-bold">
                <XCircle /> Échec
              </div>
              <p className="text-sm text-red-100/70 leading-relaxed font-body">
                {errorMessage || "Une erreur s'est produite lors de la transmission du message."}
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-4 text-[10px] uppercase tracking-widest text-red-400/60 hover:text-red-400 transition-colors"
              >
                Réessayer la transmission
              </button>
            </div>
          )}
        </div>

        {/* Main: Composition / Preview */}
        <div className="lg:col-span-2 space-y-4">
          {previewMode ? (
            <div className="bg-white p-12 rounded-2xl text-gray-900 shadow-2xl min-h-[600px] border border-gray-200 font-sans">
              {/* Email Styled Preview */}
              <div className="max-w-xl mx-auto">
                <div className="w-16 h-1 w bg-[var(--or-ancestral)] mb-8" />
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{subject}</h1>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                  {emailContent}
                </div>
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <p className="text-sm text-gray-400 italic">
                    Vous recevez cet email car vous êtes membre du Sakata Digital Hub.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Objet de l'email</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-[var(--or-ancestral)] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Contenu (Markdown supporté)</label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-[500px] bg-white/5 border border-white/10 rounded-xl px-4 py-4 font-mono text-sm focus:ring-2 focus:ring-[var(--or-ancestral)] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
