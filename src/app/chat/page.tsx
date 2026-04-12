import React from "react";

export default function ChatIndexPage() {
  return (
    <div className="hidden md:flex flex-col items-center justify-center h-full text-stone-400">
      <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-full mb-4">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p className="text-lg font-medium">Vos Messages</p>
      <p className="text-sm">Sélectionnez une conversation pour commencer</p>
    </div>
  );
}
