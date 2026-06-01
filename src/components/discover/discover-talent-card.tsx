"use client";

import Link from "next/link";
import Image from "next/image";
import { Bookmark, BadgeCheck, MapPin, Swords } from "lucide-react";
import {
  CompareAddButton,
  compareItemFromTalent,
} from "@/components/compare/compare-add-button";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useFavoritesStore } from "@/stores/favorites-store";
import type { TalentProfile } from "@/types";
import { formatRecord } from "@/lib/utils";
import { computeScoutScore, computeFinishRate } from "@/lib/utils/scout-score";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import { cn } from "@/lib/utils";

interface DiscoverTalentCardProps {
  talent: TalentProfile;
  className?: string;
}

export function DiscoverTalentCard({ talent, className }: DiscoverTalentCardProps) {
  const { toggleAthlete, isAthleteFavorite } = useFavoritesStore();
  const favorited = isAthleteFavorite(talent.id);
  const score = computeScoutScore(talent);
  const finish = computeFinishRate(talent);
  const record = talent.record
    ? formatRecord(talent.record.wins, talent.record.losses, talent.record.draws)
    : undefined;
  const sportLabel = talent.sport.replace(/_/g, " ");
  const subtitle = [sportLabel, talent.weightClass].filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background",
        "transition-all duration-300 hover:border-pwr-red/40 hover:shadow-[0_16px_48px_-12px_rgba(227,27,35,0.35)]",
        className
      )}
    >
      <Link href={`/athletes/${talent.slug}`} className="relative block aspect-[3/4] overflow-hidden">
        {isUsableImageUrl(talent.avatarUrl) ? (
          <Image
            src={talent.avatarUrl}
            alt={talent.displayName}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <UserAvatar
            name={talent.displayName}
            src={talent.avatarUrl}
            size="fill"
            shape="rounded"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        {talent.verification === "verified" && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-sm border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-pwr-red" />
            Verified
          </span>
        )}

        <div className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-lg bg-pwr-red shadow-lg shadow-pwr-red/30">
          <span className="font-display text-lg font-bold text-foreground leading-none">{score}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 pt-16">
          <h3 className="font-display text-xl font-bold uppercase tracking-wide text-foreground leading-tight">
            {talent.displayName}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">{subtitle}</p>
        </div>
      </Link>

      <div className="flex items-center gap-3 border-t border-border bg-card px-4 py-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1 min-w-0 truncate">
          <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
          {talent.nationality}
        </span>
        {record && (
          <span className="inline-flex items-center gap-1 shrink-0">
            <Swords className="h-3 w-3 text-muted-foreground" />
            {record}
          </span>
        )}
        {finish && <span className="ml-auto shrink-0 font-medium text-foreground/85">{finish}</span>}
      </div>

      <div className="flex gap-2 p-3 pt-0">
        <Button className="flex-1 h-9 text-xs font-semibold uppercase tracking-wide" asChild>
          <Link href={`/athletes/${talent.slug}`}>View Profile</Link>
        </Button>
        <CompareAddButton
          item={compareItemFromTalent(talent)}
          variant="outline"
          className="border-border bg-card hover:bg-muted"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 border-border bg-card hover:bg-muted",
            favorited && "border-pwr-red/50 text-pwr-red"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleAthlete(talent.id);
          }}
          aria-label={favorited ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Bookmark className={cn("h-4 w-4", favorited && "fill-current")} />
        </Button>
      </div>
    </article>
  );
}
