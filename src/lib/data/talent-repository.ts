import { unstable_cache } from "next/cache";
import type {
  TalentProfile,
  VideoItem,
  NewsArticle,
  SportType,
} from "@/types";
import { fetchWikipediaSummary, fetchWikipediaPageMetaBatch } from "./wikipedia";
import { fetchYouTubeVideos } from "./youtube";
import { fetchCombatSportsNews } from "./news-feed";
import {
  getAthleteDiscoveryIndex,
  findDiscoveryEntryBySlug,
  entryDisplayName,
  entrySport,
  entryGender,
  entryWikipediaTitle,
  type AthleteDiscoveryEntry,
} from "./athlete-discovery";
import {
  fetchTheSportsDbPlayerById,
  fetchTheSportsDbPlayer,
  searchTheSportsDbFightingPlayers,
} from "@/lib/integrations/the-sports-db";
import { fetchWikipediaSearchTitle } from "@/lib/integrations/wikipedia-discovery";
import { talentMatchesGender } from "@/lib/utils/gender-match";
import { fetchMmaFighterStats } from "@/lib/integrations/mma-api";
import { fetchCommonsImageUrl } from "@/lib/integrations/wikimedia-commons";
import type { ExternalFighterStats } from "@/lib/integrations/types";
import { getTalentFromDatabase } from "@/lib/supabase/talent-db";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import { nationalityToCountryCode } from "@/lib/utils/country";
import { slugify } from "@/lib/utils";
import {
  getDiscoveredOrganizations,
  matchOrganizationForPromotion,
} from "./organization-discovery";

function parseLocationFromExtract(extract: string): string {
  const born = extract.match(/born[^;]*?in\s+([^.;]+)/i);
  if (born) return born[1].trim().slice(0, 60);
  return "International";
}

function mergeExternalStats(
  profile: TalentProfile,
  stats: ExternalFighterStats
): TalentProfile {
  return {
    ...profile,
    heightCm: profile.heightCm ?? stats.heightCm,
    weightKg: profile.weightKg ?? stats.weightKg,
    nationality: profile.nationality || stats.nationality || profile.nationality,
    record: profile.record ?? stats.record,
    avatarUrl: profile.avatarUrl || stats.thumbUrl || profile.avatarUrl,
    popularityScore: profile.popularityScore ?? stats.popularityScore,
    externalIds: {
      ...profile.externalIds,
      theSportsDb:
        stats.source === "the_sports_db"
          ? stats.externalId
          : profile.externalIds?.theSportsDb,
      mmaApi:
        stats.source === "mma_api" ? stats.externalId : profile.externalIds?.mmaApi,
    },
    dataSource: "merged",
  };
}

/** Wikipedia batch thumbs for wrestlers / other sports (no TheSportsDB roster on discover). */
async function enrichDiscoverAvatars(
  entries: AthleteDiscoveryEntry[],
  summaries: TalentProfile[]
): Promise<TalentProfile[]> {
  const titles: string[] = [];
  const indexByTitle = new Map<string, number[]>();

  for (let i = 0; i < entries.length; i++) {
    if (isUsableImageUrl(summaries[i].avatarUrl)) continue;
    const title = entryWikipediaTitle(entries[i]);
    if (!title) continue;
    titles.push(title);
    const list = indexByTitle.get(title) ?? [];
    list.push(i);
    indexByTitle.set(title, list);
  }

  if (titles.length === 0) return summaries;

  const meta = await fetchWikipediaPageMetaBatch(titles);
  if (meta.size === 0) return summaries;

  const out = [...summaries];
  for (const [title, indices] of indexByTitle) {
    const thumb = meta.get(title)?.thumbnailUrl;
    if (!thumb) continue;
    for (const i of indices) {
      out[i] = { ...out[i], avatarUrl: thumb, dataSource: "merged" };
    }
  }
  return out;
}

function withDisplayMeta(
  profile: TalentProfile,
  orgs: Awaited<ReturnType<typeof getDiscoveredOrganizations>>
): TalentProfile {
  const countryCode = nationalityToCountryCode(profile.nationality) ?? undefined;
  const orgMatch = matchOrganizationForPromotion(profile.promotion, orgs);
  return {
    ...profile,
    countryCode,
    promotionLogoUrl: orgMatch?.logoUrl,
    promotionOrgSlug: orgMatch?.slug,
  };
}

function summaryFromEntry(
  entry: AthleteDiscoveryEntry,
  index: number
): TalentProfile {
  const displayName = entryDisplayName(entry);
  const sport = entrySport(entry);
  const weightClass =
    entry.source === "the_sports_db" ? entry.weightClass : undefined;
  const nationality =
    entry.source === "the_sports_db"
      ? entry.nationality
      : "International";
  const avatarUrl =
    entry.source === "the_sports_db"
      ? entry.avatarUrl ?? ""
      : entry.source === "wikidata"
        ? entry.avatarUrl ?? ""
        : "";
  const league =
    entry.source === "the_sports_db" ? entry.league : undefined;
  const featured = Boolean(avatarUrl) && index < 12;
  const dataSource =
    entry.source === "the_sports_db"
      ? "the_sports_db"
      : entry.source === "wikidata"
        ? "wikidata"
        : "wikipedia";

  const gender = entryGender(entry);

  return {
    id: `talent-${entry.slug}`,
    slug: entry.slug,
    displayName,
    talentType: "athlete",
    sport,
    gender,
    weightClass,
    nationality,
    location: nationality,
    bio: league
      ? `${sport.replace(/_/g, " ")} · ${league}${weightClass ? ` · ${weightClass}` : ""}`
      : "",
    verification: "verified",
    featured,
    ranking: featured ? index + 1 : undefined,
    avatarUrl,
    tags: [sport, league ?? "combat"].filter(Boolean) as string[],
    careerStatus: "open_to_bookings",
    availability: "open_to_bookings",
    freeAgent: true,
    availableForBooking: true,
    careerHistory: [],
    championships: [],
    socialLinks: {},
    currentOrganization: league,
    promotion: league,
    dataSource,
    externalIds:
      entry.source === "the_sports_db"
        ? { theSportsDb: entry.externalId }
        : entry.source === "wikidata"
          ? { wikidata: entry.wikidataId }
          : undefined,
  };
}

async function buildFullTalentProfile(
  entry: AthleteDiscoveryEntry,
  index = 0
): Promise<TalentProfile> {
  let profile = summaryFromEntry(entry, index);
  const wikiTitle = entryWikipediaTitle(entry);
  const displayName = entryDisplayName(entry);

  const [wiki, sportsDbDetail, mmaStats] = await Promise.all([
    wikiTitle ? fetchWikipediaSummary(wikiTitle) : Promise.resolve(null),
    entry.source === "the_sports_db"
      ? fetchTheSportsDbPlayerById(entry.externalId)
      : fetchTheSportsDbPlayer(displayName),
    fetchMmaFighterStats(displayName),
  ]);

  if (wiki) {
    profile = {
      ...profile,
      displayName: wiki.title,
      bio: wiki.extract || profile.bio,
      avatarUrl: wiki.thumbnailUrl ?? profile.avatarUrl,
      bannerUrl: wiki.thumbnailUrl,
      location: parseLocationFromExtract(wiki.extract) || profile.location,
      wikipediaUrl: wiki.pageUrl,
      dataSource: "wikipedia",
    };
  }

  if (sportsDbDetail) profile = mergeExternalStats(profile, sportsDbDetail);
  if (mmaStats) profile = mergeExternalStats(profile, mmaStats);

  if (!isUsableImageUrl(profile.avatarUrl)) {
    const commons = await fetchCommonsImageUrl(displayName);
    if (commons) profile = { ...profile, avatarUrl: commons, dataSource: "merged" };
  }

  const orgs = await getDiscoveredOrganizations();
  return withDisplayMeta(profile, orgs);
}

async function resolveEntryBySlug(slug: string): Promise<AthleteDiscoveryEntry | null> {
  const cached = await findDiscoveryEntryBySlug(slug);
  if (cached) return cached;

  const name = slug.replace(/-/g, " ");
  const [wikiTitle, fighting] = await Promise.all([
    fetchWikipediaSearchTitle(name),
    searchTheSportsDbFightingPlayers(name),
  ]);

  const sportsMatch =
    fighting.find((p) => slugify(p.strPlayer ?? "") === slug) ?? fighting[0];

  if (sportsMatch?.idPlayer && sportsMatch.strPlayer) {
    const entry: AthleteDiscoveryEntry = {
      source: "the_sports_db",
      externalId: sportsMatch.idPlayer,
      slug,
      displayName: sportsMatch.strPlayer,
      sport: profileSportFromFighting(sportsMatch.strTeam),
      nationality: sportsMatch.strNationality ?? "International",
      avatarUrl: sportsMatch.strThumb || undefined,
      league: sportsMatch.strTeam?.split(" ")[0] ?? "Fighting",
    };
    if (wikiTitle) Object.assign(entry, { wikipediaTitle: wikiTitle });
    return entry;
  }

  if (wikiTitle) {
    return {
      source: "wikipedia",
      wikipediaTitle: wikiTitle,
      slug,
      sport: "wrestling",
    };
  }

  return null;
}

function profileSportFromFighting(team?: string): SportType {
  const t = (team ?? "").toLowerCase();
  if (t.includes("boxing")) return "boxing";
  if (t.includes("wwe") || t.includes("aew")) return "wrestling";
  return "mma";
}

const getCachedAllTalentSummaries = unstable_cache(
  async () => {
    try {
      const [{ entries }, orgs] = await Promise.all([
        getAthleteDiscoveryIndex(),
        getDiscoveredOrganizations(),
      ]);
      const summaries = entries.map((e, i) => summaryFromEntry(e, i));
      const withPhotos = await enrichDiscoverAvatars(entries, summaries);
      return withPhotos.map((p) => withDisplayMeta(p, orgs));
    } catch (e) {
      console.error("[ScoutFight] Failed to build talent summaries:", e);
      return [];
    }
  },
  ["scoutfight-all-talent-summaries-v9"],
  { revalidate: 3600, tags: ["athletes"] }
);

export async function getAllTalent(): Promise<TalentProfile[]> {
  const [apiTalent, dbTalent] = await Promise.all([
    getCachedAllTalentSummaries(),
    getTalentFromDatabase(),
  ]);

  const bySlug = new Map<string, TalentProfile>();
  for (const t of apiTalent) bySlug.set(t.slug, t);
  for (const t of dbTalent) bySlug.set(t.slug, t);
  return [...bySlug.values()];
}

/** User-submitted profiles override API seed data (LinkedIn-style growth) */
export async function getMvpRosterStats() {
  const { getProfessionalDiscoveryIndex } = await import("./professional-discovery");
  const { getDiscoveredOrganizations } = await import("./organization-discovery");
  const { getDiscoveredOpportunities } = await import("./opportunity-discovery");

  const [index, pros, orgs, opps, userCount] = await Promise.all([
    getAthleteDiscoveryIndex(),
    getProfessionalDiscoveryIndex(),
    getDiscoveredOrganizations(),
    getDiscoveredOpportunities(),
    getTalentFromDatabase().then((r) => r.length),
  ]);

  return {
    mmaSeed: index.mmaCount,
    wrestlingSeed: index.wrestlingCount,
    athletes: index.entries.length,
    professionals: pros.length,
    organizations: orgs.length,
    opportunities: opps.length,
    userProfiles: userCount,
  };
}

export async function getTalentBySlug(slug: string): Promise<TalentProfile | null> {
  const db = (await getTalentFromDatabase()).find((t) => t.slug === slug);
  if (db) return db;

  const entry = await resolveEntryBySlug(slug);
  if (!entry) return null;

  const { entries } = await getAthleteDiscoveryIndex();
  const index = entries.findIndex((e) => e.slug === slug);
  return buildFullTalentProfile(entry, index >= 0 ? index : 0);
}

export async function searchTalent(filters: {
  query?: string;
  sport?: string;
  weightClass?: string;
  gender?: string;
  verification?: string;
  availableOnly?: boolean;
  freeAgentOnly?: boolean;
}): Promise<TalentProfile[]> {
  let list = await getAllTalent();
  if (filters.sport) list = list.filter((t) => t.sport === filters.sport);
  if (filters.gender === "male" || filters.gender === "female") {
    const g = filters.gender as "male" | "female";
    list = list.filter((t) => talentMatchesGender(t, g));
  }
  if (filters.weightClass) {
    const wc = filters.weightClass.toLowerCase();
    list = list.filter((t) => {
      const tw = (t.weightClass ?? "").toLowerCase();
      if (!tw) return false;
      return tw === wc || tw.includes(wc) || wc.includes(tw);
    });
  }
  if (filters.verification)
    list = list.filter((t) => t.verification === filters.verification);
  if (filters.availableOnly)
    list = list.filter(
      (t) =>
        t.availableForBooking &&
        t.careerStatus !== "inactive" &&
        t.careerStatus !== "retired"
    );
  if (filters.freeAgentOnly) list = list.filter((t) => t.freeAgent);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        (t.ringName?.toLowerCase().includes(q) ?? false) ||
        (t.nickname?.toLowerCase().includes(q) ?? false) ||
        t.bio.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.includes(q)) ||
        t.nationality.toLowerCase().includes(q)
    );
  }
  return list;
}

/** Score for ordering rankings (wins, win rate, verified media, featured seed) */
function talentRankingScore(t: TalentProfile): number {
  const wins = t.record?.wins ?? 0;
  const losses = t.record?.losses ?? 0;
  const draws = t.record?.draws ?? 0;
  const bouts = wins + losses + draws;
  const winRate = bouts > 0 ? wins / bouts : 0;
  const photo = isUsableImageUrl(t.avatarUrl) ? 15 : 0;
  const featured = t.featured ? 200 : 0;
  const popularity = t.popularityScore ?? 0;
  return featured + wins * 12 + winRate * 80 + popularity + photo;
}

export async function getRankedTalent(filters: {
  sport?: string;
  weightClass?: string;
}): Promise<TalentProfile[]> {
  const list = await searchTalent({
    sport: filters.sport,
    weightClass: filters.weightClass,
  });
  return [...list].sort((a, b) => {
    const diff = talentRankingScore(b) - talentRankingScore(a);
    if (diff !== 0) return diff;
    return a.displayName.localeCompare(b.displayName);
  });
}

export async function getVideosForTalent(slug: string): Promise<VideoItem[]> {
  const talent = await getTalentBySlug(slug);
  if (!talent) return [];

  const name = talent.ringName ?? talent.displayName;
  const meta = { talentName: name, talentSlug: slug, sport: talent.sport };
  const queries = [
    `${name} ${talent.sport} highlights`,
    `${name} ${talent.sport} fight`,
    `${name} interview`,
  ];

  for (const query of queries) {
    const videos = await fetchYouTubeVideos(query, meta);
    if (videos.length > 0) return videos;
  }
  return [];
}

export async function getAllVideos(limit = 48): Promise<VideoItem[]> {
  const talent = (await getAllTalent()).slice(0, 12);
  const batches = await Promise.all(
    talent.map((t) =>
      fetchYouTubeVideos(`${t.displayName} ${t.sport} highlights`, {
        talentName: t.displayName,
        talentSlug: t.slug,
        sport: t.sport,
      })
    )
  );
  return batches.flat().slice(0, limit);
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  return fetchCombatSportsNews();
}

export async function getAthleteBySlug(slug: string) {
  return getTalentBySlug(slug);
}

export async function getAllAthleteSlugs(): Promise<{ slug: string }[]> {
  const { entries } = await getAthleteDiscoveryIndex();
  const db = await getTalentFromDatabase();
  const slugs = new Set<string>();
  for (const e of entries) slugs.add(e.slug);
  for (const t of db) slugs.add(t.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export {
  getAllOrganizations,
  getOrganizationBySlug,
  getPromotionBySlug,
  getAllOrganizationSlugs,
} from "./organization-repository";
