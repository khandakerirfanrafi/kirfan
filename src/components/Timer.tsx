import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { useEffect, useCallback } from "react";

interface TimerProps {
  onSessionEnd: (duration: number) => void;
  disabled: boolean;
}

export function Timer({ onSessionEnd, disabled }: TimerProps) {
  const { seconds, isRunning, isPaused, start, pause, resume, stop, reset, formatTime } = useTimer();
  const time = formatTime(seconds);

  const handleStop = useCallback(() => {
    if (seconds >= 60) {
      onSessionEnd(seconds);
    }
    reset();
  }, [seconds, onSessionEnd, reset]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (disabled) return;
        
        if (!isRunning && !isPaused) {
          start();
        } else if (isRunning && !isPaused) {
          pause();
        } else if (isPaused) {
          resume();
        }
      }

      if (e.code === "Escape" && (isRunning || isPaused)) {
        handleStop();
      }

      if (e.code === "KeyR" && (isRunning || isPaused)) {
        reset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, isRunning, isPaused, start, pause, resume, handleStop, reset]);

  useEffect(() => {
    if (isRunning) {
      document.title = `${time.hours}:${time.minutes}:${time.seconds} — akta`;
    } else {
      document.title = "akta — Study Time Tracker";
    }
  }, [isRunning, time]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Timer Display */}
      <div 
        className={`font-mono text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight border-4 border-foreground px-4 py-6 sm:px-8 sm:py-10 shadow-md select-none transition-all ${
          isRunning && !isPaused ? "bg-primary text-primary-foreground" : ""
        } ${isPaused ? "opacity-60" : ""}`}
      >
        <span>{time.hours}</span>
        <span className={isRunning && !isPaused ? "animate-pulse" : ""}>:</span>
        <span>{time.minutes}</span>
        <span className={isRunning && !isPaused ? "animate-pulse" : ""}>:</span>
        <span>{time.seconds}</span>
      </div>

      {/* Progress indicator */}
      {isRunning && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-chart-2 animate-pulse" />
          <span className="text-sm uppercase tracking-wide font-medium">
            {isPaused ? "Paused" : "Recording"}
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
        {!isRunning && !isPaused && (
          <Button
            size="lg"
            onClick={start}
            disabled={disabled}
            className="gap-2 px-8 sm:px-10 py-6 sm:py-7 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
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
            className="gap-2 px-8 sm:px-10 py-6 sm:py-7 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            size="lg"
            onClick={resume}
            className="gap-2 px-8 sm:px-10 py-6 sm:py-7 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Play className="w-5 h-5" />
            Resume
          </Button>
        )}

        {(isRunning || isPaused) && (
          <>
            <Button
              size="lg"
              variant="destructive"
              onClick={handleStop}
              className="gap-2 px-6 sm:px-8 py-6 sm:py-7 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Square className="w-5 h-5" />
              Stop & Save
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              className="gap-2 px-6 sm:px-8 py-6 sm:py-7 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Helper text */}
      {disabled && !isRunning && (
        <p className="text-muted-foreground text-center animate-pulse">
          ↓ Select a subject below to start tracking ↓
        </p>
      )}

      {seconds > 0 && seconds < 60 && (
        <p className="text-muted-foreground text-sm text-center">
          Sessions under 1 minute won't be saved
        </p>
      )}
    </div>
  );
}
