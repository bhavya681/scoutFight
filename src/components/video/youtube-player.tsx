"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from "@/lib/data/youtube";
import type { VideoItem } from "@/types";

interface YouTubePlayerProps {
  video: VideoItem;
  compact?: boolean;
}

export function YouTubePlayer({ video, compact }: YouTubePlayerProps) {
  const watchUrl = video.watchUrl ?? getYouTubeWatchUrl(video.youtubeId);
  const embedUrl = getYouTubeEmbedUrl(video.youtubeId);

  if (compact) {
    return (
      <a
        href={watchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl overflow-hidden border border-border bg-card hover:border-brand/40 transition-all"
      >
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="400px"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
            <Play className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium line-clamp-2 group-hover:text-brand transition-colors">
            {video.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            Watch on YouTube <ExternalLink className="h-3 w-3" />
          </p>
        </div>
      </a>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
          {video.duration !== "—" && (
            <p className="text-xs text-muted-foreground mt-1">Duration: {video.duration}</p>
          )}
        </div>
        <Link
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline shrink-0"
        >
          Open on YouTube <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
