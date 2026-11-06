import sharp from 'sharp';

const clean = (s) => String(s).replace(/[<>&"']/g, '');

// Diagonal repeating watermark text drawn as an SVG overlay.
export function watermarkSvg(w, h, text) {
  const size = Math.max(16, Math.round(Math.min(w, h) / 28));
  const tw = Math.round(text.length * size * 0.7 + size * 3);
  const th = Math.round(size * 5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><pattern id="p" width="${tw}" height="${th}" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)"><text x="0" y="${size}" font-family="DejaVu Sans, Arial, sans-serif" font-size="${size}" letter-spacing="2" fill="#ffffff" fill-opacity="0.32" stroke="#000000" stroke-opacity="0.18" stroke-width="1">${clean(text)}</text></pattern></defs><rect width="${w}" height="${h}" fill="url(#p)"/></svg>`;
}

// Makes the public copy: resized, optional watermark, copyright written into the file metadata.
export async function protectedJpeg(input, { max, owner, watermark }) {
  const base = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .toBuffer({ resolveWithObject: true });
  let img = sharp(base.data);
  if (watermark) {
    const text = `© ${String(owner).replace(/^©\s*/, '')}`.toUpperCase();
    img = img.composite([{ input: Buffer.from(watermarkSvg(base.info.width, base.info.height, text)) }]);
  }
  const buf = await img
    .jpeg({ quality: max > 1000 ? 82 : 78, mozjpeg: true })
    .withExif({ IFD0: { Copyright: String(owner), Artist: String(owner) } })
    .toBuffer();
  return { buf, width: base.info.width, height: base.info.height };
}
