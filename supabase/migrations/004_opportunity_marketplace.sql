-- PWR Scout: opportunity marketplace & applications

CREATE TYPE opportunity_seek_type AS ENUM (
  'looking_for_wrestlers',
  'looking_for_mma_fighters',
  'looking_for_boxers',
  'looking_for_coaches',
  'looking_for_commentators',
  'looking_for_referees',
  'looking_for_managers',
  'looking_for_announcers'
);

CREATE TYPE application_status AS ENUM (
  'submitted', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn'
);

CREATE TYPE career_status AS ENUM (
  'free_agent',
  'open_to_offers',
  'open_to_bookings',
  'under_contract',
  'contract_ending_soon',
  'seeking_opportunities',
  'retired',
  'inactive'
);

ALTER TABLE athletes ADD COLUMN IF NOT EXISTS career_status career_status DEFAULT 'seeking_opportunities';
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS contract_ends_at DATE;

CREATE TABLE IF NOT EXISTS opportunity_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  organization_slug TEXT,
  seek_type opportunity_seek_type,
  sport sport_type,
  location TEXT,
  budget TEXT,
  deadline DATE,
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  allows_applications BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunity_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_slug TEXT NOT NULL,
  talent_slug TEXT NOT NULL,
  talent_name TEXT NOT NULL,
  applicant_email TEXT,
  cover_message TEXT NOT NULL,
  status application_status DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_opp_apps_slug ON opportunity_applications(talent_slug);
CREATE INDEX IF NOT EXISTS idx_opp_apps_opp ON opportunity_applications(opportunity_slug);

ALTER TABLE opportunity_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY opp_apps_insert ON opportunity_applications FOR INSERT WITH CHECK (true);
