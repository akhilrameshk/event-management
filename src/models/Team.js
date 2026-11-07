import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: '' },
    bio: { type: String, default: '' },
    photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Media' },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
