import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { RankingsHero } from "@/components/rankings/rankings-hero";
import { RankingsFilters } from "@/components/rankings/rankings-filters";
import { RankingsToolbar } from "@/components/rankings/rankings-toolbar";
import { RankingsTable } from "@/components/rankings/rankings-table";
import { DiscoverPagination } from "@/components/discover/discover-pagination";
import {
  queryRankingsTalent,
  RANKINGS_PAGE_SIZE,
  type RankingsSearchParams,
} from "@/lib/data/rankings-query";
import { getRankedTalent } from "@/lib/data/talent-repository";
import { getAthleteDiscoveryIndex } from "@/lib/data/athlete-discovery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Athlete Rankings",
  description:
    "Live combat sports athlete rankings from Wikipedia, Wikidata, and TheSportsDB — filter by sport and ScoutScore.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<RankingsSearchParams>;
}

async function RankingsResults({ params }: { params: RankingsSearchParams }) {
  const { talent, total } = await queryRankingsTalent(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / RANKINGS_PAGE_SIZE));
  const startRank = (page - 1) * RANKINGS_PAGE_SIZE + 1;
  const hasFilters = Boolean(
    params.q || params.sport || params.weightClass || params.minScore
  );

  if (total === 0) {
    return (
      <>
        <RankingsToolbar count={0} />
        <div className="rounded-xl border border-border bg-muted/50 p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            {hasFilters
              ? "No athletes match your search or filters."
              : "No athletes loaded yet. Try again shortly."}
          </p>
          {hasFilters && (
            <Button variant="outline" className="border-border" asChild>
              <Link href="/rankings">Clear filters</Link>
            </Button>
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <RankingsToolbar count={total} />
      <RankingsTable talents={talent} startRank={startRank} />
      <DiscoverPagination page={page} totalPages={totalPages} />
    </>
  );
}

async function FiltersWithCount({ params }: { params: RankingsSearchParams }) {
  const { total } = await queryRankingsTalent(params);
  return <RankingsFilters count={total} />;
}

export default async function RankingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [allRanked, discovery] = await Promise.all([
    getRankedTalent({}),
    getAthleteDiscoveryIndex(),
  ]);
  const disciplineCount = Object.values(discovery.sportCounts).filter(
    (n) => (n ?? 0) > 0
  ).length;

  return (
    <div className="page-shell">
      <RankingsHero
        rankedCount={allRanked.length}
        disciplineCount={disciplineCount || 6}
      />

      <div className="page-container py-5 sm:py-8 md:py-10 pb-16 sm:pb-20">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl -mt-8" />}>
          <FiltersWithCount params={params} />
        </Suspense>

        <Suspense
          fallback={
            <div className="rounded-xl border border-border overflow-hidden divide-y divide-white/5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-none" />
              ))}
            </div>
          }
        >
          <RankingsResults params={params} />
        </Suspense>
      </div>
    </div>
  );
}
