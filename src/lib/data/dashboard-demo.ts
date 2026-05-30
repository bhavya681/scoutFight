import type { BookingRequest, Contract } from "@/types";

/** Recruiter dashboard demo records (user-submitted, not athlete catalog) */
export const DEMO_BOOKINGS: BookingRequest[] = [
  {
    id: "b1",
    eventName: "Regional MMA card",
    eventDate: "2026-09-12",
    venue: "TBD",
    location: "Las Vegas, NV",
    purseOffer: 25000,
    status: "negotiating",
    talentName: "Jon Jones",
    recruiterName: "Your organization",
    message: "Main card slot — talent sourced via PWR Scout.",
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_CONTRACTS: Contract[] = [
  {
    id: "c1",
    title: "Appearance agreement (draft)",
    talentName: "Roman Reigns",
    organizationName: "Your promotion",
    status: "draft",
    startDate: "2026-10-01",
  },
];
