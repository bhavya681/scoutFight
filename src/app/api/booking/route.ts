import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getTalentBySlug } from "@/lib/data/talent-repository";
import { getProfessionalBySlug } from "@/lib/data/professional-repository";
import { insertBookingInquiry } from "@/lib/supabase/talent-db";

const bookingSchema = z.object({
  athleteSlug: z.string().optional(),
  professionalSlug: z.string().optional(),
  eventName: z.string().min(1),
  eventDate: z.string().optional(),
  venue: z.string().optional(),
  location: z.string().optional(),
  purseOffer: z.number().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const slug = parsed.data.athleteSlug ?? parsed.data.professionalSlug;
  if (!slug) {
    return NextResponse.json({ error: "Talent slug required" }, { status: 400 });
  }

  const athlete = parsed.data.athleteSlug
    ? await getTalentBySlug(parsed.data.athleteSlug)
    : null;
  const professional = parsed.data.professionalSlug
    ? await getProfessionalBySlug(parsed.data.professionalSlug)
    : null;
  const talent = athlete ?? professional;

  if (!talent) {
    return NextResponse.json({ error: "Talent not found" }, { status: 404 });
  }

  const talentName = talent.displayName;

  let recruiterId: string | null = null;
  try {
    const { userId } = await auth();
    recruiterId = userId;
  } catch {
    /* demo */
  }

  const persisted = await insertBookingInquiry({
    athleteSlug: slug,
    talentName,
    recruiterClerkId: recruiterId,
    eventName: parsed.data.eventName,
    eventDate: parsed.data.eventDate,
    venue: parsed.data.venue,
    location: parsed.data.location,
    purseOffer: parsed.data.purseOffer,
    message: parsed.data.message,
  });

  return NextResponse.json({
    success: true,
    source: "scoutfight",
    persisted: !!persisted,
    booking: {
      id: persisted?.id ?? crypto.randomUUID(),
      talent: talentName,
      bookingEmail:
        "bookingEmail" in talent ? talent.bookingEmail : talent.bookingEmail,
      ...parsed.data,
      status: "sent",
    },
    message: persisted
      ? "Booking inquiry saved."
      : "Inquiry recorded — view it in your dashboard.",
  });
}
