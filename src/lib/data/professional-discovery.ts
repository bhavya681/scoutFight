import { unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";
import { nationalityToCountryCode } from "@/lib/utils/country";
import { MVP_CACHE_REVALIDATE } from "@/lib/mvp/config";
import { fetchWikidataProfessionals } from "@/lib/integrations/wikidata";
import { fetchWikipediaSummary } from "./wikipedia";
import type { ProfessionalRole, SportType } from "@/types";

export const PROFESSIONAL_SEED_LIMIT = 50;

export interface ProfessionalDiscoveryEntry {
  slug: string;
  displayName: string;
  role: ProfessionalRole;
  sports: SportType[];
  wikipediaTitle?: string;
  wikidataId?: string;
  avatarUrl?: string;
  source: "wikipedia" | "wikidata";
}

const PROFESSIONAL_WIKIPEDIA_CATEGORIES: {
  category: string;
  role: ProfessionalRole;
  sports: SportType[];
  limit: number;
}[] = [
  { category: "Mixed_martial_arts_referees", role: "referee", sports: ["mma"], limit: 12 },
  { category: "Professional_wrestling_referees", role: "referee", sports: ["wrestling"], limit: 12 },
  { category: "Sports_announcers", role: "announcer", sports: ["mma", "wrestling", "boxing"], limit: 10 },
  { category: "Boxing_managers", role: "manager", sports: ["boxing", "mma"], limit: 8 },
  { category: "Martial_arts_coaches", role: "coach", sports: ["mma", "bjj", "muay_thai"], limit: 8 },
];

function isPersonTitle(title: string): boolean {
  const t = title.toLowerCase();
  return !t.startsWith("list of") && !t.includes("category:");
}

async function discoverFromWikipediaCategories(): Promise<ProfessionalDiscoveryEntry[]> {
  const { fetchWikipediaCategoryAthletes } = await import(
    "@/lib/integrations/wikipedia-discovery"
  );
  const out: ProfessionalDiscoveryEntry[] = [];
  const seen = new Set<string>();

  for (const cfg of PROFESSIONAL_WIKIPEDIA_CATEGORIES) {
    const members = await fetchWikipediaCategoryAthletes(
      cfg.category,
      cfg.sports[0],
      cfg.limit
    );
    for (const m of members) {
      const name = m.wikipediaTitle.replace(/_/g, " ");
      if (!isPersonTitle(name)) continue;
      const slug = slugify(name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        displayName: name,
        role: cfg.role,
        sports: cfg.sports,
        wikipediaTitle: m.wikipediaTitle,
        source: "wikipedia",
      });
    }
  }
  return out;
}

async function fetchDiscoveryIndex(): Promise<ProfessionalDiscoveryEntry[]> {
  const half = Math.floor(PROFESSIONAL_SEED_LIMIT / 2);
  const [wikidataRaw, wiki] = await Promise.all([
    fetchWikidataProfessionals(half),
    discoverFromWikipediaCategories(),
  ]);

  const wikidata: ProfessionalDiscoveryEntry[] = wikidataRaw.map((w) => ({
    slug: w.slug,
    displayName: w.displayName,
    role: w.role,
    sports: w.sports,
    wikipediaTitle: w.wikipediaTitle,
    wikidataId: w.wikidataId,
    avatarUrl: w.avatarUrl,
    source: "wikidata",
  }));

  const bySlug = new Map<string, ProfessionalDiscoveryEntry>();
  for (const e of [...wikidata, ...wiki]) {
    if (!bySlug.has(e.slug)) bySlug.set(e.slug, e);
  }
  return [...bySlug.values()].slice(0, PROFESSIONAL_SEED_LIMIT);
}

const getCachedProfessionalDiscovery = unstable_cache(
  fetchDiscoveryIndex,
  ["scoutfight-professional-discovery-v1"],
  { revalidate: MVP_CACHE_REVALIDATE, tags: ["professionals"] }
);

export async function getProfessionalDiscoveryIndex(): Promise<ProfessionalDiscoveryEntry[]> {
  return getCachedProfessionalDiscovery();
}

export async function findProfessionalDiscoveryEntry(
  slug: string
): Promise<ProfessionalDiscoveryEntry | null> {
  const list = await getProfessionalDiscoveryIndex();
  return list.find((e) => e.slug === slug) ?? null;
}

export async function buildProfessionalFromEntry(
  entry: ProfessionalDiscoveryEntry,
  index: number
): Promise<import("@/types").Professional> {
  const wiki = entry.wikipediaTitle
    ? await fetchWikipediaSummary(entry.wikipediaTitle)
    : null;

  const bio =
    wiki?.extract?.slice(0, 500) ??
    `${entry.role.replace(/_/g, " ")} — combat sports professional. Profile from live ${entry.source} data.`;

  const location = wiki ? parseLocation(wiki.extract) : "Global";
  const nationality = location !== "Global" ? location : "International";

  return {
    id: `pro-${entry.slug}`,
    slug: entry.slug,
    displayName: wiki?.title ?? entry.displayName,
    role: entry.role,
    sports: entry.sports,
    nationality,
    countryCode: nationalityToCountryCode(nationality) ?? undefined,
    location,
    bio,
    verification: "verified",
    featured: index < 6,
    avatarUrl: entry.avatarUrl ?? wiki?.thumbnailUrl ?? "",
    bannerUrl: wiki?.thumbnailUrl,
    yearsExperience: 8,
    careerStatus: "open_to_bookings",
    availability: "open_to_bookings",
    freeAgent: true,
    availableForBooking: true,
    careerHistory: [],
    socialLinks: { website: wiki?.pageUrl },
    tags: [entry.role, ...entry.sports],
    dataSource: entry.source === "wikidata" ? "wikidata" : "wikipedia",
  };
}

function parseLocation(extract: string): string {
  const born = extract.match(/born[^;]*?in\s+([^.;]+)/i);
  return born ? born[1].trim().slice(0, 60) : "Global";
}
