# Task 10 Report: Motion, Accessibility, and Responsive Polish

## What Was Implemented

### File Modified: `src/layouts/BaseLayout.astro`

Added an IntersectionObserver-based scroll-reveal script to `BaseLayout.astro`. The script:

1. Detects `prefers-reduced-motion: reduce` via `window.matchMedia`.
2. Selects all `[data-reveal]` elements in the document.
3. If reduced-motion is set OR `IntersectionObserver` is unavailable: immediately adds `.is-visible` to all `[data-reveal]` elements (no animation).
4. Otherwise: creates an `IntersectionObserver` with `threshold: 0.15` that adds `.is-visible` to each element as it enters the viewport, then unobserves it (fires once).

### Skip Link

The integration note stated that `BaseLayout.astro` already contained a skip link ("Skip to main content") from earlier fix commits. The existing skip link was preserved as-is — no duplicate was added. The final file has exactly **one** skip link (`<a href="#main" class="skip-link">Skip to main content</a>`).

The existing skip link style (using `transform: translateY(-100%)` hidden off-screen, revealed on `:focus-visible`) was also preserved unchanged, as it is functionally equivalent to (and already implements) the brief's requirement.

## TDD / Verification

No new tests were added for this task (the brief specifies no new test files). The existing test suite was run to confirm no regressions.

### Build verification

```
npm run build
```

Output:
- 5 pages built successfully
- 0 errors
- Build complete in 332ms

### Type check

```
npm run check
```

Output:
- 0 errors
- 0 warnings
- 1 hint (pre-existing: unused `Segment` type import in contours.test.ts — not introduced by this task)

### Test suite

```
npx vitest run
```

Output:
- 3 test files, 16 tests — all pass
- Duration: ~266ms

## Files Changed

- `src/layouts/BaseLayout.astro` — added 18 lines: the `<script>` block with IntersectionObserver scroll-reveal logic

## Version Substitution

None.

## Concerns

None. The implementation exactly matches the brief's specified script, gated correctly on reduced-motion and IntersectionObserver availability. The existing skip link is preserved (no duplicate). Build, type-check, and tests all pass cleanly.

---

## Fix Round

### Findings addressed

All four IMPORTANT findings from the code review were fixed in `src/layouts/BaseLayout.astro`:

1. **Skip-link color tokens inverted** — swapped from `background: var(--paper); color: var(--ink)` to `background: var(--ink); color: var(--paper)` per spec.
2. **`:focus-visible` instead of `:focus`** — changed `.skip-link:focus-visible` to `.skip-link:focus` so AT-driven programmatic focus also reveals the skip link.
3. **Skip-link style block diverged from brief** — replaced the entire skip-link `<style>` block with the brief's exact rule set: `top: -3rem` / `top: 0` toggle (instead of `transform`), `transition: top 200ms var(--ease)` (using the design-system token), `border-radius: 0 0 8px 0`, and the `<style>` block moved inside `<body>` alongside the `<script>`.
4. **No-JS content permanently invisible** — added `<noscript><style>[data-reveal]{opacity:1;transform:none}</style></noscript>` inside `<head>`, mirroring the existing `@media (prefers-reduced-motion: reduce)` override in `global.css:91-94`.

### Commands run

```
npm run build
```

Output:
- 5 pages built successfully
- 0 errors
- Build complete in 336ms

```
npm run check
```

Output:
- 0 errors
- 0 warnings
- 1 hint (pre-existing: unused `Segment` type import in contours.test.ts)

```
npx vitest run
```

Output:
- 3 test files, 16 tests — all pass
- Duration: ~251ms

---

## Fix Round 2

### Findings addressed

Two IMPORTANT findings from the second review round were fixed in `src/layouts/BaseLayout.astro`:

1. **noscript fallback defeated by cascade order** — Changed `[data-reveal]{opacity:1;transform:none}` to `[data-reveal]{opacity:1!important;transform:none!important}` inside the `<noscript>` block. The Astro-injected `<link rel="stylesheet">` lands later in source order (position 360 vs 285) at equal specificity (0,1,0), so without `!important` the linked stylesheet wins. The `!important` declarations override the linked stylesheet regardless of insertion order.
2. **Skip-link transition not gated on prefers-reduced-motion** — Added `@media (prefers-reduced-motion: reduce) { .skip-link { transition: none; } }` inside the same `<style>` block. The global.css reduced-motion block only covers `[data-reveal]` and `.btn`, not `.skip-link`; this guard closes that gap and aligns with the project-wide constraint.

### Commands run

```
npm run build
```

Output:
- 5 pages built successfully
- 0 errors
- Build complete in 300ms

```
npm run check
```

Output:
- 0 errors
- 0 warnings
- 1 hint (pre-existing: unused `Segment` type import in contours.test.ts)
