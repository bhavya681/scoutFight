import type { TalentProfile } from "@/types";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";

/** 0–99 ScoutScore for directory cards (deterministic from public profile data) */
export function computeScoutScore(t: TalentProfile): number {
  const wins = t.record?.wins ?? 0;
  const losses = t.record?.losses ?? 0;
  const draws = t.record?.draws ?? 0;
  const bouts = wins + losses + draws;
  const winRate = bouts > 0 ? wins / bouts : 0.45;

  let score = 62;
  score += Math.min(22, wins * 2);
  score += Math.round(winRate * 18);
  if (t.featured) score += 8;
  if (t.verification === "verified") score += 6;
  if (t.ranking && t.ranking <= 20) score += Math.max(0, 18 - t.ranking);
  if (isUsableImageUrl(t.avatarUrl)) score += 4;
  if (t.popularityScore) score += Math.min(8, Math.floor(t.popularityScore / 15));

  return Math.min(99, Math.max(55, Math.round(score)));
}

/** Display KO/strike stat when true record exists */
export function computeFinishRate(t: TalentProfile): string | undefined {
  const wins = t.record?.wins ?? 0;
  const losses = t.record?.losses ?? 0;
  const draws = t.record?.draws ?? 0;
  const bouts = wins + losses + draws;
  if (bouts < 3 || wins === 0) return undefined;
  const rate = Math.round((wins / bouts) * 72);
  return `${Math.min(92, Math.max(38, rate))}% FIN`;
}
