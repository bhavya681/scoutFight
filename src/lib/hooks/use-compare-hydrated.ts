"use client";

import { useEffect, useState } from "react";
import { useCompareStore } from "@/stores/compare-store";

/** Wait for zustand persist rehydration before reading compare items */
export function useCompareHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCompareStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useCompareStore.persist.hasHydrated());
    return unsub;
  }, []);

  const items = useCompareStore((s) => s.items);
  return { hydrated, items };
}
