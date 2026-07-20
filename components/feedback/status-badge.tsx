import { cn } from "@/lib/utils/cn";
import type { SubscriptionStatus } from "@/lib/mock/customers";

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-success/15 text-success" },
  TRIALING: { label: "Trialing", className: "bg-warning/15 text-warning" },
  PAST_DUE: { label: "Past due", className: "bg-destructive/15 text-destructive" },
  CANCELLED: { label: "Cancelled", className: "bg-elevated text-muted-foreground" },
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
