import { NextResponse } from "next/server";
import { MVP_DATA_STACK, MVP_SEED_LIMITS } from "@/lib/mvp/config";
import { getMvpRosterStats } from "@/lib/data/talent-repository";

export const revalidate = 3600;

export async function GET() {
  const roster = await getMvpRosterStats();

  return NextResponse.json({
    strategy: "multi_api_mvp",
    limits: MVP_SEED_LIMITS,
    stack: MVP_DATA_STACK,
    roster,
    notes: [
      "All catalog data is API-driven — no static athletes.json or marketplace.json.",
      "No single API covers MMA + wrestling like Tapology/Cagematch.",
      "Set USE_SUPABASE_TALENT=true for user-created profiles.",
      "Set YOUTUBE_API_KEY for reliable highlight videos.",
      "Set MMA_API_BASE_URL + MMA_API_KEY for richer MMA records.",
    ],
  });
}
