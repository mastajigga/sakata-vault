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
  const { user, isLoading: authLoading } = useAuth();
  // Les données sans propriétaire ne sont importées qu'après accord explicite.
  const storageKey = `${ecoleProgressKey(namespace)}:${user ? `user:${user.id}` : "anonymous"}`;
  const pendingCompletions = useRef<Array<{ key: string; yearSlug: string; exerciseId: string; totalExercises: number }>>([]);
  const offeredImports = useRef(new Set<string>());
  const lastReadyKey = useRef<string | null>(null);
  if (!authLoading) lastReadyKey.current = storageKey;
  const programsRef = useRef(programs);
  programsRef.current = programs;
  const scope = useMemo(() => ({
    key: storageKey,
    progress: authLoading ? createEmptyState(programsRef.current) : getInitialProgress(programsRef.current, storageKey),
  }), [storageKey, authLoading]);
  const [state, setState] = useState(() => ({ scope, progress: scope.progress, status: "local" as SyncStatus }));
  // Réinitialisation avant affichage : aucune frame ne révèle le compte précédent.
  if (state.scope !== scope) {
    setState({ scope, progress: scope.progress, status: "local" });
  }
  const completedByYear = state.scope === scope ? state.progress : scope.progress;
  const syncStatus = state.scope === scope ? state.status : "local";
  const setSyncStatus = (status: SyncStatus) => {
    setState((previous) => previous.scope === scope ? { ...previous, status } : previous);
  };
  const setCompletedByYear = (update: (previous: ProgressMap) => ProgressMap) => {
    scope.progress = update(scope.progress);
    const progress = scope.progress;
    setState((previous) => previous.scope === scope ? { ...previous, progress } : previous);
  };

  useEffect(() => {
    if (authLoading) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(completedByYear));
    } catch (error) {
      console.warn("[ecole] Impossible d'écrire la progression locale", error);
    }
  }, [authLoading, completedByYear, storageKey]);

  useEffect(() => {
    if (!user || authLoading) return;
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
        console.error("[ecole] Impossible de charger la progression", error);
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

    loadRemoteProgress().catch((error) => {
      console.error("[ecole] Impossible de charger la progression", error);
      if (isMounted) setSyncStatus("local");
    });

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
          if (!isMounted || !nextRow?.year_slug) {
            return;
          }

          setCompletedByYear((previous) => ({
            ...previous,
            [nextRow.year_slug!]: nextRow.completed_exercises ?? [],
          }));
        }
      )
      .subscribe((status: any, err: any) => {
        if (!isMounted) return;
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
  }, [namespace, user?.id, scope, authLoading]);

  const completeExercise = async (yearSlug: string, exerciseId: string, totalExercises: number) => {
    if (authLoading) {
      // Pendant un refresh, conserver le propriétaire connu, jamais le compte suivant.
      const key = lastReadyKey.current ?? storageKey;
      const progress = getInitialProgress(programsRef.current, key);
      progress[yearSlug] = Array.from(new Set([...(progress[yearSlug] ?? []), exerciseId]));
      try {
        window.localStorage.setItem(key, JSON.stringify(progress));
      } catch (error) {
        console.error("[ecole] Validation locale impossible", error);
        window.alert("Votre réponse est correcte, mais sa sauvegarde locale a échoué. Gardez cette page ouverte pour réessayer après la connexion.");
      }
      pendingCompletions.current.push({ key, yearSlug, exerciseId, totalExercises });
      return;
    }
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

    // Sauvegarder avant tout await, y compris si l'élève quitte immédiatement la page.
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(scope.progress));
    } catch (error) {
      console.error("[ecole] Validation locale impossible", error);
      window.alert("La progression n'a pas pu être conservée sur cet appareil.");
    }
    if (!user) return;

    setSyncStatus("syncing");

    const masteryScore = calculateCompletion(totalExercises, nextCompletedExercises.length);

    // P1-D fix: retry sur l'upsert — la progression ne doit jamais être silencieusement perdue
    try {
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

      if (error) throw error;
      setSyncStatus("cloud");
    } catch (error) {
      console.error("[ecole] Impossible de sauvegarder la progression", error);
      setSyncStatus("local");
    }
  };

  useEffect(() => {
    if (authLoading) return;
    const pending = pendingCompletions.current.splice(0);
    void (async () => {
      for (const completion of pending) {
        if (completion.key === storageKey) {
          await completeExercise(completion.yearSlug, completion.exerciseId, completion.totalExercises);
        } else {
          window.alert("Une validation effectuée pendant la connexion a été conservée sur cet appareil pour le profil précédent. Elle n'a pas été transférée au compte actuel.");
        }
      }
    })();
    // Rejouer uniquement lorsque l'identité devient prête, jamais à chaque progression.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, storageKey]);

  useEffect(() => {
    if (authLoading) return;
    const baseKey = ecoleProgressKey(namespace);
    const candidates = [baseKey, ...(user ? [`${baseKey}:anonymous`] : [])];
    const importedYears = new Set<string>();
    for (const sourceKey of candidates) {
      const offerKey = `${storageKey}/${sourceKey}`;
      if (offeredImports.current.has(offerKey)) continue;
      const imported = getInitialProgress(programsRef.current, sourceKey);
      const valid = createEmptyState(programsRef.current);
      for (const program of programsRef.current) {
        const ids = new Set(program.exercises.map(exercise => exercise.id));
        const values = imported[program.slug];
        valid[program.slug] = Array.isArray(values) ? Array.from(new Set(values.filter(id => ids.has(id)))) : [];
      }
      const count = Object.values(valid).reduce((sum, ids) => sum + ids.length, 0);
      if (!count) continue;
      offeredImports.current.add(offerKey);
      const origin = sourceKey === baseKey ? "ancienne progression sans propriétaire identifié" : "progression anonyme";
      const destination = user ? `le compte ${user.email || user.id}` : "le profil anonyme de cet appareil";
      if (!window.confirm(`Une ${origin} contient ${count} exercice(s) validé(s) sur cet appareil. Vous appartient-elle ? Importer ces validations dans ${destination} ? Elles seront ajoutées à ce profil et la copie d'origine sera retirée. Annuler conserve les données sans les transférer.`)) continue;
      const merged = { ...scope.progress };
      for (const [year, ids] of Object.entries(valid)) {
        merged[year] = Array.from(new Set([...(merged[year] ?? []), ...ids]));
      }
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(merged));
        setCompletedByYear(() => merged);
        window.localStorage.removeItem(sourceKey);
      } catch (error) {
        console.error("[ecole] Import local impossible", error);
        window.alert("L'import n'a pas pu être terminé. La progression d'origine est conservée.");
        continue;
      }
      for (const program of programsRef.current) {
        const ids = valid[program.slug];
        if (ids.length) importedYears.add(program.slug);
      }
    }
    for (const program of programsRef.current) {
      if (importedYears.has(program.slug)) {
        void completeExercise(program.slug, scope.progress[program.slug][0], program.exercises.length);
      }
    }
    // Une proposition par source et destination pour cette visite, après résolution de l'identité.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, storageKey, namespace]);

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
