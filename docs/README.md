# dvmbr-metrics — Project Docs

A portfolio-grade **analytics admin dashboard** for a fictional SaaS productivity platform (Free / Starter / Pro / Enterprise plans): MRR/ARR, subscribers, churn, revenue breakdowns, customer management, and reporting — built to demonstrate senior-level frontend architecture, not just UI.

## Docs index

| Doc | Covers |
| --- | --- |
| [architecture.md](./architecture.md) | Tech stack + rationale, route structure, folder structure, core user flow |
| [design-system.md](./design-system.md) | Color tokens (dark-first, neon red/green brand accents on warm neutrals), contrast verification |
| [data-model.md](./data-model.md) | Prisma schema spec (models, enums, relations, indexes), seed consistency rules |
| [api-spec.md](./api-spec.md) | API endpoints, query params, response envelope |
| [components.md](./components.md) | Component hierarchy, state conventions (loading/error/empty) |
| [roadmap.md](./roadmap.md) | Feature prioritization, phased build steps, current status, risks, portfolio talking points |

## Status

Project scaffolded with `create-next-app` (Next.js 16, React 19, Tailwind 4, TypeScript). See [roadmap.md](./roadmap.md) for current phase and next steps.

## Ground rules for this project

- **Vertical slices, not horizontal layers.** Build each MVP page fully (UI → API → DB) before starting the next, rather than all UIs then all APIs.
- **Filters, sort, pagination, and date range live in the URL** (search params), not in global client state.
- **Zustand is reserved for UI-only state** (sidebar collapsed, drawer open) — never for server data or filters.
- **Every data-bearing view has four states**: loading (skeleton), error (retry), empty (contextual message), success.
