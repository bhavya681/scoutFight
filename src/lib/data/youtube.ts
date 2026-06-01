import type { VideoItem, SportType } from "@/types";

interface RawSearchHit {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  duration?: string;
  views?: number;
}

interface PipedSearchItem {
  url?: string;
  title?: string;
  thumbnail?: string;
  duration?: number;
  views?: number;
}

const PIPED_INSTANCES = [
  "https://pipedapi.kavin.rocks",
  "https://pipedapi.adminforge.de",
  "https://pipedapi.syncpundit.io",
  "https://api.piped.yt",
];

const INVIDIOUS_INSTANCES = [
  "https://yewtu.be",
  "https://inv.nadeko.net",
  "https://invidious.nerdvpn.de",
];

const INNERTUBE_CLIENT_VERSION = "2.20241120.01.00";

export type YouTubeApiStatus =
  | { state: "missing" }
  | { state: "wrong_key_type"; hint: string }
  | { state: "rejected"; message: string }
  | { state: "ok" }
  | { state: "innertube"; note: string };

function hasValidYouTubeApiKey(): boolean {
  const key = process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  return Boolean(key?.trim()?.startsWith("AIza"));
}

export function buildYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

/** Call from pages to explain video source */
export async function getYouTubeApiStatus(): Promise<YouTubeApiStatus> {
  const key = process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!key?.trim()) {
    return {
      state: "innertube",
      note: "Videos are loaded by searching athlete names on YouTube (no API key required).",
    };
  }

  if (!key.startsWith("AIza")) {
    return {
      state: "innertube",
      note: "Your .env key is not a YouTube Data API key — using name search on YouTube instead.",
    };
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: "ufc highlights",
      type: "video",
      maxResults: "1",
      key,
    });
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
      { cache: "no-store" }
    );
    const data = (await res.json()) as { error?: { message?: string }; items?: unknown[] };
    if (data.error || !res.ok) {
      return {
        state: "innertube",
        note: data.error?.message ?? `Google API HTTP ${res.status} — using name search fallback.`,
      };
    }
    return { state: "ok" };
  } catch (e) {
    return {
      state: "innertube",
      note: e instanceof Error ? e.message : "Using YouTube name search fallback.",
    };
  }
}

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] ?? null;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseInnertubeTitle(title: unknown): string {
  if (!title || typeof title !== "object") return "Highlight";
  const t = title as { simpleText?: string; runs?: { text?: string }[] };
  if (t.simpleText) return t.simpleText;
  if (Array.isArray(t.runs)) return t.runs.map((r) => r.text ?? "").join("").trim() || "Highlight";
  return "Highlight";
}

function collectInnertubeVideos(data: unknown, maxResults: number): RawSearchHit[] {
  const hits: RawSearchHit[] = [];
  const seen = new Set<string>();

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object" || hits.length >= maxResults) return;
    const obj = node as Record<string, unknown>;

    if (obj.videoRenderer && typeof obj.videoRenderer === "object") {
      const v = obj.videoRenderer as Record<string, unknown>;
      const id = typeof v.videoId === "string" ? v.videoId : null;
      if (id && !seen.has(id)) {
        seen.add(id);
        const thumbs = (v.thumbnail as { thumbnails?: { url?: string }[] })?.thumbnails;
        const lengthText = (v.lengthText as { simpleText?: string })?.simpleText;
        hits.push({
          videoId: id,
          title: parseInnertubeTitle(v.title),
          thumbnailUrl: thumbs?.at(-1)?.url ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          duration: lengthText,
        });
      }
    }

    for (const value of Object.values(obj)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  };

  walk(data);
  return hits;
}

/** YouTube web client search — no API key (same as opening YouTube and searching a name) */
async function searchYouTubeInnertube(
  query: string,
  maxResults = 6
): Promise<RawSearchHit[]> {
  try {
    const res = await fetch(
      "https://www.youtube.com/youtubei/v1/search?prettyPrint=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-YouTube-Client-Name": "1",
          "X-YouTube-Client-Version": INNERTUBE_CLIENT_VERSION,
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: "WEB",
              clientVersion: INNERTUBE_CLIENT_VERSION,
              hl: "en",
              gl: "US",
            },
          },
          query,
        }),
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(12000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return collectInnertubeVideos(data, maxResults);
  } catch {
    return [];
  }
}

async function searchInvidious(query: string, maxResults = 6): Promise<PipedSearchItem[]> {
  for (const base of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(
        `${base}/api/v1/search?q=${encodeURIComponent(query)}&type=video`,
        { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as {
        videoId?: string;
        title?: string;
        videoThumbnails?: { quality: string; url: string }[];
      }[];
      if (!Array.isArray(data) || data.length === 0) continue;
      return data.slice(0, maxResults).map((v) => ({
        url: v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : undefined,
        title: v.title,
        thumbnail:
          v.videoThumbnails?.find((t) => t.quality === "medium")?.url ??
          (v.videoId ? `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg` : undefined),
      }));
    } catch {
      continue;
    }
  }
  return [];
}

async function searchPiped(query: string, maxResults = 6): Promise<PipedSearchItem[]> {
  for (const base of PIPED_INSTANCES) {
    try {
      const res = await fetch(
        `${base}/search?q=${encodeURIComponent(query)}&filter=videos`,
        { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const items = (data.items ?? data) as PipedSearchItem[];
      if (Array.isArray(items) && items.length > 0) return items.slice(0, maxResults);
    } catch {
      continue;
    }
  }
  return [];
}

async function searchGoogleYouTube(
  query: string,
  maxResults = 6
): Promise<RawSearchHit[]> {
  const key = process.env.YOUTUBE_API_KEY ?? process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!key?.startsWith("AIza")) return [];

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      type: "video",
      maxResults: String(maxResults),
      key,
    });
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(10000) }
    );
    const data = (await res.json()) as {
      items?: unknown[];
      error?: { message?: string };
    };
    if (!res.ok || data.error) return [];

    type YtSearchItem = {
      id: { videoId: string };
      snippet: {
        title: string;
        thumbnails: { high?: { url: string }; medium?: { url: string } };
      };
    };
    return ((data.items ?? []) as YtSearchItem[]).map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl:
        item.snippet.thumbnails.high?.url ??
        item.snippet.thumbnails.medium?.url ??
        `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
    }));
  } catch {
    return [];
  }
}

function rawHitsToVideoItems(
  hits: RawSearchHit[],
  meta: { talentName: string; talentSlug: string; sport?: SportType }
): VideoItem[] {
  return hits.map((h) => ({
    id: h.videoId,
    youtubeId: h.videoId,
    title: h.title,
    thumbnailUrl: h.thumbnailUrl ?? `https://i.ytimg.com/vi/${h.videoId}/hqdefault.jpg`,
    talentName: meta.talentName,
    talentSlug: meta.talentSlug,
    talentType: "athlete" as const,
    sport: meta.sport,
    duration: h.duration ?? "—",
    views: h.views ?? 0,
    watchUrl: `https://www.youtube.com/watch?v=${h.videoId}`,
  }));
}

function pipedToRawHits(items: PipedSearchItem[]): RawSearchHit[] {
  const hits: RawSearchHit[] = [];
  for (const item of items) {
    const url = item.url?.startsWith("http")
      ? item.url
      : item.url
        ? `https://www.youtube.com${item.url}`
        : null;
    const id = url ? extractVideoId(url) : null;
    if (!id) continue;
    hits.push({
      videoId: id,
      title: item.title ?? "Highlight",
      thumbnailUrl: item.thumbnail ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      duration: formatDuration(item.duration),
      views: item.views,
    });
  }
  return hits;
}

function mergeSearchHits(sources: RawSearchHit[][], maxResults: number): RawSearchHit[] {
  const merged: RawSearchHit[] = [];
  const seen = new Set<string>();
  for (const list of sources) {
    for (const hit of list) {
      if (seen.has(hit.videoId)) continue;
      seen.add(hit.videoId);
      merged.push(hit);
      if (merged.length >= maxResults) return merged;
    }
  }
  return merged;
}

export async function fetchYouTubeVideos(
  query: string,
  meta: { talentName: string; talentSlug: string; sport?: SportType },
  maxResults = 6
): Promise<VideoItem[]> {
  const [innertube, google, piped, invidious] = await Promise.all([
    searchYouTubeInnertube(query, maxResults),
    hasValidYouTubeApiKey()
      ? searchGoogleYouTube(query, maxResults)
      : Promise.resolve([]),
    searchPiped(query, maxResults).then(pipedToRawHits),
    searchInvidious(query, maxResults).then(pipedToRawHits),
  ]);

  const merged = mergeSearchHits(
    [google, innertube, piped, invidious],
    maxResults
  );

  return rawHitsToVideoItems(merged, meta);
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function getYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
