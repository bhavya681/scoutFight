import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, Globe, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrgLogo } from "@/components/organizations/org-logo";
import {
  getOrganizationBySlug,
  getAllOrganizationSlugs,
} from "@/lib/data/organization-repository";
import { getAllTalent } from "@/lib/data/talent-repository";
import { TalentCard } from "@/components/talent/talent-card";
import { organizationSourceLabel } from "@/lib/utils/org-source";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllOrganizationSlugs();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) return { title: "Organization Not Found" };
  return {
    title: org.name,
    description: org.description.slice(0, 160),
    openGraph: org.logoUrl ? { images: [org.logoUrl] } : undefined,
  };
}

export default async function OrganizationProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const org = await getOrganizationBySlug(slug);
  if (!org) notFound();

  const relatedTalent = (await getAllTalent())
    .filter(
      (t) =>
        t.promotion?.toLowerCase().includes(org.name.split(" ")[0].toLowerCase()) ||
        t.currentOrganization?.toLowerCase().includes(org.slug.replace(/-/g, " "))
    )
    .slice(0, 3);
  const displayTalent =
    relatedTalent.length > 0 ? relatedTalent : (await getAllTalent()).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-6">
        <OrgLogo src={org.logoUrl} alt={org.name} size="lg" />
        <div>
          <Badge variant="verified" className="gap-1 mb-2">
            <Shield className="h-3 w-3" /> {organizationSourceLabel(org)}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
          <p className="text-muted-foreground mt-2 text-sm max-w-2xl">{org.description}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {org.wikipediaUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={org.wikipediaUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" /> Wikipedia
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            )}
            <Button size="sm" asChild>
              <Link href="/marketplace">View opportunities</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/discover">Scout athletes</Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Athletes to evaluate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {displayTalent.map((t, i) => (
            <TalentCard key={t.id} talent={t} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
