import type { SportType, TalentProfile } from "@/types";
import { WEIGHT_CLASSES } from "@/lib/constants";
import { searchTalent } from "@/lib/data/talent-repository";
import { scoreTalentForBrief } from "@/lib/matchmaker";
import { formatRecord } from "@/lib/utils";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import {
  REGION_ALIASES,
  talentMatchesRegionTerms,
} from "@/lib/utils/region-match";

export interface ScoutQuery {
  sports: SportType[];
  gender?: "male" | "female";
  weightClass?: string;
  regionTerms: string[];
  keywords: string[];
  intent: "search" | "compare" | "booking" | "general";
}

export interface ScoutPick {
  slug: string;
  displayName: string;
  sport: string;
  weightClass?: string;
  nationality: string;
  gender?: string;
  record?: string;
  promotion?: string;
  score: number;
  reasons: string[];
  profileUrl: string;
}

const SPORT_HINTS: { sport: SportType; terms: string[] }[] = [
  { sport: "mma", terms: ["mma", "mixed martial", "ufc", "bellator", "pfl", "fighter"] },
  { sport: "wrestling", terms: ["wrestl", "wwe", "aew", "tna", "impact wrestling"] },
  { sport: "boxing", terms: ["boxing", "boxer"] },
  { sport: "kickboxing", terms: ["kickbox"] },
  { sport: "muay_thai", terms: ["muay thai", "muay_thai"] },
  { sport: "bjj", terms: ["bjj", "jiu-jitsu", "jiu jitsu"] },
  { sport: "grappling", terms: ["grappl", "adcc", "submission"] },
  { sport: "cricket", terms: ["cricket", "cricketer", "ipl", "bbl", "psl", "batsman", "bowler", "all-rounder"] },
];

function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/[^\w\s'-]/g, " ")} `;
}

function detectWeightClass(message: string): string | undefined {
  const n = normalize(message);
  for (const list of Object.values(WEIGHT_CLASSES)) {
    for (const wc of list) {
      if (n.includes(` ${wc.toLowerCase()} `)) return wc;
    }
  }
  return undefined;
}

export function parseScoutQuery(message: string): ScoutQuery {
  const raw = message.trim();
  const n = normalize(raw);
  const sports: SportType[] = [];

  for (const { sport, terms } of SPORT_HINTS) {
    if (terms.some((t) => n.includes(` ${t} `) || n.includes(t))) {
      if (!sports.includes(sport)) sports.push(sport);
    }
  }

  let gender: ScoutQuery["gender"];
  if (/\b(female|women|woman|girls?|ladies)\b/.test(n)) gender = "female";
  else if (/\b(male|men|man|guys?)\b/.test(n)) gender = "male";

  const regionTerms: string[] = [];
  for (const terms of Object.values(REGION_ALIASES)) {
    if (terms.some((t) => n.includes(` ${t.trim()} `) || n.includes(t.trim()))) {
      regionTerms.push(...terms);
    }
  }

  let intent: ScoutQuery["intent"] = "search";
  if (/\b(compare|versus|vs\.?|matchup)\b/.test(n)) intent = "compare";
  else if (/\b(book|booking|card|event|fit|roster)\b/.test(n)) intent = "booking";

  const stop = new Set([
    "find",
    "show",
    "list",
    "scout",
    "me",
    "the",
    "and",
    "for",
    "with",
    "who",
    "are",
    "any",
    "some",
    "mma",
    "wrestler",
    "wrestlers",
    "fighter",
    "fighters",
    "female",
    "male",
    "women",
    "men",
    "indian",
    "india",
  ]);
  const keywords = raw
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));

  return {
    sports,
    gender,
    weightClass: detectWeightClass(raw),
    regionTerms: [...new Set(regionTerms)],
    keywords,
    intent,
  };
}

function recordString(t: TalentProfile): string | undefined {
  if (!t.record) return undefined;
  return formatRecord(t.record.wins, t.record.losses, t.record.draws);
}

function scoreForScoutQuery(t: TalentProfile, query: ScoutQuery, message: string): {
  score: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;

  if (query.sports.length > 0 && query.sports.includes(t.sport)) {
    score += 30;
    reasons.push(`Sport: ${t.sport}`);
  } else if (query.sports.length > 0) {
    score -= 40;
  }

  if (query.gender) {
    if (t.gender === query.gender) {
      score += 35;
      reasons.push(query.gender === "female" ? "Female athlete" : "Male athlete");
    } else if (t.gender) {
      score -= 50;
    } else if (query.gender === "female" && /\b(women|female)\b/i.test(t.bio)) {
      score += 15;
      reasons.push("Likely women's division (bio)");
    }
  }

  if (query.weightClass && t.weightClass) {
    const wc = query.weightClass.toLowerCase();
    const tw = t.weightClass.toLowerCase();
    if (tw.includes(wc) || wc.includes(tw)) {
      score += 20;
      reasons.push(query.weightClass);
    }
  }

  if (query.regionTerms.length > 0 && talentMatchesRegionTerms(t, query.regionTerms)) {
    score += 40;
    reasons.push(`Region: ${t.nationality}`);
  } else if (query.regionTerms.length > 0) {
    score -= 25;
  }

  for (const kw of query.keywords) {
    const hay = `${t.displayName} ${t.bio} ${t.tags.join(" ")}`.toLowerCase();
    if (hay.includes(kw)) score += 6;
  }

  const briefScore = scoreTalentForBrief(t, message);
  score += briefScore.score * 0.35;
  if (briefScore.reasons[0] && !reasons.includes(briefScore.reasons[0])) {
    reasons.push(briefScore.reasons[0]);
  }

  if (isUsableImageUrl(t.avatarUrl)) score += 5;

  return { score, reasons: [...new Set(reasons)].slice(0, 4) };
}

export async function findScoutMatches(
  message: string,
  limit = 12
): Promise<{ query: ScoutQuery; picks: ScoutPick[]; poolSize: number }> {
  const query = parseScoutQuery(message);

  // Gender is scored, not hard-filtered — many Wikipedia seeds lack gender tags.
  let pool = await searchTalent({
    sport: query.sports.length === 1 ? query.sports[0] : undefined,
    weightClass: query.weightClass,
  });

  if (query.sports.length > 1) {
    pool = pool.filter((t) => query.sports.includes(t.sport));
  }

  const scored = pool
    .map((t) => {
      const { score, reasons } = scoreForScoutQuery(t, query, message);
      return {
        slug: t.slug,
        displayName: t.displayName,
        sport: t.sport,
        weightClass: t.weightClass,
        nationality: t.nationality,
        gender: t.gender,
        record: recordString(t),
        promotion: t.promotion,
        score,
        reasons,
        profileUrl: `/athletes/${t.slug}`,
      } satisfies ScoutPick;
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score);

  const picks = scored.slice(0, limit);

  return { query, picks, poolSize: pool.length };
}

function describeFilters(q: ScoutQuery): string {
  const parts: string[] = [];
  if (q.sports.length) parts.push(q.sports.join(" / "));
  if (q.gender) parts.push(q.gender);
  if (q.weightClass) parts.push(q.weightClass);
  if (q.regionTerms.length) parts.push(q.regionTerms[0]);
  return parts.length ? parts.join(" · ") : "all sports";
}

export function getScoutDiscoverUrl(q: ScoutQuery): string {
  const params = new URLSearchParams();
  if (q.sports.length === 1) params.set("sport", q.sports[0]);
  if (q.gender) params.set("gender", q.gender);
  if (q.weightClass) params.set("weightClass", q.weightClass);
  if (q.regionTerms[0]) params.set("q", q.regionTerms[0]);
  const qs = params.toString();
  return qs ? `/discover?${qs}` : "/discover";
}

/** Short assistant text when structured result cards are shown in the UI */
export function formatScoutIntro(
  query: ScoutQuery,
  picks: ScoutPick[],
  poolSize: number
): string {
  const filters = describeFilters(query);
  if (picks.length === 0) {
    return `No strong matches for ${filters} in the live directory (${poolSize} athletes searched). Try broader terms or open Discover.`;
  }
  return `Found ${picks.length} match${picks.length === 1 ? "" : "es"} for ${filters} (${poolSize} in pool). Tap a profile below to view full stats.`;
}

export function formatScoutReply(
  message: string,
  query: ScoutQuery,
  picks: ScoutPick[],
  poolSize: number,
  aiNote?: string
): string {
  const lines: string[] = [
    "**ScoutFight Scout**",
    "",
    `**Your question:** ${message}`,
    `**Understood as:** ${describeFilters(query)}`,
    `**Roster searched:** ${poolSize} athlete${poolSize === 1 ? "" : "s"} after filters`,
    "",
  ];

  if (query.intent === "compare") {
    lines.push(
      "_Tip: Open **Compare** with two athlete profiles for side-by-side stats._",
      ""
    );
  }
  if (query.intent === "booking") {
    lines.push(
      "_Tip: Use **AI Matchmaker** on the homepage for event-style shortlists with booking notes._",
      ""
    );
  }

  if (picks.length === 0) {
    lines.push(
      "No strong matches in the live directory for that combination.",
      "",
      "**Why this happens:**",
      "- Many wrestlers come from Wikipedia without country or gender tags yet.",
      "- MMA photos often come from UFC rosters; India / regional talent may be under-represented in the seed.",
      "",
      `**Next step:** Browse **[Discover](${getScoutDiscoverUrl(query)})** and widen sport or region filters.`,
      "",
      "_Powered by live roster search (free). Optional `OPENAI_API_KEY` adds GPT narrative only._"
    );
    if (aiNote) lines.push("", "**Optional AI note:**", "", aiNote);
    return lines.join("\n");
  }

  lines.push("**Best matches:**", "");
  picks.forEach((p, i) => {
    lines.push(
      `${i + 1}. **${p.displayName}** — ${p.sport}${p.weightClass ? ` · ${p.weightClass}` : ""} · ${p.nationality}${p.gender ? ` · ${p.gender}` : ""}${p.record ? ` · ${p.record}` : ""}`
    );
    if (p.promotion) lines.push(`   Promotion: ${p.promotion}`);
    lines.push(`   ${p.reasons.join(" · ")}`);
    lines.push(`   [View profile](${p.profileUrl})`);
    lines.push("");
  });

  lines.push(
    `**See more:** [Discover](${getScoutDiscoverUrl(query)})`,
    "",
    "_Ranked from your live Wikipedia / TheSportsDB / Wikidata roster — no paid API required._"
  );

  if (aiNote) {
    lines.push("", "---", "", "**AI analysis (OpenAI):**", "", aiNote);
  } else {
    lines.push(
      "",
      "_Free mode: smart filters + scoring. Set `OPENAI_API_KEY` only if you want extra narrative (paid OpenAI). Free alternatives: Groq, Google Gemini API free tier, or local Ollama — wire the same key pattern later._"
    );
  }

  return lines.join("\n");
}

export function rosterSummaryForScout(picks: ScoutPick[]): string {
  return picks
    .map(
      (p, i) =>
        `${i + 1}. ${p.displayName} (${p.sport}, ${p.weightClass ?? "N/A"}, ${p.nationality}, ${p.gender ?? "gender unknown"}, ${p.record ?? "no record"})`
    )
    .join("\n");
}
