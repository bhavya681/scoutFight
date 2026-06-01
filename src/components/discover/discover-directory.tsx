"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { TalentProfile } from "@/types";
import {
  useDirectoryFilters,
  type DirectoryFilterControls,
} from "@/lib/hooks/use-directory-filters";
import { DiscoverSidebarFilters } from "@/components/discover/discover-sidebar-filters";
import { DiscoverToolbar } from "@/components/discover/discover-toolbar";
import { DiscoverTalentCard } from "@/components/discover/discover-talent-card";
import { DiscoverListRow } from "@/components/discover/discover-list-row";
import { DiscoverPagination } from "@/components/discover/discover-pagination";
import {
  DISCOVER_PAGE_SIZE,
  type DiscoverSearchParams,
} from "@/lib/data/discover-query";
import { discoverParamsToQueryString } from "@/lib/data/discover-filter-key";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DiscoverDirectoryProps {
  initialTalent: TalentProfile[];
  initialTotal: number;
  initialParams: DiscoverSearchParams;
}

function ResultsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function DiscoverResultsPanel({
  controls,
  talent,
  total,
  loading,
}: {
  controls: DirectoryFilterControls;
  talent: TalentProfile[];
  total: number;
  loading: boolean;
}) {
  const { params } = controls;
  const view = params.get("view") === "list" ? "list" : "grid";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / DISCOVER_PAGE_SIZE));

  return (
    <div className="relative flex-1 min-w-0">
      {loading && (
        <div
          className="absolute inset-0 z-10 rounded-xl content-overlay backdrop-blur-[1px] pointer-events-none"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "transition-opacity duration-200",
          loading && "opacity-60"
        )}
      >
        <DiscoverToolbar count={total} controls={controls} />

        {total === 0 && !loading ? (
          <div className="rounded-xl border border-border bg-muted/50 py-16 text-center">
            <p className="text-muted-foreground">No athletes match your filters.</p>
            <Button variant="outline" className="mt-4 border-border" asChild>
              <Link href="/discover">Reset filters</Link>
            </Button>
          </div>
        ) : view === "list" ? (
          <div className="space-y-3">
            {talent.map((t) => (
              <DiscoverListRow key={t.id} talent={t} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {talent.map((t) => (
              <DiscoverTalentCard key={t.id} talent={t} />
            ))}
          </div>
        )}

        <DiscoverPagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export function DiscoverDirectory({
  initialTalent,
  initialTotal,
  initialParams,
}: DiscoverDirectoryProps) {
  const controls = useDirectoryFilters("/discover");
  const initialQuery = discoverParamsToQueryString(initialParams);
  const [talent, setTalent] = useState(initialTalent);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const lastFetchedQuery = useRef(initialQuery);

  useEffect(() => {
    const qs = controls.queryString;
    if (qs === lastFetchedQuery.current) return;

    const ac = new AbortController();
    setLoading(true);

    fetch(`/api/discover?${controls.queryString}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Discover fetch failed");
        return res.json() as Promise<{ talent: TalentProfile[]; total: number }>;
      })
      .then((data) => {
        setTalent(data.talent);
        setTotal(data.total);
        lastFetchedQuery.current = qs;
      })
      .catch((err) => {
        if (err?.name !== "AbortError") console.error(err);
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });

    return () => ac.abort();
  }, [controls.queryString]);

  const showInitialSkeleton = talent.length === 0 && loading;

  return (
    <div className="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
      <div className="w-full md:w-[260px] lg:w-[280px] shrink-0 md:self-start">
        <div className="md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:overscroll-y-contain scroll-touch pr-0.5 -mx-1 px-1 sm:mx-0 sm:px-0">
          <DiscoverSidebarFilters controls={controls} />
        </div>
      </div>

      <main className="flex-1 min-w-0 w-full">
        {showInitialSkeleton ? (
          <ResultsSkeleton />
        ) : (
          <DiscoverResultsPanel
            controls={controls}
            talent={talent}
            total={total}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
}
