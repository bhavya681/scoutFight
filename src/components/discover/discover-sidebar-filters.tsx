"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, GENDER_FILTER_OPTIONS, getWeightClassOptions } from "@/lib/constants";
import { DiscoverGenderFilter } from "@/components/discover/discover-gender-filter";
import { MATCHMAKER_COUNTRY_OPTIONS } from "@/lib/utils/region-match";
import type { DirectoryFilterControls } from "@/lib/hooks/use-directory-filters";
import { cn } from "@/lib/utils";

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-pwr-red text-white shadow-md shadow-pwr-red/25"
          : "bg-muted text-foreground/85 hover:bg-surface-hover"
      )}
    >
      {children}
    </button>
  );
}

export function DiscoverSidebarFilters({
  controls,
}: {
  controls: DirectoryFilterControls;
}) {
  const { params, update, reset } = controls;
  const [searchDraft, setSearchDraft] = useState(params.get("q") ?? "");

  useEffect(() => {
    setSearchDraft(params.get("q") ?? "");
  }, [params]);

  const sport = params.get("sport") ?? "";
  const gender = params.get("gender") ?? "";
  const weightOptions = getWeightClassOptions(sport || undefined);
  const minScore = parseInt(params.get("minScore") ?? "0", 10) || 0;
  const [scoreDraft, setScoreDraft] = useState(minScore);

  useEffect(() => {
    setScoreDraft(minScore);
  }, [minScore]);

  const activeChips: { key: string; label: string; clear: () => void }[] = [];
  const q = params.get("q");
  if (q) activeChips.push({ key: "q", label: `“${q}”`, clear: () => update("q", "") });
  if (sport) {
    const label = SPORTS.find((s) => s.id === sport)?.label ?? sport;
    activeChips.push({
      key: "sport",
      label,
      clear: () => update("sport", "", ["weightClass"]),
    });
  }
  const wc = params.get("weightClass");
  if (wc) activeChips.push({ key: "wc", label: wc, clear: () => update("weightClass", "") });
  const region = params.get("region");
  if (region) {
    const label =
      MATCHMAKER_COUNTRY_OPTIONS.find((c) => c.id === region)?.label ?? region;
    activeChips.push({ key: "region", label, clear: () => update("region", "") });
  }
  if (minScore > 0) {
    activeChips.push({
      key: "minScore",
      label: `ScoutScore ${minScore}+`,
      clear: () => update("minScore", ""),
    });
  }
  if (params.get("verification") === "verified") {
    activeChips.push({
      key: "verification",
      label: "Verified",
      clear: () => update("verification", ""),
    });
  }
  if (params.get("availableOnly") === "true") {
    activeChips.push({
      key: "availableOnly",
      label: "Available",
      clear: () => update("availableOnly", ""),
    });
  }
  if (gender === "male" || gender === "female") {
    const label = GENDER_FILTER_OPTIONS.find((g) => g.id === gender)?.label ?? gender;
    activeChips.push({ key: "gender", label, clear: () => update("gender", "") });
  }

  return (
    <aside className="rounded-xl border border-border bg-card p-4 space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search athletes..."
          className="pl-10 h-10 bg-input border-border text-sm"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", searchDraft.trim());
          }}
        />
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1 rounded-full border border-pwr-red/40 bg-pwr-red/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-pwr-red/20 transition-colors"
            >
              {chip.label}
              <X className="h-3 w-3 opacity-70" aria-hidden />
            </button>
          ))}
        </div>
      )}

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

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Discipline
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={!sport} onClick={() => update("sport", "", ["weightClass"])}>
            All
          </FilterPill>
          {SPORTS.map((s) => (
            <FilterPill
              key={s.id}
              active={sport === s.id}
              onClick={() =>
                update("sport", sport === s.id ? "" : s.id, ["weightClass"])
              }
            >
              {s.label}
            </FilterPill>
          ))}
        </div>
      </div>

      <DiscoverGenderFilter controls={controls} showLabel className="flex-col items-stretch gap-2" />

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Weight Class
        </p>
        <Select
          value={params.get("weightClass") || "all"}
          onValueChange={(v) => update("weightClass", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue placeholder="All classes" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
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
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Region
        </p>
        <Select
          value={params.get("region") || "all"}
          onValueChange={(v) => update("region", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent position="popper" className="z-[100]">
            <SelectItem value="all">All regions</SelectItem>
            {MATCHMAKER_COUNTRY_OPTIONS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            ScoutScore
          </p>
          <span className="text-xs text-muted-foreground">
            {scoreDraft > 0 ? `${scoreDraft}+` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={90}
          step={5}
          value={scoreDraft}
          onChange={(e) => {
            setScoreDraft(parseInt(e.target.value, 10) || 0);
          }}
          onPointerUp={() => {
            update("minScore", scoreDraft === 0 ? "" : String(scoreDraft));
          }}
          className="w-full h-1.5 rounded-full appearance-none bg-muted accent-pwr-red cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Any</span>
          <span>90+</span>
        </div>
      </div>

      <div className="space-y-4 pt-1 border-t border-border">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-foreground/85">Verified only</span>
          <Switch
            checked={params.get("verification") === "verified"}
            onCheckedChange={(on) => update("verification", on ? "verified" : "")}
            aria-label="Verified only"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-foreground/85">Available to sign</span>
          <Switch
            checked={params.get("availableOnly") === "true"}
            onCheckedChange={(on) => update("availableOnly", on ? "true" : "")}
            aria-label="Available to sign"
          />
        </div>
      </div>
    </aside>
  );
}
