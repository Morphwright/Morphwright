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
    const out = contourLevels(f, 2, 2, [0.5, 1.5]);
    expect(out.length).toBe(2);
    expect(out[0].length).toBe(1);
    expect(out[1].length).toBe(0);
  });
});
