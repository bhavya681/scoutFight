import { unstable_cache } from "next/cache";
import { slugify } from "@/lib/utils";
import { MVP_CACHE_REVALIDATE } from "@/lib/mvp/config";
import type { MarketplaceListing, SportType } from "@/types";
import { getDiscoveredOrganizations } from "./organization-discovery";
import {
  fetchTheSportsDbLeagueEvents,
  SPORTSDB_LEAGUE_IDS,
} from "@/lib/integrations/the-sports-db";

export const OPPORTUNITY_SEED_LIMIT = 30;

function seekTypeForSport(sport: SportType): MarketplaceListing["seekType"] {
  if (sport === "wrestling") return "looking_for_wrestlers";
  if (sport === "boxing") return "looking_for_boxers";
  if (sport === "cricket") return "looking_for_cricketers";
  return "looking_for_mma_fighters";
}

function recruitmentListing(
  org: Awaited<ReturnType<typeof getDiscoveredOrganizations>>[0],
  variant: number
): MarketplaceListing {
  const sport = org.sports[0] ?? "mma";
  const slug = `${org.slug}-recruitment-${variant}`;
  const titles: Partial<Record<SportType, string[]>> = {
    mma: ["Talent pipeline open call", "Regional fighter scouting"],
    wrestling: ["Live event talent search", "Development roster open call"],
    boxing: ["Undercard boxer recruitment", "Prospect showcase"],
    kickboxing: ["Fighter recruitment"],
    muay_thai: ["Fighter recruitment"],
    bjj: ["Athlete recruitment"],
    grappling: ["Athlete recruitment"],
    cricket: ["Franchise squad open trials", "Overseas player recruitment", "Domestic league scouting"],
    other: ["Talent recruitment"],
  };
  const titleList = titles[sport] ?? titles.mma ?? ["Talent recruitment"];
  const title = `${org.name} — ${titleList[variant % titleList.length]}`;

  return {
    id: `opp-${slug}`,
    slug,
    title,
    type: "talent_seek",
    seekType: seekTypeForSport(sport),
    organizationName: org.name,
    organizationSlug: org.slug,
    organizationLogoUrl: org.logoUrl,
    sport,
    location: org.country ?? "Global",
    budget: "Open",
    deadline: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    description: `${org.name} is actively scouting ${sport} talent via ScoutFight. Independent and undiscovered athletes are encouraged to apply. Live data sourced from public APIs — submit your profile to be considered.`,
    featured: variant === 0,
    allowsApplications: true,
    requirements: ["ScoutFight profile", "Highlight reel or resume", "Availability for contact"],
    targetRole: "athlete",
    externalUrl: undefined,
  };
}

function listingFromEvent(
  event: Awaited<ReturnType<typeof fetchTheSportsDbLeagueEvents>>[0],
  orgSlug: string,
  orgName: string,
  logoUrl?: string
): MarketplaceListing | null {
  if (!event.id || !event.name) return null;
  const slug = slugify(`${orgSlug}-${event.name}`).slice(0, 80);

  return {
    id: `opp-${slug}`,
    slug,
    title: event.name,
    type: "booking_opportunity",
    seekType: "looking_for_mma_fighters",
    organizationName: orgName,
    organizationSlug: orgSlug,
    organizationLogoUrl: logoUrl,
    sport: "mma",
    location: event.location ?? "TBA",
    budget: "TBA",
    deadline: event.date,
    description:
      event.description ??
      `${event.name} — event data from TheSportsDB. Apply for booking, officiating, or media roles tied to this card.`,
    featured: false,
    allowsApplications: true,
    requirements: ["Relevant combat sports experience"],
    targetRole: "athlete",
    externalUrl: undefined,
  };
}

async function fetchDiscoveryIndex(): Promise<MarketplaceListing[]> {
  const orgs = await getDiscoveredOrganizations();
  const listings: MarketplaceListing[] = [];
  const seenSlugs = new Set<string>();

  for (const org of orgs) {
    listings.push(recruitmentListing(org, 0));
    seenSlugs.add(listings[listings.length - 1].slug);

    const leagueId = SPORTSDB_LEAGUE_IDS[org.slug];
    if (leagueId) {
      const events = await fetchTheSportsDbLeagueEvents(leagueId, 3);
      for (const ev of events) {
        const listing = listingFromEvent(ev, org.slug, org.name, org.logoUrl);
        if (listing && !seenSlugs.has(listing.slug)) {
          listings.push(listing);
          seenSlugs.add(listing.slug);
        }
      }
    }
  }

  return listings.slice(0, OPPORTUNITY_SEED_LIMIT);
}

const getCachedOpportunityDiscovery = unstable_cache(
  fetchDiscoveryIndex,
  ["scoutfight-opportunity-discovery-v1"],
  { revalidate: MVP_CACHE_REVALIDATE, tags: ["opportunities"] }
);

export async function getDiscoveredOpportunities(): Promise<MarketplaceListing[]> {
  return getCachedOpportunityDiscovery();
}

export async function findDiscoveredOpportunity(
  slug: string
): Promise<MarketplaceListing | null> {
  const list = await getDiscoveredOpportunities();
  return list.find((o) => o.slug === slug) ?? null;
}

export async function getDiscoveredOpportunitySlugs(): Promise<{ slug: string }[]> {
  const list = await getDiscoveredOpportunities();
  return list.map((o) => ({ slug: o.slug }));
}
