"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Award, BookOpen, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ScoreSummary {
  total_points: number;
  exercises_completed: number;
  average_score: number;
}

export default function StudentSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ScoreSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchProgress() {
      try {
        const { data, error } = await supabase
          .from("ecole_scores")
          .select("score, max_score")
          .eq("user_id", user!.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const totalPoints = data.reduce((acc: number, curr: any) => acc + curr.score, 0);
          const exercisesCompleted = data.length;
          const avg = (totalPoints / data.reduce((acc: number, curr: any) => acc + curr.max_score, 0)) * 100;
          
          setSummary({
            total_points: totalPoints,
            exercises_completed: exercisesCompleted,
            average_score: Math.round(avg)
          });
        }
      } catch (err) {
        console.error("Error fetching student progress:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [user]);

  if (!user || loading) return null;
  if (!summary) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-4 grid-cols-2 md:grid-cols-4 mt-8"
    >
      <div className="mist-panel p-4 rounded-2xl flex flex-col items-center text-center">
        <Star className="text-amber-500 mb-2" size={20} />
        <span className="text-2xl font-bold text-white">{summary.total_points}</span>
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Points Totaux</span>
      </div>
      
      <div className="mist-panel p-4 rounded-2xl flex flex-col items-center text-center">
        <BookOpen className="text-emerald-500 mb-2" size={20} />
        <span className="text-2xl font-bold text-white">{summary.exercises_completed}</span>
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Exercices</span>
      </div>

      <div className="mist-panel p-4 rounded-2xl flex flex-col items-center text-center">
        <TrendingUp className="text-blue-500 mb-2" size={20} />
        <span className="text-2xl font-bold text-white">{summary.average_score}%</span>
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Moyenne</span>
      </div>

      <div className="mist-panel p-4 rounded-2xl flex flex-col items-center text-center">
        <Award className="text-or-ancestral mb-2" size={20} />
        <span className="text-2xl font-bold text-white">Niveau 1</span>
        <span className="text-[10px] uppercase tracking-wider text-stone-500">Apprenti</span>
      </div>
    </motion.div>
  );
}
