"use client";

import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";

interface ChartContainerProps {
  title: string;
  description?: string;
  state?: "loading" | "error" | "empty" | "success";
  onRetry?: () => void;
  emptyMessage?: string;
  errorMessage?: string;
  height?: number;
  /** Required for the success state — not rendered (and not required) otherwise. */
  children?: ReactElement;
}

// Owns the loading/error/empty wrapper and responsive sizing (ResponsiveContainer)
// so individual charts (RevenueChart, etc.) just take data and render — see
// docs/components.md.
export function ChartContainer({
  title,
  description,
  state = "success",
  onRetry,
  emptyMessage,
  errorMessage,
  height = 280,
  children,
}: ChartContainerProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {state === "loading" && <LoadingSkeleton style={{ height }} className="w-full" />}
      {state === "error" && <ErrorState message={errorMessage} onRetry={onRetry} />}
      {state === "empty" && <EmptyState message={emptyMessage} />}
      {state === "success" && (
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
