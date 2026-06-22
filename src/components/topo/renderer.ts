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
  const lineColor = opts.lineColor ?? 'rgba(247, 244, 239, 0.5)';
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
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
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
