import { NextRequest, NextResponse } from "next/server";
import { searchTalent } from "@/lib/data/talent-repository";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const athletes = await searchTalent({
    query: searchParams.get("q") ?? undefined,
    sport: searchParams.get("sport") ?? undefined,
    weightClass: searchParams.get("weightClass") ?? undefined,
    verification: searchParams.get("verification") ?? undefined,
    availableOnly: searchParams.get("availableOnly") === "true",
  });
  return NextResponse.json({
    athletes,
    source: "thesportsdb+wikidata+wikipedia",
    count: athletes.length,
  });
}
