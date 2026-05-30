import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getOpportunityBySlug,
  recordApplication,
} from "@/lib/data/opportunity-repository";

const schema = z.object({
  opportunitySlug: z.string().min(1),
  talentSlug: z.string().min(1),
  talentName: z.string().min(1),
  applicantEmail: z.string().email().optional(),
  coverMessage: z.string().min(10),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const opportunity = await getOpportunityBySlug(parsed.data.opportunitySlug);
  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }
  if (!opportunity.allowsApplications) {
    return NextResponse.json({ error: "Applications closed" }, { status: 403 });
  }

  const application = recordApplication({
    opportunitySlug: opportunity.slug,
    opportunityTitle: opportunity.title,
    organizationName: opportunity.organizationName,
    talentSlug: parsed.data.talentSlug,
    talentName: parsed.data.talentName,
    applicantEmail: parsed.data.applicantEmail,
    coverMessage: parsed.data.coverMessage,
  });

  return NextResponse.json({ success: true, application });
}
