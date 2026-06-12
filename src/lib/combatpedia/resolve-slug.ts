import { fetchWikipediaSummary } from "@/lib/data/wikipedia";
import { fetchWikipediaSearchTitle } from "@/lib/integrations/wikipedia-discovery";
import { slugify } from "@/lib/utils";
import type { SportType } from "@/types";

export function slugToWikipediaTitle(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("_");
}

function inferSportFromText(text: string): SportType {
  const t = text.toLowerCase();
  if (/mma|ufc|bellator|mixed martial|pancrase|one championship/.test(t)) return "mma";
  if (/boxer|boxing|wbc|wba|ibf/.test(t)) return "boxing";
  if (/kickbox/.test(t)) return "kickboxing";
  if (/muay thai/.test(t)) return "muay_thai";
  if (/jiu-jitsu|bjj|grappl|submission/.test(t)) return "grappling";
  if (/wrestl|wwe|aew|nxt/.test(t)) return "wrestling";
  if (/cricket|cricketer|ipl|bbl|psl|batsman|bowler|wicket/.test(t)) return "cricket";
  return "mma";
}

/** Resolve any combatpedia slug to a Wikipedia article title (works for fighters not in discover seed). */
export async function resolveCombatpediaWikipediaTitle(
  slug: string
): Promise<{ wikipediaTitle: string; displayName: string; sport: SportType } | null> {
  const normalizedSlug = slugify(slug);
  const name = normalizedSlug.replace(/-/g, " ");
  const titleCase = slugToWikipediaTitle(normalizedSlug);

  const candidates = [
    titleCase,
    `${titleCase}_(fighter)`,
    `${titleCase}_(wrestler)`,
    `${titleCase}_(boxer)`,
    `${titleCase}_(cricketer)`,
    normalizedSlug.replace(/-/g, "_"),
  ];

  const searched = await fetchWikipediaSearchTitle(name);
  if (searched) candidates.unshift(searched);

  const seen = new Set<string>();
  for (const candidate of candidates) {
    const key = candidate.replace(/ /g, "_");
    if (seen.has(key)) continue;
    seen.add(key);

    const summary = await fetchWikipediaSummary(key);
    if (!summary?.title) continue;

    const wikiTitle = summary.title.replace(/ /g, "_");
    const sport = inferSportFromText(
      [summary.description, summary.extract, summary.title].filter(Boolean).join(" ")
    );

    return {
      wikipediaTitle: wikiTitle,
      displayName: summary.title,
      sport,
    };
  }

  return null;
}
