import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true },
    description: { type: String, default: '' },
    points: { type: [String], default: [] },
    coverMedia: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Work || mongoose.model('Work', WorkSchema);
