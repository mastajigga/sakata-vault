"use client";

import React, { useState, useRef, useEffect, useCallback, useImperativeHandle } from "react";
import { Send, Paperclip, Mic, X, Clock, Play, Pause, Eye } from "lucide-react";
import { TIMINGS } from "@/lib/constants/timings";
import {
  IMAGE_VIEW_MODES,
  EXPIRY_DURATIONS,
  type ImageViewMode as ImageViewModeType,
  type ExpiryDuration,
} from "@/lib/constants/business";

interface ChatInputProps {
  onSend: (content: string, attachment?: File | null, expiresIn?: string, maxViews?: 1 | 2) => void;
  onTyping?: (isTyping: boolean) => void;
  isTemporaryConversation?: boolean;
  temporaryDuration?: "24h" | "48h";
  repliedMessage?: any;
  onClearReply?: () => void;
}

const WAVEFORM_BARS = [4, 8, 14, 10, 18, 12, 20, 9, 16, 11, 19, 7, 15, 13, 6, 17, 10, 14, 8, 16];

// ImageViewMode is imported from @/lib/constants/business
type ImageViewMode = ImageViewModeType;

// ─── Ephemeral Image Picker panel ────────────────────────────────────────────

function EphemeralImagePicker({
  file,
  mode,
  onModeChange,
  onRemove,
}: {
  file: File;
  mode: ImageViewMode;
  onModeChange: (m: ImageViewMode) => void;
  onRemove: () => void;
}) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setThumbUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const sizeKb = (file.size / 1024).toFixed(1);

  const modeOptions: { value: ImageViewMode; label: string }[] = [
    { value: IMAGE_VIEW_MODES.NORMAL, label: "Normal" },
    { value: IMAGE_VIEW_MODES.ONCE, label: "👁 Vue 1×" },
    { value: IMAGE_VIEW_MODES.TWICE, label: "👁 Vue 2×" },
  ];

  return (
    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-xl p-3 z-20 flex flex-col gap-3">
      {/* File info row */}
      <div className="flex items-center gap-3">
        {thumbUrl && (
          <div
            className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0 border border-stone-200 dark:border-stone-700"
            style={{ backgroundImage: `url(${thumbUrl})` }}
          />
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-sm font-medium text-stone-700 dark:text-stone-200 truncate">
            {file.name}
          </span>
          <span className="text-xs text-stone-500">{sizeKb} KB</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-full flex-shrink-0 transition-colors"
        >
          <X size={15} className="text-rose-500" />
        </button>
      </div>

      {/* Mode selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-stone-500 font-medium mr-1 flex-shrink-0">
          Mode envoi :
        </span>
        {modeOptions.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onModeChange(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === value
                ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                : "bg-stone-100 dark:bg-stone-700 border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode !== IMAGE_VIEW_MODES.NORMAL && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
          <Eye size={11} className="flex-shrink-0" />
          {mode === IMAGE_VIEW_MODES.ONCE
            ? `L'image disparaîtra après avoir été vue une fois (${TIMINGS.VIEW_ONCE_COUNTDOWN} secondes).`
            : `L'image disparaîtra après avoir été vue 2 fois (${TIMINGS.VIEW_TWICE_COUNTDOWN} secondes chacune).`}
        </p>
      )}
    </div>
  );
}

// ─── ChatInput ────────────────────────────────────────────────────────────────

const ChatInput = React.forwardRef<{ focusInput: () => void }, ChatInputProps>(
  function ChatInput({
    onSend,
    onTyping,
    isTemporaryConversation,
    temporaryDuration,
    repliedMessage,
    onClearReply,
  }: ChatInputProps, ref: React.Ref<{ focusInput: () => void }>) {
  const [content, setContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [expiresIn, setExpiresIn] = useState<ExpiryDuration>(
    isTemporaryConversation ? (temporaryDuration ?? EXPIRY_DURATIONS.H24) : EXPIRY_DURATIONS.NEVER
  );

  // Attachments
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  // Image view mode for the ephemeral picker
  const [imageViewMode, setImageViewMode] = useState<ImageViewMode>(
    isTemporaryConversation ? IMAGE_VIEW_MODES.ONCE : IMAGE_VIEW_MODES.NORMAL
  );

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio preview
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Expose focusInput method to parent via ref
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }), []);

  // Derive whether the current attachment is an image (non-audio)
  const isImageAttachment = !!(attachment && attachment.type.startsWith("image/") && !audioPreviewUrl);

  // Sync expiresIn when parent toggles temporary mode
  useEffect(() => {
    if (isTemporaryConversation) {
      setExpiresIn(temporaryDuration ?? EXPIRY_DURATIONS.H24);
      setImageViewMode(IMAGE_VIEW_MODES.ONCE);
    } else {
      setExpiresIn(EXPIRY_DURATIONS.NEVER);
      setImageViewMode(IMAGE_VIEW_MODES.NORMAL);
    }
  }, [isTemporaryConversation, temporaryDuration]);

  // Reset image view mode when attachment is removed
  useEffect(() => {
    if (!attachment) {
      setImageViewMode(isTemporaryConversation ? IMAGE_VIEW_MODES.ONCE : IMAGE_VIEW_MODES.NORMAL);
    }
  }, [attachment, isTemporaryConversation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      previewAudioRef.current?.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resolveMaxViews = (): 1 | 2 | undefined => {
    if (!isImageAttachment) return undefined;
    if (imageViewMode === IMAGE_VIEW_MODES.ONCE) return 1;
    if (imageViewMode === IMAGE_VIEW_MODES.TWICE) return 2;
    return undefined;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If there's an audio preview pending, send it
    if (audioPreviewUrl && attachment) {
      if (onTyping) onTyping(false);
      onSend(content, attachment, expiresIn);
      cancelAudioPreview();
      setContent("");
      return;
    }

    if (!content.trim() && !attachment) return;

    if (onTyping) onTyping(false);
    onSend(content, attachment, expiresIn, resolveMaxViews());
    setContent("");
    setAttachment(null);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, TIMINGS.TYPING_STOP_DELAY);
    }
  };

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachment(file);
      // Default image view mode depends on conversation type
      if (file.type.startsWith("image/")) {
        setImageViewMode(isTemporaryConversation ? IMAGE_VIEW_MODES.ONCE : IMAGE_VIEW_MODES.NORMAL);
      }
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `vocal_${Date.now()}.webm`, { type: "audio/webm" });
        const previewUrl = URL.createObjectURL(audioBlob);

        setAttachment(audioFile);
        setAudioPreviewUrl(previewUrl);

        const audio = new Audio(previewUrl);
        previewAudioRef.current = audio;
        audio.onloadedmetadata = () => {
          setPreviewDuration(Math.round(audio.duration));
        };
        audio.onended = () => setIsPlayingPreview(false);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Accès au microphone refusé.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const cancelAudioPreview = useCallback(() => {
    previewAudioRef.current?.pause();
    setIsPlayingPreview(false);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(null);
    setAttachment(null);
    setPreviewDuration(0);
    previewAudioRef.current = null;
  }, [audioPreviewUrl]);

  const togglePreviewPlayback = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const sendAudioMessage = () => {
    if (!attachment) return;
    if (onTyping) onTyping(false);
    onSend(content, attachment, expiresIn);
    cancelAudioPreview();
    setContent("");
  };

  const ephemeralLabel = (val: typeof expiresIn) => {
    switch (val) {
      case EXPIRY_DURATIONS.H24: return "Éphémère · 24h";
      case EXPIRY_DURATIONS.H48: return "Éphémère · 48h";
      case EXPIRY_DURATIONS.DAYS_7: return "Éphémère · 7 jours";
      case EXPIRY_DURATIONS.DAYS_30: return "Éphémère · 30 jours";
      default: return "Permanent";
    }
  };

  const isEphemeral = expiresIn !== EXPIRY_DURATIONS.NEVER;

  return (
    <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 relative">
      {/* Reply context display */}
      {repliedMessage && (
        <div className="border-b border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 px-3 md:px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">
              En réponse à {repliedMessage.senderName}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-300 line-clamp-1 opacity-75">
              {repliedMessage.content.substring(0, 100)}
            </div>
          </div>
          <button
            type="button"
            onClick={onClearReply}
            className="p-1 hover:bg-amber-200 dark:hover:bg-amber-800 rounded-full flex-shrink-0 transition-colors"
            aria-label="Annuler la réponse"
          >
            <X size={16} className="text-amber-700 dark:text-amber-400" />
          </button>
        </div>
      )}

      <div className="p-3 md:p-4 relative">
        {/* Ephemeral Options Popup */}
      {showOptions && (
        <div className="absolute bottom-full left-4 mb-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-hidden flex flex-col z-20 w-52">
          <div className="p-2 border-b border-stone-100 dark:border-stone-700 text-xs font-semibold text-stone-500 uppercase tracking-wider flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
            <span>Durée de vie</span>
            <button onClick={() => setShowOptions(false)}>
              <X size={14} />
            </button>
          </div>
          {(
            [
              { value: EXPIRY_DURATIONS.NEVER, label: "Permanent (conserver)", icon: null },
              { value: EXPIRY_DURATIONS.H24, label: "Éphémère · 24 heures", icon: "🕛" },
              { value: EXPIRY_DURATIONS.H48, label: "Éphémère · 48 heures", icon: "🕑" },
              { value: EXPIRY_DURATIONS.DAYS_7, label: "Éphémère · 7 jours", icon: "📆" },
              { value: EXPIRY_DURATIONS.DAYS_30, label: "Éphémère · 30 jours", icon: "🗓" },
            ] as { value: typeof expiresIn; label: string; icon: string | null }[]
          ).map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center gap-2 ${
                expiresIn === value
                  ? "text-amber-600 font-medium bg-amber-50 dark:bg-stone-700"
                  : "text-stone-700 dark:text-stone-300"
              }`}
              onClick={() => {
                setExpiresIn(value);
                setShowOptions(false);
              }}
            >
              {icon ? <span className="text-base leading-none">{icon}</span> : <Clock size={14} />}
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Ephemeral image picker — shown for image attachments (not audio) */}
      {isImageAttachment && (
        <EphemeralImagePicker
          file={attachment!}
          mode={imageViewMode}
          onModeChange={setImageViewMode}
          onRemove={() => setAttachment(null)}
        />
      )}

      {/* Generic non-image / non-audio attachment preview */}
      {attachment && !audioPreviewUrl && !isImageAttachment && (
        <div className="absolute bottom-full left-4 mb-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm rounded-lg p-2 flex items-center gap-3 z-10">
          <div className="bg-white dark:bg-stone-900 p-2 rounded">
            <Paperclip size={20} className="text-stone-500" />
          </div>
          <div className="flex flex-col max-w-xs">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
              {attachment.name}
            </span>
            <span className="text-xs text-stone-500">{(attachment.size / 1024).toFixed(1)} KB</span>
          </div>
          <button
            type="button"
            onClick={() => setAttachment(null)}
            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full"
          >
            <X size={16} className="text-rose-500" />
          </button>
        </div>
      )}

      {/* Audio preview bar — WhatsApp-style */}
      {audioPreviewUrl && (
        <div className="mb-3 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-3 py-2 flex items-center gap-3">
          {/* Cancel */}
          <button
            type="button"
            onClick={cancelAudioPreview}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 flex-shrink-0 transition-colors"
          >
            <X size={16} className="text-rose-500" />
          </button>

          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePreviewPlayback}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-600 hover:bg-amber-700 text-white flex-shrink-0 transition-colors shadow-md"
          >
            {isPlayingPreview ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>

          {/* Waveform bars */}
          <div className="flex items-center gap-[2px] flex-1 h-8">
            {WAVEFORM_BARS.map((height, i) => (
              <div
                key={i}
                className={`rounded-full flex-1 transition-all duration-150 ${
                  isPlayingPreview ? "bg-amber-500 animate-pulse" : "bg-stone-400 dark:bg-stone-500"
                }`}
                style={{
                  height: `${height}px`,
                  animationDelay: isPlayingPreview ? `${(i * 50) % 400}ms` : "0ms",
                }}
              />
            ))}
          </div>

          {/* Duration */}
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400 flex-shrink-0 w-10 text-right">
            {formatTime(previewDuration || recordingTime)}
          </span>

          {/* Send button */}
          <button
            type="button"
            onClick={sendAudioMessage}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium flex-shrink-0 transition-colors shadow-md"
          >
            <Send size={14} />
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Ephemeral timer button */}
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          title={ephemeralLabel(expiresIn)}
          className={`p-3 rounded-full flex-shrink-0 transition-colors duration-200 hidden sm:block ${
            isEphemeral
              ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              : "text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
          }`}
        >
          <Clock size={20} />
        </button>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={handleFileClick}
          className="p-3 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full flex-shrink-0 transition-colors"
        >
          <Paperclip size={20} />
        </button>

        <div className="flex-1 flex flex-col justify-end">
          {isRecording ? (
            <div className="h-[48px] bg-red-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-between px-4 border border-red-200 dark:border-rose-800/30 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-red-600 dark:text-rose-400 font-mono text-sm">
                  {formatTime(recordingTime)}
                </span>
              </div>
              <span className="text-red-500 text-xs uppercase tracking-wider font-semibold">
                Enregistrement...
              </span>
            </div>
          ) : (
            <div className="bg-stone-100 dark:bg-stone-800 rounded-3xl relative overflow-hidden flex items-center shadow-inner">
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent px-4 py-3 focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-500"
                placeholder={
                  audioPreviewUrl
                    ? "Ajouter un commentaire au vocal..."
                    : isImageAttachment
                    ? "Ajouter un commentaire..."
                    : attachment
                    ? "Ajouter un commentaire..."
                    : "Écrire un message..."
                }
                value={content}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        {/* Send or Mic button */}
        {content.trim() || (attachment && !audioPreviewUrl) ? (
          <button
            type="submit"
            className="p-3 bg-amber-600 text-white rounded-full flex-shrink-0 hover:bg-amber-700 transition shadow-md hover:scale-105 active:scale-95 flex items-center justify-center h-12 w-12"
          >
            <Send size={20} className="ml-1" />
          </button>
        ) : !audioPreviewUrl ? (
          <button
            type="button"
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerCancel={stopRecording}
            className={`p-3 rounded-full flex-shrink-0 transition flex items-center justify-center h-12 w-12 ${
              isRecording
                ? "bg-red-500 text-white shadow-lg scale-110"
                : "bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700"
            }`}
          >
            <Mic size={20} className={isRecording ? "animate-pulse" : ""} />
          </button>
        ) : null}
      </form>
      </div>
    </div>
  );
  }
);

export default ChatInput;
