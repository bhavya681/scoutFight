import { Suspense } from "react";
import type { Metadata } from "next";
import { DiscoverDirectoryHeader } from "@/components/discover/discover-directory-header";
import { DiscoverDirectory } from "@/components/discover/discover-directory";
import {
  queryDiscoverTalent,
  type DiscoverSearchParams,
} from "@/lib/data/discover-query";
import { discoverParamsToQueryString } from "@/lib/data/discover-filter-key";
import { getAllTalent } from "@/lib/data/talent-repository";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Discover Athletes",
  description:
    "Browse, filter, and compare combat sports athletes by discipline, weight, region, and ScoutScore.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<DiscoverSearchParams>;
}

function DiscoverDirectoryFallback() {
  return (
    <div className="flex flex-col md:flex-row gap-5 sm:gap-6 md:gap-8 items-start">
      <Skeleton className="h-[520px] w-full md:w-[260px] lg:w-[280px] shrink-0 rounded-xl" />
      <div className="flex-1 space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function DiscoverDirectoryLoader({
  params,
}: {
  params: DiscoverSearchParams;
}) {
  const { talent, total } = await queryDiscoverTalent(params);

  return (
    <DiscoverDirectory
      key={discoverParamsToQueryString(params)}
      initialTalent={talent}
      initialTotal={total}
      initialParams={params}
    />
  );
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const directoryTotal = (await getAllTalent()).length;

  return (
    <div className="page-shell">
      <DiscoverDirectoryHeader totalAthletes={directoryTotal} />
      <div className="page-container py-5 sm:py-8 md:py-10 pb-16 sm:pb-20">
        <Suspense fallback={<DiscoverDirectoryFallback />}>
          <DiscoverDirectoryLoader params={params} />
        </Suspense>
      </div>
    </div>
  );
}
