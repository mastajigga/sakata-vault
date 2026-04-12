"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Mic, X, Clock } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string, attachment?: File | null, expiresIn?: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export function ChatInput({ onSend, onTyping }: ChatInputProps) {
  const [content, setContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [expiresIn, setExpiresIn] = useState<"never" | "7_days" | "30_days">("never");
  
  // Attachments
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  
  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() && !attachment) return;
    
    if (onTyping) onTyping(false);
    onSend(content, attachment, expiresIn);
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
      }, 3000); // Stop typing after 3s of inactivity
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `vocal_${Date.now()}.webm`, { type: 'audio/webm' });
        setAttachment(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Accès au microphone refusé.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 p-3 md:p-4 relative">
      {/* Expiration Options Popup */}
      {showOptions && (
        <div className="absolute bottom-full left-4 mb-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl rounded-lg overflow-hidden flex flex-col z-20 w-48">
          <div className="p-2 border-b border-stone-100 dark:border-stone-700 text-xs font-semibold text-stone-500 uppercase tracking-wider flex justify-between items-center bg-stone-50 dark:bg-stone-900/50">
            <span>Auto-destruction</span>
            <button onClick={() => setShowOptions(false)}><X size={14} /></button>
          </div>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 ${expiresIn === 'never' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("never"); setShowOptions(false); }}
          >
            Jamais (Conserver)
          </button>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center ${expiresIn === '30_days' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("30_days"); setShowOptions(false); }}
          >
            <Clock size={14} className="mr-2" />
            Après 30 jours
          </button>
          <button 
            type="button"
            className={`p-3 text-sm text-left hover:bg-stone-50 dark:hover:bg-stone-700/50 flex items-center ${expiresIn === '7_days' ? 'text-amber-600 font-medium bg-amber-50 dark:bg-stone-700' : 'text-stone-700 dark:text-stone-300'}`}
            onClick={() => { setExpiresIn("7_days"); setShowOptions(false); }}
          >
            <Clock size={14} className="mr-2 text-rose-500" />
            Après 7 jours
          </button>
        </div>
      )}

      {/* Attachment Preview */}
      {attachment && (
        <div className="absolute bottom-full left-4 mb-2 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm rounded-lg p-2 flex items-center gap-3 z-10">
          <div className="bg-white dark:bg-stone-900 p-2 rounded">
            {attachment.type.startsWith('image/') ? (
              <div className="w-8 h-8 bg-cover bg-center rounded" style={{ backgroundImage: `url(${URL.createObjectURL(attachment)})` }} />
            ) : attachment.type.startsWith('audio/') ? (
              <Mic size={20} className="text-amber-500" />
            ) : (
              <Paperclip size={20} className="text-stone-500" />
            )}
          </div>
          <div className="flex flex-col max-w-xs">
            <span className="text-sm font-medium text-stone-700 dark:text-stone-300 truncate">
              {attachment.name}
            </span>
            <span className="text-xs text-stone-500">
              {(attachment.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button type="button" onClick={() => setAttachment(null)} className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full">
            <X size={16} className="text-rose-500" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
        <button 
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          title="Paramètres d'auto-destruction"
          className={`p-3 rounded-full flex-shrink-0 transition-colors duration-200 hidden sm:block ${
            expiresIn !== 'never' 
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Clock size={20} />
        </button>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
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
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-red-600 dark:text-rose-400 font-mono text-sm">{formatTime(recordingTime)}</span>
              </div>
              <span className="text-red-500 text-xs uppercase tracking-wider font-semibold">Enregistrement...</span>
            </div>
          ) : (
            <div className="bg-stone-100 dark:bg-stone-800 rounded-3xl relative overflow-hidden flex items-center shadow-inner">
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent px-4 py-3 focus:outline-none text-stone-900 dark:text-stone-100 placeholder-stone-500"
                placeholder={attachment ? "Ajouter un commentaire..." : "Écrire un message..."}
                value={content}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        {content.trim() || attachment ? (
          <button 
            type="submit"
            className="p-3 bg-amber-600 text-white rounded-full flex-shrink-0 hover:bg-amber-700 transition shadow-md hover:scale-105 active:scale-95 flex items-center justify-center h-12 w-12"
          >
            <Send size={20} className="ml-1" />
          </button>
        ) : (
          <button 
            type="button"
            onPointerDown={startRecording}
            onPointerUp={stopRecording}
            onPointerCancel={stopRecording}
            className={`p-3 rounded-full flex-shrink-0 transition flex items-center justify-center h-12 w-12 ${
              isRecording 
                ? 'bg-red-500 text-white shadow-lg scale-110' 
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Mic size={20} className={isRecording ? "animate-pulse" : ""} />
          </button>
        )}
      </form>
    </div>
  );
}
