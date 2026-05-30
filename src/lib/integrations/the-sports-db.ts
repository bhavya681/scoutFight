import { slugify } from "@/lib/utils";
import type { SportType } from "@/types";
import type { ExternalFighterStats } from "./types";

const DEFAULT_KEY = "3";

export const SPORTSDB_FIGHTING_LEAGUES = ["UFC", "Bellator MMA", "PFL"] as const;

interface SportsDbPlayer {
  idPlayer?: string;
  strPlayer?: string;
  strTeam?: string;
  strSport?: string;
  strNationality?: string;
  dateBorn?: string;
  strHeight?: string;
  strWeight?: string;
  intFormedYear?: string;
  strThumb?: string;
  strDescriptionEN?: string;
}

function parseHeightToCm(height?: string): number | undefined {
  if (!height) return undefined;
  const m = height.match(/(\d+)\s*(?:cm|CM)/);
  if (m) return parseInt(m[1], 10);
  const ft = height.match(/(\d+)\s*ft/i);
  const inch = height.match(/(\d+)\s*in/i);
  if (ft) {
    const inches = (parseInt(ft[1], 10) * 12) + (inch ? parseInt(inch[1], 10) : 0);
    return Math.round(inches * 2.54);
  }
  const num = parseInt(height.replace(/\D/g, ""), 10);
  return num > 50 && num < 250 ? num : undefined;
}

function parseWeightToKg(weight?: string): number | undefined {
  if (!weight) return undefined;
  const kg = weight.match(/(\d+(?:\.\d+)?)\s*kg/i);
  if (kg) return Math.round(parseFloat(kg[1]));
  const lb = weight.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs)/i);
  if (lb) return Math.round(parseFloat(lb[1]) * 0.453592);
  return undefined;
}

export interface SportsDbLeague {
  id: string;
  name: string;
  sport?: string;
  country?: string;
  badgeUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  description?: string;
}

interface SportsDbLeagueRow {
  idLeague?: string;
  strLeague?: string;
  strSport?: string;
  strCountry?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strWebsite?: string;
  strDescriptionEN?: string;
}

function mapLeague(row: SportsDbLeagueRow): SportsDbLeague | null {
  if (!row.idLeague || !row.strLeague) return null;
  return {
    id: row.idLeague,
    name: row.strLeague,
    sport: row.strSport,
    country: row.strCountry,
    badgeUrl: row.strBadge || undefined,
    logoUrl: row.strLogo || row.strBadge || undefined,
    bannerUrl: row.strBanner || undefined,
    website: row.strWebsite || undefined,
    description: row.strDescriptionEN?.slice(0, 500),
  };
}

/** Search fighting/MMA leagues by name (badges/logos when available) */
export async function fetchTheSportsDbLeague(
  searchName: string
): Promise<SportsDbLeague | null> {
  const key = process.env.THESPORTSDB_API_KEY ?? DEFAULT_KEY;
  const query = encodeURIComponent(searchName);
  const urls = [
    `https://www.thesportsdb.com/api/v1/json/${key}/search_all_leagues.php?l=${query}`,
    `https://www.thesportsdb.com/api/v1/json/${key}/search_all_leagues.php?s=Fighting`,
  ];

  const needle = searchName.toLowerCase();

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;
      const data = (await res.json()) as { countries?: SportsDbLeagueRow[] };
      const rows = data.countries ?? [];
      const match =
        rows.find((r) => r.strLeague?.toLowerCase() === needle) ??
        rows.find((r) => r.strLeague?.toLowerCase().includes(needle)) ??
        rows.find((r) => needle.includes(r.strLeague?.toLowerCase() ?? ""));
      if (match) return mapLeague(match);
    } catch {
      continue;
    }
  }
  return null;
}

function mapPlayerStats(player: SportsDbPlayer): ExternalFighterStats {
  return {
    source: "the_sports_db",
    externalId: player.idPlayer,
    displayName: player.strPlayer,
    heightCm: parseHeightToCm(player.strHeight),
    weightKg: parseWeightToKg(player.strWeight),
    nationality: player.strNationality,
    sport: player.strSport,
    dateBorn: player.dateBorn,
    thumbUrl: player.strThumb,
    popularityScore: player.intFormedYear
      ? Math.min(100, 40 + parseInt(player.intFormedYear, 10) % 50)
      : undefined,
  };
}

export interface SportsDbDiscoveredFighter {
  source: "the_sports_db";
  externalId: string;
  slug: string;
  displayName: string;
  sport: SportType;
  weightClass?: string;
  nationality: string;
  avatarUrl?: string;
  league: string;
  teamName?: string;
  gender?: "male" | "female";
}

function parseWeightClassFromTeam(teamName?: string): string | undefined {
  if (!teamName) return undefined;
  const m = teamName.match(
    /(?:UFC|Bellator|PFL)\s+(.+?)(?:\s+Women)?$/i
  );
  return m?.[1]?.trim();
}

function inferGenderFromTeam(teamName?: string): "male" | "female" | undefined {
  if (!teamName) return undefined;
  if (/women|female/i.test(teamName)) return "female";
  if (/(?:UFC|Bellator|PFL)\s+/i.test(teamName)) return "male";
  return undefined;
}

function inferSportFromLeague(league: string): SportType {
  const l = league.toLowerCase();
  if (l.includes("ufc") || l.includes("bellator") || l.includes("pfl")) return "mma";
  if (l.includes("boxing")) return "boxing";
  if (l.includes("wwe") || l.includes("aew")) return "wrestling";
  return "mma";
}

async function sportsDbFetch<T>(path: string): Promise<T | null> {
  const key = process.env.THESPORTSDB_API_KEY ?? DEFAULT_KEY;
  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${key}/${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchTheSportsDbTeamsByLeague(
  leagueName: string
): Promise<{ idTeam: string; strTeam: string; strLeague?: string }[]> {
  const data = await sportsDbFetch<{ teams?: { idTeam?: string; strTeam?: string; strLeague?: string; strSport?: string }[] }>(
    `search_all_teams.php?l=${encodeURIComponent(leagueName)}`
  );
  return (data?.teams ?? [])
    .filter((t) => t.idTeam && t.strTeam && t.strSport === "Fighting")
    .map((t) => ({
      idTeam: t.idTeam!,
      strTeam: t.strTeam!,
      strLeague: t.strLeague,
    }));
}

export async function fetchTheSportsDbTeamRoster(
  teamId: string
): Promise<SportsDbPlayer[]> {
  const data = await sportsDbFetch<{ player?: SportsDbPlayer[] }>(
    `lookup_all_players.php?id=${teamId}`
  );
  return data?.player ?? [];
}

export async function searchTheSportsDbFightingPlayers(
  searchName: string
): Promise<SportsDbPlayer[]> {
  const data = await sportsDbFetch<{ player?: SportsDbPlayer[] }>(
    `searchplayers.php?p=${encodeURIComponent(searchName)}`
  );
  return (data?.player ?? []).filter((p) => p.strSport === "Fighting");
}

/** MVP MMA seed — UFC rosters via TheSportsDB, capped (default 100 fighters) */
export async function discoverMmaFightersFromSportsDb(
  maxTotal = 100,
  leagues: readonly string[] = ["UFC"]
): Promise<SportsDbDiscoveredFighter[]> {
  const byId = new Map<string, SportsDbDiscoveredFighter>();

  for (const league of leagues) {
    if (byId.size >= maxTotal) break;
    const teams = await fetchTheSportsDbTeamsByLeague(league);
    const weightTeams = teams.filter((t) =>
      /heavy|light|middle|welter|feather|bantam|fly/i.test(t.strTeam)
    );

    for (const team of weightTeams) {
      if (byId.size >= maxTotal) break;
      const roster = await fetchTheSportsDbTeamRoster(team.idTeam);
      for (const player of roster) {
        if (byId.size >= maxTotal) break;
        if (!player.idPlayer || !player.strPlayer) continue;
        const entry: SportsDbDiscoveredFighter = {
          source: "the_sports_db",
          externalId: player.idPlayer,
          slug: slugify(player.strPlayer),
          displayName: player.strPlayer,
          sport: "mma",
          weightClass: parseWeightClassFromTeam(team.strTeam),
          nationality: player.strNationality ?? "International",
          avatarUrl: player.strThumb || undefined,
          league,
          teamName: team.strTeam,
          gender: inferGenderFromTeam(team.strTeam),
        };
        byId.set(player.idPlayer, entry);
      }
    }
  }

  return [...byId.values()].slice(0, maxTotal);
}

/** @deprecated Use discoverMmaFightersFromSportsDb */
export async function discoverFightersFromSportsDbLeagues(
  leagues: readonly string[] = SPORTSDB_FIGHTING_LEAGUES,
  maxPerTeam = 12
): Promise<SportsDbDiscoveredFighter[]> {
  return discoverMmaFightersFromSportsDb(100, leagues.slice(0, 2));
}

export interface SportsDbDiscoveredLeague {
  slug: string;
  name: string;
  sport: string;
  logoUrl?: string;
  country?: string;
}

export interface SportsDbEvent {
  id: string;
  name: string;
  date?: string;
  location?: string;
  description?: string;
  leagueId?: string;
  leagueName?: string;
}

export async function fetchTheSportsDbLeagueEvents(
  leagueId: string,
  limit = 8
): Promise<SportsDbEvent[]> {
  const data = await sportsDbFetch<{
    events?: {
      idEvent?: string;
      strEvent?: string;
      dateEvent?: string;
      strCity?: string;
      strCountry?: string;
      strDescriptionEN?: string;
      idLeague?: string;
      strLeague?: string;
    }[];
  }>(`eventspastleague.php?id=${leagueId}`);

  return (data?.events ?? []).slice(0, limit).map((e) => ({
    id: e.idEvent ?? "",
    name: e.strEvent ?? "Event",
    date: e.dateEvent,
    location: [e.strCity, e.strCountry].filter(Boolean).join(", ") || undefined,
    description: e.strDescriptionEN?.slice(0, 600),
    leagueId: e.idLeague,
    leagueName: e.strLeague,
  }));
}

/** Known league IDs for event discovery */
export const SPORTSDB_LEAGUE_IDS: Record<string, string> = {
  ufc: "4443",
  bellator: "4460",
  pfl: "5430",
};

/** Fighting/MMA promotions for MVP org seed */
export async function discoverFightingLeagues(
  limit = 16
): Promise<SportsDbDiscoveredLeague[]> {
  const key = process.env.THESPORTSDB_API_KEY ?? DEFAULT_KEY;
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${key}/search_all_leagues.php?s=Fighting`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      countries?: { idLeague?: string; strLeague?: string; strSport?: string; strBadge?: string; strCountry?: string }[];
    };
    const rows = data.countries ?? [];
    const seen = new Set<string>();
    const out: SportsDbDiscoveredLeague[] = [];

    for (const row of rows) {
      if (!row.strLeague || !row.idLeague) continue;
      const slug = slugify(row.strLeague);
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        name: row.strLeague,
        sport: row.strSport ?? "Fighting",
        logoUrl: row.strBadge,
        country: row.strCountry,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function fetchTheSportsDbPlayer(
  searchName: string
): Promise<ExternalFighterStats | null> {
  const fighting = await searchTheSportsDbFightingPlayers(searchName);
  const player = fighting[0];
  if (!player?.strPlayer) return null;
  return mapPlayerStats(player);
}

export async function fetchTheSportsDbPlayerById(
  playerId: string
): Promise<ExternalFighterStats | null> {
  const data = await sportsDbFetch<{ players?: SportsDbPlayer[] }>(
    `lookupplayer.php?id=${playerId}`
  );
  const player = data?.players?.[0];
  if (!player?.strPlayer || player.strSport !== "Fighting") return null;
  return mapPlayerStats(player);
}
