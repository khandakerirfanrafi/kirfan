-- Add missing UPDATE policy for study_sessions table
-- This allows users to correct errors in their study session records

CREATE POLICY "Users can update own sessions"
  ON public.study_sessions FOR UPDATE
  USING (auth.uid() = user_id);