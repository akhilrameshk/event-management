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

// ---------- Editable page content (Admin > Pages). Used until the admin saves something. ----------
export const DEFAULT_CONTENT = {
  home: {
    heroImage: '', // Media id. Empty = built-in sample image
    aboutTitle: 'Event Management Company in Alappuzha',
    aboutText:
      'Elegant Events plans weddings, corporate events, birthday parties and brand launches across Alappuzha and Kerala. Every celebration is designed around you, from the first idea to the last guest leaving happy.',
    aboutPoints: ['Personalised concepts for every client', 'End-to-end planning and execution', 'Premium décor, sound and lighting'],
    aboutImage1: '',
    aboutImage2: '',
  },
  about: {
    introTitle: 'A Legacy of Elegance, One Celebration at a Time',
    introText:
      'Elegant Events is an event management company in Alappuzha, Kerala. We plan and style weddings, corporate events, parties and launches with careful design, premium décor and calm, reliable execution.',
    introImage: '',
    storyTitle: 'From a Passion to a Premier Name',
    storyText:
      'We began with a simple belief: every celebration deserves to feel extraordinary. Today our team brings planning, décor, sound and lighting together under one roof, so every detail of your event works as one.',
    stats: [], // [{ value: '500+', label: 'Events' }] shown only when added
    values: [
      { title: 'Excellence', text: 'Every detail is refined until it meets our standard.' },
      { title: 'Trust', text: 'Transparent planning, honest budgets, reliable delivery.' },
      { title: 'Passion', text: 'We celebrate your moments as if they were our own.' },
    ],
  },
};

function mergeSection(def, val) {
  const out = {};
  for (const k of Object.keys(def)) {
    const v = val ? val[k] : undefined;
    if (v === undefined || v === null) out[k] = def[k];
    else if (typeof def[k] === 'string' && def[k] !== '' && v === '') out[k] = def[k];
    else out[k] = v;
  }
  return out;
}

export const mergeContent = (data = {}) => ({
  home: mergeSection(DEFAULT_CONTENT.home, data.home),
  about: mergeSection(DEFAULT_CONTENT.about, data.about),
});

const str = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const mid = (v) => (/^[a-f0-9]{24}$/i.test(String(v || '')) ? String(v) : '');
const list = (v, n, max = 160) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((x) => str(x, max)).filter(Boolean).slice(0, n);

// Cleans what the admin form sends before it is saved.
export function sanitizeContent(b = {}) {
  const h = b.home || {};
  const a = b.about || {};
  return {
    home: {
      heroImage: mid(h.heroImage), aboutTitle: str(h.aboutTitle, 120), aboutText: str(h.aboutText, 1200),
      aboutPoints: list(h.aboutPoints, 8), aboutImage1: mid(h.aboutImage1), aboutImage2: mid(h.aboutImage2),
    },
    about: {
      introTitle: str(a.introTitle, 140), introText: str(a.introText, 1200), introImage: mid(a.introImage),
      storyTitle: str(a.storyTitle, 120), storyText: str(a.storyText, 2400),
      stats: (Array.isArray(a.stats) ? a.stats : []).map((s) => ({ value: str(s?.value, 16), label: str(s?.label, 40) })).filter((s) => s.value && s.label).slice(0, 6),
      values: (Array.isArray(a.values) ? a.values : []).map((s) => ({ title: str(s?.title, 40), text: str(s?.text, 200) })).filter((s) => s.title).slice(0, 6),
    },
  };
}
