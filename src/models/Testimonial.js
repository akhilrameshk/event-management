import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true },
    name: { type: String, default: '' },
    eventType: { type: String, default: '' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
