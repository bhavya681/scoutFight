import type { TalentProfile } from "@/types";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { computeFinishRate } from "@/lib/utils/scout-score";
import { formatCurrency } from "@/lib/utils";

export function getTalentFinishRate(t: TalentProfile): number {
  const fin = computeFinishRate(t);
  if (!fin) return 0;
  const m = fin.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
}

export function getTalentAge(t: TalentProfile, fallback = 28): number {
  if (t.experienceYears && t.experienceYears > 0) {
    return Math.min(40, Math.max(20, 22 + t.experienceYears));
  }
  return fallback;
}

export function formatMarketValue(t: TalentProfile): string {
  if (t.marketValue && t.marketValue > 0) {
    return formatCurrency(t.marketValue * 100);
  }
  const wins = t.record?.wins ?? 0;
  const est = 120_000 + wins * 35_000 + (t.featured ? 80_000 : 0);
  return formatCurrency(est * 100);
}

export function parseMarketValueNum(formatted: string): number {
  const m = formatted.replace(/[^0-9.KMkm]/g, "");
  if (m.includes("M")) return parseFloat(m) * 1_000_000;
  if (m.includes("K") || m.includes("k")) return parseFloat(m) * 1_000;
  return parseFloat(m) || 0;
}

export function bestIndices(values: number[], mode: "max" | "min"): Set<number> {
  const indexed = values.map((v, i) => ({ v, i })).filter((x) => !Number.isNaN(x.v));
  if (indexed.length === 0) return new Set();
  const target =
    mode === "max"
      ? Math.max(...indexed.map((x) => x.v))
      : Math.min(...indexed.map((x) => x.v));
  return new Set(indexed.filter((x) => x.v === target).map((x) => x.i));
}

/** Synthetic win-streak points for chart visualization */
export function winStreakSeries(t: TalentProfile): number[] {
  const wins = t.record?.wins ?? 5;
  const base = Math.min(10, Math.max(3, wins));
  return [base, base + 1, base + 2, base + 1, base + 3, base + 4, base + 5];
}

export function finishSlices(t: TalentProfile): { label: string; pct: number; color: string }[] {
  const rate = getTalentFinishRate(t);
  const ko = Math.min(70, Math.max(25, rate));
  const sub = Math.round((100 - ko) * 0.35);
  const dec = 100 - ko - sub;
  return [
    { label: "KO", pct: ko, color: "#e31b23" },
    { label: "Sub", pct: sub, color: "#f59e0b" },
    { label: "Dec", pct: dec, color: "#22c55e" },
  ];
}
