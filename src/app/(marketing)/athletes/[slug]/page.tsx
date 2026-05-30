import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Calendar, ExternalLink, Shield } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { PromotionMark } from "@/components/talent/promotion-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTalentBySlug, getVideosForTalent, getAllAthleteSlugs } from "@/lib/data/talent-repository";
import { formatRecord } from "@/lib/utils";
import { BookingCTA } from "@/components/athletes/booking-cta";
import { FavoriteButton } from "@/components/athletes/favorite-button";
import { CompareToggle } from "@/components/compare/compare-toggle";
import { YouTubePlayer } from "@/components/video/youtube-player";
import { YouTubeSearchFallback } from "@/components/video/youtube-search-fallback";
import { CareerStatusBadge } from "@/components/talent/career-status-badge";
import { UserAvatar } from "@/components/ui/user-avatar";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";

export const revalidate = 3600;

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllAthleteSlugs();
  return slugs.slice(0, 48);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const talent = await getTalentBySlug(slug);
  if (!talent) return { title: "Athlete Not Found" };
  return {
    title: talent.displayName,
    description: talent.bio.slice(0, 160),
    openGraph: {
      images: isUsableImageUrl(talent.avatarUrl) ? [talent.avatarUrl] : [],
    },
  };
}

export default async function AthleteProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const [talent, videos] = await Promise.all([
    getTalentBySlug(slug),
    getVideosForTalent(slug),
  ]);
  if (!talent) notFound();


  return (
    <div>
      <div className="relative h-40 sm:h-56 overflow-hidden bg-muted border-b border-border">
        {talent.bannerUrl && (
          <Image
            src={talent.bannerUrl}
            alt=""
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 -mt-16 relative z-10 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex gap-5 items-end">
            <UserAvatar
              name={talent.ringName ?? talent.displayName}
              src={talent.avatarUrl}
              size="xl"
              shape="rounded"
              priority
              className="ring-4 ring-background border border-border shrink-0"
            />
            <div className="pb-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="verified" className="gap-1">
                  <Shield className="h-3 w-3" /> Wikipedia
                </Badge>
                <Badge variant="secondary" className="uppercase">{talent.sport}</Badge>
                <CareerStatusBadge status={talent.careerStatus} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {talent.ringName ?? talent.displayName}
              </h1>
              {talent.ringName && talent.displayName !== talent.ringName && (
                <p className="text-sm text-muted-foreground">{talent.displayName}</p>
              )}
              {talent.nickname && (
                <p className="text-sm text-pwr-gold">&quot;{talent.nickname}&quot;</p>
              )}
              <p className="text-muted-foreground flex items-center gap-2 mt-1 text-sm flex-wrap">
                {talent.weightClass && <span>{talent.weightClass}</span>}
                {talent.record && (
                  <span>
                    {formatRecord(talent.record.wins, talent.record.losses, talent.record.draws)}
                  </span>
                )}
                <CountryFlag
                  nationality={talent.nationality}
                  countryCode={talent.countryCode}
                  size="sm"
                  showLabel
                />
                {talent.contractEndsAt && (
                  <Badge variant="outline">Contract ends {talent.contractEndsAt}</Badge>
                )}
              </p>
            </div>
          </div>
          <div className="lg:ml-auto flex gap-2 shrink-0">
            <FavoriteButton athleteId={talent.id} />
            <CompareToggle talent={talent} />
            <BookingCTA athleteSlug={talent.slug} athleteName={talent.displayName} />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card className="p-6">
                  {(talent.heightCm || talent.reachCm || talent.weightKg || talent.experienceYears) && (
                    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                      {talent.heightCm && (
                        <div>
                          <dt className="text-muted-foreground">Height</dt>
                          <dd className="font-medium">{talent.heightCm} cm</dd>
                        </div>
                      )}
                      {talent.weightKg && (
                        <div>
                          <dt className="text-muted-foreground">Weight</dt>
                          <dd className="font-medium">{talent.weightKg} kg</dd>
                        </div>
                      )}
                      {talent.reachCm && (
                        <div>
                          <dt className="text-muted-foreground">Reach</dt>
                          <dd className="font-medium">{talent.reachCm} cm</dd>
                        </div>
                      )}
                      {talent.experienceYears && (
                        <div>
                          <dt className="text-muted-foreground">Experience</dt>
                          <dd className="font-medium">{talent.experienceYears} yrs</dd>
                        </div>
                      )}
                    </dl>
                  )}
                  {talent.promotion && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Promotion</p>
                      <PromotionMark
                        promotion={talent.promotion}
                        logoUrl={talent.promotionLogoUrl}
                        organizationSlug={talent.promotionOrgSlug}
                        size="md"
                      />
                    </div>
                  )}
                  {talent.championships.length > 0 && (
                    <ul className="text-sm mb-4 space-y-1">
                      {talent.championships.map((c) => (
                        <li key={c.name}>
                          <span className="font-medium">{c.name}</span>
                          {c.organization && (
                            <span className="text-muted-foreground"> — {c.organization}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="text-muted-foreground leading-relaxed text-sm">{talent.bio}</p>
                  {talent.wikipediaUrl && (
                    <Link
                      href={talent.wikipediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-brand mt-4 hover:underline"
                    >
                      Read full biography on Wikipedia
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {talent.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="videos" className="mt-4 space-y-6">
                {videos.length > 0 ? (
                  <>
                    <YouTubePlayer video={videos[0]} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {videos.slice(1).map((v) => (
                        <YouTubePlayer key={v.id} video={v} compact />
                      ))}
                    </div>
                  </>
                ) : (
                  <YouTubeSearchFallback
                    query={`${talent.ringName ?? talent.displayName} ${talent.sport} highlights`}
                    athleteName={talent.ringName ?? talent.displayName}
                    talentSlug={talent.slug}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recruiter actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {talent.bookingEmail && (
                  <p className="text-xs text-muted-foreground break-all">{talent.bookingEmail}</p>
                )}
                <Button className="w-full" asChild>
                  <Link href={`/booking?athlete=${talent.slug}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Send inquiry
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/compare">Add to compare</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
