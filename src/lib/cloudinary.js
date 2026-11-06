import { v2 as cloudinary } from 'cloudinary';

export const UPLOAD_FOLDER = 'elegant-events';
export const ALLOWED_FORMATS = 'jpg,jpeg,png,webp,avif,mp4,webm,mov';

export const cloudinaryReady = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let configured = false;
export function cld() {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

// Tiled diagonal watermark text drawn by Cloudinary on the delivered copy.
// (If the tiling looks different on your account, adjust here.)
const watermark = (text, size) => [
  { overlay: { font_family: 'Arial', font_size: size, font_weight: 'bold', text }, color: '#ffffff', opacity: 35, angle: -28 },
  { flags: ['layer_apply', 'tiled'] },
];

// Originals are uploaded as type "authenticated": they cannot be opened without a signed URL.
// The URLs built here are signed for ONE specific transformation (resize + watermark),
// so nobody can edit the URL to get the original or remove the watermark.
export function mediaUrls(m) {
  if (!cloudinaryReady() || !m?.cloudinaryId) return { src: null, thumb: null, poster: null };
  const c = cld();
  const owner = String(m.copyrightOwner || '© Elegant Events').replace(/^©\s*/, '').toUpperCase();
  const text = `© ${owner}`;
  const wm = m.watermarked !== false;
  const base = { type: 'authenticated', sign_url: true, secure: true };

  if (m.resourceType === 'video') {
    const src = c.url(m.cloudinaryId, { ...base, resource_type: 'video', format: 'mp4', transformation: [{ width: 1280, crop: 'limit' }, ...(wm ? watermark(text, 36) : []), { quality: 'auto' }] });
    const poster = c.url(m.cloudinaryId, { ...base, resource_type: 'video', format: 'jpg', transformation: [{ start_offset: '1' }, { width: 800, crop: 'limit' }, ...(wm ? watermark(text, 20) : []), { quality: 'auto' }] });
    return { src, thumb: poster, poster };
  }
  const img = (w, size) => c.url(m.cloudinaryId, { ...base, resource_type: 'image', transformation: [{ width: w, crop: 'limit' }, ...(wm ? watermark(text, size) : []), { quality: 'auto', fetch_format: 'auto' }] });
  return { src: img(1600, 42), thumb: img(800, 22), poster: null };
}
