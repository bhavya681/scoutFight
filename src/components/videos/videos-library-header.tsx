import { Video } from "lucide-react";
import { DirectoryCinematicHero } from "@/components/directory/directory-cinematic-hero";

export function VideosLibraryHeader({ videoCount = 0 }: { videoCount?: number }) {
  const countLabel = videoCount > 0 ? videoCount.toLocaleString() : "Live";

  return (
    <DirectoryCinematicHero
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <Video className="h-3.5 w-3.5" />
          Video scouting
        </span>
      }
      title={
        <>
          Fight <span className="text-gradient">Footage</span> Library
        </>
      }
      description="Highlights, full fights, and breakdowns tagged by athlete and discipline — built for tape study and recruiter review."
      ctas={[
        { label: "Browse footage", href: "#videos-grid" },
        { label: "Find athletes", href: "/discover", variant: "outline" },
      ]}
      stats={[
        { value: countLabel, label: "Videos indexed" },
        { value: "6+", label: "Disciplines" },
        { value: "YouTube", label: "Source" },
      ]}
    />
  );
}
