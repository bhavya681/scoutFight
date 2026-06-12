import { unstable_cache } from "next/cache";
import { MVP_SEED_LIMITS, MVP_CACHE_REVALIDATE } from "@/lib/mvp/config";
import { discoverMmaFightersFromSportsDb } from "@/lib/integrations/the-sports-db";
import { discoverCricketPlayersFromSportsDb } from "@/lib/integrations/cricket-api";
import {
  fetchWikipediaCategoryAthletes,
  WRESTLING_WIKIPEDIA_CATEGORIES,
  OTHER_COMBAT_SPORT_CATEGORIES,
  CRICKET_WIKIPEDIA_CATEGORIES,
} from "@/lib/integrations/wikipedia-discovery";
import {
  fetchWikidataWrestlers,
  type WikidataDiscoveredAthlete,
} from "@/lib/integrations/wikidata";
import type { SportsDbDiscoveredFighter } from "@/lib/integrations/the-sports-db";
import type { WikipediaDiscoveredAthlete } from "@/lib/integrations/wikipedia-discovery";
import type { SportType } from "@/types";

export type AthleteDiscoveryEntry =
  | (SportsDbDiscoveredFighter & { wikipediaTitle?: string })
  | (WikipediaDiscoveredAthlete & { displayName?: string })
  | WikidataDiscoveredAthlete;

export interface AthleteDiscoveryIndex {
  entries: AthleteDiscoveryEntry[];
  mmaCount: number;
  wrestlingCount: number;
  cricketCount: number;
  sportCounts: Partial<Record<SportType, number>>;
  fetchedAt: number;
}

function mergeBySlug(entries: AthleteDiscoveryEntry[]): AthleteDiscoveryEntry[] {
  const bySlug = new Map<string, AthleteDiscoveryEntry>();

  for (const entry of entries) {
    const slug = entry.slug;
    const existing = bySlug.get(slug);

    if (!existing) {
      bySlug.set(slug, entry);
      continue;
    }

    if (entry.source === "the_sports_db" && existing.source !== "the_sports_db") {
      const wikiTitle =
        existing.source === "wikipedia"
          ? existing.wikipediaTitle
          : existing.source === "wikidata"
            ? existing.wikipediaTitle
            : undefined;
      bySlug.set(slug, { ...entry, wikipediaTitle: wikiTitle ?? entry.wikipediaTitle });
    } else if (entry.source === "wikidata" && existing.source === "wikipedia") {
      bySlug.set(slug, {
        ...entry,
        wikipediaTitle: entry.wikipediaTitle ?? existing.wikipediaTitle,
      });
    }
  }

  return [...bySlug.values()];
}

function countBySport(entries: AthleteDiscoveryEntry[]): Partial<Record<SportType, number>> {
  const counts: Partial<Record<SportType, number>> = {};
  for (const e of entries) {
    counts[e.sport] = (counts[e.sport] ?? 0) + 1;
  }
  return counts;
}

const MMA_WIKIPEDIA_FALLBACK = [
  { category: "Ultimate_Fighting_Championship_champions", limit: 60 },
  { category: "Ultimate_Fighting_Championship_male_fighters", limit: 50 },
] as const;

async function discoverMmaSeed(limit: number): Promise<AthleteDiscoveryEntry[]> {
  const sportsDb: AthleteDiscoveryEntry[] = await discoverMmaFightersFromSportsDb(
    limit,
    ["UFC"]
  );

  if (sportsDb.length >= 30) return sportsDb.slice(0, limit);

  const wikiBatches = await Promise.all(
    MMA_WIKIPEDIA_FALLBACK.map((c) =>
      fetchWikipediaCategoryAthletes(c.category, "mma", c.limit)
    )
  );
  const wiki = wikiBatches.flat().map(
    (w): AthleteDiscoveryEntry => ({
      ...w,
      displayName:
        "displayName" in w && w.displayName
          ? w.displayName
          : w.wikipediaTitle.replace(/_/g, " "),
    })
  );
  return mergeBySlug([...sportsDb, ...wiki]).slice(0, limit);
}

async function discoverWrestlingSeed(limit: number): Promise<AthleteDiscoveryEntry[]> {
  const wikidataLimit = Math.floor(limit / 2);
  const [wikidata, ...wikiBatches] = await Promise.all([
    fetchWikidataWrestlers(wikidataLimit),
    ...WRESTLING_WIKIPEDIA_CATEGORIES.map((c) =>
      fetchWikipediaCategoryAthletes(c.category, "wrestling", c.limit, c.gender)
    ),
  ]);

  const wiki = wikiBatches.flat().map(
    (w): AthleteDiscoveryEntry => ({
      ...w,
      displayName: w.displayName ?? w.wikipediaTitle.replace(/_/g, " "),
    })
  );

  return mergeBySlug([...wikidata, ...wiki]).slice(0, limit);
}

async function discoverCricketSeed(limit: number): Promise<AthleteDiscoveryEntry[]> {
  const sportsDb: AthleteDiscoveryEntry[] = await discoverCricketPlayersFromSportsDb(limit);

  if (sportsDb.length >= 25) return sportsDb.slice(0, limit);

  const wikiBatches = await Promise.all(
    CRICKET_WIKIPEDIA_CATEGORIES.map((c) =>
      fetchWikipediaCategoryAthletes(c.category, "cricket", c.limit)
    )
  );
  const wiki = wikiBatches.flat().map(
    (w): AthleteDiscoveryEntry => ({
      ...w,
      displayName: w.wikipediaTitle.replace(/_/g, " "),
    })
  );

  return mergeBySlug([...sportsDb, ...wiki]).slice(0, limit);
}

async function discoverOtherCombatSports(): Promise<AthleteDiscoveryEntry[]> {
  const batches = await Promise.all(
    OTHER_COMBAT_SPORT_CATEGORIES.map((c) =>
      fetchWikipediaCategoryAthletes(c.category, c.sport, c.limit)
    )
  );

  return mergeBySlug(
    batches.flat().map(
      (w): AthleteDiscoveryEntry => ({
        ...w,
        displayName: w.wikipediaTitle.replace(/_/g, " "),
      })
    )
  );
}

async function fetchDiscoveryIndex(): Promise<AthleteDiscoveryIndex> {
  const [mmaResult, wrestlingResult, cricketResult, otherResult] = await Promise.allSettled([
    discoverMmaSeed(MVP_SEED_LIMITS.mmaFighters),
    discoverWrestlingSeed(MVP_SEED_LIMITS.wrestlers),
    discoverCricketSeed(MVP_SEED_LIMITS.cricketers),
    discoverOtherCombatSports(),
  ]);

  const mma = mmaResult.status === "fulfilled" ? mmaResult.value : [];
  const wrestling = wrestlingResult.status === "fulfilled" ? wrestlingResult.value : [];
  const cricket = cricketResult.status === "fulfilled" ? cricketResult.value : [];
  const other = otherResult.status === "fulfilled" ? otherResult.value : [];

  if (mmaResult.status === "rejected") console.warn("[ScoutFight] MMA seed failed", mmaResult.reason);
  if (wrestlingResult.status === "rejected")
    console.warn("[ScoutFight] Wrestling seed failed", wrestlingResult.reason);
  if (cricketResult.status === "rejected")
    console.warn("[ScoutFight] Cricket seed failed", cricketResult.reason);

  const entries = mergeBySlug([...mma, ...wrestling, ...cricket, ...other]);

  return {
    entries,
    mmaCount: mma.length,
    wrestlingCount: wrestling.length,
    cricketCount: cricket.length,
    sportCounts: countBySport(entries),
    fetchedAt: Date.now(),
  };
}

const getCachedDiscoveryIndex = unstable_cache(
  fetchDiscoveryIndex,
  ["scoutfight-mvp-athlete-index-v7"],
  { revalidate: MVP_CACHE_REVALIDATE, tags: ["athletes"] }
);

export async function getAthleteDiscoveryIndex(): Promise<AthleteDiscoveryIndex> {
  return getCachedDiscoveryIndex();
}

export async function findDiscoveryEntryBySlug(
  slug: string
): Promise<AthleteDiscoveryEntry | null> {
  const { entries } = await getAthleteDiscoveryIndex();
  return entries.find((e) => e.slug === slug) ?? null;
}

export function entrySport(entry: AthleteDiscoveryEntry): SportType {
  return entry.sport;
}

export function entryDisplayName(entry: AthleteDiscoveryEntry): string {
  if (entry.source === "wikidata") return entry.displayName;
  if ("displayName" in entry && entry.displayName) return entry.displayName;
  if (entry.source === "wikipedia") {
    return entry.displayName ?? entry.wikipediaTitle.replace(/_/g, " ");
  }
  if ("wikipediaTitle" in entry && entry.wikipediaTitle)
    return entry.wikipediaTitle.replace(/_/g, " ");
  return entry.slug.replace(/-/g, " ");
}

export function entryWikipediaTitle(entry: AthleteDiscoveryEntry): string {
  if (entry.source === "wikipedia") return entry.wikipediaTitle;
  if (entry.source === "wikidata" && entry.wikipediaTitle) return entry.wikipediaTitle;
  if ("wikipediaTitle" in entry && entry.wikipediaTitle) return entry.wikipediaTitle;
  return entryDisplayName(entry).replace(/ /g, "_");
}

export function entryGender(
  entry: AthleteDiscoveryEntry
): "male" | "female" | undefined {
  if ("gender" in entry && entry.gender) return entry.gender;
  if (entry.source === "the_sports_db") return entry.gender;
  if (entry.source === "wikipedia") return entry.gender;
  return undefined;
}
