import Link from "next/link";
import { TalentComparison } from "@/components/compare/talent-comparison";
import { Button } from "@/components/ui/button";

export default function DashboardComparePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold uppercase">Compare Talent</h1>
        <Button variant="secondary" asChild>
          <Link href="/discover">Add More</Link>
        </Button>
      </div>
      <TalentComparison />
    </div>
  );
}
