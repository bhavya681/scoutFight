import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, Shield } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getProfessionalBySlug,
  getAllProfessionalSlugs,
} from "@/lib/data/professional-repository";
import { CareerStatusBadge } from "@/components/talent/career-status-badge";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllProfessionalSlugs();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pro = await getProfessionalBySlug(slug);
  if (!pro) return { title: "Professional Not Found" };
  return { title: pro.displayName, description: pro.bio.slice(0, 160) };
}

export default async function ProfessionalProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const pro = await getProfessionalBySlug(slug);
  if (!pro) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 pb-16">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex gap-5 items-start">
          <UserAvatar
            name={pro.displayName}
            src={pro.avatarUrl}
            size="lg"
            shape="rounded"
            placeholderVariant="official"
            className="ring-4 ring-background border border-border shrink-0"
          />
          <div>
            <Badge variant="verified" className="gap-1 mb-2">
              <Shield className="h-3 w-3" /> {pro.verification}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{pro.displayName}</h1>
            <p className="text-muted-foreground capitalize mt-1">{pro.role.replace("_", " ")}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
              <CountryFlag
                nationality={pro.nationality}
                countryCode={pro.countryCode}
                size="sm"
                showLabel
              />
              <CareerStatusBadge status={pro.careerStatus} />
            </p>
          </div>
        </div>
        <div className="lg:ml-auto">
          <Button asChild>
            <Link href={`/booking?professional=${pro.slug}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Booking inquiry
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <p className="text-muted-foreground text-sm leading-relaxed">{pro.bio}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {pro.sports.map((s) => (
              <Badge key={s} variant="outline" className="uppercase">{s}</Badge>
            ))}
            {pro.tags.map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>
          <p className="text-sm mt-6">
            <span className="text-muted-foreground">Experience:</span> {pro.yearsExperience} years
          </p>
          {pro.bookingEmail && (
            <p className="text-sm mt-2">
              <span className="text-muted-foreground">Booking:</span> {pro.bookingEmail}
            </p>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recruitment</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Free agent: {pro.freeAgent ? "Yes" : "No"}</p>
            {pro.currentOrganization && <p>Organization: {pro.currentOrganization}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
