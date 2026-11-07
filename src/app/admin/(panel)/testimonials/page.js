import { connectDB } from '@/lib/db';
import Testimonial from '@/models/Testimonial';
import { serializeTestimonial } from '@/lib/crudConfigs';
import TestimonialsManager from '@/components/admin/TestimonialsManager';

export const dynamic = 'force-dynamic';

export default async function Page() {
  let items = [], dbOk = true;
  try {
    await connectDB();
    items = (await Testimonial.find({}).sort({ order: 1, createdAt: 1 }).lean()).map(serializeTestimonial);
  } catch { dbOk = false; }
  return <TestimonialsManager initialItems={items} dbOk={dbOk} />;
}
