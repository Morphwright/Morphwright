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
