import type { Metadata } from "next";
import Link from "next/link";
import { TalentCard } from "@/components/talent/talent-card";
import { getAllTalent } from "@/lib/data/talent-repository";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Athletes",
  description: "Live profiles of wrestlers, MMA fighters, and boxers — sourced from Wikipedia.",
};

export const revalidate = 3600;

export default async function AthletesPage() {
  const talent = await getAllTalent();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Athletes</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Real public profiles and photos from Wikipedia. Videos loaded from YouTube.
          </p>
        </div>
        <Button asChild>
          <Link href="/discover">Advanced Search</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {talent.map((t, i) => (
          <TalentCard key={t.id} talent={t} index={i} />
        ))}
      </div>
    </div>
  );
}
