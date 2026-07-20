# Design System

Dark-first, warm-neutral, two neon brand accents. This doc is the source of truth for every color used in the app — no component should hardcode a Tailwind color like `zinc-900` or `red-600` directly; use the semantic tokens below.

## Principles

- **Dark-first.** Dark mode is the default appearance, not just a supported toggle. Light mode exists for the theme switch but dark is what the product is designed around.
- **90% neutral, 10% brand.** Backgrounds, surfaces, text, and borders stay calm, desaturated, and warm-neutral (never blue-gray). The two brand colors are the only vivid, high-saturation colors anywhere in the UI, and they appear sparingly — primary actions, active states, key highlights.
- **Neon is exclusive to brand color.** Neutrals never get a "glow" treatment. If it's not `primary` or `secondary`, it's calm.
- **Gender-neutral, restrained, timeless.** No cool-blue "corporate SaaS" palette, no pastel-pink/baby-blue gendering, no glossy/luxury cues (gold, black-marble gradients), no futuristic chrome. Warm pastel-neutral + two clean neon accents.

## Brand colors

| Token | Dark mode (hex) | Dark mode (OKLCH) | Role |
| --- | --- | --- | --- |
| `primary` (Neon Red) | `#FF3534` | `oklch(65.0% 0.236 27)` | Primary actions, active/selected states, key highlights |
| `secondary` (Neon Green) | `#3DFF7A` | `oklch(88.0% 0.232 148.7)` | Secondary accents, success states, positive interactive states |

**Revision note:** the original `primary` was `#FF2E4D` (H=20.2°) — visually this read as pink/magenta rather than red. Pure red (`#FF0000`) sits at OKLCH hue ≈29.2°; 20.2° is close enough to magenta to be perceptible as pink, and the chroma wasn't at the gamut ceiling either, which read as slightly washed out for a "neon" claim. Moved the locked hue to 27° (matching well-known "neon red" references like `#FF3131`, and close to pure red) and confirmed max in-gamut chroma at the new hue+lightness — both issues (pink cast, insufficient vividness) traced back to the same root cause. Verified against `destructive` (`#D3232D`, H=25.1°) to make sure the two reds still read as distinct despite the hue gap shrinking — they do, because Lightness (65% vs 56%) and Chroma (0.236 vs 0.208) still separate them clearly.

**Why OKLCH, not just hex:** hex mixes hue, lightness, and saturation into one opaque number — you can't tell by looking at two hex codes whether they're "the same red, recalibrated" or two unrelated reds. OKLCH separates them into Lightness / Chroma / Hue explicitly, which is what makes the dark↔light brand consistency argument checkable rather than just asserted (see below). Tailwind v4 and all modern browsers accept `oklch()` as a first-class CSS color value, so it's directly usable, not just a design reference.

**Brand hue is a single shared value, not two numbers that happen to match.** Two earlier drafts of this system got progressively closer but were still wrong in a specific way worth recording:

1. First draft: picked dark- and light-mode brand hex independently — they landed close in hue by luck (~1° apart).
2. Second draft: derived light mode *from* dark mode's hue mathematically (fixed H, max in-gamut C, L solved for contrast) — but stored the result as hex. Hex quantizes each of R/G/B to an 8-bit integer independently, and that rounding perturbs the hue you get back out whenever L or C differ — so even a mathematically-locked hue came back ~0.1° off once round-tripped through hex.
3. **Final: hue isn't stored as a number to keep in sync at all.** `app/globals.css` declares `--primary-h` and `--secondary-h` exactly once, in `:root`, and `.light` never redeclares them — so under the `.light` class they simply inherit the `:root` value. `--primary` and `--secondary` are then composed as `oklch(var(--primary-l) var(--primary-c) var(--primary-h))` per theme. Only `-l` (lightness) and `-c` (chroma) get theme-specific values. There is exactly one hue value in the codebase per brand color — verified live: `getComputedStyle` on a rendered button reports `oklch(0.65 0.236 27)` in dark mode and `oklch(0.582 0.237 27)` in light mode — same `27` token, not two numbers that are merely close.

| Token | Hue variable | Dark (`-l` / `-c`) | Light (`-l` / `-c`) |
| --- | --- | --- | --- |
| `primary` | `--primary-h: 27` (declared once) | `65%` / `0.236` | `58.2%` / `0.237` |
| `secondary` | `--secondary-h: 148.732` (declared once) | `88%` / `0.232` | `53.5%` / `0.152` |

Lightness and Chroma still change between themes — that's the accessibility/gamut tuning described above. Hue does not change, by construction, because there is only one copy of it.

**Why destructive isn't the same red as primary:** if the brand's primary CTA color and the "delete this" color are identical, a user can't tell "important action" apart from "dangerous action" at a glance — e.g. an "Upgrade Plan" button and a "Cancel Subscription" button would look the same. `destructive` uses its own deeper, less-saturated red (`#D3232D`) that's clearly in the same family (still reads as "red/danger") but is visually distinct from the vivid brand red. `success` intentionally *does* reuse the brand secondary green directly — there's no equivalent collision there (a green "active" tab and a green "payment succeeded" badge reinforce the same idea, positive/on).

**Why primary red uses dark text, not white:** neon red at a lightness that still reads as "glowing" doesn't clear WCAG AA (4.5:1) with white text on top — verified below. Dark text on the neon fill both passes contrast comfortably and reads as more distinctive/on-brand than the conventional white-on-red button.

## Full token set (dark mode — default)

| Token | Hex | OKLCH | Foreground pair |
| --- | --- | --- | --- |
| `background` | `#141312` | `oklch(18.7% 0.003 67.7)` | `foreground` |
| `surface` | `#1B1A18` | `oklch(21.8% 0.004 84.6)` | `foreground` |
| `card` | `#201F1D` | `oklch(24.0% 0.004 84.6)` | `foreground` |
| `elevated` | `#2A2826` | `oklch(27.8% 0.005 67.6)` | `foreground` |
| `border` | `#383532` | `oklch(33.1% 0.007 67.6)` | — |
| `divider` | `#262421` | `oklch(26.1% 0.006 78.2)` | — |
| `foreground` (primary text) | `#F3F1EE` | `oklch(95.9% 0.005 78.3)` | — |
| `foreground-secondary` (secondary text) | `#B7B2AC` | `oklch(76.6% 0.010 72.6)` | — |
| `muted-foreground` (muted/tertiary text) | `#837E78` | `oklch(59.6% 0.011 72.6)` | — |
| `primary` (Neon Red) | `#FF3534` | `oklch(65.0% 0.236 27)` | `primary-foreground` `oklch(17.8% 0.007 34.3)` |
| `secondary` (Neon Green) | `#3DFF7A` | `oklch(88.0% 0.232 148.732)` | `secondary-foreground` `oklch(17.6% 0.009 169.1)` |
| `success` | `#3DFF7A` (= secondary) | `oklch(88.0% 0.232 148.732)` | `success-foreground` `oklch(17.6% 0.009 169.1)` |
| `warning` | `#E8A93D` | `oklch(77.6% 0.140 76.9)` | `warning-foreground` `oklch(22.8% 0.034 84.2)` |
| `destructive` | `#D3232D` | `oklch(56.0% 0.208 25.1)` | `destructive-foreground` `#FFFFFF` |
| `ring` (focus ring) | `#3DFF7A` (= secondary) | `oklch(88.0% 0.232 148.732)` | ring-offset uses `background` |

Note `destructive` (H 25.1°) now sits only ~1.9° from `primary` (H 27°) — closer than before the revision above — but is still a full 9 points lower in Lightness (56% vs 65%) and notably lower in Chroma (0.208 vs 0.236), which is what keeps them visually distinct despite the smaller hue gap (confirmed with a rendered screenshot, not just the numbers). Unlike `primary`/`secondary`, `destructive` does *not* share a locked-hue variable across themes — it's not a brand color, so its light-mode value (below) was picked independently.

**Elevation order** (darkest → lightest surface fill): `background` < `surface` < `card` < `elevated`. `border` and `divider` sit outside that scale — `border` is deliberately lighter than `elevated` so it stays visible as an outline even on the lightest surfaces (popovers, modals); `divider` is a lower-contrast line meant for internal separators (table rows) where a full `border` would be too heavy.

**Interaction-state overlays** (dark mode) — applied as a translucent layer on top of whatever surface/color is underneath, rather than as fixed hex tokens, so one pair works across every surface:

| Token | Value |
| --- | --- |
| `overlay-hover` | `rgba(255,255,255,0.06)` |
| `overlay-active` | `rgba(255,255,255,0.12)` |

**Disabled** is a state pattern, not a color: `opacity-40` + `pointer-events-none` + `cursor-not-allowed`, layered on the element's normal colors. A fixed "disabled color" token would fight whatever variant (primary/destructive/outline) the disabled element actually is.

## Contrast verification (dark mode)

Manually computed against WCAG 2.1 relative-luminance contrast ratios (AA normal text = 4.5:1, AA large text/UI components = 3:1):

| Pair | Ratio | Result |
| --- | --- | --- |
| `foreground` on `background` | 16.5:1 | Passes AAA |
| `foreground-secondary` on `background` | 8.8:1 | Passes AAA |
| `muted-foreground` on `background` | 4.6:1 | Passes AA (near the floor — reserve for timestamps/helper text, not body copy) |
| `primary-foreground` on `primary` | 5.2:1 | Passes AA |
| `secondary-foreground` on `secondary` | 14.0:1 | Passes AAA |
| `warning-foreground` on `warning` | 9.0:1 | Passes AAA |
| `destructive-foreground` (white) on `destructive` | 5.2:1 | Passes AA |
| `ring` on `background` (visibility, 3:1 target) | 14.0:1 | Passes |

The one pairing that does **not** work: white text on `primary` (`#FF3534`) only reaches ~3.61:1 — that's why `primary-foreground` is dark, not white. Don't override it per-component.

## Light mode (secondary — the toggle target)

`primary`/`secondary`/`success`/`ring` are derived by the locked-hue method above (contrast solved to 4.8:1 against white by construction). The remaining light-mode tokens (neutrals, `warning`, `destructive`) are hand-picked and less exhaustively verified than dark mode; re-check those with a contrast tool before shipping the light-mode toggle.

| Token | Hex | OKLCH |
| --- | --- | --- |
| `background` | `#FAF8F6` | `oklch(98.0% 0.003 67.8)` |
| `surface` | `#F4F1ED` | `oklch(95.9% 0.006 75.4)` |
| `card` | `#FFFFFF` | `oklch(100% 0 0)` |
| `elevated` | `#FFFFFF` (rely on shadow, not fill, for elevation here) | `oklch(100% 0 0)` |
| `border` | `#E3DED8` | `oklch(90.3% 0.010 72.7)` |
| `divider` | `#ECE8E3` | `oklch(93.3% 0.008 73.7)` |
| `foreground` | `#201D1B` | `oklch(23.3% 0.006 56.1)` |
| `foreground-secondary` | `#5C5650` | `oklch(45.7% 0.012 67.5)` |
| `muted-foreground` | `#8C857D` | `oklch(62.0% 0.015 71.2)` |
| `primary` | `#E60019` (locked-hue derivation — see above; max in-gamut chroma, lightness solved for 4.8:1 contrast) | `oklch(58.2% 0.237 27)` — same `H` variable as dark mode |
| `primary-foreground` | `#FFFFFF` | `oklch(100% 0 0)` |
| `secondary` / `success` | `#008436` (same derivation) | `oklch(53.5% 0.152 148.732)` — same `H` variable as dark mode |
| `secondary-foreground` / `success-foreground` | `#FFFFFF` | `oklch(100% 0 0)` |
| `warning` | `#A9720A` | `oklch(59.5% 0.123 74.7)` |
| `warning-foreground` | `#FFFFFF` | `oklch(100% 0 0)` |
| `destructive` | `#C81E2C` | `oklch(53.6% 0.201 24.2)` |
| `destructive-foreground` | `#FFFFFF` | `oklch(100% 0 0)` |
| `ring` | `#008436` | `oklch(53.5% 0.152 148.732)` |
| `overlay-hover` | `rgba(0,0,0,0.04)` | — |
| `overlay-active` | `rgba(0,0,0,0.08)` | — |

Note the light-mode brand colors are deliberately *not* identical hex values to dark mode — same hue *variable* (not just a close number, see the composition note above), Lightness/Chroma recalibrated for contrast and gamut. `secondary` shifted more than `primary` in this recalibration because max in-gamut chroma for that hue drops faster as lightness decreases — a gamut constraint, not a chosen aesthetic difference. If `primary` is ever used as inline text/link color on a light background (not just a button fill), double-check contrast at that specific use.

## Implementation

Tokens are implemented as CSS custom properties in [`app/globals.css`](../app/globals.css), with `:root` holding the dark values (dark-first default) and a `.light` class override for the toggle, mapped into Tailwind v4's `@theme inline` so they're usable as ordinary utilities: `bg-background`, `text-foreground`, `bg-primary text-primary-foreground`, `border-border`, `focus-visible:ring-ring`, etc. See [`components/ui/button.tsx`](../components/ui/button.tsx) for the reference usage pattern.

`primary` and `secondary` are not flat hex values in the CSS — they're composed at each theme from three parts: `oklch(var(--primary-l) var(--primary-c) var(--primary-h))`. `--primary-h`/`--secondary-h` are declared exactly once, in `:root`, and `.light` never redeclares them, so they're inherited unchanged — that's what makes the two themes' hue identical by construction rather than by two independently-tuned numbers landing close together. Only `-l` and `-c` get a second, theme-specific declaration in `.light`. Verified live: a rendered button's computed `background-color` reads `oklch(0.65 0.236 27)` in dark mode and `oklch(0.582 0.237 27)` in light mode — same hue field.

## Chart marks

Colors used as UI fills (buttons, badges) aren't automatically correct as chart marks (SVG lines, dots, bars) — a UI color is judged against "does it look right as a small filled shape," a chart mark is judged against measurable checks (lightness band, chroma floor, contrast vs. the chart surface) from the `dataviz` skill. Before wiring up the first Recharts chart, ran that skill's `validate_palette.js` against our actual token hexes on our actual card surfaces (`--card`), not the skill's generic reference palette:

| Token as chart mark | Dark mode | Light mode |
| --- | --- | --- |
| `primary` | Passes unchanged | Passes unchanged |
| `destructive` | Passes unchanged | Passes unchanged |
| `success` / `secondary` | **Fails** the dark-mode lightness band (L=88% — correct for a neon UI fill on near-black, too light to read as chart ink) | Passes unchanged (L=53.5%, already inside the band) |

For the one failure, added `--chart-success` (dark mode only; light mode aliases straight to `--success`) — same locked `--secondary-h` hue as the brand color, recalibrated `L`/`C` for the chart-mark context via the same max-in-gamut-chroma method used for the theme split above (`L=60%, C=0.170` → `#009A40`). Same brand identity, different context, same "lock the hue, recalibrate the rest" pattern — not a new, unrelated color. Used by [`components/dashboard/sparkline.tsx`](../components/dashboard/sparkline.tsx) for the current-period accent dot.

`muted-foreground` also flags on the validator's chroma-floor check (it's a near-neutral gray, by design) — that check is scoped to categorical identity colors, per the validator's own output ("scope: categorical palettes only"). It doesn't apply to an intentionally de-emphasized role like a sparkline's historical trail or axis text; low chroma there is correct, not a bug to fix.
