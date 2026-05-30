import type { Organization, TalentProfile } from "@/types";
import { fetchWikipediaSummary, fetchWikipediaPageImage } from "./wikipedia";
import { fetchTheSportsDbLeague } from "@/lib/integrations/the-sports-db";
import {
  getDiscoveredOrganizations,
  findDiscoveredOrganizationBySlug,
  type DiscoveredOrganization,
} from "./organization-discovery";
import { getAllTalent } from "./talent-repository";

export type OrganizationDataSource = "wikipedia" | "the_sports_db" | "merged";

async function buildOrganization(
  entry: DiscoveredOrganization,
  index: number,
  talent: TalentProfile[]
): Promise<Organization> {
  const wikiTitle = entry.wikipediaTitle ?? entry.name.replace(/ /g, "_");
  const [wiki, wikiImage, sportsDb] = await Promise.all([
    fetchWikipediaSummary(wikiTitle),
    fetchWikipediaPageImage(wikiTitle),
    entry.dataSource === "the_sports_db" || !entry.wikipediaTitle
      ? fetchTheSportsDbLeague(entry.name)
      : Promise.resolve(null),
  ]);

  const name = wiki?.title ?? entry.name;
  const description =
    wiki?.extract?.slice(0, 600) ??
    sportsDb?.description ??
    `${name} — combat sports organization.`;

  const logoUrl =
    entry.logoUrl ??
    sportsDb?.logoUrl ??
    sportsDb?.badgeUrl ??
    wikiImage?.logoUrl ??
    wiki?.thumbnailUrl;

  const bannerUrl =
    sportsDb?.bannerUrl ?? wikiImage?.originalUrl ?? wikiImage?.logoUrl ?? wiki?.thumbnailUrl;

  let dataSource: OrganizationDataSource = entry.dataSource;
  if (sportsDb?.logoUrl && wiki?.extract) dataSource = "merged";

  const nameToken = name.split(" ")[0].toLowerCase();
  const rosterCount = talent.filter(
    (t) =>
      t.currentOrganization?.toLowerCase().includes(nameToken) ||
      t.promotion?.toLowerCase().includes(entry.slug.replace(/-/g, " ")) ||
      t.promotion?.toLowerCase().includes(nameToken)
  ).length;

  return {
    id: `org-${entry.slug}`,
    slug: entry.slug,
    name,
    orgType: entry.orgType,
    sports: entry.sports,
    description,
    logoUrl: logoUrl ?? "",
    bannerUrl,
    location: entry.country ?? sportsDb?.country ?? "Global",
    verification: "verified",
    featured: index < 4,
    website: sportsDb?.website ?? wiki?.pageUrl,
    rosterCount,
    championships: [],
    talentNeeds: [`${entry.sports[0]} talent`, "Live events", "Media & officials"],
    activeRecruitment: true,
    upcomingEvents: [],
    wikipediaUrl: wiki?.pageUrl,
    dataSource,
    externalIds: sportsDb ? { theSportsDb: sportsDb.id } : undefined,
  };
}

export async function getAllOrganizations(): Promise<Organization[]> {
  const [entries, talent] = await Promise.all([
    getDiscoveredOrganizations(),
    getAllTalent(),
  ]);
  return Promise.all(entries.map((entry, i) => buildOrganization(entry, i, talent)));
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  const entry = await findDiscoveredOrganizationBySlug(slug);
  if (!entry) return null;
  const talent = await getAllTalent();
  const entries = await getDiscoveredOrganizations();
  const index = entries.findIndex((e) => e.slug === slug);
  return buildOrganization(entry, index >= 0 ? index : 0, talent);
}

export const getPromotionBySlug = getOrganizationBySlug;

export async function getAllOrganizationSlugs(): Promise<{ slug: string }[]> {
  const orgs = await getDiscoveredOrganizations();
  return orgs.map((o) => ({ slug: o.slug }));
}
