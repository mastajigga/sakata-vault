"use client";

import { CheckCircle2 } from "lucide-react";
import type { CourseChapter } from "@/app/ecole/data/mathematics-curriculum";

interface ChapterNavProps {
  chapters: CourseChapter[];
  activeChapterId: string;
  completedChapterIds: Set<string>;
  onSelect: (id: string) => void;
}

export default function ChapterNav({
  chapters,
  activeChapterId,
  completedChapterIds,
  onSelect,
}: ChapterNavProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden xl:block xl:sticky xl:top-24" aria-label="Navigation des chapitres">
        <div className="mist-panel rounded-[2rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--amber-light)]">
            Chapitres
          </p>
          <nav className="mt-5 space-y-3" aria-label="Liste des chapitres">
            {chapters.map((chapter, i) => {
              const isActive = chapter.id === activeChapterId;
              const isDone = completedChapterIds.has(chapter.id);

              return (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => onSelect(chapter.id)}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={`Chapitre ${i + 1}: ${chapter.title}${isDone ? " (complété)" : ""}`}
                  className="w-full rounded-[1.4rem] border px-4 py-4 text-left transition-all duration-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)] focus:ring-offset-2 focus:ring-offset-[var(--foret-nocturne)]"
                  style={{
                    borderColor: isActive
                      ? "rgba(196, 160, 53, 0.36)"
                      : "rgba(212, 221, 215, 0.08)",
                    background: isActive
                      ? "linear-gradient(180deg, rgba(196,160,53,0.14) 0%, rgba(4,17,13,0.6) 100%)"
                      : "rgba(4,17,13,0.45)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold"
                        style={{
                          background: isActive
                            ? "rgba(196,160,53,0.22)"
                            : "rgba(212,221,215,0.08)",
                          color: isActive
                            ? "var(--or-ancestral)"
                            : "rgba(212,221,215,0.5)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <p
                          className="text-sm font-semibold leading-snug"
                          style={{
                            color: isActive
                              ? "var(--ivoire-ancien)"
                              : "rgba(240,237,229,0.72)",
                          }}
                        >
                          {chapter.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-[rgba(212,221,215,0.5)]">
                          {chapter.subtitle}
                        </p>
                      </div>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--amber-light)] mt-0.5" />
                    ) : null}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile horizontal pills */}
      <nav className="xl:hidden overflow-x-auto pb-1 -mx-4 px-4" aria-label="Navigation des chapitres">
        <div className="flex gap-2 w-max">
          {chapters.map((chapter, i) => {
            const isActive = chapter.id === activeChapterId;
            const isDone = completedChapterIds.has(chapter.id);

            return (
              <button
                key={chapter.id}
                type="button"
                onClick={() => onSelect(chapter.id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`Chapitre ${i + 1}: ${chapter.title}${isDone ? " (complété)" : ""}`}
                className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[var(--or-ancestral)] focus:ring-offset-2 focus:ring-offset-[var(--foret-nocturne)]"
                style={{
                  borderColor: isActive
                    ? "rgba(196, 160, 53, 0.4)"
                    : "rgba(212, 221, 215, 0.1)",
                  background: isActive
                    ? "rgba(196,160,53,0.12)"
                    : "rgba(4,17,13,0.6)",
                  color: isActive ? "var(--or-ancestral)" : "rgba(212,221,215,0.65)",
                }}
              >
                <span className="font-semibold">{i + 1}.</span>
                <span>{chapter.title}</span>
                {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
