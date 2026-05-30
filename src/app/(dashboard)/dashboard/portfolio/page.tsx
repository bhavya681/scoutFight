"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TALENT_FEATURES } from "@/lib/constants";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career portfolio</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Showcase abilities to recruiters worldwide — highlight reels, resume, and career story.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Marcus Steel — Headline</h2>
        <p className="text-sm text-muted-foreground">
          Independent heavyweight main-event talent · Chicago · Seeking major promotion contract
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-1">Resume sections</p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>In-ring experience (12 years)</li>
              <li>Championships & titles</li>
              <li>Promo & media skills</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">Highlight reels</p>
            <p className="text-muted-foreground">Linked from YouTube on your media tab.</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/media">Manage highlight reels</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/profile">Edit profile & resume</Link>
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-sm mb-3">Talent toolkit</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
          {TALENT_FEATURES.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
