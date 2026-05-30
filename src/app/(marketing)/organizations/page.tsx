import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { OrgLogo } from "@/components/organizations/org-logo";
import { CountryFlag } from "@/components/ui/country-flag";
import { getAllOrganizations } from "@/lib/data/organization-repository";
import { organizationSourceLabel } from "@/lib/utils/org-source";

export const metadata: Metadata = {
  title: "Promotions & Organizations",
  description: "UFC, WWE, AEW, Top Rank — live logos and profiles from Wikipedia and TheSportsDB.",
};

export const revalidate = 3600;

export default async function OrganizationsPage() {
  const orgs = await getAllOrganizations();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Promotions & organizations</h1>
      <p className="text-muted-foreground mt-2 mb-10 max-w-2xl">
        Logos and bios loaded from Wikipedia and TheSportsDB APIs — no static placeholder assets.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {orgs.map((org) => (
          <Link key={org.id} href={`/organizations/${org.slug}`}>
            <Card className="p-6 hover:border-pwr-red/40 transition-all h-full flex gap-4">
              <OrgLogo src={org.logoUrl} alt={org.name} size="md" />
              <div className="min-w-0">
                <Badge variant="verified" className="gap-1 mb-2 text-[10px]">
                  <Shield className="h-3 w-3" /> {organizationSourceLabel(org)}
                </Badge>
                <h2 className="font-semibold text-lg">{org.name}</h2>
                <CountryFlag
                  nationality={org.location}
                  size="xs"
                  showLabel
                  className="text-xs text-muted-foreground mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{org.description}</p>
                {org.wikipediaUrl && (
                  <span className="text-xs text-pwr-red mt-2 inline-flex items-center gap-1">
                    Wikipedia <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
