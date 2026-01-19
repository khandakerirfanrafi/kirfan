import { usePomodoroTimer, PomodoroPhase } from "@/hooks/usePomodoroTimer";
import { usePomodoroSettings } from "@/hooks/usePomodoroSettings";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, RotateCcw, Settings, Coffee, Brain } from "lucide-react";
import { useEffect, useCallback, useState } from "react";
import { PomodoroSettings } from "./PomodoroSettings";
import { toast } from "sonner";

interface PomodoroTimerProps {
  onSessionEnd: (duration: number) => void;
  disabled: boolean;
}

export function PomodoroTimer({ onSessionEnd, disabled }: PomodoroTimerProps) {
  const { settings, updateSettings, resetSettings } = usePomodoroSettings();
  const [showSettings, setShowSettings] = useState(false);

  const handleWorkComplete = useCallback(
    (duration: number) => {
      if (duration >= 60) {
        onSessionEnd(duration);
      }
    },
    [onSessionEnd]
  );

  const handleBreakComplete = useCallback(() => {
    toast.success("Break complete! Time to focus.", {
      duration: 4000,
    });
  }, []);

  const handlePhaseChange = useCallback((phase: PomodoroPhase) => {
    if (phase === "work") {
      toast("🎯 Focus time!", { duration: 3000 });
    } else if (phase === "shortBreak") {
      toast("☕ Short break - stretch and relax!", { duration: 3000 });
    } else {
      toast("🌴 Long break - you've earned it!", { duration: 3000 });
    }
  }, []);

  const {
    phase,
    secondsRemaining,
    isRunning,
    isPaused,
    completedSessions,
    start,
    pause,
    resume,
    skip,
    reset,
    resetAll,
    formatTime,
    setPhase,
  } = usePomodoroTimer({
    settings,
    onWorkComplete: handleWorkComplete,
    onBreakComplete: handleBreakComplete,
    onPhaseChange: handlePhaseChange,
  });

  const time = formatTime(secondsRemaining);
  const progress = 1 - secondsRemaining / (phase === "work" 
    ? settings.workDuration * 60 
    : phase === "shortBreak" 
    ? settings.shortBreakDuration * 60 
    : settings.longBreakDuration * 60);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (disabled && phase === "work") return;

        if (!isRunning && !isPaused) {
          start();
        } else if (isRunning && !isPaused) {
          pause();
        } else if (isPaused) {
          resume();
        }
      }

      if (e.code === "KeyS" && (isRunning || isPaused)) {
        skip();
      }

      if (e.code === "KeyR" && (isRunning || isPaused)) {
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, phase, isRunning, isPaused, start, pause, resume, skip, reset]);

  // Update document title
  useEffect(() => {
    const phaseLabel = phase === "work" ? "Focus" : phase === "shortBreak" ? "Break" : "Long Break";
    if (isRunning) {
      document.title = `${time.minutes}:${time.seconds} ${phaseLabel} — akta`;
    } else {
      document.title = "akta — Study Time Tracker";
    }
  }, [isRunning, time, phase]);

  const getPhaseColor = () => {
    switch (phase) {
      case "work":
        return "bg-primary text-primary-foreground";
      case "shortBreak":
        return "bg-chart-2 text-primary-foreground";
      case "longBreak":
        return "bg-chart-4 text-primary-foreground";
    }
  };

  const getPhaseIcon = () => {
    switch (phase) {
      case "work":
        return <Brain className="w-5 h-5" />;
      case "shortBreak":
      case "longBreak":
        return <Coffee className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Phase Selector */}
      <div className="flex gap-2">
        <Button
          variant={phase === "work" ? "default" : "outline"}
          size="sm"
          onClick={() => !isRunning && setPhase("work")}
          disabled={isRunning || isPaused}
          className="gap-1 border-2"
        >
          <Brain className="w-4 h-4" />
          Focus
        </Button>
        <Button
          variant={phase === "shortBreak" ? "default" : "outline"}
          size="sm"
          onClick={() => !isRunning && setPhase("shortBreak")}
          disabled={isRunning || isPaused}
          className="gap-1 border-2"
        >
          <Coffee className="w-4 h-4" />
          Short Break
        </Button>
        <Button
          variant={phase === "longBreak" ? "default" : "outline"}
          size="sm"
          onClick={() => !isRunning && setPhase("longBreak")}
          disabled={isRunning || isPaused}
          className="gap-1 border-2"
        >
          <Coffee className="w-4 h-4" />
          Long Break
        </Button>
      </div>

      {/* Progress Ring */}
      <div className="relative">
        <svg className="w-48 h-48 sm:w-64 sm:h-64 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${progress * 283} 283`}
            strokeLinecap="square"
            className={phase === "work" ? "text-primary" : phase === "shortBreak" ? "text-chart-2" : "text-chart-4"}
          />
        </svg>
        
        {/* Timer Display */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center`}
        >
          <div 
            className={`font-mono text-4xl sm:text-5xl font-bold tracking-tight select-none transition-all ${
              isPaused ? "opacity-60" : ""
            }`}
          >
            <span>{time.minutes}</span>
            <span className={isRunning && !isPaused ? "animate-pulse" : ""}>:</span>
            <span>{time.seconds}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            {getPhaseIcon()}
            <span className="uppercase tracking-wide font-medium">
              {phase === "work" ? "Focus" : phase === "shortBreak" ? "Short Break" : "Long Break"}
            </span>
          </div>
        </div>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">Sessions: </span>
        <div className="flex gap-1">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 border-2 border-foreground transition-colors ${
                i < completedSessions % settings.sessionsBeforeLongBreak || 
                (completedSessions > 0 && completedSessions % settings.sessionsBeforeLongBreak === 0 && i === settings.sessionsBeforeLongBreak - 1)
                  ? "bg-primary"
                  : ""
              }`}
            />
          ))}
        </div>
        <span className="font-bold">{completedSessions}</span>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3 flex-wrap justify-center">
        {!isRunning && !isPaused && (
          <Button
            size="lg"
            onClick={start}
            disabled={disabled && phase === "work"}
            className="gap-2 px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Play className="w-5 h-5" />
            Start
          </Button>
        )}

        {isRunning && !isPaused && (
          <Button
            size="lg"
            variant="secondary"
            onClick={pause}
            className="gap-2 px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            size="lg"
            onClick={resume}
            className="gap-2 px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Play className="w-5 h-5" />
            Resume
          </Button>
        )}

        {(isRunning || isPaused) && (
          <>
            <Button
              size="lg"
              variant="outline"
              onClick={skip}
              className="gap-2 px-6 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <SkipForward className="w-5 h-5" />
              Skip
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              className="gap-2 px-6 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </>
        )}

        <Button
          size="lg"
          variant="ghost"
          onClick={() => setShowSettings(true)}
          className="gap-2 px-4 py-6 text-lg border-2 border-transparent hover:border-foreground transition-all"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Helper text */}
      {disabled && phase === "work" && !isRunning && (
        <p className="text-muted-foreground text-center animate-pulse">
          ↓ Select a subject below to start tracking ↓
        </p>
      )}

      {/* Settings Dialog */}
      <PomodoroSettings
        open={showSettings}
        onOpenChange={setShowSettings}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />
    </div>
  );
}
