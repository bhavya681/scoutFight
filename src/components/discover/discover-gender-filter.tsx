"use client";

import type { ReactNode } from "react";
import { GENDER_FILTER_OPTIONS } from "@/lib/constants";
import type { DirectoryFilterControls } from "@/lib/hooks/use-directory-filters";
import { cn } from "@/lib/utils";

function GenderPill({
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
        "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-pwr-red text-white shadow-md shadow-pwr-red/25"
          : "bg-muted text-foreground/85 hover:bg-surface-hover border border-border"
      )}
    >
      {children}
    </button>
  );
}

export function DiscoverGenderFilter({
  controls,
  className,
  showLabel = true,
}: {
  controls: DirectoryFilterControls;
  className?: string;
  showLabel?: boolean;
}) {
  const { params, update, toggle } = controls;
  const gender = params.get("gender") ?? "";

  return (
    <div
      className={cn("flex items-center gap-2 flex-wrap", className)}
      role="group"
      aria-label="Filter by gender"
    >
      {showLabel && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
          Gender
        </span>
      )}
      <div className="flex gap-1.5 flex-wrap">
        <GenderPill active={!gender} onClick={() => update("gender", "")}>
          All
        </GenderPill>
        {GENDER_FILTER_OPTIONS.map((g) => (
          <GenderPill
            key={g.id}
            active={gender === g.id}
            onClick={() => toggle("gender", g.id)}
          >
            {g.label}
          </GenderPill>
        ))}
      </div>
    </div>
  );
}
