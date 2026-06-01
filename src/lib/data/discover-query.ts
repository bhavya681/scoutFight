import type { TalentProfile } from "@/types";
import { searchTalent } from "@/lib/data/talent-repository";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { talentMatchesCountry } from "@/lib/utils/region-match";

export const DISCOVER_PAGE_SIZE = 9;

export interface DiscoverSearchParams {
  q?: string;
  sport?: string;
  weightClass?: string;
  gender?: string;
  verification?: string;
  availableOnly?: string;
  region?: string;
  minScore?: string;
  sort?: string;
  view?: string;
  page?: string;
}

export async function queryDiscoverTalent(
  params: DiscoverSearchParams
): Promise<{ talent: TalentProfile[]; total: number }> {
  let talent = await searchTalent({
    query: params.q,
    sport: params.sport,
    weightClass: params.weightClass,
    gender:
      params.gender === "male" || params.gender === "female"
        ? params.gender
        : undefined,
    verification: params.verification,
    availableOnly: params.availableOnly === "true",
  });

  if (params.region) {
    talent = talent.filter((t) => talentMatchesCountry(t, params.region!));
  }

  const minScore = parseInt(params.minScore ?? "0", 10) || 0;
  if (minScore > 0) {
    talent = talent.filter((t) => computeScoutScore(t) >= minScore);
  }

  const sort = params.sort ?? "scoutScore";
  talent = [...talent].sort((a, b) => {
    if (sort === "name") {
      return a.displayName.localeCompare(b.displayName);
    }
    if (sort === "wins") {
      return (b.record?.wins ?? 0) - (a.record?.wins ?? 0);
    }
    return computeScoutScore(b) - computeScoutScore(a);
  });

  const total = talent.length;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * DISCOVER_PAGE_SIZE;
  talent = talent.slice(start, start + DISCOVER_PAGE_SIZE);

  return { talent, total };
}

export function formatDirectoryCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
  return `${n.toLocaleString()}+`;
}
