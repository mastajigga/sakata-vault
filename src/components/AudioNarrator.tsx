"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AudioNarratorProps {
  audioUrl: string;
  title?: string;
}

const AudioNarrator: React.FC<AudioNarratorProps> = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / dur) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      const newTime = (val / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(val);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="relative group">
      {/* Container with premium styling */}
      <div className="p-1 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-br from-white/[0.05] to-transparent rounded-[1.8rem] flex flex-col md:flex-row items-center gap-6">
          
          {/* Avatar / Icon */}
          <div className="relative w-16 h-16 rounded-full bg-or-ancestral/10 border border-or-ancestral/30 flex items-center justify-center shadow-[0_0_15px_rgba(181,149,81,0.2)]">
            <div className="absolute inset-0 rounded-full animate-pulse bg-or-ancestral/5" />
            <Volume2 className="w-8 h-8 text-or-ancestral" />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-or-ancestral mb-1">Narration du Vieux Sage</p>
                <h4 className="text-ivoire-ancien font-display font-medium text-lg leading-tight truncate max-w-[200px] md:max-w-none">
                  {title || "Le Souffle du Savoir"}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-ivoire-ancien/40">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Custom Range Input */}
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-or-ancestral shadow-[0_0_10px_rgba(181,149,81,0.5)]"
                style={{ width: `${progress}%` }}
                initial={false}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls */}
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-or-ancestral flex items-center justify-center text-foret-nocturne hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-or-ancestral/20"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="mt-4 flex items-center gap-2 px-6">
        <Info size={14} className="text-or-ancestral/60" />
        <p className="text-[10px] text-ivoire-ancien/40 italic">
          Généré par l&apos;IA Gemini 3.1 Flash — Voix de l&apos;Ancien Charon
        </p>
      </div>
    </div>
  );
};

export default AudioNarrator;
