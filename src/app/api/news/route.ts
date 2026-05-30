import { NextResponse } from "next/server";
import { getNewsArticles } from "@/lib/data/talent-repository";

export const revalidate = 1800;

export async function GET() {
  const articles = await getNewsArticles();
  return NextResponse.json({ articles, source: "google-news-rss" });
}
