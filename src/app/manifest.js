export default function manifest() {
  return {
    name: 'Elegant Events',
    short_name: 'Elegant Events',
    description: 'Premium event management in Alappuzha, Kerala',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0c',
    theme_color: '#0a0a0c',
    icons: [{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  };
}
