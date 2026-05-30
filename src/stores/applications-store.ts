"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OpportunityApplication } from "@/types";

interface ApplicationsState {
  applications: OpportunityApplication[];
  addApplication: (app: OpportunityApplication) => void;
  updateStatus: (id: string, status: OpportunityApplication["status"]) => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set) => ({
      applications: [],
      addApplication: (app) =>
        set((s) => ({ applications: [app, ...s.applications] })),
      updateStatus: (id, status) =>
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),
    }),
    { name: "pwr-scout-applications" }
  )
);
