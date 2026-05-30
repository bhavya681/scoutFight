import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CountryFlag } from "@/components/ui/country-flag";
import { RankingsFilters } from "@/components/rankings/rankings-filters";
import { getRankedTalent, getAllTalent } from "@/lib/data/talent-repository";
import { getAthleteDiscoveryIndex } from "@/lib/data/athlete-discovery";
import { SPORTS } from "@/lib/constants";
import { formatRecord } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Rankings",
  description: "Live athlete rankings from ScoutFight discovery — filter by sport and weight class.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{
    sport?: string;
    weightClass?: string;
  }>;
}

async function RankingsTable({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const sport = searchParams.sport;
  const weightClass = searchParams.weightClass;
  const [ranked, all, discovery] = await Promise.all([
    getRankedTalent({ sport, weightClass }),
    getAllTalent(),
    getAthleteDiscoveryIndex(),
  ]);

  const sportLabel = sport
    ? SPORTS.find((s) => s.id === sport)?.label ?? sport
    : "All sports";
  const hasFilters = Boolean(sport || weightClass);

  if (ranked.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center space-y-4">
        <p className="text-muted-foreground">
          {hasFilters
            ? "No athletes match this sport or weight class in the live directory."
            : "No athletes loaded yet. Try again shortly."}
        </p>
        {hasFilters && (
          <>
            <p className="text-sm text-muted-foreground">
              {discovery.sportCounts[sport as keyof typeof discovery.sportCounts] ?? 0}{" "}
              {sportLabel} athletes indexed — {all.length} total.
            </p>
            <Button variant="outline" asChild>
              <Link href="/rankings">Clear filters</Link>
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4">
        Showing {ranked.length} athlete{ranked.length === 1 ? "" : "s"}
        {sport ? ` · ${sportLabel}` : ""}
        {weightClass ? ` · ${weightClass}` : ""}
        . Ordered by record, profile quality, and featured seed data (Wikipedia / TheSportsDB).
      </p>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <div className="hidden sm:grid sm:grid-cols-[3rem_3rem_1fr_6rem_5rem] gap-4 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
          <span>#</span>
          <span aria-hidden />
          <span>Athlete</span>
          <span>Record</span>
          <span className="text-right">Sport</span>
        </div>
        <div className="divide-y divide-border">
          {ranked.map((t, i) => (
            <Link
              key={t.slug}
              href={`/athletes/${t.slug}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors sm:grid sm:grid-cols-[3rem_3rem_1fr_6rem_5rem] sm:gap-4"
            >
              <span className="font-bold w-8 sm:w-auto text-center text-brand shrink-0">
                {i + 1}
              </span>
              <UserAvatar
                name={t.displayName}
                src={t.avatarUrl}
                size="sm"
                shape="rounded"
                className="border border-border shrink-0"
              />
              <div className="flex-1 min-w-0 sm:col-span-1">
                <p className="font-medium truncate">{t.displayName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap mt-0.5">
                  {t.weightClass && <span>{t.weightClass}</span>}
                  <CountryFlag
                    nationality={t.nationality}
                    countryCode={t.countryCode}
                    size="xs"
                    showLabel={!t.weightClass}
                  />
                  {t.promotion && (
                    <span className="truncate hidden md:inline text-muted-foreground/80">
                      · {t.promotion}
                    </span>
                  )}
                </p>
              </div>
              <div className="shrink-0 text-sm font-mono tabular-nums sm:text-center">
                {t.record ? (
                  formatRecord(t.record.wins, t.record.losses, t.record.draws)
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </div>
              <Badge
                variant="sport"
                className="shrink-0 uppercase text-[10px] sm:justify-self-end hidden sm:inline-flex"
              >
                {t.sport.replace(/_/g, " ")}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default async function RankingsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-16">
      <p className="section-label mb-2">Live directory</p>
      <h1 className="text-3xl font-bold tracking-tight">Rankings</h1>
      <p className="text-muted-foreground mt-2 mb-8 max-w-2xl">
        Athletes ranked from live Wikipedia, Wikidata, and TheSportsDB data — updated hourly.
        Filter by sport and weight class.
      </p>

      <Suspense fallback={<Skeleton className="h-10 w-full max-w-md rounded-lg mb-8" />}>
        <RankingsFilters />
      </Suspense>

      <Suspense
        fallback={
          <div className="rounded-xl border border-border overflow-hidden bg-card divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none" />
            ))}
          </div>
        }
      >
        <RankingsTable searchParams={params} />
      </Suspense>
    </div>
  );
}
