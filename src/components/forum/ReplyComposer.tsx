"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Smile, Film, Send, X, Loader2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import GifPicker from "./GifPicker";

interface ReplyComposerProps {
  threadId: string;
  parentPostId?: string | null;
  authorId: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  compact?: boolean;
}

export default function ReplyComposer({
  threadId,
  parentPostId = null,
  authorId,
  onSubmitted,
  onCancel,
  autoFocus = false,
  compact = false,
}: ReplyComposerProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const insertAtCursor = (text: string) => {
    const ta = textareaRef.current;
    if (!ta) {
      setContent((c) => c + text);
      return;
    }
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const next = before + text + after;
    setContent(next);
    // Restore cursor after insertion
    setTimeout(() => {
      ta.focus();
      const newPos = start + text.length;
      ta.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const { error: insertErr } = await supabase.from("forum_posts").insert({
        thread_id: threadId,
        author_id: authorId,
        content: content.trim(),
        parent_post_id: parentPostId,
      });

      if (insertErr) throw insertErr;

      setContent("");
      onSubmitted?.();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la publication");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative rounded-2xl border ${
        compact
          ? "border-or-ancestral/20 bg-white/[0.02] p-3"
          : "border-or-ancestral/30 bg-white/[0.04] p-4"
      } backdrop-blur-md`}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          parentPostId
            ? "Écrire une réponse… (vous pouvez @mentionner)"
            : "Ajouter votre voix au village…"
        }
        rows={compact ? 2 : 4}
        className="w-full bg-transparent outline-none text-ivoire-ancien placeholder-ivoire-ancien/30 resize-none text-[15px] leading-relaxed"
      />

      {error && (
        <p className="text-xs text-red-300 mb-2 px-2">{error}</p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 relative">
          <button
            type="button"
            onClick={() => setEmojiOpen((v) => !v)}
            className="p-2 rounded-full hover:bg-white/5 text-ivoire-ancien/50 hover:text-or-ancestral transition-colors"
            title="Ajouter un emoji"
          >
            <Smile className="w-4 h-4" />
          </button>
          <EmojiPicker
            open={emojiOpen}
            onClose={() => setEmojiOpen(false)}
            onSelect={(emoji) => insertAtCursor(emoji)}
          />

          <button
            type="button"
            onClick={() => setGifOpen(true)}
            className="p-2 rounded-full hover:bg-white/5 text-ivoire-ancien/50 hover:text-or-ancestral transition-colors"
            title="Ajouter un GIF"
          >
            <Film className="w-4 h-4" />
          </button>
          <GifPicker
            open={gifOpen}
            onClose={() => setGifOpen(false)}
            onSelect={(gif) => insertAtCursor(`\n\n![${gif.title}](${gif.full})\n\n`)}
          />
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 rounded-lg text-xs text-ivoire-ancien/50 hover:text-ivoire-ancien transition-colors inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-or-ancestral text-foret-nocturne text-xs font-bold transition-all hover:scale-[1.02] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {parentPostId ? "Répondre" : "Publier"}
          </button>
        </div>
      </div>
    </form>
  );
}
