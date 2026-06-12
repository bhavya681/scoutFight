import { slugify } from "@/lib/utils";
import type { CricketPlayerStats } from "@/types";
import type { ExternalCricketStats } from "./types";
import type { SportsDbDiscoveredFighter } from "./the-sports-db";

const DEFAULT_KEY = "3";

/** Franchise T20 leagues for league hiring / scouting */
export const CRICKET_HIRING_LEAGUES = [
  "Indian Premier League",
  "Big Bash League",
  "Pakistan Super League",
  "Caribbean Premier League",
  "The Hundred",
] as const;

interface SportsDbCricketPlayer {
  idPlayer?: string;
  strPlayer?: string;
  strTeam?: string;
  strSport?: string;
  strNationality?: string;
  strPosition?: string;
  strSide?: string;
  strStatus?: string;
  dateBorn?: string;
  strHeight?: string;
  strThumb?: string;
  strDescriptionEN?: string;
  strGender?: string;
}

interface SportsDbCricketTeam {
  idTeam?: string;
  strTeam?: string;
  strLeague?: string;
  strSport?: string;
  strBadge?: string;
  strLogo?: string;
  strCountry?: string;
}

function parseHeightToCm(height?: string): number | undefined {
  if (!height) return undefined;
  const m = height.match(/(\d+)\s*(?:cm|CM)/);
  if (m) return parseInt(m[1], 10);
  const ft = height.match(/(\d+)\s*ft/i);
  const inch = height.match(/(\d+)\s*in/i);
  if (ft) {
    const inches = parseInt(ft[1], 10) * 12 + (inch ? parseInt(inch[1], 10) : 0);
    return Math.round(inches * 2.54);
  }
  return undefined;
}

function parseBattingHand(side?: string): "left" | "right" | undefined {
  if (!side) return undefined;
  const s = side.toLowerCase();
  if (s.includes("left")) return "left";
  if (s.includes("right")) return "right";
  return undefined;
}

function parseStatsFromBio(bio?: string): Partial<CricketPlayerStats> {
  if (!bio) return {};
  const out: Partial<CricketPlayerStats> = {};

  const testRank = bio.match(/(\d+)(?:st|nd|rd|th)\s+in\s+the\s+ICC\s+Test/i);
  const odiRank = bio.match(/(\d+)(?:st|nd|rd|th)\s+in\s+the\s+ICC\s+ODI/i);
  const t20Rank = bio.match(/(\d+)(?:st|nd|rd|th)\s+in\s+the\s+ICC\s+T20/i);
  if (testRank) out.iccTestRanking = parseInt(testRank[1], 10);
  if (odiRank) out.iccOdiRanking = parseInt(odiRank[1], 10);
  if (t20Rank) out.iccT20Ranking = parseInt(t20Rank[1], 10);

  const runs = bio.match(/(\d{1,3}(?:,\d{3})*)\s+runs/i);
  if (runs) out.careerRuns = parseInt(runs[1].replace(/,/g, ""), 10);

  const wickets = bio.match(/(\d+)\s+wickets/i);
  if (wickets) out.careerWickets = parseInt(wickets[1], 10);

  const bowling = bio.match(
    /(right-arm|left-arm)\s+(?:fast|medium|off|leg)[\w\s-]*/i
  );
  if (bowling) out.bowlingStyle = bowling[0].trim();

  return out;
}

function mapCricketPlayer(
  player: SportsDbCricketPlayer,
  league: string,
  teamName?: string
): ExternalCricketStats {
  const bioStats = parseStatsFromBio(player.strDescriptionEN);
  const cricket: CricketPlayerStats = {
    role: player.strPosition || undefined,
    battingHand: parseBattingHand(player.strSide),
    league,
    team: teamName ?? player.strTeam,
    status: player.strStatus || undefined,
    ...bioStats,
  };

  return {
    source: "the_sports_db",
    externalId: player.idPlayer,
    displayName: player.strPlayer,
    nationality: player.strNationality,
    dateBorn: player.dateBorn,
    thumbUrl: player.strThumb,
    heightCm: parseHeightToCm(player.strHeight),
    cricket,
  };
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

export interface CricketLeagueInfo {
  id: string;
  name: string;
  country?: string;
  logoUrl?: string;
  sport: string;
}

export async function fetchCricketTeamsByLeague(
  leagueName: string
): Promise<SportsDbCricketTeam[]> {
  const data = await sportsDbFetch<{ teams?: SportsDbCricketTeam[] }>(
    `search_all_teams.php?l=${encodeURIComponent(leagueName)}`
  );
  return (data?.teams ?? []).filter((t) => t.strSport === "Cricket" && t.idTeam && t.strTeam);
}

export async function fetchCricketTeamRoster(teamId: string): Promise<SportsDbCricketPlayer[]> {
  const data = await sportsDbFetch<{ player?: SportsDbCricketPlayer[] }>(
    `lookup_all_players.php?id=${teamId}`
  );
  return (data?.player ?? []).filter((p) => p.strSport === "Cricket");
}

export async function discoverCricketPlayersFromSportsDb(
  maxTotal = 80,
  leagues: readonly string[] = CRICKET_HIRING_LEAGUES
): Promise<SportsDbDiscoveredFighter[]> {
  const byId = new Map<string, SportsDbDiscoveredFighter>();

  for (const league of leagues) {
    if (byId.size >= maxTotal) break;
    const teams = await fetchCricketTeamsByLeague(league);

    for (const team of teams) {
      if (byId.size >= maxTotal) break;
      const roster = await fetchCricketTeamRoster(team.idTeam!);

      for (const player of roster) {
        if (byId.size >= maxTotal) break;
        if (!player.idPlayer || !player.strPlayer) continue;

        const gender =
          player.strGender?.toLowerCase() === "female"
            ? "female"
            : player.strGender?.toLowerCase() === "male"
              ? "male"
              : undefined;

        byId.set(player.idPlayer, {
          source: "the_sports_db",
          externalId: player.idPlayer,
          slug: slugify(player.strPlayer),
          displayName: player.strPlayer,
          sport: "cricket",
          weightClass: player.strPosition || undefined,
          nationality: player.strNationality ?? "International",
          avatarUrl: player.strThumb || undefined,
          league,
          teamName: team.strTeam,
          gender,
        });
      }
    }
  }

  return [...byId.values()].slice(0, maxTotal);
}

export async function searchCricketPlayers(searchName: string): Promise<SportsDbCricketPlayer[]> {
  const data = await sportsDbFetch<{ player?: SportsDbCricketPlayer[] }>(
    `searchplayers.php?p=${encodeURIComponent(searchName)}`
  );
  return (data?.player ?? []).filter((p) => p.strSport === "Cricket");
}

export async function fetchCricketPlayerById(
  playerId: string
): Promise<ExternalCricketStats | null> {
  const endpoints = [
    `lookupplayer.php?id=${playerId}`,
    `searchplayers.php?p=${playerId}`,
  ];

  for (const path of endpoints) {
    const data = await sportsDbFetch<{
      players?: SportsDbCricketPlayer[];
      player?: SportsDbCricketPlayer[];
    }>(path);
    const player =
      data?.players?.find((p) => p.idPlayer === playerId) ??
      data?.player?.find((p) => p.idPlayer === playerId) ??
      data?.players?.[0] ??
      data?.player?.[0];
    if (player?.strPlayer && player.strSport === "Cricket") {
      return mapCricketPlayer(player, player.strTeam ?? "Cricket", player.strTeam);
    }
  }

  return null;
}

export async function fetchCricketPlayerByName(
  searchName: string
): Promise<ExternalCricketStats | null> {
  const players = await searchCricketPlayers(searchName);
  const player = players[0];
  if (!player?.strPlayer) return null;
  return mapCricketPlayer(player, player.strTeam ?? "Cricket", player.strTeam);
}

export async function fetchCricketLeagues(limit = 12): Promise<CricketLeagueInfo[]> {
  const key = process.env.THESPORTSDB_API_KEY ?? DEFAULT_KEY;
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${key}/search_all_leagues.php?s=Cricket`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      countries?: {
        idLeague?: string;
        strLeague?: string;
        strSport?: string;
        strBadge?: string;
        strCountry?: string;
      }[];
    };

    const seen = new Set<string>();
    const out: CricketLeagueInfo[] = [];

    for (const row of data.countries ?? []) {
      if (!row.idLeague || !row.strLeague) continue;
      const name = row.strLeague;
      if (seen.has(name)) continue;
      seen.add(name);
      out.push({
        id: row.idLeague,
        name,
        country: row.strCountry,
        logoUrl: row.strBadge,
        sport: row.strSport ?? "Cricket",
      });
      if (out.length >= limit) break;
    }

    return out;
  } catch {
    return [];
  }
}

async function discoverCricketStatsFromRosters(
  maxTotal: number,
  leagues: readonly string[]
): Promise<ExternalCricketStats[]> {
  const out: ExternalCricketStats[] = [];
  const seen = new Set<string>();

  for (const league of leagues) {
    if (out.length >= maxTotal) break;
    const teams = await fetchCricketTeamsByLeague(league);

    for (const team of teams) {
      if (out.length >= maxTotal) break;
      const roster = await fetchCricketTeamRoster(team.idTeam!);

      for (const player of roster) {
        if (out.length >= maxTotal) break;
        if (!player.idPlayer || !player.strPlayer || seen.has(player.idPlayer)) continue;
        seen.add(player.idPlayer);
        out.push(mapCricketPlayer(player, league, team.strTeam));
      }
    }
  }

  return out;
}

/** List cricket players for league hiring API — optional filters */
export async function queryCricketPlayers(options: {
  q?: string;
  league?: string;
  role?: string;
  limit?: number;
}): Promise<ExternalCricketStats[]> {
  const limit = Math.min(options.limit ?? 24, 100);

  if (options.q?.trim()) {
    const players = await searchCricketPlayers(options.q.trim());
    return players
      .slice(0, limit)
      .map((p) => mapCricketPlayer(p, p.strTeam ?? "Cricket", p.strTeam))
      .filter((p) => {
        if (options.role && p.cricket.role?.toLowerCase() !== options.role.toLowerCase()) {
          return false;
        }
        if (options.league && !p.cricket.league?.toLowerCase().includes(options.league.toLowerCase())) {
          return false;
        }
        return true;
      });
  }

  const leagues = options.league
    ? CRICKET_HIRING_LEAGUES.filter((l) =>
        l.toLowerCase().includes(options.league!.toLowerCase())
      )
    : CRICKET_HIRING_LEAGUES;

  return discoverCricketStatsFromRosters(limit, leagues).then((stats) =>
    stats.filter((s) => {
      if (options.role && s.cricket.role?.toLowerCase() !== options.role.toLowerCase()) {
        return false;
      }
      return true;
    })
  );
}
