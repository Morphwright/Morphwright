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
