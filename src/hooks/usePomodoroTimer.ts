import { useState, useRef, useCallback, useEffect } from "react";
import { PomodoroSettings } from "./usePomodoroSettings";

export type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export interface PomodoroState {
  phase: PomodoroPhase;
  secondsRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  completedSessions: number;
  totalWorkSeconds: number;
}

interface UsePomodoroTimerProps {
  settings: PomodoroSettings;
  onWorkComplete: (duration: number) => void;
  onBreakComplete: () => void;
  onPhaseChange: (phase: PomodoroPhase) => void;
}

export function usePomodoroTimer({
  settings,
  onWorkComplete,
  onBreakComplete,
  onPhaseChange,
}: UsePomodoroTimerProps) {
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [secondsRemaining, setSecondsRemaining] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [totalWorkSeconds, setTotalWorkSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const workStartSecondsRef = useRef<number>(0);

  // Play notification sound
  const playSound = useCallback(() => {
    if (!settings.soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  }, [settings.soundEnabled]);

  // Get duration for current phase
  const getPhaseDuration = useCallback(
    (p: PomodoroPhase) => {
      switch (p) {
        case "work":
          return settings.workDuration * 60;
        case "shortBreak":
          return settings.shortBreakDuration * 60;
        case "longBreak":
          return settings.longBreakDuration * 60;
      }
    },
    [settings]
  );

  // Reset timer to phase duration
  const resetToPhase = useCallback(
    (newPhase: PomodoroPhase) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setPhase(newPhase);
      setSecondsRemaining(getPhaseDuration(newPhase));
      setIsRunning(false);
      setIsPaused(false);
      onPhaseChange(newPhase);
    },
    [getPhaseDuration, onPhaseChange]
  );

  // Handle phase completion
  const handlePhaseComplete = useCallback(() => {
    playSound();
    
    if (phase === "work") {
      const workDuration = workStartSecondsRef.current - secondsRemaining + (settings.workDuration * 60 - workStartSecondsRef.current);
      const actualWorkTime = settings.workDuration * 60;
      setTotalWorkSeconds((prev) => prev + actualWorkTime);
      onWorkComplete(actualWorkTime);
      
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      // Determine next break type
      const isLongBreak = newCompletedSessions % settings.sessionsBeforeLongBreak === 0;
      const nextPhase = isLongBreak ? "longBreak" : "shortBreak";
      
      resetToPhase(nextPhase);
      
      if (settings.autoStartBreak) {
        setTimeout(() => start(), 100);
      }
    } else {
      onBreakComplete();
      resetToPhase("work");
      
      if (settings.autoStartWork) {
        setTimeout(() => start(), 100);
      }
    }
  }, [
    phase,
    completedSessions,
    settings,
    playSound,
    resetToPhase,
    onWorkComplete,
    onBreakComplete,
    secondsRemaining,
  ]);

  // Timer tick
  useEffect(() => {
    if (isRunning && !isPaused && secondsRemaining <= 0) {
      handlePhaseComplete();
    }
  }, [secondsRemaining, isRunning, isPaused, handlePhaseComplete]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    setIsPaused(false);
    workStartSecondsRef.current = secondsRemaining;
    
    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [secondsRemaining]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (intervalRef.current) return;
    setIsPaused(false);
    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const skip = useCallback(() => {
    if (phase === "work") {
      // Save partial work session if more than 1 minute
      const workedSeconds = workStartSecondsRef.current - secondsRemaining;
      if (workedSeconds >= 60) {
        setTotalWorkSeconds((prev) => prev + workedSeconds);
        onWorkComplete(workedSeconds);
      }
    }
    handlePhaseComplete();
  }, [phase, secondsRemaining, handlePhaseComplete, onWorkComplete]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSecondsRemaining(getPhaseDuration(phase));
    setIsRunning(false);
    setIsPaused(false);
  }, [phase, getPhaseDuration]);

  const resetAll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase("work");
    setSecondsRemaining(settings.workDuration * 60);
    setIsRunning(false);
    setIsPaused(false);
    setCompletedSessions(0);
    setTotalWorkSeconds(0);
  }, [settings.workDuration]);

  // Update remaining time when settings change (if not running)
  useEffect(() => {
    if (!isRunning && !isPaused) {
      setSecondsRemaining(getPhaseDuration(phase));
    }
  }, [settings, phase, isRunning, isPaused, getPhaseDuration]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  }, []);

  return {
    phase,
    secondsRemaining,
    isRunning,
    isPaused,
    completedSessions,
    totalWorkSeconds,
    start,
    pause,
    resume,
    skip,
    reset,
    resetAll,
    formatTime,
    setPhase: resetToPhase,
  };
}
