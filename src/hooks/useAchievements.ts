import { useState, useCallback, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  requirementType: string;
  requirementValue: number;
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  earnedAt: Date;
}

export function useAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all achievements
  const fetchAchievements = useCallback(async () => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .order("requirement_value", { ascending: true });

    if (error) {
      console.error("Error fetching achievements:", error);
      return;
    }

    setAchievements(
      data.map((a) => ({
        id: a.id,
        key: a.key,
        name: a.name,
        description: a.description,
        icon: a.icon,
        requirementType: a.requirement_type,
        requirementValue: a.requirement_value,
      }))
    );
  }, []);

  // Fetch user's earned achievements
  const fetchUserAchievements = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_achievements")
      .select("*")
      .order("earned_at", { ascending: false });

    if (error) {
      console.error("Error fetching user achievements:", error);
      return;
    }

    setUserAchievements(
      data.map((ua) => ({
        id: ua.id,
        achievementId: ua.achievement_id,
        earnedAt: new Date(ua.earned_at),
      }))
    );
  }, [user]);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAchievements(), fetchUserAchievements()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchAchievements, fetchUserAchievements]);

  // Check and award achievements based on current stats
  const checkAchievements = useCallback(
    async (stats: {
      totalHours: number;
      currentStreak: number;
      sessionsCount: number;
    }) => {
      if (!user || achievements.length === 0) return;

      const earnedIds = userAchievements.map((ua) => ua.achievementId);
      const newAchievements: Achievement[] = [];

      for (const achievement of achievements) {
        if (earnedIds.includes(achievement.id)) continue;

        let earned = false;
        switch (achievement.requirementType) {
          case "total_hours":
            earned = stats.totalHours >= achievement.requirementValue;
            break;
          case "streak_days":
            earned = stats.currentStreak >= achievement.requirementValue;
            break;
          case "sessions_count":
            earned = stats.sessionsCount >= achievement.requirementValue;
            break;
        }

        if (earned) {
          const { error } = await supabase.from("user_achievements").insert({
            user_id: user.id,
            achievement_id: achievement.id,
          });

          if (!error) {
            newAchievements.push(achievement);
          }
        }
      }

      if (newAchievements.length > 0) {
        await fetchUserAchievements();
        newAchievements.forEach((a) => {
          toast.success(`🏆 নতুন অ্যাচিভমেন্ট: ${a.name}!`, {
            description: a.description,
            duration: 5000,
          });
        });
      }
    },
    [user, achievements, userAchievements, fetchUserAchievements]
  );

  // Get achievement with earned status
  const achievementsWithStatus = useMemo(() => {
    return achievements.map((a) => ({
      ...a,
      earned: userAchievements.some((ua) => ua.achievementId === a.id),
      earnedAt: userAchievements.find((ua) => ua.achievementId === a.id)?.earnedAt,
    }));
  }, [achievements, userAchievements]);

  const earnedCount = useMemo(
    () => userAchievements.length,
    [userAchievements]
  );

  return {
    achievements: achievementsWithStatus,
    earnedCount,
    totalCount: achievements.length,
    loading,
    checkAchievements,
    refetch: () => Promise.all([fetchAchievements(), fetchUserAchievements()]),
  };
}
