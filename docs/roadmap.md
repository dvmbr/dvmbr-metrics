# Roadmap

## Feature prioritization

| Tier | Scope | Why |
| --- | --- | --- |
| **P0 (MVP)** | Overview, Revenue, Customers, Customer Details, dark mode, responsive layout, loading/error/empty states | Enough to demo end-to-end |
| **P1** | Subscriptions, Reports + CSV export | Adds breadth once the core patterns (table, filters, charts) are proven |
| **P2** | Settings page, notifications panel, polish pass | Low interview-signal value relative to effort |

Build P0 pages **fully vertical** (UI → API → DB) one at a time, not all UIs then all APIs. Vertical slices catch data-modeling mistakes early and keep something demoable at every step.

## Phased steps

### Phase 1 — Foundation

- [x] `create-next-app` (TS, App Router, Tailwind)
- [x] Dark-first design system: CSS custom properties + Tailwind v4 `@theme inline`, locked-hue neon brand colors (see [design-system.md](./design-system.md))
- [x] Set up the folder structure ([architecture.md](./architecture.md#folder-structure))
- [ ] `ui/` primitives on Radix, built as needed: [x] `cn()`, [x] `Button`, [x] `Dialog` (doubles as the mobile drawer's Sheet via a `side` prop), [x] `DropdownMenu` — [ ] `Tooltip`, [ ] `Select`, [ ] `Tabs` still pending (build when a page actually needs them)
- [x] Configure dark mode via `next-themes` — `ThemeProvider` + `ThemeToggle` wired up, dark-first (`defaultTheme="dark"`, `enableSystem={false}`), verified via a real click: `<html>` swaps `dark`↔`light`, body background swaps `#141312`↔`#FAF8F6`, zero hydration warnings
- [x] Build `Sidebar` + `Header` + root `(dashboard)/layout.tsx` with static nav — all 6 routes scaffolded with placeholder pages, root `/` redirects to `/overview`, active-nav state and header page-title both derive from `next/navigation`'s pathname off the single `navItems` source of truth
- [x] Responsive drawer working on mobile — `MobileDrawer` (Dialog `side="left"`) mirrors `Sidebar`, closes automatically on navigation

**Exit criteria:** shell renders correctly in light/dark and at mobile width, with no data wired up. ✅ Met — verified end-to-end with Playwright at desktop (1280px, sidebar visible) and mobile (375px, hamburger + drawer) viewports, both theme states, dropdown interactions, and cross-page navigation; zero console errors.

**Note:** hit one real bug along the way — `Sidebar` was a Server Component passing `navItems` (which include Lucide icon *components*, i.e. functions) as props into the client `NavLink`, and React can't serialize functions across the server→client boundary. Fixed by making `Sidebar` a Client Component too, since the nav is inherently interactive (active-state depends on client-side pathname) anyway.

### Phase 2 — Static UI with mock data

- [ ] Hand-write small mock JSON fixtures per page
- [ ] Build `MetricCard`, `TrendBadge`, `ChartContainer` + one Recharts chart wired to mock data
- [ ] Build `DataTable` + `Pagination` against a mock customer array
- [ ] Confirm responsive + dark mode across all built components

### Phase 3 — Database

- [ ] Write `schema.prisma` from [data-model.md](./data-model.md)
- [ ] `prisma migrate dev`; verify tables in Postgres (local Docker or Neon/Supabase free tier)
- [ ] Write `seed.ts` — generate users first, then derive subscriptions/payments/activity/acquisition from each user so the consistency rules hold by construction
- [ ] Run seed; spot-check row counts and consistency invariants in a DB client

### Phase 4 — API

- [ ] Write Zod schemas for query params (shared base + per-route extensions)
- [ ] Implement `/api/overview` first (most complex aggregation)
- [ ] Implement remaining routes: customers → customers/[id] → revenue → subscriptions → reports
- [ ] Test each route against edge cases: empty date range, invalid plan, page beyond total

### Phase 5 — Wire up real data

- [ ] Replace mock fixtures with TanStack Query hooks calling the API routes
- [ ] Move filters/pagination/sort into URL search params; read them server-side for the initial Server Component fetch and client-side for the TanStack Query `queryKey`
- [ ] Confirm query invalidation/refetch works correctly when filters change

### Phase 6 — Hardening

- [ ] Loading/error/empty states everywhere
- [ ] Accessibility pass: keyboard nav through table/filters, ARIA labels on charts, focus management in the mobile drawer, contrast check in both themes
- [ ] Performance pass: profile Recharts re-render cost on filter change, add `React.memo` only where profiling shows it's needed, verify Server Component streaming with `loading.tsx` per route
- [ ] Cross-browser/responsive QA at 375px / 768px / 1440px

### Phase 7 — Ship

- [ ] Deploy (Vercel + Neon/Supabase)
- [ ] Write README with architecture diagram, decisions, setup instructions
- [ ] Record a demo GIF/video and take portfolio screenshots

## Technical risks

| Risk | Mitigation |
| --- | --- |
| Seed data for ~1,000 users with consistent derived records is easy to get subtly wrong (e.g. MRR not matching sum of active subscriptions) | Post-seed verification script that recomputes MRR from raw rows and compares to the API response |
| Period-over-period comparison logic is a common source of off-by-one date bugs | Centralize date-range math in one tested set of pure functions, don't inline it per route |
| RSC + TanStack Query boundary confusion (double-fetching, hydration mismatches) | Fetch once on the server, pass via `dehydrate`/`HydrationBoundary` into the client query — one pattern, applied everywhere |
| Recharts performance with larger seeded datasets | Aggregate on the server (SQL/Prisma `groupBy`), never ship raw row-level data to a chart |
| Currency/timezone handling across filters | Store amounts in cents + currency code, format at display time only, treat all dates as UTC internally |
| Scope creep across 7 pages and 6+ chart types | Ship P0 vertical slices fully before touching Subscriptions/Reports |

## Portfolio / interview talking points

- Why filters/pagination live in the URL, not component state or Zustand — testable, shareable, back-button-correct.
- The Server Component + TanStack Query hydration boundary decision, and why it isn't all client-side.
- Seed data built for logical consistency instead of `faker.js` noise — data integrity, not just UI.
- Consistent API response envelope (`{ data, meta }`) across every route.
- Deliberate composition in `DataTable`/`ChartContainer` — one `DataTable` serves customers, revenue transactions, and reports without duplication.
