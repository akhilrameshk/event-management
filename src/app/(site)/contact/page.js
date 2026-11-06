import ContactView from '@/views/ContactView';
import JsonLd from '@/components/JsonLd';
import { getWorks } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSettings();
  return pageMetadata({
    title: `Contact ${s.name} | Book Your Event in ${s.locality}`,
    description: `Call or WhatsApp ${s.name} on ${s.phones.join(' / ')} to plan your wedding, corporate event or party in ${s.locality}, ${s.region}.`,
    path: '/contact',
  });
}

export default async function Page() {
  const works = await getWorks();
  return (
    <>
      <JsonLd data={breadcrumbLd([['Home', '/'], ['Contact', '/contact']])} />
      <ContactView workTitles={works.map((w) => w.title)} />
    </>
  );
}
