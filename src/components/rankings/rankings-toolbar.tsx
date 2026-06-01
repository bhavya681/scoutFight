"use client";

export function RankingsToolbar({ count }: { count: number }) {
  return (
    <p className="text-sm text-muted-foreground mb-4">
      Showing top{" "}
      <span className="font-semibold text-foreground/85 tabular-nums">
        {count.toLocaleString()}
      </span>{" "}
      athletes — ordered by record, profile quality &amp; social stats
    </p>
  );
}
