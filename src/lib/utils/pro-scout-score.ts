import type { Professional } from "@/types";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";

export function computeProScoutScore(pro: Professional, index = 0): number {
  let score = 78;
  if (pro.featured) score += 10;
  if (pro.verification === "verified") score += 8;
  if (isUsableImageUrl(pro.avatarUrl)) score += 5;
  score += Math.min(8, pro.yearsExperience);
  if (pro.nationality && pro.nationality !== "International") score += 4;
  score -= Math.min(6, Math.floor(index / 8));
  return Math.min(99, Math.max(72, Math.round(score)));
}
