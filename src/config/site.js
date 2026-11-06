// Defaults used until the admin saves real values in Admin > Settings.
export const DEFAULT_SETTINGS = {
  name: 'Elegant Events',
  tagline: 'Where Every Celebration Becomes a Masterpiece',
  phones: ['80899 57801', '98956 96947'],
  whatsapp: '918089957801',
  address: 'Opp. B60 Fitness, Stadium Ward, Alappuzha',
  locality: 'Alappuzha',
  region: 'Kerala',
  website: 'www.eleganteventsalpy.com',
  email: 'eleganteventsalpy@gmail.com',
  instagram: 'https://www.instagram.com/elegantevents.in',
  facebook: '',
  youtube: '',
  mapsUrl: '',
  geoLat: '',
  geoLng: '',
  hours: '',
  seoTitle: 'Event Management in Alappuzha | Weddings, Corporate Events & Parties',
  seoDescription:
    'Elegant Events is a premium event management company in Alappuzha, Kerala. Weddings, corporate events, birthday parties, stage decor, sound & lighting and brand launches.',
  seoKeywords:
    'event management Alappuzha, wedding planners Alappuzha, event planners Kerala, stage decoration Alappuzha, corporate events Kerala, birthday party organisers Alappuzha, sound and lighting Alappuzha',
  defaultTheme: 'royal',
};

export const SETTING_KEYS = Object.keys(DEFAULT_SETTINGS);

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Our Works', href: '/our-works' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const CATEGORIES = ['Weddings', 'Corporate', 'Birthdays', 'Decor', 'Lighting', 'Launches'];

// Default works shown until works are added in Admin > Our Works.
export const DEFAULT_WORKS = [
  { title: 'Weddings', img: 0, text: 'Grand mandaps, floral artistry and flawless guest experiences for the most important day of your life.', points: ['Stage & mandap décor', 'Floral & lighting design', 'Full-day coordination'] },
  { title: 'Corporate Events', img: 1, text: 'Conferences, award nights and product showcases delivered with precision and polish.', points: ['Stage, screens & AV', 'Branding & signage', 'Guest management'] },
  { title: 'Birthday & Private Parties', img: 2, text: 'Milestone celebrations styled with theme décor, balloons and unforgettable entertainment.', points: ['Theme & balloon décor', 'Entertainment & emcee', 'Cake & catering support'] },
  { title: 'Stage & Decor', img: 3, text: 'Statement backdrops and bespoke décor that transform any venue into a showpiece.', points: ['Custom backdrops', 'Entrance & photo zones', 'Floral installations'] },
  { title: 'Sound & Lighting', img: 4, text: 'Concert-grade sound and cinematic lighting to set the perfect mood.', points: ['Line-array sound', 'Intelligent lighting', 'LED walls & effects'] },
  { title: 'Brand Launches', img: 5, text: 'Launch moments built to impress, from reveal to red carpet.', points: ['Reveal staging', 'Red carpet & media', 'Influencer hosting'] },
];

export const toTel = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  return d.length === 10 ? `+91${d}` : `+${d}`;
};

export const makeWaLink = (whatsapp, text) =>
  `https://wa.me/${whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
