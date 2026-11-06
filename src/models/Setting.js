import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'site' },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    adminPasswordHash: String,
  },
  { timestamps: true }
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
