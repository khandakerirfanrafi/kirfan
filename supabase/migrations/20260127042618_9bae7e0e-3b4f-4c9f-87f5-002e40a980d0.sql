-- Create achievements definition table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'trophy',
  requirement_type TEXT NOT NULL, -- 'total_hours', 'streak_days', 'sessions_count', 'subject_hours'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create todos table
CREATE TABLE public.todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Achievements are readable by all authenticated users
CREATE POLICY "Anyone can view achievements"
ON public.achievements
FOR SELECT
TO authenticated
USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
ON public.user_achievements
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
ON public.user_achievements
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Todos policies
CREATE POLICY "Users can view own todos"
ON public.todos
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
ON public.todos
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
ON public.todos
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
ON public.todos
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for todos updated_at
CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON public.todos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (key, name, description, icon, requirement_type, requirement_value) VALUES
('first_hour', 'প্রথম ঘণ্টা', 'মোট ১ ঘণ্টা পড়াশোনা সম্পন্ন', 'clock', 'total_hours', 1),
('five_hours', 'পাঁচ ঘণ্টা', 'মোট ৫ ঘণ্টা পড়াশোনা সম্পন্ন', 'clock', 'total_hours', 5),
('ten_hours', 'দশ ঘণ্টা', 'মোট ১০ ঘণ্টা পড়াশোনা সম্পন্ন', 'star', 'total_hours', 10),
('fifty_hours', 'পঞ্চাশ ঘণ্টা', 'মোট ৫০ ঘণ্টা পড়াশোনা সম্পন্ন', 'trophy', 'total_hours', 50),
('hundred_hours', 'শত ঘণ্টা', 'মোট ১০০ ঘণ্টা পড়াশোনা সম্পন্ন', 'award', 'total_hours', 100),
('streak_3', 'তিন দিন স্ট্রিক', 'পরপর ৩ দিন পড়াশোনা', 'flame', 'streak_days', 3),
('streak_7', 'সাত দিন স্ট্রিক', 'পরপর ৭ দিন পড়াশোনা', 'flame', 'streak_days', 7),
('streak_30', 'ত্রিশ দিন স্ট্রিক', 'পরপর ৩০ দিন পড়াশোনা', 'flame', 'streak_days', 30),
('first_session', 'প্রথম সেশন', 'প্রথম স্টাডি সেশন সম্পন্ন', 'play', 'sessions_count', 1),
('ten_sessions', 'দশ সেশন', '১০টি স্টাডি সেশন সম্পন্ন', 'target', 'sessions_count', 10),
('fifty_sessions', 'পঞ্চাশ সেশন', '৫০টি স্টাডি সেশন সম্পন্ন', 'target', 'sessions_count', 50),
('hundred_sessions', 'শত সেশন', '১০০টি স্টাডি সেশন সম্পন্ন', 'medal', 'sessions_count', 100);