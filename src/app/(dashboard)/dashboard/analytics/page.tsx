import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Visibility Analytics" };

const chartData = [
  { day: "Mon", views: 120 },
  { day: "Tue", views: 180 },
  { day: "Wed", views: 240 },
  { day: "Thu", views: 190 },
  { day: "Fri", views: 320 },
  { day: "Sat", views: 410 },
  { day: "Sun", views: 280 },
];

export default function AnalyticsPage() {
  const max = Math.max(...chartData.map((d) => d.views));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold uppercase">Recruiter visibility</h1>
      <p className="text-sm text-muted-foreground -mt-6 mb-2">
        See how recruiters discover and evaluate your profile.
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="font-display uppercase text-lg">
            Profile Views (7 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {chartData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-pwr-red/80 rounded-t-md transition-all min-h-[4px]"
                  style={{ height: `${(d.views / max) * 100}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Views", value: "12,402" },
          { label: "Booking Clicks", value: "186" },
          { label: "Recruiter saves", value: "94" },
          { label: "Applications sent", value: "3" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
