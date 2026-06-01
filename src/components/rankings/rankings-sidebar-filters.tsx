"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, getWeightClassOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { id: "ranking", label: "Ranking" },
  { id: "scoutScore", label: "ScoutScore" },
  { id: "wins", label: "Wins" },
  { id: "name", label: "Name (A–Z)" },
] as const;

export function RankingsSidebarFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const basePath = "/rankings";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function update(key: string, value: string, extraDelete?: string[]) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    for (const k of extraDelete ?? []) next.delete(k);
    push(next);
  }

  function reset() {
    router.push(basePath);
  }

  const sport = params.get("sport") ?? "";
  const weightOptions = getWeightClassOptions(sport || undefined);
  const minScore = parseInt(params.get("minScore") ?? "0", 10) || 0;
  const sort = params.get("sort") ?? "ranking";

  return (
    <aside className="rounded-xl border border-border bg-card p-4 space-y-5 h-fit lg:sticky lg:top-24">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Name, country, promotion..."
          className="pl-10 h-10 bg-input border-border text-sm"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-pwr-red" />
          Filters
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium text-pwr-red hover:underline"
        >
          Reset
        </button>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        <span className="font-semibold text-foreground tabular-nums">{count.toLocaleString()}</span>{" "}
        ranked athletes
      </p>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Discipline
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => update("sport", "", ["weightClass"])}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium",
              !sport ? "bg-pwr-red text-white" : "bg-muted text-foreground/85 hover:bg-surface-hover"
            )}
          >
            All
          </button>
          {SPORTS.slice(0, 6).map((s) => {
            const active = sport === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() =>
                  update("sport", active ? "" : s.id, ["weightClass"])
                }
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white"
                    : "bg-muted text-foreground/85 hover:bg-surface-hover"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Weight class
        </p>
        <Select
          value={params.get("weightClass") || "all"}
          onValueChange={(v) => update("weightClass", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue placeholder="All classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {weightOptions.map((wc) => (
              <SelectItem key={wc} value={wc}>
                {wc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Min ScoutScore
          </p>
          <span className="text-xs text-muted-foreground">{minScore > 0 ? `${minScore}+` : "Any"}</span>
        </div>
        <input
          type="range"
          min={0}
          max={90}
          step={5}
          value={minScore}
          onChange={(e) =>
            update("minScore", e.target.value === "0" ? "" : e.target.value)
          }
          className="w-full h-1.5 rounded-full appearance-none bg-muted accent-pwr-red cursor-pointer"
        />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Sort by
        </p>
        <Select value={sort} onValueChange={(v) => update("sort", v === "ranking" ? "" : v)}>
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
