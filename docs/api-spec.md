# API Specification

## Shared conventions

All list endpoints accept a common base query-param set, extended per route. Validate everything with Zod (a shared base schema, extended per route) — never trust query params unvalidated.

- `page`, `pageSize`
- `sortBy`, `sortDir`
- `from`, `to` (date range)
- `country`
- `plan`

**Response envelope** — every endpoint returns a predictable shape:

- Lists: `{ data: T[], meta: { page, pageSize, total } }`
- Metrics: `{ data: T, meta: { periodStart, periodEnd, comparedTo } }`

## Endpoints

| Endpoint | Method | Key params | Returns |
| --- | --- | --- | --- |
| `/api/overview` | GET | `from`, `to` | KPIs with prior-period deltas, sparkline series, revenue/user-growth series, top widgets |
| `/api/revenue` | GET | `from`, `to`, `plan`, `country`, `currency`, `paymentStatus` | MRR/ARR breakdown, new/expansion/contraction/churn revenue, transactions list |
| `/api/customers` | GET | `search`, `plan`, `status`, `country`, `page`, `sortBy` | Paginated customer rows + total count |
| `/api/customers/[id]` | GET | — | Profile, subscription history, payments, LTV, last login |
| `/api/customers/[id]/activity` | GET | `page` | Paginated activity timeline (kept separate from the detail endpoint so it's independently loadable/paginable) |
| `/api/subscriptions` | GET | `status`, `plan` | Active/trial/cancelled buckets, churn reasons aggregate |
| `/api/reports` | POST | filters + `metrics[]`, `groupBy` | Aggregated rows shaped for CSV export |

## Notes

- Implement `/api/overview` first — it has the most complex aggregation logic (period-over-period comparison), and getting the date-math right early avoids repeating mistakes across the other endpoints.
- Aggregate on the server (SQL/Prisma `groupBy`) for anything feeding a chart — never ship raw row-level data to Recharts.
- Centralize date-range math (previous-period calculation, UTC handling) in one shared utility, not inlined per route.
