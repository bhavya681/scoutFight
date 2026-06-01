"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  TalentResearchResults,
  type TalentResearchPick,
} from "@/components/ai/talent-research-results";

type ScoutMessage = {
  role: "user" | "assistant";
  content: string;
  matches?: TalentResearchPick[];
  poolSize?: number;
  source?: string;
  discoverUrl?: string;
};

interface ScoutResponse {
  reply?: string;
  matches?: TalentResearchPick[];
  poolSize?: number;
  source?: string;
  discoverUrl?: string;
  error?: string;
}

export function AiScoutChat({ onNavigateAway }: { onNavigateAway?: () => void }) {
  const [messages, setMessages] = useState<ScoutMessage[]>([
    {
      role: "assistant",
      content:
        "Ask in plain language — sport, gender, region, weight. Example: \"Indian female MMA fighters\" or \"welterweight wrestlers open to bookings\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const history = messages.filter((m) => m.role === "user" || m.role === "assistant");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history }),
      });
      const data = (await res.json()) as ScoutResponse;
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: data.error ?? "Unable to respond." },
        ]);
        return;
      }
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply ?? "No response.",
          matches: data.matches,
          poolSize: data.poolSize,
          source: data.source,
          discoverUrl: data.discoverUrl,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Scout search failed. Try again, or use Discover filters for sport, gender, and region.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-y-auto space-y-4 min-h-[200px] scroll-touch">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "ml-4 rounded-xl border border-pwr-red/20 bg-pwr-red/10 p-3 text-sm"
                : "space-y-3"
            }
          >
            {msg.role === "user" ? (
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            ) : (
              <>
                <div className="rounded-xl border border-border/50 bg-muted/40 p-3 text-sm text-muted-foreground">
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {msg.matches && msg.matches.length > 0 && (
                  <TalentResearchResults
                    matches={msg.matches}
                    poolSize={msg.poolSize}
                    source={msg.source}
                    onNavigateAway={onNavigateAway}
                  />
                )}
                {msg.discoverUrl && (
                  <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                    <Link href={msg.discoverUrl} onClick={onNavigateAway}>
                      Browse more in Discover
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm px-1">
            <Loader2 className="h-4 w-4 animate-spin" /> Researching roster…
          </div>
        )}
      </div>
      <div className="pt-3 flex gap-2 border-t border-border/60 mt-3 shrink-0">
        <Textarea
          placeholder="e.g. Indian female MMA fighters, AEW heels…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          className="resize-none text-sm"
          disabled={loading}
        />
        <Button size="icon" onClick={send} disabled={loading || !input.trim()} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
