import type { SportType } from "@/types";

export function sportTagLabel(sport?: SportType): string {
  if (!sport) return "COMBAT";
  const map: Record<string, string> = {
    mma: "MMA",
    boxing: "BOXING",
    muay_thai: "MUAY THAI",
    bjj: "BJJ",
    wrestling: "WRESTLING",
    kickboxing: "KICKBOXING",
    grappling: "GRAPPLING",
  };
  return map[sport] ?? sport.toUpperCase().replace(/_/g, " ");
}
