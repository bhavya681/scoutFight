import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { DEMO_BOOKINGS } from "@/lib/data/dashboard-demo";

export const metadata: Metadata = { title: "Negotiations" };

export default function NegotiationsPage() {
  const active = DEMO_BOOKINGS.filter((b) => b.status === "negotiating" || b.status === "sent");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Negotiations</h1>
      <div className="space-y-4">
        {active.map((b) => (
          <Card key={b.id} className="p-6">
            <h3 className="font-semibold">{b.eventName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{b.talentName}</p>
            <p className="text-sm mt-3 text-muted-foreground">{b.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
