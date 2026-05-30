import type { TalentProfile } from "@/types";

/** Country/region keys → terms matched against nationality, location, bio */
export const REGION_ALIASES: Record<string, string[]> = {
  india: ["india", "indian"],
  usa: ["american", "usa", "u.s.", "united states"],
  uk: ["british", "english", "scottish", "welsh", "united kingdom", "northern ireland"],
  canada: ["canadian", "canada"],
  brazil: ["brazilian", "brazil"],
  mexico: ["mexican", "mexico"],
  japan: ["japanese", "japan"],
  australia: ["australian", "australia"],
  ireland: ["irish", "ireland"],
  nigeria: ["nigerian", "nigeria"],
  china: ["chinese", "china"],
  korea: ["korean", "south korea", "korea"],
  thailand: ["thai", "thailand"],
  turkey: ["turkish", "turkey"],
  brunei: ["brunei", "brunei darussalam"],
  jordan: ["jordan", "jordanian"],
  poland: ["polish", "poland"],
  germany: ["german", "germany"],
  france: ["french", "france"],
  spain: ["spanish", "spain"],
  italy: ["italian", "italy"],
  russia: ["russian", "russia"],
  ukraine: ["ukrainian", "ukraine"],
  philippines: ["filipino", "philippines"],
  indonesia: ["indonesian", "indonesia"],
};

const COUNTRY_LABELS: Record<string, string> = {
  india: "India",
  usa: "United States",
  uk: "United Kingdom",
  canada: "Canada",
  brazil: "Brazil",
  mexico: "Mexico",
  japan: "Japan",
  australia: "Australia",
  ireland: "Ireland",
  nigeria: "Nigeria",
  china: "China",
  korea: "South Korea",
  thailand: "Thailand",
  turkey: "Turkey",
  brunei: "Brunei",
  jordan: "Jordan",
  poland: "Poland",
  germany: "Germany",
  france: "France",
  spain: "Spain",
  italy: "Italy",
  russia: "Russia",
  ukraine: "Ukraine",
  philippines: "Philippines",
  indonesia: "Indonesia",
};

export const MATCHMAKER_COUNTRY_OPTIONS = Object.keys(REGION_ALIASES)
  .map((id) => ({
    id,
    label: COUNTRY_LABELS[id] ?? id.replace(/_/g, " "),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function getRegionTerms(countryId: string): string[] {
  return REGION_ALIASES[countryId] ?? [];
}

export function getCountryLabel(countryId?: string): string | undefined {
  if (!countryId) return undefined;
  return COUNTRY_LABELS[countryId] ?? countryId;
}

export function talentMatchesRegionTerms(
  t: Pick<TalentProfile, "nationality" | "location" | "bio">,
  terms: string[]
): boolean {
  if (terms.length === 0) return true;
  const hay = `${t.nationality} ${t.location} ${t.bio}`.toLowerCase();
  return terms.some((term) => hay.includes(term.trim().toLowerCase()));
}

export function talentMatchesCountry(
  t: Pick<TalentProfile, "nationality" | "location" | "bio">,
  countryId?: string
): boolean {
  if (!countryId) return true;
  return talentMatchesRegionTerms(t, getRegionTerms(countryId));
}
