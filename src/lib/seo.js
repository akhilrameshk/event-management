import { toTel } from '@/config/site';

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eleganteventsalpy.com').replace(/\/$/, '');

const OG = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Elegant Events - premium event management in Alappuzha' };

// Per-page metadata: title, description, canonical URL, Open Graph and Twitter cards.
export function pageMetadata({ title, description, path = '/', absoluteTitle }) {
  const t = absoluteTitle ? { absolute: absoluteTitle } : title;
  const shown = absoluteTitle || title;
  return {
    title: t,
    description,
    alternates: { canonical: path },
    openGraph: { title: shown, description, url: path, type: 'website', siteName: 'Elegant Events', locale: 'en_IN', images: [OG] },
    twitter: { card: 'summary_large_image', title: shown, description, images: [OG.url] },
  };
}

export function businessLd(s, works = []) {
  const url = siteUrl();
  const sameAs = [s.instagram, s.facebook, s.youtube].filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${url}/#business`,
    name: s.name,
    description: s.seoDescription,
    url,
    logo: `${url}/logo.png`,
    image: `${url}/opengraph-image`,
    telephone: s.phones.map(toTel),
    ...(s.email ? { email: s.email } : {}),
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressLocality: s.locality, addressRegion: s.region, addressCountry: 'IN' },
    ...(s.geoLat && s.geoLng ? { geo: { '@type': 'GeoCoordinates', latitude: Number(s.geoLat), longitude: Number(s.geoLng) } } : {}),
    ...(s.hours ? { openingHours: s.hours } : {}),
    areaServed: [s.locality, s.region].filter(Boolean).map((n) => ({ '@type': 'Place', name: n })),
    ...(sameAs.length ? { sameAs } : {}),
    ...(s.mapsUrl ? { hasMap: s.mapsUrl } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Event management services',
      itemListElement: works.map((w) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: w.title, description: w.text || undefined } })),
    },
  };
}

export function websiteLd(s) {
  const url = siteUrl();
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${url}/#website`, name: s.name, url, inLanguage: 'en-IN' };
}

export function breadcrumbLd(items) {
  const url = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], k) => ({ '@type': 'ListItem', position: k + 1, name, item: `${url}${path}` })),
  };
}

export function worksLd(s, works) {
  const url = siteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: works.map((w, k) => ({
      '@type': 'ListItem', position: k + 1,
      item: { '@type': 'Service', name: w.title, description: w.text || undefined, serviceType: 'Event management', areaServed: s.locality, provider: { '@id': `${url}/#business` } },
    })),
  };
}

export function galleryLd(s, items) {
  const url = siteUrl();
  const abs = (u) => (u && u.startsWith('http') ? u : `${url}${u}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `${s.name} event gallery`,
    url: `${url}/gallery`,
    image: items.filter((i) => i.type === 'photo' && i.src).slice(0, 30).map((i) => ({
      '@type': 'ImageObject',
      name: i.title,
      contentUrl: abs(i.src),
      thumbnailUrl: abs(i.thumb || i.src),
      creditText: s.name,
      creator: { '@type': 'Organization', name: s.name },
      copyrightNotice: i.copyrightOwner || `© ${s.name}`,
    })),
  };
}
