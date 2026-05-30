"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";

const CONVERSATIONS = [
  {
    id: "1",
    name: "Apex Fight League",
    preview: "We'd like to discuss the main card slot...",
    avatar: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=80&h=80&fit=crop",
    unread: true,
  },
  {
    id: "2",
    name: "Global Boxing Series",
    preview: "Contract draft attached for review.",
    avatar: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=80&h=80&fit=crop",
    unread: false,
  },
];

const MESSAGES = [
  { id: "1", sender: "them", content: "Interested in booking you for Apex FL 47.", time: "10:30 AM" },
  { id: "2", sender: "me", content: "Thanks — send over the purse details and date.", time: "10:45 AM" },
  { id: "3", sender: "them", content: "Main card welterweight, $25k show. Aug 15 Atlanta.", time: "11:00 AM" },
];

export function MessagingPanel() {
  const [active, setActive] = useState("1");
  const [input, setInput] = useState("");

  return (
    <Card className="flex flex-1 min-h-[400px] overflow-hidden">
      <div className="w-full sm:w-72 border-r border-white/10 flex flex-col">
        {CONVERSATIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={`flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors ${
              active === c.id ? "bg-white/10" : ""
            }`}
          >
            <UserAvatar name={c.name} src={c.avatar} size="xs" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">{c.preview}</p>
            </div>
            {c.unread && (
              <span className="h-2 w-2 rounded-full bg-pwr-red shrink-0" />
            )}
          </button>
        ))}
      </div>
      <div className="hidden sm:flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {MESSAGES.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                m.sender === "me"
                  ? "ml-auto bg-pwr-red/20"
                  : "bg-white/5 text-muted-foreground"
              }`}
            >
              {m.content}
              <p className="text-[10px] text-muted-foreground mt-1">{m.time}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
