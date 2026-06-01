import type { Organization } from "@/types";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";

export function computeOrgScoutScore(org: Organization, index = 0): number {
  let score = 80;
  if (org.featured) score += 10;
  if (org.verification === "verified") score += 6;
  if (isUsableImageUrl(org.logoUrl)) score += 4;
  if (isUsableImageUrl(org.bannerUrl)) score += 4;
  score += Math.min(10, Math.floor(org.rosterCount / 20));
  if (org.activeRecruitment) score += 3;
  score -= Math.min(8, Math.floor(index / 6));
  return Math.min(99, Math.max(75, Math.round(score)));
}
