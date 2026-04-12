"use client";

import React from "react";
import { Message } from "./ChatWindow";
import { FileText, Image as ImageIcon, Headphones, Clock } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.isMe;

  const renderContent = () => {
    if (message.fileUrl) {
      if (message.fileType === "audio") {
        return (
          <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-black/20 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
              <Headphones size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Audio message</span>
              <span className="text-xs opacity-70">0:15</span>
            </div>
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
            <FileText className="text-rose-500" size={24} />
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

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && (
          <span className="text-xs text-stone-500 ml-1 mb-1 font-medium">
            {message.senderName}
          </span>
        )}
        
        <div className="relative group">
          <div 
            className={`
              p-3 px-4 rounded-2xl shadow-sm
              ${isMe 
                ? "bg-amber-600 text-white rounded-tr-sm" 
                : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-800 rounded-tl-sm"
              }
            `}
          >
            {renderContent()}
          </div>
          
          <div className={`flex items-center mt-1 space-x-1 ${isMe ? "justify-end" : "justify-start"}`}>
            {message.expiresIn && message.expiresIn !== "never" && (
              <span className="flex items-center text-[10px] text-red-500/80 mr-1">
                <Clock size={10} className="mr-0.5" />
                {message.expiresIn === "7_days" ? "7j" : "30j"}
              </span>
            )}
            <span className="text-[11px] text-stone-400">
              {message.createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
