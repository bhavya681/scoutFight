import type { Metadata } from "next";
import { getAllOpportunities } from "@/lib/data/opportunity-repository";
import { ListingCard } from "@/components/marketplace/listing-card";
import { PLATFORM_PHILOSOPHY, OPPORTUNITY_SEEK_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Opportunity Marketplace",
  description: "Recruitment posts from promotions and organizations — apply directly as talent.",
};

export const revalidate = 3600;

export default async function MarketplacePage() {
  const listings = await getAllOpportunities();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pb-20">
      <p className="section-label mb-2">Opportunity marketplace</p>
      <h1 className="section-title text-3xl sm:text-4xl">Find your next opportunity</h1>
      <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
        {PLATFORM_PHILOSOPHY.purpose} Organizations post open roles; talent applies directly.
      </p>

      <div className="flex flex-wrap gap-2 mt-8 mb-10">
        {OPPORTUNITY_SEEK_TYPES.map((t) => (
          <Badge key={t.id} variant="outline" className="font-normal">
            {t.label}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
