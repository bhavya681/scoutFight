"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface BookingFormProps {
  defaultAthleteSlug?: string;
  defaultAthleteName?: string;
}

export function BookingForm({
  defaultAthleteSlug,
  defaultAthleteName,
}: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          athleteSlug: form.get("athleteSlug") || defaultAthleteSlug,
          eventName: form.get("eventName"),
          eventDate: form.get("eventDate"),
          venue: form.get("venue"),
          location: form.get("location"),
          purseOffer: Number(form.get("purseOffer")) * 100,
          message: form.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      router.push("/dashboard/bookings?submitted=1");
    } catch {
      setError("Could not submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        {defaultAthleteName && (
          <div className="rounded-lg bg-pwr-red/10 border border-pwr-red/20 p-3 text-sm">
            Athlete: <strong>{defaultAthleteName}</strong>
            <input type="hidden" name="athleteSlug" value={defaultAthleteSlug} />
          </div>
        )}
        {!defaultAthleteSlug && (
          <div>
            <Label htmlFor="athleteSlug">Athlete Slug</Label>
            <Input id="athleteSlug" name="athleteSlug" placeholder="marcus-steel" required />
          </div>
        )}
        <div>
          <Label htmlFor="eventName">Event Name</Label>
          <Input id="eventName" name="eventName" required placeholder="Apex Fight League 48" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventDate">Event Date</Label>
            <Input id="eventDate" name="eventDate" type="date" required />
          </div>
          <div>
            <Label htmlFor="purseOffer">Purse Offer ($)</Label>
            <Input id="purseOffer" name="purseOffer" type="number" min={0} placeholder="25000" />
          </div>
        </div>
        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" placeholder="State Farm Arena" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" placeholder="Atlanta, GA" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Main card bout details, travel, accommodations..."
          />
        </div>
        {error && <p className="text-sm text-pwr-red">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Booking Request"}
        </Button>
      </form>
    </Card>
  );
}
