"use client";

import Link from "next/link";
import Image from "next/image";
import { X, BadgeCheck, Play } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import type { TalentProfile } from "@/types";
import { useCompareStore } from "@/stores/compare-store";
export function CompareAthleteCard({ talent }: { talent: TalentProfile }) {
  const { remove } = useCompareStore();
  const score = computeScoutScore(talent);
  const subtitle = [
    talent.sport.replace(/_/g, " ").toUpperCase(),
    talent.weightClass,
    talent.nationality,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-card min-w-[200px] flex-1">
      <div className="relative aspect-[3/4] bg-muted">
        {isUsableImageUrl(talent.avatarUrl) ? (
          <Image
            src={talent.avatarUrl}
            alt={talent.displayName}
            fill
            className="object-cover object-top grayscale contrast-[1.05]"
            sizes="280px"
          />
        ) : (
          <UserAvatar name={talent.displayName} src={talent.avatarUrl} size="fill" shape="rounded" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <button
          type="button"
          onClick={() => remove(talent.id)}
          className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-pwr-red/80 transition-colors"
          aria-label="Remove from compare"
        >
          <X className="h-4 w-4" />
        </button>

        <Link
          href={`/videos?q=${encodeURIComponent(talent.displayName)}`}
          className="absolute top-2 left-12 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white hover:bg-muted"
          aria-label="Watch footage"
        >
          <Play className="h-4 w-4" />
        </Link>

        <div className="absolute top-2 right-2 flex h-11 w-11 items-center justify-center rounded-lg bg-pwr-red font-display text-lg font-bold text-foreground shadow-lg">
          {score}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1.5">
            <Link
              href={`/athletes/${talent.slug}`}
              className="font-display text-lg font-bold uppercase tracking-wide text-foreground hover:text-pwr-red transition-colors"
            >
              {talent.displayName}
            </Link>
            {talent.verification === "verified" && (
              <BadgeCheck className="h-4 w-4 text-pwr-red shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{subtitle}</p>
        </div>
      </div>
    </article>
  );
}
