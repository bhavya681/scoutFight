import type { Metadata } from "next";
import { getAllVideos } from "@/lib/data/talent-repository";
import { YouTubePlayer } from "@/components/video/youtube-player";

export const metadata: Metadata = { title: "Videos" };

export const revalidate = 3600;

export default async function MediaPage() {
  const videos = await getAllVideos(8);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Video scouting</h1>
      <p className="text-sm text-muted-foreground">Live YouTube results for indexed athletes.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((v) => (
          <YouTubePlayer key={v.id} video={v} compact />
        ))}
      </div>
    </div>
  );
}
