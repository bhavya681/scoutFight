import type { TalentProfile } from "@/types";
import { getRankedTalent, searchTalent } from "@/lib/data/talent-repository";
import { formatRecord } from "@/lib/utils";
import { isUsableImageUrl } from "@/lib/utils/avatar-fallback";
import { getCountryLabel, talentMatchesCountry } from "@/lib/utils/region-match";

export interface MatchmakerCriteria {
  sport?: string;
  weightClass?: string;
  country?: string;
  gender?: "male" | "female";
  brief: string;
}

function talentMatchesGender(
  t: TalentProfile,
  gender?: "male" | "female"
): boolean {
  if (!gender) return true;
  if (t.gender === gender) return true;
  if (!t.gender && gender === "female" && /\b(women|female)\b/i.test(t.bio)) {
    return true;
  }
  return false;
}

function genderLabel(gender?: "male" | "female"): string {
  if (gender === "female") return "Female";
  if (gender === "male") return "Male";
  return "any gender";
}

export interface MatchmakerPick {
  slug: string;
  displayName: string;
  sport: string;
  weightClass?: string;
  nationality: string;
  record?: string;
  promotion?: string;
  availability: string;
  score: number;
  reasons: string[];
  profileUrl: string;
  hasPhoto: boolean;
}

function normalizeToken(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

function recordString(t: TalentProfile): string | undefined {
  if (!t.record) return undefined;
  return formatRecord(t.record.wins, t.record.losses, t.record.draws);
}

function briefMentions(brief: string, ...terms: string[]): boolean {
  const b = brief.toLowerCase();
  return terms.some((t) => b.includes(t));
}

/** Score how well an athlete fits the event brief (on top of weight/sport filter) */
export function scoreTalentForBrief(
  t: TalentProfile,
  brief: string,
  countryId?: string,
  gender?: "male" | "female"
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  if (t.featured) {
    score += 25;
    reasons.push("Featured in live directory");
  }
  if (isUsableImageUrl(t.avatarUrl)) {
    score += 8;
    reasons.push("Profile photo available");
  }
  if (t.ranking && t.ranking <= 15) {
    score += 12;
    reasons.push(`Directory rank #${t.ranking}`);
  }
  if (t.record) {
    const { wins, losses, draws } = t.record;
    const bouts = wins + losses + draws;
    if (bouts > 0) {
      score += wins * 4 + Math.round((wins / bouts) * 30);
      if (wins >= 10) reasons.push(`Strong record (${recordString(t)})`);
      else if (bouts > 0) reasons.push(`Record ${recordString(t)}`);
    }
  }
  if (t.availableForBooking && t.careerStatus === "open_to_bookings") {
    score += 15;
    reasons.push("Open to bookings");
  }
  if (t.freeAgent) {
    score += 6;
    if (briefMentions(brief, "free agent", "sign", "contract")) {
      score += 10;
      reasons.push("Free agent");
    }
  }
  if (t.promotion) {
    score += 4;
    if (briefMentions(brief, t.promotion.toLowerCase().split(" ")[0])) {
      score += 12;
      reasons.push(`Promotion fit (${t.promotion})`);
    }
  }

  if (briefMentions(brief, "main card", "main event", "headline", "headliner", "ppv")) {
    if (t.featured || (t.record?.wins ?? 0) >= 8) {
      score += 20;
      reasons.push("Main-card profile strength");
    } else {
      score -= 5;
    }
  }
  if (briefMentions(brief, "co-main", "co main")) {
    score += 12;
    reasons.push("Co-main candidate");
  }
  if (briefMentions(brief, "prospect", "development", "rising", "debut")) {
    if ((t.record?.wins ?? 0) <= 8) {
      score += 14;
      reasons.push("Prospect / developmental fit");
    }
  }
  if (briefMentions(brief, "international", "global", "market", "draw")) {
    score += 6;
    if (t.nationality && t.nationality !== "International") {
      reasons.push(`Market draw (${t.nationality})`);
    }
  }

  const nat = normalizeToken(t.nationality);
  if (nat && brief.toLowerCase().includes(nat)) {
    score += 18;
    reasons.push("Regional match in brief");
  }

  if (countryId) {
    if (talentMatchesCountry(t, countryId)) {
      score += 45;
      reasons.push(`Country: ${getCountryLabel(countryId) ?? countryId}`);
    } else {
      score -= 30;
    }
  }

  if (gender) {
    if (t.gender === gender) {
      score += 40;
      reasons.push(gender === "female" ? "Female athlete" : "Male athlete");
    } else if (talentMatchesGender(t, gender) && !t.gender) {
      score += 18;
      reasons.push(`Likely ${gender} (profile hints)`);
    } else if (t.gender && t.gender !== gender) {
      score -= 45;
    }
  }

  if (briefMentions(brief, "female", "women", "woman") && t.gender === "female") {
    score += 12;
    reasons.push("Women's division fit (brief)");
  }
  if (briefMentions(brief, "male", "men", "man") && t.gender === "male") {
    score += 12;
    reasons.push("Men's division fit (brief)");
  }

  if (reasons.length === 0) reasons.push("Matches sport & weight criteria");

  return { score, reasons: [...new Set(reasons)].slice(0, 4) };
}

export async function findMatchmakerCandidates(
  criteria: MatchmakerCriteria,
  limit = 12
): Promise<{ picks: MatchmakerPick[]; poolSize: number }> {
  const sport = normalizeToken(criteria.sport) || undefined;
  const weightClass = criteria.weightClass?.trim() || undefined;
  const country = criteria.country?.trim() || undefined;
  const gender = criteria.gender;

  let pool = await searchTalent({
    sport: sport || undefined,
    weightClass: weightClass || undefined,
    gender,
    availableOnly: briefMentions(
      criteria.brief,
      "available",
      "booking",
      "active"
    ),
  });

  if (country) {
    pool = pool.filter((t) => talentMatchesCountry(t, country));
  }

  if (gender) {
    const byGender = pool.filter((t) => talentMatchesGender(t, gender));
    if (byGender.length > 0) pool = byGender;
  }

  const ranked = await getRankedTalent({
    sport: sport || undefined,
    weightClass: weightClass || undefined,
  });
  const rankOrder = new Map(ranked.map((t, i) => [t.slug, i]));

  const scored = pool
    .map((t) => {
      const { score, reasons } = scoreTalentForBrief(
        t,
        criteria.brief,
        country,
        gender
      );
      const rankBoost = rankOrder.has(t.slug)
        ? Math.max(0, 30 - (rankOrder.get(t.slug) ?? 30))
        : 0;
      return {
        slug: t.slug,
        displayName: t.displayName,
        sport: t.sport,
        weightClass: t.weightClass,
        nationality: t.nationality,
        record: recordString(t),
        promotion: t.promotion,
        availability: t.availability,
        score: score + rankBoost,
        reasons,
        profileUrl: `/athletes/${t.slug}`,
        hasPhoto: isUsableImageUrl(t.avatarUrl),
      } satisfies MatchmakerPick;
    })
    .sort((a, b) => b.score - a.score);

  return {
    picks: scored.slice(0, limit),
    poolSize: pool.length,
  };
}

export function formatMatchmakerMarkdown(
  criteria: MatchmakerCriteria,
  picks: MatchmakerPick[],
  poolSize: number,
  aiNote?: string
): string {
  const sportLabel = criteria.sport?.toUpperCase() || "ANY SPORT";
  const wcLabel = criteria.weightClass?.trim() || "any class";
  const countryLabel = getCountryLabel(criteria.country) ?? "any country";
  const lines: string[] = [
    "**ScoutFight Matchmaker**",
    "",
    `**Criteria:** ${sportLabel} · ${wcLabel} · ${countryLabel} · ${genderLabel(criteria.gender)}`,
    `**Brief:** ${criteria.brief}`,
    `**Pool:** ${poolSize} athlete${poolSize === 1 ? "" : "s"} matched filters`,
    "",
  ];

  if (picks.length === 0) {
    lines.push(
      "No athletes match this sport, weight, country, and gender in the live directory.",
      "",
      "Try **Any gender** or **Any country**, a broader weight class, or check **Discover** for the full roster."
    );
    if (aiNote) lines.push("", aiNote);
    return lines.join("\n");
  }

  lines.push("**Top matches:**", "");
  picks.forEach((p, i) => {
    lines.push(
      `${i + 1}. **${p.displayName}** — ${p.sport}${p.weightClass ? ` · ${p.weightClass}` : ""} · ${p.nationality}${p.record ? ` · ${p.record}` : ""}`
    );
    lines.push(`   ${p.reasons.join(" · ")}`);
    lines.push(`   Profile: ${p.profileUrl}`);
    lines.push("");
  });

  if (aiNote) {
    lines.push("---", "", "**AI analysis:**", "", aiNote);
  } else {
    lines.push(
      "_Ranked from live Wikipedia / TheSportsDB / Wikidata data. Add `OPENAI_API_KEY` for narrative matchup analysis._"
    );
  }

  return lines.join("\n");
}

export function rosterSummaryForAi(picks: MatchmakerPick[]): string {
  return picks
    .map(
      (p, i) =>
        `${i + 1}. ${p.displayName} (${p.sport}, ${p.weightClass ?? "N/A"}, ${p.nationality}, ${p.record ?? "no record"}, score ${p.score}) — ${p.reasons[0]}`
    )
    .join("\n");
}
