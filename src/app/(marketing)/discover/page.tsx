import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { TalentCard } from "@/components/talent/talent-card";
import { SearchFilters } from "@/components/athletes/search-filters";
import { getAllTalent, searchTalent } from "@/lib/data/talent-repository";
import { getAthleteDiscoveryIndex } from "@/lib/data/athlete-discovery";
import { SPORTS } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Discover Athletes",
  description: "Search wrestlers, MMA fighters, and boxers with live Wikipedia data.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sport?: string;
    weightClass?: string;
    gender?: string;
    verification?: string;
    availableOnly?: string;
  }>;
}

async function TalentGrid({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const filters = {
    query: searchParams.q,
    sport: searchParams.sport,
    weightClass: searchParams.weightClass,
    gender: searchParams.gender,
    verification: searchParams.verification,
    availableOnly: searchParams.availableOnly === "true",
  };
  const [talent, total, discovery] = await Promise.all([
    searchTalent(filters),
    getAllTalent(),
    getAthleteDiscoveryIndex(),
  ]);

  const hasActiveFilters = Boolean(
    filters.query ||
      filters.sport ||
      filters.weightClass ||
      filters.gender ||
      filters.verification ||
      filters.availableOnly
  );

  if (talent.length === 0) {
    return (
      <div className="text-center py-16 col-span-full space-y-4">
        <p className="text-muted-foreground">
          {hasActiveFilters
            ? "No athletes match your filters."
            : "No athletes loaded yet. Try again in a moment."}
        </p>
        {hasActiveFilters && (
          <p className="text-sm text-muted-foreground">
            {filters.sport ? (
              <>
                {discovery.sportCounts[filters.sport as keyof typeof discovery.sportCounts] ?? 0}{" "}
                {SPORTS.find((s) => s.id === filters.sport)?.label ?? filters.sport} athletes
                indexed — {total.length} total in directory.
              </>
            ) : (
              <>{total.length} athletes in the directory — adjust or clear filters.</>
            )}
          </p>
        )}
        {hasActiveFilters && (
          <Button variant="outline" asChild>
            <Link href="/discover">Clear all filters</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {talent.map((t, i) => (
        <TalentCard key={t.id} talent={t} index={i} />
      ))}
    </>
  );
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <>
    <div className="hero-gradient min-h-[40vh] border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="section-label mb-2">Talent search</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="section-title text-3xl sm:text-4xl">Discover athletes</h1>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Live data from Wikipedia. Highlight reels from YouTube.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/compare">Compare shortlist</Link>
          </Button>
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
        <SearchFilters />
      </Suspense>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
              ))}
            </>
          }
        >
          <TalentGrid searchParams={params} />
        </Suspense>
      </div>
    </div>
    </>
  );
}
