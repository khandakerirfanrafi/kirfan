-- Remove email column from profiles table to prevent email exposure
-- Emails are already securely stored in auth.users table
-- Application can access email via auth.jwt() or auth.email() when needed

-- First, update the handle_new_user function to not insert email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile (without email - email is in auth.users)
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  
  -- Create default settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  -- Create streak record
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Drop the email column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;