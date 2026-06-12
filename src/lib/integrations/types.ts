import type { CricketPlayerStats } from "@/types";

/** Normalized cricket player stats from TheSportsDB (league hiring) */
export interface ExternalCricketStats {
  source: "the_sports_db";
  externalId?: string;
  displayName?: string;
  nationality?: string;
  dateBorn?: string;
  thumbUrl?: string;
  heightCm?: number;
  cricket: CricketPlayerStats;
}

/** Normalized stats from external combat sports APIs */
export interface ExternalFighterStats {
  source: "the_sports_db" | "mma_api";
  externalId?: string;
  displayName?: string;
  heightCm?: number;
  weightKg?: number;
  nationality?: string;
  record?: { wins: number; losses: number; draws: number };
  dateBorn?: string;
  sport?: string;
  thumbUrl?: string;
  popularityScore?: number;
}
