import { Trophy } from "lucide-react";
import { DirectoryCinematicHero } from "@/components/directory/directory-cinematic-hero";

export function RankingsHero({
  rankedCount,
  disciplineCount,
}: {
  rankedCount: number;
  disciplineCount: number;
}) {
  return (
    <DirectoryCinematicHero
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <span className="h-1.5 w-1.5 rounded-full bg-pwr-red animate-pulse" />
          <Trophy className="h-3.5 w-3.5" />
          Live rankings
        </span>
      }
      title={
        <>
          Athlete <span className="text-gradient">Rankings</span>
        </>
      }
      description="Live leaderboards from Wikipedia, Wikidata, and TheSportsDB — filter by discipline, weight class, and ScoutScore to find top prospects."
      ctas={[{ label: "View rankings", href: "#rankings-grid" }]}
      stats={[
        { value: rankedCount.toLocaleString(), label: "Ranked athletes" },
        { value: String(disciplineCount), label: "Disciplines" },
        { value: "Hourly", label: "Data sync" },
      ]}
    />
  );
}
