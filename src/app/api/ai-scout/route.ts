import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai, SCOUT_SYSTEM_PROMPT } from "@/lib/openai";
import {
  findScoutMatches,
  formatScoutReply,
  rosterSummaryForScout,
} from "@/lib/ai-scout";

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

  const { query, picks, poolSize } = await findScoutMatches(parsed.data.message, 12);

  let aiNote: string | undefined;
  let source: "rules" | "openai" = "rules";

  if (openai && picks.length > 0) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${SCOUT_SYSTEM_PROMPT}\n\nPre-filtered matches only — do not invent athletes:\n${rosterSummaryForScout(picks)}`,
          },
          {
            role: "user",
            content: parsed.data.message,
          },
        ],
        max_tokens: 500,
        temperature: 0.5,
      });
      aiNote = completion.choices[0]?.message?.content ?? undefined;
      if (aiNote) source = "openai";
    } catch (e) {
      console.warn("[ScoutFight] AI Scout OpenAI:", e);
    }
  }

  const reply = formatScoutReply(
    parsed.data.message,
    query,
    picks,
    poolSize,
    aiNote
  );

  return NextResponse.json({
    reply,
    source,
    matches: picks,
    poolSize,
    filters: query,
  });
}
