import type { CSSProperties } from "react";

import { cn } from "@/lib/utils/cn";

export function LoadingSkeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("animate-pulse rounded-md bg-elevated", className)}
      style={style}
    />
  );
}
