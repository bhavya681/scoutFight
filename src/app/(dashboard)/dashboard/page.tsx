import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Eye, MessageSquare, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEMO_BOOKINGS } from "@/lib/data/dashboard-demo";
import { getAllTalent } from "@/lib/data/talent-repository";

export const metadata: Metadata = { title: "Recruiter Dashboard" };

export const revalidate = 3600;

export default async function DashboardPage() {
  const talent = await getAllTalent();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Recruiter overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {talent.length} athletes · MVP seed from TheSportsDB, Wikidata, Wikipedia · YouTube videos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Athletes indexed", value: String(talent.length), icon: Search },
          { label: "Open inquiries", value: "1", icon: Calendar },
          { label: "Messages", value: "—", icon: MessageSquare },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-brand" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent inquiries</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/discover">Scout talent</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {DEMO_BOOKINGS.map((b) => (
            <div key={b.id} className="py-3 border-b border-border last:border-0">
              <p className="font-medium text-sm">{b.eventName}</p>
              <p className="text-xs text-muted-foreground">{b.talentName} · {b.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
