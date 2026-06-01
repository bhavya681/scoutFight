"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TALENT_CATEGORIES, SPORTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<string, string> = {
  referee: "Referees",
  announcer: "Announcers",
  commentator: "Commentators",
  manager: "Managers",
  agent: "Agents",
  coach: "Coaches",
};

export function ProfessionalsSidebarFilters({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const basePath = "/professionals";
  const activeRole = params.get("role") ?? "";
  const activeSport = params.get("sport") ?? "";

  function push(next: URLSearchParams) {
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    push(next);
  }

  function reset() {
    router.push(basePath);
  }

  return (
    <aside
      id="professionals-grid"
      className="rounded-xl border border-border bg-card p-4 space-y-5 h-fit lg:sticky lg:top-24"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Name, role, country..."
          className="pl-10 h-10 bg-input border-border text-sm"
          defaultValue={params.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-pwr-red" />
          Filters
        </span>
        <button type="button" onClick={reset} className="text-xs font-medium text-pwr-red hover:underline">
          Reset
        </button>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        <span className="font-semibold text-foreground tabular-nums">{count.toLocaleString()}</span>{" "}
        professionals
      </p>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Role
        </p>
        <div className="flex flex-wrap gap-2">
          {TALENT_CATEGORIES.professionals.map((r) => {
            const active = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => update("role", active ? "" : r.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-pwr-red text-white"
                    : "bg-muted text-foreground/85 hover:bg-surface-hover"
                )}
              >
                {ROLE_LABEL[r.id] ?? r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Sport focus
        </p>
        <Select
          value={activeSport || "all"}
          onValueChange={(v) => update("sport", v === "all" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue placeholder="All sports" />
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
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Sort by
        </p>
        <Select
          value={params.get("sort") ?? "relevance"}
          onValueChange={(v) => update("sort", v === "relevance" ? "" : v)}
        >
          <SelectTrigger className="h-9 bg-input border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </aside>
  );
}
