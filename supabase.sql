-- Create Profiles table (NOT linked to auth.users for easier testing/initial setup)
-- In a production app, you would use: id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  role TEXT NOT NULL,
  role_en TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Documents table
CREATE TABLE public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  type TEXT NOT NULL,
  type_en TEXT NOT NULL,
  version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'review', 'approved', 'rejected')),
  progress INTEGER DEFAULT 0,
  stakeholders JSONB DEFAULT '[]'::jsonb,
  content TEXT,
  author_id UUID REFERENCES public.profiles(id),
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  message TEXT NOT NULL,
  message_en TEXT NOT NULL,
  document_id UUID REFERENCES public.documents(id),
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (Development: Allow all for now)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Documents are viewable by everyone." ON public.documents FOR SELECT USING (true);
CREATE POLICY "Users can create documents." ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update documents." ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Notifications are viewable by user." ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Notifications insert." ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Notifications update." ON public.notifications FOR UPDATE USING (true);

-- Insert Mock Users into Profiles (Important: In real app, this happens on Auth Signup)
-- Note: Replace with real UUIDs from your Supabase Auth if needed
-- For initial setup without Auth, you can use these mock UUIDs:
INSERT INTO public.profiles (id, name, name_en, role, role_en, email)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'أحمد محمد', 'Ahmed Mohammed', 'مدير الجودة', 'Quality Manager', 'ahmed@company.sa'),
  ('00000000-0000-0000-0000-000000000002', 'سارة علي', 'Sara Ali', 'مشرف الإنتاج', 'Production Supervisor', 'sara@company.sa'),
  ('00000000-0000-0000-0000-000000000003', 'خالد سعيد', 'Khaled Saeed', 'المدير العام', 'General Manager', 'khaled@company.sa');
