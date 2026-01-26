import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function useCloudStudySessions() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch subjects
  const fetchSubjects = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching subjects:", error);
      return;
    }

    setSubjects(
      data.map((s) => ({
        id: s.id,
        name: s.name,
        color: s.color,
      }))
    );
  }, [user]);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("study_sessions")
      .select("*, subjects(name, color)")
      .order("started_at", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
      return;
    }

    setSessions(
      data.map((s) => ({
        id: s.id,
        subjectId: s.subject_id,
        subjectName: s.subject_name,
        subjectColor: (s.subjects as any)?.color || CHART_COLORS[0],
        duration: s.duration,
        date: new Date(s.started_at),
      }))
    );
  }, [user]);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubjects(), fetchSessions()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user, fetchSubjects, fetchSessions]);

  // Add subject
  const addSubject = useCallback(
    async (name: string) => {
      if (!user) return null;

      const color = CHART_COLORS[subjects.length % CHART_COLORS.length];

      const { data, error } = await supabase
        .from("subjects")
        .insert({
          user_id: user.id,
          name,
          color,
        })
        .select()
        .single();

      if (error) {
        toast.error("বিষয় যোগ করতে ব্যর্থ");
        console.error("Error adding subject:", error);
        return null;
      }

      const newSubject: Subject = {
        id: data.id,
        name: data.name,
        color: data.color,
      };

      setSubjects((prev) => [...prev, newSubject]);
      return newSubject;
    },
    [user, subjects.length]
  );

  // Remove subject
  const removeSubject = useCallback(
    async (id: string) => {
      if (!user) return;

      const { error } = await supabase.from("subjects").delete().eq("id", id);

      if (error) {
        toast.error("বিষয় মুছতে ব্যর্থ");
        console.error("Error removing subject:", error);
        return;
      }

      setSubjects((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubject?.id === id) {
        setSelectedSubject(null);
      }
    },
    [user, selectedSubject]
  );

  // Add session
  const addSession = useCallback(
    async (duration: number) => {
      if (!user || !selectedSubject || duration < 60) return null;

      const { data, error } = await supabase
        .from("study_sessions")
        .insert({
          user_id: user.id,
          subject_id: selectedSubject.id,
          subject_name: selectedSubject.name,
          duration,
        })
        .select()
        .single();

      if (error) {
        toast.error("সেশন সেভ করতে ব্যর্থ");
        console.error("Error adding session:", error);
        return null;
      }

      const newSession: StudySession = {
        id: data.id,
        subjectId: selectedSubject.id,
        subjectName: selectedSubject.name,
        subjectColor: selectedSubject.color,
        duration,
        date: new Date(data.started_at),
      };

      setSessions((prev) => [newSession, ...prev]);
      return newSession;
    },
    [user, selectedSubject]
  );

  // Stats calculations
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
    loading,
    refetch: () => Promise.all([fetchSubjects(), fetchSessions()]),
  };
}
