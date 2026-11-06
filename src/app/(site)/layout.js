import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import MobileBottomBar from '@/components/MobileBottomBar';
import { SiteProvider } from '@/components/SiteProvider';
import JsonLd from '@/components/JsonLd';
import { getSettings } from '@/lib/settings';
import { getWorks } from '@/lib/content';
import { businessLd, websiteLd } from '@/lib/seo';

export default async function SiteLayout({ children }) {
  const [settings, works] = await Promise.all([getSettings(), getWorks()]);
  return (
    <SiteProvider settings={settings}>
      <JsonLd data={businessLd(settings, works)} />
      <JsonLd data={websiteLd(settings)} />
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingActions />
      <MobileBottomBar />
    </SiteProvider>
  );
}
