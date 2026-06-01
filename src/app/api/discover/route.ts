import { NextRequest, NextResponse } from "next/server";
import {
  queryDiscoverTalent,
  type DiscoverSearchParams,
} from "@/lib/data/discover-query";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const params: DiscoverSearchParams = {
    q: sp.get("q") ?? undefined,
    sport: sp.get("sport") ?? undefined,
    weightClass: sp.get("weightClass") ?? undefined,
    gender: sp.get("gender") ?? undefined,
    verification: sp.get("verification") ?? undefined,
    availableOnly: sp.get("availableOnly") ?? undefined,
    region: sp.get("region") ?? undefined,
    minScore: sp.get("minScore") ?? undefined,
    sort: sp.get("sort") ?? undefined,
    view: sp.get("view") ?? undefined,
    page: sp.get("page") ?? undefined,
  };

  const { talent, total } = await queryDiscoverTalent(params);
  return NextResponse.json({ talent, total });
}
