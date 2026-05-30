"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TAGLINE } from "@/lib/constants";

const ROLES = [
  {
    id: "talent",
    label: "Talent",
    desc: "Athletes and industry professionals building their global profile",
  },
  {
    id: "recruiter",
    label: "Recruiter / Scout",
    desc: "Promoters, matchmakers, managers, and organizations hiring talent",
  },
  {
    id: "organization",
    label: "Organization",
    desc: "Promotions, gyms, academies, and event companies",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <Card className="p-8 max-w-lg w-full">
        <p className="text-xs text-pwr-red uppercase tracking-widest mb-2">{APP_TAGLINE}</p>
        <h1 className="font-display text-2xl font-bold uppercase mb-2">Welcome to ScoutFight</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Free to use — pick a workspace view (optional, no account needed).
        </p>
        <div className="space-y-3 mb-8">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRole(r.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                role === r.id
                  ? "border-pwr-red bg-pwr-red/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <p className="font-semibold">{r.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
        <Button
          className="w-full"
          disabled={!role}
          onClick={() =>
            router.push(
              role === "talent" ? "/dashboard?role=talent" : "/dashboard?role=recruiter"
            )
          }
        >
          Complete Setup
        </Button>
      </Card>
    </div>
  );
}
