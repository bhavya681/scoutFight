import Link from "next/link";
import { ArrowRight, GitCompare, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TalentCard } from "@/components/talent/talent-card";
import { YouTubePlayer } from "@/components/video/youtube-player";
import { HomeHero } from "@/components/home/home-hero";
import {
  getAllTalent,
  getAllVideos,
  getNewsArticles,
} from "@/lib/data/talent-repository";
import { getAllOrganizations } from "@/lib/data/organization-repository";
import { OrgLogo } from "@/components/organizations/org-logo";
import { SPORTS } from "@/lib/constants";

export const revalidate = 3600;

export default async function HomePage() {
  const [talent, videos, news, orgs] = await Promise.all([
    getAllTalent(),
    getAllVideos(6),
    getNewsArticles(),
    getAllOrganizations(),
  ]);

  const featured = talent.filter((t) => t.featured).slice(0, 3);

  return (
    <div className="hero-gradient">
      <HomeHero />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="section-label mb-4">Global coverage</p>
        <div className="flex flex-wrap gap-2">
          {SPORTS.map((s) => (
            <Badge key={s.id} variant="outline" className="font-medium hover:border-pwr-red/40 transition-colors">
              {s.label}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-border">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="section-label mb-2">Talent roster</p>
            <h2 className="section-title">Featured athletes</h2>
            <p className="text-sm text-muted-foreground mt-2">Live Wikipedia profiles & records</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/athletes">View all</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((t, i) => (
            <TalentCard key={t.id} talent={t} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-border">
        <p className="section-label mb-2">Video intel</p>
        <div className="flex items-center gap-2 mb-10">
          <Video className="h-5 w-5 text-pwr-red" />
          <h2 className="section-title">YouTube highlights</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((v) => (
            <YouTubePlayer key={v.id} video={v} compact />
          ))}
        </div>
        <Button variant="link" asChild className="mt-4 px-0">
          <Link href="/videos">More videos <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-border">
        <p className="section-label mb-2">Organizations</p>
        <h2 className="section-title mb-10">Major promotions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.slug}`}>
              <Card className="p-5 hover:border-pwr-red/40 hover:shadow-lg hover:shadow-pwr-red/5 transition-all h-full flex flex-col items-center text-center group">
                <OrgLogo src={org.logoUrl} alt={org.name} size="sm" className="mb-3" />
                <p className="font-display font-semibold text-sm uppercase tracking-wide group-hover:text-pwr-red transition-colors">{org.name}</p>
                <p className="text-xs text-muted-foreground mt-2 capitalize">{org.sports[0]}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 border-t border-border">
        <p className="section-label mb-2">Industry news</p>
        <h2 className="section-title mb-10">Latest headlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.slice(0, 3).map((article) => (
            <Card key={article.id} className="p-4">
              <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
              {article.externalUrl && (
                <a
                  href={article.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pwr-red mt-2 inline-block hover:underline"
                >
                  Read source →
                </a>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden p-12 text-center border-pwr-red/25">
          <div className="absolute inset-0 bg-gradient-to-br from-pwr-red/10 via-transparent to-pwr-accent/10 pointer-events-none" />
          <div className="relative">
            <GitCompare className="h-10 w-10 text-pwr-gold mx-auto mb-5" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide mb-3">
              Compare side-by-side
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Build a shortlist and evaluate wrestlers and fighters like a pro recruiter.
            </p>
            <Button size="lg" className="glow-red" asChild>
              <Link href="/discover">
                <Search className="h-4 w-4" /> Start scouting
              </Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
