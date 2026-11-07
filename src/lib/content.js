import { connectDB } from './db';
import Media from '@/models/Media';
import Work from '@/models/Work';
import mongoose from 'mongoose';
import Setting from '@/models/Setting';
import Team from '@/models/Team';
import Testimonial from '@/models/Testimonial';
import { DEFAULT_WORKS, mergeContent } from '@/config/site';
import { mediaUrls } from './cloudinary';

const SAMPLE_GALLERY = [
  [320, 'Weddings'], [440, 'Corporate'], [280, 'Birthdays'], [400, 'Decor'], [360, 'Lighting'], [300, 'Corporate'], [460, 'Weddings'],
  [340, 'Corporate'], [280, 'Birthdays'], [420, 'Decor'], [320, 'Decor'], [380, 'Corporate'], [300, 'Weddings'], [440, 'Corporate'],
];

export const serializeMedia = (m) => {
  const u = mediaUrls(m);
  return {
    id: String(m._id),
    title: m.title,
    type: m.type,
    category: m.category,
    eventDate: m.eventDate ? new Date(m.eventDate).toISOString().slice(0, 10) : '',
    visible: m.visible !== false,
    featured: !!m.featured,
    width: m.width || null,
    height: m.height || null,
    duration: m.duration || null,
    copyrightOwner: m.copyrightOwner,
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : '',
    src: u.src,
    thumb: u.thumb,
    poster: u.poster,
  };
};

export const serializeWork = (w) => {
  // coverMedia is a populated Media document when loaded with .populate('coverMedia')
  const cm = w.coverMedia && typeof w.coverMedia === 'object' && w.coverMedia.cloudinaryId ? w.coverMedia : null;
  return {
    id: String(w._id),
    title: w.title,
    slug: w.slug,
    description: w.description || '',
    points: w.points || [],
    coverMedia: w.coverMedia ? String(cm ? cm._id : w.coverMedia) : null,
    coverThumb: cm ? mediaUrls(cm).thumb : null,
    visible: w.visible !== false,
    order: w.order || 0,
  };
};

export async function getWorks() {
  try {
    await connectDB();
    const docs = await Work.find({ visible: true }).sort({ order: 1, createdAt: 1 }).populate('coverMedia').lean();
    if (docs.length) {
      return docs.map((w, k) => ({
        id: String(w._id), slug: w.slug, title: w.title, text: w.description || '', points: w.points || [],
        src: w.coverMedia && w.coverMedia.cloudinaryId ? mediaUrls(w.coverMedia).src : null, img: k % 6,
      }));
    }
  } catch { /* fall through to defaults */ }
  return DEFAULT_WORKS.map((w, k) => ({ id: `default-${k}`, slug: null, title: w.title, text: w.text, points: w.points, src: null, img: w.img }));
}

// Gallery items. When nothing is uploaded yet, sample items are returned so the page is never empty.
export async function getGallery() {
  try {
    await connectDB();
    const docs = await Media.find({ visible: true }).sort({ createdAt: -1 }).limit(300).lean();
    if (docs.length) return { isSample: false, items: docs.map(serializeMedia) };
  } catch { /* fall through */ }
  return {
    isSample: true,
    items: SAMPLE_GALLERY.map(([h, category], k) => ({ id: `sample-${k}`, title: `${category} event by Elegant Events`, type: 'photo', category, src: null, thumb: null, img: k, h })),
  };
}

export async function getFeatured(limit = 7) {
  try {
    await connectDB();
    let docs = await Media.find({ visible: true, type: 'photo', featured: true }).sort({ createdAt: -1 }).limit(limit).lean();
    if (docs.length < limit) {
      const more = await Media.find({ visible: true, type: 'photo', _id: { $nin: docs.map((d) => d._id) } }).sort({ createdAt: -1 }).limit(limit - docs.length).lean();
      docs = docs.concat(more);
    }
    if (docs.length >= 4) return docs.map(serializeMedia);
  } catch { /* fall through */ }
  return null;
}

// Home and About page text and images (Admin > Pages). `images` maps a Media id to its URLs.
export async function loadContent() {
  let data = {};
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: 'content' }).lean();
    data = doc?.data || {};
  } catch { /* defaults */ }
  const c = mergeContent(data);
  const ids = [c.home.heroImage, c.home.aboutImage1, c.home.aboutImage2, c.about.introImage].filter((x) => x && mongoose.isValidObjectId(x));
  const images = {};
  if (ids.length) {
    try {
      const docs = await Media.find({ _id: { $in: ids } }).lean();
      for (const d of docs) images[String(d._id)] = { ...mediaUrls(d), title: d.title };
    } catch { /* ignore */ }
  }
  return { ...c, images };
}
export const getContent = loadContent;

export async function getTeam() {
  try {
    await connectDB();
    const docs = await Team.find({ visible: true }).sort({ order: 1, createdAt: 1 }).populate('photo').lean();
    return docs.map((m) => ({
      id: String(m._id), name: m.name, role: m.role || '', bio: m.bio || '',
      photo: m.photo && m.photo.cloudinaryId ? mediaUrls(m.photo).thumb : null,
    }));
  } catch { return []; }
}

export async function getTestimonials() {
  try {
    await connectDB();
    const docs = await Testimonial.find({ visible: true }).sort({ order: 1, createdAt: 1 }).lean();
    return docs.map((t) => ({ id: String(t._id), quote: t.quote, name: t.name || '', eventType: t.eventType || '' }));
  } catch { return []; }
}
