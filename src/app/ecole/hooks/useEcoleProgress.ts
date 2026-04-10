"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { MathematicsProgramYear } from "../data/mathematics-curriculum";
import { calculateCompletion } from "../lib/assessment";

const STORAGE_KEY = "ecole-brume-progress";
const useSessionStorage = true; // Use sessionStorage instead of localStorage for security

type ProgressMap = Record<string, string[]>;
type SyncStatus = "local" | "syncing" | "cloud";

function createEmptyState(programs: MathematicsProgramYear[]) {
  return Object.fromEntries(programs.map((program) => [program.slug, []])) as ProgressMap;
}

function getInitialProgress(programs: MathematicsProgramYear[]) {
  const initialState = createEmptyState(programs);

  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const rawValue = (useSessionStorage ? window.sessionStorage : window.localStorage).getItem(STORAGE_KEY);
    if (!rawValue) {
      return initialState;
    }

    return { ...initialState, ...(JSON.parse(rawValue) as ProgressMap) };
  } catch (error) {
    console.warn("[ecole] Impossible de lire la progression locale", error);
    return initialState;
  }
}

export function useEcoleProgress(programs: MathematicsProgramYear[]) {
  const { user } = useAuth();
  const [completedByYear, setCompletedByYear] = useState<ProgressMap>(() => getInitialProgress(programs));
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("local");

  useEffect(() => {
    try {
      (useSessionStorage ? window.sessionStorage : window.localStorage).setItem(STORAGE_KEY, JSON.stringify(completedByYear));
    } catch (error) {
      console.warn("[ecole] Impossible d'écrire la progression locale", error);
    }
  }, [completedByYear]);

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
        .from("ecole_progress")
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

      const remoteState = createEmptyState(programs);
      for (const row of data ?? []) {
        remoteState[row.year_slug] = row.completed_exercises ?? [];
      }

      setCompletedByYear((previous) => {
        const merged: ProgressMap = { ...previous };
        for (const program of programs) {
          const localExercises = previous[program.slug] ?? [];
          const remoteExercises = remoteState[program.slug] ?? [];
          merged[program.slug] = Array.from(new Set([...localExercises, ...remoteExercises]));
        }
        return merged;
      });
      setSyncStatus("cloud");
    };

    loadRemoteProgress().catch(() => setSyncStatus("local"));

    const channel = supabase
      .channel(`ecole-progress-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ecole_progress",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
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
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setSyncStatus("cloud");
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [programs, user]);

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

    const { error } = await supabase.from("ecole_progress").upsert(
      {
        user_id: user.id,
        year_slug: yearSlug,
        completed_exercises: nextCompletedExercises,
        mastery_score: masteryScore,
        last_activity_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,year_slug",
      }
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

    const { error } = await supabase.from("ecole_attempts").insert({
      user_id: user.id,
      year_slug: yearSlug,
      exercise_id: exerciseId,
      submitted_answer: submittedAnswer,
      is_correct: isCorrect,
    });

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
    const totalExercises = programs.reduce((accumulator, program) => accumulator + program.exercises.length, 0);
    const completedExercises = Object.values(completedByYear).reduce(
      (accumulator, current) => accumulator + current.length,
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
