-- PWR Scout - Production Database Schema
-- Run in Supabase SQL Editor or via supabase db push

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE user_role AS ENUM ('athlete', 'promoter', 'organization', 'admin');
CREATE TYPE sport_type AS ENUM ('mma', 'wrestling', 'boxing', 'kickboxing', 'bjj', 'muay_thai', 'other');
CREATE TYPE verification_status AS ENUM ('none', 'pending', 'verified', 'rejected');
CREATE TYPE booking_status AS ENUM ('draft', 'sent', 'viewed', 'negotiating', 'accepted', 'declined', 'cancelled', 'completed');
CREATE TYPE subscription_tier AS ENUM ('free', 'scout', 'promoter', 'elite');
CREATE TYPE notification_type AS ENUM ('booking', 'message', 'verification', 'system', 'offer');
CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived', 'flagged');

-- Profiles (synced with Clerk via webhook)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'athlete',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_clerk ON profiles(clerk_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Athletes
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  legal_name TEXT,
  sport sport_type NOT NULL,
  weight_class TEXT,
  height_cm INTEGER,
  reach_cm INTEGER,
  stance TEXT,
  nationality TEXT,
  birth_date DATE,
  gym TEXT,
  manager TEXT,
  bio TEXT,
  record_wins INTEGER DEFAULT 0,
  record_losses INTEGER DEFAULT 0,
  record_draws INTEGER DEFAULT 0,
  ranking_position INTEGER,
  ranking_weight_class TEXT,
  verification verification_status DEFAULT 'none',
  featured BOOLEAN DEFAULT FALSE,
  youtube_channel_id TEXT,
  instagram_handle TEXT,
  twitter_handle TEXT,
  location_city TEXT,
  location_country TEXT,
  available_for_booking BOOLEAN DEFAULT TRUE,
  min_booking_fee INTEGER,
  tags TEXT[] DEFAULT '{}',
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_athletes_sport ON athletes(sport);
CREATE INDEX idx_athletes_slug ON athletes(slug);
CREATE INDEX idx_athletes_verification ON athletes(verification);
CREATE INDEX idx_athletes_search ON athletes USING GIN(search_vector);
CREATE INDEX idx_athletes_tags ON athletes USING GIN(tags);

-- Promotions / Organizations
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sport sport_type NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website TEXT,
  location_city TEXT,
  location_country TEXT,
  verification verification_status DEFAULT 'none',
  featured BOOLEAN DEFAULT FALSE,
  founded_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_slug ON promotions(slug);

-- Media (videos, images)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'image')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  youtube_id TEXT,
  duration_seconds INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  status content_status DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_athlete ON media(athlete_id);

-- News articles
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  sport sport_type,
  tags TEXT[] DEFAULT '{}',
  status content_status DEFAULT 'published',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_slug ON news_articles(slug);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);

-- Rankings
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport sport_type NOT NULL,
  weight_class TEXT NOT NULL,
  organization TEXT,
  rank INTEGER NOT NULL,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  previous_rank INTEGER,
  movement INTEGER DEFAULT 0,
  as_of_date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(sport, weight_class, organization, rank, as_of_date)
);

-- Booking requests
CREATE TABLE booking_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promoter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date DATE,
  venue TEXT,
  location TEXT,
  purse_offer INTEGER,
  message TEXT,
  status booking_status DEFAULT 'sent',
  counter_offer INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_promoter ON booking_requests(promoter_id);
CREATE INDEX idx_booking_athlete ON booking_requests(athlete_id);
CREATE INDEX idx_booking_status ON booking_requests(status);

-- Offers (promoter to athlete)
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promoter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount INTEGER,
  status booking_status DEFAULT 'sent',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, athlete_id),
  UNIQUE(profile_id, promotion_id)
);

-- Saved searches
CREATE TABLE saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  notify_on_match BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_profile ON notifications(profile_id, read);

-- Messages
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- AI Scout sessions
CREATE TABLE ai_scout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_athlete ON analytics_events(athlete_id, created_at);

-- Verification requests
CREATE TABLE verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athletes(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  document_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  status verification_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER athletes_updated_at BEFORE UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER booking_updated_at BEFORE UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Search vector update for athletes
CREATE OR REPLACE FUNCTION athletes_search_vector_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.display_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.gym, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER athletes_search_update BEFORE INSERT OR UPDATE ON athletes
  FOR EACH ROW EXECUTE FUNCTION athletes_search_vector_update();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read for athletes and promotions
CREATE POLICY "Athletes are viewable by everyone" ON athletes FOR SELECT USING (true);
CREATE POLICY "Promotions are viewable by everyone" ON promotions FOR SELECT USING (true);
CREATE POLICY "Media is viewable by everyone" ON media FOR SELECT USING (status = 'published');
CREATE POLICY "News is viewable when published" ON news_articles FOR SELECT USING (status = 'published');
