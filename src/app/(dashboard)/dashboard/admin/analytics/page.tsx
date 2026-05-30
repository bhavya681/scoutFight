import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Admin Analytics" };

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold uppercase">Platform Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: "12,847" },
          { label: "Active Subscriptions", value: "1,204" },
          { label: "Bookings (30d)", value: "342" },
          { label: "MRR", value: "$48.2K" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
