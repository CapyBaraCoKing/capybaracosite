-- Create admin users table for the Capybara Community admin system
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can view their own data
CREATE POLICY "admin_users_select_own" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

-- Admin users can update their own data
CREATE POLICY "admin_users_update_own" ON public.admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Create wiki pages table
CREATE TABLE IF NOT EXISTS public.wiki_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for wiki_pages
ALTER TABLE public.wiki_pages ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view wiki pages
CREATE POLICY "wiki_pages_select_all" ON public.wiki_pages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can create wiki pages
CREATE POLICY "wiki_pages_insert_auth" ON public.wiki_pages
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can update their own wiki pages
CREATE POLICY "wiki_pages_update_own" ON public.wiki_pages
  FOR UPDATE USING (auth.uid() = author_id);

-- Authors can delete their own wiki pages
CREATE POLICY "wiki_pages_delete_own" ON public.wiki_pages
  FOR DELETE USING (auth.uid() = author_id);

-- Create tickets table for kanban board
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee_id UUID REFERENCES auth.users(id),
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for tickets
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view tickets
CREATE POLICY "tickets_select_all" ON public.tickets
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create tickets
CREATE POLICY "tickets_insert_auth" ON public.tickets
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Authenticated users can update tickets
CREATE POLICY "tickets_update_auth" ON public.tickets
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create user bans table
CREATE TABLE IF NOT EXISTS public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  reason TEXT NOT NULL,
  banned_by UUID NOT NULL REFERENCES auth.users(id),
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS for user_bans
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view bans
CREATE POLICY "user_bans_select_all" ON public.user_bans
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can create bans
CREATE POLICY "user_bans_insert_auth" ON public.user_bans
  FOR INSERT WITH CHECK (auth.uid() = banned_by);

-- Authenticated users can update bans
CREATE POLICY "user_bans_update_auth" ON public.user_bans
  FOR UPDATE USING (auth.role() = 'authenticated');
