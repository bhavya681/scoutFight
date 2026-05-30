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
