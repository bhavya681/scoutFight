import type { Metadata } from "next";
import Link from "next/link";
import { getAllVideos } from "@/lib/data/talent-repository";
import { getYouTubeApiStatus, buildYouTubeSearchUrl } from "@/lib/data/youtube";
import { YouTubePlayer } from "@/components/video/youtube-player";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Video Scouting",
  description: "Real YouTube highlights for combat sports athletes.",
};

export const revalidate = 3600;

function VideosEmptyState({
  status,
}: {
  status: Awaited<ReturnType<typeof getYouTubeApiStatus>>;
}) {
  const searchUrl = buildYouTubeSearchUrl("UFC MMA highlights");

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-6 max-w-2xl space-y-4">
      <p className="font-medium text-foreground">No videos cached yet</p>
      <p className="text-sm text-muted-foreground">
        {status.state === "ok"
          ? "Try opening an athlete profile — videos are loaded by searching their name on YouTube."
          : status.state === "innertube"
            ? status.note
            : "Videos are found by searching athlete names on YouTube (no API key required)."}
      </p>
      <Button variant="outline" size="sm" asChild>
        <Link href={searchUrl} target="_blank" rel="noopener noreferrer">
          Browse combat highlights on YouTube
          <ExternalLink className="h-3.5 w-3.5 ml-2" />
        </Link>
      </Button>
      <p className="text-xs text-muted-foreground">
        Optional: add <code className="text-brand">YOUTUBE_API_KEY=AIzaSy…</code> in{" "}
        <code className="text-brand">.env.local</code> for Google&apos;s official API (higher quota).
      </p>
    </div>
  );
}

export default async function VideosPage() {
  const [videos, ytStatus] = await Promise.all([getAllVideos(18), getYouTubeApiStatus()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-10">Video scouting</h1>
      {videos.length === 0 ? (
        <VideosEmptyState status={ytStatus} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={`${video.id}-${video.talentSlug}`}>
              <YouTubePlayer video={video} compact />
              <Link
                href={`/athletes/${video.talentSlug}`}
                className="text-xs text-muted-foreground hover:text-brand mt-2 inline-block"
              >
                Profile: {video.talentName}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
