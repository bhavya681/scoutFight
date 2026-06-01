import type { DiscoverSearchParams } from "@/lib/data/discover-query";

const FILTER_KEYS: (keyof DiscoverSearchParams)[] = [
  "q",
  "sport",
  "weightClass",
  "gender",
  "verification",
  "availableOnly",
  "region",
  "minScore",
  "sort",
  "view",
  "page",
];

/** Stable cache key so Discover results re-fetch when any filter changes. */
export function discoverFilterKey(params: DiscoverSearchParams): string {
  return FILTER_KEYS.map((k) => `${k}=${params[k] ?? ""}`).join("&");
}

/** Canonical query string for URL sync and fetch comparison. */
export function discoverParamsToQueryString(
  params: DiscoverSearchParams
): string {
  const sp = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = params[key];
    if (value != null && value !== "") sp.set(key, String(value));
  }
  return sp.toString();
}
