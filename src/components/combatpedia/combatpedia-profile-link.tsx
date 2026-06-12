import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CombatpediaProfileLink({
  slug,
  displayName,
}: {
  slug: string;
  displayName: string;
}) {
  return (
    <Card className="p-5 border-[#7b1113]/20 bg-gradient-to-br from-[#7b1113]/5 to-transparent">
      <div className="flex items-start gap-3">
        <BookOpen className="h-5 w-5 text-[#7b1113] shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Combatpedia Mode
          </h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Open {displayName} in wiki-style Combatpedia — article, infobox, and image gallery
            powered by Wikipedia.
          </p>
          <Button size="sm" className="mt-4 bg-[#7b1113] hover:bg-[#5e0d0f] text-white" asChild>
            <Link href={`/combatpedia/${encodeURIComponent(slug)}`}>Open Combatpedia article</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
