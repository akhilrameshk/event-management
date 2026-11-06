import WorksView from '@/views/WorksView';
import JsonLd from '@/components/JsonLd';
import { getWorks } from '@/lib/content';
import { getSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbLd, worksLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata() {
  const s = await getSettings();
  return pageMetadata({
    title: `Our Works | Wedding, Corporate & Party Event Planning in ${s.locality}`,
    description: `Explore the event management services of ${s.name} in ${s.locality}, ${s.region}: weddings, corporate events, birthday parties, stage decor, sound and lighting, and brand launches.`,
    path: '/our-works',
  });
}

export default async function Page() {
  const [works, s] = await Promise.all([getWorks(), getSettings()]);
  return (
    <>
      <JsonLd data={breadcrumbLd([['Home', '/'], ['Our Works', '/our-works']])} />
      <JsonLd data={worksLd(s, works)} />
      <WorksView works={works} />
    </>
  );
}
