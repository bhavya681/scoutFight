import { NextResponse } from "next/server";
import { fetchCricketPlayerById } from "@/lib/integrations/cricket-api";

export const revalidate = 3600;

type RouteContext = { params: Promise<{ playerId: string }> };

/** Full cricket player profile with role, league, and bio-derived stats */
export async function GET(_request: Request, context: RouteContext) {
  const { playerId } = await context.params;
  const player = await fetchCricketPlayerById(playerId);

  if (!player) {
    return NextResponse.json({ error: "Player not found" }, { status: 404 });
  }

  return NextResponse.json({
    player,
    source: "the_sports_db",
  });
}
