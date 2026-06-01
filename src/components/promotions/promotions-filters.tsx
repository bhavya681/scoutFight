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
  { id: "kickboxing", label: "Kickboxing" },
  { id: "muay_thai", label: "Muay Thai" },
  { id: "wrestling", label: "Wrestling" },
] as const;

export function PromotionsFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const activeSport = params.get("sport") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/organizations?${qs}` : "/organizations");
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  return (
    <DirectoryFilterPanel id="promotions-grid">
      <div className="relative max-w-3xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search promotions..."
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
          value={params.get("sort") ?? "relevance"}
          onValueChange={(v) => update("sort", v === "relevance" ? "" : v)}
        >
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-input border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
            <SelectItem value="roster">Most athletes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground pt-1 border-t border-border">
        <span className="font-semibold text-foreground tabular-nums">
          {count.toLocaleString()}
        </span>{" "}
        promotions found
      </p>
    </DirectoryFilterPanel>
  );
}
