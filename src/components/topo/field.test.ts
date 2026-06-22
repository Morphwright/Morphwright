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
