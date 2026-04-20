import { Check, Clock3, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BookStatus = "completed" | "dnf" | "in_progress";

const statusConfig: Record<
  BookStatus,
  { icon: typeof Check; iconClassName: string; label: string; ringClassName: string }
> = {
  completed: {
    icon: Check,
    iconClassName: "text-[#61c51d]",
    label: "Completed",
    ringClassName: "border-[#61c51d]/90 bg-[#eff9e7]",
  },
  dnf: {
    icon: X,
    iconClassName: "text-[#ff3b3b]",
    label: "DNF",
    ringClassName: "border-[#ff3b3b]/90 bg-[#fff0f0]",
  },
  in_progress: {
    icon: Clock3,
    iconClassName: "text-[#f2ac00]",
    label: "In Progress",
    ringClassName: "border-[#f2ac00]/90 bg-[#fff7df]",
  },
};

export function BookStatusIndicator({
  className,
  showLabel = true,
  status,
}: {
  className?: string;
  showLabel?: boolean;
  status: BookStatus;
}) {
  const { icon: Icon, iconClassName, label, ringClassName } = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full border-2",
          ringClassName
        )}
      >
        <Icon className={cn("size-4 stroke-[2.5]", iconClassName)} />
      </span>
      {showLabel ? <span className="text-xs font-semibold text-foreground">{label}</span> : null}
    </div>
  );
}
