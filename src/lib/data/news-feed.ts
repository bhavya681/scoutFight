import type { NewsArticle } from "@/types";

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  enclosure?: { url?: string };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function slugFromLink(link: string) {
  try {
    const u = new URL(link);
    const path = u.pathname.split("/").filter(Boolean).pop() ?? "article";
    return path.slice(0, 80).replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  } catch {
    return `article-${Date.now()}`;
  }
}

export async function fetchCombatSportsNews(limit = 12): Promise<NewsArticle[]> {
  const query = encodeURIComponent("MMA OR boxing OR professional wrestling UFC WWE");
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items: RssItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const block = match[1];
      const title = block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] ?? "";
      const link = block.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? "";
      const pubDate = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";
      const desc =
        block.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] ?? "";
      if (title && link) {
        items.push({ title, link, pubDate, description: desc });
      }
    }

    return items.map((item, i) => ({
      id: `news-${i}`,
      slug: slugFromLink(item.link),
      title: stripHtml(item.title),
      excerpt: stripHtml(item.description).slice(0, 200),
      coverImageUrl: `https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg`,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      author: "Google News",
      externalUrl: item.link,
    }));
  } catch {
    return [];
  }
}
