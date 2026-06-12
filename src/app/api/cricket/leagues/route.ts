import { NextResponse } from "next/server";
import { CRICKET_HIRING_LEAGUES, fetchCricketLeagues } from "@/lib/integrations/cricket-api";

export const revalidate = 86400;

/** Cricket leagues available for roster scouting / hiring */
export async function GET() {
  const leagues = await fetchCricketLeagues(20);

  return NextResponse.json({
    featured: CRICKET_HIRING_LEAGUES,
    leagues,
    source: "the_sports_db",
  });
}
