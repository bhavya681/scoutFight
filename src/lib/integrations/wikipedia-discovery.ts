import { slugify } from "@/lib/utils";
import type { SportType } from "@/types";

const WIKIPEDIA_USER_AGENT =
  "ScoutFight/1.0 (https://scoutfight.app; talent-discovery@scoutfight.app)";

export type AthleteGender = "male" | "female";

export interface WikipediaDiscoveredAthlete {
  source: "wikipedia";
  wikipediaTitle: string;
  slug: string;
  sport: SportType;
  displayName?: string;
  gender?: AthleteGender;
}

/** Pro wrestling — Wikipedia category seeds (updated: female + WWE personnel) */
export const WRESTLING_WIKIPEDIA_CATEGORIES: {
  category: string;
  limit: number;
  gender?: AthleteGender;
}[] = [
  { category: "21st-century_female_professional_wrestlers", limit: 45, gender: "female" },
  { category: "American_female_professional_wrestlers", limit: 30, gender: "female" },
  { category: "21st-century_American_professional_wrestlers", limit: 35 },
  { category: "All_Elite_Wrestling_personnel", limit: 40 },
  { category: "WWE_personnel", limit: 35 },
  { category: "Total_Nonstop_Action_Wrestling_personnel", limit: 25 },
  { category: "Impact_Wrestling_alumni", limit: 20 },
  { category: "Professional_wrestlers_from_the_United_States", limit: 25 },
  { category: "Ring_of_Honor_wrestlers", limit: 15 },
];

/** Boxing, grappling, striking arts — discovered via Wikipedia categories */
export const OTHER_COMBAT_SPORT_CATEGORIES: {
  category: string;
  sport: SportType;
  limit: number;
}[] = [
  { category: "World_Boxing_Council_champions", sport: "boxing", limit: 30 },
  { category: "International_Boxing_Hall_of_Fame_inductees", sport: "boxing", limit: 15 },
  { category: "Kickboxers", sport: "kickboxing", limit: 25 },
  { category: "Muay_Thai_practitioners", sport: "muay_thai", limit: 25 },
  { category: "Brazilian_jiu-jitsu_practitioners", sport: "bjj", limit: 30 },
  { category: "ADCC_World_Championship_champions", sport: "grappling", limit: 20 },
  { category: "Submission_wrestling_practitioners", sport: "grappling", limit: 15 },
];

export function cleanWrestlerDisplayName(title: string): string {
  return title
    .replace(/_/g, " ")
    .replace(/\s*\(wrestler\)\s*$/i, "")
    .replace(/\s*\(female wrestler\)\s*$/i, "")
    .trim();
}

function isPersonArticle(title: string): boolean {
  const t = title.toLowerCase();
  if (t.startsWith("list of")) return false;
  if (t.includes("champions in")) return false;
  if (t.includes("double champions")) return false;
  if (t.includes(" hall of fame")) return false;
  if (t.endsWith(" promotion")) return false;
  if (t.endsWith(" championships")) return false;
  return true;
}

function wikipediaFetchParams(extra: Record<string, string>): URLSearchParams {
  return new URLSearchParams({
    format: "json",
    origin: "*",
    ...extra,
  });
}

async function wikipediaApi<T>(params: URLSearchParams): Promise<T | null> {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (text.startsWith("You are making")) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function fetchWikipediaCategoryAthletes(
  category: string,
  sport: SportType,
  limit: number,
  gender?: AthleteGender
): Promise<WikipediaDiscoveredAthlete[]> {
  const out: WikipediaDiscoveredAthlete[] = [];
  const seen = new Set<string>();
  let continueToken: string | undefined;

  while (out.length < limit) {
    const params = wikipediaFetchParams({
      action: "query",
      list: "categorymembers",
      cmtitle: `Category:${category}`,
      cmlimit: String(Math.min(50, limit - out.length)),
      cmtype: "page",
      ...(continueToken ? { cmcontinue: continueToken } : {}),
    });

    const data = await wikipediaApi<{
      query?: { categorymembers?: { title: string; ns: number }[] };
      continue?: { cmcontinue?: string };
      error?: { info?: string };
    }>(params);

    if (!data?.query?.categorymembers?.length) break;

    for (const m of data.query.categorymembers) {
      if (m.ns !== 0 || !isPersonArticle(m.title)) continue;
      const wikipediaTitle = m.title.replace(/ /g, "_");
      const slug = slugify(cleanWrestlerDisplayName(m.title));
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        source: "wikipedia",
        wikipediaTitle,
        slug,
        sport,
        displayName: cleanWrestlerDisplayName(m.title),
        gender,
      });
      if (out.length >= limit) break;
    }

    continueToken = data.continue?.cmcontinue;
    if (!continueToken) break;
  }

  return out;
}

export async function fetchWikipediaSearchTitle(
  query: string
): Promise<string | null> {
  const params = wikipediaFetchParams({
    action: "opensearch",
    search: query,
    limit: "5",
  });
  const data = await wikipediaApi<[string, string[], string[], string[]]>(params);
  if (!data) return null;

  const [, titles, , urls] = data;
  const combatHint =
    /fighter|boxing|wrestl|ufc|mma|champion|bellator|pugilist/i;
  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const url = urls[i] ?? "";
    if (!title || title.includes("List of")) continue;
    if (combatHint.test(url) || combatHint.test(title) || i === 0) {
      return title.replace(/ /g, "_");
    }
  }
  return titles[0]?.replace(/ /g, "_") ?? null;
}
