import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  recipientId: z.string().optional(),
  content: z.string().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: {
      id: crypto.randomUUID(),
      ...parsed.data,
      createdAt: new Date().toISOString(),
    },
  });
}

export async function GET() {
  return NextResponse.json({
    conversations: [
      {
        id: "demo-1",
        participant: "Apex Fight League",
        lastMessage: "Main card slot discussion",
      },
    ],
  });
}
