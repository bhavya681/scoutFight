import Link from "next/link";
import { Users, BarChart2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";
import { formatDirectoryCount } from "@/lib/data/discover-query";
import { SPORTS } from "@/lib/constants";

export function DiscoverDirectoryHeader({ totalAthletes }: { totalAthletes: number }) {
  const countLabel = formatDirectoryCount(totalAthletes);

  return (
    <MarketingPageHero
      variant="solid"
      badge={
        <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
          <Users className="h-3.5 w-3.5" />
          Athlete directory
        </span>
      }
      title={
        <>
          Discover Combat Sports{" "}
          <span className="text-gradient">Talent</span>
        </>
      }
      description={`Browse, filter, and compare ${countLabel} verified athletes across every discipline worldwide.`}
      stats={[
        { value: countLabel, label: "Athletes" },
        { value: String(SPORTS.length), label: "Disciplines" },
        { value: "Live", label: "ScoutScore" },
      ]}
      actions={
        <div className="flex flex-col gap-2">
          <Button className="w-full h-11 font-semibold" asChild>
            <Link href="/compare">
              <BarChart2 className="h-4 w-4" />
              Compare athletes
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 border-border bg-background/80 text-white hover:bg-muted"
            asChild
          >
            <Link href="/dashboard/lists?role=recruiter">
              <Plus className="h-4 w-4" />
              Add to shortlist
            </Link>
          </Button>
        </div>
      }
    />
  );
}
