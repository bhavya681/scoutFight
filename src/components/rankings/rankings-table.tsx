import Link from "next/link";
import { Trophy } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CountryFlag } from "@/components/ui/country-flag";
import { computeScoutScore } from "@/lib/utils/scout-score";
import { formatRecord } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TalentProfile } from "@/types";

function RankCell({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span className="inline-flex items-center justify-center gap-1 font-display font-bold tabular-nums">
        <Trophy
          className={cn("h-4 w-4", rank === 1 ? "text-pwr-red" : "text-muted-foreground")}
        />
        {rank}
      </span>
    );
  }
  return <span className="font-display font-bold text-muted-foreground tabular-nums">{rank}</span>;
}

function ScoutScoreCell({ score }: { score: number }) {
  const pct = Math.min(100, Math.round((score / 99) * 100));
  return (
    <div className="flex items-center gap-3 min-w-0 flex-1 sm:min-w-[120px]">
      <span className="font-display font-bold text-foreground tabular-nums w-8 text-right shrink-0">
        {score}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-full sm:max-w-[100px]">
        <div
          className="h-full rounded-full bg-pwr-red transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function sportLabel(sport: string) {
  return sport.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function RankingRowMobile({
  talent,
  rank,
  stripe,
}: {
  talent: TalentProfile;
  rank: number;
  stripe: boolean;
}) {
  const score = computeScoutScore(talent);
  const record = talent.record
    ? formatRecord(talent.record.wins, talent.record.losses, talent.record.draws)
    : "—";

  return (
    <Link
      href={`/athletes/${talent.slug}`}
      className={cn(
        "md:hidden flex gap-3 p-4 transition-colors hover:bg-pwr-red/5 border-b border-border last:border-0",
        stripe ? "bg-muted/50" : "bg-background/80"
      )}
    >
      <div className="flex flex-col items-center gap-2 shrink-0 w-10">
        <RankCell rank={rank} />
        <UserAvatar
          name={talent.displayName}
          src={talent.avatarUrl}
          size="sm"
          shape="rounded"
          className="border border-border"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-bold text-foreground uppercase tracking-wide truncate text-sm">
              {talent.displayName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap">
              {talent.weightClass && <span>{talent.weightClass}</span>}
              <CountryFlag
                nationality={talent.nationality}
                countryCode={talent.countryCode}
                size="xs"
                showLabel
              />
            </p>
          </div>
          <span className="shrink-0 rounded-md border border-border bg-muted/80 px-2 py-0.5 text-[10px] font-semibold uppercase text-foreground/85">
            {sportLabel(talent.sport)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-mono text-foreground tabular-nums">{record}</span>
          <ScoutScoreCell score={score} />
        </div>
        {talent.promotion && (
          <p className="text-[11px] text-muted-foreground truncate">{talent.promotion}</p>
        )}
      </div>
    </Link>
  );
}

export function RankingsTable({
  talents,
  startRank,
}: {
  talents: TalentProfile[];
  startRank: number;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="hidden md:grid md:grid-cols-[4.5rem_1fr_7rem_9rem_6rem] gap-4 px-5 py-3 bg-card text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
        <span>Rank</span>
        <span>Athlete</span>
        <span>Record</span>
        <span>ScoutScore</span>
        <span className="text-right">Sport</span>
      </div>

      <div>
        {talents.map((t, i) => {
          const rank = startRank + i;
          const score = computeScoutScore(t);
          const record = t.record
            ? formatRecord(t.record.wins, t.record.losses, t.record.draws)
            : "—";
          const stripe = i % 2 === 0;

          return (
            <div key={t.slug}>
              <RankingRowMobile talent={t} rank={rank} stripe={stripe} />

              <Link
                href={`/athletes/${t.slug}`}
                className={cn(
                  "hidden md:grid md:grid-cols-[4.5rem_1fr_7rem_9rem_6rem] gap-4 items-center px-5 py-4 transition-colors hover:bg-pwr-red/5 border-b border-border last:border-0",
                  stripe ? "bg-muted/50" : "bg-background/80"
                )}
              >
                <div className="flex justify-start">
                  <RankCell rank={rank} />
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <UserAvatar
                    name={t.displayName}
                    src={t.avatarUrl}
                    size="md"
                    shape="rounded"
                    className="shrink-0 border border-border"
                  />
                  <div className="min-w-0">
                    <p className="font-display font-bold text-foreground uppercase tracking-wide truncate">
                      {t.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2 flex-wrap">
                      {t.weightClass && <span>{t.weightClass}</span>}
                      <CountryFlag
                        nationality={t.nationality}
                        countryCode={t.countryCode}
                        size="xs"
                        showLabel
                      />
                      {t.promotion && (
                        <span className="truncate text-muted-foreground">· {t.promotion}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-sm text-foreground tabular-nums text-center">
                  {record}
                </div>

                <ScoutScoreCell score={score} />

                <div className="justify-self-end">
                  <span className="inline-flex rounded-md border border-border bg-muted/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/85">
                    {sportLabel(t.sport)}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
