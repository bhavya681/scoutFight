import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 4;

export interface CompareItem {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string;
  type: "athlete" | "professional";
  sport?: string;
  role?: string;
}

interface CompareState {
  items: CompareItem[];
  add: (item: CompareItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          if (s.items.some((i) => i.id === item.id)) return s;
          if (s.items.length >= MAX_COMPARE) return s;
          return { items: [...s.items, item] };
        }),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "pwr-scout-compare" }
  )
);
