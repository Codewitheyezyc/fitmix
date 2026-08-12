-- ==============================================================================
-- FITMIX DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  style_interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PIECES TABLE (Individual clothing items in user closets)
CREATE TABLE IF NOT EXISTS public.pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'outerwear', 'footwear', 'bags', 'accessories', 'upcycled')),
  cutout_image_url TEXT NOT NULL,
  original_image_url TEXT,
  brand_name TEXT,
  dominant_colors TEXT[] DEFAULT '{}',
  description TEXT,
  styling_notes TEXT,
  remix_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MIXES TABLE (Outfit collages)
CREATE TABLE IF NOT EXISTS public.mixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rendered_image_url TEXT,
  canvas_background TEXT DEFAULT 'obsidian',
  technique_tags TEXT[] DEFAULT '{}',
  why_it_works TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  remix_count INT DEFAULT 0,
  remix_chain_parent_id UUID REFERENCES public.mixes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MIX_PIECES (Junction table linking pieces with exact coordinate transforms)
CREATE TABLE IF NOT EXISTS public.mix_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id UUID NOT NULL REFERENCES public.mixes(id) ON DELETE CASCADE,
  piece_id UUID NOT NULL REFERENCES public.pieces(id) ON DELETE CASCADE,
  layer_order INT NOT NULL,
  transform_data JSONB NOT NULL -- { x, y, scale, rotation, zIndex, flipX }
);

-- 6. SOCIAL FOLLOWS
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- 7. LIKES & SAVES
CREATE TABLE IF NOT EXISTS public.mix_likes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mix_id UUID REFERENCES public.mixes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, mix_id)
);

CREATE TABLE IF NOT EXISTS public.mix_saves (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  mix_id UUID REFERENCES public.mixes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, mix_id)
);

-- 8. DIRECT MESSAGES
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attached_mix_id UUID REFERENCES public.mixes(id) ON DELETE SET NULL,
  attached_piece_id UUID REFERENCES public.pieces(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COMMENTS (Styling Advice & Discussion)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mix_id UUID NOT NULL REFERENCES public.mixes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('remix', 'like', 'follow', 'comment', 'dm')),
  target_mix_id UUID REFERENCES public.mixes(id) ON DELETE CASCADE,
  target_piece_id UUID REFERENCES public.pieces(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mixes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mix_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public Read access
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public pieces are viewable by everyone" ON public.pieces FOR SELECT USING (true);
CREATE POLICY "Public mixes are viewable by everyone" ON public.mixes FOR SELECT USING (true);
CREATE POLICY "Public mix pieces are viewable by everyone" ON public.mix_pieces FOR SELECT USING (true);
CREATE POLICY "Public comments are viewable by everyone" ON public.comments FOR SELECT USING (true);

-- Authenticated User Insert/Update
CREATE POLICY "Users can create pieces" ON public.pieces FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own pieces" ON public.pieces FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own pieces" ON public.pieces FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Users can create mixes" ON public.mixes FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users can delete own mixes" ON public.mixes FOR DELETE USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can insert comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- DMs Policy
CREATE POLICY "Users can read their own direct messages" ON public.direct_messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send direct messages" ON public.direct_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications Policy
CREATE POLICY "Users can read their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTH TRIGGER FOR AUTOMATIC PROFILE CREATION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, bio, style_interests)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Fashion lover & outfit mixer.'),
    COALESCE(ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'style_interests')), '{}'::text[])
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

