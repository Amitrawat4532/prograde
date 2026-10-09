/**
 * A tiny, real colour pipeline used to preview each LUT pack on actual pixels.
 * Runs once per image on a canvas (never per frame), so the before/after
 * slider only moves a clip-path.
 */

export type RGB = [number, number, number];

export type Grade = {
  exposure: number; // linear multiplier
  contrast: number; // around a 0.45 pivot
  saturation: number;
  lift: RGB; // added to shadows
  gain: RGB; // multiplies highlights
  shadowTint: RGB; // split-tone, weighted to shadows
  highlightTint: RGB; // split-tone, weighted to highlights
  fade: number; // black-level lift, filmic
};

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Builds a 3-channel × 256 lookup for the tonal part, then applies saturation per pixel. */
function buildCurves(g: Grade) {
  const curves = [new Float32Array(256), new Float32Array(256), new Float32Array(256)];
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    for (let c = 0; c < 3; c++) {
      let v = x * g.exposure;
      v = (v - 0.45) * g.contrast + 0.45;
      // soft filmic shoulder
      v = v > 0.8 ? 0.8 + (v - 0.8) / (1 + (v - 0.8) * 2.2) : v;
      const shadowW = (1 - x) * (1 - x);
      const highW = x * x;
      v = v * (1 - shadowW) * g.gain[c] + v * shadowW;
      v += g.lift[c] * shadowW;
      v += g.shadowTint[c] * shadowW + g.highlightTint[c] * highW;
      v = g.fade + v * (1 - g.fade);
      curves[c][i] = clamp(v);
    }
  }
  return curves;
}

export function applyGrade(src: ImageData, g: Grade): ImageData {
  const out = new ImageData(src.width, src.height);
  const s = src.data;
  const d = out.data;
  const [cr, cg, cb] = buildCurves(g);
  const sat = g.saturation;
  for (let i = 0; i < s.length; i += 4) {
    const r = cr[s[i]];
    const gg = cg[s[i + 1]];
    const b = cb[s[i + 2]];
    const l = r * 0.2126 + gg * 0.7152 + b * 0.0722;
    d[i] = clamp(l + (r - l) * sat) * 255;
    d[i + 1] = clamp(l + (gg - l) * sat) * 255;
    d[i + 2] = clamp(l + (b - l) * sat) * 255;
    d[i + 3] = 255;
  }
  return out;
}
