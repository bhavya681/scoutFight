import { NextRequest, NextResponse } from "next/server";
import { getAllTalent, getTalentBySlug, searchTalent } from "@/lib/data/talent-repository";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const talent = await getTalentBySlug(slug);
    if (!talent) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ talent, source: "thesportsdb+wikipedia+youtube" });
  }

  const genderParam = searchParams.get("gender");
  const talent = await searchTalent({
    query: searchParams.get("q") ?? undefined,
    sport: searchParams.get("sport") ?? undefined,
    weightClass: searchParams.get("weightClass") ?? undefined,
    gender:
      genderParam === "male" || genderParam === "female" ? genderParam : undefined,
    verification: searchParams.get("verification") ?? undefined,
    availableOnly: searchParams.get("availableOnly") === "true",
  });

  return NextResponse.json({
    talent,
    source: "thesportsdb+wikidata+wikipedia+mma_api",
    count: talent.length,
  });
}
