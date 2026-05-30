import { Badge } from "@/components/ui/badge";
import { getCareerStatusLabel, isRecruitingStatus } from "@/lib/constants";
import type { CareerStatus } from "@/types";
import { cn } from "@/lib/utils";

interface CareerStatusBadgeProps {
  status: CareerStatus;
  className?: string;
}

export function CareerStatusBadge({ status, className }: CareerStatusBadgeProps) {
  const open = isRecruitingStatus(status);
  return (
    <Badge
      variant={open ? "default" : "outline"}
      className={cn(
        open && "bg-pwr-red/15 text-pwr-red border-pwr-red/30",
        className
      )}
    >
      {getCareerStatusLabel(status)}
    </Badge>
  );
}
