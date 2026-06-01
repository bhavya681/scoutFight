import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingPageHero } from "@/components/layout/marketing-page-hero";
import { MarketingContent } from "@/components/layout/marketing-content";
import { getNewsArticles } from "@/lib/data/talent-repository";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Industry News",
  description: "Live combat sports news from Google News.",
};

export const revalidate = 1800;

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <div className="page-shell">
      <MarketingPageHero
        variant="solid"
        badge={
          <span className="inline-flex items-center gap-2 rounded-full border border-pwr-red/40 bg-pwr-red/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-pwr-red">
            <Newspaper className="h-3.5 w-3.5" />
            Industry news
          </span>
        }
        title={
          <>
            Combat Sports <span className="text-gradient">Headlines</span>
          </>
        }
        description="Headlines aggregated from Google News — MMA, boxing, wrestling, and more."
        stats={[
          { value: articles.length.toLocaleString(), label: "Stories" },
          { value: "Live", label: "Feed" },
          { value: "Global", label: "Coverage" },
        ]}
        ctas={[{ label: "Browse athletes", href: "/discover", variant: "outline" }]}
      />
      <MarketingContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden h-full flex flex-col bg-muted/50 border-border"
            >
              <div className="relative aspect-video bg-muted">
                <Image
                  src={article.coverImageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h2 className="font-semibold line-clamp-2 text-sm leading-snug text-white">
                  {article.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>
                <p className="text-[10px] text-muted-foreground mt-3">
                  {format(new Date(article.publishedAt), "MMM d, yyyy")}
                </p>
                {article.externalUrl ? (
                  <a
                    href={article.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-pwr-red font-medium mt-3 hover:underline"
                  >
                    Read article <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <Link
                    href={`/news/${article.slug}`}
                    className="text-xs text-pwr-red mt-3 hover:underline"
                  >
                    Read more
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </MarketingContent>
    </div>
  );
}
