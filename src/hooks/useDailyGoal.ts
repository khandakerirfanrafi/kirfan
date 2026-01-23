import { useState, useCallback, useMemo } from "react";

interface DailyGoal {
  targetMinutes: number;
  streak: number;
  lastCompletedDate: string | null;
}

const DEFAULT_GOAL: DailyGoal = {
  targetMinutes: 60, // 1 hour default
  streak: 0,
  lastCompletedDate: null,
};

export function useDailyGoal(todayTotalSeconds: number) {
  const [goal, setGoal] = useState<DailyGoal>(() => {
    const saved = localStorage.getItem("akta-daily-goal");
    return saved ? JSON.parse(saved) : DEFAULT_GOAL;
  });

  const saveGoal = useCallback((newGoal: DailyGoal) => {
    setGoal(newGoal);
    localStorage.setItem("akta-daily-goal", JSON.stringify(newGoal));
  }, []);

  const setTargetMinutes = useCallback((minutes: number) => {
    saveGoal({ ...goal, targetMinutes: minutes });
  }, [goal, saveGoal]);

  const todayMinutes = useMemo(() => Math.floor(todayTotalSeconds / 60), [todayTotalSeconds]);
  
  const progress = useMemo(() => {
    return Math.min((todayMinutes / goal.targetMinutes) * 100, 100);
  }, [todayMinutes, goal.targetMinutes]);

  const isGoalMet = useMemo(() => todayMinutes >= goal.targetMinutes, [todayMinutes, goal.targetMinutes]);

  // Update streak when goal is met
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (isGoalMet && goal.lastCompletedDate !== today) {
      let newStreak = goal.streak;
      
      if (goal.lastCompletedDate === yesterday) {
        newStreak = goal.streak + 1;
      } else if (goal.lastCompletedDate !== today) {
        newStreak = 1;
      }

      saveGoal({
        ...goal,
        streak: newStreak,
        lastCompletedDate: today,
      });
    }
  }, [isGoalMet, goal, saveGoal]);

  return {
    targetMinutes: goal.targetMinutes,
    streak: goal.streak,
    todayMinutes,
    progress,
    isGoalMet,
    setTargetMinutes,
    updateStreak,
  };
}
