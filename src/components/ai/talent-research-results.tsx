"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TalentResearchPick = {
  slug: string;
  displayName: string;
  sport: string;
  weightClass?: string;
  nationality: string;
  record?: string;
  score?: number;
  reasons: string[];
  profileUrl: string;
};

type TalentResearchResultsProps = {
  matches: TalentResearchPick[];
  poolSize?: number | null;
  source?: string | null;
  onNavigateAway?: () => void;
  className?: string;
};

export function TalentResearchResults({
  matches,
  poolSize,
  source,
  onNavigateAway,
  className,
}: TalentResearchResultsProps) {
  if (matches.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {poolSize != null && (
          <span>
            {poolSize} in pool · showing {matches.length}
          </span>
        )}
        {source && (
          <Badge variant="secondary" className="text-[10px] uppercase font-normal">
            {source === "openai" ? "AI + live data" : "Live rankings"}
          </Badge>
        )}
      </div>
      <ul className="space-y-2" role="list">
        {matches.map((m, i) => (
          <li key={m.slug}>
            <Link
              href={m.profileUrl}
              onClick={onNavigateAway}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-pwr-red/40 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pwr-red/50"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pwr-red/10 text-xs font-bold text-pwr-red tabular-nums"
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground group-hover:text-pwr-red transition-colors">
                  {m.displayName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                  {m.sport.replace(/_/g, " ")}
                  {m.weightClass ? ` · ${m.weightClass}` : ""} · {m.nationality}
                  {m.record ? ` · ${m.record}` : ""}
                </p>
                {m.reasons.length > 0 && (
                  <p className="text-xs text-muted-foreground/90 mt-1.5 line-clamp-2">
                    {m.reasons.join(" · ")}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1 group-hover:text-pwr-red transition-colors" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
