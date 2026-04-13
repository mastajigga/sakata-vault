"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Message } from "./ChatWindow";
import { FileText, Clock, Play, Pause, Download, Lock, Eye } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isTemporary?: boolean;
}

// ─── Audio Player ────────────────────────────────────────────────────────────

function AudioPlayer({ fileUrl, isTemporary }: { fileUrl: string; isTemporary?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(fileUrl);
    audioRef.current = audio;
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.onended = () => {
      setIsPlaying(false);
      setElapsed(0);
      setProgress(0);
    };
    return () => {
      audio.pause();
      audio.src = "";
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [fileUrl]);

  const tick = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setElapsed(audio.currentTime);
    setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0);
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    } else {
      audio.play();
      setIsPlaying(true);
      animFrameRef.current = requestAnimationFrame(tick);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (!audio || !bar || !audio.duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
    setElapsed(audio.currentTime);
    setProgress(ratio * 100);
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 min-w-[220px] max-w-xs w-full">
      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 flex-shrink-0 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-sm transition-colors active:scale-95"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div
          ref={progressBarRef}
          onClick={handleScrub}
          className="relative h-1.5 bg-black/20 dark:bg-white/20 rounded-full cursor-pointer group"
        >
          <div
            className="absolute left-0 top-0 h-full bg-current rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-current shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono opacity-70">
            {formatTime(elapsed)}/{formatTime(duration)}
          </span>
          {/* No download link in temporary mode */}
          {!isTemporary && (
            <a
              href={fileUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="opacity-50 hover:opacity-100 transition-opacity"
              title="Télécharger l'audio"
            >
              <Download size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Protected / View-once Image ─────────────────────────────────────────────

type ViewState = "locked" | "revealed" | "expired";

function ProtectedImage({
  message,
  isTemporary,
}: {
  message: Message;
  isTemporary?: boolean;
}) {
  const { fileUrl, id, maxViews } = message;
  const countdownTotal = maxViews === 1 ? 5 : 10;
  const storageKey = `msg-viewed-${id}`;

  // Determine initial state from localStorage
  const [viewState, setViewState] = useState<ViewState>(() => {
    try {
      return localStorage.getItem(storageKey) ? "expired" : "locked";
    } catch {
      return "locked";
    }
  });

  const [countdown, setCountdown] = useState(countdownTotal);
  const [showCaptureAlert, setShowCaptureAlert] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Screen capture detection while image is revealed
  useEffect(() => {
    if (viewState !== "revealed") return;

    const handleBlur = () => {
      setShowCaptureAlert(true);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
      alertTimeoutRef.current = setTimeout(() => setShowCaptureAlert(false), 2000);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowCaptureAlert(true);
        if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
        alertTimeoutRef.current = setTimeout(() => setShowCaptureAlert(false), 2000);
      } else {
        setShowCaptureAlert(false);
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, [viewState]);

  // Countdown timer on reveal
  useEffect(() => {
    if (viewState !== "revealed") return;

    setCountdown(countdownTotal);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setViewState("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [viewState, countdownTotal]);

  const handleReveal = () => {
    if (viewState !== "locked") return;
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // localStorage unavailable — still reveal in-session
    }
    setViewState("revealed");
  };

  const progressPct = viewState === "revealed" ? (countdown / countdownTotal) * 100 : 0;

  if (viewState === "expired") {
    return (
      <div className="rounded-xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center w-48 h-32 gap-2">
        <Lock size={16} className="text-stone-500 dark:text-stone-400 flex-shrink-0" />
        <span className="text-sm text-stone-500 dark:text-stone-400 font-medium">
          Image expirée
        </span>
      </div>
    );
  }

  if (viewState === "locked") {
    return (
      <button
        type="button"
        onClick={handleReveal}
        className="relative rounded-xl overflow-hidden w-48 h-32 bg-stone-900 flex flex-col items-center justify-center gap-1 cursor-pointer group"
        aria-label="Appuyer pour voir l'image"
      >
        {/* Blurred background hint */}
        {fileUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileUrl}
            alt=""
            draggable="false"
            className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60 pointer-events-none select-none"
            style={{ userSelect: "none", WebkitUserSelect: "none" }}
          />
        )}
        <div className="absolute inset-0 bg-stone-900/60 rounded-xl" />
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <Eye size={22} className="text-white drop-shadow" />
          <span className="text-white text-xs font-semibold drop-shadow">
            {maxViews === 1 ? "👁 Vue unique" : "👁 Vue 2×"}
          </span>
          <span className="text-white/60 text-[10px]">Appuyer pour révéler</span>
        </div>
      </button>
    );
  }

  // viewState === "revealed"
  return (
    <div
      className="relative rounded-lg overflow-hidden border border-black/10 dark:border-white/10"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none" as React.CSSProperties["WebkitUserSelect"] }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fileUrl}
        alt="Attachment"
        draggable="false"
        className="max-w-xs h-auto block"
        style={{ WebkitUserDrag: "none" } as React.CSSProperties}
      />

      {/* Invisible right-click blocker overlay */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        style={{ userSelect: "none", pointerEvents: "auto" }}
      />

      {/* Countdown bar + timer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-2 pb-1.5 pt-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-[10px] font-mono font-semibold drop-shadow">
            {countdown}s
          </span>
          <span className="text-white/70 text-[10px]">
            {maxViews === 1 ? "Vue unique" : "Vue 2×"}
          </span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full"
            style={{
              width: `${progressPct}%`,
              transition: "width 1s linear",
            }}
          />
        </div>
      </div>

      {/* Screen capture alert overlay */}
      {showCaptureAlert && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center backdrop-blur-xl bg-stone-900/80 rounded-lg">
          <Lock size={28} className="text-amber-400 mb-2" />
          <span className="text-white text-sm font-semibold text-center px-4">
            🔒 Contenu protégé
          </span>
        </div>
      )}
    </div>
  );
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

export function MessageBubble({ message, isTemporary }: MessageBubbleProps) {
  const isMe = message.isMe;
  const isProtectedImage =
    message.fileType === "image" &&
    message.fileUrl &&
    (isTemporary || !!message.maxViews);

  const renderContent = () => {
    if (message.fileUrl) {
      if (message.fileType === "audio") {
        return (
          <div className="p-2">
            <AudioPlayer fileUrl={message.fileUrl} isTemporary={isTemporary} />
          </div>
        );
      }

      if (message.fileType === "image") {
        if (isProtectedImage) {
          return (
            <div className="p-1">
              <ProtectedImage message={message} isTemporary={isTemporary} />
            </div>
          );
        }
        // Normal (non-protected) image — no download link in temporary mode
        return (
          <div
            className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10 relative"
            onContextMenu={isTemporary ? (e) => e.preventDefault() : undefined}
            style={isTemporary ? { userSelect: "none" } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.fileUrl}
              alt="Attachment"
              draggable={isTemporary ? false : undefined}
              className="max-w-xs h-auto block"
            />
            {isTemporary && (
              <div
                className="absolute inset-0 z-10"
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                style={{ userSelect: "none", pointerEvents: "auto" }}
              />
            )}
          </div>
        );
      }

      if (message.fileType === "pdf") {
        return (
          <div className="flex items-center gap-2 p-3 bg-black/5 dark:bg-black/20 rounded-lg max-w-xs">
            <FileText className="text-rose-500 flex-shrink-0" size={24} />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">Document.pdf</span>
              <span className="text-xs opacity-70">PDF Document</span>
            </div>
          </div>
        );
      }
    }

    return <p className="text-[15px] leading-relaxed">{message.content}</p>;
  };

  const expiresLabel = () => {
    switch (message.expiresIn) {
      case "24h": return "24h";
      case "48h": return "48h";
      case "7_days": return "7j";
      case "30_days": return "30j";
      default: return null;
    }
  };

  const expLabel = expiresLabel();

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`flex flex-col max-w-[85%] md:max-w-[70%] ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {!isMe && (
          <span className="text-xs text-stone-500 ml-1 mb-1 font-medium">
            {message.senderName}
          </span>
        )}

        <div className="relative group">
          <div
            className={`
              p-3 px-4 rounded-2xl shadow-sm
              ${
                isMe
                  ? "bg-amber-600 text-white rounded-tr-sm"
                  : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-800 rounded-tl-sm"
              }
            `}
          >
            {renderContent()}
          </div>

          <div
            className={`flex items-center mt-1 space-x-1 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {expLabel && (
              <span className="flex items-center text-[10px] text-amber-600/80 mr-1">
                <Clock size={10} className="mr-0.5" />
                {expLabel}
              </span>
            )}
            {message.maxViews && (
              <span className="flex items-center text-[10px] text-stone-400 mr-1">
                <Eye size={10} className="mr-0.5" />
                {message.maxViews === 1 ? "×1" : "×2"}
              </span>
            )}
            <span className="text-[11px] text-stone-400">{message.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
