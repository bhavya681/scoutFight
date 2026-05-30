import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai, MATCHMAKER_SYSTEM_PROMPT } from "@/lib/openai";
import {
  findMatchmakerCandidates,
  formatMatchmakerMarkdown,
  rosterSummaryForAi,
} from "@/lib/matchmaker";

const schema = z.object({
  sport: z.string().optional(),
  weightClass: z.string().optional(),
  country: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  brief: z.string().min(1).max(3000),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const criteria = {
    sport: parsed.data.sport,
    weightClass: parsed.data.weightClass,
    country: parsed.data.country,
    gender: parsed.data.gender,
    brief: parsed.data.brief,
  };

  const { picks, poolSize } = await findMatchmakerCandidates(criteria, 12);

  let aiNote: string | undefined;
  let source: "rules" | "openai" = "rules";

  if (openai && picks.length > 0) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${MATCHMAKER_SYSTEM_PROMPT}\n\nPre-filtered candidates (already match sport/weight):\n${rosterSummaryForAi(picks)}`,
          },
          {
            role: "user",
            content: `Sport: ${criteria.sport ?? "any"}\nWeight/Role: ${criteria.weightClass ?? "any"}\nCountry: ${criteria.country ?? "any"}\nGender: ${criteria.gender ?? "any"}\nBrief: ${criteria.brief}\n\nProvide 3–5 best picks with matchup rationale, booking notes, and any gaps. Do not list athletes outside this candidate set.`,
          },
        ],
        max_tokens: 900,
        temperature: 0.5,
      });
      aiNote = completion.choices[0]?.message?.content ?? undefined;
      if (aiNote) source = "openai";
    } catch (e) {
      console.warn("[ScoutFight] Matchmaker OpenAI:", e);
    }
  }

  const recommendations = formatMatchmakerMarkdown(
    criteria,
    picks,
    poolSize,
    aiNote
  );

  return NextResponse.json({
    recommendations,
    matches: picks,
    poolSize,
    source,
  });
}
