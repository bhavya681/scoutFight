"use client";

import { useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type DirectoryFilterControls = {
  params: URLSearchParams;
  queryString: string;
  update: (
    key: string,
    value: string,
    extraDelete?: string[],
    immediate?: boolean
  ) => void;
  toggle: (key: string, activeValue: string) => void;
  reset: () => void;
};

export function useDirectoryFilters(basePath: string): DirectoryFilterControls {
  const router = useRouter();
  const params = useSearchParams();
  const queryString = params.toString();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const push = useCallback(
    (next: URLSearchParams, immediate = true) => {
      const run = () => {
        next.delete("page");
        const qs = next.toString();
        const url = qs ? `${basePath}?${qs}` : basePath;
        router.replace(url, { scroll: false });
      };

      if (!immediate) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(run, 280);
        return;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      run();
    },
    [basePath, router]
  );

  const update = useCallback(
    (key: string, value: string, extraDelete?: string[], immediate = true) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      for (const k of extraDelete ?? []) next.delete(k);
      push(next, immediate);
    },
    [params, push]
  );

  const toggle = useCallback(
    (key: string, activeValue: string) => {
      const active = params.get(key) === activeValue;
      update(key, active ? "" : activeValue);
    },
    [params, update]
  );

  const reset = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.replace(basePath, { scroll: false });
  }, [basePath, router]);

  return { params, queryString, update, toggle, reset };
}
