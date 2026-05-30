# PWR Scout

**The Global Talent Marketplace for Combat Sports**

Discover, compare, scout, recruit, negotiate, and manage professional relationships across the entire combat sports industry — not just MMA or wrestling, but every discipline and every role that powers the business.

> Transfermarkt × LinkedIn × IMDb — built for combat sports.

## Who It's For

| Segment | Examples |
|---------|----------|
| **Athletes** | Wrestlers, MMA fighters, boxers, kickboxers, Muay Thai, grapplers, BJJ |
| **Professionals** | Referees, announcers, commentators, managers, agents, coaches |
| **Organizations** | Promotions, gyms, academies, event companies |
| **Users** | Talent, recruiters, matchmakers, promoters, scouts, managers, organizers |

## Features

- Advanced global talent search
- Side-by-side talent comparison (Transfermarkt-style)
- AI Scout + AI Matchmaker
- Video library & YouTube integration
- Marketplace (opportunities & talent seeks)
- Messaging & Recruiter CRM
- Booking requests & Contract Center
- Verification system
- Talent / Recruiter / Admin dashboards
- Stripe subscriptions

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — runs with **seed data + live APIs** (no Supabase required for MVP).

## Public Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — marketplace positioning |
| `/discover` | Advanced talent search |
| `/athletes` | Athlete directory |
| `/athletes/[slug]` | Full talent profile |
| `/professionals` | Industry professionals |
| `/professionals/[slug]` | Professional profile |
| `/organizations` | Organization directory |
| `/organizations/[slug]` | Org profile (roster, needs, events) |
| `/compare` | Side-by-side comparison |
| `/marketplace` | Opportunities & listings |
| `/rankings` | Rankings by discipline |
| `/news` | Industry news |
| `/pricing` | Plans |
| `/about` | Mission & vision |
| `/contact` | Contact |

## Dashboard (role switcher: `?role=talent|recruiter|admin`)

**Talent:** Profile, videos, analytics, bookings, contracts, visibility, messages

**Recruiter:** Search, recruitment lists, saved candidates, compare, CRM, negotiations, contract center, messages

**Admin:** Users, verification, moderation, subscriptions, analytics

## Tech Stack

Next.js 15+ App Router · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · Supabase · Clerk · Stripe · OpenAI · React Query · Zustand · Vercel

## Data Architecture (MVP Rule)

| Source | Used for |
|--------|----------|
### MVP data stack (no single Tapology/Cagematch-style API)

| Layer | Sources |
|-------|---------|
| **MMA (~100 seed)** | TheSportsDB (UFC rosters) + optional MMA API (records/stats) |
| **Wrestling (~100 seed)** | Wikidata (SPARQL) + Wikipedia categories — *not* Cagematch (no public API) |
| **Videos** | YouTube Data API (or Piped fallback) |
| **Images** | Wikimedia Commons → Wikipedia thumb → TheSportsDB |
| **Promotions (~20 seed)** | Registry + TheSportsDB fighting leagues + Wikipedia |
| **Growth** | User-created profiles in Supabase (`USE_SUPABASE_TALENT=true`) |

Caps live in `src/lib/mvp/config.ts`. Overview: `GET /api/data-sources`.

**LinkedIn model:** seed ~100 MMA + ~100 wrestlers from free APIs, then wrestlers/fighters/recruiters add their own profiles.

| **Professionals** | Wikipedia categories + Wikidata |
| **Marketplace** | Generated from orgs + TheSportsDB events |

Integration layer: `src/lib/integrations/`

## Database

Run migrations in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_marketplace_platform.sql`
3. `supabase/migrations/003_pwr_scout_profiles.sql`

Optional seed: `supabase/seed.sql`

## API Routes

| Endpoint | Purpose |
|----------|---------|
| `GET /api/talent` | Unified athlete talent search |
| `GET /api/athletes` | Athlete search alias |
| `GET /api/professionals` | Referees, coaches, announcers, etc. |
| `GET /api/news` | Combat sports headlines |
| `POST /api/ai-scout` | AI scouting assistant |
| `POST /api/ai-matchmaker` | AI matchup recommendations |
| `POST /api/booking` | Booking requests → `booking_inquiries` when Supabase configured |
| `POST /api/messages` | Messaging (demo / Supabase-ready) |
| `POST /api/favorites` | Saved talent |
| `POST /api/stripe/checkout` | Subscriptions |
| `POST /api/webhooks/stripe` | Stripe events |
| `POST /api/webhooks/clerk` | User sync |

## Environment

See `.env.example` for:

- Clerk, Supabase, Stripe, OpenAI
- `NEXT_PUBLIC_YOUTUBE_API_KEY` / `YOUTUBE_API_KEY`
- `THESPORTSDB_API_KEY` (default `3` for dev)
- `MMA_API_BASE_URL` + `MMA_API_KEY` (optional)
- `USE_SUPABASE_TALENT=true` to merge DB athletes

## Deployment (Vercel)

1. Import repo → add env vars
2. Set `NEXT_PUBLIC_APP_URL` to production domain
3. Configure Clerk + Stripe webhooks
4. Run Supabase migrations on production project

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/(marketing)/       # Public marketplace pages
├── app/(dashboard)/       # Talent / Recruiter / Admin dashboards
├── app/api/               # REST API
├── components/            # UI, talent, compare, marketplace, AI
├── lib/data/              # *-discovery.ts modules (API-only catalogs)
├── data/mock.ts           # Re-exports talent repository
├── lib/data/              # talent-repository, wikipedia, youtube, *-discovery
├── lib/integrations/      # TheSportsDB, MMA API adapters
├── lib/supabase/          # DB helpers (booking inquiries, optional talent read)
├── stores/                # Zustand (favorites, compare, recruitment)
└── types/                 # TypeScript models
supabase/migrations/       # PostgreSQL schema + seed.sql
```

## License

Proprietary © PWR Scout
