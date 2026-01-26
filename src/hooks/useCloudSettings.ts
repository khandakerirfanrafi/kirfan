import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CloudSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
  dailyGoalMinutes: number;
}

const DEFAULT_SETTINGS: CloudSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreak: false,
  autoStartWork: false,
  soundEnabled: true,
  dailyGoalMinutes: 120,
};

export function useCloudSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<CloudSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching settings:", error);
      return;
    }

    if (data) {
      setSettings({
        workDuration: data.work_duration,
        shortBreakDuration: data.short_break_duration,
        longBreakDuration: data.long_break_duration,
        sessionsBeforeLongBreak: data.sessions_before_long_break,
        autoStartBreak: data.auto_start_break,
        autoStartWork: data.auto_start_work,
        soundEnabled: data.sound_enabled,
        dailyGoalMinutes: data.daily_goal_minutes,
      });
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchSettings();
      setLoading(false);
    };

    if (user) {
      load();
    }
  }, [user, fetchSettings]);

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<CloudSettings>) => {
      if (!user) return;

      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);

      const { error } = await supabase
        .from("user_settings")
        .update({
          work_duration: newSettings.workDuration,
          short_break_duration: newSettings.shortBreakDuration,
          long_break_duration: newSettings.longBreakDuration,
          sessions_before_long_break: newSettings.sessionsBeforeLongBreak,
          auto_start_break: newSettings.autoStartBreak,
          auto_start_work: newSettings.autoStartWork,
          sound_enabled: newSettings.soundEnabled,
          daily_goal_minutes: newSettings.dailyGoalMinutes,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error updating settings:", error);
      }
    },
    [user, settings]
  );

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    if (!user) return;

    await supabase
      .from("user_settings")
      .update({
        work_duration: DEFAULT_SETTINGS.workDuration,
        short_break_duration: DEFAULT_SETTINGS.shortBreakDuration,
        long_break_duration: DEFAULT_SETTINGS.longBreakDuration,
        sessions_before_long_break: DEFAULT_SETTINGS.sessionsBeforeLongBreak,
        auto_start_break: DEFAULT_SETTINGS.autoStartBreak,
        auto_start_work: DEFAULT_SETTINGS.autoStartWork,
        sound_enabled: DEFAULT_SETTINGS.soundEnabled,
        daily_goal_minutes: DEFAULT_SETTINGS.dailyGoalMinutes,
      })
      .eq("user_id", user.id);
  }, [user]);

  return {
    settings,
    updateSettings,
    resetSettings,
    loading,
  };
}
