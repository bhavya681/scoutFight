import {
  fetchWikipediaPageMetaBatch,
  fetchWikipediaSummary,
  type WikipediaSummary,
} from "@/lib/data/wikipedia";

const WIKIPEDIA_USER_AGENT =
  "ScoutFight/1.0 (https://scoutfight.app; combatpedia@scoutfight.app)";

export type WikipediaArticleSection = {
  id: string;
  title: string;
  text: string;
  level: number;
};

export type WikipediaGalleryImage = {
  title: string;
  url: string;
  thumbUrl: string;
  width?: number;
  height?: number;
};

export type CombatpediaArticle = {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  pageUrl: string;
  sections: WikipediaArticleSection[];
  images: WikipediaGalleryImage[];
  categories: string[];
};

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isGalleryImage(fileTitle: string): boolean {
  const t = fileTitle.toLowerCase();
  if (t.endsWith(".svg")) return false;
  if (t.includes("icon") || t.includes("logo") || t.includes("flag")) return false;
  if (t.includes("edit-clear") || t.includes("wikimedia")) return false;
  if (t.includes("symbol") || t.includes("pictogram")) return false;
  return (
    t.includes(".jpg") ||
    t.includes(".jpeg") ||
    t.includes(".png") ||
    t.includes(".webp") ||
    t.includes(".gif")
  );
}

async function fetchMobileSections(title: string): Promise<WikipediaArticleSection[]> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(title)}`,
      {
        headers: { Accept: "application/json", "User-Agent": WIKIPEDIA_USER_AGENT },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      lead?: { sections?: { id: number; text: string; line?: string }[] };
      remaining?: { sections?: { id: number; text: string; line?: string; toclevel?: number }[] };
    };

    const sections: WikipediaArticleSection[] = [];

    for (const s of data.lead?.sections ?? []) {
      const text = stripHtml(s.text ?? "");
      if (text.length > 40) {
        sections.push({
          id: String(s.id),
          title: s.line?.trim() || "Overview",
          text,
          level: 1,
        });
      }
    }

    for (const s of data.remaining?.sections ?? []) {
      const text = stripHtml(s.text ?? "");
      if (!text || text.length < 40) continue;
      sections.push({
        id: String(s.id),
        title: s.line?.trim() || "Section",
        text,
        level: s.toclevel ?? 2,
      });
    }

    return sections.slice(0, 12);
  } catch {
    return [];
  }
}

async function fetchPageImages(title: string): Promise<WikipediaGalleryImage[]> {
  try {
    const listParams = new URLSearchParams({
      action: "query",
      titles: title.replace(/ /g, "_"),
      prop: "images",
      imlimit: "40",
      format: "json",
      origin: "*",
    });

    const listRes = await fetch(`https://en.wikipedia.org/w/api.php?${listParams}`, {
      headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!listRes.ok) return [];

    const listData = (await listRes.json()) as {
      query?: { pages?: Record<string, { images?: { title: string }[] }> };
    };

    const files = Object.values(listData.query?.pages ?? {})
      .flatMap((p) => p.images ?? [])
      .map((i) => i.title)
      .filter(isGalleryImage)
      .slice(0, 24);

    if (files.length === 0) return [];

    const infoParams = new URLSearchParams({
      action: "query",
      titles: files.join("|"),
      prop: "imageinfo",
      iiprop: "url|thumburl|size",
      iiurlwidth: "640",
      format: "json",
      origin: "*",
    });

    const infoRes = await fetch(`https://en.wikipedia.org/w/api.php?${infoParams}`, {
      headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!infoRes.ok) return [];

    const infoData = (await infoRes.json()) as {
      query?: {
        pages?: Record<
          string,
          { title?: string; imageinfo?: { url: string; thumburl?: string; width?: number; height?: number }[] }
        >;
      };
    };

    const images: WikipediaGalleryImage[] = [];
    for (const page of Object.values(infoData.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      if (!info?.url) continue;
      images.push({
        title: (page.title ?? "").replace(/^File:/i, ""),
        url: info.url,
        thumbUrl: info.thumburl ?? info.url,
        width: info.width,
        height: info.height,
      });
    }

    return images;
  } catch {
    return [];
  }
}

async function fetchCategories(title: string): Promise<string[]> {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: title.replace(/ /g, "_"),
      prop: "categories",
      cllimit: "20",
      format: "json",
      origin: "*",
    });
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { categories?: { title: string }[] }> };
    };
    return Object.values(data.query?.pages ?? {})
      .flatMap((p) => p.categories ?? [])
      .map((c) => c.title.replace(/^Category:/, ""))
      .filter((c) => !c.includes("Wikipedia") && !c.includes("Articles"))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function fetchCombatpediaArticle(
  wikipediaTitle: string
): Promise<CombatpediaArticle | null> {
  const normalized = wikipediaTitle.replace(/ /g, "_");
  const [summary, sections, images, categories, meta] = await Promise.all([
    fetchWikipediaSummary(normalized),
    fetchMobileSections(normalized),
    fetchPageImages(normalized),
    fetchCategories(normalized),
    fetchWikipediaPageMetaBatch([normalized], 800),
  ]);

  if (!summary) return null;

  const thumb =
    summary.thumbnailUrl ?? meta.get(normalized)?.thumbnailUrl ?? images[0]?.thumbUrl;

  const gallery =
    images.length > 0
      ? images
      : thumb
        ? [{ title: summary.title, url: thumb, thumbUrl: thumb }]
        : [];

  return {
    title: summary.title,
    extract: summary.extract,
    description: summary.description,
    thumbnailUrl: thumb,
    pageUrl: summary.pageUrl,
    sections,
    images: gallery,
    categories,
  };
}

export type { WikipediaSummary };
