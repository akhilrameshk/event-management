import AboutView from '@/views/AboutView';
import JsonLd from '@/components/JsonLd';
import { getSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSettings();
  return pageMetadata({
    title: `About ${s.name} | Event Planners in ${s.locality}, ${s.region}`,
    description: `Meet ${s.name}, an event management company in ${s.locality}, ${s.region}. Our story, values and the team behind every celebration.`,
    path: '/about',
  });
}

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbLd([['Home', '/'], ['About', '/about']])} />
      <AboutView />
    </>
  );
}
