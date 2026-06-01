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
import { DirectoryFilterPanel } from "@/components/directory/directory-filter-panel";
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

export function VideosFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const activeSport = params.get("sport") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/videos?${qs}` : "/videos");
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  return (
    <DirectoryFilterPanel id="videos-grid">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search fights, athletes, or events..."
          className="pl-10 h-11 bg-input border-border rounded-xl text-sm"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex gap-2 overflow-x-auto scroll-touch scrollbar-hide pb-0.5">
          {SPORT_CHIPS.map((chip) => {
            const active = activeSport === chip.id;
            return (
              <button
                key={chip.id || "all"}
                type="button"
                onClick={() => update("sport", chip.id)}
                className={cn(
                  "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white shadow-md shadow-pwr-red/20"
                    : "bg-muted text-foreground/85 hover:bg-surface-hover border border-border"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
        <Select
          value={params.get("sort") ?? "recent"}
          onValueChange={(v) => update("sort", v === "recent" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-input border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="views">Most views</SelectItem>
            <SelectItem value="title">Title (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground pt-1 border-t border-border">
        <span className="font-semibold text-foreground tabular-nums">
          {count.toLocaleString()}
        </span>{" "}
        videos found
      </p>
    </DirectoryFilterPanel>
  );
}
