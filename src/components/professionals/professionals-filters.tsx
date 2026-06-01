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
import { TALENT_CATEGORIES, SPORTS } from "@/lib/constants";
import { DirectoryFilterPanel } from "@/components/directory/directory-filter-panel";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  referee: "Referees",
  announcer: "Announcers",
  commentator: "Commentators",
  manager: "Managers",
  agent: "Agents",
  coach: "Coaches",
};

export function ProfessionalsFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const activeRole = params.get("role") ?? "";
  const activeSport = params.get("sport") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `/professionals?${qs}` : "/professionals");
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  return (
    <DirectoryFilterPanel id="professionals-grid">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, or country..."
          className="pl-10 h-11 bg-input border-border rounded-xl text-sm"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {TALENT_CATEGORIES.professionals.map((r) => {
          const active = activeRole === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => update("role", active ? "" : r.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-pwr-red text-white shadow-md shadow-pwr-red/20"
                  : "bg-muted text-foreground/85 hover:bg-surface-hover border border-border"
              )}
            >
              {ROLE_LABEL[r.id] ?? r.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {count.toLocaleString()}
          </span>{" "}
          professionals found
        </p>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Select
            value={activeSport || "all"}
            onValueChange={(v) => update("sport", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-10 w-[140px] bg-input border-border text-sm">
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
            value={params.get("sort") ?? "relevance"}
            onValueChange={(v) => update("sort", v === "relevance" ? "" : v)}
          >
            <SelectTrigger className="h-10 w-[160px] bg-input border-border text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </DirectoryFilterPanel>
  );
}
