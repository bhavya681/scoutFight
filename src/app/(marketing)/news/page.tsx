import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">News</h1>
      <p className="text-muted-foreground mt-2 mb-10">
        Headlines aggregated from Google News — MMA, boxing, and wrestling.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-video bg-muted">
              <Image
                src={article.coverImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <h2 className="font-semibold line-clamp-2 text-sm leading-snug">
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
                  className="inline-flex items-center gap-1 text-xs text-brand font-medium mt-3 hover:underline"
                >
                  Read article <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <Link
                  href={`/news/${article.slug}`}
                  className="text-xs text-brand mt-3 hover:underline"
                >
                  Read more
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
