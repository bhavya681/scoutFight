import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import { OrgLogo } from "@/components/organizations/org-logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityApplyForm } from "@/components/marketplace/opportunity-apply-form";
import {
  getOpportunityBySlug,
  getOpportunitySlugs,
} from "@/lib/data/opportunity-repository";
import { OPPORTUNITY_SEEK_TYPES } from "@/lib/constants";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getOpportunitySlugs();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opp = await getOpportunityBySlug(slug);
  if (!opp) return { title: "Opportunity Not Found" };
  return { title: opp.title, description: opp.description.slice(0, 160) };
}

export default async function OpportunityPage({ params }: PageProps) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);
  if (!opportunity) notFound();

  const seekLabel = OPPORTUNITY_SEEK_TYPES.find((t) => t.id === opportunity.seekType)?.label;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 pb-20">
      <Link href="/marketplace" className="text-sm text-muted-foreground hover:text-pwr-red">
        ← All opportunities
      </Link>

      <div className="mt-6 flex flex-wrap gap-2">
        {seekLabel && <Badge>{seekLabel}</Badge>}
        <Badge variant="outline" className="uppercase">{opportunity.sport}</Badge>
        {opportunity.featured && <Badge variant="default">Featured</Badge>}
      </div>

      <div className="flex items-start gap-4 mt-4">
        <OrgLogo
          src={opportunity.organizationLogoUrl}
          alt={opportunity.organizationName}
          size="md"
        />
        <div>
          <h1 className="section-title text-3xl">{opportunity.title}</h1>
          <p className="text-pwr-red font-medium mt-2">{opportunity.organizationName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" /> {opportunity.location}
        </span>
        {opportunity.deadline && (
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Apply by {opportunity.deadline}
          </span>
        )}
      </div>

      {opportunity.budget && (
        <p className="mt-4 text-lg font-semibold text-pwr-gold">{opportunity.budget}</p>
      )}

      <Card className="mt-8 p-6">
        <p className="text-muted-foreground leading-relaxed">{opportunity.description}</p>
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-sm mb-2">Requirements</h2>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {opportunity.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {opportunity.allowsApplications && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Apply directly</CardTitle>
            <p className="text-sm text-muted-foreground">
              Talent and professionals can submit applications — no agent required for indie
              opportunities.
            </p>
          </CardHeader>
          <CardContent>
            <OpportunityApplyForm opportunity={opportunity} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
