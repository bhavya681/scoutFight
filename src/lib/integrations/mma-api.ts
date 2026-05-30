import type { ExternalFighterStats } from "./types";
import { fetchTheSportsDbPlayer } from "./the-sports-db";

interface MmaApiFighter {
  id?: string;
  name?: string;
  height_cm?: number;
  weight_kg?: number;
  nationality?: string;
  wins?: number;
  losses?: number;
  draws?: number;
}

/**
 * MMA stats enrichment.
 * Uses optional MMA_API_BASE_URL when configured; otherwise falls back to TheSportsDB.
 */
export async function fetchMmaFighterStats(
  searchName: string
): Promise<ExternalFighterStats | null> {
  const base = process.env.MMA_API_BASE_URL?.replace(/\/$/, "");

  if (base && process.env.MMA_API_KEY) {
    try {
      const url = `${base}/fighters/search?q=${encodeURIComponent(searchName)}`;
      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.MMA_API_KEY}`,
        },
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const data = (await res.json()) as { fighter?: MmaApiFighter; data?: MmaApiFighter[] };
        const fighter = data.fighter ?? data.data?.[0];
        if (fighter?.name) {
          return {
            source: "mma_api",
            externalId: fighter.id,
            displayName: fighter.name,
            heightCm: fighter.height_cm,
            weightKg: fighter.weight_kg,
            nationality: fighter.nationality,
            record:
              fighter.wins != null
                ? {
                    wins: fighter.wins,
                    losses: fighter.losses ?? 0,
                    draws: fighter.draws ?? 0,
                  }
                : undefined,
          };
        }
      }
    } catch {
      /* fall through */
    }
  }

  const sportsDb = await fetchTheSportsDbPlayer(searchName);
  if (sportsDb) return { ...sportsDb, source: "mma_api" };
  return null;
}
