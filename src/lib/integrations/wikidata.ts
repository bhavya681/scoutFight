import { slugify } from "@/lib/utils";
import type { SportType } from "@/types";

export interface WikidataDiscoveredAthlete {
  source: "wikidata";
  wikidataId: string;
  slug: string;
  displayName: string;
  sport: SportType;
  wikipediaTitle?: string;
  avatarUrl?: string;
}

const ENDPOINT = "https://query.wikidata.org/sparql";

/** Professional wrestlers (Q66221) with optional image + en Wikipedia link */
const WRESTLER_SPARQL = `
SELECT ?person ?personLabel ?image ?article WHERE {
  ?person wdt:P106 wd:Q66221 .
  OPTIONAL { ?person wdt:P18 ?image . }
  OPTIONAL {
    ?article schema:about ?person ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 80
`;

function wikipediaTitleFromArticleUri(uri?: string): string | undefined {
  if (!uri) return undefined;
  const m = uri.match(/\/wiki\/(.+)$/);
  return m ? decodeURIComponent(m[1].replace(/ /g, "_")) : undefined;
}

function wikidataIdFromUri(uri: string): string {
  const m = uri.match(/(Q\d+)$/);
  return m?.[1] ?? uri;
}

export interface WikidataDiscoveredProfessional {
  slug: string;
  displayName: string;
  role: "commentator" | "referee" | "announcer" | "coach" | "manager";
  sports: ("mma" | "wrestling" | "boxing")[];
  wikidataId: string;
  wikipediaTitle?: string;
  avatarUrl?: string;
  source: "wikidata";
}

const COMMENTATOR_SPARQL = `
SELECT ?person ?personLabel ?image ?article WHERE {
  ?person wdt:P106 wd:Q933739 .
  OPTIONAL { ?person wdt:P18 ?image . }
  OPTIONAL {
    ?article schema:about ?person ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
LIMIT 40
`;

export async function fetchWikidataProfessionals(
  limit = 25
): Promise<WikidataDiscoveredProfessional[]> {
  const params = new URLSearchParams({
    query: COMMENTATOR_SPARQL,
    format: "json",
  });

  try {
    const res = await fetch(`${ENDPOINT}?${params}`, {
      headers: { Accept: "application/sparql-results+json", "User-Agent": "ScoutFight/1.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      results?: {
        bindings?: {
          person?: { value: string };
          personLabel?: { value: string };
          image?: { value: string };
          article?: { value: string };
        }[];
      };
    };

    const out: WikidataDiscoveredProfessional[] = [];
    const seen = new Set<string>();

    for (const row of data.results?.bindings ?? []) {
      const label = row.personLabel?.value;
      const personUri = row.person?.value;
      if (!label || !personUri || label.endsWith("Q")) continue;
      const slug = slugify(label);
      if (seen.has(slug)) continue;
      seen.add(slug);

      out.push({
        slug,
        displayName: label,
        role: "commentator",
        sports: ["mma", "boxing"],
        wikidataId: wikidataIdFromUri(personUri),
        wikipediaTitle: wikipediaTitleFromArticleUri(row.article?.value),
        avatarUrl: row.image?.value,
        source: "wikidata",
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}

export async function fetchWikidataWrestlers(
  limit = 50
): Promise<WikidataDiscoveredAthlete[]> {
  const params = new URLSearchParams({
    query: WRESTLER_SPARQL,
    format: "json",
  });

  try {
    const res = await fetch(`${ENDPOINT}?${params}`, {
      headers: { Accept: "application/sparql-results+json", "User-Agent": "ScoutFight/1.0" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as {
      results?: {
        bindings?: {
          person?: { value: string };
          personLabel?: { value: string };
          image?: { value: string };
          article?: { value: string };
        }[];
      };
    };

    const seen = new Set<string>();
    const out: WikidataDiscoveredAthlete[] = [];

    for (const row of data.results?.bindings ?? []) {
      const label = row.personLabel?.value;
      const personUri = row.person?.value;
      if (!label || !personUri || label.endsWith("Q")) continue;

      const slug = slugify(label);
      if (seen.has(slug)) continue;
      seen.add(slug);

      out.push({
        source: "wikidata",
        wikidataId: wikidataIdFromUri(personUri),
        slug,
        displayName: label,
        sport: "wrestling",
        wikipediaTitle: wikipediaTitleFromArticleUri(row.article?.value),
        avatarUrl: row.image?.value,
      });

      if (out.length >= limit) break;
    }

    return out;
  } catch {
    return [];
  }
}
