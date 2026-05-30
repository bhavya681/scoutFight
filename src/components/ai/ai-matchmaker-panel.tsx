"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Loader2, ExternalLink } from "lucide-react";
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
import { useUIStore } from "@/stores/ui-store";
import { SPORTS, getWeightClassOptions } from "@/lib/constants";

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

export function AiMatchmakerPanel() {
  const { aiMatchmakerOpen, setAiMatchmakerOpen } = useUIStore();
  const [sport, setSport] = useState("mma");
  const [weightClass, setWeightClass] = useState("");
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
    <AnimatePresence>
      {aiMatchmakerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setAiMatchmakerOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md flex flex-col border-l border-white/10 bg-background/98 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-pwr-gold" />
                <h2 className="font-display font-bold uppercase tracking-wide text-sm">
                  AI Matchmaker
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAiMatchmakerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                Matches athletes from the live roster by sport, weight class, and your event
                brief. OpenAI adds narrative analysis when configured.
              </p>
              <div>
                <Label>Sport / Discipline</Label>
                <Select value={sport} onValueChange={(v) => { setSport(v); setWeightClass(""); }}>
                  <SelectTrigger className="mt-1">
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
                <Label>Weight Class / Role</Label>
                <Select
                  value={weightClass || "any"}
                  onValueChange={(v) => setWeightClass(v === "any" ? "" : v)}
                >
                  <SelectTrigger className="mt-1">
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
                <Label>Event / Recruitment Brief</Label>
                <Textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="e.g. Main card slot, need active lightweight with US market draw, open to bookings…"
                  rows={4}
                  className="mt-1"
                />
              </div>
              <Button className="w-full gap-2" onClick={match} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Find Matches
              </Button>

              {matches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {poolSize != null && (
                      <span>{poolSize} in pool · top {matches.length} picks</span>
                    )}
                    {source && (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {source === "openai" ? "AI + live data" : "Live rankings"}
                      </Badge>
                    )}
                  </div>
                  {matches.map((m, i) => (
                    <Link
                      key={m.slug}
                      href={m.profileUrl}
                      className="block rounded-xl border border-border bg-card p-3 hover:border-brand/40 transition-colors"
                      onClick={() => setAiMatchmakerOpen(false)}
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
                <div className="rounded-xl bg-white/5 p-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed border border-border/50">
                  {result}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
