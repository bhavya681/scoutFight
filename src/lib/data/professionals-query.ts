import type { Professional, ProfessionalRole, SportType } from "@/types";
import { searchProfessionals } from "@/lib/data/professional-repository";
import { computeProScoutScore } from "@/lib/utils/pro-scout-score";

export const PROFESSIONALS_PAGE_SIZE = 9;

export interface ProfessionalsSearchParams {
  q?: string;
  role?: string;
  sport?: string;
  sort?: string;
  page?: string;
}

export async function queryProfessionals(
  params: ProfessionalsSearchParams
): Promise<{ professionals: Professional[]; total: number }> {
  let list = await searchProfessionals({
    query: params.q,
    role: params.role as ProfessionalRole | undefined,
    sport: params.sport as SportType | undefined,
  });

  const sort = params.sort ?? "relevance";
  const scored = list.map((p, i) => ({ p, score: computeProScoutScore(p, i) }));
  scored.sort((a, b) => {
    if (sort === "name") return a.p.displayName.localeCompare(b.p.displayName);
    return b.score - a.score;
  });
  list = scored.map((s) => s.p);

  const total = list.length;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * PROFESSIONALS_PAGE_SIZE;
  const professionals = list.slice(start, start + PROFESSIONALS_PAGE_SIZE);

  return { professionals, total };
}

export function countUniqueCountries(pros: Professional[]): number {
  const codes = new Set(
    pros
      .map((p) => p.countryCode ?? p.nationality?.toLowerCase())
      .filter(Boolean)
  );
  return Math.max(codes.size, 1);
}
