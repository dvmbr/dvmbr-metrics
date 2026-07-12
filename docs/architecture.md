# Architecture

## Overview

- **Next.js App Router** is the full-stack shell. Route Handlers (`app/api/**/route.ts`) are the backend — no separate server process. Server Components do the initial data fetch per page; Client Components take over for anything interactive (filters, tables, charts).
- **TanStack Query runs only in Client Components.** Server Components fetch directly (via Prisma or an internal call), then hydrate a Client Component wrapper that TanStack Query takes over for refetching/filtering. Decide this hydration pattern once and apply it consistently — don't fetch the same data twice across the RSC/client boundary.
- **Prisma + PostgreSQL** is the single source of truth. Keep Prisma calls inside route handlers plus a thin `lib/db` query layer — no full repository pattern, that's over-engineering at this scope.
- **Zod** validates every API route's query params/body and doubles as the TypeScript type source via `z.infer`, so there's one definition instead of a hand-written `interface` that can drift out of sync.
- **Zustand** is scoped to UI-only state that TanStack Query and the URL can't own: sidebar collapsed/expanded, mobile drawer open. Filters, pagination, sort, and date range live in **URL search params** — shareable, bookmarkable, survives refresh, and gives Server Components a source of truth for the initial fetch.

## Tech stack rationale

| Choice | Why it fits this project |
| --- | --- |
| Next.js App Router | Server Components remove the need for a separate backend; Route Handlers are the API. One deploy target (Vercel). |
| TypeScript | End-to-end typing (Prisma → Zod → components) matters in a data-heavy app where currency/date/enum mistakes are easy to make silently. |
| Tailwind | Fast to build dense dashboard layouts and reason about per-component responsive breakpoints. |
| Radix UI (primitives) | Headless, accessible components (dialogs, dropdowns, tabs, tooltips) with no baked-in styling — you own every visual decision with Tailwind, which is what a minimal, non-colorful, Linear/Vercel-like look requires. Trade-off: you're responsible for focus management, ARIA wiring, and keyboard nav yourself rather than inheriting a pre-built styled layer. |
| TanStack Query | Every page here refetches on filter/date-range change and needs caching + retries. This is the standard solution vs. hand-rolled `useEffect` fetching, and demonstrates understanding of the RSC/client-cache boundary. |
| Recharts | Declarative/composable, fits React's model. Raw D3 costs far more time than this project's visual requirements justify. |
| Prisma | Typed query results flow straight into API responses and Zod schemas with no manual mapping layer; migrations give a reviewable schema history. |
| PostgreSQL | The domain is relational (Users/Subscriptions/Payments have real FKs) and MRR/ARR/churn math needs `SUM`/`GROUP BY` aggregation — awkward in a document store. |
| Zod | One schema gives both runtime validation at the API boundary and static types via `z.infer`. |
| date-fns | Tree-shakeable, immutable, and has the exact period-math helpers (`startOfMonth`, `subMonths`, `differenceInDays`) the "previous period comparison" KPI logic needs. |
| next-themes | Handles flash-of-wrong-theme-on-load and OS-preference sync correctly out of the box. |

## Route structure

```text
/                          → redirect to /overview
/overview                  Dashboard (KPIs, main charts, widgets)
/revenue                   Revenue analytics
/customers                 Customer table
/customers/[customerId]    Customer detail
/subscriptions             Subscription management (post-MVP)
/reports                   Report builder + CSV export (post-MVP)
/settings                  Post-MVP

/api/overview                 GET
/api/revenue                  GET
/api/customers                GET (list)
/api/customers/[id]            GET (detail)
/api/customers/[id]/activity   GET
/api/subscriptions             GET
/api/reports                   POST (generate)
```

Use a route group `app/(dashboard)/` wrapping all admin pages in a shared layout (sidebar + header). Keep `app/api/` outside that group.

## Folder structure

No `src/` wrapper — `create-next-app` scaffolded this project with `app/` at the repo root, and `@/*` is aliased to the project root in `tsconfig.json`. Structure follows that:

```text
dvmbr-metrics/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ app/
│  ├─ (dashboard)/
│  │  ├─ layout.tsx
│  │  ├─ overview/page.tsx
│  │  ├─ revenue/page.tsx
│  │  ├─ customers/page.tsx
│  │  ├─ customers/[customerId]/page.tsx
│  │  ├─ subscriptions/page.tsx
│  │  ├─ reports/page.tsx
│  │  └─ settings/page.tsx
│  ├─ api/
│  │  ├─ overview/route.ts
│  │  ├─ revenue/route.ts
│  │  ├─ customers/route.ts
│  │  ├─ customers/[customerId]/route.ts
│  │  ├─ subscriptions/route.ts
│  │  └─ reports/route.ts
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ ui/              ← hand-built components on Radix UI primitives (Button, Dialog, DropdownMenu, Tabs, Tooltip, etc.)
│  ├─ layout/           Sidebar, Header, MobileDrawer
│  ├─ dashboard/        MetricCard, TrendBadge, Sparkline
│  ├─ charts/           ChartContainer, RevenueChart, UserGrowthChart, PlanDistributionChart
│  ├─ data-table/       DataTable, Pagination, SortableHeader
│  ├─ filters/          FilterBar, DateRangePicker, SearchInput
│  └─ feedback/         EmptyState, ErrorState, LoadingSkeleton, StatusBadge
├─ lib/
│  ├─ db.ts              Prisma client singleton
│  ├─ validations/       Zod schemas per resource
│  ├─ queries/           TanStack Query hooks (useOverviewQuery, etc.)
│  └─ utils/              cn(), formatCurrency, date-fns helpers, csv export
├─ hooks/
├─ types/
├─ store/                 Zustand stores (sidebar, theme if needed)
├─ .env
└─ package.json
```

## Core user flow

1. Admin lands on **Overview** → sees KPI cards + trend at a glance.
2. Picks a date range in the header → every widget on the page refetches scoped to that range (the main state-management showcase: one date range, many consumers).
3. Notices churn or revenue dip → clicks into **Revenue** for the breakdown by plan/country/payment status.
4. Wants to see who's affected → goes to **Customers**, filters by plan/status, sorts by last active.
5. Clicks a customer → **Customer Detail** shows billing history, activity timeline, LTV.
6. Needs to hand this off → goes to **Reports**, filters, exports CSV.

Design the API and URL-state contracts around this flow — the date range and plan filter must be structurally reusable across Overview, Revenue, and Customers, not three separate implementations.
