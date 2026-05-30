import { NextRequest, NextResponse } from "next/server";
import { searchProfessionals } from "@/lib/data/professional-repository";
import type { ProfessionalRole, SportType } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const professionals = await searchProfessionals({
    query: searchParams.get("q") ?? undefined,
    role: (searchParams.get("role") as ProfessionalRole) ?? undefined,
    sport: (searchParams.get("sport") as SportType) ?? undefined,
  });

  return NextResponse.json({ professionals, count: professionals.length });
}
