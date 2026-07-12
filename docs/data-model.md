# Data Model

Spec to translate into `prisma/schema.prisma`. Written as a spec (not Prisma syntax) — write the actual schema yourself.

## Enums

- `Plan`: `FREE`, `STARTER`, `PRO`, `ENTERPRISE`
- `SubscriptionStatus`: `TRIALING`, `ACTIVE`, `PAST_DUE`, `CANCELLED`
- `PaymentStatus`: `SUCCEEDED`, `FAILED`, `REFUNDED`, `PENDING`
- `AcquisitionChannel`: `ORGANIC`, `PAID_SEARCH`, `SOCIAL`, `REFERRAL`, `EMAIL`, `DIRECT`

## Models

| Model | Fields | Relations | Indexes |
| --- | --- | --- | --- |
| **User** | `id`, `name`, `email`, `company`, `country`, `createdAt`, `lastActiveAt` | `1:N Subscription`*, `1:N Payment`, `1:N Activity`, `1:1 Acquisition` | `email` unique; `country`; `createdAt` |
| **Subscription** | `id`, `userId`, `plan`, `status`, `monthlyPrice`, `startedAt`, `cancelledAt`, `cancellationReason`, `nextBillingAt` | `N:1 User`, `1:N Payment` | `userId`; `status`; `plan`; composite `(status, plan)` |
| **Payment** | `id`, `subscriptionId`, `userId`, `amount`, `currency`, `status`, `paidAt`, `refundedAt` | `N:1 Subscription`, `N:1 User` | `subscriptionId`; `status`; `paidAt` |
| **Activity** | `id`, `userId`, `type`, `description`, `createdAt` | `N:1 User` | `userId`; `createdAt` |
| **Acquisition** | `id`, `userId`, `channel`, `campaign`, `createdAt` | `N:1 User` | `userId`; `channel` |

\* Model `Subscription` as `1:N` from `User` (not `1:1`), even though only one is "active" at a time — this lets you show plan-change history in Customer Detail. Filter to `status: ACTIVE` for "current plan."

## Seed consistency rules

Enforce these in the seed script's generation logic, not in the schema — generate derived records from each user rather than filtering random data after the fact:

- `Plan.FREE` subscriptions → zero `Payment` rows.
- `status: CANCELLED` → `cancelledAt` and `cancellationReason` both non-null; `nextBillingAt` null.
- `Payment.status: REFUNDED` → `refundedAt` non-null and after `paidAt`.
- `Payment.status: FAILED` → still creates a row (needed for the "failed payments" widget), just no `paidAt`.
- Revenue trend over time should resemble a real SaaS business (gradual growth, occasional dips), not random noise — derive monthly cohorts rather than fully independent random dates.

## Verification

After seeding ~1,000 users, write a small check script that recomputes MRR from raw `Subscription`/`Payment` rows and compares it to what the `/api/overview` endpoint returns. This is the cheapest way to catch a seed-data/aggregation-logic mismatch before it shows up as a wrong number on a chart.
