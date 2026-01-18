import { useTimer } from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { useEffect } from "react";

interface TimerProps {
  onSessionEnd: (duration: number) => void;
  disabled: boolean;
}

export function Timer({ onSessionEnd, disabled }: TimerProps) {
  const { seconds, isRunning, isPaused, start, pause, resume, stop, reset, formatTime } = useTimer();
  const time = formatTime(seconds);

  const handleStop = () => {
    if (seconds >= 60) {
      onSessionEnd(seconds);
    }
    reset();
  };

  useEffect(() => {
    if (isRunning) {
      document.title = `${time.hours}:${time.minutes}:${time.seconds} — akta`;
    } else {
      document.title = "akta — Study Tracker";
    }
  }, [isRunning, time]);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="font-mono text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight border-4 border-foreground px-6 py-8 sm:px-10 sm:py-12 shadow-lg select-none">
        <span>{time.hours}</span>
        <span className="animate-pulse">:</span>
        <span>{time.minutes}</span>
        <span className="animate-pulse">:</span>
        <span>{time.seconds}</span>
      </div>

      <div className="flex gap-3 sm:gap-4 flex-wrap justify-center">
        {!isRunning && !isPaused && (
          <Button
            size="lg"
            onClick={start}
            disabled={disabled}
            className="gap-2 px-6 sm:px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
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
            className="gap-2 px-6 sm:px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Pause className="w-5 h-5" />
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            size="lg"
            onClick={resume}
            className="gap-2 px-6 sm:px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
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
              className="gap-2 px-6 sm:px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Square className="w-5 h-5" />
              Stop
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={reset}
              className="gap-2 px-6 sm:px-8 py-6 text-lg border-2 shadow-sm hover:shadow-md hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </>
        )}
      </div>

      {disabled && !isRunning && (
        <p className="text-muted-foreground text-center">
          Select a subject to start tracking
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
