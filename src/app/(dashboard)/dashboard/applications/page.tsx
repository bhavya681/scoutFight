"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useApplicationsStore } from "@/stores/applications-store";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  reviewing: "Under review",
  interview: "Interview",
  offered: "Offer received",
  rejected: "Not selected",
  withdrawn: "Withdrawn",
};

export default function ApplicationsPage() {
  const applications = useApplicationsStore((s) => s.applications);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Opportunity applications</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Track roles you&apos;ve applied to on the global marketplace.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-muted-foreground text-sm mb-4">No applications yet.</p>
          <Button asChild>
            <Link href="/marketplace">Browse opportunities</Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold">{app.opportunityTitle}</h3>
                  <p className="text-sm text-muted-foreground">{app.organizationName}</p>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {app.coverMessage}
                  </p>
                </div>
                <Badge variant="secondary">{STATUS_LABELS[app.status] ?? app.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Applied {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
