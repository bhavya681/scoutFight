import { NextRequest, NextResponse } from "next/server";
import { getAllOpportunities } from "@/lib/data/opportunity-repository";
import type { OpportunitySeekType } from "@/types";

export async function GET(request: NextRequest) {
  const seekType = request.nextUrl.searchParams.get("seekType") as OpportunitySeekType | null;
  let opportunities = await getAllOpportunities();
  if (seekType) {
    opportunities = opportunities.filter((o) => o.seekType === seekType);
  }
  return NextResponse.json({ opportunities, count: opportunities.length });
}
