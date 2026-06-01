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
import { cn } from "@/lib/utils";

const SPORT_CHIPS = [
  { id: "", label: "All" },
  { id: "mma", label: "MMA" },
  { id: "boxing", label: "Boxing" },
  { id: "muay_thai", label: "Muay Thai" },
  { id: "bjj", label: "BJJ" },
  { id: "wrestling", label: "Wrestling" },
  { id: "kickboxing", label: "Kickboxing" },
] as const;

export function VideosSidebarFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const basePath = "/videos";
  const activeSport = params.get("sport") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  function reset() {
    router.push(basePath);
  }

  return (
    <aside
      id="videos-grid"
      className="rounded-xl border border-border bg-card p-4 space-y-5 h-fit lg:sticky lg:top-24"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Fights, athletes, events..."
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
        videos found
      </p>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Discipline
        </p>
        <div className="flex flex-wrap gap-2">
          {SPORT_CHIPS.map((chip) => {
            const active = activeSport === chip.id;
            return (
              <button
                key={chip.id || "all"}
                type="button"
                onClick={() => update("sport", chip.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white"
                    : "bg-muted text-foreground/85 hover:bg-surface-hover"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Sort by
        </p>
        <Select
          value={params.get("sort") ?? "recent"}
          onValueChange={(v) => update("sort", v === "recent" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="views">Most views</SelectItem>
            <SelectItem value="title">Title (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
