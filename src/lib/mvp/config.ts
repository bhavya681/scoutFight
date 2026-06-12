/**
 * ScoutFight MVP data plan — multiple free APIs, capped seed roster.
 * User-submitted profiles (Supabase) grow the database over time (LinkedIn model).
 */

export const MVP_SEED_LIMITS = {
  mmaFighters: 100,
  wrestlers: 120,
  cricketers: 80,
  promotions: 20,
} as const;

/** Revalidate cached API seed rosters (seconds) */
export const MVP_CACHE_REVALIDATE = 3600;

export const MVP_DATA_STACK = {
  mma: {
    primary: "the_sports_db",
    stats: "mma_api",
    note: "Fighter names, photos, events, leagues, records when MMA_API_* is set",
  },
  wrestling: {
    primary: "wikidata",
    secondary: "wikipedia",
    note: "No Cagematch API — seed from Wikidata + Wikipedia; users add match history",
  },
  cricket: {
    primary: "the_sports_db",
    secondary: "wikipedia",
    note: "IPL, BBL, PSL and franchise rosters — role, league, and bio stats for hiring",
    api: "/api/cricket/players",
  },
  videos: {
    primary: "youtube",
    note: "Highlights via YouTube name search (InnerTube); optional YOUTUBE_API_KEY for Google API",
  },
  images: {
    primary: "wikimedia_commons",
    fallback: "wikipedia",
    note: "Free fighter/wrestler photos when profile has no image",
  },
  organizations: {
    seed: "wikipedia_the_sports_db",
    growth: "user_created",
    note: "Seed ~20 promotions from APIs; recruiters/promotions add verified pages",
  },
  userProfiles: {
    storage: "supabase",
    envFlag: "USE_SUPABASE_TALENT",
    note: "Wrestlers & fighters create own profiles — primary long-term asset",
  },
  professionals: {
    primary: "wikipedia_wikidata",
    note: "Combat sports officials & media — no static JSON",
  },
  marketplace: {
    primary: "generated_from_orgs_events",
    note: "Listings from organizations + TheSportsDB events — no static JSON",
  },
} as const;
