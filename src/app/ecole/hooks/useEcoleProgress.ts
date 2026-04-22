"use client";

import { DB_TABLES } from "@/lib/constants/db";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/supabase-retry";
import { ecoleProgressKey } from "@/lib/constants/storage";
import type { MathematicsProgramYear } from "../data/mathematics-curriculum";
import { calculateCompletion } from "../lib/assessment";

// P2-C fix: clé préfixée "sakata-" pour être couverte par le version-bump d'AuthProvider
// La fonction ecoleProgressKey() est définie dans src/lib/constants/storage.ts

type ProgressMap = Record<string, string[]>;
type SyncStatus = "local" | "syncing" | "cloud";

function createEmptyState(programs: MathematicsProgramYear[]) {
  return Object.fromEntries(programs.map((program) => [program.slug, []])) as ProgressMap;
}

function getInitialProgress(programs: MathematicsProgramYear[], storageKey: string) {
  const initialState = createEmptyState(programs);

  if (typeof window === "undefined") {
    return initialState;
  }

  // P2-C fix: localStorage (non sessionStorage) → survit à la fermeture d'onglet
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) {
      return initialState;
    }

    return { ...initialState, ...(JSON.parse(rawValue) as ProgressMap) };
  } catch (error) {
    console.warn("[ecole] Impossible de lire la progression locale", error);
    return initialState;
  }
}

export function useEcoleProgress(programs: MathematicsProgramYear[], namespace = "primaire") {
  const { user } = useAuth();
  const storageKey = ecoleProgressKey(namespace); // "sakata-ecole-progress-{namespace}"
  const [completedByYear, setCompletedByYear] = useState<ProgressMap>(() => getInitialProgress(programs, storageKey));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");

  // Stable ref to programs — kept up-to-date but not added to the subscription effect's dep array
  const programsRef = useRef(programs);
  useEffect(() => { programsRef.current = programs; }, [programs]);

  useEffect(() => {
    // P2-C fix: localStorage → progression sauvegardée même si l'onglet est fermé
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completedByYear));
    } catch (error) {
      console.warn("[ecole] Impossible d'écrire la progression locale", error);
    }
  }, [completedByYear, storageKey]);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isMounted = true;

    const loadRemoteProgress = async () => {
      if (isMounted) {
        setSyncStatus("syncing");
      }

      const { data, error } = await supabase
        .from(DB_TABLES.ECOLE_PROGRESS)
        .select("year_slug, completed_exercises")
        .eq("user_id", user.id);

      if (error) {
        if (isMounted) {
          setSyncStatus("local");
        }
        return;
      }

      if (!isMounted) {
        return;
      }

      const remoteState = createEmptyState(programsRef.current);
      for (const row of data ?? []) {
        remoteState[row.year_slug] = row.completed_exercises ?? [];
      }

      setCompletedByYear((previous) => {
        const merged: ProgressMap = { ...previous };
        for (const prog of programsRef.current) {
          const localExercises = previous[prog.slug] ?? [];
          const remoteExercises = remoteState[prog.slug] ?? [];
          merged[prog.slug] = Array.from(new Set([...localExercises, ...remoteExercises]));
        }
        return merged;
      });
      setSyncStatus("cloud");
    };

    loadRemoteProgress().catch(() => setSyncStatus("local"));

    const channel = supabase
      .channel(`ecole-progress-${namespace}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ecole_progress",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          const nextRow = payload.new as { year_slug?: string; completed_exercises?: string[] };
          if (!nextRow?.year_slug) {
            return;
          }

          setCompletedByYear((previous) => ({
            ...previous,
            [nextRow.year_slug!]: nextRow.completed_exercises ?? [],
          }));
        }
      )
      .subscribe((status: any, err: any) => {
        if (status === "SUBSCRIBED") {
          setSyncStatus("cloud");
        } else if (status === "CHANNEL_ERROR" || err) {
          console.error("[ecole] WebSocket error:", err || status);
          setSyncStatus("local");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [namespace, user]);

  const completeExercise = async (yearSlug: string, exerciseId: string, totalExercises: number) => {
    let nextCompletedExercises: string[] = [];

    setCompletedByYear((previous) => {
      const current = previous[yearSlug] ?? [];
      if (current.includes(exerciseId)) {
        nextCompletedExercises = current;
        return previous;
      }

      nextCompletedExercises = [...current, exerciseId];
      return {
        ...previous,
        [yearSlug]: nextCompletedExercises,
      };
    });

    if (!user) {
      return;
    }

    setSyncStatus("syncing");

    const masteryScore = calculateCompletion(totalExercises, nextCompletedExercises.length);

    // P1-D fix: retry sur l'upsert — la progression ne doit jamais être silencieusement perdue
    const { error } = await withRetry(async () =>
      supabase.from(DB_TABLES.ECOLE_PROGRESS).upsert(
        {
          user_id: user.id,
          year_slug: yearSlug,
          completed_exercises: nextCompletedExercises,
          mastery_score: masteryScore,
          last_activity_at: new Date().toISOString(),
        },
        { onConflict: "user_id,year_slug" }
      )
    );

    setSyncStatus(error ? "local" : "cloud");
  };

  const recordAttempt = async (
    yearSlug: string,
    exerciseId: string,
    submittedAnswer: string,
    isCorrect: boolean
  ) => {
    if (!user) {
      return;
    }

    const { error } = await withRetry(async () =>
      supabase.from("ecole_attempts").insert({
        user_id: user.id,
        year_slug: yearSlug,
        exercise_id: exerciseId,
        submitted_answer: submittedAnswer,
        is_correct: isCorrect,
      })
    );

    if (error) {
      console.warn("[ecole] Impossible d'enregistrer la tentative", error);
    }
  };

  const getCompletedExercises = (yearSlug: string) => completedByYear[yearSlug] ?? [];

  const getYearProgress = (program: MathematicsProgramYear) => {
    const completedExercises = getCompletedExercises(program.slug).length;
    return calculateCompletion(program.exercises.length, completedExercises);
  };

  const overallProgress = useMemo(() => {
    const totalExercises = programs.reduce((accumulator: number, program) => accumulator + program.exercises.length, 0);
    const completedExercises = Object.values(completedByYear).reduce(
      (accumulator: number, current) => accumulator + current.length,
      0
    );

    return calculateCompletion(totalExercises, completedExercises);
  }, [completedByYear, programs]);

  return {
    completedByYear,
    syncStatus: user ? syncStatus : "local",
    overallProgress,
    completeExercise,
    recordAttempt,
    getCompletedExercises,
    getYearProgress,
  };
}
