"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { MarketplaceListing } from "@/types";
import { useApplicationsStore } from "@/stores/applications-store";

interface OpportunityApplyFormProps {
  opportunity: MarketplaceListing;
  defaultTalentSlug?: string;
  defaultTalentName?: string;
}

export function OpportunityApplyForm({
  opportunity,
  defaultTalentSlug = "",
  defaultTalentName = "",
}: OpportunityApplyFormProps) {
  const addApplication = useApplicationsStore((s) => s.addApplication);
  const [talentSlug, setTalentSlug] = useState(defaultTalentSlug);
  const [talentName, setTalentName] = useState(defaultTalentName);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!talentSlug.trim() || !talentName.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/opportunities/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunitySlug: opportunity.slug,
          talentSlug: talentSlug.trim(),
          talentName: talentName.trim(),
          applicantEmail: email || undefined,
          coverMessage: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.application) {
        addApplication(data.application);
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground">
        Application submitted. Track status in your{" "}
        <a href="/dashboard/applications" className="text-pwr-red hover:underline">
          applications dashboard
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Your profile slug</Label>
        <Input
          placeholder="e.g. marcus-steel"
          value={talentSlug}
          onChange={(e) => setTalentSlug(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Display name</Label>
        <Input
          value={talentName}
          onChange={(e) => setTalentName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          placeholder="contact@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <Label>Cover message</Label>
        <Textarea
          rows={4}
          placeholder="Why you're a fit for this opportunity..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Submitting…" : "Apply to opportunity"}
      </Button>
    </form>
  );
}
