import { siteUrl } from '@/lib/seo';
import { getGallery } from '@/lib/content';

export const revalidate = 3600;

export default async function sitemap() {
  const base = siteUrl();
  const now = new Date();
  const gallery = await getGallery();
  const images = gallery.isSample
    ? []
    : gallery.items.filter((i) => i.type === 'photo').slice(0, 50).filter((i) => i.src).map((i) => (i.src.startsWith('http') ? i.src : `${base}${i.src}`));
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/our-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.8, images },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];
}
