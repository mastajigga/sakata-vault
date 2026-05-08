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

      // Build pure HTML+CSS — no markdown. The broadcastTemplate inserts this verbatim.
      const escape = (s: string) => s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[c]
      );

      const sectionsHtml = versionData.sections.map(section => `
        <h3>${escape(section.title)}</h3>
        <ul>
          ${section.items.map(item => `<li>${escape(item)}</li>`).join("")}
        </ul>
      `).join("");

      const html = `
        <p>Mboté la communauté Basakata,</p>
        <p>Nous sommes ravis de vous annoncer la sortie de la <strong>version ${escape(versionData.version)}</strong> (${escape(versionData.date)}).</p>
        <p style="font-style: italic; color: rgba(242, 238, 221, 0.7);">${escape(versionData.subtitle)}</p>
        ${sectionsHtml}
        <p>Explorez ces nouveautés dès maintenant sur <a href="https://sakata-basakata.com" style="color: #B59551; text-decoration: none;">sakata-basakata.com</a>.</p>
        <p style="margin-top: 32px; color: rgba(242, 238, 221, 0.6);"><em>— L'équipe Sakata Digital Hub</em></p>
      `.trim();

      setEmailContent(html);
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
            <div className="rounded-2xl shadow-2xl min-h-[600px] overflow-hidden border border-or-ancestral/30" style={{ background: "#0A1F15" }}>
              {/* Real email rendering with the broadcast template styling */}
              <div style={{ padding: "50px 30px", textAlign: "center", background: "linear-gradient(180deg, #122A1E 0%, #0A1F15 100%)" }}>
                <div style={{ color: "#B59551", fontSize: "28px", fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "Inter, Arial, sans-serif" }}>
                  Sakata Digital Hub
                </div>
                <div style={{ color: "rgba(242, 238, 221, 0.6)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", marginTop: 6, fontFamily: "Inter, Arial, sans-serif" }}>
                  Mise à jour v{selectedVersion}
                </div>
              </div>
              <div
                className="email-preview-content"
                style={{ padding: "32px 35px", color: "rgba(242, 238, 221, 0.9)", fontSize: 15, lineHeight: 1.6, fontFamily: "Inter, Arial, sans-serif" }}
                dangerouslySetInnerHTML={{ __html: emailContent }}
              />
              <style jsx>{`
                .email-preview-content :global(h3) { color: #B59551; font-size: 18px; border-bottom: 1px solid rgba(181, 149, 81, 0.15); padding-bottom: 8px; margin-top: 28px; margin-bottom: 14px; }
                .email-preview-content :global(p) { margin: 0 0 14px 0; }
                .email-preview-content :global(ul) { list-style: none; padding: 0; margin: 0 0 16px 0; }
                .email-preview-content :global(li) { margin-bottom: 10px; padding-left: 20px; position: relative; }
                .email-preview-content :global(li)::before { content: "•"; color: #B59551; position: absolute; left: 0; }
              `}</style>
              <div style={{ textAlign: "center", padding: "30px", borderTop: "1px solid rgba(181, 149, 81, 0.1)", color: "rgba(242, 238, 221, 0.4)", fontSize: 12, fontFamily: "Inter, Arial, sans-serif" }}>
                © {new Date().getFullYear()} Sakata Digital Hub
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
                <label className="text-sm text-gray-400 flex items-center justify-between">
                  <span>Contenu (HTML)</span>
                  <span className="text-[10px] uppercase tracking-widest text-or-ancestral/60 font-mono">Aucun markdown — uniquement HTML</span>
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  className="w-full h-[500px] bg-white/5 border border-white/10 rounded-xl px-4 py-4 font-mono text-sm focus:ring-2 focus:ring-[var(--or-ancestral)] outline-none resize-none"
                />
                <p className="text-[10px] text-gray-500 italic">
                  Balises supportées : <code>&lt;h3&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;li&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;a&gt;</code>. Le style est appliqué automatiquement par le template d'email.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
