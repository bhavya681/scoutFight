const WIKIPEDIA_USER_AGENT =
  "ScoutFight/1.0 (https://scoutfight.app; talent-discovery@scoutfight.app)";

export interface WikipediaSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  pageUrl: string;
  coordinates?: { lat: number; lon: number };
}

/** Higher-resolution logo/banner from Wikipedia (e.g. UFC, WWE SVG marks) */
export async function fetchWikipediaPageImage(
  title: string,
  thumbSize = 500
): Promise<{ logoUrl?: string; originalUrl?: string } | null> {
  try {
    const params = new URLSearchParams({
      action: "query",
      titles: title.replace(/ /g, "_"),
      prop: "pageimages",
      piprop: "thumbnail|original",
      pithumbsize: String(thumbSize),
      format: "json",
      origin: "*",
    });
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source: string }; original?: { source: string } }> };
    };
    const page = Object.values(data.query?.pages ?? {})[0];
    if (!page) return null;
    return {
      logoUrl: page.thumbnail?.source ?? page.original?.source,
      originalUrl: page.original?.source,
    };
  } catch {
    return null;
  }
}

export type AthleteGender = "male" | "female";

function inferGenderFromCategories(categoryTitles: string[]): AthleteGender | undefined {
  const cats = categoryTitles.map((c) => c.toLowerCase());
  if (
    cats.some(
      (c) =>
        (c.includes("female") || c.includes("women") || c.includes("woman")) &&
        (c.includes("wrestl") ||
          c.includes("fighter") ||
          c.includes("boxer") ||
          c.includes("sportswomen") ||
          c.includes("martial"))
    )
  ) {
    return "female";
  }
  if (
    cats.some(
      (c) =>
        c.includes("male") &&
        (c.includes("wrestl") || c.includes("sportsmen") || c.includes("fighter"))
    )
  ) {
    return "male";
  }
  return undefined;
}

export interface WikipediaPageMeta {
  thumbnailUrl?: string;
  gender?: AthleteGender;
}

/** Batch thumbnails + gender hints for discover cards (wrestlers, etc.) */
export async function fetchWikipediaPageMetaBatch(
  titles: string[],
  thumbSize = 400
): Promise<Map<string, WikipediaPageMeta>> {
  const map = new Map<string, WikipediaPageMeta>();
  const normalized = [
    ...new Set(titles.map((t) => t.replace(/ /g, "_")).filter(Boolean)),
  ];

  for (let i = 0; i < normalized.length; i += 50) {
    const chunk = normalized.slice(i, i + 50);
    try {
      const params = new URLSearchParams({
        action: "query",
        titles: chunk.join("|"),
        prop: "pageimages|categories",
        piprop: "thumbnail",
        pithumbsize: String(thumbSize),
        cllimit: "30",
        format: "json",
        origin: "*",
      });
      const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
        headers: { "User-Agent": WIKIPEDIA_USER_AGENT },
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (text.startsWith("You are making")) continue;
      const data = JSON.parse(text) as {
        query?: {
          pages?: Record<
            string,
            {
              title?: string;
              thumbnail?: { source: string };
              categories?: { title: string }[];
            }
          >;
        };
      };

      for (const page of Object.values(data.query?.pages ?? {})) {
        if (!page.title || page.title.startsWith("Category:")) continue;
        const key = page.title.replace(/ /g, "_");
        const categories = (page.categories ?? []).map((c) => c.title);
        const existing = map.get(key) ?? {};
        map.set(key, {
          thumbnailUrl: page.thumbnail?.source ?? existing.thumbnailUrl,
          gender: inferGenderFromCategories(categories) ?? existing.gender,
        });
      }
    } catch {
      continue;
    }
  }

  return map;
}

export async function fetchWikipediaSummary(
  title: string
): Promise<WikipediaSummary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": WIKIPEDIA_USER_AGENT,
        },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation") return null;

    return {
      title: data.title as string,
      extract: (data.extract as string) ?? "",
      description: data.description as string | undefined,
      thumbnailUrl: data.thumbnail?.source as string | undefined,
      pageUrl: (data.content_urls?.desktop?.page as string) ?? `https://en.wikipedia.org/wiki/${title}`,
    };
  } catch {
    return null;
  }
}
