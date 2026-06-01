"use client";

import Link from "next/link";
import { Bookmark, BadgeCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { Professional } from "@/types";
import { computeProScoutScore } from "@/lib/utils/pro-scout-score";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  referee: "Referee",
  announcer: "Announcer",
  commentator: "Commentator",
  manager: "Manager",
  agent: "Agent",
  coach: "Coach",
};

export function ProfessionalCard({
  pro,
  index = 0,
}: {
  pro: Professional;
  index?: number;
}) {
  const { toggleAthlete, isAthleteFavorite } = useFavoritesStore();
  const favorited = isAthleteFavorite(pro.id);
  const score = computeProScoutScore(pro, index);
  const roleLabel = ROLE_LABELS[pro.role] ?? pro.role;

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-4",
        "transition-all duration-300 hover:border-pwr-red/35 hover:shadow-[0_12px_40px_-12px_rgba(227,27,35,0.3)]"
      )}
    >
      <div className="flex gap-3">
        <UserAvatar
          name={pro.displayName}
          src={pro.avatarUrl}
          size="md"
          shape="rounded"
          placeholderVariant="official"
          className="shrink-0 rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-wide leading-tight truncate">
                {pro.displayName}
              </h3>
              <span className="inline-block mt-1 rounded-md bg-pwr-red/15 border border-pwr-red/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pwr-red">
                {roleLabel}
              </span>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pwr-red font-display text-base font-bold text-foreground shadow-md shadow-pwr-red/25">
              {score}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]">
        {pro.bio}
      </p>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" />
          {pro.nationality}
        </span>
        {pro.verification === "verified" && (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-pwr-red" />
            Verified
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1 h-9 text-xs font-semibold uppercase tracking-wide" asChild>
          <Link href={`/professionals/${pro.slug}`}>View Profile</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 border-border bg-background hover:bg-muted",
            favorited && "border-pwr-red/50 text-pwr-red"
          )}
          onClick={() => toggleAthlete(pro.id)}
          aria-label="Save professional"
        >
          <Bookmark className={cn("h-4 w-4", favorited && "fill-current")} />
        </Button>
      </div>
    </article>
  );
}
