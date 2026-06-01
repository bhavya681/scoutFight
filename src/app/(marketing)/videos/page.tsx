import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { VideosLibraryHeader } from "@/components/videos/videos-library-header";
import { VideosFilters } from "@/components/videos/videos-filters";
import { FightFootageCard } from "@/components/videos/fight-footage-card";
import { DiscoverPagination } from "@/components/discover/discover-pagination";
import {
  queryVideos,
  getVideoLibrary,
  VIDEOS_PAGE_SIZE,
  type VideosSearchParams,
} from "@/lib/data/videos-query";
import { getYouTubeApiStatus, buildYouTubeSearchUrl } from "@/lib/data/youtube";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Fight Footage Library",
  description:
    "Combat sports fight footage, highlights, and breakdowns tagged for scouts.",
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<VideosSearchParams>;
}

function VideosEmptyState({
  status,
}: {
  status: Awaited<ReturnType<typeof getYouTubeApiStatus>>;
}) {
  const searchUrl = buildYouTubeSearchUrl("UFC MMA highlights");

  return (
    <div className="rounded-xl border border-border bg-muted/50 p-8 text-center space-y-4">
      <p className="font-display font-bold text-foreground uppercase tracking-wide">
        No videos cached yet
      </p>
      <p className="text-sm text-muted-foreground">
        {status.state === "ok"
          ? "Open an athlete profile to load highlights, or browse YouTube directly."
          : "note" in status
            ? status.note
            : "hint" in status
              ? status.hint
              : "message" in status
                ? status.message
                : "Add YOUTUBE_API_KEY or open a profile to cache highlights."}
      </p>
      <Button className="gap-2" asChild>
        <Link href={searchUrl} target="_blank" rel="noopener noreferrer">
          Browse on YouTube
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

async function VideosGrid({
  params,
  ytStatus,
}: {
  params: VideosSearchParams;
  ytStatus: Awaited<ReturnType<typeof getYouTubeApiStatus>>;
}) {
  const library = await getVideoLibrary();
  if (library.length === 0) {
    return <VideosEmptyState status={ytStatus} />;
  }

  const { videos, total } = await queryVideos(params);
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / VIDEOS_PAGE_SIZE));

  if (total === 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 py-16 text-center">
        <p className="text-muted-foreground">No videos match your filters.</p>
        <Button variant="outline" className="mt-4 border-border" asChild>
          <Link href="/videos">Clear filters</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((video) => (
          <FightFootageCard key={`${video.id}-${video.talentSlug}`} video={video} />
        ))}
      </div>
      <DiscoverPagination page={page} totalPages={totalPages} />
    </>
  );
}

async function FiltersWithCount({ params }: { params: VideosSearchParams }) {
  const library = await getVideoLibrary();
  const { total } = await queryVideos(params);
  const count = library.length > 0 ? total : 0;
  return <VideosFilters count={count} />;
}

export default async function VideosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const ytStatus = await getYouTubeApiStatus();
  const library = await getVideoLibrary();

  return (
    <div className="page-shell">
      <VideosLibraryHeader videoCount={library.length} />

      <div className="page-container py-5 sm:py-8 md:py-10 pb-16 sm:pb-20">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl -mt-8" />}>
          <FiltersWithCount params={params} />
        </Suspense>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-xl" />
              ))}
            </div>
          }
        >
          <VideosGrid params={params} ytStatus={ytStatus} />
        </Suspense>
      </div>
    </div>
  );
}
