import { NextRequest, NextResponse } from "next/server";
import { queryCricketPlayers } from "@/lib/integrations/cricket-api";

export const revalidate = 3600;

/** Cricket players for league hiring — search by name, league, or role */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q") ?? undefined;
  const league = sp.get("league") ?? undefined;
  const role = sp.get("role") ?? undefined;
  const limitRaw = sp.get("limit");
  const limit = limitRaw ? Math.min(parseInt(limitRaw, 10) || 24, 100) : 24;

  const players = await queryCricketPlayers({ q, league, role, limit });

  return NextResponse.json({
    players,
    total: players.length,
    filters: { q, league, role, limit },
    source: "the_sports_db",
    note: "Franchise T20 rosters (IPL, BBL, PSL, CPL, The Hundred) for league scouting and hiring.",
  });
}
