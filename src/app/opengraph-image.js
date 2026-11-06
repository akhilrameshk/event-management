import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Elegant Events - premium event management in Alappuzha';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Shared social preview image (WhatsApp, Facebook, X, LinkedIn).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0a0a0c,#1a1610)', color: '#f1d98a', border: '12px solid #b8892b' }}>
        <div style={{ fontSize: 28, letterSpacing: 12, color: '#f8eedd' }}>PREMIUM EVENT MANAGEMENT</div>
        <div style={{ fontSize: 110, marginTop: 24, letterSpacing: 6 }}>ELEGANT EVENTS</div>
        <div style={{ fontSize: 34, marginTop: 28, color: '#f8eedd' }}>Weddings · Corporate · Parties · Launches</div>
        <div style={{ fontSize: 30, marginTop: 40, letterSpacing: 4 }}>ALAPPUZHA, KERALA</div>
      </div>
    ),
    size
  );
}
