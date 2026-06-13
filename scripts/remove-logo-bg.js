const sharp = require("sharp");

const SRC = "public/nutrivendo-logo.jpeg";
const OUT = "public/nutrivendo-logo.png";

// Pixels brighter than this (and low chroma) are candidate background.
const WHITE_MIN = 235; // start of the soft edge ramp
const WHITE_FULL = 250; // fully-background above this

(async () => {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const idx = (x, y) => (y * w + x) * channels;

  const isWhitish = (x, y) => {
    const i = idx(x, y);
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // near-white = bright and low chroma
    return min >= WHITE_MIN && max - min <= 18;
  };

  // Flood fill from every border pixel through connected whitish region.
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (bg[p]) return;
    if (!isWhitish(x, y)) return;
    bg[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p / w) | 0;
    push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
  }

  // Apply alpha: background -> 0. Soft ramp on letter edges that border bg.
  let cleared = 0;
  for (let p = 0; p < w * h; p++) {
    const i = p * channels;
    if (bg[p]) {
      data[i + 3] = 0;
      cleared++;
      continue;
    }
    // Anti-alias: if this kept pixel is brightish AND touches a bg pixel,
    // fade its alpha by how white it is, smoothing the cut edge.
    const x = p % w, y = (p / w) | 0;
    const touchesBg =
      (x > 0 && bg[p - 1]) || (x < w - 1 && bg[p + 1]) ||
      (y > 0 && bg[p - w]) || (y < h - 1 && bg[p + w]);
    if (touchesBg) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const lum = (r + g + b) / 3;
      if (lum > WHITE_MIN) {
        const t = Math.min(1, (lum - WHITE_MIN) / (WHITE_FULL - WHITE_MIN));
        data[i + 3] = Math.round(255 * (1 - t));
      }
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels } })
    .png()
    .toFile(OUT);

  console.log(
    `Cleared ${cleared} / ${w * h} px (${((cleared / (w * h)) * 100).toFixed(1)}%) -> ${OUT}`
  );
})();
