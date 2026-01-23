import { memo, useEffect, useRef } from "react";
import { Target, Flame, Trophy, Settings2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useDailyGoal } from "@/hooks/useDailyGoal";
import { useNotificationSound } from "@/hooks/useNotificationSound";

interface DailyGoalProps {
  todayTotalSeconds: number;
}

export const DailyGoal = memo(function DailyGoal({ todayTotalSeconds }: DailyGoalProps) {
  const {
    targetMinutes,
    streak,
    todayMinutes,
    progress,
    isGoalMet,
    setTargetMinutes,
    updateStreak,
  } = useDailyGoal(todayTotalSeconds);
  
  const { playSound } = useNotificationSound();
  const hasPlayedGoalSound = useRef(false);

  useEffect(() => {
    updateStreak();
    
    // Play sound when goal is first completed
    if (isGoalMet && !hasPlayedGoalSound.current) {
      playSound("goal-complete");
      hasPlayedGoalSound.current = true;
    }
  }, [isGoalMet, updateStreak, playSound]);

  // Reset the flag when progress goes back below goal (for next day)
  useEffect(() => {
    if (!isGoalMet) {
      hasPlayedGoalSound.current = false;
    }
  }, [isGoalMet]);

  return (
    <div className="border-2 border-foreground p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          <h3 className="font-bold uppercase tracking-wide text-sm">Daily Goal</h3>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="space-y-4">
              <h4 className="font-bold text-sm">Set Daily Goal</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target</span>
                  <span className="font-mono font-bold">{targetMinutes} min</span>
                </div>
                <Slider
                  value={[targetMinutes]}
                  onValueChange={([value]) => setTargetMinutes(value)}
                  min={15}
                  max={480}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15m</span>
                  <span>8h</span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-mono">
            {todayMinutes}/{targetMinutes} min
          </span>
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-3 border border-foreground" />
          {isGoalMet && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="w-3 h-3 text-primary-foreground animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {streak > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Flame className="w-4 h-4 text-destructive" />
          <span className="text-sm font-medium">
            {streak} day streak!
          </span>
        </div>
      )}

      {isGoalMet && (
        <div className="mt-3 pt-3 border-t border-border text-center">
          <p className="text-sm font-bold text-chart-2">🎉 Goal Complete!</p>
        </div>
      )}
    </div>
  );
});
