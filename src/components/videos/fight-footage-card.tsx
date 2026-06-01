"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, User, Video } from "lucide-react";
import { getYouTubeWatchUrl } from "@/lib/data/youtube";
import type { VideoItem } from "@/types";
import { sportTagLabel } from "@/lib/utils/video-labels";
import { cn } from "@/lib/utils";

function formatDurationBadge(duration: string): string {
  if (!duration || duration === "—") return "—";
  if (/^\d{1,2}:\d{2}$/.test(duration)) return duration;
  const m = duration.match(/(\d+)/);
  if (m) {
    const sec = parseInt(m[1], 10);
    const mm = Math.floor(sec / 60);
    const ss = sec % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
  return duration.slice(0, 5);
}

export function FightFootageCard({ video }: { video: VideoItem }) {
  const watchUrl = video.watchUrl ?? getYouTubeWatchUrl(video.youtubeId);
  const tag = sportTagLabel(video.sport);
  const profileHref =
    video.talentType === "athlete"
      ? `/athletes/${video.talentSlug}`
      : `/professionals/${video.talentSlug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card",
        "transition-all duration-300 hover:border-pwr-red/35 hover:shadow-[0_12px_40px_-12px_rgba(227,27,35,0.35)]"
      )}
    >
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-video overflow-hidden bg-muted"
      >
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

        <span className="absolute top-3 left-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-pwr-red text-white shadow-md">
          {tag}
        </span>

        <span className="absolute bottom-3 right-3 rounded bg-black/75 px-2 py-0.5 text-[11px] font-mono text-foreground tabular-nums">
          {formatDurationBadge(video.duration)}
        </span>

        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pwr-red shadow-lg shadow-pwr-red/40 transition-transform group-hover:scale-110">
            <Play className="h-6 w-6 text-white fill-white ml-0.5" />
          </span>
        </span>
      </a>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-pwr-red transition-colors">
          <a href={watchUrl} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </h3>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <Link
            href={profileHref}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors min-w-0"
          >
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Profile: <span className="text-foreground/85">{video.talentName}</span>
            </span>
          </Link>
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-pwr-red shrink-0 hover:underline"
          >
            <Video className="h-4 w-4" />
            YouTube
          </a>
        </div>
      </div>
    </article>
  );
}
