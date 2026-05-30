import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/booking-form";
import { getTalentBySlug } from "@/lib/data/talent-repository";

export const metadata: Metadata = {
  title: "Send inquiry",
  description: "Contact an athlete for booking or recruitment.",
};

interface PageProps {
  searchParams: Promise<{ athlete?: string }>;
}

export default async function BookingPage({ searchParams }: PageProps) {
  const { athlete: athleteSlug } = await searchParams;
  const athlete = athleteSlug ? await getTalentBySlug(athleteSlug) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Recruitment inquiry</h1>
      <p className="text-muted-foreground mt-2 mb-8 text-sm">
        {athlete
          ? `Send an inquiry to ${athlete.displayName}.`
          : "Submit a scouting or booking inquiry to an athlete."}
      </p>
      <BookingForm
        defaultAthleteSlug={athlete?.slug}
        defaultAthleteName={athlete?.displayName}
      />
    </div>
  );
}
