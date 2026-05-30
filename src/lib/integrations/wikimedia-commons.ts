/**
 * Wikimedia Commons API — free images for fighters/wrestlers when other APIs lack photos.
 * @see https://www.mediawiki.org/wiki/API:Search
 */

export async function fetchCommonsImageUrl(
  searchTerm: string,
  thumbWidth = 400
): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `${searchTerm} wrestler OR fighter OR MMA`,
    gsrnamespace: "6",
    gsrlimit: "3",
    prop: "pageimages",
    piprop: "thumbnail",
    pithumbsize: String(thumbWidth),
    format: "json",
    origin: "*",
  });

  try {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      query?: { pages?: Record<string, { thumbnail?: { source: string } }> };
    };
    const pages = data.query?.pages ?? {};
    for (const page of Object.values(pages)) {
      if (page.thumbnail?.source) return page.thumbnail.source;
    }
    return null;
  } catch {
    return null;
  }
}
