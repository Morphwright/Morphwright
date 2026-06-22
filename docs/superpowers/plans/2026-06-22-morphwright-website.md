# Morphwright Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Morphwright marketing website — a multi-page Astro static site whose signature element is an animated topographic-contour hero (black canvas, white lines, warm clay-amber cursor-raised peak).

**Architecture:** Astro static site with a warm, editorial, Anthropic-leaning aesthetic: a dramatic dark hero opening into a light, generously spaced body. The hero animation is a framework-free TypeScript module on a single `<canvas>` — layered value noise builds an evolving height field, marching-squares extracts contour lines, and a cursor adds a Gaussian "peak." Pure algorithmic modules (noise, field, contours) are unit-tested with Vitest; Astro layout/pages are verified by build, type-check, and screenshot review.

**Tech Stack:** Astro 5 (static), TypeScript (strict), Vitest, Fontsource (self-hosted Newsreader + Inter + IBM Plex Mono), Canvas 2D. No WebGL, no third-party animation library.

## Global Constraints

These apply to every task.

- **Astro, static output** (`output: 'static'`). No backend, CMS, or analytics.
- **Hero animation is framework-free**: plain TypeScript + Canvas 2D only. **No WebGL / three.js** (design option B is explicitly out of scope) and **no third-party animation library**. Noise is hand-rolled (no noise dependency).
- **Self-hosted fonts** via Fontsource (no runtime Google Fonts request).
- **Color tokens (CSS custom properties), starting palette:** `--ink #0A0A0B`, `--paper #F7F4EF`, `--paper-2 #EFEAE1`, `--accent #C26B3D` (muted clay-amber, never metallic/neon), `--accent-soft #D9A441`. Warm and restrained.
- **Typography:** display serif = Newsreader; body/UI = Inter; technical labels/mono = IBM Plex Mono (used sparingly).
- **Aesthetic:** classic, calm, editorial. No neon glow spam, rainbow gradients, or flashy easing.
- **Accessibility:** all motion respects `prefers-reduced-motion: reduce`; visible focus states; semantic landmarks; AA contrast.
- **Copy is polished English placeholder** — coherent with the deep-tech positioning, but **never fabricated specifics** (no fake metrics, named partners, or invented publications).
- **Deployment is out of scope** for this build (domain Morphwright.com is owned; deploy is a later phase).
- **Pages:** Home (`/`), Science (`/science`), Team (`/team`), Careers (`/careers`), Contact (`/contact`). Nav order: Home · Science · Team · Careers · Contact.
- Commit after every task with a `feat:`/`chore:`/`test:` message.

---

## File Structure

```
package.json                       # Task 1
astro.config.mjs                   # Task 1
tsconfig.json                      # Task 1
vitest.config.ts                   # Task 1
src/env.d.ts                       # Task 1
src/pages/index.astro              # Task 1 (temp) → Task 8 (real home)
src/styles/global.css              # Task 2
src/layouts/BaseLayout.astro       # Task 2 (+ Task 3 nav/footer, + Task 10 reveal script)
src/components/Nav.astro           # Task 3
src/components/Footer.astro        # Task 3
src/components/topo/noise.ts       # Task 4
src/components/topo/noise.test.ts  # Task 4
src/components/topo/field.ts       # Task 5
src/components/topo/field.test.ts  # Task 5
src/components/topo/contours.ts    # Task 6
src/components/topo/contours.test.ts # Task 6
src/components/topo/renderer.ts    # Task 7
src/components/topo/TopoCanvas.astro # Task 7
src/components/Hero.astro          # Task 8
src/components/Section.astro       # Task 8 (reusable section shell)
src/components/Pillars.astro       # Task 8
src/pages/science.astro            # Task 9
src/pages/team.astro               # Task 9
src/pages/careers.astro            # Task 9
src/pages/contact.astro            # Task 9
```

---

### Task 1: Astro project scaffold + tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/env.d.ts`, `src/pages/index.astro` (temporary)

**Interfaces:**
- Consumes: nothing.
- Produces: a runnable Astro project with `npm run dev|build|check|test`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "morphwright-website",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@fontsource-variable/newsreader": "^5.0.0",
    "@fontsource-variable/inter": "^5.0.0",
    "@fontsource/ibm-plex-mono": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://morphwright.com',
  output: 'static',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    passWithNoTests: true,
  },
});
```

- [ ] **Step 5: Create `src/env.d.ts`**

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 6: Create temporary `src/pages/index.astro`**

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Morphwright</title>
  </head>
  <body>
    <h1>Morphwright — scaffold</h1>
  </body>
</html>
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: completes, creates `node_modules/` and `package-lock.json`, no errors.

- [ ] **Step 8: Verify build, check, and test all run**

Run: `npm run build && npm run check && npm run test`
Expected: build writes `dist/`; check reports 0 errors; vitest exits 0 ("no test files" tolerated via `passWithNoTests`). Real tests arrive in Task 4.

- [ ] **Step 9: Verify dev server serves the page**

Run: `npm run dev` (then stop it). Open `http://localhost:4321`.
Expected: page shows "Morphwright — scaffold". No console errors.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts src/env.d.ts src/pages/index.astro
git commit -m "chore: scaffold Astro project with TypeScript and Vitest"
```

---

### Task 2: Design tokens, fonts, base layout

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro` (use the layout, temporarily)

**Interfaces:**
- Consumes: Fontsource packages from Task 1.
- Produces: `BaseLayout` component — `<BaseLayout title="..." description="...">{slot}</BaseLayout>`; global CSS tokens and utility classes (`.container`, `.btn`, `.btn--accent`, `.eyebrow`, `.section`, `[data-reveal]`).

- [ ] **Step 1: Create `src/styles/global.css`**

```css
/* ---- tokens ---- */
:root {
  --ink: #0a0a0b;
  --ink-80: rgba(10, 10, 11, 0.8);
  --ink-60: rgba(10, 10, 11, 0.6);
  --ink-40: rgba(10, 10, 11, 0.4);
  --ink-15: rgba(10, 10, 11, 0.15);
  --paper: #f7f4ef;
  --paper-2: #efeae1;
  --accent: #c26b3d;
  --accent-soft: #d9a441;
  --line: rgba(10, 10, 11, 0.12);

  --font-display: 'Newsreader Variable', Georgia, 'Times New Roman', serif;
  --font-body: 'Inter Variable', system-ui, -apple-system, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', monospace;

  --step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem);
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.12rem);
  --step-1: clamp(1.2rem, 1.1rem + 0.5vw, 1.5rem);
  --step-2: clamp(1.5rem, 1.3rem + 1vw, 2.1rem);
  --step-3: clamp(2rem, 1.6rem + 2vw, 3.2rem);
  --step-4: clamp(2.6rem, 2rem + 3.4vw, 4.8rem);

  --space-s: 0.75rem;
  --space-m: 1.5rem;
  --space-l: 3rem;
  --space-xl: 6rem;

  --maxw: 72rem;
  --maxw-prose: 42rem;

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --dur: 700ms;
}

/* ---- reset ---- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  font-size: var(--step-0);
  line-height: 1.6;
  color: var(--ink);
  background: var(--paper);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg, canvas { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 500; line-height: 1.08; letter-spacing: -0.01em; }

/* ---- layout utilities ---- */
.container { width: 100%; max-width: var(--maxw); margin-inline: auto; padding-inline: var(--space-m); }
.section { padding-block: var(--space-xl); }
.prose { max-width: var(--maxw-prose); }
.eyebrow {
  font-family: var(--font-mono);
  font-size: var(--step--1);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--accent);
}

/* ---- buttons ---- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  font-size: var(--step--1);
  letter-spacing: 0.02em;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.btn:hover { background: var(--ink); color: var(--paper); }
.btn--accent { background: var(--accent); border-color: var(--accent); color: #fff; }
.btn--accent:hover { background: var(--ink); border-color: var(--ink); color: var(--paper); }
.btn--ghost { color: var(--paper); border-color: rgba(247, 244, 239, 0.5); }
.btn--ghost:hover { background: var(--paper); color: var(--ink); border-color: var(--paper); }

/* ---- scroll reveal (activated in Task 10) ---- */
[data-reveal] { opacity: 0; transform: translateY(16px); transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease); }
[data-reveal].is-visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
}

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource-variable/newsreader';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}
const { title = 'Morphwright', description = 'Morphwright designs the behavior of living cells.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="theme-color" content="#0a0a0b" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Update `src/pages/index.astro` to exercise tokens**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main class="section">
    <div class="container prose">
      <p class="eyebrow">Token check</p>
      <h1 style="font-size: var(--step-4)">Morphwright</h1>
      <p>Body copy in Inter. Warm paper background, ink text.</p>
      <p style="font-family: var(--font-mono)">mono · IBM Plex Mono</p>
      <a class="btn btn--accent" href="#">Accent button</a>
    </div>
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: build succeeds, check reports 0 errors.

- [ ] **Step 5: Visual verification**

Run: `npm run dev`, open `http://localhost:4321`.
Expected: warm ivory background, serif "Morphwright" heading, clay-amber eyebrow + button, mono line renders in IBM Plex Mono. No FOUT flash on reload. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: add design tokens, self-hosted fonts, and base layout"
```

---

### Task 3: Navigation and footer

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `BaseLayout`, global CSS.
- Produces: `<Nav />` (sticky top nav with active-page state + mobile toggle) and `<Footer />`, both rendered by `BaseLayout` around the page slot.

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
const path = Astro.url.pathname;
const links = [
  { href: '/', label: 'Home' },
  { href: '/science', label: 'Science' },
  { href: '/team', label: 'Team' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];
const isActive = (href: string) => (href === '/' ? path === '/' : path.startsWith(href));
---
<header class="nav" data-nav>
  <div class="container nav__inner">
    <a class="nav__brand" href="/">Morphwright</a>
    <button class="nav__toggle" aria-label="Toggle menu" aria-expanded="false" data-nav-toggle>
      <span></span><span></span>
    </button>
    <nav class="nav__links" aria-label="Primary">
      {links.map((l) => (
        <a href={l.href} class:list={['nav__link', { 'is-active': isActive(l.href) }]}>{l.label}</a>
      ))}
    </nav>
  </div>
</header>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--paper) 85%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  .nav__inner { display: flex; align-items: center; justify-content: space-between; height: 4rem; }
  .nav__brand { font-family: var(--font-display); font-size: var(--step-1); letter-spacing: -0.01em; }
  .nav__links { display: flex; gap: var(--space-m); }
  .nav__link {
    font-size: var(--step--1);
    letter-spacing: 0.02em;
    color: var(--ink-60);
    padding-block: 0.25rem;
    border-bottom: 1px solid transparent;
    transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
  }
  .nav__link:hover { color: var(--ink); }
  .nav__link.is-active { color: var(--ink); border-color: var(--accent); }
  .nav__toggle { display: none; flex-direction: column; gap: 5px; background: none; border: 0; cursor: pointer; padding: 8px; }
  .nav__toggle span { width: 22px; height: 1.5px; background: var(--ink); transition: transform 300ms var(--ease), opacity 300ms var(--ease); }

  @media (max-width: 640px) {
    .nav__toggle { display: flex; }
    .nav__links {
      position: absolute; inset: 4rem 0 auto 0;
      flex-direction: column; gap: 0;
      background: var(--paper); border-bottom: 1px solid var(--line);
      padding: var(--space-s) var(--space-m) var(--space-m);
      display: none;
    }
    .nav[data-open] .nav__links { display: flex; }
    .nav[data-open] .nav__toggle span:first-child { transform: translateY(6.5px) rotate(45deg); }
    .nav[data-open] .nav__toggle span:last-child { transform: translateY(-6.5px) rotate(-45deg); }
    .nav__link { padding-block: 0.75rem; }
  }
</style>

<script>
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  toggle?.addEventListener('click', () => {
    const open = nav?.toggleAttribute('data-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
</script>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container footer__inner">
    <span class="footer__brand">Morphwright</span>
    <nav class="footer__links" aria-label="Footer">
      <a href="/science">Science</a>
      <a href="/team">Team</a>
      <a href="/careers">Careers</a>
      <a href="/contact">Contact</a>
    </nav>
    <span class="footer__meta">© {year} Morphwright</span>
  </div>
</footer>

<style>
  .footer { border-top: 1px solid var(--line); padding-block: var(--space-l); margin-top: var(--space-xl); }
  .footer__inner { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-m); justify-content: space-between; }
  .footer__brand { font-family: var(--font-display); font-size: var(--step-1); }
  .footer__links { display: flex; gap: var(--space-m); }
  .footer__links a { font-size: var(--step--1); color: var(--ink-60); }
  .footer__links a:hover { color: var(--ink); }
  .footer__meta { font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-40); }
</style>
```

- [ ] **Step 3: Wire Nav + Footer into `BaseLayout.astro`**

Replace the `<body>` block in `src/layouts/BaseLayout.astro` with:

```astro
---
import '@fontsource-variable/newsreader';
import '@fontsource-variable/inter';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title?: string;
  description?: string;
}
const { title = 'Morphwright', description = 'Morphwright designs the behavior of living cells.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="theme-color" content="#0a0a0b" />
  </head>
  <body>
    <Nav />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: 0 errors.

- [ ] **Step 5: Visual verification**

Run: `npm run dev`. Open `/`. Resize the window narrow (<640px).
Expected: sticky nav with brand + 5 links, "Home" active (amber underline); footer at the bottom; below 640px the hamburger appears and toggles a stacked menu; toggling updates the icon. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: add sticky navigation with mobile toggle and footer"
```

---

### Task 4: Noise module (TDD)

**Files:**
- Create: `src/components/topo/noise.ts`, `src/components/topo/noise.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Noise3D = (x: number, y: number, z: number) => number` — returns value in `[-1, 1]`.
  - `makeNoise3D(seed: number): Noise3D`
  - `interface FbmOptions { octaves?: number; lacunarity?: number; gain?: number }`
  - `fbm(noise: Noise3D, x: number, y: number, z: number, opts?: FbmOptions): number` — returns ~`[-1, 1]`.

- [ ] **Step 1: Write the failing tests** — create `src/components/topo/noise.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { makeNoise3D, fbm } from './noise';

describe('makeNoise3D', () => {
  it('is deterministic for a given seed', () => {
    const n = makeNoise3D(42);
    expect(n(1.5, 2.5, 0.3)).toBe(n(1.5, 2.5, 0.3));
  });

  it('stays within [-1, 1]', () => {
    const n = makeNoise3D(7);
    for (let i = 0; i < 2000; i++) {
      const v = n(i * 0.37, i * 0.11 - 5, i * 0.05);
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('differs across seeds', () => {
    const a = makeNoise3D(1);
    const b = makeNoise3D(2);
    expect(a(3.3, 4.4, 1.1)).not.toBe(b(3.3, 4.4, 1.1));
  });

  it('is continuous (small input change -> small output change)', () => {
    const n = makeNoise3D(99);
    const v1 = n(10.0, 4.0, 2.0);
    const v2 = n(10.001, 4.0, 2.0);
    expect(Math.abs(v1 - v2)).toBeLessThan(0.05);
  });
});

describe('fbm', () => {
  it('stays within [-1, 1] and is deterministic', () => {
    const n = makeNoise3D(5);
    for (let i = 0; i < 1000; i++) {
      const v = fbm(n, i * 0.2, i * 0.13, i * 0.07, { octaves: 5 });
      expect(v).toBeGreaterThanOrEqual(-1);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(fbm(n, 1, 2, 3)).toBe(fbm(n, 1, 2, 3));
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/topo/noise.test.ts`
Expected: FAIL — cannot resolve `./noise` / exports undefined.

- [ ] **Step 3: Implement `src/components/topo/noise.ts`**

```ts
// Deterministic 3D value noise + fBm. No external dependencies.

function hash(ix: number, iy: number, iz: number, seed: number): number {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(iz, 2246822519) + Math.imul(seed, 3266489917)) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 1274126177) >>> 0;
  return (h >>> 0) / 4294967295; // [0, 1]
}

function smootherstep(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export type Noise3D = (x: number, y: number, z: number) => number;

// Value noise in range [-1, 1].
export function makeNoise3D(seed: number): Noise3D {
  return (x, y, z) => {
    const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
    const x1 = x0 + 1, y1 = y0 + 1, z1 = z0 + 1;
    const tx = smootherstep(x - x0);
    const ty = smootherstep(y - y0);
    const tz = smootherstep(z - z0);

    const c000 = hash(x0, y0, z0, seed);
    const c100 = hash(x1, y0, z0, seed);
    const c010 = hash(x0, y1, z0, seed);
    const c110 = hash(x1, y1, z0, seed);
    const c001 = hash(x0, y0, z1, seed);
    const c101 = hash(x1, y0, z1, seed);
    const c011 = hash(x0, y1, z1, seed);
    const c111 = hash(x1, y1, z1, seed);

    const x00 = lerp(c000, c100, tx);
    const x10 = lerp(c010, c110, tx);
    const x01 = lerp(c001, c101, tx);
    const x11 = lerp(c011, c111, tx);
    const y0v = lerp(x00, x10, ty);
    const y1v = lerp(x01, x11, ty);
    const v = lerp(y0v, y1v, tz); // [0, 1]
    return v * 2 - 1; // [-1, 1]
  };
}

export interface FbmOptions {
  octaves?: number;
  lacunarity?: number;
  gain?: number;
}

// Fractal Brownian motion. Returns ~[-1, 1].
export function fbm(noise: Noise3D, x: number, y: number, z: number, opts: FbmOptions = {}): number {
  const octaves = opts.octaves ?? 4;
  const lacunarity = opts.lacunarity ?? 2;
  const gain = opts.gain ?? 0.5;
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= gain;
    freq *= lacunarity;
  }
  return norm > 0 ? sum / norm : 0;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/topo/noise.test.ts`
Expected: PASS (all tests green).

- [ ] **Step 5: Commit**

```bash
git add src/components/topo/noise.ts src/components/topo/noise.test.ts
git commit -m "feat: add deterministic 3D value noise and fBm (tested)"
```

---

### Task 5: Height-field module (TDD)

**Files:**
- Create: `src/components/topo/field.ts`, `src/components/topo/field.test.ts`

**Interfaces:**
- Consumes: `Noise3D`, `fbm`, `FbmOptions` from `./noise`.
- Produces:
  - `interface Peak { x: number; y: number; strength: number; radius: number }` — `x`,`y` normalized `0..1`; `radius` normalized.
  - `gaussianPeak(gx: number, gy: number, cols: number, rows: number, peak: Peak): number`
  - `interface FieldOptions { cols: number; rows: number; time: number; scale: number; peak?: Peak | null; fbmOptions?: FbmOptions }`
  - `buildField(noise: Noise3D, opts: FieldOptions): Float32Array` — row-major `cols*rows`, base values normalized to `[0,1]` (peak adds on top).

- [ ] **Step 1: Write the failing tests** — create `src/components/topo/field.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { makeNoise3D } from './noise';
import { buildField, gaussianPeak, type Peak } from './field';

const peak: Peak = { x: 0.5, y: 0.5, strength: 1, radius: 0.2 };

describe('gaussianPeak', () => {
  it('is maximal at the peak center', () => {
    const center = gaussianPeak(5, 5, 11, 11, peak); // center cell of 11x11
    const off = gaussianPeak(0, 0, 11, 11, peak);
    expect(center).toBeCloseTo(1, 5);
    expect(off).toBeLessThan(center);
  });

  it('decays to near zero far from center', () => {
    const far = gaussianPeak(0, 0, 101, 101, { x: 0.5, y: 0.5, strength: 1, radius: 0.1 });
    expect(far).toBeLessThan(0.01);
  });

  it('is symmetric around the center', () => {
    const a = gaussianPeak(3, 5, 11, 11, peak);
    const b = gaussianPeak(7, 5, 11, 11, peak);
    expect(a).toBeCloseTo(b, 6);
  });
});

describe('buildField', () => {
  it('has length cols*rows and all-finite values', () => {
    const n = makeNoise3D(3);
    const f = buildField(n, { cols: 20, rows: 12, time: 1, scale: 0.1 });
    expect(f.length).toBe(20 * 12);
    expect(f.every((v) => Number.isFinite(v))).toBe(true);
  });

  it('keeps base (no-peak) values within [0, 1]', () => {
    const n = makeNoise3D(8);
    const f = buildField(n, { cols: 30, rows: 20, time: 2.5, scale: 0.08 });
    expect(Math.min(...f)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...f)).toBeLessThanOrEqual(1);
  });

  it('makes the peak-center cell the global maximum with a strong peak', () => {
    const n = makeNoise3D(8);
    const cols = 31, rows = 31;
    const f = buildField(n, { cols, rows, time: 0, scale: 0.08, peak: { x: 0.5, y: 0.5, strength: 5, radius: 0.15 } });
    const cx = Math.round(0.5 * (cols - 1));
    const cy = Math.round(0.5 * (rows - 1));
    const centerIdx = cy * cols + cx;
    let maxIdx = 0;
    for (let i = 1; i < f.length; i++) if (f[i] > f[maxIdx]) maxIdx = i;
    expect(maxIdx).toBe(centerIdx);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/topo/field.test.ts`
Expected: FAIL — cannot resolve `./field`.

- [ ] **Step 3: Implement `src/components/topo/field.ts`**

```ts
import { fbm, type Noise3D, type FbmOptions } from './noise';

export interface Peak {
  x: number;      // 0..1 across columns
  y: number;      // 0..1 across rows
  strength: number;
  radius: number; // normalized
}

// Gaussian contribution of `peak` at grid cell (gx, gy).
export function gaussianPeak(gx: number, gy: number, cols: number, rows: number, peak: Peak): number {
  const px = peak.x * (cols - 1);
  const py = peak.y * (rows - 1);
  const dx = (gx - px) / (peak.radius * cols);
  const dy = (gy - py) / (peak.radius * rows);
  return peak.strength * Math.exp(-(dx * dx + dy * dy));
}

export interface FieldOptions {
  cols: number;
  rows: number;
  time: number;
  scale: number;
  peak?: Peak | null;
  fbmOptions?: FbmOptions;
}

// Row-major cols*rows field. Base noise normalized to [0,1]; peak adds on top.
export function buildField(noise: Noise3D, opts: FieldOptions): Float32Array {
  const { cols, rows, time, scale } = opts;
  const out = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const n = fbm(noise, x * scale, y * scale, time, opts.fbmOptions); // [-1,1]
      let h = (n + 1) * 0.5; // [0,1]
      if (opts.peak) h += gaussianPeak(x, y, cols, rows, opts.peak);
      out[y * cols + x] = h;
    }
  }
  return out;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/topo/field.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/topo/field.ts src/components/topo/field.test.ts
git commit -m "feat: add evolving height field with gaussian cursor peak (tested)"
```

---

### Task 6: Contours module — marching squares (TDD)

**Files:**
- Create: `src/components/topo/contours.ts`, `src/components/topo/contours.test.ts`

**Interfaces:**
- Consumes: a row-major `Float32Array` field (from Task 5).
- Produces:
  - `interface Segment { x1: number; y1: number; x2: number; y2: number }` — coordinates in grid units (`0..cols-1`, `0..rows-1`).
  - `marchingSquares(field: Float32Array, cols: number, rows: number, threshold: number): Segment[]`
  - `contourLevels(field: Float32Array, cols: number, rows: number, levels: number[]): Segment[][]`

- [ ] **Step 1: Write the failing tests** — create `src/components/topo/contours.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { marchingSquares, contourLevels, type Segment } from './contours';

// 2x2 grid, row-major index = y*cols + x.
function grid(values: number[]): Float32Array {
  return Float32Array.from(values);
}

describe('marchingSquares', () => {
  it('returns no segments when all corners are below threshold', () => {
    const f = grid([0, 0, 0, 0]);
    expect(marchingSquares(f, 2, 2, 0.5)).toEqual([]);
  });

  it('returns no segments when all corners are above threshold', () => {
    const f = grid([1, 1, 1, 1]);
    expect(marchingSquares(f, 2, 2, 0.5)).toEqual([]);
  });

  it('isolates a single high corner with one interpolated segment', () => {
    // only bottom-left corner (x=0,y=1 -> index 2) is high
    const f = grid([0, 0, 1, 0]);
    const segs = marchingSquares(f, 2, 2, 0.5);
    expect(segs.length).toBe(1);
    const s = segs[0];
    // crossing on left edge at y=0.5 and bottom edge at x=0.5
    const pts = [
      [s.x1, s.y1],
      [s.x2, s.y2],
    ].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(pts[0][0]).toBeCloseTo(0, 6);
    expect(pts[0][1]).toBeCloseTo(0.5, 6);
    expect(pts[1][0]).toBeCloseTo(0.5, 6);
    expect(pts[1][1]).toBeCloseTo(1, 6);
  });

  it('emits two segments for a saddle (diagonal highs)', () => {
    // index = y*cols + x: [0]=tl, [1]=tr, [2]=bl, [3]=br
    // tr (index 1) and bl (index 2) high, tl and br low -> saddle (case 5)
    const saddle = grid([0, 1, 1, 0]);
    expect(marchingSquares(saddle, 2, 2, 0.5).length).toBe(2);
  });
});

describe('contourLevels', () => {
  it('maps each threshold to its own segment list', () => {
    const f = grid([0, 0, 1, 0]);
    const out = contourLevels(f, 2, 2, [0.5, 0.9]);
    expect(out.length).toBe(2);
    expect(out[0].length).toBe(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/topo/contours.test.ts`
Expected: FAIL — cannot resolve `./contours`.

- [ ] **Step 3: Implement `src/components/topo/contours.ts`**

```ts
export interface Segment {
  x1: number; y1: number; x2: number; y2: number;
}

// Interpolated crossing position where the value passes `t` between a and b.
function cross(a: number, b: number, t: number): number {
  if (a === b) return 0.5;
  return (t - a) / (b - a);
}

// Marching squares at one threshold. Corner bits: tl=8, tr=4, br=2, bl=1.
export function marchingSquares(field: Float32Array, cols: number, rows: number, threshold: number): Segment[] {
  const segs: Segment[] = [];
  const at = (x: number, y: number) => field[y * cols + x];

  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      const tl = at(x, y);
      const tr = at(x + 1, y);
      const br = at(x + 1, y + 1);
      const bl = at(x, y + 1);

      let idx = 0;
      if (tl > threshold) idx |= 8;
      if (tr > threshold) idx |= 4;
      if (br > threshold) idx |= 2;
      if (bl > threshold) idx |= 1;
      if (idx === 0 || idx === 15) continue;

      const top = { x: x + cross(tl, tr, threshold), y };
      const right = { x: x + 1, y: y + cross(tr, br, threshold) };
      const bottom = { x: x + cross(bl, br, threshold), y: y + 1 };
      const left = { x, y: y + cross(tl, bl, threshold) };

      const push = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        segs.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

      switch (idx) {
        case 1: push(left, bottom); break;
        case 2: push(bottom, right); break;
        case 3: push(left, right); break;
        case 4: push(top, right); break;
        case 5: push(top, right); push(left, bottom); break; // saddle
        case 6: push(top, bottom); break;
        case 7: push(left, top); break;
        case 8: push(left, top); break;
        case 9: push(top, bottom); break;
        case 10: push(left, top); push(bottom, right); break; // saddle
        case 11: push(top, right); break;
        case 12: push(left, right); break;
        case 13: push(bottom, right); break;
        case 14: push(left, bottom); break;
      }
    }
  }
  return segs;
}

export function contourLevels(field: Float32Array, cols: number, rows: number, levels: number[]): Segment[][] {
  return levels.map((t) => marchingSquares(field, cols, rows, t));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/topo/contours.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/topo/contours.ts src/components/topo/contours.test.ts
git commit -m "feat: add marching-squares contour extraction (tested)"
```

---

### Task 7: Canvas renderer + TopoCanvas component

**Files:**
- Create: `src/components/topo/renderer.ts`, `src/components/topo/TopoCanvas.astro`

**Interfaces:**
- Consumes: `makeNoise3D` (Task 4), `buildField` + `Peak` (Task 5), `contourLevels` (Task 6).
- Produces:
  - `interface TopoOptions { canvas: HTMLCanvasElement; cols?, rows?, levels?, speed?, scale?, seed?: number; lineColor?, bgColor?, accent?: string; reducedMotion?: boolean }`
  - `interface TopoControl { start(): void; stop(): void; destroy(): void; setPointer(nx: number | null, ny: number | null): void; resize(): void }`
  - `createTopo(opts: TopoOptions): TopoControl`
  - `<TopoCanvas />` Astro component (full-bleed `<canvas>` + lifecycle wiring).

This task is verified by integration (build, type-check, screenshot/behavior) rather than unit tests — its math dependencies are already covered by Tasks 4–6, and the canvas/DOM surface is not unit-testable without heavy mocking.

- [ ] **Step 1: Implement `src/components/topo/renderer.ts`**

```ts
import { makeNoise3D } from './noise';
import { buildField, type Peak } from './field';
import { contourLevels } from './contours';

export interface TopoOptions {
  canvas: HTMLCanvasElement;
  cols?: number;
  rows?: number;
  levels?: number;
  speed?: number;  // time units per ms
  scale?: number;  // noise frequency in grid space
  seed?: number;
  lineColor?: string;
  bgColor?: string;
  accent?: string;
  reducedMotion?: boolean;
}

export interface TopoControl {
  start(): void;
  stop(): void;
  destroy(): void;
  setPointer(nx: number | null, ny: number | null): void;
  resize(): void;
}

function hexToRgba(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function createTopo(opts: TopoOptions): TopoControl {
  const canvas = opts.canvas;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { start() {}, stop() {}, destroy() {}, setPointer() {}, resize() {} };
  }

  const cols = opts.cols ?? 96;
  const rows = opts.rows ?? 54;
  const levelCount = opts.levels ?? 14;
  const speed = opts.speed ?? 0.00006;
  const scale = opts.scale ?? 0.045;
  const lineColor = opts.lineColor ?? 'rgba(245, 245, 245, 0.5)';
  const bgColor = opts.bgColor ?? '#0a0a0b';
  const accent = opts.accent ?? '#c26b3d';
  const noise = makeNoise3D(opts.seed ?? 1337);

  const levels: number[] = [];
  for (let i = 1; i <= levelCount; i++) levels.push(i / (levelCount + 1));

  let raf = 0;
  let running = false;
  let lastT = 0;
  let time = 0;

  let targetX = 0.5, targetY = 0.5;
  let hasPointer = false;
  let peakStrength = 0;
  const maxStrength = 0.9;

  let width = 0, height = 0, dpr = 1;

  function currentPeak(): Peak | null {
    if (peakStrength < 0.001) return null;
    return { x: targetX, y: targetY, strength: peakStrength, radius: 0.16 };
  }

  function drawFrame() {
    if (!ctx) return;
    const field = buildField(noise, { cols, rows, time, scale, peak: currentPeak() });
    const cw = width / (cols - 1);
    const ch = height / (rows - 1);

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    const levelSegs = contourLevels(field, cols, rows, levels);
    for (const segs of levelSegs) {
      for (const s of segs) {
        ctx.moveTo(s.x1 * cw, s.y1 * ch);
        ctx.lineTo(s.x2 * cw, s.y2 * ch);
      }
    }
    ctx.stroke();

    if (peakStrength > 0.02) {
      const gx = targetX * width;
      const gy = targetY * height;
      const r = 0.16 * Math.min(width, height);
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
      const a = Math.min(0.5, peakStrength * 0.55);
      grad.addColorStop(0, hexToRgba(accent, a));
      grad.addColorStop(1, hexToRgba(accent, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(gx - r, gy - r, r * 2, r * 2);
    }
  }

  function frame(t: number) {
    if (!running) return;
    if (lastT === 0) lastT = t;
    const dt = Math.min(64, t - lastT);
    lastT = t;
    time += dt * speed;
    const target = hasPointer ? maxStrength : 0;
    peakStrength += (target - peakStrength) * 0.08;
    drawFrame();
    raf = requestAnimationFrame(frame);
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!running) drawFrame();
  }

  function start() {
    if (opts.reducedMotion) { drawFrame(); return; }
    if (running) return;
    running = true;
    lastT = 0;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function setPointer(nx: number | null, ny: number | null) {
    if (nx === null || ny === null) { hasPointer = false; return; }
    hasPointer = true;
    targetX = Math.min(1, Math.max(0, nx));
    targetY = Math.min(1, Math.max(0, ny));
  }

  function destroy() { stop(); }

  return { start, stop, destroy, setPointer, resize };
}
```

- [ ] **Step 2: Implement `src/components/topo/TopoCanvas.astro`**

```astro
---
// Full-bleed animated topographic background. Decorative (aria-hidden).
---
<canvas class="topo" data-topo aria-hidden="true"></canvas>

<style>
  .topo { position: absolute; inset: 0; width: 100%; height: 100%; display: block; background: var(--ink); }
</style>

<script>
  import { createTopo } from './renderer';

  const canvas = document.querySelector<HTMLCanvasElement>('canvas[data-topo]');
  if (canvas) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const topo = createTopo({ canvas, reducedMotion: reduced });
    topo.resize();

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => topo.resize(), 150);
    });

    const fine = window.matchMedia('(pointer: fine)').matches;
    if (fine && !reduced) {
      window.addEventListener('pointermove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        if (nx < 0 || nx > 1 || ny < 0 || ny > 1) topo.setPointer(null, null);
        else topo.setPointer(nx, ny);
      }, { passive: true });
    }

    if (reduced) {
      topo.start();
    } else {
      const io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) topo.start();
          else topo.stop();
        }
      }, { threshold: 0 });
      io.observe(canvas);

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) topo.stop();
        else {
          const r = canvas.getBoundingClientRect();
          if (r.bottom > 0 && r.top < window.innerHeight) topo.start();
        }
      });
    }
  }
</script>
```

- [ ] **Step 3: Temporarily mount TopoCanvas to verify it renders**

Replace `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TopoCanvas from '../components/topo/TopoCanvas.astro';
---
<BaseLayout>
  <section style="position: relative; height: 80vh;">
    <TopoCanvas />
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: 0 errors.

- [ ] **Step 5: Behavior verification**

Run: `npm run dev`. Open `/`.
Expected: a black panel filled with animated white contour lines that slowly morph; moving the cursor raises a warm amber-lit "peak" that follows the pointer and relaxes when the cursor leaves; switching browser tabs pauses it; no console errors; CPU returns to idle when the panel is scrolled away. To confirm the reduced-motion fallback, enable "reduce motion" in OS/browser settings and reload — the contours render as a single static frame.

- [ ] **Step 6: Commit**

```bash
git add src/components/topo/renderer.ts src/components/topo/TopoCanvas.astro src/pages/index.astro
git commit -m "feat: add canvas topo renderer with cursor peak and lifecycle"
```

---

### Task 8: Hero + Home page

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Section.astro`, `src/components/Pillars.astro`
- Modify: `src/pages/index.astro` (final home page)

**Interfaces:**
- Consumes: `BaseLayout`, `TopoCanvas`, global CSS.
- Produces:
  - `<Hero />` — dark full-viewport hero (TopoCanvas background + overlay wordmark/mark, slogan, CTAs, scroll cue).
  - `<Section variant="light|paper2|dark">` — reusable section shell with a `<slot />`.
  - `<Pillars />` — three-up pillar grid.

- [ ] **Step 1: Create `src/components/Section.astro`**

```astro
---
interface Props { variant?: 'light' | 'paper2' | 'dark'; id?: string; }
const { variant = 'light', id } = Astro.props;
---
<section class:list={['section', `section--${variant}`]} id={id}>
  <div class="container">
    <slot />
  </div>
</section>

<style>
  .section--light { background: var(--paper); color: var(--ink); }
  .section--paper2 { background: var(--paper-2); color: var(--ink); }
  .section--dark { background: var(--ink); color: var(--paper); }
</style>
```

- [ ] **Step 2: Create `src/components/Hero.astro`**

```astro
---
import TopoCanvas from './topo/TopoCanvas.astro';
---
<section class="hero">
  <TopoCanvas />
  <div class="hero__overlay container">
    <div class="hero__brand">
      <svg class="hero__mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 7 L41 41 H7 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M24 16 L35 37 H13 Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M24 25 L29 34 H19 Z" stroke="var(--accent)" stroke-width="1.4" stroke-linejoin="round" />
      </svg>
      <span class="hero__wordmark">Morphwright</span>
    </div>
    <h1 class="hero__headline">We engineer the behavior of living cells.</h1>
    <p class="hero__sub">
      Morphwright builds the design layer for cellular behavior — turning desired
      function into the protein circuits that produce it.
    </p>
    <div class="hero__actions">
      <a class="btn btn--accent" href="/science">See the science</a>
      <a class="btn btn--ghost" href="/contact">Get in touch</a>
    </div>
  </div>
  <a class="hero__scroll" href="#intro" aria-label="Scroll to content"><span>scroll</span></a>
</section>

<style>
  .hero { position: relative; min-height: 100svh; display: flex; align-items: center; color: var(--paper); overflow: hidden; }
  .hero__overlay { position: relative; z-index: 2; padding-block: var(--space-xl); }
  .hero__brand { display: flex; align-items: center; gap: 0.75rem; color: var(--paper); margin-bottom: var(--space-l); }
  .hero__mark { width: 40px; height: 40px; }
  .hero__wordmark { font-family: var(--font-display); font-size: var(--step-1); letter-spacing: 0.01em; }
  .hero__headline { font-size: var(--step-4); max-width: 18ch; color: #fff; }
  .hero__sub { margin-top: var(--space-m); max-width: 46ch; font-size: var(--step-1); color: rgba(247, 244, 239, 0.78); }
  .hero__actions { margin-top: var(--space-l); display: flex; flex-wrap: wrap; gap: var(--space-s); }
  .hero__scroll {
    position: absolute; left: 50%; bottom: 1.5rem; transform: translateX(-50%);
    z-index: 2; font-family: var(--font-mono); font-size: var(--step--1);
    letter-spacing: 0.2em; text-transform: uppercase; color: rgba(247, 244, 239, 0.6);
  }
  .hero__scroll::after { content: ''; display: block; width: 1px; height: 28px; margin: 6px auto 0; background: rgba(247, 244, 239, 0.4); }
</style>
```

- [ ] **Step 3: Create `src/components/Pillars.astro`**

```astro
---
const pillars = [
  { n: '01', title: 'A map of behavior', body: 'Every cellular function corresponds to a region in a vast design space. We chart it, so behavior becomes something you can specify rather than stumble upon.' },
  { n: '02', title: 'First-principles circuits', body: 'We compose protein circuits from mechanism, not trial and error — reasoning from the chemistry up to the function it should produce.' },
  { n: '03', title: 'Verified in silico', body: 'Every candidate is built, simulated, and phenotyped before it reaches the bench, so the designs we pursue are the ones that should work.' },
];
---
<div class="pillars">
  {pillars.map((p) => (
    <article class="pillar" data-reveal>
      <span class="pillar__n">{p.n}</span>
      <h3 class="pillar__title">{p.title}</h3>
      <p class="pillar__body">{p.body}</p>
    </article>
  ))}
</div>

<style>
  .pillars { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-l); }
  .pillar { border-top: 1px solid var(--line); padding-top: var(--space-m); }
  .pillar__n { font-family: var(--font-mono); font-size: var(--step--1); color: var(--accent); }
  .pillar__title { font-size: var(--step-2); margin-top: var(--space-s); }
  .pillar__body { margin-top: var(--space-s); color: var(--ink-80); }
  @media (max-width: 800px) { .pillars { grid-template-columns: 1fr; gap: var(--space-m); } }
</style>
```

- [ ] **Step 4: Write the final `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import Section from '../components/Section.astro';
import Pillars from '../components/Pillars.astro';
---
<BaseLayout title="Morphwright — designing the behavior of living cells">
  <Hero />

  <Section variant="light" id="intro">
    <div class="prose" data-reveal>
      <p class="eyebrow">What we do</p>
      <h2 style="font-size: var(--step-3); margin-top: var(--space-s);">
        Biology already computes. We give it a specification.
      </h2>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">
        Cells sense, decide, and act through networks of interacting proteins. Morphwright
        treats those networks as designable systems — mapping the behaviors they can produce
        and synthesizing the circuits that reach a target on purpose.
      </p>
    </div>
  </Section>

  <Section variant="paper2">
    <p class="eyebrow" data-reveal>How we work</p>
    <div style="margin-top: var(--space-l);">
      <Pillars />
    </div>
  </Section>

  <Section variant="dark">
    <div class="prose" data-reveal>
      <p class="eyebrow">The science</p>
      <h2 style="font-size: var(--step-3); margin-top: var(--space-s); color: #fff;">
        A design map for cellular behavior.
      </h2>
      <p style="margin-top: var(--space-m); color: rgba(247,244,239,0.78);">
        Our work starts from a simple claim: the space of behaviors a protein circuit can
        produce is finite, structured, and navigable. Read how we chart it.
      </p>
      <p style="margin-top: var(--space-l);"><a class="btn btn--ghost" href="/science">Read the science</a></p>
    </div>
  </Section>

  <Section variant="light">
    <div class="prose" data-reveal>
      <h2 style="font-size: var(--step-3);">Build life that behaves.</h2>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">
        We are a small team of scientists and engineers. If the design layer for living
        systems is the problem you want to work on, we should talk.
      </p>
      <div style="margin-top: var(--space-l); display: flex; gap: var(--space-s); flex-wrap: wrap;">
        <a class="btn btn--accent" href="/careers">See open roles</a>
        <a class="btn" href="/contact">Contact us</a>
      </div>
    </div>
  </Section>
</BaseLayout>
```

- [ ] **Step 5: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: 0 errors.

- [ ] **Step 6: Visual verification**

Run: `npm run dev`. Open `/`.
Expected: full-screen animated hero with wordmark + mark (inner triangle tinted amber), serif headline, sub copy, two CTAs, scroll cue; below it the light intro, the three pillars on paper-2, a dark science band with a ghost button, and a closing CTA. Nav sits above the hero and is legible. No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/Hero.astro src/components/Section.astro src/components/Pillars.astro src/pages/index.astro
git commit -m "feat: add hero and home page sections"
```

---

### Task 9: Science, Team, Careers, Contact pages

**Files:**
- Create: `src/pages/science.astro`, `src/pages/team.astro`, `src/pages/careers.astro`, `src/pages/contact.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `Section`, global CSS utilities.
- Produces: four routes with placeholder content; active nav state already handled by `Nav.astro`.

- [ ] **Step 1: Create `src/pages/science.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';

const steps = [
  { n: '01', t: 'Specify a behavior', d: 'Describe the function you want — a switch, a pulse, a band-pass response — in the language of dynamics, not parts.' },
  { n: '02', t: 'Search the design map', d: 'We locate the regions of circuit space whose qualitative behavior matches the specification.' },
  { n: '03', t: 'Synthesize circuits', d: 'Candidate protein circuits are assembled from mechanism, with parameters chosen to land inside the target region.' },
  { n: '04', t: 'Verify in silico', d: 'Each candidate is simulated and phenotyped, so only designs that behave as specified move forward.' },
];
---
<BaseLayout title="Science — Morphwright" description="How Morphwright designs cellular behavior from protein-circuit first principles.">
  <Section variant="light">
    <div class="prose" data-reveal>
      <p class="eyebrow">The science</p>
      <h1 style="font-size: var(--step-4); margin-top: var(--space-s);">A design map for cellular behavior.</h1>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">
        Forward engineering of biology has mostly meant building a part and seeing what it does.
        We work in the other direction: starting from a behavior and finding the circuits that
        produce it. That inversion needs a map — a structured account of what protein circuits
        can and cannot compute.
      </p>
    </div>
  </Section>

  <Section variant="paper2">
    <p class="eyebrow" data-reveal>The problem</p>
    <div class="prose" data-reveal style="margin-top: var(--space-m);">
      <p style="color: var(--ink-80);">
        A protein circuit's behavior is set by its topology and its rates. The same topology can
        produce very different functions; very different topologies can produce the same one. Without
        a map of that relationship, design stays a search in the dark.
      </p>
    </div>
  </Section>

  <Section variant="light">
    <p class="eyebrow" data-reveal>How it works</p>
    <ol class="steps" style="margin-top: var(--space-l);">
      {steps.map((s) => (
        <li class="step" data-reveal>
          <span class="step__n">{s.n}</span>
          <div>
            <h3 class="step__t">{s.t}</h3>
            <p class="step__d">{s.d}</p>
          </div>
        </li>
      ))}
    </ol>
  </Section>

  <Section variant="dark">
    <div class="prose" data-reveal>
      <h2 style="font-size: var(--step-3); color: #fff;">Scope</h2>
      <p style="margin-top: var(--space-m); color: rgba(247,244,239,0.78);">
        Our methods target protein-level circuits — sensing, signaling, and regulation that act on
        the timescale of a cell's decisions. This page is a plain-language overview; technical
        detail is available on request.
      </p>
    </div>
  </Section>

  <style>
    .steps { list-style: none; display: grid; gap: var(--space-l); padding: 0; max-width: 50rem; }
    .step { display: grid; grid-template-columns: auto 1fr; gap: var(--space-m); align-items: start; border-top: 1px solid var(--line); padding-top: var(--space-m); }
    .step__n { font-family: var(--font-mono); color: var(--accent); font-size: var(--step-1); }
    .step__t { font-size: var(--step-2); }
    .step__d { margin-top: var(--space-s); color: var(--ink-80); }
  </style>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/team.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';

const people = [
  { name: 'Founder Name', role: 'Founder & CEO', bio: 'Background placeholder — to be replaced.' },
  { name: 'Founder Name', role: 'Founder & CSO', bio: 'Background placeholder — to be replaced.' },
  { name: 'Team Member', role: 'Computational Biology', bio: 'Background placeholder — to be replaced.' },
  { name: 'Team Member', role: 'Protein Engineering', bio: 'Background placeholder — to be replaced.' },
];
const initials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
---
<BaseLayout title="Team — Morphwright" description="The people building Morphwright.">
  <Section variant="light">
    <div class="prose" data-reveal>
      <p class="eyebrow">Team</p>
      <h1 style="font-size: var(--step-4); margin-top: var(--space-s);">A small team, working from first principles.</h1>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">Placeholder introduction — replace with the real team story.</p>
    </div>
  </Section>

  <Section variant="paper2">
    <ul class="team" data-reveal>
      {people.map((p) => (
        <li class="member">
          <span class="member__avatar" aria-hidden="true">{initials(p.name)}</span>
          <h3 class="member__name">{p.name}</h3>
          <p class="member__role">{p.role}</p>
          <p class="member__bio">{p.bio}</p>
        </li>
      ))}
    </ul>
  </Section>

  <style>
    .team { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-l); }
    .member { border-top: 1px solid var(--line); padding-top: var(--space-m); }
    .member__avatar { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 50%; background: var(--ink); color: var(--paper); font-family: var(--font-mono); font-size: var(--step-0); }
    .member__name { font-size: var(--step-2); margin-top: var(--space-s); }
    .member__role { font-family: var(--font-mono); font-size: var(--step--1); color: var(--accent); }
    .member__bio { margin-top: var(--space-s); color: var(--ink-80); }
    @media (max-width: 700px) { .team { grid-template-columns: 1fr; gap: var(--space-m); } }
  </style>
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/careers.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';

const values = [
  { t: 'Rigor over hype', d: 'We would rather be right slowly than wrong quickly.' },
  { t: 'Mechanism first', d: 'We design from how things work, not from what worked last time.' },
  { t: 'Small and deep', d: 'A few people who hold the whole problem in their heads.' },
];
const roles = [
  { t: 'Computational Biologist', loc: 'Remote / On-site', d: 'Model protein-circuit dynamics and help build the design map.' },
  { t: 'Protein Engineer', loc: 'On-site', d: 'Take designed circuits from specification to the bench.' },
  { t: 'Founding Software Engineer', loc: 'Remote / On-site', d: 'Build the tools that turn behavior specifications into verified designs.' },
];
---
<BaseLayout title="Careers — Morphwright" description="Open roles at Morphwright.">
  <Section variant="light">
    <div class="prose" data-reveal>
      <p class="eyebrow">Careers</p>
      <h1 style="font-size: var(--step-4); margin-top: var(--space-s);">Help build the design layer for living systems.</h1>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">Placeholder copy — replace with the real pitch to candidates.</p>
    </div>
  </Section>

  <Section variant="paper2">
    <p class="eyebrow" data-reveal>How we work</p>
    <div class="values" data-reveal>
      {values.map((v) => (
        <div class="value"><h3 class="value__t">{v.t}</h3><p class="value__d">{v.d}</p></div>
      ))}
    </div>
  </Section>

  <Section variant="light">
    <p class="eyebrow" data-reveal>Open roles</p>
    <ul class="roles" data-reveal>
      {roles.map((r) => (
        <li class="role">
          <div>
            <h3 class="role__t">{r.t}</h3>
            <p class="role__d">{r.d}</p>
          </div>
          <div class="role__meta">
            <span class="role__loc">{r.loc}</span>
            <a class="btn btn--accent" href={`mailto:careers@morphwright.com?subject=${encodeURIComponent(r.t)}`}>Apply</a>
          </div>
        </li>
      ))}
    </ul>
  </Section>

  <style>
    .values { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-l); margin-top: var(--space-l); }
    .value { border-top: 1px solid var(--line); padding-top: var(--space-m); }
    .value__t { font-size: var(--step-1); }
    .value__d { margin-top: var(--space-s); color: var(--ink-80); }
    .roles { list-style: none; padding: 0; margin-top: var(--space-l); display: grid; gap: var(--space-m); }
    .role { display: flex; flex-wrap: wrap; gap: var(--space-m); align-items: center; justify-content: space-between; border-top: 1px solid var(--line); padding-top: var(--space-m); }
    .role__t { font-size: var(--step-2); }
    .role__d { margin-top: 0.25rem; color: var(--ink-80); max-width: 46ch; }
    .role__meta { display: flex; align-items: center; gap: var(--space-m); }
    .role__loc { font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-60); }
    @media (max-width: 800px) { .values { grid-template-columns: 1fr; gap: var(--space-m); } }
  </style>
</BaseLayout>
```

- [ ] **Step 4: Create `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Section from '../components/Section.astro';
// NOTE: the form posts to a placeholder Formspree endpoint. Replace FORM_ENDPOINT
// with a real endpoint (or wire your own handler) before launch.
const FORM_ENDPOINT = 'https://formspree.io/f/your-form-id';
---
<BaseLayout title="Contact — Morphwright" description="Get in touch with Morphwright.">
  <Section variant="light">
    <div class="prose" data-reveal>
      <p class="eyebrow">Contact</p>
      <h1 style="font-size: var(--step-4); margin-top: var(--space-s);">Let's talk.</h1>
      <p style="margin-top: var(--space-m); color: var(--ink-80);">
        Email <a style="border-bottom: 1px solid var(--accent);" href="mailto:hello@morphwright.com">hello@morphwright.com</a>,
        or use the form below.
      </p>
    </div>
  </Section>

  <Section variant="paper2">
    <form class="form" action={FORM_ENDPOINT} method="POST" data-reveal>
      <div class="field">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" required />
      </div>
      <div class="field">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div class="field">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <button class="btn btn--accent" type="submit">Send message</button>
    </form>

    <style>
      .form { max-width: 38rem; display: grid; gap: var(--space-m); }
      .field { display: grid; gap: 0.4rem; }
      .field label { font-family: var(--font-mono); font-size: var(--step--1); color: var(--ink-60); }
      .field input, .field textarea {
        font: inherit; color: var(--ink); background: var(--paper);
        border: 1px solid var(--line); border-radius: 8px; padding: 0.7rem 0.9rem;
      }
      .field input:focus, .field textarea:focus { border-color: var(--accent); outline: none; }
      .form button { justify-self: start; }
    </style>
  </Section>
</BaseLayout>
```

- [ ] **Step 5: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: 0 errors; `dist/` contains `science/`, `team/`, `careers/`, `contact/` routes.

- [ ] **Step 6: Visual verification**

Run: `npm run dev`. Visit `/science`, `/team`, `/careers`, `/contact`.
Expected: each page renders with its placeholder content, the correct nav link is active (amber underline), sections alternate light / paper-2 / dark cleanly, the contact form fields focus with an amber border. No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/science.astro src/pages/team.astro src/pages/careers.astro src/pages/contact.astro
git commit -m "feat: add science, team, careers, and contact pages"
```

---

### Task 10: Motion, accessibility, and responsive polish

**Files:**
- Modify: `src/layouts/BaseLayout.astro` (add scroll-reveal script + skip link)

**Interfaces:**
- Consumes: `[data-reveal]` elements across pages; `global.css` reveal classes (already defined in Task 2).
- Produces: an IntersectionObserver that adds `.is-visible` to `[data-reveal]` elements (gated on reduced-motion), plus a skip link.

- [ ] **Step 1: Add a skip link and reveal script to `BaseLayout.astro`**

In `src/layouts/BaseLayout.astro`, replace the `<body>` contents with:

```astro
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <Nav />
    <main id="main">
      <slot />
    </main>
    <Footer />

    <style>
      .skip-link {
        position: absolute; left: 0; top: -3rem; z-index: 100;
        background: var(--ink); color: var(--paper); padding: 0.6rem 1rem; border-radius: 0 0 8px 0;
        transition: top 200ms var(--ease);
      }
      .skip-link:focus { top: 0; }
    </style>

    <script>
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const els = document.querySelectorAll('[data-reveal]');
      if (reduce || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('is-visible'));
      } else {
        const io = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          }
        }, { threshold: 0.15 });
        els.forEach((el) => io.observe(el));
      }
    </script>
  </body>
```

- [ ] **Step 2: Verify build and type-check**

Run: `npm run build && npm run check`
Expected: 0 errors.

- [ ] **Step 3: Verification — motion, reveal, a11y, responsive**

Run: `npm run dev`.
- Scroll each page: `[data-reveal]` blocks fade/slide in once, smoothly.
- Enable OS/browser "reduce motion": reload — content is visible immediately (no transforms) and the hero is a static frame.
- Tab through the home page from the top: the skip link appears first and focuses `#main`; nav links and buttons show a visible amber focus ring.
- Resize to ~360px: nav collapses to the hamburger and toggles; pillars, team grid, values, and roles stack to one column; the hero text remains readable and the animation runs as ambient drift (no cursor peak on touch).
- Confirm no console errors on any page.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add scroll-reveal, skip link, and reduced-motion handling"
```

---

## Self-Review

**1. Spec coverage:**
- Multi-page Astro static site (5 pages) → Tasks 1, 3, 8, 9. ✓
- Anthropic-leaning aesthetic, dark hero → light body → Tasks 2, 8, `Section` variants. ✓
- Color tokens / fonts (Newsreader, Inter, IBM Plex Mono, self-hosted) → Task 2. ✓
- TopoCanvas: noise → field → contours → renderer → cursor peak → lifecycle/perf → Tasks 4, 5, 6, 7. ✓
- Performance/lifecycle (DPR cap, IntersectionObserver pause, visibility pause, reduced-motion static, debounced resize) → Tasks 7, 10. ✓
- Accessibility (focus, skip link, semantic landmarks, AA) → Tasks 2, 3, 10. ✓
- Placeholder copy, no fabricated specifics → Tasks 8, 9 (roles/team explicitly "placeholder"). ✓
- Contact form (static, mailto + form endpoint placeholder) → Task 9. ✓
- Responsive → Tasks 3, 8, 9, 10. ✓
- Deployment out of scope → not implemented (correct). ✓

**2. Placeholder scan:** No "TBD"/"implement later"/"add error handling" plan-placeholders. The Formspree endpoint and team/role copy are intentional *content* placeholders, explicitly labeled for replacement — not plan gaps.

**3. Type consistency:** `Noise3D`/`fbm`/`FbmOptions` (Task 4) consumed unchanged in Task 5; `Peak`/`buildField` (Task 5) consumed unchanged in Task 7; `Segment`/`marchingSquares`/`contourLevels` (Task 6) consumed unchanged in Task 7; `createTopo`/`TopoControl` method names (`start`/`stop`/`destroy`/`setPointer`/`resize`) match between Task 7's renderer and its component wiring. ✓
