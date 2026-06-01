import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PromotionsHero } from "@/components/promotions/promotions-hero";
import { PromotionsFilters } from "@/components/promotions/promotions-filters";
import { PromotionCard } from "@/components/promotions/promotion-card";
import { DiscoverPagination } from "@/components/discover/discover-pagination";
import {
  queryOrganizations,
  ORGANIZATIONS_PAGE_SIZE,
  type OrganizationsSearchParams,
} from "@/lib/data/organizations-query";
import { getAllOrganizations } from "@/lib/data/organization-repository";
import { getAllTalent } from "@/lib/data/talent-repository";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Promotions & Organizations",
  description:
    "Discover verified MMA, boxing, kickboxing, and wrestling promotions worldwide.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<OrganizationsSearchParams>;
}

async function PromotionsGrid({ params }: { params: OrganizationsSearchParams }) {
  const { organizations, total } = await queryOrganizations(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / ORGANIZATIONS_PAGE_SIZE));
  const startIndex = (page - 1) * ORGANIZATIONS_PAGE_SIZE;

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 py-16 text-center mt-4">
        <p className="text-muted-foreground">No promotions match your search.</p>
        <Button variant="outline" className="mt-4 border-border" asChild>
          <Link href="/organizations">Clear filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {organizations.map((org, i) => (
          <PromotionCard key={org.id} org={org} index={startIndex + i} />
        ))}
      </div>
      <DiscoverPagination page={page} totalPages={totalPages} />
    </>
  );
}

async function FiltersWithCount({ params }: { params: OrganizationsSearchParams }) {
  const { total } = await queryOrganizations(params);
  return <PromotionsFilters count={total} />;
}

export default async function OrganizationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [orgs, athletes] = await Promise.all([
    getAllOrganizations(),
    getAllTalent(),
  ]);

  const countriesFromOrgs = orgs.map((o) => o.location).filter(Boolean);
  const countriesCount = Math.max(
    new Set(countriesFromOrgs.map((l) => l.toLowerCase())).size,
    12
  );

  return (
    <div className="page-shell flex flex-col">
      <PromotionsHero
        promotionCount={orgs.length}
        athleteCount={athletes.length}
        countriesCount={countriesCount}
      />

      <div className="page-container flex-1 pb-16">
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
          <PromotionsGrid params={params} />
        </Suspense>
      </div>

      <footer className="border-t border-border bg-background py-5">
        <div className="page-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="font-display font-semibold text-foreground tracking-wide">
            ScoutFight
          </p>
          <p>© {new Date().getFullYear()} ScoutFight · Connecting combat sports talent worldwide</p>
        </div>
      </footer>
    </div>
  );
}
