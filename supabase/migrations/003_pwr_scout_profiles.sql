-- PWR Scout: extended profile fields + MVP booking inquiries

ALTER TABLE athletes ADD COLUMN IF NOT EXISTS ring_name TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS nickname TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS weight_kg INTEGER;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS promotion TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS experience_years INTEGER;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS free_agent BOOLEAN DEFAULT TRUE;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS booking_email TEXT;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS popularity_score INTEGER;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE athletes ADD COLUMN IF NOT EXISTS data_source TEXT DEFAULT 'seed';

ALTER TABLE professionals ADD COLUMN IF NOT EXISTS free_agent BOOLEAN DEFAULT TRUE;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS booking_email TEXT;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS available_for_booking BOOLEAN DEFAULT TRUE;

-- MVP booking log (slug-based, no strict athlete FK for seed/demo data)
CREATE TABLE IF NOT EXISTS booking_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_slug TEXT NOT NULL,
  talent_name TEXT NOT NULL,
  recruiter_clerk_id TEXT,
  event_name TEXT NOT NULL,
  event_date DATE,
  venue TEXT,
  location TEXT,
  purse_offer INTEGER,
  message TEXT,
  status booking_status DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_inquiries_slug ON booking_inquiries(athlete_slug);
CREATE INDEX IF NOT EXISTS idx_booking_inquiries_recruiter ON booking_inquiries(recruiter_clerk_id);

ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY booking_inquiries_insert ON booking_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY booking_inquiries_select_own ON booking_inquiries
  FOR SELECT USING (
    recruiter_clerk_id IS NULL
    OR recruiter_clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );
