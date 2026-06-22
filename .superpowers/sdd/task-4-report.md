# Task 4 Report — Noise Module

## What was implemented

Created two files under `src/components/topo/`:

- **`noise.ts`** — hand-rolled deterministic 3D value noise and fBm. No external dependencies.
  - `hash(ix, iy, iz, seed)` — integer lattice hash via `Math.imul` Murmur-style mixing, result in [0,1].
  - `smootherstep(t)` — 6t^5−15t^4+10t^3 C2-smooth interpolant.
  - `lerp(a, b, t)` — linear interpolation.
  - `makeNoise3D(seed): Noise3D` — trilinear value noise, returns [-1,1].
  - `fbm(noise, x, y, z, opts?): number` — fractal Brownian motion (octaves, lacunarity, gain), normalized to [-1,1] via accumulated amplitude.
  - Exports: `Noise3D` type, `makeNoise3D`, `FbmOptions` interface, `fbm`.

- **`noise.test.ts`** — 5 Vitest tests covering determinism, range, seed independence, continuity, and fBm.

## TDD Trace

### RED — failing test run

Command: `npx vitest run src/components/topo/noise.test.ts`

```
 RUN  v2.1.9 /Users/yanzhang/git/Morphwright

 ❯ src/components/topo/noise.test.ts (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/components/topo/noise.test.ts [ src/components/topo/noise.test.ts ]
Error: Failed to load url ./noise (resolved id: ./noise) in /Users/yanzhang/git/Morphwright/src/components/topo/noise.test.ts. Does the file exist?
 ❯ loadAndTransform node_modules/vitest/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:51969:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  no tests
   Start at  18:29:01
   Duration  218ms
```

### GREEN — passing test run

Command: `npx vitest run src/components/topo/noise.test.ts`

```
 RUN  v2.1.9 /Users/yanzhang/git/Morphwright

 ✓ src/components/topo/noise.test.ts (5 tests) 22ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  18:29:18
   Duration  248ms
```

## Verification

### `npm run build`

```
18:29:22 [build] 1 page(s) built in 278ms
18:29:22 [build] Complete!
```

### `npm run check`

```
Result (10 files): 
- 0 errors
- 0 warnings
- 0 hints
```

## Files changed

- `src/components/topo/noise.ts` (created)
- `src/components/topo/noise.test.ts` (created)

## Version substitution

None. All code taken verbatim from the brief.

## Concerns

None.

---

## Fix round

**Findings addressed:**
- `noise.test.ts:7` — Tautology in determinism test: `expect(n(1.5, 2.5, 0.3)).toBe(n(1.5, 2.5, 0.3))` called the same closure twice, trivially true. Fixed to create two separate instances `n1 = makeNoise3D(42)` and `n2 = makeNoise3D(42)` and compare their outputs.
- `noise.test.ts:41` — Same tautology in fbm test: `expect(fbm(n, 1, 2, 3)).toBe(fbm(n, 1, 2, 3))` trivially true. Fixed to evaluate fbm through two separately constructed noise instances `n3 = makeNoise3D(5)` and `n4 = makeNoise3D(5)` sharing the same seed.

### `npx vitest run src/components/topo/noise.test.ts`

```
 RUN  v2.1.9 /Users/yanzhang/git/Morphwright

 ✓ src/components/topo/noise.test.ts (5 tests) 22ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  18:32:15
   Duration  244ms
```

### `npm run build`

```
18:32:19 [build] 1 page(s) built in 245ms
18:32:19 [build] Complete!
```

### `npm run check`

```
Result (10 files): 
- 0 errors
- 0 warnings
- 0 hints
```

---

## Fix round 2

**Finding addressed:**

The review identified that the TDD GREEN gate was not a real gate. Both determinism tests in the original `noise.test.ts` (commit 1e08ed3, bundled with the implementation) used tautological assertions:

- `makeNoise3D` test (line 7): `expect(n(1.5, 2.5, 0.3)).toBe(n(1.5, 2.5, 0.3))` — called the same closure twice in the same expression. For any pure function this is trivially equal; the test cannot catch an implementation backed by `Math.random()` or mutable state.
- `fbm` test (line 41): `expect(fbm(n, 1, 2, 3)).toBe(fbm(n, 1, 2, 3))` — called `fbm` twice with the same stateless noise instance. Again trivially true for any deterministic or non-deterministic `fbm`.

The GREEN run recorded in the original report passed these tautological tests and cannot be trusted as a real TDD gate. The TDD sequence was therefore broken: a meaningful determinism test did not exist before the implementation was committed.

Commit 928dfe1 corrected both assertions (two independently-constructed noise instances from the same seed, compared by output). This fix round re-runs the corrected tests to record a valid GREEN gate against the non-tautological assertions.

**No code changes required in this round** — 928dfe1 already fixed the test code. The implementation (`noise.ts`) is unchanged. This round documents that the corrected tests pass and constitutes the legitimate re-validation of the GREEN phase.

### `npx vitest run src/components/topo/noise.test.ts`

```
 RUN  v2.1.9 /Users/yanzhang/git/Morphwright

 ✓ src/components/topo/noise.test.ts (5 tests) 22ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  18:35:57
   Duration  241ms (transform 20ms, setup 0ms, collect 15ms, tests 22ms, environment 0ms, prepare 41ms)
```

Both corrected determinism assertions pass. The `makeNoise3D` test now creates `n1 = makeNoise3D(42)` and `n2 = makeNoise3D(42)` as separate closures and verifies `n1(1.5, 2.5, 0.3) === n2(1.5, 2.5, 0.3)`. The `fbm` test creates `n3 = makeNoise3D(5)` and `n4 = makeNoise3D(5)` separately and verifies `fbm(n3, 1, 2, 3) === fbm(n4, 1, 2, 3)`. Any implementation using `Math.random()` or mutable seed state would fail both assertions; the implementation passes because `hash()` is a pure, seed-parameterised function with no side effects.

### `npm run build`

```
18:36:01 [build] 1 page(s) built in 256ms
18:36:01 [build] Complete!
```

### `npm run check`

```
Result (10 files): 
- 0 errors
- 0 warnings
- 0 hints
```
