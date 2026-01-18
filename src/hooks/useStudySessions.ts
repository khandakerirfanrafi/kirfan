import { useState, useCallback } from "react";

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  duration: number;
  date: Date;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "1", name: "Mathematics", color: "hsl(var(--chart-1))" },
  { id: "2", name: "Physics", color: "hsl(var(--chart-2))" },
  { id: "3", name: "Chemistry", color: "hsl(var(--chart-3))" },
  { id: "4", name: "Literature", color: "hsl(var(--chart-4))" },
  { id: "5", name: "History", color: "hsl(var(--chart-5))" },
];

export function useStudySessions() {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem("akta-subjects");
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("akta-sessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((s: StudySession) => ({
        ...s,
        date: new Date(s.date),
      }));
    }
    return [];
  });

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const saveSubjects = useCallback((newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem("akta-subjects", JSON.stringify(newSubjects));
  }, []);

  const saveSessions = useCallback((newSessions: StudySession[]) => {
    setSessions(newSessions);
    localStorage.setItem("akta-sessions", JSON.stringify(newSessions));
  }, []);

  const addSubject = useCallback(
    (name: string) => {
      const colors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
      ];
      const newSubject: Subject = {
        id: Date.now().toString(),
        name,
        color: colors[subjects.length % colors.length],
      };
      saveSubjects([...subjects, newSubject]);
      return newSubject;
    },
    [subjects, saveSubjects]
  );

  const removeSubject = useCallback(
    (id: string) => {
      saveSubjects(subjects.filter((s) => s.id !== id));
      if (selectedSubject?.id === id) {
        setSelectedSubject(null);
      }
    },
    [subjects, selectedSubject, saveSubjects]
  );

  const addSession = useCallback(
    (duration: number) => {
      if (!selectedSubject || duration < 60) return null;
      const newSession: StudySession = {
        id: Date.now().toString(),
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        subjectColor: selectedSubject.color,
        duration,
        date: new Date(),
      };
      saveSessions([newSession, ...sessions]);
      return newSession;
    },
    [selectedSubject, sessions, saveSessions]
  );

  const getTodayTotal = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions
      .filter((s) => new Date(s.date) >= today)
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const getWeekTotal = useCallback(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);
    return sessions
      .filter((s) => new Date(s.date) >= weekAgo)
      .reduce((acc, s) => acc + s.duration, 0);
  }, [sessions]);

  const getSubjectStats = useCallback(() => {
    const stats: Record<string, number> = {};
    sessions.forEach((s) => {
      stats[s.subjectName] = (stats[s.subjectName] || 0) + s.duration;
    });
    return Object.entries(stats)
      .map(([name, duration]) => ({ name, duration }))
      .sort((a, b) => b.duration - a.duration);
  }, [sessions]);

  return {
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
  };
}
