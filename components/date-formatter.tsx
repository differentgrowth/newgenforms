import { format } from "date-fns-tz";

import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props =
  BadgeProps
  & {
  date: Date;
  timezone: string;
}
export const DateFormatter = ( { date, timezone, variant = 'outline', className, ...props }: Props ) => {
  return (
    <Badge
      variant={ variant }
      className={ cn(
        "grow justify-center",
        className
      ) }
      { ...props }>
      { format( date, "LLL dd, y - h:mm a zzz", { timeZone: timezone } ) }
    </Badge>
  );
};