"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, GENDER_FILTER_OPTIONS, getWeightClassOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string, extraDelete?: string[]) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    for (const k of extraDelete ?? []) next.delete(k);
    router.push(`/discover?${next.toString()}`);
  }

  const sport = params.get("sport") ?? "";
  const weightClass = params.get("weightClass") ?? "";
  const weightOptions = getWeightClassOptions(sport || undefined);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search athletes, gyms, tags..."
          className="pl-10"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              update("q", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Select
          value={sport || "all"}
          onValueChange={(v) =>
            update("sport", v === "all" ? "" : v, ["weightClass"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {SPORTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={weightClass || "all"}
          onValueChange={(v) => update("weightClass", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Weight Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {weightOptions.map((wc) => (
              <SelectItem key={wc} value={wc}>
                {wc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={params.get("gender") ?? "all"}
          onValueChange={(v) => update("gender", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genders</SelectItem>
            {GENDER_FILTER_OPTIONS.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={params.get("verification") ?? "all"}
          onValueChange={(v) => update("verification", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Status</SelectItem>
            <SelectItem value="verified">Verified Only</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          onClick={() => update("availableOnly", params.get("availableOnly") ? "" : "true")}
          className={params.get("availableOnly") ? "ring-2 ring-pwr-red" : ""}
        >
          Available for Booking
        </Button>
      </div>
      {(sport ||
        weightClass ||
        params.get("gender") ||
        params.get("q") ||
        params.get("verification") ||
        params.get("availableOnly")) && (
        <Button variant="link" className="px-0 h-auto text-sm" onClick={() => router.push("/discover")}>
          Clear all filters
        </Button>
      )}
    </div>
  );
}
