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
