import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_BOOKINGS } from "@/lib/data/dashboard-demo";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Inquiries" };

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Recruitment inquiries</h1>
        <Button variant="outline" size="sm" asChild>
          <Link href="/discover">Find athletes</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {DEMO_BOOKINGS.map((b) => (
          <Card key={b.id} className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold">{b.eventName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {b.recruiterName} → {b.talentName}
                </p>
                <p className="text-sm mt-2 text-muted-foreground">{b.message}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-medium uppercase px-2 py-1 rounded bg-brand-muted text-brand">
                  {b.status}
                </span>
                {b.purseOffer > 0 && (
                  <p className="font-semibold mt-2">{formatCurrency(b.purseOffer * 100)}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
