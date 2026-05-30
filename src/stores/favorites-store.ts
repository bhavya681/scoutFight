import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  athleteIds: string[];
  promotionIds: string[];
  toggleAthlete: (id: string) => void;
  togglePromotion: (id: string) => void;
  isAthleteFavorite: (id: string) => boolean;
  isPromotionFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      athleteIds: [],
      promotionIds: [],
      toggleAthlete: (id) =>
        set((s) => ({
          athleteIds: s.athleteIds.includes(id)
            ? s.athleteIds.filter((x) => x !== id)
            : [...s.athleteIds, id],
        })),
      togglePromotion: (id) =>
        set((s) => ({
          promotionIds: s.promotionIds.includes(id)
            ? s.promotionIds.filter((x) => x !== id)
            : [...s.promotionIds, id],
        })),
      isAthleteFavorite: (id) => get().athleteIds.includes(id),
      isPromotionFavorite: (id) => get().promotionIds.includes(id),
    }),
    { name: "pwr-scout-favorites" }
  )
);
