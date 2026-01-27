import { useState, useMemo, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { Timer } from "@/components/Timer";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TimerModeToggle, TimerMode } from "@/components/TimerModeToggle";
import { SubjectSelector } from "@/components/SubjectSelector";
import { SessionHistory } from "@/components/SessionHistory";
import { Stats } from "@/components/Stats";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { DailyGoal } from "@/components/DailyGoal";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { Achievements } from "@/components/Achievements";
import { TodoList } from "@/components/TodoList";
import { useCloudStudySessions } from "@/hooks/useCloudStudySessions";
import { useCloudSettings } from "@/hooks/useCloudSettings";
import { useCloudStreak } from "@/hooks/useCloudStreak";
import { useAchievements } from "@/hooks/useAchievements";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    loading: sessionsLoading,
  } = useCloudStudySessions();

  const { settings, updateSettings, resetSettings } = useCloudSettings();
  const { streak, updateStreak } = useCloudStreak();
  const { checkAchievements } = useAchievements();

  // Check achievements when sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      const totalSeconds = sessions.reduce((acc, s) => acc + s.duration, 0);
      const totalHours = totalSeconds / 3600;
      checkAchievements({
        totalHours,
        currentStreak: streak.currentStreak,
        sessionsCount: sessions.length,
      });
    }
  }, [sessions, streak.currentStreak, checkAchievements]);

  const handleSessionEnd = useCallback(async (duration: number) => {
    const session = await addSession(duration);
    if (session) {
      const minutes = Math.floor(duration / 60);
      toast.success(`সেশন সেভ হয়েছে: ${minutes} মিনিট - ${session.subjectName}`, {
        duration: 4000,
      });
      // Update streak when session is added
      await updateStreak();
    }
  }, [addSession, updateStreak]);

  const handleModeChange = useCallback((mode: TimerMode) => {
    setTimerMode(mode);
    localStorage.setItem("akta-timer-mode", mode);
  }, []);

  const todayTotal = useMemo(() => getTodayTotal(), [getTodayTotal]);
  const weekTotal = useMemo(() => getWeekTotal(), [getWeekTotal]);
  const subjectStats = useMemo(() => getSubjectStats(), [getSubjectStats]);

  if (sessionsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground uppercase tracking-wide text-sm">ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_380px] gap-8 lg:gap-10">
          {/* Main Timer Section */}
          <div className="space-y-8 sm:space-y-10">
            {/* Timer Mode Toggle */}
            <div className="flex justify-center animate-fade-in">
              <TimerModeToggle
                mode={timerMode}
                onModeChange={handleModeChange}
              />
            </div>

            {/* Current Subject Display */}
            {selectedSubject && (
              <div className="flex items-center justify-center gap-3 text-lg sm:text-xl animate-fade-in">
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
            <div className="animate-scale-in">
              {timerMode === "stopwatch" ? (
                <Timer
                  onSessionEnd={handleSessionEnd}
                  disabled={!selectedSubject}
                />
              ) : (
                <PomodoroTimer
                  onSessionEnd={handleSessionEnd}
                  disabled={!selectedSubject}
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  onResetSettings={resetSettings}
                />
              )}
            </div>

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
          <aside className="space-y-6 lg:border-l-2 lg:border-foreground lg:pl-8">
            {/* Motivational Quote */}
            <div className="animate-fade-in">
              <MotivationalQuote />
            </div>
            
            {/* Daily Goal */}
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <DailyGoal 
                todayTotalSeconds={todayTotal} 
                targetMinutes={settings.dailyGoalMinutes}
                onUpdateTarget={(minutes) => updateSettings({ dailyGoalMinutes: minutes })}
                currentStreak={streak.currentStreak}
              />
            </div>

            {/* Todo List */}
            <div className="border-t-2 border-foreground pt-6 animate-fade-in" style={{ animationDelay: "150ms" }}>
              <TodoList />
            </div>

            {/* Achievements */}
            <div className="border-t-2 border-foreground pt-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Achievements />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: "250ms" }}>
              <Stats
                todayTotal={todayTotal}
                weekTotal={weekTotal}
                subjectStats={subjectStats}
              />
            </div>
            
            <div className="border-t-2 border-foreground pt-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
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
