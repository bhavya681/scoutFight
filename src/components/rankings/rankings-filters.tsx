"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORTS, getWeightClassOptions } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function RankingsFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string, extraDelete?: string[]) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    for (const k of extraDelete ?? []) next.delete(k);
    const qs = next.toString();
    router.push(qs ? `/rankings?${qs}` : "/rankings");
  }

  const sport = params.get("sport") ?? "";
  const weightClass = params.get("weightClass") ?? "";
  const weightOptions = getWeightClassOptions(sport || undefined);
  const hasFilters = Boolean(sport || weightClass);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <Select
        value={sport || "all"}
        onValueChange={(v) =>
          update("sport", v === "all" ? "" : v, ["weightClass"])
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sports</SelectItem>
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
        disabled={!sport}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Weight class" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All classes</SelectItem>
          {weightOptions.map((wc) => (
            <SelectItem key={wc} value={wc}>
              {wc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push("/rankings")}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
