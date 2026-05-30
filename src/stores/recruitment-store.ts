import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecruitmentList {
  id: string;
  name: string;
  description?: string;
  talentIds: string[];
  createdAt: string;
}

interface RecruitmentState {
  lists: RecruitmentList[];
  createList: (name: string, description?: string) => string;
  addToList: (listId: string, talentId: string) => void;
  removeFromList: (listId: string, talentId: string) => void;
  deleteList: (listId: string) => void;
}

const DEFAULT_LISTS: RecruitmentList[] = [
  {
    id: "default-1",
    name: "AFL 48 — Welterweight Targets",
    description: "Main card shortlist",
    talentIds: ["talent-jon-jones", "talent-conor-mcgregor"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "default-2",
    name: "Summer Tour — Heavyweights",
    talentIds: ["talent-roman-reigns"],
    createdAt: new Date().toISOString(),
  },
];

export const useRecruitmentStore = create<RecruitmentState>()(
  persist(
    (set) => ({
      lists: DEFAULT_LISTS,
      createList: (name, description) => {
        const id = crypto.randomUUID();
        set((s) => ({
          lists: [
            ...s.lists,
            { id, name, description, talentIds: [], createdAt: new Date().toISOString() },
          ],
        }));
        return id;
      },
      addToList: (listId, talentId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId && !l.talentIds.includes(talentId)
              ? { ...l, talentIds: [...l.talentIds, talentId] }
              : l
          ),
        })),
      removeFromList: (listId, talentId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId
              ? { ...l, talentIds: l.talentIds.filter((id) => id !== talentId) }
              : l
          ),
        })),
      deleteList: (listId) =>
        set((s) => ({ lists: s.lists.filter((l) => l.id !== listId) })),
    }),
    { name: "pwr-scout-recruitment" }
  )
);
