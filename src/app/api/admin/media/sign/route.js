import { NextResponse } from 'next/server';
import { cld, cloudinaryReady, UPLOAD_FOLDER, ALLOWED_FORMATS } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Step 1 of an upload: the browser asks for a signature, then uploads the file straight to Cloudinary
// (so large videos never pass through this server).
export async function POST() {
  if (!cloudinaryReady()) {
    return NextResponse.json({ error: 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local' }, { status: 400 });
  }
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, folder: UPLOAD_FOLDER, type: 'authenticated', allowed_formats: ALLOWED_FORMATS };
  const signature = cld().utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp, signature, folder: UPLOAD_FOLDER, type: 'authenticated', allowedFormats: ALLOWED_FORMATS,
  });
}
