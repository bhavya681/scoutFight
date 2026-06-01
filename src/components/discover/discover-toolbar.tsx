"use client";

import { LayoutGrid, List, BarChart3 } from "lucide-react";
import type { DirectoryFilterControls } from "@/lib/hooks/use-directory-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { id: "scoutScore", label: "ScoutScore (High)" },
  { id: "name", label: "Name (A–Z)" },
  { id: "wins", label: "Wins (High)" },
] as const;

export function DiscoverToolbar({
  count,
  controls,
}: {
  count: number;
  controls: DirectoryFilterControls;
}) {
  const { params, update } = controls;
  const view = params.get("view") === "list" ? "list" : "grid";
  const sort = params.get("sort") ?? "scoutScore";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">
          {count.toLocaleString()}
        </span>{" "}
        athletes found
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={sort} onValueChange={(v) => update("sort", v)}>
          <SelectTrigger className="h-9 w-[180px] bg-card border-border text-sm">
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
        <div className="flex rounded-lg border border-border bg-card p-0.5">
          <button
            type="button"
            onClick={() => update("view", "grid")}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === "grid" ? "bg-pwr-red text-white" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => update("view", "list")}
            className={cn(
              "p-2 rounded-md transition-colors",
              view === "list" ? "bg-pwr-red text-white" : "text-muted-foreground hover:text-foreground"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <BarChart3 className="h-4 w-4 text-muted-foreground hidden sm:block" aria-hidden />
      </div>
    </div>
  );
}
