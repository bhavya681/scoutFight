import { create } from "zustand";

export type TalentAiTab = "matchmaker" | "scout";

interface UIState {
  mobileMenuOpen: boolean;
  talentAiOpen: boolean;
  talentAiTab: TalentAiTab;
  setMobileMenuOpen: (open: boolean) => void;
  setTalentAiOpen: (open: boolean) => void;
  setTalentAiTab: (tab: TalentAiTab) => void;
  toggleMobileMenu: () => void;
  toggleTalentAi: () => void;
  openTalentAi: (tab?: TalentAiTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  talentAiOpen: false,
  talentAiTab: "matchmaker",
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setTalentAiOpen: (open) => set({ talentAiOpen: open }),
  setTalentAiTab: (tab) => set({ talentAiTab: tab }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  toggleTalentAi: () => set((s) => ({ talentAiOpen: !s.talentAiOpen })),
  openTalentAi: (tab = "matchmaker") =>
    set((s) => ({
      talentAiOpen: true,
      talentAiTab: tab,
      mobileMenuOpen: false,
    })),
}));
