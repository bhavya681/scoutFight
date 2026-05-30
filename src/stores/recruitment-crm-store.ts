"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  RecruiterNote,
  CandidateRecord,
  RecruiterOffer,
  InterviewSlot,
} from "@/types";

interface RecruitmentCrmState {
  notes: RecruiterNote[];
  candidates: CandidateRecord[];
  offers: RecruiterOffer[];
  interviews: InterviewSlot[];
  addNote: (talentId: string, talentName: string, body: string) => void;
  setCandidateStage: (
    talentId: string,
    talentSlug: string,
    talentName: string,
    stage: CandidateRecord["stage"]
  ) => void;
  addOffer: (offer: Omit<RecruiterOffer, "id" | "createdAt" | "status">) => void;
  scheduleInterview: (
    interview: Omit<InterviewSlot, "id" | "status">
  ) => void;
}

const DEFAULT_CANDIDATES: CandidateRecord[] = [
  {
    talentId: "talent-marcus-steel",
    talentSlug: "marcus-steel",
    talentName: "Marcus Steel",
    stage: "shortlisted",
    updatedAt: new Date().toISOString(),
  },
];

export const useRecruitmentCrmStore = create<RecruitmentCrmState>()(
  persist(
    (set) => ({
      notes: [],
      candidates: DEFAULT_CANDIDATES,
      offers: [],
      interviews: [],
      addNote: (talentId, talentName, body) =>
        set((s) => ({
          notes: [
            {
              id: crypto.randomUUID(),
              talentId,
              talentName,
              body,
              createdAt: new Date().toISOString(),
            },
            ...s.notes,
          ],
        })),
      setCandidateStage: (talentId, talentSlug, talentName, stage) =>
        set((s) => {
          const existing = s.candidates.find((c) => c.talentId === talentId);
          if (existing) {
            return {
              candidates: s.candidates.map((c) =>
                c.talentId === talentId
                  ? { ...c, stage, updatedAt: new Date().toISOString() }
                  : c
              ),
            };
          }
          return {
            candidates: [
              ...s.candidates,
              {
                talentId,
                talentSlug,
                talentName,
                stage,
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        }),
      addOffer: (offer) =>
        set((s) => ({
          offers: [
            {
              ...offer,
              id: crypto.randomUUID(),
              status: "draft",
              createdAt: new Date().toISOString(),
            },
            ...s.offers,
          ],
        })),
      scheduleInterview: (interview) =>
        set((s) => ({
          interviews: [
            {
              ...interview,
              id: crypto.randomUUID(),
              status: "scheduled",
            },
            ...s.interviews,
          ],
        })),
    }),
    { name: "pwr-scout-crm" }
  )
);
