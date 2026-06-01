"use client";

import Link from "next/link";
import { Bookmark, BadgeCheck } from "lucide-react";
import {
  CompareAddButton,
  compareItemFromTalent,
} from "@/components/compare/compare-add-button";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { TalentProfile } from "@/types";
import { formatRecord } from "@/lib/utils";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { cn } from "@/lib/utils";

export function DiscoverListRow({ talent }: { talent: TalentProfile }) {
  const { toggleAthlete, isAthleteFavorite } = useFavoritesStore();
  const favorited = isAthleteFavorite(talent.id);
  const score = computeScoutScore(talent);
  const record = talent.record
    ? formatRecord(talent.record.wins, talent.record.losses, talent.record.draws)
    : "—";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/60 p-3 hover:border-pwr-red/30 transition-colors">
      <UserAvatar
        name={talent.displayName}
        src={talent.avatarUrl}
        size="md"
        shape="rounded"
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/athletes/${talent.slug}`}
            className="font-display font-bold text-foreground uppercase tracking-wide hover:text-pwr-red transition-colors"
          >
            {talent.displayName}
          </Link>
          {talent.verification === "verified" && (
            <BadgeCheck className="h-4 w-4 text-pwr-red shrink-0" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
          {talent.sport.replace(/_/g, " ")}
          {talent.weightClass ? ` · ${talent.weightClass}` : ""} · {talent.nationality} · {record}
        </p>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pwr-red font-display font-bold text-foreground">
        {score}
      </div>
      <CompareAddButton
        item={compareItemFromTalent(talent)}
        variant="outline"
        className="border-border bg-card shrink-0"
      />
      <Button size="sm" className="shrink-0 hidden md:inline-flex min-h-[40px]" asChild>
        <Link href={`/athletes/${talent.slug}`}>View</Link>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn("shrink-0 border-border", favorited && "text-pwr-red")}
        onClick={() => toggleAthlete(talent.id)}
      >
        <Bookmark className={cn("h-4 w-4", favorited && "fill-current")} />
      </Button>
    </div>
  );
}
