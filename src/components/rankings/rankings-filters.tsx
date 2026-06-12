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
import { DirectoryFilterPanel } from "@/components/directory/directory-filter-panel";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { id: "ranking", label: "Ranking" },
  { id: "scoutScore", label: "ScoutScore" },
  { id: "wins", label: "Wins" },
  { id: "name", label: "Name (A–Z)" },
] as const;

export function RankingsFilters({ count }: { count: number }) {
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

  return (
    <DirectoryFilterPanel id="rankings-grid">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, country, or promotion..."
            className="pl-10 h-11 bg-input border-border rounded-xl text-sm"
            defaultValue={params.get("q") ?? ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
            }}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="h-4 w-4 text-pwr-red hidden sm:block" />
          <Select
            value={params.get("sort") ?? "ranking"}
            onValueChange={(v) => update("sort", v === "ranking" ? "" : v)}
          >
            <SelectTrigger className="h-11 w-full sm:w-[168px] bg-input border-border text-sm">
              <SelectValue placeholder="Sort" />
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
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex gap-2 overflow-x-auto scroll-touch scrollbar-smooth pb-0.5 -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          <button
            type="button"
            onClick={() => update("sport", "", ["weightClass"])}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              !sport
                ? "bg-pwr-red text-white shadow-md shadow-pwr-red/20"
                : "bg-muted text-foreground/85 hover:bg-surface-hover border border-border"
            )}
          >
            All
          </button>
          {SPORTS.map((s) => {
            const active = sport === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => update("sport", active ? "" : s.id, ["weightClass"])}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white shadow-md shadow-pwr-red/20"
                    : "bg-muted text-foreground/85 hover:bg-surface-hover border border-border"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <Select
          value={params.get("weightClass") || "all"}
          onValueChange={(v) => update("weightClass", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-input border-border text-sm shrink-0">
            <SelectValue placeholder="Weight class" />
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Min ScoutScore
            </span>
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
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground tabular-nums">
              {count.toLocaleString()}
            </span>{" "}
            ranked
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs font-semibold text-pwr-red hover:underline uppercase tracking-wide"
          >
            Reset
          </button>
        </div>
      </div>
    </DirectoryFilterPanel>
  );
}
