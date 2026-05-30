import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingCTA({
  athleteSlug,
  athleteName,
}: {
  athleteSlug: string;
  athleteName: string;
}) {
  return (
    <Button asChild>
      <Link href={`/booking?athlete=${athleteSlug}`}>
        <Calendar className="h-4 w-4 mr-2" />
        Book {athleteName.split(" ")[0]}
      </Link>
    </Button>
  );
}
