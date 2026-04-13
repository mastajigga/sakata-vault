"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Message } from "./ChatWindow";
import { FileText, Clock, Play, Pause, Download } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isTemporary?: boolean;
}

function AudioPlayer({ fileUrl, isTemporary }: { fileUrl: string; isTemporary?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0); // 0–100
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
      {/* Play / Pause button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-9 h-9 flex-shrink-0 rounded-full bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shadow-sm transition-colors active:scale-95"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>

      {/* Progress track */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div
          ref={progressBarRef}
          onClick={handleScrub}
          className="relative h-1.5 bg-black/20 dark:bg-white/20 rounded-full cursor-pointer group"
        >
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full bg-current rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-current shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Time */}
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono opacity-70">
            {formatTime(elapsed)}/{formatTime(duration)}
          </span>
          {/* Download — hidden when isTemporary */}
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

export function MessageBubble({ message, isTemporary }: MessageBubbleProps) {
  const isMe = message.isMe;

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
        return (
          <div className="rounded-lg overflow-hidden border border-black/10 dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={message.fileUrl} alt="Attachment" className="max-w-xs h-auto block" />
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
            <span className="text-[11px] text-stone-400">{message.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
