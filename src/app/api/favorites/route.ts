import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const favoriteSchema = z.object({
  athleteId: z.string().optional(),
  promotionId: z.string().optional(),
  action: z.enum(["add", "remove"]),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({ success: true, ...parsed.data });
}

export async function GET() {
  return NextResponse.json({ favorites: [], source: "client-store" });
}
