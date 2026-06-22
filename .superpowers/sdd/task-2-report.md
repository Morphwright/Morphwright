# Task 2 Report: Design Tokens, Fonts, Base Layout

## What was implemented

Three files were created/updated exactly as specified in the brief:

### `src/styles/global.css` (created)
Full set of CSS custom properties (tokens): color palette (`--ink`, `--ink-80/60/40/15`, `--paper`, `--paper-2`, `--accent`, `--accent-soft`, `--line`), font stacks (`--font-display` Newsreader Variable, `--font-body` Inter Variable, `--font-mono` IBM Plex Mono), fluid type scale (`--step--1` through `--step-4` via `clamp()`), spacing scale, layout widths, and easing/duration tokens.

Reset: box-sizing, zero margins, smooth scroll, base body styles (antialiasing, legibility), block-display for media, anchor color inherit, heading font/weight/tracking defaults.

Utility classes: `.container`, `.section`, `.prose`, `.eyebrow`, `.btn`, `.btn--accent`, `.btn--ghost`.

Scroll-reveal scaffold: `[data-reveal]`/`[data-reveal].is-visible` with `prefers-reduced-motion: reduce` override. Focus-visible accent outline.

### `src/layouts/BaseLayout.astro` (created)
Imports all four Fontsource packages (`@fontsource-variable/newsreader`, `@fontsource-variable/inter`, `@fontsource/ibm-plex-mono/400.css`, `@fontsource/ibm-plex-mono/500.css`) and `global.css`. Exposes `title` and `description` props with sensible defaults. Renders a full HTML document with semantic `lang="en"`, viewport meta, `theme-color`, description meta, and a `<slot />`.

### `src/pages/index.astro` (updated)
Replaced the Task 1 scaffold with a token exercise page that uses `BaseLayout`, `.section`, `.container`, `.prose`, `.eyebrow`, fluid `--step-4` heading, mono font paragraph, and `.btn.btn--accent`.

## TDD

Task 2 has no test files (brief specifies none). The vitest suite exits with `passWithNoTests: true`.

RED command: N/A (no failing tests to introduce)
GREEN command: N/A

## Verification command outputs

### `npm run build`
```
17:28:37 [build] output: "static"
17:28:37 [build] mode: "static"
17:28:37 [build] 1 page(s) built in 213ms
17:28:37 [build] Complete!
```
Exit code: 0

### `npm run check`
```
Result (6 files): 
- 0 errors
- 0 warnings
- 0 hints
```
Exit code: 0

### `npm run test`
```
RUN  v2.1.9 /Users/yanzhang/git/Morphwright
include: src/**/*.test.ts
No test files found, exiting with code 0
```
Exit code: 0

## Files changed

```
create mode 100644 src/layouts/BaseLayout.astro
create mode 100644 src/styles/global.css
modify      100644 src/pages/index.astro
```

Commit: `71b5878` — feat: add design tokens, self-hosted fonts, and base layout

## Version substitutions

None. All Fontsource packages were already installed (from Task 1):
- `@fontsource-variable/newsreader` 5.2.5
- `@fontsource-variable/inter` 5.2.5
- `@fontsource/ibm-plex-mono` 5.2.5

## Concerns

None. Build, check, and test all pass cleanly. Files match the brief verbatim.

---

## Fix round (review findings)

**Date:** 2026-06-22

**Findings addressed** (all in `src/styles/global.css`):

1. **WCAG AA contrast — .eyebrow**: `.eyebrow` used `color: var(--accent)` (#C26B3D on #F7F4EF = 3.50:1, below 4.5:1). Fix: introduced `--accent-aa: #9e5328` token (4.6:1 on --paper, 4.6:1 vs #fff) and switched `.eyebrow` to `color: var(--accent-aa)`.

2. **WCAG AA contrast — .btn--accent label**: `.btn--accent` had `background: var(--accent); color: #fff` (3.84:1). Fix: switched to `background: var(--accent-aa); border-color: var(--accent-aa)` (#9e5328 vs #fff ≈ 4.6:1).

3. **Border-color missing from .btn transition**: `border-color` changes on hover but was absent from the transition, causing a visible snap. Fix: extended transition to `background-color var(--dur) var(--ease), color var(--dur) var(--ease), border-color var(--dur) var(--ease)`.

4. **Button transition not suppressed for reduced-motion**: The `@media (prefers-reduced-motion: reduce)` block did not cover `.btn`. Fix: added `.btn { transition: none; }` inside the block.

5. **Focus outline invisible on .btn--accent**: Global `:focus-visible` uses `outline: 2px solid var(--accent)` (#C26B3D). On a `.btn--accent` whose face is now `--accent-aa` (#9e5328), the default orange outline has near-zero contrast against the button surface. Fix: added `.btn--accent:focus-visible { outline-color: var(--paper); }` so the outline is cream on dark-amber — clearly visible.

### Commands run

#### `npm run build`
```
17:32:14 [build] output: "static"
17:32:14 [build] mode: "static"
17:32:15 [build] 1 page(s) built in 207ms
17:32:15 [build] Complete!
```
Exit code: 0

#### `npm run check`
```
Result (6 files):
- 0 errors
- 0 warnings
- 0 hints
```
Exit code: 0
