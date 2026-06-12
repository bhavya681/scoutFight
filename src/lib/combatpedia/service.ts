import "server-only";

import {
  entryDisplayName,
  entrySport,
  entryWikipediaTitle,
  findDiscoveryEntryBySlug,
  getAthleteDiscoveryIndex,
  type AthleteDiscoveryEntry,
} from "@/lib/data/athlete-discovery";
import { fetchWikipediaPageMetaBatch } from "@/lib/data/wikipedia";
import { getTalentBySlug } from "@/lib/data/talent-repository";
import type { SportType } from "@/types";
import type { CombatpediaSportFilter } from "./constants";
import { resolveCombatpediaWikipediaTitle } from "./resolve-slug";
import { fetchCombatpediaArticle, type CombatpediaArticle } from "./wikipedia-article";

export type CombatpediaEntry = {
  slug: string;
  displayName: string;
  sport: SportType;
  wikipediaTitle: string;
  thumbnailUrl?: string;
};

export type CombatpediaEntryDetail = {
  entry: CombatpediaEntry;
  article: CombatpediaArticle;
};

function entryToCombatpedia(entry: AthleteDiscoveryEntry): CombatpediaEntry {
  return {
    slug: entry.slug,
    displayName: entryDisplayName(entry),
    sport: entrySport(entry),
    wikipediaTitle: entryWikipediaTitle(entry),
    thumbnailUrl:
      entry.source === "wikidata"
        ? entry.avatarUrl
        : entry.source === "the_sports_db"
          ? entry.avatarUrl
          : undefined,
  };
}

export async function listCombatpediaEntries(
  sport: CombatpediaSportFilter = "all",
  query?: string
): Promise<CombatpediaEntry[]> {
  const { entries } = await getAthleteDiscoveryIndex();
  let list = entries
    .filter((e) => Boolean(entryWikipediaTitle(e)))
    .map(entryToCombatpedia);

  if (sport !== "all") {
    list = list.filter((e) => e.sport === sport);
  }

  if (query?.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.displayName.toLowerCase().includes(q) ||
        e.slug.includes(q.replace(/\s+/g, "-"))
    );
  }

  const titles = list.map((e) => e.wikipediaTitle).filter(Boolean);
  const meta = await fetchWikipediaPageMetaBatch(titles.slice(0, 80), 320);

  return list
    .map((e) => ({
      ...e,
      thumbnailUrl:
        e.thumbnailUrl ?? meta.get(e.wikipediaTitle.replace(/ /g, "_"))?.thumbnailUrl,
    }))
    .slice(0, 120);
}

export async function getCombatpediaEntry(slug: string): Promise<CombatpediaEntryDetail | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  const discovery = await findDiscoveryEntryBySlug(normalizedSlug);
  let entry: CombatpediaEntry | null = null;

  if (discovery) {
    entry = entryToCombatpedia(discovery);
  } else {
    const talent = await getTalentBySlug(normalizedSlug);
    if (talent?.wikipediaUrl) {
      const wikiTitle =
        talent.wikipediaUrl.split("/wiki/")[1]?.split("#")[0] ??
        talent.displayName.replace(/ /g, "_");
      entry = {
        slug: normalizedSlug,
        displayName: talent.displayName,
        sport: talent.sport,
        wikipediaTitle: decodeURIComponent(wikiTitle),
        thumbnailUrl: talent.avatarUrl || undefined,
      };
    }
  }

  if (!entry) {
    const resolved = await resolveCombatpediaWikipediaTitle(normalizedSlug);
    if (!resolved) return null;
    entry = {
      slug: normalizedSlug,
      displayName: resolved.displayName,
      sport: resolved.sport,
      wikipediaTitle: resolved.wikipediaTitle,
    };
  }

  const article = await fetchCombatpediaArticle(entry.wikipediaTitle);
  if (!article) {
    const resolved = await resolveCombatpediaWikipediaTitle(normalizedSlug);
    if (!resolved) return null;
    const retryArticle = await fetchCombatpediaArticle(resolved.wikipediaTitle);
    if (!retryArticle) return null;
    return {
      entry: {
        slug: normalizedSlug,
        displayName: retryArticle.title,
        sport: resolved.sport,
        wikipediaTitle: resolved.wikipediaTitle,
        thumbnailUrl: retryArticle.thumbnailUrl,
      },
      article: retryArticle,
    };
  }

  return {
    entry: {
      ...entry,
      slug: normalizedSlug,
      thumbnailUrl: entry.thumbnailUrl ?? article.thumbnailUrl,
      displayName: article.title,
    },
    article,
  };
}
