import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { getAllOpportunities } from "@/lib/data/opportunity-repository";
import { ListingCard } from "@/components/marketplace/listing-card";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";
import { MarketingContent } from "@/components/layout/marketing-content";
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
    <div className="page-shell">
      <MarketingPageHero
        variant="solid"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
            <Briefcase className="h-3.5 w-3.5" />
            Opportunity marketplace
          </span>
        }
        title={
          <>
            Find Your Next <span className="text-gradient">Opportunity</span>
          </>
        }
        description={`${PLATFORM_PHILOSOPHY.purpose} Organizations post open roles; talent applies directly.`}
        stats={[
          { value: listings.length.toLocaleString(), label: "Listings" },
          { value: String(OPPORTUNITY_SEEK_TYPES.length), label: "Role types" },
          { value: "Open", label: "Applications" },
        ]}
        ctas={[
          { label: "Browse athletes", href: "/discover" },
          { label: "Post opportunity", href: "/contact", variant: "outline" },
        ]}
      />
      <MarketingContent>
        <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
          {OPPORTUNITY_SEEK_TYPES.map((t) => (
            <Badge key={t.id} variant="outline" className="font-normal border-border text-foreground/85">
              {t.label}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </MarketingContent>
    </div>
  );
}
