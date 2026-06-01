import type { SportType, VideoItem } from "@/types";
import { getAllVideos } from "@/lib/data/talent-repository";

export const VIDEOS_PAGE_SIZE = 9;

export interface VideosSearchParams {
  q?: string;
  sport?: string;
  sort?: string;
  page?: string;
}

const SPORT_FILTERS = new Set([
  "mma",
  "boxing",
  "muay_thai",
  "bjj",
  "wrestling",
  "kickboxing",
  "grappling",
]);

export async function getVideoLibrary(): Promise<VideoItem[]> {
  return getAllVideos(54);
}

export async function queryVideos(
  params: VideosSearchParams
): Promise<{ videos: VideoItem[]; total: number }> {
  let list = await getVideoLibrary();

  if (params.sport && SPORT_FILTERS.has(params.sport)) {
    list = list.filter((v) => v.sport === params.sport);
  }

  if (params.q?.trim()) {
    const q = params.q.toLowerCase();
    list = list.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.talentName.toLowerCase().includes(q)
    );
  }

  const sort = params.sort ?? "recent";
  list = [...list].sort((a, b) => {
    if (sort === "views") return b.views - a.views;
    if (sort === "title") return a.title.localeCompare(b.title);
    return b.views - a.views;
  });

  const total = list.length;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const start = (page - 1) * VIDEOS_PAGE_SIZE;
  const videos = list.slice(start, start + VIDEOS_PAGE_SIZE);

  return { videos, total };
}
