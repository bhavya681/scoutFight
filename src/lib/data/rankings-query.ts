import type { TalentProfile } from "@/types";
import { getRankedTalent } from "@/lib/data/talent-repository";
import { computeScoutScore } from "@/lib/utils/scout-score";

export const RANKINGS_PAGE_SIZE = 25;

export interface RankingsSearchParams {
  q?: string;
  sport?: string;
  weightClass?: string;
  sort?: string;
  minScore?: string;
  page?: string;
}

function matchesQuery(t: TalentProfile, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    t.displayName,
    t.ringName,
    t.nationality,
    t.countryCode,
    t.promotion,
    t.weightClass,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

export async function queryRankingsTalent(
  params: RankingsSearchParams
): Promise<{ talent: TalentProfile[]; total: number }> {
  let talent = await getRankedTalent({
    sport: params.sport,
    weightClass: params.weightClass,
  });

  if (params.q) {
    talent = talent.filter((t) => matchesQuery(t, params.q!));
  }

  const minScore = parseInt(params.minScore ?? "0", 10) || 0;
  if (minScore > 0) {
    talent = talent.filter((t) => computeScoutScore(t) >= minScore);
  }

  const sort = params.sort ?? "ranking";
  if (sort === "scoutScore") {
    talent = [...talent].sort(
      (a, b) => computeScoutScore(b) - computeScoutScore(a)
    );
  } else if (sort === "name") {
    talent = [...talent].sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
  } else if (sort === "wins") {
    talent = [...talent].sort(
      (a, b) => (b.record?.wins ?? 0) - (a.record?.wins ?? 0)
    );
  }

  const total = talent.length;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * RANKINGS_PAGE_SIZE;
  talent = talent.slice(start, start + RANKINGS_PAGE_SIZE);

  return { talent, total };
}
