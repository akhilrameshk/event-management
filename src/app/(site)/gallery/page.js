import GalleryView from '@/views/GalleryView';
import JsonLd from '@/components/JsonLd';
import { getGallery } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbLd, galleryLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSettings();
  return pageMetadata({
    title: `Event Gallery | Wedding & Party Photos in ${s.locality}`,
    description: `Photos and videos of weddings, corporate events and parties planned by ${s.name} in ${s.locality}, ${s.region}.`,
    path: '/gallery',
  });
}

export default async function Page() {
  const [{ items, isSample }, s] = await Promise.all([getGallery(), getSettings()]);
  return (
    <>
      <JsonLd data={breadcrumbLd([['Home', '/'], ['Gallery', '/gallery']])} />
      {!isSample && <JsonLd data={galleryLd(s, items)} />}
      <GalleryView items={items} isSample={isSample} />
    </>
  );
}
