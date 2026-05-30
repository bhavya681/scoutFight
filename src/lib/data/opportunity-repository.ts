import type { MarketplaceListing, OpportunityApplication } from "@/types";
import {
  getDiscoveredOpportunities,
  findDiscoveredOpportunity,
  getDiscoveredOpportunitySlugs,
} from "./opportunity-discovery";

export async function getAllOpportunities(): Promise<MarketplaceListing[]> {
  return getDiscoveredOpportunities();
}

export async function getOpportunityBySlug(slug: string): Promise<MarketplaceListing | null> {
  return findDiscoveredOpportunity(slug);
}

export async function getOpportunitySlugs(): Promise<{ slug: string }[]> {
  return getDiscoveredOpportunitySlugs();
}

const applicationLog: OpportunityApplication[] = [];

export function recordApplication(app: Omit<OpportunityApplication, "id" | "createdAt" | "status">) {
  const entry: OpportunityApplication = {
    ...app,
    id: crypto.randomUUID(),
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  applicationLog.push(entry);
  return entry;
}

export function getApplicationsForTalent(talentSlug: string): OpportunityApplication[] {
  return applicationLog.filter((a) => a.talentSlug === talentSlug);
}

export function getAllApplications(): OpportunityApplication[] {
  return [...applicationLog];
}
