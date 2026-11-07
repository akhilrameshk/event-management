import HomeView from '@/views/HomeView';
import { getWorks, getFeatured, getContent, getTestimonials } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSettings();
  return pageMetadata({ absoluteTitle: s.seoTitle, description: s.seoDescription, path: '/' });
}

export default async function Page() {
  const [works, featured, content, testimonials] = await Promise.all([getWorks(), getFeatured(), getContent(), getTestimonials()]);
  return <HomeView works={works} featured={featured} content={content} testimonials={testimonials} />;
}
