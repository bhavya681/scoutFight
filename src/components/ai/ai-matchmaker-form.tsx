"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
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
import { SPORTS, GENDER_FILTER_OPTIONS, getWeightClassOptions } from "@/lib/constants";
import { MATCHMAKER_COUNTRY_OPTIONS } from "@/lib/utils/region-match";
import {
  TalentResearchResults,
  type TalentResearchPick,
} from "@/components/ai/talent-research-results";

const SELECT_CONTENT_PROPS = {
  position: "popper" as const,
  className: "z-[100] max-h-[min(16rem,50vh)]",
  sideOffset: 4,
};

interface MatchmakerResponse {
  recommendations?: string;
  analysis?: string;
  matches?: TalentResearchPick[];
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
  const [emptyMessage, setEmptyMessage] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [matches, setMatches] = useState<TalentResearchPick[]>([]);
  const [poolSize, setPoolSize] = useState<number | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const weightOptions = getWeightClassOptions(sport || undefined);

  async function match() {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setEmptyMessage("");
    setAnalysis("");
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
        setEmptyMessage(data.error ?? "Matchmaker request failed.");
        return;
      }
      setMatches(data.matches ?? []);
      setPoolSize(data.poolSize ?? null);
      setSource(data.source ?? null);
      setAnalysis(data.analysis?.trim() ?? "");
      if ((data.matches?.length ?? 0) === 0) {
        setEmptyMessage(data.recommendations ?? "No matches found for these filters.");
      }
    } catch {
      setEmptyMessage("Could not reach the matchmaker. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Rank athletes for your card by sport, weight, country, gender, and brief. Results link
        straight to athlete profiles.
      </p>
      <div>
        <Label className="text-xs">Sport / Discipline</Label>
        <Select
          value={sport}
          onValueChange={(v) => {
            setSport(v);
            setWeightClass("");
          }}
          disabled={loading}
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent {...SELECT_CONTENT_PROPS}>
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
          disabled={loading}
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Weight class" />
          </SelectTrigger>
          <SelectContent {...SELECT_CONTENT_PROPS}>
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
        <Select
          value={country || "any"}
          onValueChange={(v) => setCountry(v === "any" ? "" : v)}
          disabled={loading}
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent {...SELECT_CONTENT_PROPS}>
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
        <Select
          value={gender || "any"}
          onValueChange={(v) => setGender(v === "any" ? "" : v)}
          disabled={loading}
        >
          <SelectTrigger className="mt-1 h-9">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent {...SELECT_CONTENT_PROPS}>
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
          disabled={loading}
        />
      </div>
      <Button className="w-full gap-2" onClick={match} disabled={loading || !brief.trim()}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Find matches
      </Button>

      {matches.length > 0 && (
        <TalentResearchResults
          matches={matches}
          poolSize={poolSize}
          source={source}
          onNavigateAway={onNavigateAway}
        />
      )}

      {analysis && matches.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            AI analysis
          </p>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {analysis}
          </p>
        </div>
      )}

      {emptyMessage && (
        <div className="rounded-xl bg-muted/30 p-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border/50">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
