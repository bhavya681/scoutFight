"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { YouTubePlayer } from "@/components/video/youtube-player";
import { buildYouTubeSearchUrl } from "@/lib/data/youtube";
import type { VideoItem } from "@/types";

interface YouTubeSearchFallbackProps {
  query: string;
  athleteName: string;
  talentSlug?: string;
  /** Server-rendered videos when available */
  initialVideos?: VideoItem[];
}

export function YouTubeSearchFallback({
  query,
  athleteName,
  talentSlug = "",
  initialVideos = [],
}: YouTubeSearchFallbackProps) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [loading, setLoading] = useState(initialVideos.length === 0);
  const [error, setError] = useState<string | null>(null);
  const searchUrl = buildYouTubeSearchUrl(query);

  useEffect(() => {
    if (initialVideos.length > 0) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          q: query,
          name: athleteName,
          slug: talentSlug,
          limit: "6",
        });
        const res = await fetch(`/api/youtube/search?${params}`);
        const data = (await res.json()) as { videos?: VideoItem[] };
        if (!cancelled) {
          setVideos(data.videos ?? []);
          if ((data.videos ?? []).length === 0) {
            setError("Could not load previews — open YouTube search below.");
          }
        }
      } catch {
        if (!cancelled) {
          setError("Could not load previews — open YouTube search below.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query, athleteName, talentSlug, initialVideos.length]);

  if (loading) {
    return (
      <Card className="p-10 flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <p className="text-sm">Searching YouTube for &quot;{query}&quot;…</p>
      </Card>
    );
  }

  if (videos.length > 0) {
    return (
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5" />
          Results for &quot;{query}&quot; on YouTube (no API key required)
        </p>
        <YouTubePlayer video={videos[0]} />
        {videos.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.slice(1).map((v) => (
              <YouTubePlayer key={v.id} video={v} compact />
            ))}
          </div>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={searchUrl} target="_blank" rel="noopener noreferrer">
            More on YouTube <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-8 text-center space-y-4">
      <p className="text-sm text-muted-foreground">
        {error ?? `No embedded previews for ${athleteName} right now.`}
      </p>
      <Button asChild>
        <Link href={searchUrl} target="_blank" rel="noopener noreferrer">
          <Search className="h-4 w-4 mr-2" />
          Search &quot;{query}&quot; on YouTube
        </Link>
      </Button>
    </Card>
  );
}
