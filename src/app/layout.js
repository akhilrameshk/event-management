import { Lora, Poppins } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import AppThemeProvider from '@/theme/ThemeContext';
import BrandLoader from '@/components/BrandLoader';
import BootGate from '@/components/BootGate';
import './globals.css';
import { getSettings } from '@/lib/settings';
import { siteUrl } from '@/lib/seo';

const lora = Lora({ subsets: ['latin'], variable: '--font-lora', display: 'swap' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-poppins', display: 'swap' });

export async function generateMetadata() {
  const s = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: s.seoTitle, template: `%s | ${s.name}` },
    description: s.seoDescription,
    keywords: s.seoKeywords,
    applicationName: s.name,
    authors: [{ name: s.name }],
    creator: s.name,
    publisher: s.name,
    category: 'Event management',
    formatDetection: { telephone: true, address: true, email: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: { type: 'website', siteName: s.name, locale: 'en_IN' },
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    other: { 'geo.region': 'IN-KL', 'geo.placename': s.locality },
  };
}

export const viewport = { themeColor: '#0a0a0c', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }) {
  const s = await getSettings();
  return (
    <html lang="en-IN" className={`${lora.variable} ${poppins.variable}`}>
      <body>
        <BrandLoader id="ee-boot" />
        <noscript><style>{'#ee-boot{display:none}'}</style></noscript>
        <AppRouterCacheProvider>
          <AppThemeProvider defaultMode={s.defaultTheme}>
            <BootGate />
            {children}
          </AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
