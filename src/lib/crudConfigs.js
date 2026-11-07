import mongoose from 'mongoose';
import Team from '@/models/Team';
import Testimonial from '@/models/Testimonial';
import { mediaUrls } from './cloudinary';
import { crud } from './crud';

const s = (v, max) => String(v ?? '').trim().slice(0, max);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

export const serializeTeam = (m) => {
  const p = m.photo && typeof m.photo === 'object' && m.photo.cloudinaryId ? m.photo : null;
  return {
    id: String(m._id), name: m.name, role: m.role || '', bio: m.bio || '',
    photo: m.photo ? String(p ? p._id : m.photo) : null,
    photoThumb: p ? mediaUrls(p).thumb : null,
    visible: m.visible !== false, order: m.order || 0,
  };
};

export const teamCrud = crud({
  Model: Team,
  populate: 'photo',
  serialize: serializeTeam,
  read: (b) => {
    const name = s(b.name, 80);
    if (!name) return { error: 'Name is required' };
    return { data: { name, role: s(b.role, 80), bio: s(b.bio, 400), photo: b.photo && mongoose.isValidObjectId(b.photo) ? b.photo : null, visible: b.visible !== false, order: num(b.order) } };
  },
});

export const serializeTestimonial = (t) => ({
  id: String(t._id), quote: t.quote, name: t.name || '', eventType: t.eventType || '', visible: t.visible !== false, order: t.order || 0,
});

export const testimonialCrud = crud({
  Model: Testimonial,
  serialize: serializeTestimonial,
  read: (b) => {
    const quote = s(b.quote, 500);
    if (!quote) return { error: 'The testimonial text is required' };
    return { data: { quote, name: s(b.name, 80), eventType: s(b.eventType, 80), visible: b.visible !== false, order: num(b.order) } };
  },
});
