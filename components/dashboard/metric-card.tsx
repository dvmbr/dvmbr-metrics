import type { KpiMetric } from "@/lib/mock/overview";
import { formatCompactCurrency, formatCompactNumber, formatPercent } from "@/lib/utils/format";
import { TrendBadge } from "@/components/dashboard/trend-badge";
import { Sparkline } from "@/components/dashboard/sparkline";

function formatValue(metric: KpiMetric): string {
  switch (metric.format) {
    case "currency":
      return formatCompactCurrency(metric.value);
    case "percent":
      return formatPercent(metric.value);
    default:
      return formatCompactNumber(metric.value);
  }
}

export function MetricCard({ metric }: { metric: KpiMetric }) {
  const changePercent =
    ((metric.value - metric.previousValue) / metric.previousValue) * 100;
  const isIncrease = changePercent >= 0;
  const isGood = metric.goodDirection === "up" ? isIncrease : !isIncrease;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm text-foreground-secondary">{metric.label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {formatValue(metric)}
          </p>
          <div className="mt-1.5" title="vs last month">
            <TrendBadge changePercent={changePercent} goodDirection={metric.goodDirection} />
          </div>
        </div>
        <Sparkline data={metric.sparkline} isGood={isGood} />
      </div>
    </div>
  );
}
