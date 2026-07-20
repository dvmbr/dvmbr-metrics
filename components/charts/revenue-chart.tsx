"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import type { RevenuePoint } from "@/lib/mock/overview";
import { formatCompactCurrency } from "@/lib/utils/format";

function RevenueTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-elevated px-3 py-2 text-xs shadow-lg">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-semibold text-foreground">
        {formatCompactCurrency(payload[0].value as number)}
      </p>
    </div>
  );
}

// Single series -> area chart, no legend (the title already names it), per
// the dataviz skill's form guidance. Single hairline gridline set, thin
// (2px) stroke, fill wash at ~10% opacity — never a saturated block.
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
      <CartesianGrid
        vertical={false}
        stroke="var(--divider)"
        strokeDasharray="none"
      />
      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        width={48}
        tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        tickFormatter={(value: number) => formatCompactCurrency(value)}
      />
      <Tooltip
        content={<RevenueTooltip />}
        cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
      />
      <Area
        type="monotone"
        dataKey="revenue"
        stroke="var(--primary)"
        strokeWidth={2}
        fill="var(--primary)"
        fillOpacity={0.1}
        isAnimationActive={false}
      />
    </AreaChart>
  );
}
