import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Content Moderation" };

const FLAGGED = [
  { id: "1", type: "media", title: "Unauthorized highlight reel", reporter: "User #4421" },
  { id: "2", type: "profile", title: "Misleading fight record", reporter: "User #1189" },
];

export default function ModerationPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Content Moderation</h1>
      <div className="space-y-4">
        {FLAGGED.map((f) => (
          <Card key={f.id} className="p-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {f.type}
                </Badge>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">Reported by {f.reporter}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="secondary">
                  Dismiss
                </Button>
                <Button size="sm">Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
