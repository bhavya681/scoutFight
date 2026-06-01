"use client";

import type { TalentProfile } from "@/types";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { winStreakSeries, finishSlices } from "@/lib/utils/compare-metrics";
import { GitCompare, TrendingUp, PieChart } from "lucide-react";

function LineChart({ talent }: { talent: TalentProfile }) {
  const pts = winStreakSeries(talent);
  const max = Math.max(...pts, 1);
  const w = 200;
  const h = 80;
  const coords = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - (p / max) * (h - 8);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${talent.slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e31b23" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e31b23" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${coords} ${w},${h}`} fill={`url(#grad-${talent.slug})`} />
      <polyline
        points={coords}
        fill="none"
        stroke="#e31b23"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DonutChart({ talent }: { talent: TalentProfile }) {
  const slices = finishSlices(talent);
  let offset = 0;
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <svg viewBox="0 0 100 100" className="w-28 h-28 mx-auto">
      {slices.map((s) => {
        const dash = (s.pct / 100) * c;
        const el = (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 50 50)"
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx="50" cy="50" r="22" fill="#18181b" />
    </svg>
  );
}

function BarChart({ talents }: { talents: TalentProfile[] }) {
  const scores = talents.map((t) => ({
    name: t.displayName.split(" ").pop() ?? t.displayName,
    score: computeScoutScore(t),
  }));
  const max = Math.max(...scores.map((s) => s.score), 1);

  return (
    <div className="flex items-end justify-center gap-4 h-28 px-2">
      {scores.map((s) => (
        <div key={s.name} className="flex flex-col items-center gap-1 flex-1 max-w-[60px]">
          <div
            className="w-full rounded-t-md bg-pwr-red min-h-[8px] transition-all"
            style={{ height: `${(s.score / max) * 100}%`, maxHeight: "88px" }}
          />
          <span className="text-[10px] text-muted-foreground truncate w-full text-center">{s.name}</span>
        </div>
      ))}
    </div>
  );
}

export function CompareCharts({ talents }: { talents: TalentProfile[] }) {
  const primary = talents[0];
  if (!primary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-pwr-red" />
          Win streak trend
        </p>
        <LineChart talent={primary} />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
          {["Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <PieChart className="h-3.5 w-3.5 text-pwr-red" />
          Finish distribution
        </p>
        <DonutChart talent={primary} />
        <div className="flex justify-center gap-3 mt-2 text-[10px] text-muted-foreground">
          {finishSlices(primary).map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
          <GitCompare className="h-3.5 w-3.5 text-pwr-red" />
          ScoutScore compare
        </p>
        <BarChart talents={talents} />
      </div>
    </div>
  );
}
