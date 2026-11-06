import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['photo', 'video'], required: true },
    category: { type: String, default: 'Weddings' },
    eventDate: Date,
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    // Stored in Cloudinary as an "authenticated" asset (original is private).
    cloudinaryId: { type: String, required: true, index: true },
    resourceType: { type: String, enum: ['image', 'video'], required: true },
    format: String,
    width: Number,
    height: Number,
    duration: Number,
    bytes: Number,
    originalName: String,
    protected: { type: Boolean, default: true },
    watermarked: { type: Boolean, default: true },
    copyrightOwner: { type: String, default: '© Elegant Events' },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
