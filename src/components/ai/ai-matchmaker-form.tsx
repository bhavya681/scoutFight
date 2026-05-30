"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SPORTS, GENDER_FILTER_OPTIONS, getWeightClassOptions } from "@/lib/constants";
import { MATCHMAKER_COUNTRY_OPTIONS } from "@/lib/utils/region-match";

interface MatchmakerPick {
  slug: string;
  displayName: string;
  sport: string;
  weightClass?: string;
  nationality: string;
  record?: string;
  score: number;
  reasons: string[];
  profileUrl: string;
}

interface MatchmakerResponse {
  recommendations?: string;
  matches?: MatchmakerPick[];
  poolSize?: number;
  source?: string;
  error?: string;
}

export function AiMatchmakerForm({ onNavigateAway }: { onNavigateAway?: () => void }) {
  const [sport, setSport] = useState("mma");
  const [weightClass, setWeightClass] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [brief, setBrief] = useState("");
  const [result, setResult] = useState("");
  const [matches, setMatches] = useState<MatchmakerPick[]>([]);
  const [poolSize, setPoolSize] = useState<number | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const weightOptions = getWeightClassOptions(sport || undefined);

  async function match() {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setResult("");
    setMatches([]);
    setPoolSize(null);
    setSource(null);
    try {
      const res = await fetch("/api/ai-matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sport: sport || undefined,
          weightClass: weightClass || undefined,
          country: country || undefined,
          gender: gender === "male" || gender === "female" ? gender : undefined,
          brief,
        }),
      });
      const data = (await res.json()) as MatchmakerResponse;
      if (!res.ok) {
        setResult(data.error ?? "Matchmaker request failed.");
        return;
      }
      setResult(data.recommendations ?? "No recommendations.");
      setMatches(data.matches ?? []);
      setPoolSize(data.poolSize ?? null);
      setSource(data.source ?? null);
    } catch {
      setResult("Could not reach the matchmaker. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Rank athletes for your card by sport, weight, country, gender, and brief. Optional
        OpenAI adds narrative analysis.
      </p>
      <div>
        <Label className="text-xs">Sport / Discipline</Label>
        <Select value={sport} onValueChange={(v) => { setSport(v); setWeightClass(""); }}>
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            {SPORTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Weight Class / Role</Label>
        <Select
          value={weightClass || "any"}
          onValueChange={(v) => setWeightClass(v === "any" ? "" : v)}
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Weight class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any class</SelectItem>
            {weightOptions.map((wc) => (
              <SelectItem key={wc} value={wc}>
                {wc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Country / Region</Label>
        <Select value={country || "any"} onValueChange={(v) => setCountry(v === "any" ? "" : v)}>
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any country</SelectItem>
            {MATCHMAKER_COUNTRY_OPTIONS.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Gender</Label>
        <Select value={gender || "any"} onValueChange={(v) => setGender(v === "any" ? "" : v)}>
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any gender</SelectItem>
            {GENDER_FILTER_OPTIONS.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">Event / Recruitment Brief</Label>
        <Textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="e.g. Main card lightweight, US market draw, open to bookings…"
          rows={4}
          className="mt-1 text-sm"
        />
      </div>
      <Button className="w-full gap-2" onClick={match} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Find matches
      </Button>

      {matches.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {poolSize != null && (
              <span>
                {poolSize} in pool · top {matches.length}
              </span>
            )}
            {source && (
              <Badge variant="secondary" className="text-[10px] uppercase font-normal">
                {source === "openai" ? "AI + live data" : "Live rankings"}
              </Badge>
            )}
          </div>
          {matches.map((m, i) => (
            <Link
              key={m.slug}
              href={m.profileUrl}
              className="block rounded-xl border border-border bg-card p-3 hover:border-brand/40 transition-colors"
              onClick={onNavigateAway}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-sm">
                    <span className="text-brand mr-1.5">#{i + 1}</span>
                    {m.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                    {m.sport.replace(/_/g, " ")}
                    {m.weightClass ? ` · ${m.weightClass}` : ""} · {m.nationality}
                    {m.record ? ` · ${m.record}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {m.reasons.join(" · ")}
                  </p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {result && (
        <div className="rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border/50">
          {result}
        </div>
      )}
    </div>
  );
}
