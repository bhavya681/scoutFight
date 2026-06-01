import type { Organization, SportType } from "@/types";
import { getAllOrganizations } from "@/lib/data/organization-repository";
import { computeOrgScoutScore } from "@/lib/utils/org-scout-score";

export const ORGANIZATIONS_PAGE_SIZE = 9;

export interface OrganizationsSearchParams {
  q?: string;
  sport?: string;
  sort?: string;
  page?: string;
}

const SPORT_FILTERS = new Set(["mma", "boxing", "kickboxing", "muay_thai", "wrestling"]);

export async function searchOrganizations(filters: {
  q?: string;
  sport?: string;
}): Promise<Organization[]> {
  let list = await getAllOrganizations();
  if (filters.sport && SPORT_FILTERS.has(filters.sport)) {
    list = list.filter((o) => o.sports.includes(filters.sport as SportType));
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    list = list.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.sports.some((s) => s.includes(q))
    );
  }
  return list;
}

export async function queryOrganizations(
  params: OrganizationsSearchParams
): Promise<{ organizations: Organization[]; total: number }> {
  let list = await searchOrganizations({
    q: params.q,
    sport: params.sport,
  });

  const sort = params.sort ?? "relevance";
  const scored = list.map((o, i) => ({ o, score: computeOrgScoutScore(o, i) }));
  scored.sort((a, b) => {
    if (sort === "name") return a.o.name.localeCompare(b.o.name);
    if (sort === "roster") return b.o.rosterCount - a.o.rosterCount;
    return b.score - a.score;
  });
  list = scored.map((s) => s.o);

  const total = list.length;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * ORGANIZATIONS_PAGE_SIZE;
  const organizations = list.slice(start, start + ORGANIZATIONS_PAGE_SIZE);

  return { organizations, total };
}
