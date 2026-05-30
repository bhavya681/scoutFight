import Link from "next/link";
import { Calendar, MapPin, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { OrgLogo } from "@/components/organizations/org-logo";
import { OPPORTUNITY_SEEK_TYPES } from "@/lib/constants";
import type { MarketplaceListing } from "@/types";

const TYPE_LABELS: Record<MarketplaceListing["type"], string> = {
  booking_opportunity: "Booking",
  talent_seek: "Talent Seek",
  partnership: "Partnership",
  event_slot: "Event Slot",
};

interface ListingCardProps {
  listing: MarketplaceListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const seekLabel = OPPORTUNITY_SEEK_TYPES.find((t) => t.id === listing.seekType)?.label;
  return (
    <Link href={`/marketplace/${listing.slug}`}>
      <Card
        className={`h-full hover:border-pwr-red/30 transition-all ${
          listing.featured ? "ring-1 ring-pwr-gold/30" : ""
        }`}
      >
        <CardContent className="p-6">
          <OrgLogo
            src={listing.organizationLogoUrl}
            alt={listing.organizationName}
            size="sm"
            className="mb-4"
          />
          <div className="flex flex-wrap gap-2 mb-3">
            {seekLabel && (
              <Badge variant="default" className="text-[10px]">
                {seekLabel}
              </Badge>
            )}
            <Badge variant={listing.featured ? "default" : "secondary"}>
              {TYPE_LABELS[listing.type]}
            </Badge>
            <Badge variant="sport" className="uppercase">
              {listing.sport}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg group-hover:text-pwr-red transition-colors line-clamp-2">
            {listing.title}
          </h3>
          <p className="text-sm text-pwr-accent font-medium mt-1">
            {listing.organizationName}
          </p>
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
            {listing.description}
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {listing.location}
            </span>
            {listing.deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Due {listing.deadline}
              </span>
            )}
          </div>
          {listing.budget && (
            <p className="mt-3 text-sm font-semibold text-pwr-gold">{listing.budget}</p>
          )}
          {listing.allowsApplications && (
            <p className="mt-3 text-xs text-pwr-red flex items-center gap-1 font-medium">
              <Send className="h-3 w-3" /> Accepting applications
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
