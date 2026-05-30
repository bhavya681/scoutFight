-- PWR Scout v2: Global Combat Sports Talent Marketplace

CREATE TYPE talent_type AS ENUM ('athlete', 'professional');
CREATE TYPE professional_role AS ENUM ('referee', 'announcer', 'commentator', 'manager', 'agent', 'coach');
CREATE TYPE organization_type AS ENUM (
  'wrestling_promotion', 'mma_promotion', 'boxing_promotion',
  'gym', 'academy', 'event_company'
);
CREATE TYPE availability_status AS ENUM ('available', 'open_to_offers', 'under_contract', 'not_available');
CREATE TYPE contract_status AS ENUM ('draft', 'pending_signature', 'active', 'expired', 'terminated');
CREATE TYPE marketplace_listing_type AS ENUM ('booking_opportunity', 'talent_seek', 'partnership', 'event_slot');

-- Extend sport enum if needed (run after 001)
-- ALTER TYPE sport_type ADD VALUE IF NOT EXISTS 'grappling';

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role professional_role NOT NULL,
  sports sport_type[] DEFAULT '{}',
  nationality TEXT,
  location_city TEXT,
  location_country TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  verification verification_status DEFAULT 'none',
  availability availability_status DEFAULT 'available',
  current_organization TEXT,
  social_links JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE athletes ADD COLUMN IF NOT EXISTS availability availability_status DEFAULT 'available';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS market_value INTEGER;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS career_history JSONB DEFAULT '[]';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS championships JSONB DEFAULT '[]';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS current_organization TEXT;

ALTER TABLE promotions ADD COLUMN IF NOT EXISTS org_type organization_type;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS sports sport_type[] DEFAULT '{}';
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS roster_count INTEGER DEFAULT 0;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS talent_needs TEXT[] DEFAULT '{}';
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS active_recruitment BOOLEAN DEFAULT FALSE;

CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  listing_type marketplace_listing_type NOT NULL,
  sport sport_type,
  location TEXT,
  budget TEXT,
  deadline DATE,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  status content_status DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  talent_profile_id UUID REFERENCES profiles(id),
  organization_id UUID REFERENCES promotions(id),
  athlete_id UUID REFERENCES athletes(id),
  title TEXT NOT NULL,
  status contract_status DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  value_cents INTEGER,
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE recruitment_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  talent_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE compare_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  talent_ids UUID[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ai_matchmaker_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  criteria JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_professionals_role ON professionals(role);
CREATE INDEX idx_marketplace_sport ON marketplace_listings(sport);
CREATE INDEX idx_contracts_status ON contracts(status);
