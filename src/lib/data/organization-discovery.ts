import { unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";
import { MVP_SEED_LIMITS, MVP_CACHE_REVALIDATE } from "@/lib/mvp/config";
import { discoverFightingLeagues } from "@/lib/integrations/the-sports-db";
import { fetchWikipediaCategoryAthletes } from "@/lib/integrations/wikipedia-discovery";
import type { OrganizationType } from "@/types";

export interface DiscoveredOrganization {
  slug: string;
  wikipediaTitle?: string;
  name: string;
  orgType: OrganizationType;
  sports: ("mma" | "wrestling" | "boxing")[];
  logoUrl?: string;
  country?: string;
  theSportsDbId?: string;
  dataSource: "wikipedia" | "the_sports_db";
}

const PROMOTION_CATEGORIES: {
  category: string;
  orgType: OrganizationType;
  sports: ("mma" | "wrestling" | "boxing")[];
  limit: number;
}[] = [
  { category: "Mixed_martial_arts_promotions", orgType: "mma_promotion", sports: ["mma"], limit: 8 },
  { category: "Professional_wrestling_promotions", orgType: "wrestling_promotion", sports: ["wrestling"], limit: 8 },
  { category: "Boxing_promotions", orgType: "boxing_promotion", sports: ["boxing"], limit: 6 },
];

function isPromotionArticle(title: string): boolean {
  const t = title.toLowerCase();
  if (t.startsWith("list of")) return false;
  if (t.includes("weight class")) return false;
  if (t.includes("championship")) return false;
  return title.length > 2;
}

async function discoverFromWikipedia(): Promise<DiscoveredOrganization[]> {
  const out: DiscoveredOrganization[] = [];
  const seen = new Set<string>();

  for (const cfg of PROMOTION_CATEGORIES) {
    const members = await fetchWikipediaCategoryAthletes(cfg.category, cfg.sports[0], cfg.limit);
    for (const m of members) {
      const name = m.wikipediaTitle.replace(/_/g, " ");
      if (!isPromotionArticle(name)) continue;
      const slug = slugify(name);
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push({
        slug,
        wikipediaTitle: m.wikipediaTitle,
        name,
        orgType: cfg.orgType,
        sports: cfg.sports,
        dataSource: "wikipedia",
      });
    }
  }
  return out;
}

async function discoverFromSportsDb(): Promise<DiscoveredOrganization[]> {
  const leagues = await discoverFightingLeagues(MVP_SEED_LIMITS.promotions);
  return leagues.map((l) => ({
    slug: l.slug,
    name: l.name,
    orgType: (l.sport?.toLowerCase().includes("fight") ? "mma_promotion" : "wrestling_promotion") as OrganizationType,
    sports: ["mma"] as ("mma" | "wrestling" | "boxing")[],
    logoUrl: l.logoUrl,
    country: l.country,
    dataSource: "the_sports_db" as const,
  }));
}

async function fetchDiscoveryIndex(): Promise<DiscoveredOrganization[]> {
  const [wiki, sportsDb] = await Promise.all([discoverFromWikipedia(), discoverFromSportsDb()]);
  const bySlug = new Map<string, DiscoveredOrganization>();

  for (const o of [...wiki, ...sportsDb]) {
    const existing = bySlug.get(o.slug);
    if (!existing) {
      bySlug.set(o.slug, o);
      continue;
    }
    bySlug.set(o.slug, {
      ...existing,
      wikipediaTitle: existing.wikipediaTitle ?? o.wikipediaTitle,
      logoUrl: o.logoUrl ?? existing.logoUrl,
      name: o.name || existing.name,
      dataSource: o.logoUrl ? "the_sports_db" : existing.dataSource,
    });
  }

  return [...bySlug.values()].slice(0, MVP_SEED_LIMITS.promotions);
}

const getCachedOrgDiscovery = unstable_cache(
  fetchDiscoveryIndex,
  ["scoutfight-org-discovery-v1"],
  { revalidate: MVP_CACHE_REVALIDATE, tags: ["organizations"] }
);

export async function getDiscoveredOrganizations(): Promise<DiscoveredOrganization[]> {
  return getCachedOrgDiscovery();
}

export async function findDiscoveredOrganizationBySlug(
  slug: string
): Promise<DiscoveredOrganization | null> {
  const orgs = await getDiscoveredOrganizations();
  return orgs.find((o) => o.slug === slug) ?? null;
}

export function matchOrganizationForPromotion(
  promotion: string | undefined,
  entries: DiscoveredOrganization[]
): DiscoveredOrganization | undefined {
  if (!promotion?.trim()) return undefined;
  const p = promotion.toLowerCase().trim();
  const slugGuess = p.replace(/\s+/g, "-");

  return entries.find((e) => {
    const name = e.name.toLowerCase();
    const slug = e.slug.toLowerCase();
    return (
      name === p ||
      slug === slugGuess ||
      name.includes(p) ||
      p.includes(name) ||
      slug.replace(/-/g, " ").includes(p) ||
      p.includes(slug.replace(/-/g, " "))
    );
  });
}
