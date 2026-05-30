import { create } from "zustand";

interface UIState {
  mobileMenuOpen: boolean;
  aiScoutOpen: boolean;
  aiMatchmakerOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setAiScoutOpen: (open: boolean) => void;
  setAiMatchmakerOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  toggleAiScout: () => void;
  toggleAiMatchmaker: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  aiScoutOpen: false,
  aiMatchmakerOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setAiScoutOpen: (open) => set({ aiScoutOpen: open }),
  setAiMatchmakerOpen: (open) => set({ aiMatchmakerOpen: open }),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  toggleAiScout: () => set((s) => ({ aiScoutOpen: !s.aiScoutOpen })),
  toggleAiMatchmaker: () => set((s) => ({ aiMatchmakerOpen: !s.aiMatchmakerOpen })),
}));
