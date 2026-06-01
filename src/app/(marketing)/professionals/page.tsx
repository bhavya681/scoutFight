import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalsHero } from "@/components/professionals/professionals-hero";
import { ProfessionalsFilters } from "@/components/professionals/professionals-filters";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { DiscoverPagination } from "@/components/discover/discover-pagination";
import {
  queryProfessionals,
  countUniqueCountries,
  PROFESSIONALS_PAGE_SIZE,
  type ProfessionalsSearchParams,
} from "@/lib/data/professionals-query";
import { getAllProfessionals } from "@/lib/data/professional-repository";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Industry Professionals",
  description:
    "Referees, announcers, commentators, coaches, managers, and agents powering combat sports worldwide.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<ProfessionalsSearchParams>;
}

async function ProfessionalsGrid({ params }: { params: ProfessionalsSearchParams }) {
  const { professionals, total } = await queryProfessionals(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / PROFESSIONALS_PAGE_SIZE));
  const startIndex = (page - 1) * PROFESSIONALS_PAGE_SIZE;

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 py-16 text-center">
        <p className="text-muted-foreground">No professionals match your search.</p>
        <Button variant="outline" className="mt-4 border-border" asChild>
          <Link href="/professionals">Clear filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {professionals.map((pro, i) => (
          <ProfessionalCard key={pro.id} pro={pro} index={startIndex + i} />
        ))}
      </div>
      <DiscoverPagination page={page} totalPages={totalPages} />
    </>
  );
}

async function FiltersWithCount({ params }: { params: ProfessionalsSearchParams }) {
  const { total } = await queryProfessionals(params);
  return <ProfessionalsFilters count={total} />;
}

export default async function ProfessionalsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const all = await getAllProfessionals();
  const countriesCount = Math.max(countUniqueCountries(all), 12);

  return (
    <div className="page-shell">
      <ProfessionalsHero totalPros={all.length} countriesCount={countriesCount} />

      <div className="page-container py-5 sm:py-8 md:py-10 pb-16 sm:pb-20">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl -mt-8" />}>
          <FiltersWithCount params={params} />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          }
        >
          <ProfessionalsGrid params={params} />
        </Suspense>
      </div>
    </div>
  );
}
