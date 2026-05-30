"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CANDIDATE_PIPELINE_STAGES,
  RECRUITMENT_FEATURES,
} from "@/lib/constants";
import { useRecruitmentCrmStore } from "@/stores/recruitment-crm-store";

export default function CrmPage() {
  const { candidates, notes, offers, interviews } = useRecruitmentCrmStore();

  const stageCounts = CANDIDATE_PIPELINE_STAGES.map((s) => ({
    ...s,
    count: candidates.filter((c) => c.stage === s.id).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase">Candidate tracking</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Shortlists, notes, interviews, and offers — reduce hiring friction for your roster.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stageCounts.slice(0, 4).map((p) => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{p.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{p.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">Active candidates</h2>
        {candidates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add talent from search or shortlists.</p>
        ) : (
          <ul className="space-y-3">
            {candidates.map((c) => (
              <li key={c.talentId} className="flex justify-between items-center text-sm">
                <Link href={`/athletes/${c.talentSlug}`} className="font-medium hover:text-pwr-red">
                  {c.talentName}
                </Link>
                <Badge variant="outline" className="capitalize">{c.stage}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {notes.length > 0 && (
        <Card className="p-6">
          <h2 className="font-semibold mb-3">Recruiter notes</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {notes.slice(0, 5).map((n) => (
              <li key={n.id}>
                <span className="text-foreground font-medium">{n.talentName}:</span> {n.body}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h2 className="font-semibold text-sm mb-2">Offers ({offers.length})</h2>
          <p className="text-xs text-muted-foreground">
            <Link href="/dashboard/offers" className="text-pwr-red hover:underline">
              Manage offers →
            </Link>
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold text-sm mb-2">Interviews ({interviews.length})</h2>
          <p className="text-xs text-muted-foreground">Schedule from messaging or candidate cards.</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-sm mb-3">Recruitment toolkit</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-muted-foreground">
          {RECRUITMENT_FEATURES.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
