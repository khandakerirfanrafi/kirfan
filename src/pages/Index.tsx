import { useState } from "react";
import { Header } from "@/components/Header";
import { Timer } from "@/components/Timer";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TimerModeToggle, TimerMode } from "@/components/TimerModeToggle";
import { SubjectSelector } from "@/components/SubjectSelector";
import { SessionHistory } from "@/components/SessionHistory";
import { Stats } from "@/components/Stats";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { useStudySessions } from "@/hooks/useStudySessions";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const Index = () => {
  const [timerMode, setTimerMode] = useState<TimerMode>(() => {
    const saved = localStorage.getItem("akta-timer-mode");
    return (saved as TimerMode) || "stopwatch";
  });

  const {
    subjects,
    sessions,
    selectedSubject,
    setSelectedSubject,
    addSubject,
    removeSubject,
    addSession,
    getTodayTotal,
    getWeekTotal,
    getSubjectStats,
  } = useStudySessions();

  const handleSessionEnd = (duration: number) => {
    const session = addSession(duration);
    if (session) {
      const minutes = Math.floor(duration / 60);
      toast.success(`Session saved: ${minutes} minutes of ${session.subjectName}`, {
        duration: 4000,
      });
    }
  };

  const handleModeChange = (mode: TimerMode) => {
    setTimerMode(mode);
    localStorage.setItem("akta-timer-mode", mode);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] gap-8 lg:gap-10">
          {/* Main Timer Section */}
          <div className="space-y-8 sm:space-y-10">
            {/* Timer Mode Toggle */}
            <div className="flex justify-center">
              <TimerModeToggle
                mode={timerMode}
                onModeChange={handleModeChange}
              />
            </div>

            {/* Current Subject Display */}
            {selectedSubject && (
              <div className="flex items-center justify-center gap-3 text-lg sm:text-xl">
                <span
                  className="w-4 h-4 border-2 border-foreground"
                  style={{ backgroundColor: selectedSubject.color }}
                />
                <span className="font-bold uppercase tracking-wide">
                  {selectedSubject.name}
                </span>
              </div>
            )}

            {/* Timer */}
            {timerMode === "stopwatch" ? (
              <Timer
                onSessionEnd={handleSessionEnd}
                disabled={!selectedSubject}
              />
            ) : (
              <PomodoroTimer
                onSessionEnd={handleSessionEnd}
                disabled={!selectedSubject}
              />
            )}

            {/* Subject Selector */}
            <div className="border-t-2 border-foreground pt-8">
              <SubjectSelector
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSelect={setSelectedSubject}
                onAdd={addSubject}
                onRemove={removeSubject}
              />
            </div>

            {/* Activity Heatmap */}
            <div className="border-t-2 border-foreground pt-8">
              <ActivityHeatmap 
                sessions={sessions} 
                subject={selectedSubject?.name}
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:border-l-2 lg:border-foreground lg:pl-8">
            <Stats
              todayTotal={getTodayTotal()}
              weekTotal={getWeekTotal()}
              subjectStats={getSubjectStats()}
            />
            
            <div className="border-t-2 border-foreground pt-8">
              <SessionHistory sessions={sessions} />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground uppercase tracking-wide">
          Focus • Track • Improve
        </div>
      </footer>

      <Toaster position="bottom-center" />
    </div>
  );
};

export default Index;
