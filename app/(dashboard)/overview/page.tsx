import { kpiMetrics, revenueOverTime } from "@/lib/mock/overview";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ChartContainer } from "@/components/charts/chart-container";
import { RevenueChart } from "@/components/charts/revenue-chart";

export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <ChartContainer title="Revenue" description="Monthly recurring revenue, last 12 months">
        <RevenueChart data={revenueOverTime} />
      </ChartContainer>
    </div>
  );
}
