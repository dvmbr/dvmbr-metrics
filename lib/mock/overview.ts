// Hand-built mock data for the Overview page (Phase 2 — static UI, no DB yet).
// Trends are hand-shaped to look like a real SaaS business (gradual growth,
// one soft dip) rather than random noise, per docs/roadmap.md.

export interface SparklinePoint {
  month: string;
  value: number;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percent";
  /** Whether an increase in this metric is good news (false for churn). */
  goodDirection: "up" | "down";
  sparkline: SparklinePoint[];
}

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function series(values: number[]): SparklinePoint[] {
  return values.map((value, i) => ({ month: months[i], value }));
}

// Monthly recurring revenue: steady growth with a soft dip in Aug (a
// realistic mid-year seasonality wobble) before recovering.
const mrrSeries = [
  18400, 19100, 20300, 21200, 22800, 24100,
  25400, 24700, 26200, 27900, 29600, 31200,
];

const subscriberSeries = [
  412, 431, 458, 479, 508, 534,
  551, 546, 572, 601, 628, 655,
];

const newUserSeries = [
  86, 92, 101, 97, 112, 118,
  109, 96, 121, 128, 119, 134,
];

const conversionSeries = [
  3.1, 3.3, 3.2, 3.5, 3.6, 3.8,
  3.7, 3.4, 3.9, 4.0, 4.1, 4.3,
];

// Churn ticked up slightly around the same Aug wobble, then improved as the
// team addressed it — goodDirection "down" means the trend line matters more
// than the raw sign of the change.
const churnSeries = [
  2.4, 2.3, 2.2, 2.3, 2.1, 2.0,
  2.2, 2.6, 2.3, 2.0, 1.8, 1.7,
];

export const kpiMetrics: KpiMetric[] = [
  {
    id: "mrr",
    label: "Monthly Recurring Revenue",
    value: mrrSeries.at(-1)!,
    previousValue: mrrSeries.at(-2)!,
    format: "currency",
    goodDirection: "up",
    sparkline: series(mrrSeries),
  },
  {
    id: "active-subscribers",
    label: "Active Subscribers",
    value: subscriberSeries.at(-1)!,
    previousValue: subscriberSeries.at(-2)!,
    format: "number",
    goodDirection: "up",
    sparkline: series(subscriberSeries),
  },
  {
    id: "new-users",
    label: "New Users",
    value: newUserSeries.at(-1)!,
    previousValue: newUserSeries.at(-2)!,
    format: "number",
    goodDirection: "up",
    sparkline: series(newUserSeries),
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    value: conversionSeries.at(-1)!,
    previousValue: conversionSeries.at(-2)!,
    format: "percent",
    goodDirection: "up",
    sparkline: series(conversionSeries),
  },
  {
    id: "churn-rate",
    label: "Churn Rate",
    value: churnSeries.at(-1)!,
    previousValue: churnSeries.at(-2)!,
    format: "percent",
    goodDirection: "down",
    sparkline: series(churnSeries),
  },
];

export interface RevenuePoint {
  month: string;
  revenue: number;
}

export const revenueOverTime: RevenuePoint[] = series(mrrSeries).map((p) => ({
  month: p.month,
  revenue: p.value,
}));
