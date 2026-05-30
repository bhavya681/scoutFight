import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { TalentCard } from "@/components/talent/talent-card";
import { SearchFilters } from "@/components/athletes/search-filters";
import { getAllTalent } from "@/lib/data/talent-repository";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Find Athletes" };

export const revalidate = 3600;

export default async function SearchTalentPage() {
  const talent = await getAllTalent();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Find athletes</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/discover">Full search</Link>
        </Button>
      </div>
      <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
        <SearchFilters />
      </Suspense>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {talent.map((t, i) => (
          <TalentCard key={t.id} talent={t} index={i} />
        ))}
      </div>
    </div>
  );
}
