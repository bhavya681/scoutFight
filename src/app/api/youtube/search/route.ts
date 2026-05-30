import { NextResponse } from "next/server";
import { fetchYouTubeVideos } from "@/lib/data/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  const name = searchParams.get("name")?.trim() ?? "";
  const slug = searchParams.get("slug")?.trim() ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 6) || 6, 12);

  if (!q) {
    return NextResponse.json({ videos: [], error: "Missing q parameter" }, { status: 400 });
  }

  const videos = await fetchYouTubeVideos(q, {
    talentName: name || q,
    talentSlug: slug,
  }, limit);

  return NextResponse.json({ videos, query: q });
}
