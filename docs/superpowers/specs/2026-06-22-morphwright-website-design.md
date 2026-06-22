# Morphwright Website — Design Specification

Date: 2026-06-22
Status: Approved (pending spec review)

## 1. Purpose

Build the public marketing website for **Morphwright**, a deep-tech company that
designs the behavior of living cells from protein-circuit first principles. The
site must feel premium and intellectually serious, with one signature interactive
element: an animated topographic-contour hero where each "mountain" reads as a
cell — a *Morph* — on a designable landscape.

The name: **Morph** (cell / morphology / "to change form") + **-wright** (a maker
or craftsman, as in shipwright, playwright) — "one who crafts cellular form."

## 2. Aesthetic Direction

The guiding principle is **classic, restrained, editorial design** in the spirit
of Anthropic's design philosophy — calm, warm, humanist, and intellectually
confident. This is an explicit rejection of crypto / nightclub / neon
pseudo-cyberpunk styling: no glow spam, no rainbow gradients, no flashy easing.

Composition follows the classic "dark entrance, light body" arc:

- A dramatic, full-viewport **dark hero** (near-black canvas, white contour lines,
  a single warm accent) that establishes mood.
- The rest of the site flips to a **warm, light, editorial layout** — ivory paper
  background, ink text, generous whitespace, measured type.

Motion is slow and deliberate. Everything respects `prefers-reduced-motion`.

## 3. Site Structure (multi-page, Astro)

Five pages, top navigation: **Home · Science · Team · Careers · Contact**

| Page | Purpose |
|------|---------|
| **Home** (`/`) | Topographic hero + one-line positioning + three pillars + science teaser + CTA |
| **Science** (`/science`) | What Morphwright does technically: designing cellular behavior from protein-circuit first principles; the "behavior → circuit" design map. Placeholder copy that is safe to replace. |
| **Team** (`/team`) | Founder / advisor placeholder cards |
| **Careers** (`/careers`) | Values + placeholder open roles |
| **Contact** (`/contact`) | Email + simple static contact form (mailto or form service) + location placeholder |

All copy in this build is **polished English placeholder** the user will replace
later. It must be coherent with the deep-tech positioning, never fabricated as
specific claims (no fake metrics, no named partners, no invented publications).

## 4. Technical Architecture

- **Astro (latest) + TypeScript**, static output (`output: 'static'`).
- Deployable to Cloudflare Pages / Vercel / GitHub Pages. Domain
  **Morphwright.com** is under the user's control; **deployment is a later phase**,
  not part of this build.

Directory layout:

```
src/
  layouts/BaseLayout.astro       # <head>, fonts, nav, footer, page slot
  components/
    Nav.astro                    # sticky top nav, active-page state
    Footer.astro
    TopoCanvas.astro             # the hero animation (self-contained)
    topo/                        # TS modules for the animation
      noise.ts                   # simplex/value noise (hand-rolled, no dep)
      field.ts                   # evolving height field + cursor peak
      contours.ts                # marching-squares contour extraction
      renderer.ts                # canvas draw loop, DPR, lifecycle
    Hero.astro                   # canvas + overlay (wordmark, slogan, CTA)
    Pillars.astro / Section*.astro
  pages/
    index.astro
    science.astro
    team.astro
    careers.astro
    contact.astro
  styles/
    global.css                   # design tokens + base + utilities
public/
  fonts/                         # self-hosted woff2
  favicon / logo assets
astro.config.mjs
```

### 4.1 TopoCanvas (the centerpiece)

A self-contained client-side module — plain TypeScript + a single `<canvas>`, no
UI framework, no WebGL, no third-party animation library.

- **Height field**: a 2D scalar field from layered (fractal) simplex/value noise.
  A slowly advancing time dimension makes the whole terrain morph / "breathe."
- **Contours**: marching-squares over the field at evenly spaced thresholds →
  crisp white polylines on near-black. Optional faint pseudo-3D vertical offset
  per contour band for subtle depth (toward design option C), kept tasteful.
- **Cursor interaction** (pointer devices): the cursor adds a smooth Gaussian
  "peak" to the field — a mountain rising under the pointer — with contours
  rippling outward and a soft warm-amber light at the summit. The peak relaxes
  back when the pointer leaves.
- **Touch / no-pointer**: cursor peak disabled; ambient drift only.

Performance & lifecycle (required, not optional):

- `requestAnimationFrame` loop; cap device pixel ratio (e.g. ≤ 2) and field
  resolution; render contours on an offscreen/low-res grid scaled up.
- Pause via `IntersectionObserver` when the hero scrolls offscreen.
- Pause on `document.hidden` (tab switch).
- `prefers-reduced-motion: reduce` → render a single elegant static contour frame,
  no animation loop.
- Debounced resize; clean teardown of listeners.

The animation is a progressive enhancement: if JS fails or canvas is unsupported,
the hero still shows the wordmark, slogan, and CTA over a solid dark background.

## 5. Visual System

### 5.1 Color tokens (CSS custom properties in `global.css`)

| Token | Value (starting point) | Use |
|-------|------------------------|-----|
| `--ink` | `#0A0A0B` | hero bg, body text on light |
| `--paper` | `#F7F4EF` | warm ivory body background |
| `--paper-2` | `#EFEAE1` | alternate light section |
| `--accent` | `#C26B3D` (muted clay-amber) | CTAs, technical accents, cursor-peak light |
| `--accent-soft` | `#D9A441` | subtle warm highlight / hover |
| grays | `--ink-60 / --ink-40 / --ink-20` | secondary text, rules, captions |

Refined and warm, never metallic/neon. Exact hex values are tunable during
implementation; these are the agreed starting palette.

### 5.2 Typography (self-hosted woff2, zero FOUT)

- **Display / headings**: a classic transitional serif — **Newsreader** or
  **Spectral** (Tiempos-like, warm, editorial). Swappable.
- **Body / UI**: **Inter** (clean humanist grotesk).
- **Technical labels / mono accents**: **IBM Plex Mono**, used sparingly for
  small captions, kbd-style tags, and data-flavored labels (reinforces deep-tech).
- A fluid type scale (clamp-based) with generous line length and leading.

### 5.3 Motion system

- Restrained scroll reveals (fade + small translate) via `IntersectionObserver`.
- One shared duration/easing pair for consistency; slow and calm.
- All scroll/entrance motion disabled under `prefers-reduced-motion`.

## 6. Home Page Content Outline

1. **Hero** — TopoCanvas + overlay: Morphwright wordmark (placeholder logotype +
   a small concentric-contour-ring mark forming a peak), a one-line slogan, a
   warm CTA ("See the science" → `/science`), a quiet scroll cue.
   - Slogan candidates: *"We engineer the behavior of living cells."* /
     *"Design at the resolution of a single cell."*
2. **Positioning paragraph** — *"Morphwright builds the design layer for cellular
   behavior — turning desired function into the protein circuits that produce it."*
3. **Three pillars** — e.g., *Design map · First-principles circuits · Verified by
   simulation* (placeholder, editable).
4. **Science teaser** — short framing + link to `/science`.
5. **Closing CTA** — careers / contact.

## 7. Accessibility & Responsiveness

- Semantic landmarks, visible focus states, sufficient contrast (accent and text
  pass WCAG AA on their backgrounds).
- Keyboard-navigable nav and CTAs; form fields labeled.
- Responsive from ~320px up: mobile gets the ambient (non-cursor) animation, a
  collapsed nav, and reflowed sections.

## 8. Verification

- `astro build` completes with no errors; `astro check` (types) clean.
- No console errors on any page in dev.
- Hero animation runs smoothly (target ~60fps on a modern laptop), pauses
  offscreen and on tab hide, and shows the static fallback under reduced-motion.
- Responsive check at mobile / tablet / desktop widths.
- Cross-page navigation works; active nav state correct.
- Manual screenshot review via local dev server before calling it done.

## 9. Out of Scope (this build)

- Production deployment / DNS / CI (later phase; domain already owned).
- Real copy, real logo, real team/role data, real photography.
- Any backend, CMS, analytics, or app/login functionality.
- WebGL / 3D hero (design option B) — kept as a possible future upgrade.

## 10. Implementation Phasing (for the plan)

1. Scaffold Astro + TypeScript, base layout, global tokens, self-hosted fonts.
2. Nav + Footer + BaseLayout shell across all five routes.
3. TopoCanvas: noise → field → contours → renderer → cursor peak → lifecycle/perf.
4. Hero overlay + Home page sections.
5. Science / Team / Careers / Contact pages with placeholder content.
6. Motion polish, accessibility pass, responsive pass.
7. Verification (build, check, screenshots) and cleanup.
