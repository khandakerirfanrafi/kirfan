import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

export function useCloudStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
  });
  const [loading, setLoading] = useState(true);

  const fetchStreak = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_streaks")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching streak:", error);
      return;
    }

    if (data) {
      setStreak({
        currentStreak: data.current_streak,
        longestStreak: data.longest_streak,
        lastActiveDate: data.last_active_date,
      });
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchStreak();
      setLoading(false);
    };

    if (user) {
      load();
    }
  }, [user, fetchStreak]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    if (streak.lastActiveDate === today) {
      return; // Already updated today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    let newStreak = 1;
    if (streak.lastActiveDate === yesterdayStr) {
      newStreak = streak.currentStreak + 1;
    }

    const newLongest = Math.max(newStreak, streak.longestStreak);

    const { error } = await supabase
      .from("user_streaks")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active_date: today,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating streak:", error);
      return;
    }

    setStreak({
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: today,
    });
  }, [user, streak]);

  return {
    streak,
    updateStreak,
    loading,
  };
}
