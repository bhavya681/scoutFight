"use client";

import {
  Trophy,
  Swords,
  Flame,
  Calendar,
  Ruler,
  Briefcase,
  DollarSign,
  BarChart3,
} from "lucide-react";
import type { TalentProfile } from "@/types";
import { formatRecord } from "@/lib/utils";
import { computeScoutScore } from "@/lib/utils/scout-score";
import {
  getTalentFinishRate,
  getTalentAge,
  formatMarketValue,
  bestIndices,
} from "@/lib/utils/compare-metrics";
import { cn } from "@/lib/utils";

type RowDef = {
  icon: React.ReactNode;
  label: string;
  values: string[];
  numeric?: number[];
  highlight?: "max" | "min";
};

export function CompareBreakdown({
  talents,
  maxSlots = 4,
}: {
  talents: TalentProfile[];
  maxSlots?: number;
}) {
  const cols = talents.length;
  const emptySlots = maxSlots - cols;

  const scoutScores = talents.map((t) => computeScoutScore(t));
  const finishRates = talents.map(getTalentFinishRate);
  const ages = talents.map((t, i) => getTalentAge(t, 26 + i));
  const reaches = talents.map((t) => t.reachCm ?? t.heightCm ?? 0);
  const proYears = talents.map((t) => t.experienceYears ?? 0);
  const marketNums = talents.map((t) => {
    if (t.marketValue && t.marketValue > 0) return t.marketValue;
    const wins = t.record?.wins ?? 0;
    return 120_000 + wins * 35_000 + (t.featured ? 80_000 : 0);
  });

  const rows: RowDef[] = [
    {
      icon: <BarChart3 className="h-4 w-4" />,
      label: "ScoutScore",
      values: scoutScores.map(String),
      numeric: scoutScores,
      highlight: "max",
    },
    {
      icon: <Swords className="h-4 w-4" />,
      label: "Record",
      values: talents.map((t) =>
        t.record ? formatRecord(t.record.wins, t.record.losses, t.record.draws) : "—"
      ),
    },
    {
      icon: <Flame className="h-4 w-4" />,
      label: "Finish rate",
      values: talents.map((t) => {
        const r = getTalentFinishRate(t);
        return r > 0 ? `${r}% KO` : "—";
      }),
      numeric: finishRates,
      highlight: "max",
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Age",
      values: ages.map(String),
      numeric: ages,
      highlight: "min",
    },
    {
      icon: <Ruler className="h-4 w-4" />,
      label: "Reach",
      values: talents.map((t) =>
        t.reachCm ? `${t.reachCm} cm` : t.heightCm ? `${t.heightCm} cm` : "—"
      ),
      numeric: reaches,
      highlight: "max",
    },
    {
      icon: <Briefcase className="h-4 w-4" />,
      label: "Pro years",
      values: proYears.map((y) => (y > 0 ? String(y) : "—")),
      numeric: proYears,
      highlight: "max",
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: "Market value",
      values: talents.map(formatMarketValue),
      numeric: marketNums,
      highlight: "max",
    },
  ];

  return (
    <section className="rounded-xl border border-border bg-card/60 overflow-hidden mt-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Trophy className="h-4 w-4 text-pwr-red shrink-0" />
          Attribute breakdown
        </h2>
        <span className="text-xs text-muted-foreground">
          {cols} of {maxSlots} athletes compared
        </span>
      </div>

      <div className="table-scroll">
        <table className="w-full min-w-[520px] sm:min-w-[640px] text-sm">
          <tbody>
            {rows.map((row) => {
              const best = row.numeric && row.highlight ? bestIndices(row.numeric, row.highlight) : new Set();
              return (
                <tr key={row.label} className="border-t border-border hover:bg-white/[0.02]">
                  <td className="p-4 text-muted-foreground w-44">
                    <span className="inline-flex items-center gap-2">
                      {row.icon}
                      {row.label}
                    </span>
                  </td>
                  {row.values.map((val, i) => (
                    <td key={i} className="p-4 text-center font-medium text-foreground">
                      <span className={cn(best.has(i) && "text-pwr-red")}>{val}</span>
                    </td>
                  ))}
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <td key={`empty-${i}`} className="p-4 text-center text-muted-foreground/70">
                      —
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
