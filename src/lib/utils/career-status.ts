import type { CareerStatus } from "@/types";

const LEGACY_MAP: Record<string, CareerStatus> = {
  available: "open_to_bookings",
  not_available: "inactive",
};

export function normalizeCareerStatus(
  status?: string | null,
  freeAgent?: boolean
): CareerStatus {
  if (freeAgent && !status) return "free_agent";
  if (!status) return "seeking_opportunities";
  const mapped = LEGACY_MAP[status] ?? status;
  const valid: CareerStatus[] = [
    "free_agent",
    "open_to_offers",
    "open_to_bookings",
    "under_contract",
    "contract_ending_soon",
    "seeking_opportunities",
    "retired",
    "inactive",
  ];
  if (valid.includes(mapped as CareerStatus)) return mapped as CareerStatus;
  return "seeking_opportunities";
}

export function deriveFreeAgent(status: CareerStatus): boolean {
  return status === "free_agent";
}

export function isOpenToRecruitment(status: CareerStatus): boolean {
  return [
    "free_agent",
    "open_to_offers",
    "open_to_bookings",
    "contract_ending_soon",
    "seeking_opportunities",
  ].includes(status);
}
