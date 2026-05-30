-- PWR Scout seed data (run after migrations)
-- psql or Supabase SQL Editor: \i supabase/seed.sql

INSERT INTO athletes (
  slug, display_name, ring_name, nickname, legal_name, sport, weight_class,
  height_cm, reach_cm, weight_kg, nationality, location_city, location_country,
  bio, record_wins, record_losses, record_draws, verification, featured,
  availability, free_agent, available_for_booking, booking_email, min_booking_fee,
  market_value, popularity_score, tags, championships, career_history, data_source, published
) VALUES
(
  'marcus-steel', 'Marcus Steel Johnson', 'Marcus Steel', 'The Anvil', 'Marcus Johnson',
  'wrestling', 'Heavyweight', 188, 198, 118, 'USA', 'Chicago', 'USA',
  'Powerhouse brawler — independent main-event talent open for major promotion deals.',
  142, 38, 5, 'verified', true, 'available', true, true,
  'marcus.steel@pwrscout.demo', 2500, 45, 62,
  ARRAY['powerhouse','independent'],
  '[{"name":"Midwest Heavyweight Champion","organization":"ICW","year":"2024"}]'::jsonb,
  '[{"year":"2020","title":"ICW Heavyweight Champion","organization":"ICW"}]'::jsonb,
  'seed', true
),
(
  'yuki-tanaka', 'Yuki Tanaka', 'Yuki Tanaka', NULL, NULL,
  'wrestling', 'Lightweight', 175, NULL, 82, 'Japan', 'Tokyo', 'Japan',
  'High-flying junior heavyweight open to international tours.',
  0, 0, 0, 'verified', false, 'open_to_offers', true, true,
  'yuki.tanaka@pwrscout.demo', NULL, 32, 55,
  ARRAY['high-flyer'],
  '[]'::jsonb, '[]'::jsonb, 'seed', true
)
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  ring_name = EXCLUDED.ring_name,
  updated_at = NOW();

-- Sample marketplace listing metadata stored on promotions is optional;
-- App uses JSON seed at src/data/seeds/marketplace.json for MVP.
