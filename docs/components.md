# Component Hierarchy

## Base `ui/` layer (Radix primitives)

Hand-built on `@radix-ui/react-*`, styled with Tailwind — no generated/copy-pasted layer. Spec for what to build, in build order:

| Component | Built on | Responsibility |
| --- | --- | --- |
| `cn()` util | `clsx` + `tailwind-merge` | Merge conditional classNames and resolve Tailwind conflicts (e.g. two `p-*` values). Every other component depends on this — build it first. |
| `Button` | `@radix-ui/react-slot` | Variants via `class-variance-authority`: `variant` (default [brand red] / secondary [brand green] / outline / ghost / destructive), `size` (sm / default / lg / icon). `asChild` prop (via Slot) lets it render as a `Link` without wrapper markup. Colors come from [design-system.md](./design-system.md) tokens — never hardcode a Tailwind color like `zinc-900` here. |
| `Tooltip` | `@radix-ui/react-tooltip` | Icon-only buttons, truncated table cells, KPI card info icons. Simplest Radix wrapper — good second build to prove the pattern. |
| `DropdownMenu` | `@radix-ui/react-dropdown-menu` | Header user menu, table row actions. |
| `Select` | `@radix-ui/react-select` | `FilterBar` controls (plan, country, currency). |
| `Tabs` | `@radix-ui/react-tabs` | Customer Detail sections (Billing / Activity / Plan Changes), Reports grouping. |
| `Dialog` | `@radix-ui/react-dialog` | Confirmation modals, customer quick-view. Most complex (portal + focus trap) — build last once the pattern is proven on simpler components. |

Each wrapper follows the same shape: import the Radix primitive's parts (`Root`/`Trigger`/`Portal`/`Content`/etc.), re-export them with your own Tailwind classes applied via `cn()`, and expose only the props your app actually uses — don't proxy Radix's full API surface speculatively.

```text
DashboardLayout
├─ Sidebar (Logo, NavItem×6)
├─ Header (PageTitle, DateRangePicker, NotificationsPopover, UserMenu, ThemeToggle)
└─ MobileDrawer (mirrors Sidebar, Sheet-based)

OverviewPage
├─ MetricCard × 5        → TrendBadge, Sparkline
├─ ChartContainer
│  ├─ RevenueChart
│  ├─ UserGrowthChart
│  └─ ActiveUsersChart
├─ PlanDistributionChart
├─ AcquisitionChannelsWidget
├─ CountryDistributionWidget
├─ RecentPaymentsWidget
└─ AlertsPanel

CustomersPage
├─ FilterBar → SearchInput, PlanFilter, StatusFilter, CountryFilter
├─ DataTable → SortableHeader, StatusBadge, EmptyState/ErrorState/LoadingSkeleton
└─ Pagination

CustomerDetailPage
├─ CustomerProfile
├─ SubscriptionCard
├─ BillingHistoryTable
├─ ActivityTimeline
└─ LtvSummary
```

## State conventions

Every data-bearing component gets four states baked in from the start:

1. **Loading** — skeleton, not a spinner, matching the shape of the eventual content.
2. **Error** — message + retry action.
3. **Empty** — contextual message (e.g. "No customers match these filters" vs. "No customers yet").
4. **Success** — the real content.

Build `LoadingSkeleton`, `ErrorState`, and `EmptyState` once as generic, reusable components — don't rebuild them per page. `DataTable` and `ChartContainer` should each accept these as slots/props so every table and every chart gets the same four-state handling for free.

## Composition notes

- `DataTable` should be generic enough to serve the customers table, revenue transactions, and reports output — don't build three separate table components.
- `ChartContainer` owns the loading/error/empty wrapper and responsive sizing; the chart components themselves (`RevenueChart`, etc.) just take data and render.
- `StatusBadge` is shared across subscription status, payment status, and any other enum-driven badge — parameterize by variant, don't fork it.
