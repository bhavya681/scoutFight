"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CountryFlag } from "@/components/ui/country-flag";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCompareStore } from "@/stores/compare-store";
import type { TalentProfile } from "@/types";
import { getCareerStatusLabel } from "@/lib/constants";
import { formatRecord } from "@/lib/utils";

export function TalentComparison() {
  const { items } = useCompareStore();
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setTalents([]);
      setLoading(false);
      return;
    }
    fetch("/api/talent")
      .then((r) => r.json())
      .then((data) => {
        const all = (data.talent ?? []) as TalentProfile[];
        setTalents(all.filter((t) => items.some((i) => i.id === t.id)));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [items]);

  if (items.length < 2) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-sm">
          Add at least 2 athletes using the compare button on profile cards.
        </p>
        <Link href="/discover" className="text-brand font-medium mt-4 inline-block text-sm">
          Discover athletes →
        </Link>
      </Card>
    );
  }

  if (loading) {
    return <Card className="p-12 text-center text-muted-foreground text-sm">Loading live profiles…</Card>;
  }

  const rows: { label: string; values: (string | React.ReactNode)[] }[] = [
    { label: "Sport", values: talents.map((t) => t.sport.toUpperCase()) },
    { label: "Weight class", values: talents.map((t) => t.weightClass ?? "—") },
    {
      label: "Record",
      values: talents.map((t) =>
        t.record
          ? formatRecord(t.record.wins, t.record.losses, t.record.draws)
          : "—"
      ),
    },
    {
      label: "Height",
      values: talents.map((t) => (t.heightCm ? `${t.heightCm} cm` : "—")),
    },
    {
      label: "Weight",
      values: talents.map((t) => (t.weightKg ? `${t.weightKg} kg` : "—")),
    },
    {
      label: "Reach",
      values: talents.map((t) => (t.reachCm ? `${t.reachCm} cm` : "—")),
    },
    {
      label: "Experience",
      values: talents.map((t) =>
        t.experienceYears ? `${t.experienceYears} years` : "—"
      ),
    },
    {
      label: "Championships",
      values: talents.map((t) =>
        t.championships.length
          ? t.championships.map((c) => c.name).join(", ")
          : "—"
      ),
    },
    {
      label: "Popularity",
      values: talents.map((t) =>
        t.popularityScore != null ? `${t.popularityScore}/100` : "—"
      ),
    },
    {
      label: "Nationality",
      values: talents.map((t) => (
        <CountryFlag
          key={t.id}
          nationality={t.nationality}
          countryCode={t.countryCode}
          size="sm"
          showLabel
        />
      )),
    },
    { label: "Location", values: talents.map((t) => t.location) },
    {
      label: "Career status",
      values: talents.map((t) => getCareerStatusLabel(t.careerStatus)),
    },
    {
      label: "Free agent",
      values: talents.map((t) => (t.freeAgent ? "Yes" : "No")),
    },
    {
      label: "Data",
      values: talents.map((t) => (
        <Badge variant="verified" className="gap-1">
          <Shield className="h-3 w-3" /> {t.dataSource ?? "live"}
        </Badge>
      )),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[600px] text-sm bg-card">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left p-4 text-muted-foreground font-medium w-36" />
            {talents.map((t) => (
              <th key={t.id} className="p-4 text-center min-w-[160px]">
                <Link href={`/athletes/${t.slug}`} className="group">
                  <UserAvatar
                    name={t.displayName}
                    src={t.avatarUrl}
                    size="md"
                    shape="rounded"
                    className="mx-auto border border-border"
                  />
                  <p className="font-semibold mt-2 group-hover:text-brand">{t.displayName}</p>
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <td className="p-4 text-muted-foreground">{row.label}</td>
              {row.values.map((val, i) => (
                <td key={i} className="p-4 text-center">
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
