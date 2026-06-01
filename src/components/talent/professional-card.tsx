"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Shield } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Professional } from "@/types";

interface ProfessionalCardProps {
  professional: Professional;
  index?: number;
}

const ROLE_LABELS: Record<string, string> = {
  referee: "Referee",
  announcer: "Announcer",
  commentator: "Commentator",
  manager: "Manager",
  agent: "Agent",
  coach: "Coach",
};

export function ProfessionalCard({ professional, index = 0 }: ProfessionalCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/professionals/${professional.slug}`}>
        <Card className="group overflow-hidden hover:border-pwr-accent/40 transition-all h-full">
          <div className="relative aspect-[4/3] overflow-hidden">
            <UserAvatar
              name={professional.displayName}
              src={professional.avatarUrl}
              size="fill"
              shape="rounded"
              placeholderVariant="official"
              className="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
            {professional.verification === "verified" && (
              <Badge variant="verified" className="absolute top-3 left-3 gap-1">
                <Shield className="h-3 w-3" /> Verified
              </Badge>
            )}
            <div className="absolute bottom-0 p-4">
              <h3 className="font-display font-bold text-foreground uppercase">
                {professional.displayName}
              </h3>
              <p className="text-sm text-white/80">
                {ROLE_LABELS[professional.role]} · {professional.yearsExperience} yrs
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CountryFlag
              nationality={professional.nationality}
              countryCode={professional.countryCode}
              size="xs"
              showLabel
            />
            <div className="ml-auto flex gap-1">
              {professional.sports.slice(0, 2).map((s) => (
                <Badge key={s} variant="secondary" className="uppercase text-[10px]">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
