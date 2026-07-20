"use client";

import { Line, LineChart } from "recharts";

import type { SparklinePoint } from "@/lib/mock/overview";

interface SparklineProps {
  data: SparklinePoint[];
  /** Whether the current trend reads as good news — colors the current-period dot. */
  isGood: boolean;
  width?: number;
  height?: number;
}

// Stat-tile sparkline contract (see dataviz skill): trail in the de-emphasis
// hue, current period called out in the accent — not the whole line colored
// by trend, which would just duplicate what TrendBadge already says.
export function Sparkline({ data, isGood, width = 96, height = 32 }: SparklineProps) {
  const accent = isGood ? "var(--chart-success)" : "var(--destructive)";
  const lastIndex = data.length - 1;

  return (
    <LineChart width={width} height={height} data={data} aria-hidden="true">
      <Line
        type="monotone"
        dataKey="value"
        stroke="var(--muted-foreground)"
        strokeWidth={2}
        dot={(props: { index: number; cx: number; cy: number; key: string }) => {
          const { index, cx, cy, key } = props;
          if (index !== lastIndex) return <g key={key} />;
          return <circle key={key} cx={cx} cy={cy} r={2.5} fill={accent} stroke="none" />;
        }}
        isAnimationActive={false}
      />
    </LineChart>
  );
}
