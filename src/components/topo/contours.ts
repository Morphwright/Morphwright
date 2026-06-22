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
