"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AiScoutChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Ask in plain language — sport, gender, region, weight. Example: \"Indian female MMA fighters\" or \"welterweight wrestlers open to bookings\". Uses live roster search (no paid API required).",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? data.error ?? "Unable to respond." },
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
      <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 text-sm ${
              msg.role === "user"
                ? "ml-6 bg-pwr-red/15 text-foreground border border-pwr-red/20"
                : "mr-2 bg-muted/50 text-muted-foreground border border-border/50"
            }`}
          >
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin" /> Researching roster…
          </div>
        )}
      </div>
      <div className="pt-3 flex gap-2 border-t border-border/60 mt-3">
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
        />
        <Button size="icon" onClick={send} disabled={loading} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
