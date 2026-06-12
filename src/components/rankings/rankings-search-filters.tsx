"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWeightClassOptions } from "@/lib/constants";
import { cn } from "@/lib/utils";

const RANKING_SPORT_PILLS = [
  { id: "", label: "All" },
  { id: "mma", label: "MMA" },
  { id: "boxing", label: "Boxing" },
  { id: "muay_thai", label: "Muay Thai" },
  { id: "wrestling", label: "Wrestling" },
  { id: "bjj", label: "BJJ" },
] as const;

export function RankingsSearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/rankings?${qs}` : "/rankings");
  }

  function update(key: string, value: string, extraDelete?: string[]) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    for (const k of extraDelete ?? []) next.delete(k);
    push(next);
  }

  const sport = params.get("sport") ?? "";
  const weightClass = params.get("weightClass") ?? "";
  const weightOptions = getWeightClassOptions(sport || undefined);

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search athletes by name, country, or promotion..."
          className="pl-11 h-12 bg-card border-border text-sm rounded-xl"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 overflow-x-auto scroll-touch scrollbar-smooth pb-1 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0">
          {RANKING_SPORT_PILLS.map((pill) => {
            const active = sport === pill.id;
            return (
              <button
                key={pill.id || "all"}
                type="button"
                onClick={() => update("sport", pill.id, ["weightClass"])}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white"
                    : "bg-card text-muted-foreground border border-border hover:text-foreground hover:border-border"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        <Select
          value={weightClass || "all"}
          onValueChange={(v) => update("weightClass", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-card border-border text-sm shrink-0">
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
    </div>
  );
}
