import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai, SCOUT_SYSTEM_PROMPT } from "@/lib/openai";
import { getAllTalent } from "@/lib/data/talent-repository";

const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const roster = await getAllTalent();
  const talentContext = roster.slice(0, 8)
    .map(
      (a) =>
        `- ${a.displayName} (${a.sport}, ${a.weightClass ?? "N/A"}): ${a.record ? `${a.record.wins}-${a.record.losses}` : "N/A"}, ${a.location}, verified: ${a.verification}`
    )
    .join("\n");

  if (!openai) {
    return NextResponse.json({
      reply: `**ScoutFight AI (Demo)**\n\nQuestion: "${parsed.data.message}"\n\nLive roster (seed + Wikipedia + APIs):\n${talentContext}\n\nSet OPENAI_API_KEY for full GPT scouting analysis.`,
      source: "demo",
    });
  }

  const messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }> = [
    {
      role: "system",
      content: `${SCOUT_SYSTEM_PROMPT}\n\nCurrent platform talent sample:\n${talentContext}`,
    },
    ...(parsed.data.history ?? []).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: parsed.data.message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 800,
    temperature: 0.7,
  });

  const reply =
    completion.choices[0]?.message?.content ??
    "I could not generate a scouting response. Please try again.";

  return NextResponse.json({ reply, source: "openai" });
}
