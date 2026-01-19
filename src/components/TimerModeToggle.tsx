import { Button } from "@/components/ui/button";
import { Clock, Timer } from "lucide-react";

export type TimerMode = "stopwatch" | "pomodoro";

interface TimerModeToggleProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
  disabled?: boolean;
}

export function TimerModeToggle({ mode, onModeChange, disabled }: TimerModeToggleProps) {
  return (
    <div className="flex gap-2 p-1 border-2 border-foreground bg-background">
      <Button
        variant={mode === "stopwatch" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("stopwatch")}
        disabled={disabled}
        className="gap-2 px-4"
      >
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Stopwatch</span>
      </Button>
      <Button
        variant={mode === "pomodoro" ? "default" : "ghost"}
        size="sm"
        onClick={() => onModeChange("pomodoro")}
        disabled={disabled}
        className="gap-2 px-4"
      >
        <Timer className="w-4 h-4" />
        <span className="hidden sm:inline">Pomodoro</span>
      </Button>
    </div>
  );
}
