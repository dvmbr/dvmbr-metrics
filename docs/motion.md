# Motion Design

Motion is part of the brand, not decoration. The interface is calm by default and comes alive only through interaction — users should remember how it *feels*, not notice individual animations. Every transition implies the interface occupies continuous physical space: elements never instantly appear, disappear, or jump between states.

## Principles

- Every interaction is intentional — no motion without a reason.
- Smooth movement over dramatic effects.
- Motion communicates spatial relationships and continuity (things slide/fade *from* and *to* somewhere, not teleport).
- Never bouncy, playful, gamified, or attention-seeking — calm, refined, precise, premium.
- Color (the neon brand accents) supports interaction; movement is what's actually memorable.
- Movement stays subtle: typical spatial displacement is 2–8px, scale never exceeds 102% (hover holds at 100%; press compresses to 98–99%, never more).

## Tokens

Defined in [`app/globals.css`](../app/globals.css) as a plain `@theme` block — motion doesn't change between light/dark, so unlike the color tokens it isn't `:root`/`.light`-switched. Named distinctly from Tailwind's built-in `ease-in`/`ease-out` so there's no ambiguity about which curve is active.

**Usage gotcha, verified by inspecting the actual generated CSS, not assumed:** Tailwind v4 recognizes `--ease-*` under `@theme` and generates a real `ease-standard` utility class from it — but it does *not* do the same for `--duration-*`. A plain `duration-fast` class silently fails to generate (no CSS rule at all), and the transition falls back to Tailwind's own default duration (150ms) instead. The working pattern is the arbitrary-value var reference instead: `duration-(--duration-fast)`, which does generate correctly (`transition-duration: var(--duration-fast)`). Use `ease-<name>` directly, but `duration-(--duration-<name>)` for duration.

| Token | Value | Use for |
| --- | --- | --- |
| `duration-instant` | 80ms | The smallest, most immediate feedback (e.g. a value flip with no travel) |
| `duration-fast` | 150ms | Small, frequently-used controls: buttons, toggles, checkboxes, icon state changes |
| `duration-normal` | 220ms | Medium components: dropdown/popover open-close, tabs, inline expansion |
| `duration-slow` | 320ms | Large or spatially significant movement: dialogs, drawers, page transitions |
| `duration-spatial-phase` | 280ms | Fixed total for the Spatial Phase sequence below (Phase 10% + Pulse 50% + Afterimage/Settle 40%) — shared so the signature interaction is perceptibly identical everywhere it's used, not hand-tuned per component |
| `ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | "Ease Out" — default for plain interactive state changes (color/background, simple transitions) |
| `ease-spring` | `cubic-bezier(0.22, 1, 0.36, 1)` | "Gentle Spring" — smooth deceleration, *no overshoot* (a true spring would overshoot; this is the no-overshoot approximation the brief explicitly asks for). Used for the Spatial Phase sequence |
| `ease-exit` | `cubic-bezier(0.7, 0, 0.84, 0)` | Elements disappearing — quick start, gets out of the way |

Renamed from an earlier draft: `duration-base` → `duration-normal` (200ms → 220ms) to match this token vocabulary exactly; `duration-fast` changed 120ms → 150ms; `ease-entrance` was replaced by `ease-spring` (same role — smooth arrival, no overshoot — renamed to match the brief's own "Gentle Spring" language, and its value updated to a slightly gentler curve). Every existing reference (`Sidebar`'s indicator, `Button`) was updated to the new names — nothing was left pointing at a token that no longer exists.

**Duration scales with the size/significance of what's moving** — a button is small and frequently touched, so it should feel instantly responsive (`fast`); a dialog is a large spatial event, so a slightly longer, more deliberate motion (`slow`) reads as more "physical" rather than abrupt. For a same-element state change like a hover color, use `ease-standard`; for anything meant to feel like it's arriving/settling (including every stage of Spatial Phase), use `ease-spring`.

## Signature interaction: Spatial Phase

The formalized, final version of the product's signature motion — supersedes an earlier, simpler "Energy Sweep" draft (a single pulse pass; still accurate as a description of stage 2 below, just not the whole system). Every Spatial Phase interaction runs the same five-stage sequence on one shared timeline (`duration-spatial-phase`, 280ms total):

| Stage | Share of timeline | What happens |
| --- | --- | --- |
| **Phase** | 0–10% (~28ms) | The component briefly loses spatial definition: opacity dips to ~97%, a max 1px blur — no scale, no movement |
| **Pulse** | 10–60% (~140ms) | A narrow, brand-colored gradient band (brighter center, low opacity) travels through, left to right, single pass, never loops |
| **Shift** | concurrent with Pulse | The actual state change (background/color/border) transitions on its own quick timing, landing within the Pulse's window so the two read as synchronized — "the pulse caused the transition" |
| **Afterimage** | 60–100% (~112ms) | A barely-perceptible residual settles and fades after the pulse has passed |
| **Settle** | end of timeline | Fully at rest — no oscillation, no bounce |

**Two component families, not one blanket effect:**

- **Phase Pulse** — for energy-communicating interactions: Buttons, Toggle Buttons, Tabs, Menu Items, Interactive List Items.
- **Phase Shift** — for spatial-movement interactions: Sidebar Navigation / Active Indicators, Page Transitions, Dialog Transitions, Selected Cards. `Sidebar`'s sliding indicator (below) already satisfies this family's specific "Sliding Indicator" requirement — continuous repositioning of one persistent element, no fade — without any changes, since it was built the same way before this brief existed.

**An interpretive call worth flagging explicitly:** "Afterimage" is specified as *not* resembling glow, shadow, blur, bloom, or motion trails — but also as "a faint residual distortion, as though space itself briefly remembers." Every literal CSS effect for "residue" (box-shadow, filter: blur/drop-shadow, a second lingering gradient) falls into the excluded list. The implemented interpretation: a tiny *geometric* distortion instead of a *lighting* one — `transform: skewX(0.3deg)` that resolves back to `none` — since geometric skew isn't glow/shadow/blur/bloom/trail under any reading, and "space remembering a displacement" maps reasonably onto "the shape was momentarily not quite itself." This is a judgment call on inherently poetic language, not a spec-mandated technique — worth revisiting if it doesn't read as intended once more components use it.

## Applied so far

**`Button`** ([`components/ui/button.tsx`](../components/ui/button.tsx)) is the reference pattern — a Phase Pulse component. Superseded the earlier single-pulse Energy Sweep with the full five-stage sequence.

- **Press**: `active:scale-[0.98]` only, unrelated to the Spatial Phase sequence — "firm and precise, like a mechanical switch." Confirmed the two don't fight: `scale` (press), `translate` (the Pulse band, on a separate `::before` element), and `transform` (the button's own Phase/Afterimage animation) are three independent CSS properties, so pressing *while* the phase animation is running correctly shows both at once (`scale: 0.98` and the Afterimage's skew simultaneously) rather than one overriding the other — verified by sampling both mid-sequence, not assumed from the code.
- **Phase + Afterimage + Settle**: `hover:animate-[spatial-phase_var(--duration-spatial-phase)_var(--ease-spring)]` (and `focus-visible:` for keyboard parity) on the button itself. `@keyframes spatial-phase` (in [`app/globals.css`](../app/globals.css)) drives `opacity`/`filter` for Phase and `transform` for Afterimage, all on the one shared timeline.
- **Pulse**: `hover:before:animate-[energy-pulse_var(--duration-spatial-phase)_var(--ease-spring)]` on a `before:` pseudo-element (no extra DOM node) — `w-1/3` band, `bg-gradient-to-r from-transparent via-{color}/25 to-transparent`, off-screen at rest (`-translate-x-full`), animated via `@keyframes energy-pulse` from `-100%` to `300%` translate, timed to hold through Phase (0–10%) then travel 10–60% so it's fully gone before Afterimage begins.
- **Shift**: still the plain `transition-[color,background-color,border-color,box-shadow,scale] duration-(--duration-fast) ease-standard` from the earlier draft — `duration-fast` is now 150ms, which lands comfortably inside the Pulse's ~140ms window, so the color settle and the pulse passing read as one synchronized event rather than two separately-timed ones.
- **Sweep/pulse color still differs by variant, deliberately**: filled variants (`default`/`secondary`/`destructive`) already show the brand color as their fill, so their pulse is a plain white highlight — "light passing over polished metal," not another dose of the same hue on top of itself. `outline`/`ghost` have no brand color at rest, so their pulse uses `primary` (neon red) — the one case where it's actually "revealing the brand color," per the brief.
- Disabled buttons get `pointer-events-none`, so none of `hover:`, `active:`, or `focus-visible:` fire there.
- **Three real bugs caught by inspecting generated CSS/computed styles, not by reading the class list back** — all three the same underlying lesson (verify the actual rendered CSS, arbitrary-value syntax can silently produce nothing or the wrong thing) applied three times:
  1. *(carried over from the Energy Sweep draft)* Keyframing `transform: translateX(...)` doesn't compose with Tailwind's `-translate-x-full`, which sets the standalone `translate` property — fixed by keyframing `translate` throughout.
  2. *(carried over)* `ease-entrance`'s strong front-loaded deceleration was tuned for elements arriving and settling, not a streak passing through — at 40% of duration it had already covered ~94% of its travel. Replaced with a more even curve (now `ease-spring`, re-verified after the rename).
  3. **New**: named the pulse keyframe `pulse`, which collided with Tailwind v4's own *built-in* `@keyframes pulse` (the `animate-pulse` loading-skeleton shimmer — ironic, since the brief explicitly says the pulse should "never resemble a loading shimmer"). CSS doesn't merge two same-named `@keyframes` — the later one in the stylesheet wins outright — so Tailwind's built-in silently replaced mine, and the band simply never moved (`translate` stuck at `-100%` at every sampled timestamp). Caught by sampling computed `translate` across the full timeline and seeing it never change, then confirmed via the compiled stylesheet showing two separate `@keyframes pulse` blocks. Renamed to `energy-pulse` — no further collision risk with any Tailwind reserved name (`spin`/`ping`/`pulse`/`bounce`).
- **Visual risk-checked, not just measured**: the Phase stage's opacity/blur dip was the biggest risk of reading as a rendering glitch rather than a deliberate effect, especially on button *text*. Injected a real text-labeled button (cloned from a live `Button` instance's actual class list, not hand-copied) and screenshotted at 3x zoom through rest → Phase-peak → mid-Pulse → Afterimage. Text stayed legible throughout; the dip is subtle enough not to read as a glitch.
- **Also fixed a related, genuinely reported bug**: Button visibly "shrank" the instant a `DropdownMenuTrigger`'s menu opened, even though the cursor never moved (from the earlier hover-scale draft, but the same root cause matters for the current hover-triggered Phase animation too). Root cause, confirmed via `getComputedStyle`/`elementFromPoint`: Radix sets `pointer-events: none` on `<body>` while a `DropdownMenu` is open (standard, intentional Radix behavior, not a bug in this app), which makes `:hover` stop matching on the trigger instantly. Fixed by also driving the "engaged" background off `data-[state=open]` (Radix forwards `data-state` onto the element via `asChild`/`Slot`) — every filled variant gets `data-[state=open]:bg-*` matching its `hover:bg-*`, re-verified after this rewrite still holds.

**Sidebar** ([`components/layout/sidebar.tsx`](../components/layout/sidebar.tsx), [`components/layout/nav-link.tsx`](../components/layout/nav-link.tsx)) — combines both Spatial Phase families: Phase Shift for *which item is active*, Phase Pulse for *hovering any item*.

Active indicator (Phase Shift) — a single slim (`w-0.5`) `primary`-colored bar that slides between nav items, rather than each item getting its own fade-in indicator:

- **One persistent DOM element, repositioned — not recreated.** The brief explicitly calls for the indicator to feel like it's "physically sliding," which requires the same element to move, not a new one appearing at the new spot while the old one disappears (that reads as a fade/swap, not a slide, no matter how fast).
- **Position is measured, not assumed.** `Sidebar` holds a ref per nav item and, in a `useLayoutEffect` keyed on the active index, reads `offsetTop`/`offsetHeight` off the actual active link and stores it as state, applied via inline `style={{ top, height }}`. This avoids hardcoding an assumed row height (fragile against font-loading shifts or future label wrapping) — `useLayoutEffect` specifically (not `useEffect`) so the correct position is committed before the browser paints, with no visible flash at a wrong spot on first mount.
- **The animation is a plain CSS transition** (`transition-[top,height] duration-(--duration-normal) ease-standard`), not a physics/spring library. The brief allows either ("a spring animation *or* a smooth ease-out transition") — a well-tuned CSS transition reusing the existing `duration-normal`/`ease-standard` tokens satisfies "fluid and responsive" without adding a new dependency (e.g. Framer Motion) for one component. Retroactively, this is also exactly what the later Spatial Phase brief calls a "Phase Shift" component ("Sliding Indicator" — continuous repositioning, no fade) — built the same way independently, before that vocabulary existed.
- **No glow.** The brief made glow optional and conditional on staying extremely subtle; skipped for now in favor of the plainest version — easy to add a low-opacity `box-shadow` later if it reads as too flat.
- Verified the motion is real, not an instant snap masquerading as one: sampled the indicator's computed `top` immediately after a nav click (barely moved from its start position) versus ~250ms later (settled exactly at the new item's measured offset) — confirms the CSS transition is actually interpolating.
- The indicator bar itself is scoped to the desktop `Sidebar` — `MobileDrawer` still has no sliding indicator (see "Still pending").

Per-item hover (Phase Pulse) — `NavLink` reuses `Button`'s exact pattern (same `spatial-phase`/`energy-pulse` keyframes, same `duration-spatial-phase` timeline, `primary`-tinted pulse since nav items have no brand fill at rest, same as Button's outline/ghost variants):

- Since `NavLink` is the shared component both `Sidebar` and `MobileDrawer` render, both got this for free — no separate implementation needed (`isActive` was already lifted out to a prop for the indicator's sake, so adding the pulse here didn't require touching either parent).
- **Checked something the indicator work didn't need to worry about: repeated engagement.** A sidebar is persistent chrome scanned frequently, unlike a button clicked occasionally — six items stacked tightly means a user moving down the list could trigger six pulses in quick succession. Simulated a realistic scan (~120ms between items, matching natural mouse movement) and screenshotted mid-scan and end-of-scan: no overlapping-pulse chaos, because each pulse's ~140–170ms travel time has mostly finished by the time a user reaches the next item at that pace. Kept the full sequence (including the Phase opacity/blur dip) rather than pre-emptively trimming it, since the actual captures didn't show the busyness risk I'd flagged before building it.

## Still pending

**Phase Pulse rollout** (reuse `Button`'s exact pattern — `spatial-phase` + `energy-pulse` keyframes, `duration-spatial-phase` timeline): Toggle Buttons, Tabs, Menu Items, Interactive List Items.

**Phase Shift rollout** (reuse `Sidebar`'s measured-position + CSS-transition pattern, not the Pulse mechanics): Page Transitions, Dialog Transitions, Selected Cards, and applying an equivalent sliding indicator to `MobileDrawer`'s nav list (currently still plain background-only).

Neither family is for continuous/ambient states (e.g. a Card's plain hover-lift, per "Gentle Lift" in the brief — cards may lift slightly on hover, but that's not a Spatial Phase interaction, just a subtle `translateY` + shadow) — only discrete, intentional engagement.

**Everything else**: Dialogs (beyond their Phase Shift transition), Tables, Charts, Tooltips, Toasts, Context menus, Inputs — should reuse the existing tokens when built/revisited, not introduce new ad hoc values. Radix's `data-[state=open]`/`data-[state=closed]` attributes are the hook point for entrance/exit animation on the overlay components (`Dialog`, `DropdownMenu`) already in the codebase, and — per the Button dropdown fix above — worth checking generally on any component that's also a Radix trigger, since `:hover`/`:active` alone aren't reliable once `body { pointer-events: none }` is in play.
