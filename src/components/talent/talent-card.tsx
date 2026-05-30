"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/user-avatar";
import { GitCompare, Heart, Shield, TrendingUp } from "lucide-react";
import { CountryFlag } from "@/components/ui/country-flag";
import { PromotionMark } from "@/components/talent/promotion-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TalentProfile } from "@/types";
import { formatRecord, formatCurrency } from "@/lib/utils";
import { useFavoritesStore } from "@/stores/favorites-store";
import { useCompareStore } from "@/stores/compare-store";
import { AVAILABILITY_STATUS } from "@/lib/constants";

interface TalentCardProps {
  talent: TalentProfile;
  index?: number;
  showMarketValue?: boolean;
}

export function TalentCard({ talent, index = 0, showMarketValue }: TalentCardProps) {
  const { toggleAthlete, isAthleteFavorite } = useFavoritesStore();
  const { add, has, items } = useCompareStore();
  const favorited = isAthleteFavorite(talent.id);
  const inCompare = has(talent.id);
  const availLabel = AVAILABILITY_STATUS.find((a) => a.id === talent.availability)?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card className="group overflow-hidden hover:border-pwr-red/40 hover:shadow-xl hover:shadow-pwr-red/10 transition-all duration-300 h-full flex flex-col">
        <Link href={`/athletes/${talent.slug}`} className="block relative aspect-[4/3] overflow-hidden">
          <UserAvatar
            name={talent.ringName ?? talent.displayName}
            src={talent.avatarUrl}
            size="fill"
            shape="rounded"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {talent.verification === "verified" && (
            <Badge variant="verified" className="absolute top-3 left-3 gap-1">
              <Shield className="h-3 w-3" /> Verified
            </Badge>
          )}
          {talent.ranking && (
            <Badge className="absolute top-3 right-3">#{talent.ranking}</Badge>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {talent.countryCode && (
              <CountryFlag
                nationality={talent.nationality}
                countryCode={talent.countryCode}
                size="sm"
                className="mb-2"
              />
            )}
            <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
              {talent.displayName}
            </h3>
            {talent.record && (
              <p className="text-sm text-white/80">
                {formatRecord(talent.record.wins, talent.record.losses, talent.record.draws)}
                {talent.weightClass ? ` · ${talent.weightClass}` : ""}
              </p>
            )}
          </div>
        </Link>
        <div className="p-4 flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
            <CountryFlag
              nationality={talent.nationality}
              countryCode={talent.countryCode}
              size="xs"
              showLabel
              className="min-w-0 flex-1"
            />
            <Badge variant="sport" className="shrink-0 uppercase">
              {talent.sport}
            </Badge>
          </div>
          {talent.promotion && (
            <PromotionMark
              promotion={talent.promotion}
              logoUrl={talent.promotionLogoUrl}
              organizationSlug={talent.promotionOrgSlug}
              size="sm"
              className="text-muted-foreground"
            />
          )}
          {availLabel && (
            <span className="text-xs text-muted-foreground">{availLabel}</span>
          )}
          {showMarketValue && talent.marketValue && (
            <p className="text-sm font-semibold text-pwr-gold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Est. {formatCurrency(talent.marketValue * 100)}
            </p>
          )}
          <div className="flex gap-1 mt-auto">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => toggleAthlete(talent.id)}
              aria-label="Favorite"
            >
              <Heart className={`h-4 w-4 ${favorited ? "fill-pwr-red text-pwr-red" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={inCompare || items.length >= 4}
              onClick={() =>
                add({
                  id: talent.id,
                  slug: talent.slug,
                  displayName: talent.displayName,
                  avatarUrl: talent.avatarUrl,
                  type: "athlete",
                  sport: talent.sport,
                })
              }
              aria-label="Compare"
            >
              <GitCompare className={`h-4 w-4 ${inCompare ? "text-pwr-red" : ""}`} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
