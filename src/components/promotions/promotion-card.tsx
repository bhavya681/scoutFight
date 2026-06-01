"use client";

import Link from "next/link";
import { Bookmark, BadgeCheck, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrgLogo } from "@/components/organizations/org-logo";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { Organization } from "@/types";
import { computeOrgScoutScore } from "@/lib/utils/org-scout-score";
import { cn } from "@/lib/utils";

const SPORT_LABEL: Record<string, string> = {
  mma: "MMA",
  boxing: "Boxing",
  wrestling: "Wrestling",
  kickboxing: "Kickboxing",
  muay_thai: "Muay Thai",
};

export function PromotionCard({
  org,
  index = 0,
}: {
  org: Organization;
  index?: number;
}) {
  const { togglePromotion, isPromotionFavorite } = useFavoritesStore();
  const saved = isPromotionFavorite(org.id);
  const score = computeOrgScoutScore(org, index);
  const sportLabel = org.sports.map((s) => SPORT_LABEL[s] ?? s).join(" · ");

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-4",
        "transition-all duration-300 hover:border-pwr-red/35 hover:shadow-[0_12px_40px_-12px_rgba(227,27,35,0.3)]"
      )}
    >
      <div className="flex gap-3">
        <OrgLogo
          src={org.logoUrl}
          alt={org.name}
          size="md"
          className="shrink-0 rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-wide leading-tight truncate">
                {org.name}
              </h3>
              {sportLabel ? (
                <span className="inline-block mt-1 rounded-md bg-pwr-red/15 border border-pwr-red/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pwr-red line-clamp-1">
                  {sportLabel}
                </span>
              ) : null}
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pwr-red font-display text-base font-bold text-white shadow-md shadow-pwr-red/25">
              {score}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[3.75rem]">
        {org.description}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          {org.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5 shrink-0" />
          {org.rosterCount > 0 ? org.rosterCount : "—"} athletes
        </span>
        {org.verification === "verified" && (
          <span className="inline-flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-pwr-red" />
            Verified
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1 h-9 text-xs font-semibold uppercase tracking-wide" asChild>
          <Link href={`/organizations/${org.slug}`}>View Promotion</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 border-border bg-background hover:bg-muted",
            saved && "border-pwr-red/50 text-pwr-red"
          )}
          onClick={() => togglePromotion(org.id)}
          aria-label="Save promotion"
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        </Button>
      </div>
    </article>
  );
}
