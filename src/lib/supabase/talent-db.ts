import { createClient } from "@supabase/supabase-js";
import type { TalentProfile, CareerStatus } from "@/types";
import { normalizeCareerStatus, deriveFreeAgent } from "@/lib/utils/career-status";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function rowToProfile(row: Record<string, unknown>): TalentProfile {
  const social = (row.social_links as Record<string, string>) ?? {};
  return {
    id: String(row.id),
    slug: String(row.slug),
    displayName: String(row.display_name),
    ringName: row.ring_name ? String(row.ring_name) : undefined,
    nickname: row.nickname ? String(row.nickname) : undefined,
    legalName: row.legal_name ? String(row.legal_name) : undefined,
    talentType: "athlete",
    sport: row.sport as TalentProfile["sport"],
    weightClass: row.weight_class ? String(row.weight_class) : undefined,
    heightCm: row.height_cm != null ? Number(row.height_cm) : undefined,
    weightKg: row.weight_kg != null ? Number(row.weight_kg) : undefined,
    reachCm: row.reach_cm != null ? Number(row.reach_cm) : undefined,
    stance: row.stance ? String(row.stance) : undefined,
    record:
      row.record_wins != null
        ? {
            wins: Number(row.record_wins),
            losses: Number(row.record_losses ?? 0),
            draws: Number(row.record_draws ?? 0),
          }
        : undefined,
    nationality: String(row.nationality ?? row.location_country ?? "—"),
    country: row.location_country ? String(row.location_country) : undefined,
    city: row.location_city ? String(row.location_city) : undefined,
    location: [row.location_city, row.location_country].filter(Boolean).join(", ") || "—",
    currentOrganization: row.current_organization ? String(row.current_organization) : undefined,
    promotion: row.promotion ? String(row.promotion) : undefined,
    gym: row.gym ? String(row.gym) : undefined,
    experienceYears: row.experience_years != null ? Number(row.experience_years) : undefined,
    bio: String(row.bio ?? ""),
    verification: (row.verification as TalentProfile["verification"]) ?? "none",
    featured: Boolean(row.featured),
    ranking: row.ranking_position != null ? Number(row.ranking_position) : undefined,
    popularityScore: row.popularity_score != null ? Number(row.popularity_score) : undefined,
    avatarUrl: String(row.avatar_url ?? ""),
    tags: (row.tags as string[]) ?? [],
    careerStatus: normalizeCareerStatus(
      (row.career_status as string) ?? (row.availability as string),
      Boolean(row.free_agent)
    ),
    availability: normalizeCareerStatus(
      (row.career_status as string) ?? (row.availability as string),
      Boolean(row.free_agent)
    ) as CareerStatus,
    freeAgent: row.free_agent != null ? Boolean(row.free_agent) : deriveFreeAgent(
      normalizeCareerStatus((row.career_status as string) ?? (row.availability as string))
    ),
    contractEndsAt: row.contract_ends_at ? String(row.contract_ends_at) : undefined,
    availableForBooking: row.available_for_booking !== false,
    minBookingFee: row.min_booking_fee != null ? Number(row.min_booking_fee) : undefined,
    bookingEmail: row.booking_email ? String(row.booking_email) : undefined,
    careerHistory: (row.career_history as TalentProfile["careerHistory"]) ?? [],
    championships: (row.championships as TalentProfile["championships"]) ?? [],
    socialLinks: {
      instagram: row.instagram_handle ? String(row.instagram_handle) : social.instagram,
      twitter: row.twitter_handle ? String(row.twitter_handle) : social.twitter,
      youtube: social.youtube,
      website: social.website,
    },
    youtubeChannelId: row.youtube_channel_id ? String(row.youtube_channel_id) : undefined,
    marketValue: row.market_value != null ? Number(row.market_value) : undefined,
    dataSource: "user_generated",
  };
}

/** Optional Supabase read — merges with seed/API layer when USE_SUPABASE_TALENT=true */
export async function getTalentFromDatabase(): Promise<TalentProfile[]> {
  const client = getServiceClient();
  if (!client || process.env.USE_SUPABASE_TALENT !== "true") return [];

  const { data, error } = await client
    .from("athletes")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false });

  if (error || !data?.length) return [];
  return data.map((row) => rowToProfile(row as Record<string, unknown>));
}

export async function insertBookingInquiry(payload: {
  athleteSlug: string;
  recruiterClerkId?: string | null;
  eventName: string;
  eventDate?: string;
  venue?: string;
  location?: string;
  purseOffer?: number;
  message?: string;
  talentName: string;
}) {
  const client = getServiceClient();
  if (!client) return null;

  const { data, error } = await client
    .from("booking_inquiries")
    .insert({
      athlete_slug: payload.athleteSlug,
      talent_name: payload.talentName,
      recruiter_clerk_id: payload.recruiterClerkId ?? null,
      event_name: payload.eventName,
      event_date: payload.eventDate ?? null,
      venue: payload.venue ?? null,
      location: payload.location ?? null,
      purse_offer: payload.purseOffer ?? null,
      message: payload.message ?? null,
      status: "sent",
    })
    .select("id")
    .single();

  if (error) return null;
  return data;
}
