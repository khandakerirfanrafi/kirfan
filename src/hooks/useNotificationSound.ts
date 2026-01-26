import { useCallback, useRef } from "react";

type SoundType = "timer-end" | "goal-complete" | "break-start" | "break-end";

// Audio context for generating sounds
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export function useNotificationSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = "sine") => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    // Fade in and out for smoother sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [getAudioContext]);

  const playSound = useCallback((soundType: SoundType, enabled: boolean = true) => {
    if (!enabled) return;
    
    switch (soundType) {
      case "timer-end":
        // Success melody: ascending notes
        playTone(523.25, 0.15); // C5
        setTimeout(() => playTone(659.25, 0.15), 150); // E5
        setTimeout(() => playTone(783.99, 0.3), 300); // G5
        break;

      case "goal-complete":
        // Celebration fanfare
        playTone(523.25, 0.1); // C5
        setTimeout(() => playTone(659.25, 0.1), 100); // E5
        setTimeout(() => playTone(783.99, 0.1), 200); // G5
        setTimeout(() => playTone(1046.50, 0.4), 300); // C6
        break;

      case "break-start":
        // Gentle descending chime
        playTone(783.99, 0.2); // G5
        setTimeout(() => playTone(659.25, 0.2), 200); // E5
        setTimeout(() => playTone(523.25, 0.3), 400); // C5
        break;

      case "break-end":
        // Alert: two quick beeps
        playTone(880, 0.1, "square"); // A5
        setTimeout(() => playTone(880, 0.1, "square"), 200);
        setTimeout(() => playTone(1046.50, 0.2, "square"), 400); // C6
        break;

      default:
        playTone(440, 0.2);
    }
  }, [playTone]);

  return { playSound };
}
