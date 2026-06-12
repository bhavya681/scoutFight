"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function toCombatpediaSlug(input: string): string {
  const trimmed = input.trim();
  const wikiMatch = trimmed.match(/wikipedia\.org\/wiki\/([^?#]+)/i);
  if (wikiMatch) {
    return decodeURIComponent(wikiMatch[1]).replace(/_/g, "-").toLowerCase();
  }
  return trimmed
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CombatpediaSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sport = searchParams.get("sport");
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;

    const slug = toCombatpediaSlug(term);
    if (slug) {
      router.push(`/combatpedia/${encodeURIComponent(slug)}`);
      return;
    }

    const params = new URLSearchParams();
    if (sport) params.set("sport", sport);
    params.set("q", term);
    router.push(`/combatpedia?${params}`);
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Fighter name or Wikipedia URL (e.g. alexandre-pantoja)"
          className="pl-10 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
          aria-label="Search Combatpedia"
        />
      </div>
      <Button type="submit" className="h-11 bg-[#7b1113] hover:bg-[#5e0d0f] text-white">
        Open article
      </Button>
    </form>
  );
}
