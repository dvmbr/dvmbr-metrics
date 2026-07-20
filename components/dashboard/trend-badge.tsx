import { ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface TrendBadgeProps {
  changePercent: number;
  /** Whether an increase is good news for this metric (false for churn-like metrics). */
  goodDirection: "up" | "down";
}

export function TrendBadge({ changePercent, goodDirection }: TrendBadgeProps) {
  const isIncrease = changePercent >= 0;
  const isGood = goodDirection === "up" ? isIncrease : !isIncrease;
  const Icon = isIncrease ? ArrowUp : ArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
        isGood ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {Math.abs(changePercent).toFixed(1)}%
    </span>
  );
}
